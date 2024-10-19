import axios from 'axios';

export default async function unfollowUser(username) {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');

    const response = await axios.post(
      `${API_URL}/api/unfollow/${username}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    console.log(`Successfully unfollowed user: ${response.data}`);
    return response.data;
  } catch (error) {
    console.error('Error following user:', error);
    throw new Error(error.response?.data?.message || 'Failed to unfollow the user');
  }
}
