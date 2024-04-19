import React, { useState } from 'react';
import './index.css'; // You can define your own CSS styles for the modal

const Modal = ({ isOpen, onClose }) => {
  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.value);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSubmit = () => {
    // You can handle submitting the post here
    console.log('Image:', image);
    console.log('Caption:', caption);
    // For demo purposes, let's just close the modal
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={onClose}>
              X
            </button>
            <h2>Create a Post</h2>
            <div className="form-group">
              <label htmlFor="image">Image URL:</label>
              <input type="text" id="image" value={image} onChange={handleImageChange} />
            </div>
            <div className="form-group">
              <label htmlFor="caption">Caption:</label>
              <textarea id="caption" value={caption} onChange={handleCaptionChange} />
            </div>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
