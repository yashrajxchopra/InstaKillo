import React from 'react'
import githubIcon from "./logo/github-mark.png"
import linkedinIcon from "./logo/LinkedIn-Blue-14@2x.png"

export default function Footer() {
  return (
    <footer className="text-black dar:text-white bg-white dark:bg-black mt-8 text-center">
      <div className="flex justify-center space-x-6">
        <a
          href="https://github.com/yashrajxchopra"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-400 transition"
          title="GitHub"
        >
          <img src={githubIcon} alt="Github" className='h-6 w-6 sm:h-8 sm:w-8'/>
        </a>
        <a
          href="https://www.linkedin.com/in/yashrajchopra2002"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition"
          title="LinkedIn"
        >
          <img src={linkedinIcon} alt="LinkedIn" className='mt-1 h-4 w-16 sm:h-6 sm:w-20'/>
        </a>
      </div>
      <p className="text-sm mt-2 text-black dark:text-white">© 2024 Yashraj Chopra</p>
    </footer>
  )
}
