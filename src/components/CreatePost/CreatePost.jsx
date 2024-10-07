import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CreatePost({closeModal}) {
  const [userId, setUserId] = useState('');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const API_URL= import.meta.env.VITE_API_URL;

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

      const response = await axios.post(`${API_URL}/api/posts`, formData, {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="w-[500px] h-[350px] bg-white p-5 rounded-lg shadow-md relative">
                    <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
                    <button
                        onClick={closeModal} // Call your close modal function
                        className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
</svg>
                    </button>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                Caption
                            </label>
                            <textarea 
                                id="content" 
                                value={caption} 
                                onChange={(e) => setCaption(e.target.value)} 
                                required 
                                maxLength={150}
                                className="mt-2 block w-full border border-gray-300 rounded-md p-2 h-20 resize-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Select Image
                            </label>
                            <input 
                                type="file" 
                                id="image" 
                                onChange={handleImageChange} 
                                required 
                                className="mt-2 block w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white font-semibold rounded-md px-3 py-1.5 hover:bg-indigo-500"
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>
  {/* <div 
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
  </div> */}
</>

  );
}
