import React, { useState } from 'react';
import './test.css';

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

const Test = ({ post }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const checkIfLiked = () => {
    const found = array.find(item => item === searchString);
    if (found) {
    console.log(`${searchString} is in the array.`);
    }
  };
  return (
    <div>
      <div className="post" onClick={openModal}>
        <div className="post-header">
          <h3>Created By: {post.createdBy}</h3>
          <p>Posted At: {new Date(post.createdAt).toLocaleString()}</p>
        </div>
        <div className="post-body">
          <img src={post.image} alt="Post" className="post-image" />
          <p>Caption: {post.caption}</p>
        </div>
        <div className="post-comments">
          <h4>Comments</h4>
          <ul>
            {post.comments.map((comment, index) => (
              <li key={index}>
                <p>Comment By: {comment.createdBy}</p>
                <p>{comment.comment}</p>
                <p>Commented {getTimeAgoString(new Date(comment.createdAt))}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="post-likes">
          <h4>Likes</h4>
          <ul>
            {post.likes.map((like, index) => (
              <li key={index}>{like}</li>
            ))}
          </ul>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Post Details</h2>
            <div>
              <div className="post-header">
                <h3>Created By: {post.createdBy}</h3>
                <p>Posted At: {new Date(post.createdAt).toLocaleString()}</p>
              </div>
              <div className="post-body">
                <img src={post.image} alt="Post" className="post-image" />
                <p>Caption: {post.caption}</p>
              </div>
              <div className="post-comments">
                <h4>Comments</h4>
                <ul>
                  {post.comments.map((comment, index) => (
                    <li key={index}>
                      <p>Comment By: {comment.createdBy}</p>
                      <p>{comment.comment}</p>
                      <p>Commented {getTimeAgoString(new Date(comment.createdAt))}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="post-likes">
                <h4>Likes</h4>
                <ul>
                  {post.likes.map((like, index) => (
                    <li key={index}>{like}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Test;
