import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Feed from "./components/Posts/Feed"
import Sidebar from "./components/Sidebar/Sidebar"
import SignUp from "./components/SignUp/SignUp"
import Post from "./components/Posts/Post"
import CreatePost from "./components/CreatePost/CreatePost"
import Login from "./components/LogIn/Login"

function App() {

  
  return (
    <>
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<Post />} />
        <Route path="/createpost" element={<CreatePost />} />
      </Routes>
    </Router>
    </>
    
  )
}

export default App
