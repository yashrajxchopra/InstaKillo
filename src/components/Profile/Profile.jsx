import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import fetchUserProfile from "../../hooks/fetchUserProfile";
import fetchUserData from "../../hooks/fetchUserData"; 
import defaultpfp from "../../../Server/uploads/defaultpfp.png";
import fetchPostData from "../../hooks/fetchPostData";
import TestPost from "../Posts/TestPost";
import Navbar from "../Posts/Navbar";
import CreatePost from "../CreatePost/CreatePost";
import { toast } from "react-toastify";
import unfollowUser from "../../hooks/unfollowUser";
import followUser from "../../hooks/followUser";
import checkIfFollowing from "../../hooks/checkIfFollowing";
import ProfileEditor from "./ProfileEditor";
import deletePostById from "../../hooks/deletePostById";
import ConfirmBox from "./ConfirmBox";
import { DarkModeContext } from "../../App";

function Profile() {
  const [userData, setUserData] = useState({
    username: "",
    bio: "",
    pfp: "",
    posts: [],
    followers: [],
    following: [],
    isProfileOwner: false,
  });
  const { username } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersDetails, setFollowersDetails] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const [errorP, setErrorP] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isDarkMode, setIsDarkMode] = useContext(DarkModeContext);
  const openModal = () => setCreateModal(true);
  const closeModal = () => setCreateModal(false);
  let count = 0;
  let clickedPost;
  const handleImageClick = (post) => {
    if (!/Mobi|Android/i.test(navigator.userAgent)) 
      {
        setSelectedPost(post);
      }
      if (count===1) {
        if (clickedPost._id == post._id) {
          setSelectedPost(post);
        }
        count = 0;
      }
      clickedPost = structuredClone(post);
      count++;
  };
  const handleClickOnOpenedPost = (event) => {
    setSelectedPost(null);
  };
  const handleClickOnX = async (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const updatePostDataPofile = (postId, updatedPost) => {
    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, ...updatedPost } : post
      )
    );
    setSelectedPost(updatedPost);
  };

  const handleCloseModal = () => setSelectedPost(null);

  const handleDelete = async () => {
    setLoading(true);
    console.log(deleteId);
    try {
      const response = await deletePostById(deleteId);
      if (response.message == "Post deleted successfully.") {
        setIsConfirmOpen(false);
        setLoading(false);
        setUserPosts((prevUsers) =>
          prevUsers.filter((user) => user._id !== deleteId)
        );
        toast.success("Post deleted.");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setIsConfirmOpen(false);
      toast.error("Deletion Failed");
    }
  };

  const fetchProfile = async () => {
    try {
      const tempData = await fetchUserProfile(username);
      setUserData(tempData);
    } catch (error) {
      if (error.message === "User not found") {
        setErrorP(error.message);
      } else {
        setErrorP("Something Went Wrong");
      }
    }
  };

  const fetchPosts = async () => {
    if(userData?.posts.length === 0){
      setUserPosts([]);
      return;
    }
    if (Array.isArray(userData.posts) && userData.posts.length > 0) {
      try {
        const postsData = await Promise.all(
          userData.posts.map((postId) => fetchPostData(postId))
        );
        const validPosts = postsData.filter((post) => post);
        setUserPosts(validPosts);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    }
  };

  const fetchFollowersDetails = async () => {
    const followersData = await Promise.all(
      userData.followers.map((id) => fetchUserData(id))
    );
    setFollowersDetails(followersData);
    setShowFollowersModal(true);
  };

  const fetchFollowingDetails = async () => {
    const followingData = await Promise.all(
      userData.following.map((id) => fetchUserData(id))
    );
    setFollowingDetails(followingData);
    setShowFollowingModal(true);
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);
  useEffect(() => {
    if (userData?.username) {
      fetchPosts();
    }
  }, [username, userData]);
  useEffect(() => {
    const darkThemePreference = localStorage.getItem("theme") === "dark"

    setIsDarkMode(darkThemePreference);
    document.documentElement.classList.toggle("dark", darkThemePreference);
  }, []);


  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="navbar">
        <Navbar openModal={openModal} username={userData && userData.isProfileOwner ? userData.username:'#'}/>
      </div>
      {createModal && <CreatePost closeModal={closeModal} />}

      {errorP ? (
        <div className="flex flex-col h-full p-6 mt-10 bg-white dark:bg-black justify-center items-center">
          <p className="mt-20 text-center bg-white dark:bg-black text-xl sm:text-5xl">
            {errorP}
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6 mt-10">
          <div className="flex flex-row items-center space-x-8 mb-8">
            <div className="w-24 h-24 md:w-36 md:h-36 sm:w-24 rounded-full overflow-hidden border-4 border-fray-500 dark:border-gray-700 flex-shrink-0">
              <img
                src={userData ? userData.pfp : defaultpfp}
                alt={`${userData.username}'s profile picture`}
                className="object-cover w-full h-full"
              />
            </div>
              <div className="flex flex-col">
                {!userData?.isProfileOwner && <div className="w-full"></div>}
              <h2 className="text-3xl font-bold h-min">{userData.username}</h2>
              <p className="text-black dark:text-gray-400 mt-2">{userData.bio}</p>
              
              
              {userData?.isProfileOwner && (
                <div>
                  <button
                  onClick={() => setIsEditorOpen(true)}
                  className="text-blue-500"
                >
                  Edit Profile
                </button>
                </div>
              )}
              {isEditorOpen && (
                <ProfileEditor
                  setIsEditorOpen={setIsEditorOpen}
                  profile={userData}
                  setProfileData={setUserData}
                />
              )}
              <div className="flex mt-4 space-x-4">
              
                <button
                  onClick={fetchFollowersDetails}
                  className="text-blue-500"
                >
                  Followers: {userData.followers.length}
                </button>
                <button
                  onClick={fetchFollowingDetails}
                  className="text-blue-500"
                >
                  Following: {userData.following.length}
                </button>
                {!userData.isProfileOwner && 
                    <UserListItem
              key='profile'
              user={userData}
            />
              }
              </div>
            </div>
          </div>
           
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {userPosts.slice().reverse().map((post, index) => (
              <div
                key={post._id}
                className="relative w-full h-40 md:h-60 overflow-hidden bg-gray-800 group"
              >
                <img
                  src={post.image || defaultpfp}
                  alt={`Post ${post._id}`}
                  className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => handleImageClick(post)}
                />
                {userData.isProfileOwner && (
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white px-1 py-1 sm:px-2 sm:py-2 rounded-full hover:bg-red-700 transition duration-300 opacity-0 group-hover:opacity-100 focus-within:opacity-100"
                    onClick={() => handleClickOnX(post._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          {userPosts.length === 0 && (
            <p className="text-center text-xl">No Posts Yet</p>
          )}
        </div>
      )}

      {showFollowersModal && (
        <Modal title="Followers" onClose={() => setShowFollowersModal(false)}>
          {followersDetails.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              closeModal={setShowFollowersModal}
            />
          ))}
          {followersDetails.length === 0 && (
            <p className="text-center text-gray-300">No Followers</p>
          )}
        </Modal>
      )}

      {showFollowingModal && (
        <Modal title="Following" onClose={() => setShowFollowingModal(false)}>
          {followingDetails.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              closeModal={setShowFollowingModal}
            />
          ))}
          {followingDetails.length === 0 && (
            <p className="text-center text-gray-300">No Followings</p>
          )}
        </Modal>
      )}

      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50" onClick={handleClickOnOpenedPost}>
          <div className="p-4 rounded-lg shadow-lg max-w-3xl w-full mx-4">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="w-full">
              <TestPost
                post={selectedPost}
                updatePostData={updatePostDataPofile}
              />
            </div>
          </div>
        </div>
      )}
      {isConfirmOpen && (
        <ConfirmBox
          handleSubmit={handleDelete}
          setIsConfirmOpen={setIsConfirmOpen}
          loading={loading}
          textToDisplay={"Confirm Delete?"}
        />
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="border-black fixed inset-0 bg-white dark:bg-black bg-opacity-50 flex items-center justify-center z-50 mr-5 ml-5 ">
      <div className="bg-white dark:bg-darkgray text-black rounded-lg p-4 w-full max-w-lg ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-black dark:text-white font-semibold">{title}</h2>
          <button onClick={onClose} className="text-black dark:text-white">
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function UserListItem({ user, closeModal }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const handleUserClick = () => {
    if(!(closeModal === undefined)){
      closeModal(false);
    }
    navigate(`/${user.username}`);
  };

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const isUserFollowing = await checkIfFollowing(user.username);
        setIsFollowing(isUserFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };
    fetchFollowStatus();
  }, [user.username]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(user.username);
        toast.success(`Unfollowed ${user.username}`);
      } else {
        await followUser(user.username);
        toast.success(`Following ${user.username}`);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error(
        `Error ${isFollowing ? "unfollowing" : "following"} user:`,
        error
      );
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <div className="flex items-center space-x-4 py-2 sm:space-x-6 sm:py-3">
    {!(closeModal === undefined) && 
    <>
      <img
      src={user?.pfp || defaultpfp}
      alt={user?.username}
      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer"
      onClick={handleUserClick}
    />
    <div className="flex-1">
      <span
        className="block w-24 text-black dark:text-gray-300 sm:w-32 truncate cursor-pointer"
        onClick={handleUserClick}
      >
        {user?.username}
      </span>
    </div>
    </>
    }  
        <button
          onClick={handleFollowToggle}
          className={`px-3 py-1 text-sm rounded ${
            isFollowing ? "bg-red-500 text-white" : "bg-blue-500 text-white"
          } sm:px-4`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
