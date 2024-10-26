import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CreatePost({ closeModal, addNewCreatedPost }) {
  const [userId, setUserId] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", image);
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_URL}/api/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setCaption("");
      setUserId("");
      addNewCreatedPost(response.data.post);
      setImage(null);
      toast.success("Post added");
      setErrorMessage("");
      closeModal();
    } catch (error) {
      console.log("Error creating post:", error);
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Error creating post. Please try again.");
      }
    }
    finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-black w-3/4 max-w-[500px] h-[350px] p-5 rounded-lg shadow-md relative">
          <h2 className="text-xl text-gray-300 font-semibold mb-4">
            Create a Post
          </h2>
          <button
            onClick={closeModal} // Call your close modal function
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
                htmlFor="content"
                className="block text-sm font-medium text-gray-300"
              >
                Caption
              </label>
              <textarea
                id="content"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
                maxLength={150}
                placeholder="150 word limit"
                className="mt-2 text-white bg-gray-900 block w-full border border-gray-300 rounded-md p-2 h-20 resize-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-300"
              >
                Select Image (.jpg, .jpeg, .png)
              </label>
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                required
                accept=".jpg,.jpeg,.png"
                className="mt-2 text-white block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {errorMessage && (
              <div className="text-red-500 mb-2">{errorMessage}</div>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold rounded-md px-3 py-1.5 hover:bg-indigo-500"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
