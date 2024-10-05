const fetchUserData = async (createdBy)=>{
    try {
        const response = await axios.get(`http://localhost:5000/api/user/${createdBy}`); 
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};
export default fetchUserData;