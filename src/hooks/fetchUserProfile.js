import axios from "axios";

const fetchUserProfile = async (username)=>{
    const API_URL= import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/api/profile/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }); 
        //console.log(response.data)
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
          throw new Error("User not found"); 
        }
        throw new Error("An error occurred while fetching the profile"); 
      }
};
export default fetchUserProfile;