import React, { useEffect, useRef, useState } from 'react';
import "./styles.css";
import searchIcon from "./img/icon/search.png";
import homeIcon from "./img/icon/home.png";
import heartIcon from "./img/icon/heart-nofill.png";
import heartIconF from "./img/icon/heart-fill.png";
import commentIcon from "./img/icon/comment.png";
import sendIcon from "./img/icon/send.png";
import logout from "./img/icon/logout.png";
import addIcon from './img/icon/add.png';
import redheartIcon from "./img/icon/redheart.png";
import logo from '../LogIn/logo.png'
import post1 from "./img/posts/post1.png";
import userImage from "./img/user.png";
import { toast, ToastContainer, useToast } from 'react-toastify';
import axios from 'axios';
import TestPost from './TestPost';
import { Button, useDisclosure } from '@chakra-ui/react';
import logoutUser from '../../hooks/logout';
import { FixedSizeList as List } from 'react-window';
import  fetchUserData from '../../hooks/fetchUserData'
import { useNavigate } from 'react-router-dom';
import CreatePost from '../CreatePost/CreatePost';
import Navbar from './Navbar';


const feed = () => { 
    const [likeIcon, setLikeIcon] = useState(heartIcon);
    const [heartIconn, setHeartIcon] = useState(redheartIcon);
    const [activityVisible, setActivityVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [userData, setUserData] = useState();
    const [createModal,  setCreateModal] = useState(false);
    const openModal = () => setCreateModal(true);
    const closeModal = () => setCreateModal(false);
    const API_URL= import.meta.env.VITE_API_URL;

    const navigate = useNavigate();
    //const postId = ['6612e23873da0373eb6b9c13', '6612e2704ba8d67cc327495a'];


    const toggleActivity = () => {
        setActivityVisible(!activityVisible);
        setHeartIcon(heartIconn === heartIcon ? heartIconF : heartIcon);
    };

    const handleLogout = ()=>{
        if(logoutUser()){
            toast.success('Logout Successful')
            navigate('/login')
        }
        else{
            toast.error('There was a problem')
        }
    }

    const updatePostData = (postId, updatedPost) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post._id === postId ? { ...post, ...updatedPost } : post))
        );
    };
    
    useEffect(() => {
        const fetchPost = async () => {
          try {
            const token  = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/posts`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Attach the token as a Bearer token in the Authorization header
                }
            });
            try{
                const userId = await axios.post(`${API_URL}/api/getUserId`,{},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`  
                        }
                    }
                )
                const tempUserData = await fetchUserData(userId.data._id)
                setUserData(tempUserData)
            }
            catch(error){
                toast.error('Error getting user Profile')
                setUserData({
                    username: 'Not Found',
                    bio: 'Not found',
                    pfp: '../../../Server/uploads\\defaultpfp.png'
                })
            }
            setPosts(response.data);
            console.log(response.data)
          } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                toast.error("Session expired or invalid token, please login again!");
                localStorage.removeItem('token');
                navigate('/login'); // Redirect to login page
            } else {
                // Other errors, e.g., server issues, network errors, etc.
                toast.error("Error occurred while processing request!");
                console.error("Error details:", error);
            }
        }

        };
        fetchPost();

      },[]); 
    //   if(posts.length === 0)
    //   {
    //     return(<div>...Loading</div>)
    //   }

    return (
        <div className='flex'>
            <div className='navbar'>
            <Navbar openModal={openModal}/>
            </div>
            {createModal && <CreatePost closeModal={closeModal}/>}


            <div className="flex items-center justify-center  flex-col w-auto ">
            {posts.map((post, index) =>
            {
                return <TestPost post={post} key={index} updatePostData={updatePostData}/>;
            })}
            </div>
            

            <div className="user-about-section">
                <div className="user-info">
                    {userData ? (<img src={userData.pfp} className="user-dp" alt="" />):( <img src={'../../../Server/uploads\\defaultpfp.png'} className="user-dp" alt="" />)}
                    {userData ? (<div className="info-container">
                        <h1 className="name">{userData.username}</h1>
                        <p>{userData.bio}</p>
                    </div>):
                    (<div className="info-container">
                        <h1 className="name">Loading</h1>
                        <p>Loading</p>
                    </div>)}
                    
                </div>
                <h1 className="suggestion-heading">suggestions</h1>
                <div className="suggestion-container">
                    <div className="user-card">
                        <img src={userImage} className="user-dp" alt="" />
                        <p className="username">@yc</p>
                        <button className="follow-btn">follow</button>
                    </div>
                    <div className="user-card">
                        <img src={userImage} className="user-dp" alt="" />
                        <p className="username">@yc</p>
                        <button className="follow-btn">follow</button>
                    </div>
                    +1 more post
                </div>
            </div>
        </div>
        
    );
};

export default feed;
