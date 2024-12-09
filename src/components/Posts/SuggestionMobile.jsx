import React from 'react';
import { useNavigate } from "react-router-dom";
export default function SuggestionMobile ({ users, handleFollowClick }){
  const navigate = useNavigate();
  return (
    <div className="flex overflow-x-auto p-4 space-x-4 justify-center">
        {users?.lenght === 0 && <div className='flex justify-center items-center w-full h-24 text-black dark:text-white'><p>You are friend of everyone.</p></div>}
      {users?.map((user) => (
        <div key={user.username} className="flex flex-col items-center p-4 rounded-lg">
          <div className="relative">
            <img
              src={user.pfp}
              alt={user.username}
              className="w-20 h-20 rounded-full border-2 border-gray-300 cursor-pointer"
              onClick={() => navigate(`/${user.username}`)}
            />
            <button
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-blue-500 text-white text-sm px-3 py-1 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              onClick={() => handleFollowClick(user.username)}
            >
              Follow
            </button>
          </div>
          <p onClick={() => navigate(`/${user.username}`)} className="mt-3 text-sm text-center font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
            {user.username}
          </p>
        </div>
      ))}
    </div>
  );
};


