let express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const admin = require("firebase-admin");
const sharp = require('sharp');

const {
  generateToken,
  authenticateToken,
  tokenDecoder,
  verifyToken,
} = require("./jwtUtils");
const { error, log } = require("console");
require("dotenv").config();
const fs = require("fs");

const PORT = 5000;

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 15);
};

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "instakillo-image-storage.appspot.com",
});
const bucket = admin.storage().bucket();
const app = express();


async function deleteFileFromUrl(imageUrl) {
  const filePath =
    "images/" + decodeURIComponent(imageUrl.split("/").pop().split("?")[0]);
  try {
    await bucket.file(filePath).delete();
  } catch (error) {
    console.log(error);
  }
}

app.use(cors());

app.use(bodyParser.json());

const UserSchema = new mongoose.Schema({
  bio: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  followers: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
  fullName: {
    type: String,
    required: true,
  },
  posts: {
    type: [String],
    default: [],
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pfp: { type: String },
});

const User = mongoose.model("User", UserSchema);


const upload = multer({ storage: multer.memoryStorage() });

const PostSchema = new mongoose.Schema({
  caption: { type: String },
  createdBy: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      comment: String,
      createdAt: Number,
      createdBy: String,
    },
  ],
  likes: [String],
});

const NotificationSchema = new mongoose.Schema({
  type: { type: String, enum: ["comment", "follow", "like"], required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who triggered the notification
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who will receive the notification
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: false }, // For comment notifications
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", NotificationSchema);

const Post = mongoose.model("Posts", PostSchema);
//register user
app.post("/api/register", async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;

    if (!username || !password || !email || !fullName) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username is already in use." });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email is already in use." });
      }
    }

    bio = "";
    const profileImagePath = "../../../Server/uploads\\defaultpfp.png";

    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      fullName,
      bio,
      pfp: profileImagePath,
    });

    await newUser.save();

    res
      .status(200)
      .json({ message: "User created successfully.", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(402).json({ error: "No Input" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = generateToken(user);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create post endpoint
app.post(
  "/api/posts",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      const allowedExtensions = ["jpg", "jpeg", "png"];

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const originalFileName = req.file.originalname;
      const fileExtension = originalFileName.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ error: "Invalid image format" });
      }

      const fileName = `${Date.now()}-${generateRandomString()}.${fileExtension}`;

      let imageBuffer = req.file.buffer;
      if (req.body.compression === "true") {
        try {
          imageBuffer = await sharp(req.file.buffer)
            .jpeg({ quality: 70 }) 
            .toBuffer();
        } catch (compressionError) {
          console.error("Error compressing image:", compressionError);
          return res.status(500).send("Error compressing image");
        }
      }

      const uploadImage = () => {
        return new Promise((resolve, reject) => {
          const fileUpload = bucket.file(`images/${fileName}`);
          const stream = fileUpload.createWriteStream({
            metadata: {
              contentType: req.file.mimetype,
            },
          });

          stream.on("error", (err) => {
            console.error("Error uploading to Firebase:", err);
            reject(err);
          });

          stream.on("finish", async () => {
            await fileUpload.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/images/${fileName}`;
            resolve(publicUrl);
          });

          stream.end(imageBuffer);
        });
      };

      let imagePath;
      try {
        imagePath = await uploadImage();
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(500).send("Error uploading image");
      }

      const newPost = new Post({
        caption: req.body.caption,
        createdBy: userId,
        image: imagePath,
        comments: [],
        likes: [],
      });

      await newPost.save();

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.posts.push(newPost._id);
      await user.save();

      res
        .status(200)
        .json({ message: "Post added successfully", post: newPost });
    } catch (err) {
      console.error("Error in POST /api/posts:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// delete a post by _id
app.delete("/api/posts/:id", authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (deletedPost.image.includes("googleapis")) {
      await deleteFileFromUrl(deletedPost.image);
    }

    res
      .status(200)
      .json({ message: "Post deleted successfully.", deletedPost });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});
//like the post
app.post("/api/posts/:postId/like", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userIndex = post.likes.indexOf(userId);
    if (userIndex !== -1) {
      // User has already liked the post, remove the like
      post.likes.splice(userIndex, 1);
    } else {
      // User hasn't liked the post, add the like
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({ message: "Like added successfully", post: post });
  } catch (err) {
    console.error("Error adding like:", err);
    res.status(500).json({ error: err.message });
  }
});

// add a comment to a post
app.post("/api/posts/:postId/comment", authenticateToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    const { comment } = req.body;
    
    const post = await Post.findById(postId);
    const createdBy = req.user.userId;

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({ comment, createdBy, createdAt: Date.now() });

    // Create a notification for the post owner
    if (createdBy !== post.createdBy) {
      const user = await User.findById(new mongoose.Types.ObjectId(createdBy), "username _id");
      const notification = new Notification({
        type: "comment",
        sender: user._id,
        receiver: post.createdBy,
        post: post._id,
        message: `${user.username} commented on your post.`,
      });
      await notification.save();
    }

    await post.save();

    res.status(200).json({ message: "Comment added successfully", post });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: err.message });
  }
});
//Get All Posts
app.get("/api/posts", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const following = user.following;

    if (following.length === 0) {
      return res.status(200).json({ posts: [], message: "No users followed yet" });
    }

    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;
    const posts = await Post.find({ createdBy:  {$in: [...following, user._id ]} }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
    const totalPosts = await Post.countDocuments();
    res.status(200).json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//Get Single Post
app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to retrieve username, bio and pfp from _id
app.get("/api/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (user) {
      const { username, bio, pfp } = user;
      res.json({ username, bio, pfp });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
//autologin
app.post("/api/NoInputLogin", authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log("error");
  }
});
//get userId from token
app.post("/api/getUserId", authenticateToken, (req, res) => {
  try {
    const _id = req.user.userId;
    //console.log(_id)
    return res.json({ _id });
  } catch (err) {
    return res.status(400).json({ error: "Error occured" });
  }
});

// Route to get users not followed by the current user
app.get(
  "/api/getSuggestedUsers/:count",
  authenticateToken,
  async (req, res) => {
    let { count } = req.params;
    if (count > 10) {
      count = 10;
    }
    const userId = req.user.userId;

    try {
      const currentUser = await User.findById(userId)
        .populate("following", "_id")
        .select("following");
      const userObjectId = new mongoose.Types.ObjectId(userId);
      // Convert currentUser.following from strings to ObjectId
      const followingIds = currentUser.following.map(
        (f) => new mongoose.Types.ObjectId(f)
      );
      const users = await User.aggregate([
        { $match: { _id: { $nin: [...followingIds, userObjectId] } } },
        { $sample: { size: Number(count) } },
        { $project: { username: 1, pfp: 1 } },
      ]);
      return res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
//follow user
app.post("/api/follow/:username", authenticateToken, async (req, res) => {
  const { username } = req.params;
  const userId = req.user.userId;
  try {
    const currentUser = await User.findById(userId).select("following username");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userToFollow = await User.findOne({ username }).select(
      "_id followers"
    );

    if (!userToFollow) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    currentUser.following.push(userToFollow._id);

    if (!userToFollow.followers.includes(currentUser._id)) {
      userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();
    
    // Create a notification for the user being followed
    try{
    const notification = new Notification({
      type: "follow",
      sender: userId,
      receiver: userToFollow._id,
      message: `${currentUser.username} started following you.`,
    });
    await notification.save();

    
  }
    catch(error){console.log(error)}

    return res
      .status(200)
      .json({ message: `You are now following ${username}` });
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
//unfollow user
app.post("/api/unfollow/:username", authenticateToken, async (req, res) => {
  const { username } = req.params;
  const userId = req.user.userId;

  try {
    const currentUser = await User.findById(userId).select("following");
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userToUnfollow = await User.findOne({ username }).select(
      "_id followers"
    );
    if (!userToUnfollow) {
      return res.status(404).json({ message: "User to unfollow not found" });
    }

    // Check if the current user is following the user to unfollow
    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    // Remove userToUnfollow from currentUser's following list
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );

    // Remove currentUser's ID from userToUnfollow's followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    return res.status(200).json({ message: `You have unfollowed ${username}` });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//fecth user profile
app.get("/api/profile/:username", authenticateToken, async (req, res) => {
  const username = req.params.username;
  const userId = req.user.userId;
  let isProfileOwner = false;

  try {
    const user = await User.findOne({ username });

    if (user) {
      const { username, bio, pfp, posts, followers, following } = user;
      if (userId == user._id) isProfileOwner = true;
      res.json({
        username,
        bio,
        pfp,
        posts,
        followers,
        following,
        isProfileOwner,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
//checkIfFollowing
app.get(
  "/api/checkIfFollowing/:username",
  authenticateToken,
  async (req, res) => {
    const userId = req.user.userId;
    const { username } = req.params;
    try {
      const currentUser = await User.findById(userId).select("following");
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const userToCheck = await User.findOne({ username }).select(
        "_id followers"
      );
      if (!userToCheck) {
        return res.status(404).json({ message: "User to unfollow not found" });
      }

      if (!currentUser.following.includes(userToCheck._id)) {
        return res.status(200).json({ message: "False" });
      }

      return res.status(200).json({ message: `True` });
    } catch (error) {
      console.error("Error  in Checking:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
app.post(
  "/api/editprofile",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const uploadImage = (fileName) => {
      return new Promise((resolve, reject) => {
        const fileUpload = bucket.file(`images/${fileName}`);
        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });

        stream.on("error", (err) => {
          console.log("Error uploading to Firebase:", err);
          reject(err);
        });

        stream.on("finish", async () => {
          await fileUpload.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/images/${fileName}`;
          resolve(publicUrl);
        });

        stream.end(req.file.buffer);
      });
    };

    try {
      if (!req.body.username)
        return res.status(404).json({ error: "Username cannot be empty." });
      const userId = req.user.userId;
      const newBio = req.body.bio;
      const newUsername = req.body.username;
      if(newUsername.length > 20 || newBio.length > 100){
        return res.status(403).json({ error: "Username or Bio length exceeded limit." });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      const isBioChanged = newBio && newBio !== user.bio;
      const isUsernameChanged = newUsername && newUsername !== user.username;
      if (!isBioChanged && !isUsernameChanged && !req.file) {
        return res.status(200).json({ message: "No changes to update." });
      }
      if (isBioChanged) user.bio = newBio;
      if (isUsernameChanged) {
        const username = newUsername;
        const existingUser = await User.findOne({
          $or: [{ username }],
        });

        if (existingUser) {
          if (existingUser.username === newUsername) {
            return res
              .status(400)
              .json({ error: "Username is already in use." });
          }
        }
        user.username = newUsername;
      }
      let imagePath;
      if (req.file) {
        if (user.pfp.includes("googleapis")) {
          await deleteFileFromUrl(user.pfp);
        }
        const originalFileName = req.file.originalname;
        const fileExtension = originalFileName.split(".").pop().toLowerCase();
        const allowedExtensions = ["jpg", "jpeg", "png"];
        if (!allowedExtensions.includes(fileExtension)) {
          return res.status(400).json({ error: "Invalid image format" });
        }
        const fileName = `${Date.now()}-${generateRandomString()}.${fileExtension}`;
        try {
          imagePath = await uploadImage(fileName);
          user.pfp = imagePath;
        } catch (uploadError) {
          console.log("Error uploading image:", uploadError);
          return res.status(500).send("Error uploading image");
        }
      }
      await user.save();
      const isProfileOwner = true;
      const { username, bio, pfp, posts, followers, following } = user;
      res.json({
        username,
        bio,
        pfp,
        posts,
        followers,
        following,
        isProfileOwner,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

//get search result
app.get('/api/search', authenticateToken, async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const users = await User.aggregate([
      {
        $match: {
          username: { $regex: query, $options: 'i' }
        }
      },
      {
        $addFields: {
          matchScore: {
            $cond: { 
              if: { $eq: [ { $substr: ["$username", 0, query.length] }, query ] }, 
              then: 1, 
              else: 0 
            }
          }
        }
      },
      {
        $sort: { matchScore: -1, username: 1 } 
      },
      {
        $limit: 5
      },
      {
        $project: { username: 1, pfp: 1 } 
      }
    ]);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Mark notifications as read
app.put("/api/notification/read/:id", authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ notification });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" });
  }
});

//Get Notifications
app.get("/api/getNotifications", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 5; 
    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ receiver: { $in: user._id } }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
    const totalNotifications = await Notification.countDocuments();
    res.status(200).json({
      notifications,
      totalPages: Math.ceil(totalNotifications / limit),
      currentPage: page,
  });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});
//test
app.get("/api/test", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Page</title>
    </head>
    <body>
        <h1>Hello, World!</h1>
        <p>This is a test page served by Express.js.</p>
    </body>
    </html>
  `);
});

// Start the server

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


