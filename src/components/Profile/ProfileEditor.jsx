import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ConfirmBox from "./ConfirmBox";

export default function ProfileEditor({ setIsEditorOpen, profile, setUserData }) {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!username){
      setErrorMessage("Username cannot be Empty.");
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if(image) formData.append("image", image);
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_URL}/api/editprofile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      setIsConfirmOpen(false);
      setIsEditorOpen(false);
      console.log(response.data)
      if(response.data.message == "No changes to update."){
        setErrorMessage("");
        return;
      }
      setUserData(response.data);
      toast.success("Profile Editted");
    } catch (error) {
      setLoading(false);
      setIsConfirmOpen(false);
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Error occured. Please try again.");
      }
    }
    finally {
      setLoading(false); 
    }
  };
  const handleEdit = () => {
    setIsConfirmOpen(true);
  };
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-black w-3/4 max-w-[500px] h-auto p-5 rounded-lg shadow-md relative">
          <h2 className="text-xl text-gray-300 font-semibold mb-4">
            Edit Profile
          </h2>
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-gray-700 mx-auto mb-1">
            <img
              src={profile.pfp}
              alt={`pfp`}
              className="object-cover w-full h-full"
            />
          </div>
          <button
            onClick={() => setIsEditorOpen(false)}
            className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 mt-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                required
                placeholder="Username"
                className="mt-2 text-white bg-gray-900 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-300"
              >
                Bio
              </label>
              <input
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={20}
                placeholder="Username"
                className="mt-2 text-white bg-gray-900 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-300"
              >
                Select Profile Picture (.jpg, .jpeg, .png)
              </label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                accept=".jpg,.jpeg,.png"
                className="mt-2 text-white block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <button
              type="button"
              onClick={handleEdit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold rounded-md px-3 py-1.5 hover:bg-indigo-500"
            >
              {loading ? "Processing..." : "Edit"}
            </button>
          </form>
          {errorMessage && (
            <div className="text-red-500 mb-2">{errorMessage}</div>
          )}
          {isConfirmOpen && <ConfirmBox handleSubmit={handleSubmit} setIsConfirmOpen={setIsConfirmOpen} loading={loading} textToDisplay={"Confirm Edit?"}/>}
        </div>
      </div>
    </>
  );
}
