import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fetchUserProfile from '../../hooks/fetchUserProfile';
import defaultpfp from '../../../Server/uploads/defaultpfp.png';
import fetchPostData from '../../hooks/fetchPostData';
import TestPost from '../Posts/TestPost';
import Navbar from '../Posts/Navbar';
import CreatePost from '../CreatePost/CreatePost';

function Profile() {
  const [userData, setUserData] = useState({
    username: '',
    bio: '',
    pfp: '',
    posts: [],
  });
  const { username } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [createModal, setCreateModal] = useState(false);
  const openModal = () => setCreateModal(true);
  const closeModal = () => setCreateModal(false);

  const updatePostData = (postId, updatedPost) => {
    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, ...updatedPost } : post
      )
    );
  };

  const handlePostClick = (post) => {
    setSelectedPost(post); // Set the selected post
  };

  const handleCloseModal = () => {
    setSelectedPost(null); // Close the modal
  };

  const fetchProfile = async () => {
    const tempData = await fetchUserProfile(username);
    setUserData(tempData);
  };

  const fetchPosts = async () => {
    if (Array.isArray(userData.posts) && userData.posts.length > 0) {
      try {
        const postsData = await Promise.all(
          userData.posts.map((postId) => fetchPostData(postId))
        );

        // Filter out any null or undefined posts
        const validPosts = postsData.filter(post => post);
        setUserPosts(validPosts);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]); // Trigger fetchProfile when the username changes

  useEffect(() => {
    if (userData.username) { // Fetch posts only after userData is set
      fetchPosts();
    }
  }, [userData]);

  return (
    <div className="min-h-screen bg-black text-white">
        <div className="navbar">
        <Navbar openModal={openModal} />
      </div>
      {createModal && <CreatePost closeModal={closeModal} />}
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <div className="flex items-center space-x-8 mb-8">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-gray-700">
            <img
              src={userData.pfp || defaultpfp}
              alt={`${userData.username}'s profile picture`}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{userData.username}</h2>
            <p className="text-gray-400 mt-2">{userData.bio}</p>
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
      </div>

      {selectedPost && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50">
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
        <TestPost post={selectedPost} updatePostData={updatePostData} />
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Profile;
