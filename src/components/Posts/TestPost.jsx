import React from 'react'
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

const style = {
    height: '700px',
  };

export default function TestPost() {
    const [likeIcon, setLikeIcon] = useState(heartIcon);
    const [isOpen, SetIsOpen] = useState(false);

    const comments = ['Hello from one.Hello from one.Hello from one.Hello from one.Hello from one.Hello from one.Hello from one.Hello from one.Hello from one.Hello from one.Hello from one.', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two', 'Hello from two'];
    const toggleComment = ()=>{
        SetIsOpen(prevState => !prevState);
    }

    

    const toggleLike = () => {
        setLikeIcon(likeIcon === redheartIcon ? heartIcon : redheartIcon);
    };
    console.log(isOpen)
  return (
        <div className="post-container">
            
                    <div className="post" style={style}>
                    {!isOpen ? (
                    /* Content to render when isOpen is true */
                    <div className="post-header" >
                        <img src={userImage} className="user-icon" alt="" />
                        <p className="username">@yashraj</p>
                    </div>
                ) : (
                    /* Content to render when isOpen is false */

                    <div className="comment-section">
                    <div className="comment-header">
                    <h2 onClick={toggleComment}>Comments</h2>
                    <img src={close} alt='close'/>
                    </div>
                    <div className="comment-list">
                    {comments.map((com, index) => (
                        <div className="comment" key={index}>
                        <img src={userImage} alt="" />
                        <span>
                        {com}
                        <div className="desc">{getTimeAgoString('2024-04-07T18:13:12.402Z')}</div>
                        </span>
                        </div>
                        ))}
                    </div>
                    <div className="new-comment">
                        <img src={userImage} alt="" />
                        <input type="text"  placeholder="Add a comment..." />
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
                                <img src={post1} alt="" />
                                <img src={post1} alt="" />
                            </div>
                        </div>
                        <div className="post-detail">
                            <div className="detail-intracables">
                                <img src={likeIcon} className="like-btn" alt="" onClick={toggleLike}/>
                                <img src={commentIcon} className="comment-btn" alt="" onClick={toggleComment} />
                                <img src={sendIcon} className="send-btn" alt="" />
                            </div>
                            <span className="likes">1k likes</span>
                            <p className="post-des">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ipsa incidunt obcaecati esse illo voluptates libero debitis nisi. Id tempora vel illum vitae temporibus commodi non cupiditate atque voluptas. Ipsam.Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ipsa incidunt obcaecati esse illo voluptates libero debitis nisi. Id tempora vel illum vitae temporibus commodi non cupiditate atque volup</p>
                            <span className="comment-count">100 comments</span>
                        </div>
                    </>
                )}
            </div>
        </div>
  )
}
