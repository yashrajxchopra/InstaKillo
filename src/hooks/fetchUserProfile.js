import axios from "axios";

const fetchUserProfile = async (username)=>{
    const API_URL= import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${API_URL}/api/profile/${username}`); 
        //console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};
export default fetchUserProfile;