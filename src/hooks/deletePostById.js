import axios from "axios";

const deletePostById = async (id)=>{
    const API_URL= import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`${API_URL}/api/posts/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }); 
        console.log(response.data)
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
          throw new Error("Post not found"); 
        }
        throw new Error("An error occurred while deleting Post the profile"); 
      }
};
export default deletePostById;