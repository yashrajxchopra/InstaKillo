import axios from "axios";

const search = async (searchQuery) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/api/search?q=${searchQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
export default search;
