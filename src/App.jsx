import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Feed from "./components/Posts/Feed"
import SignUp from "./components/SignUp/SignUp"
import Post from "./components/Posts/Post"
import CreatePost from "./components/CreatePost/CreatePost"
import Login from "./components/LogIn/Login"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Test from "./test";


function App() {
  const dummyPost = {
    createdBy: "John Doe",
    createdAt: new Date(),
    caption: "This is a dummy post for testing",
    image: "https://via.placeholder.com/400",
    comments: [
      {
        createdBy: "Jane Smith",
        comment: "Nice post!",
        createdAt: Date.now() - 100000 // Example timestamp
      },
      {
        createdBy: "YC",
        comment: "Yup!",
        createdAt: Date.now() - 200000 // Example timestamp
      },
      {
        createdBy: "Alice Johnson",
        comment: "Great work!",
        createdAt: Date.now() - 200000 // Example timestamp
      }
    ],
    likes: ["Emily Brown", "Michael Johnson", "John Doe"]
  };

  
  return (
    <>
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<Post post={dummyPost}/>} />
        <Route path="/" element={<Feed/>} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/test" element={<Test post={dummyPost}/>} />
      </Routes>
    </Router>
    <ToastContainer position="bottom-center"/>
    </>
    
  )
}

export default App
