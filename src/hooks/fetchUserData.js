import axios from "axios";

const fetchUserData = async (createdBy)=>{
    const API_URL= import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${API_URL}/api/user/${createdBy}`); 
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};
export default fetchUserData;