import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CreatePost({closeModal}) {
  const [userId, setUserId] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('image', image);
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
           'Authorization': `Bearer ${token}`
        }
      });

      setCaption('');
      setUserId('');
      setImage(null);
      toast.success("Post added")
      setErrorMessage('');
      closeModal();
    } catch (error) {
      console.log('Error creating post:', error);
      setErrorMessage('Error creating post. Please try again.');
    }
  };

  return (
    <>
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      backdropFilter: 'blur(5px)', // Blur effect for the background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999, // Ensure it appears above other content
    }}
  >
    <div 
      style={{
        width: '500px', // Fixed width for modal
        height: '250px', // Fixed height for modal
        backgroundColor: 'white', // Background color for the modal
        padding: '20px', // Padding inside the modal
        borderRadius: '8px', // Rounded corners
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow for depth
      }}
    >
      <h2>Create a Post</h2>
      <button
        onClick={closeModal} // Call your close modal function
        style={{
          position: 'absolute',
          top: '250px',
          right: '550px',
          cursor: 'pointer',
          color: 'white', // Change color to your preference
        }}
      >
        Close
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">Caption</label>
          <textarea 
            id="content" 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
            required 
            maxLength={150}
            style={{ width: '100%', height: '60px' }} //
          />
        </div>
        <div>
          <label htmlFor="image">Select Image</label>
          <input 
            type="file" 
            id="image" 
            onChange={handleImageChange} 
            required 
            style={{ width: '100%', margin: '0' }} 
          />
        </div>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</>

  );
}
