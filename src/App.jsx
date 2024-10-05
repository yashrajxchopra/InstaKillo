import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Feed from "./components/Posts/Feed"
import SignUp from "./components/SignUp/SignUp"
import Post from "./components/Posts/Post"
import CreatePost from "./components/CreatePost/CreatePost"
import Login from "./components/LogIn/Login"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import React from 'react';
import TestPost from "./components/Posts/TestPost"



function App() {
  
  return (
    <>

    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<TestPost/>} />
         <Route path="/" element={<Feed/>} />
      </Routes>
    </Router>
    <ToastContainer position="bottom-center"/>
    </>
    
  )
}

export default App
