import React, { useEffect, useRef, useState } from 'react'
import './post.css'
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
import { Modal } from '@chakra-ui/react';

// Function to calculate the time difference between two dates
function getTimeAgoString(createdAt) {
    const now = new Date();
    const diff = Math.abs(now - createdAt);
  
    // Define time intervals in milliseconds
    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30; // Assuming a month is 30 days
    const year = day * 365; // Assuming a year is 365 days
  
    // Calculate the time ago string
    if (diff < minute) {
      return Math.floor(diff / 1000) + ' seconds ago';
    } else if (diff < hour) {
      return Math.floor(diff / minute) + ' minutes ago';
    } else if (diff < day) {
      return Math.floor(diff / hour) + ' hours ago';
    } else if (diff < month) {
      return Math.floor(diff / day) + ' days ago';
    } else if (diff < year) {
      return Math.floor(diff / month) + ' months ago';
    } else {
      return Math.floor(diff / year) + ' years ago';
    }
  }
  const customStyles = {

    content: {
  
      top: '50%',
  
      left: '50%',
  
      right: 'auto',
  
      bottom: 'auto',
  
      marginRight: '-50%',
  
      transform: 'translate(-50%, -50%)',
  
      width: '50%',
  
      height: '70%',
  
      border: '1px solid #ccc',
  
      borderRadius: '10px',
  
      overflow: 'auto',
  
    },
  
  };
 const  Post = ({post})=> {
  const [likeIcon, setLikeIcon] = useState(heartIcon);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleLike = () => {
      setLikeIcon(likeIcon === redheartIcon ? heartIconF : redheartIcon);
  };
  const checkIfLiked = () => {
    let searchString = post.createdBy;
    const found = post.likes.find(item => item === searchString);
    if (found) {
      toggleLike();
    }
  };
  const toggleModal = () => {

    setIsModalOpen(!isModalOpen);

  };
  useEffect(()=>{
    checkIfLiked();
    
  },[post]);  

       
  return (
    <div className="post-container">
        <div className="post" onClick={() => setIsModalOpen(!isModalOpen)}>
            <div className="post-header">
                <img src={post.image} className="user-icon" alt="" />
                <p className="username">{post.createdBy}</p>
            </div>
            <div className="post-feed">
                <div className="post-overlays">
                    <img src={likeIcon} className="like-icon" alt="" onClick={toggleLike} />
                </div>
                <div className="post-img-container">
                    <img src={post1} alt="" />
                </div>
            </div>
            <div className="post-detail">
                <div className="detail-intracables">
                    <img src={likeIcon} className="like-btn" alt="" onClick={toggleLike}/>
                    <img src={sendIcon} className="send-btn" alt="" />
                    <img src={commentIcon} className="comment-btn" alt="" />
                </div>
                <span className="likes">1k likes</span>
                <p className="username">{post.createdBy}</p>
                <p className="post-des">{post.caption}</p>

                <div className="comment-box">
                    <input type="text" id="comment-input" placeholder="Add a comment" />
                    <button className="add-comment-btn"><img src={commentIcon} alt="" /></button>
                </div>

            </div>
        </div>
        
      {isModalOpen && (

<div className="modal-container">

  <div className="modal">

    <div className="modal-header">

      <img src={userImage} className="user-icon" alt="" />
      <p className="username">{post.createdBy}</p>
      <img src={post1} alt="" className="post-image" />
      
      
      <button className="close-btn" onClick={toggleModal}>

        &times;

      </button>

    </div>
    <p>
      <span>{post.likes.length} likes</span>
      <img src={likeIcon} className="like-btn" alt="" onClick={toggleLike}/>
      </p>
    <div className="modal-content">

      <p className="caption">{post.caption}</p>

      <p className="comments">

        <span>{post.comments.length} comments</span>

      </p>
      <form className="comment-form">

     <input type="text" placeholder="Add a comment..." />

     <button type="submit">Post</button>

    </form>
      <ul className="comment-list">

        {post.comments.map((com, index) => (

          <li key={index}>

            <p className="comment-author">{com.createdBy}</p>

            <p className="comment-text">{com.comment}</p>

          </li>

        ))}

      </ul>

    </div>

  </div>

</div>

)}
    </div>
  )
}
export default Post;
