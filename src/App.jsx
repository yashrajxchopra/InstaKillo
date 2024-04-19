import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Feed from "./components/Posts/Feed"
import Sidebar from "./components/Sidebar/Sidebar"
import SignUp from "./components/SignUp/SignUp"
import Post from "./components/Posts/Post"
import CreatePost from "./components/CreatePost/CreatePost"
import Login from "./components/LogIn/Login"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  
  return (
    <>
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<Post />} />
        <Route path="/home" element={<Sidebar />} />
        <Route path="/createpost" element={<CreatePost />} />
      </Routes>
    </Router>
    <ToastContainer position="bottom-center"/>
    </>
    
  )
}

export default App
