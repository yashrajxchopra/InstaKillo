import axios from 'axios';

export default async function getSuggestedUser(count) {
  try {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/api/getSuggestedUsers/${count}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log(response.data)
    return (response.data);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch suggested users');
  }
}


