import React, { useEffect, useState } from 'react';
import "./styles.css";
import searchIcon from "./img/icon/search.png";
import homeIcon from "./img/icon/home.png";
import heartIcon from "./img/icon/heart-nofill.png";
import heartIconF from "./img/icon/heart-fill.png";
import commentIcon from "./img/icon/comment.png";
import sendIcon from "./img/icon/send.png";
import addIcon from './img/icon/add.png';
import redheartIcon from "./img/icon/redheart.png";
import logoIcon from "./img/icon/logo.png";
import post1 from "./img/posts/post1.png";
import userImage from "./img/user.png";
import { toast } from 'react-toastify';
import axios from 'axios';
import TestPost from './TestPost';


const feed = () => { 
    const [likeIcon, setLikeIcon] = useState(heartIcon);
    const [heartIconn, setHeartIcon] = useState(redheartIcon);
    const [activityVisible, setActivityVisible] = useState(false);
    const [posts, setPosts] = useState([]);

    //const postId = ['6612e23873da0373eb6b9c13', '6612e2704ba8d67cc327495a'];

    const toggleActivity = () => {
        setActivityVisible(!activityVisible);
        setHeartIcon(heartIconn === heartIcon ? heartIconF : heartIcon);
    };

    const toggleLike = () => {
        setLikeIcon(likeIcon === redheartIcon ? heartIconF : redheartIcon);
    };

    const updatePostData = (postId, updatedPost) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post._id === postId ? { ...post, ...updatedPost } : post))
        );
    };
    
    useEffect(() => {
        const fetchPost = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/posts`);
            setPosts(response.data);
            console.log(response.data)
          } catch (error) {
            toast.error("Error occurred while processing request!");
          }
        };
        fetchPost();
      }, []); 
    //   if(posts.length === 0)
    //   {
    //     return(<div>...Loading</div>)
    //   }

    return (
        <div>
            <nav className="navbar">
                <img src={logoIcon} className="logo" alt="" />
                <form className="search-box">
                    <input type="text" placeholder="search" name="search-query" id="search-input" />
                    <button className="search-btn" type="submit"><img src={searchIcon} className="search-icon" alt="" /></button>
                </form>
                <div className="nav-links">
                    <a href="/" className="nav-links"><img src={homeIcon} className="nav-icon" alt="" /></a>
                    <div className="activity-log">
                        <img src={heartIconn} className="nav-icon" alt=""  onClick={toggleActivity} />
                        <div className={`activity-container ${activityVisible ? '' : 'hide'}`}>
                            notifications...
                            ....
                            ....
                        </div>
                    </div>
                    <a href="/" className="nav-links"><img src={addIcon} className="nav-icon" alt="" /></a>
                    <a href="/" className="nav-links"><img src={userImage} className="nav-icon user-profile" alt="" /></a>
                </div>
            </nav>
            
            {/* {posts.map((post, index) =>
            {
                return <Post key={post._id + index}post={post}/>;
            })} */}
            {posts.map((post, index) =>
            {
                return <TestPost post={post} key={index} updatePostData={updatePostData}/>;
            })}
            

            <div className="user-about-section">
                <div className="user-info">
                    <img src={userImage} className="user-dp" alt="" />
                    <div className="info-container">
                        <h1 className="name">Yashraj Chopra</h1>
                        <p>This is the bio of the profile.</p>
                    </div>
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
