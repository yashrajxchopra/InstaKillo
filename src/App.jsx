import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Feed from "./components/Posts/Feed"
import SignUp from "./components/SignUp/SignUp"
import CreatePost from "./components/CreatePost/CreatePost"
import Login from "./components/LogIn/Login"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import React, { createContext, useState } from 'react';
import TestPost from "./components/Posts/TestPost"
import Profile from "./components/Profile/Profile"

export const userContext = createContext();
export const DarkModeContext = createContext();

function App() {
  const [userData, setUserData] = useState();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  return (
    <>
   <userContext.Provider value={[userData, setUserData]}>
   <DarkModeContext.Provider value={[isDarkMode, setIsDarkMode]}>
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<TestPost/>} />
        <Route path="/" element={<Feed/>} />
        <Route path="/:username" element={<Profile/>} />
      </Routes>
    </Router>
    <ToastContainer position="bottom-center"/>
    </DarkModeContext.Provider>
    </userContext.Provider>
    </>
    
  )
}

export default App
