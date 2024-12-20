import React, { useContext, useEffect, useRef, useState } from "react";
import "./styles.css";
import searchIcon from "./img/icon/search.png";
import homeIcon from "./img/icon/home.png";
import heartIcon from "./img/icon/heart-nofill.png";
import heartIconF from "./img/icon/heart-fill.png";
import commentIcon from "./img/icon/comment.png";
import sendIcon from "./img/icon/send.png";
import logout from "./img/icon/logout.png";
import addIcon from "./img/icon/add.png";
import redheartIcon from "./img/icon/redheart.png";
import logo from "../LogIn/logo.png";
import post1 from "./img/posts/post1.png";
import userImage from "./img/user.png";
import { toast, ToastContainer, useToast } from "react-toastify";
import axios from "axios";
import TestPost from "./TestPost";
import { Button, useDisclosure } from "@chakra-ui/react";
import logoutUser from "../../hooks/logout";
import { FixedSizeList as List } from "react-window";
import fetchUserData from "../../hooks/fetchUserData";
import { useNavigate } from "react-router-dom";
import CreatePost from "../CreatePost/CreatePost";
import Navbar from "./Navbar";
import getSuggestedUser from "../../hooks/getSuggestedUser";
import followUser from "../../hooks/followUser";
import unfollowUser from "../../hooks/unfollowUser";
import ConfirmBox from "../Profile/ConfirmBox";
import { DarkModeContext, postsContext, userContext } from "../../App";
import SuggestionMobile from "./SuggestionMobile";
import Footer from "../Footer/Footer";

const Feed = () => {
  const [heartIconn, setHeartIcon] = useState(redheartIcon);
  const [activityVisible, setActivityVisible] = useState(false);
  const [posts, setPosts] = useContext(postsContext);
  const [userData, setUserData] = useContext(userContext);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const [isConfrimOpen, setIsConfirmOpen] = useState(
    !sessionStorage.getItem("warning")
  );
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const toggleActivity = () => {
    setActivityVisible(!activityVisible);
    setHeartIcon(heartIconn === heartIcon ? heartIconF : heartIcon);
  };
  const handleFollowClick = async (fusername) => {
    try {
      await followUser(fusername);
      setSuggestedUsers((prevUsers) =>
        prevUsers.filter(
          (user) => user.username !== fusername
        )
      );
      fetchSuggestedUsers(3);
      toast.success(`Following ${fusername}`);
    } catch (error) {
      toast.error("Failed");
      console.error("Error following user:", error);
    }
  }
  const fetchSuggestedUsers = async (count) => {
    const token = localStorage.getItem("token");
    if(!token){
      navigate('/login');
      return;
    }
    try {
      const users = await getSuggestedUser(count);
      setSuggestedUsers(users);
    } catch (err) {
      toast.error("Failed to find suggested users");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if(!token){
        navigate('/login');
        return;
      }
      const userId = await axios.post(
        `${API_URL}/api/getUserId`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const tempUserData = await fetchUserData(userId.data._id);
      setUserData(tempUserData);
    } catch (error) {
      toast.error("Error getting user Profile");
      setUserData({
        username: "Not Found",
        bio: "Not found",
        pfp: "../../../Server/uploads\\defaultpfp.png",
      });
    }
  };
  const fetchPost = async  ()=>{
    try {
      const token = localStorage.getItem("token");
      if(!token){
        navigate('/login');
        return;
      }
      const { data } = await axios.get(`${API_URL}/api/posts?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts((prev) => (page === 1 ? data.posts : [...prev, ...data.posts]));
      setHasMore(page < data.totalPages);
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      toast.error("Session expired or invalid token, please login again!");
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      toast.error("Error occurred while processing request!");
      console.error("Error details:", error);
    }
  }
  };

  const handleClick = (username) => {
    navigate(`/${username}`);
  };

  const updatePostData = (postId, updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, ...updatedPost } : post
      )
    );
  };
  useEffect(() => {
    fetchPost();
}, [page]);
useEffect(() => {
  setPage(1);
  fetchPost();
}, [suggestedUsers]);
  useEffect(() => {
    fetchUserProfile();
    fetchSuggestedUsers(3);
  }, []);
  

useEffect(() => {
  const observer = new IntersectionObserver(
      (entries) => {
          if (entries[0].isIntersecting && hasMore) {
              setPage((prev) => prev + 1);
          }
      },
      { threshold: 1.0 }
  );

  if (loader.current) {
      observer.observe(loader.current);
  }

  return () => {
      if (loader.current) {
          observer.unobserve(loader.current);
      }
  };
}, [hasMore]);


  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-black">
          <div className="block sm:hidden mt-10 w-full">
            <SuggestionMobile users={suggestedUsers} handleFollowClick={handleFollowClick} />
          </div>
      <div className="flex flex-grow bg-white dark:bg-black sm:mt-0 md:mt-10">
        <div className="w-full lg:w-2/3 p-4 overflow-y-auto h-full">
          <div className="grid grid-cols-1">
            {posts.length === 0 && <div><p className="text-back dark:text-white">Follow other users to see posts.</p></div>}
            {posts && posts.map((post, index) => (
              <div
                key={post?._id}
                className="w-full"
                tabIndex={index}
              >
                <TestPost post={post} updatePostData={updatePostData} />
              </div>
            ))}
            {hasMore && <div ref={loader} className="h-5 bg-white dark:bg-black" />}
            {!hasMore && <p className="text-black dark:text-white">No more posts to load</p>}
          </div>
        </div>

        {/* User about section */}
        <div className=" user-about-section text-black dark:text-gray-300">
          <div className="user-info">
            {userData ? (
              <img src={userData.pfp} className="user-dp" alt="" />
            ) : (
              <img
                src={"../../../Server/uploads\\defaultpfp.png"}
                className="user-dp"
                alt=""
              />
            )}
            {userData ? (
              <div className="info-container">
                <h1 className="name">{userData.username}</h1>
                <p>{userData.bio}</p>
              </div>
            ) : (
              <div className="info-container">
                <h1 className="name">Loading</h1>
                <p>Loading</p>
              </div>
            )}
          </div>
          <h1 className="suggestion-heading">suggestions</h1>
          <div className="suggestion-container">
            {suggestedUsers?.length === 0 && <p className="text-black dark:text-white">You have lots of friends.</p>}
            {suggestedUsers &&
              suggestedUsers.map((sUser, index) => (
                <div
                  className="user-card bg-white dark:bg-darkgray"
                  key={"usercard" + index}
                >
                  <img
                    src={sUser.pfp}
                    className="user-dp cursor-pointer"
                    onClick={() => handleClick(sUser.username)}
                    alt=""
                  />
                  <p
                    className="username cursor-pointer"
                    onClick={() => handleClick(sUser.username)}
                  >
                    {sUser.username}
                  </p>
                  <button
                    className="follow-btn"
                    onClick={() => handleFollowClick(sUser.username)}
                  >
                    follow
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      {isConfrimOpen ? (
        <ConfirmBox
          handleSubmit={() => {
            sessionStorage.setItem("warning", 1);
            setIsConfirmOpen(false);
          }}
          setIsConfirmOpen={setIsConfirmOpen}
          loading={false}
          textToDisplay={
            "This is site is in development and can have security flaws. Don't upload sensitive data. Understood?"
          }
        />
      ) : null}
      <Footer/>
    </div>
  );
};

export default Feed;
