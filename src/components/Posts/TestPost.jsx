import React, { useEffect } from 'react'
import { useState } from 'react';
import heartIcon from "./img/icon/heart-nofill.png";
import commentIcon from "./img/icon/comment.png";
import sendIcon from "./img/icon/send.png";
import addIcon from './img/icon/add.png';
import redheartIcon from "./img/icon/redheart.png";
import post1 from "./img/posts/post1.png";
import close from "./img/icon/close.png";
import userImage from "./img/user.png";
import getTimeAgoString from '../../hooks/getTimeAgoString';
import axios from 'axios';
import { toast } from 'react-toastify';

const style = {
    height: 'auto',
    width: '500'
  };

export default function TestPost({post, updatePostData}) {
    const userId = '663f56124af70d8faa6f85ac';
    const [likeIcon, setLikeIcon] = useState(heartIcon);
    const [isOpen, SetIsOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [comment, setComment] = useState('');

    const toggleComment = ()=>{
        SetIsOpen(prevState => !prevState);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (comment.trim()) {
                postComment();
            }
        }

    }

    const toggleLike = async () => {
        //setLikeIcon(likeIcon === redheartIcon ? heartIcon : redheartIcon);
        try {
            const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/like`, { userId });
            updatePostData(post._id, response.data.post);
            setLikeIcon(likeIcon === redheartIcon ? heartIcon : redheartIcon);
          } catch (error) {
            if (error.response) {
                toast.error('Error adding like:', error.response.data.error); 
              } else {
                toast.error('Cannot get to server', error.message); 
                console.log(error)
              }
          }
    };

    const  postComment = async () =>{
       try{
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmZlM2IwOWFkN2M1NDYwZmEzNzk0YTciLCJlbWFpbCI6Inlhc2hAZ21haWwuY29tIiwiaWF0IjoxNzI3OTM3MzcyLCJleHAiOjE3Mjc5NDA5NzJ9.TpqK77cmqvcg5eWyOHuiN-cs4vpuiHz5Z68lBAlNS-8';
        const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/comment`,
            { comment: comment }, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`  
                }
            }
        );
        updatePostData(post._id, response.data.post);
        setComment('');
        toast.success('Comment Added')
       }
       catch(error){
            console.log(error.response.data.error)
       }
        

    };
    
    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/${post.createdBy}`); 
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUserData();
        if(post.likes.includes(userId))
        {
            setLikeIcon(redheartIcon);
        }
    }, [post]);
    
  return (
        <div className="post-container">
            
                    <div className="post" style={style}>
                    {!isOpen ? (
                    <div className="post-header" >
                        {userData ? ( // Conditionally render user data if available
                            <>
                                <img src={userData.pfp} className="user-icon" alt="" />
                                <p className="username">{userData.username}</p>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                ) : (

                    <div className="comment-section">
                    <div className="comment-header">
                    <h2>Comments</h2>
                    <img src={close} onClick={toggleComment} alt='close'/>
                    </div>
                    <div className="comment-list">
                    {(post.comments.length == 0) && <span className='no-comments'>No Comments</span>}
                    {post.comments.map((com, index) => (
                        <div className="comment" key={index}>
                        <img src={post.image} alt="" />
                        <span>
                        <p>{com.comment}</p>
                        <div className="desc">{getTimeAgoString(post.createdAt)}</div>
                        </span>
                        </div>
                        ))}
                    </div>
                    <div className="new-comment">
                        <img src={userImage} alt="" />
                        <input type="text"  placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={handleKeyDown}/>
                    </div>
                  </div>

                )}
                {!isOpen && (
                    <>
                        <div className="post-feed">
                            <div className="post-overlays">
                                <img src={likeIcon} className="like-icon" alt="" onClick={toggleLike} />
                            </div>
                            <div className="post-img-container">
                                <img src={post.image} alt="" />
                                <img src={post1} alt="" />
                            </div>
                        </div>
                        <div className="post-detail">
                            <div className="detail-intracables">
                                <img src={likeIcon} className="like-btn" alt="" onClick={toggleLike}/>
                                <img src={commentIcon} className="comment-btn" alt="" onClick={toggleComment} />
                                <img src={sendIcon} className="send-btn" alt="" />
                            </div>
                            <span className="likes">{post.likes.length} likes</span>
                            <p className="post-des">{post.caption}</p>
                            <span className="comment-count">{post.comments.length} comments</span>
                        </div>
                    </>
                )}
            </div>
        </div>
  )
}
