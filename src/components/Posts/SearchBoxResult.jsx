import React from 'react'

export default function ({ user, onClick }) {
  return (
    <div
      className="flex items-center p-2 bg-white dark:bg-darkgray hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
      onClick={onClick}
    >
      <img
        src={user.pfp}
        alt={`${user.username}`}
        className="w-8 h-8 rounded-full mr-2"
      />
      <span className='text-black dark:text-white'>{user.username}</span>
    </div>
  )
}
