import React, { useState } from 'react';
import axios from 'axios';

export default function CreatePost() {
  const [userId, setUserId] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('content', caption);
      formData.append('userId', userId);
      formData.append('image', image);

      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Post created successfully:', response.data);
      // Reset form fields
      setCaption('');
      setUserId('');
      setImage(null);
      setErrorMessage('');
    } catch (error) {
      console.error('Error creating post:', error);
      setErrorMessage('Error creating post. Please try again.');
    }
  };

  return (
    <div>
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea id="content" value={caption} onChange={(e) => setCaption(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="userId">User ID:</label>
          <input type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input type="file" id="image" onChange={handleImageChange} required />
        </div>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
