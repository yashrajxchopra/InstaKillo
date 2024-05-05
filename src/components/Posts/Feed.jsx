import React, { useState } from 'react';
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
import Post from './Post';
const feed = () => {
    const [likeIcon, setLikeIcon] = useState(heartIcon);
    const [heartIconn, setHeartIcon] = useState(redheartIcon);
    
    const [activityVisible, setActivityVisible] = useState(false);

    const toggleActivity = () => {
        setActivityVisible(!activityVisible);
        setHeartIcon(heartIconn === heartIcon ? heartIconF : heartIcon);
    };

    const toggleLike = () => {
        setLikeIcon(likeIcon === redheartIcon ? heartIconF : redheartIcon);
    };

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

            <Post/>

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
