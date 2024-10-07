import React, { useEffect, useState } from 'react'
import './tpost.css'
import { toast } from 'react-toastify';
import axios from 'axios';

function getTimeAgoString(timestamp) {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diff = Math.abs(now - createdAt);

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30; 
  const year = day * 365; 

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
export default function Post({post}) {
  //const [post, setPost] = useState(null);
  const [like, setLike] = useState(false);
  const [comment, setComment] = useState('');
  const API_URL= import.meta.env.API_URL;


  const handleLike = () => {
    setLike(like?false:true);
  };
  const handleComment = (e) => {
    setComment(e.target.value);
  };
  
  
  if (!post) {
    return <div>Loading...</div>; 
  }
  return (
  <div>
     <div className="center">
      <div className="post">
        <div className="head">
          <div className="details">
            <div className="image">
              <img src={post.image} alt="" />
            </div>
            <div className="name">{post.createdBy}</div>
          </div>
          <span className="desc title">{getTimeAgoString(post.createdAt)}</span>
        </div>
        <input type="checkbox" name="" id='like' className='btn' checked={like} onChange={handleLike}/>
        <input type="checkbox" name="" id="comment" className="btn" />
        <input type="checkbox" name="" id="share" className="btn" />

        <div className="content">
          <img src={post.image} alt="" />
        </div>

        <div className="features">
          <div className="controls">
            <label htmlFor="like" id="like-btn"></label>
            <label htmlFor="comment" id="comment-btn"></label>
            <label htmlFor="share" id="share-btn"></label>
          </div>
          <div className="liked">
            <div className="images">
              {post.comments.slice(0, 3).map((element, index) =>(
                <img src={post.image} key={index} alt=""/>
              ))
              }
            </div>
            <div className="desc">
              Liked by <span>{post.likes.length}</span>
            </div>
          </div>
          <div className="desc title">
            {post.caption}
          </div>
          <label htmlFor="comment" id="comment-btn2">View all {post.comments.length} comments</label>
        </div>
        <div className="post-comment">
          <div className="head">
            <div className="name">Comments</div>
            <label htmlFor="comment" id="comment-btn3">
              <i className="fa-solid fa-xmark"></i>
            </label>
          </div>

          <div className="comments">
          {post.comments.map((com, index) => (

            <div className="comment" key={index}>
            <img src={post.image} alt="" />
            <span>
              {com.comment}
              <div className="desc">{getTimeAgoString(post.createdAt)}</div>
            </span>
            </div>
            ))}
          </div>
          <div className="new-comment">
            <img src="../images/avatar.png" alt="" />
            <input type="text"  placeholder="Add a comment..." value={comment} onChange={handleComment}/>
          </div>
        </div>
      </div>
  </div>
  
  </div>
  )
}

