import axios from 'axios';

export default async function checkIfFollowing(username) {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/api/checkIfFollowing/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if(response.data.message == "True") return true;
    else return false;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch suggested users');
  }
};


