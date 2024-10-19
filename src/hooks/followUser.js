import axios from 'axios';

export default async function followUser(username) {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');

    const response = await axios.post(
      `${API_URL}/api/follow/${username}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    console.log(`Successfully followed user: ${response.data}`);
    return response.data;
  } catch (error) {
    console.error('Error following user:', error);
    throw new Error(error.response?.data?.message || 'Failed to follow the user');
  }
}
