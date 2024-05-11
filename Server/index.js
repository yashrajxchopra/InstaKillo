let express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { generateToken, authenticateToken, tokenDecoder } = require('./jwtUtils');


const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 15);
}



mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/mongoDb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();

app.use(cors());

app.use(bodyParser.json());

const UserSchema = new mongoose.Schema({
  bio: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  followers: {
    type: [String],
    default: []
  },
  following: {
    type: [String],
    default: []
  },
  fullName: {
    type: String,
    required: true
  },
  posts: {
    type: [String],
    default: []
  },
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
  });

const User = mongoose.model('User', UserSchema);


// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + generateRandomString(); 
    const originalExtension = path.extname(file.originalname); 
    const uniqueFileName = file.fieldname + '-' + uniqueSuffix + originalExtension; 
    cb(null, uniqueFileName);
  }
});
const upload = multer({ storage: storage });


const PostSchema = new mongoose.Schema({
    caption: { type: String},
    createdBy: { type: String, required: true }, 
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    comments: [{
      comment: String,
      createdAt: Number,
      createdBy: String
  }],
  likes: [String]
  });
  
const Post = mongoose.model('Posts', PostSchema);

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;
     bio = ''
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      fullName,
      bio
    });

    await newUser.save();

    res.status(200).json({ message: 'User created successfully', user: newUser });
    res.redirect('/login');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  });

// User login endpoint
app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
      const token = generateToken(user);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Create post endpoint
app.post('/api/posts',authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { caption, createdBy, image, comments, likes } = req.body;
    const imagePath = req.file ? path.join('uploads', req.file.filename) : null;
    
    const newPost = new Post({
      caption,
      createdBy,
      image: imagePath,
      comments,
      likes
    });

    
    await newPost.save();
    console.log(req.user._id+"  " +newPost._id )
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.posts.push(newPost._id);
    await user.save();

    res.status(200).json({ message: 'Post added successfully', post: newPost });
    
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  });
  //like the post
  app.post('/api/posts/:postId/like', async (req, res) => {
    try {
      const postId = req.params.postId;
  
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const userIndex = post.likes.indexOf(req.body.userId);
      if (userIndex !== -1) {
        // User has already liked the post, remove the like
        post.likes.splice(userIndex, 1);
      } else {
        // User hasn't liked the post, add the like
        post.likes.push(req.body.userId);
      }

  
      await post.save();
  
      res.status(200).json({ message: 'Like added successfully', post });
    } catch (err) {
      console.error('Error adding like:', err);
      res.status(500).json({ error: err.message });
    }
  });
  
  // add a comment to a post
  app.post('/api/posts/:postId/comment', async (req, res) => {
    try {
      const postId = req.params.postId;
      const { comment, createdBy } = req.body;
  
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      post.comments.push({ comment, createdBy, createdAt: Date.now() });
  
      await post.save();
  
      res.status(200).json({ message: 'Comment added successfully', post });
    } catch (err) {
      console.error('Error adding comment:', err);
      res.status(500).json({ error: err.message });
    }
  });
//Get All Posts
app.get('/api/posts', async (req, res) => {
    try {
      const posts = await Post.find().exec(); 
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
//Get Single Post
app.get('/api/posts/:id' , async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); 
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  });

  // Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});