import React, { useEffect, useInsertionEffect } from "react";
import { useState } from "react";
import heartIcon from "./img/icon/heart-nofill.png";
import commentIcon from "./img/icon/comment.png";
import sendIcon from "./img/icon/send.png";
import addIcon from "./img/icon/add.png";
import redheartIcon from "./img/icon/redheart.png";
import post1 from "./img/posts/post1.png";
import close from "./img/icon/close.png";
import userImage from "./img/user.png";
import axios from "axios";
import getTimeAgoString from "../../hooks/getTimeAgoString";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TbArrowAutofitRight } from "react-icons/tb";

// const style = {
//   height: "auto",
//   width: "500px",
//   marginTop: "70px",
//   marginLeft: "180px",
// };
const userStyle = {
  fontFamily: "'Arial'",
  fontSize: "13px",
  fontWeight: "500",
  color: "black",
  cursor: "pointer",
};

export default function TestPost({ post, updatePostData }) {
  //const userId = '663f56124af70d8faa6f85ac';
  const [likeIcon, setLikeIcon] = useState(heartIcon);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [comment, setComment] = useState("");
  const [commentData, setCommentData] = useState([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const handlePostClick = (event) => {
    event.stopPropagation(); // Prevents the click from bubbling up
    console.log("TestPost was clicked");
  };
  const handleClick = () => {
    navigate(`/${userData.username}`);
  };

  const fetchUserData = async (createdBy) => {
    try {
      const response = await axios.get(`${API_URL}/api/user/${createdBy}`);
      //console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const checkLike = async (likeArray) => {
    try {
      const token = localStorage.getItem("token");
      const user_Id = await axios.post(
        `${API_URL}/api/getUserId`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log(user_Id);
      if (likeArray.includes(user_Id.data._id)) {
        setLikeIcon(redheartIcon);
      } else {
        setLikeIcon(heartIcon);
      }
    } catch (error) {
      if (error.response) {
        toast.error("Error adding like:", error.response.data.error);
      } else {
        toast.error("Cannot get to server", error.message);
        console.log(error);
      }
    }
  };

  const getUserPfp = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/user/${userId}`);
      setProfilePictures((prev) => [...prev, response.data.pfp]);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  const toggleComment = async () => {
    setIsOpen((prevState) => !prevState);

    if (
      commentData.length === 0 ||
      commentData.every((item) => Object.keys(item).length === 0)
    ) {
      const newCommentData = [];

      for (const comment of post.comments) {
        try {
          const commentUser = await fetchUserData(comment.createdBy); // Fetch user data for each comment
          // console.log(
          //   commentUser,
          //   "Fetched comment user data",
          //   comment.createdBy
          // );

          // Push the fetched data into the new array
          newCommentData.push({
            user: commentUser.username,
            pfp: commentUser.pfp,
          });
        } catch (error) {
          console.log("Error fetching comment user data");
          newCommentData.push({
            user: "Unknown",
            pfp: "../../../Server/uploads\\defaultpfp.png",
          });
        }
      }

      //console.log(newCommentData);
      setCommentData(newCommentData);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (comment.trim()) {
        postComment();
      }
    }
  };

  const toggleLike = async () => {
    //setLikeIcon(likeIcon === redheartIcon ? heartIcon : redheartIcon);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/posts/${post._id}/like`,
        {},
        {   
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updatePostData(post._id, response.data.post);
      checkLike(response.data.post.likes);
      // const user_Id = await axios.post('http://localhost:5000/api/getUserId',{},
      //     {
      //         headers: {
      //             'Authorization': `Bearer ${token}`
      //         }
      //     }
      // );
      // console.log(user_Id)
      // if(response.data.post.likes.includes(user_Id.data._id)){
      //     setLikeIcon(redheartIcon);
      // }
      // else{
      //     setLikeIcon(heartIcon);
      // }
      //setLikeIcon(likeIcon === redheartIcon ? heartIcon : redheartIcon);
    } catch (error) {
      if (error.response) {
        toast.error("Error adding like:", error.response.data.error);
      } else {
        toast.error("Cannot get to server", error.message);
        console.log(error);
      }
    }
  };

  const postComment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No credentials found");
      }
      const response = await axios.post(
        `${API_URL}/api/posts/${post._id}/comment`,
        { comment: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updatePostData(post._id, response.data.post);
      setComment("");
      toast.success("Comment Added");
      try {
        const user_Id = await axios.post(
          `${API_URL}/api/getUserId`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = await fetchUserData(user_Id.data._id);
        const newComment = {
          user: userData.username, // Assuming userData contains username
          pfp: userData.pfp, // Assuming userData contains pfp
        };

        // Update the commentData state to include the new comment
        setCommentData((prevCommentData) => [...prevCommentData, newComment]);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
      }
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData(post.createdBy);
        setUserData(userData);
        checkLike(post.likes);
      } catch (error) {
        console.error("Error fetching user data or checking likes:", error);
      }
    };
    loadUserData();
    checkLike(post.likes);
  }, [post]);

  return (
    <>
      <div className="flex justify-center items-center mt-2 mb-2 ">
        <div className="text-gray-300  bg-darkgray w-full sm:w-11/12 md:w-9/12 lg:w-2/3 max-w-2xl h-auto rounded-md border border-gray-400" onClick={handlePostClick}>
          {!isOpen ? (
            <div className="flex justify-center items-center p-2 gap-2.5">
              {userData ? ( 
                <>
                  <img
                    src={userData.pfp}
                    className="w-7 h-7 rounded-full cursor-pointer"
                    alt=""
                    onClick={handleClick}
                  />
                  <p className="cursor-pointer" onClick={handleClick} >{userData.username}</p>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col scrollbar-hide h-[34.3rem]">
              <div className="flex items-center justify-between w-full h-8">
                <h2 className="flex-grow text-center">Comments</h2>
                <img
                  src={close}
                  className="w-5 h-5 cursor-pointer mt-2 mr-2"
                  onClick={toggleComment}
                  alt="close"
                />
              </div>

              <div className="overflow-auto max-h-[550px] h-[550px] flex-grow border-t border-b border-gray-500 px-4 py-2 w-full box-border mb-2 sm:px-5 sm:py-2.5 md:max-h-[600px] lg:max-h-[650px] scrollbar-hide">
                {post.comments.length === 0 && (
                  <div className="flex justify-center items-center h-full">
                    <span className="text-white">No Comments</span>
                  </div>
                )}

                {post.comments.map((com, index) => (
                  <div
                    className="w-full flex items-start justify-start font-sans text-xs my-4"
                    key={index}
                  >
                    {commentData[index] ? (
                      <img
                        src={commentData[index].pfp}
                        onClick={handleClick}
                        className="w-10 h-10 rounded-full mr-2.5"
                        alt=""
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <img
                        src="../../../Server/uploads\\defaultpfp.png"
                        onClick={handleClick}
                        className="w-10 h-10 rounded-full mr-2.5"
                        alt=""
                        style={{ cursor: "pointer" }}
                      />
                    )}

                    <span>
                      {commentData[index] ? (
                        <p className="text-gray-300" onClick={handleClick}>
                          {commentData[index].user}
                        </p>
                      ) : (
                        <p style={userStyle} onClick={handleClick}>
                          Loading
                        </p>
                      )}
                      <p>{com.comment}</p>
                      <div className="w-38 flex items-center justify-between mt-1.25">
                        {getTimeAgoString(com.createdAt)}
                      </div>
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center">
                <img
                  src={userImage}
                  className="w-10 h-10 m-2 rounded-full ml-2"
                  alt=""
                />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow h-15 m-2 font-sans text-sm outline-none border-0 bg-transparent"
                />
              </div>
            </div>
          )}
          {!isOpen && (
            <>
              <div className="w-full relative">
                <div className="w-full h-full flex items-center justify-center overflow-hidden bg-black">
                  <img
                    src={post.image}
                    alt=""
                    className="object-cover h-80 w-auto" // Adjust height as needed
                  />
                </div>
              </div>

              <div className="w-full p-2">
                <div className="flex gap-3">
                  <img
                    src={likeIcon}
                    className="w-8 h-8 cursor-pointer"
                    alt=""
                    onClick={toggleLike}
                  />
                  <img
                    src={commentIcon}
                    className="w-8 h-8 cursor-pointer"
                    alt=""
                    onClick={toggleComment}
                  />
                  <img
                    src={sendIcon}
                    className="w-8 h-8 cursor-pointer"
                    alt=""
                  />
                </div>
                <span className="text-gray-400 flex mt-2">
                  {post.likes.length} likes
                </span>
                <p className="mt-2">{post.caption}</p>
                <span className="text-gray-400 flex mt-2">
                  {post.comments.length} comments
                </span>
                <span className="text-gray-400 flex mt-2">
                  Uploded {getTimeAgoString(post.createdAt)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
