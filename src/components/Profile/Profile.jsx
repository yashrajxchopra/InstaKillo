import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import fetchUserProfile from '../../hooks/fetchUserProfile';
import fetchUserData from '../../hooks/fetchUserData'; // Assume this hook exists
import defaultpfp from '../../../Server/uploads/defaultpfp.png';
import fetchPostData from '../../hooks/fetchPostData';
import TestPost from '../Posts/TestPost';
import Navbar from '../Posts/Navbar';
import CreatePost from '../CreatePost/CreatePost';
import { toast } from 'react-toastify';
import unfollowUser from '../../hooks/unfollowUser';
import followUser from '../../hooks/followUser';
import checkIfFollowing from '../../hooks/checkIfFollowing';

function Profile() {
  const [userData, setUserData] = useState({
    username: '',
    bio: '',
    pfp: '',
    posts: [],
    followers: [],
    following: []
  });
  const { username } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersDetails, setFollowersDetails] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const [errorP, setErrorP] = useState('');
  const openModal = () => setCreateModal(true);
  const closeModal = () => setCreateModal(false);

  const updatePostDataPofile = (postId, updatedPost) => {
    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, ...updatedPost } : post
      )
    );
    setSelectedPost(updatedPost);
  };

  const handlePostClick = (post) => setSelectedPost(post);

  const handleCloseModal = () => setSelectedPost(null);

  const fetchProfile = async () => {
    try{
      const tempData = await fetchUserProfile(username);
      setUserData(tempData);
    }
    catch (error) {
      if (error.message === "User not found") {
        setErrorP(error.message);
      } else {
        setErrorP("Something Went Wrong");
      }
    }
  };

  const fetchPosts = async () => {
    if (Array.isArray(userData.posts) && userData.posts.length > 0) {
      try {
        const postsData = await Promise.all(
          userData.posts.map((postId) => fetchPostData(postId))
        );
        const validPosts = postsData.filter(post => post);
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
    if (userData.username) {
      fetchPosts();
    }
  }, [userData]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="navbar">
        <Navbar openModal={openModal} />
      </div>
      {createModal && <CreatePost closeModal={closeModal} />}
      
      {errorP? (<div className='flex flex-col h-full p-6 mt-10 bg-black justify-center items-center'><p className='mt-20 text-center bg-black text-xl sm:text-5xl'>{errorP}</p></div>):(<div className="max-w-4xl mx-auto p-6 mt-10">
        <div className="flex items-center space-x-8 mb-8">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-gray-700">
            <img
              src={userData? userData.pfp : defaultpfp}
              alt={`${userData.username}'s profile picture`}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{userData.username}</h2>
            <p className="text-gray-400 mt-2">{userData.bio}</p>
            <div className="flex mt-4 space-x-4">
              <button onClick={fetchFollowersDetails} className="text-blue-500">
                Followers: {userData.followers.length}
              </button>
              <button onClick={fetchFollowingDetails} className="text-blue-500">
                Following: {userData.following.length}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {userPosts.map((post) => (
            <div key={post._id} className="relative w-full h-40 md:h-60 overflow-hidden bg-gray-800">
              <img
                src={post.image || defaultpfp}
                alt={`Post ${post._id}`}
                className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => handlePostClick(post)}
              />
            </div>
          ))}
        </div>
        {userPosts.length === 0 && (<p className='text-center text-xl'>No Posts Yet</p>)}
      </div>)}

      {showFollowersModal && (
        <Modal title="Followers" onClose={() => setShowFollowersModal(false)}>
          {followersDetails.map((user) => (
            <UserListItem key={user._id} user={user} closeModal={setShowFollowersModal} />
          ))}
          {followersDetails.length === 0 && <p className='text-center text-gray-300'>No Followers</p>}
        </Modal>
      )}

      {showFollowingModal && (
        <Modal title="Following" onClose={() => setShowFollowingModal(false)}>
          {followingDetails.map((user) => (
            <UserListItem key={user._id} user={user} closeModal={setShowFollowingModal} />
          ))}
          {followingDetails.length === 0 && <p className='text-center text-gray-300'>No Followings</p>}
        </Modal>
      )}

      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50">
          <div className="p-4 rounded-lg shadow-lg max-w-3xl w-full mx-4">
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full">
              <TestPost post={selectedPost} updatePostData={updatePostDataPofile} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mr-5 ml-5">
      <div className="bg-darkgray text-black rounded-lg p-4 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white font-semibold">{title}</h2>
          <button onClick={onClose} className='text-white'>Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function UserListItem({ user, closeModal }) {
  const [isFollowing, setIsFollowing] = useState(false);
 const navigate = useNavigate();
 const handleUserClick =  () => {
  closeModal(false); 
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
      console.error(`Error ${isFollowing ? "unfollowing" : "following"} user:`, error);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <div className="flex items-center space-x-4 py-2 sm:space-x-6 sm:py-3">
        <img 
          src={user.pfp || defaultpfp} 
          alt={user.username} 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer" 
          onClick={ handleUserClick}
        />
        <div className="flex-1">
          <span className="block w-24 text-gray-300 sm:w-32 truncate cursor-pointer" onClick={handleUserClick}>{user.username}</span>
        </div>
        <button
          onClick={handleFollowToggle}
          className={`px-3 py-1 text-sm rounded ${isFollowing ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'} sm:px-4`}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
    </div>
  );

}

export default Profile;
