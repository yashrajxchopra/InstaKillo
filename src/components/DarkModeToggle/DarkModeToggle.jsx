import React, { useEffect, useContext } from "react";
import './index.css'
import { DarkModeContext } from "../../App";

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useContext(DarkModeContext);

  useEffect(() => {
    const darkThemePreference = localStorage.getItem("theme") === "dark"

    setIsDarkMode(darkThemePreference);
    document.documentElement.classList.toggle("dark", darkThemePreference);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  return (
    <div>
       <input
        type="checkbox"
        className="checkbox" 
        id="chk"
        checked={isDarkMode}
        onChange={toggleDarkMode}
      />
      <label className="label cursor-pointer rounded-full" style={isDarkMode? { backgroundColor: 'white' }:{ backgroundColor: '#111'}} htmlFor="chk">
        {/* sun */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" strokeWidth={1.5} stroke="orange" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
</svg>
  {/* moon */}
<svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" strokeWidth={1.5} stroke="yellow" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
</svg>
        <div className="ball dark:bg-black"></div>
      </label>
    </div>
  );
};

export default DarkModeToggle;
