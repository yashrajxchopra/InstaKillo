import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Feed from "./components/Posts/Feed";
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/LogIn/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import React, { createContext, useEffect, useState } from "react";
import TestPost from "./components/Posts/TestPost";
import Profile from "./components/Profile/Profile";
import Navbar from "./components/Posts/Navbar"; // Adjust path if necessary
import CreatePost from "./components/CreatePost/CreatePost";
import SinglePost from "./components/Posts/SinglePost";

export const userContext = createContext();
export const DarkModeContext = createContext();
export const createModalContext = createContext();
export const postsContext = createContext([]);
export const userPostsContext = createContext([]);


function Layout({ children, userData, createModal}) {
  const location = useLocation();

  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && (
        <div className="navbar">
          <Navbar username={userData?.isProfileOwner ? userData.username : "#"} />
          {createModal && <CreatePost addNewCreatedPost={()=>{}}/>}
        </div>
      )}
      {children} {/* Render route content */}
    </>
  );
}

function App() {
  const [userData, setUserData] = useState(null); 
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [createModal, setCreateModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const darkThemePreference = localStorage.getItem("theme") === "dark";
    setIsDarkMode(darkThemePreference);
    document.documentElement.classList.toggle("dark", darkThemePreference);
  }, []);

  return (
    <userContext.Provider value={[userData, setUserData]}>
      <DarkModeContext.Provider value={[isDarkMode, setIsDarkMode]}>
        <createModalContext.Provider value={[createModal, setCreateModal]}>
          <postsContext.Provider value={[posts, setPosts]}>
            <userPostsContext.Provider value={[userPosts, setUserPosts]}>
              <Router>
                <Layout userData={userData} createModal={createModal}>
                  <Routes>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/post/:postId" element={<SinglePost />} />
                    <Route path="/" element={<Feed />} />
                    <Route path="/:username" element={<Profile />} />
                  </Routes>
                </Layout>
              </Router>
            <ToastContainer position="bottom-center" />
            </userPostsContext.Provider>
          </postsContext.Provider>
        </createModalContext.Provider>
      </DarkModeContext.Provider>
    </userContext.Provider>
  );
}

export default App;
