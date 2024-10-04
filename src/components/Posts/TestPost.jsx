import React, { useEffect, useInsertionEffect } from 'react'
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
import { useNavigate } from 'react-router-dom';
import { TbArrowAutofitRight } from 'react-icons/tb';

const style = {
    height: 'auto',
    width: '500px',
    marginTop: '70px'
  };
  const userStyle = {
    fontFamily: "'Arial'", 
    fontSize: '13px',                
    fontWeight: '500',             
    color: 'black',        
    cursor: 'pointer',             
};


export default function TestPost({post, updatePostData}) {
    //const userId = '663f56124af70d8faa6f85ac';
    const [likeIcon, setLikeIcon] = useState(heartIcon);
    const [isOpen, setIsOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [comment, setComment] = useState('');
    const [commentData, setCommentData] = useState([]);
    const navigate = useNavigate();

    const handleClick = ()=>{
        navigate(`/p/`)
    }

    const fetchUserData = async (createdBy)=>{
            try {
                const response = await axios.get(`http://localhost:5000/api/user/${createdBy}`); 
                console.log(response.data)
                return response.data;
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
    }

    const checkLike = async (likeArray) =>{
        try{
            const token  = localStorage.getItem('token');
            const user_Id = await axios.post('http://localhost:5000/api/getUserId',{},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`  
                    }
                }
            );
            console.log(user_Id)
            if(likeArray.includes(user_Id.data._id)){
                setLikeIcon(redheartIcon);
            }
            else{
                setLikeIcon(heartIcon);
            }
        }
        catch(error){
            if (error.response) {
                toast.error('Error adding like:', error.response.data.error); 
              } else {
                toast.error('Cannot get to server', error.message); 
                console.log(error)
              }
          }

        }
    
    const getUserPfp = async(userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
            setProfilePictures(prev => [...prev, response.data.pfp]);
        } catch (error) {
            console.error("Error fetching profile picture:", error);
        }
    };
    
    const toggleComment = async () => {
        setIsOpen(prevState => !prevState);
        
        if (commentData.length === 0 || commentData.every(item => Object.keys(item).length === 0)) {
            const newCommentData = [];
            
            for (const comment of post.comments) {
                try {
                    const commentUser = await fetchUserData(comment.createdBy); // Fetch user data for each comment
                    console.log(commentUser, 'Fetched comment user data', comment.createdBy);
    
                    // Push the fetched data into the new array
                    newCommentData.push({
                        user: commentUser.username,
                        pfp: commentUser.pfp
                    });
                } catch (error) {
                    console.log('Error fetching comment user data');
                    newCommentData.push({
                        user: 'Unknown', 
                        pfp: '../../../Server/uploads\\defaultpfp.png'
                    });
                }
            }
    
            console.log(newCommentData)
            setCommentData(newCommentData);
        }
    };
    

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
            const token  = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/like`, {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`  
                    }
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
                toast.error('Error adding like:', error.response.data.error); 
              } else {
                toast.error('Cannot get to server', error.message); 
                console.log(error)
              }
          }
    };

    const  postComment = async () =>{
       try{
        const token = localStorage.getItem('token');
        if(!token){
            throw new Error("No credentials found");
        }
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
        try{
            const user_Id = await axios.post('http://localhost:5000/api/getUserId',{},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`  
                    }
                }
            );
        const userData = await fetchUserData(user_Id.data._id);
        const newComment = {
                user: userData.username, // Assuming userData contains username
                pfp: userData.pfp // Assuming userData contains pfp
        }

        // Update the commentData state to include the new comment
        setCommentData(prevCommentData => [...prevCommentData, newComment]);
        }
        catch(error){
            console.log(error)
            toast.error(error.response.data.error)
        }
       }
       catch(error){
            console.log(error.response.data.error)
       }
        

    };
    useEffect(() => {

        const loadUserData = async () => {
            try {
                const userData = await fetchUserData(post.createdBy);
                setUserData(userData);
                checkLike(post.likes);
            } catch (error) {
                console.error('Error fetching user data or checking likes:', error);
            }
        };
        loadUserData();
        checkLike(post.likes);

    }, [post])
    
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
                    {(post.comments.length === 0) && <span className='no-comments'>No Comments</span>}
                    {post.comments.map((com, index) => (
                        <div className="comment" key={index}>
                         {commentData[index] ? (
                                    <img
                                        src={commentData[index].pfp}
                                        onClick={handleClick}
                                        alt=""
                                        style={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    <img
                                        src="../../../Server/uploads\\defaultpfp.png" 
                                        onClick={handleClick}
                                        alt=""
                                        style={{ cursor: 'pointer' }}
                                    />
                                )}

                                <span style={{ marginLeft: '1.5em' }}>
                                    {commentData[index] ? (
                                        <p style={userStyle} onClick={handleClick}>
                                            {commentData[index].user}
                                        </p>
                                    ) : (
                                        <p style={userStyle} onClick={handleClick}>Loading</p>
                                    )}
                        <p>{com.comment}</p>
                        <div className="desc">{getTimeAgoString(com.createdAt)}</div>
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
                            <span  className="comment-count">Uploded {getTimeAgoString(post.createdAt)}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
  )
}
