let express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const admin = require("firebase-admin");
const {
  generateToken,
  authenticateToken,
  tokenDecoder,
  verifyToken,
} = require("./jwtUtils");
const { error } = require("console");
require("dotenv").config();
const fs = require("fs");

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

// Multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + generateRandomString();
//     const originalExtension = path.extname(file.originalname);
//     const uniqueFileName =
//       file.fieldname + "-" + uniqueSuffix + originalExtension;
//     cb(null, uniqueFileName);
//   },
// });
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

          stream.end(req.file.buffer);
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

      res.status(200).json({ message: "Post added successfully", post: newPost });
    } catch (err) {
      console.error("Error in POST /api/posts:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

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
app.post("/api/posts/:postId/comment", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { comment } = req.body;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token || !comment)
      return res.status(401).json({ message: "No token provided" });
    if (!verifyToken(token)) {
      return res.status(401).json({ error: "Invalid Token" });
    }
    const post = await Post.findById(postId);
    const userInfo = tokenDecoder(token);
    const createdBy = userInfo.userId;

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({ comment, createdBy, createdAt: Date.now() });

    await post.save();

    res.status(200).json({ message: "Comment added successfully", post });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: err.message });
  }
});
//Get All Posts
app.get("/api/posts", authenticateToken, async (req, res) => {
  //console.log(req.user)
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).exec();
    res.status(200).json(posts);
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
    if(count > 10){
      count = 10;
    }
    const userId = req.user.userId;

    try {
      const currentUser = await User.findById(userId).populate('following', '_id').select("following");
      const userObjectId = new mongoose.Types.ObjectId(userId);
      // Convert currentUser.following from strings to ObjectId
      const followingIds = currentUser.following.map(f => new mongoose.Types.ObjectId(f));
      const users = await User.aggregate([
        { $match: { _id: { $nin: [...followingIds, userObjectId] } } },  
        { $sample: { size: Number(count) } },
        { $project: { username: 1, pfp: 1 } }
      ]);
      return res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
//follow user
app.post('/api/follow/:username', authenticateToken, async (req, res) =>{
  const { username } = req.params;
  const userId = req.user.userId;
  try {
    const currentUser = await User.findById(userId).select('following');

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userToFollow = await User.findOne({ username }).select('_id followers');

    if (!userToFollow) {
      return res.status(404).json({ message: 'User to follow not found' });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: 'You are already following this user' });
    }
    
    currentUser.following.push(userToFollow._id);

    if (!userToFollow.followers.includes(currentUser._id)) {
      userToFollow.followers.push(currentUser._id); 
    }

    await currentUser.save();
    await userToFollow.save();

    return res.status(200).json({ message: `You are now following ${username}` });
  } catch (error) {
    console.error('Error following user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

});
//unfollow user
app.post('/api/unfollow/:username', authenticateToken, async (req, res) => {
  const { username } = req.params;
  const userId = req.user.userId;

  try {
    const currentUser = await User.findById(userId).select('following');
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userToUnfollow = await User.findOne({ username }).select('_id followers');
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User to unfollow not found' });
    }

    // Check if the current user is following the user to unfollow
    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ message: 'You are not following this user' });
    }

    // Remove userToUnfollow from currentUser's following list
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    );

    // Remove currentUser's ID from userToUnfollow's followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    return res.status(200).json({ message: `You have unfollowed ${username}` });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//fecth user profile
app.get("/api/profile/:username",authenticateToken, async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({username});

    if (user) {
      const { username, bio, pfp, posts, followers, following } = user;
      res.json({ username, bio, pfp, posts, followers, following });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
//checkIfFollowing
app.get("/api/checkIfFollowing/:username", authenticateToken, async (req, res) => {
const userId = req.user.userId;
const { username } = req.params;
try {
  const currentUser = await User.findById(userId).select('following');
  if (!currentUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userToCheck = await User.findOne({ username }).select('_id followers');
  if (!userToCheck) {
    return res.status(404).json({ message: 'User to unfollow not found' });
  }

  if (!currentUser.following.includes(userToCheck._id)) {
    return res.status(200).json({ message: 'False' });
  }

  return res.status(200).json({ message: `True` });
} catch (error) {
  console.error('Error  in Checking:', error);
  return res.status(500).json({ message: 'Internal Server Error' });
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
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
