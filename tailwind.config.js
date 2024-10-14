/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Add this line to include all React files
],
  theme: {
    extend: {},
  },
  plugins: ['@tailwindcss/forms', 'tailwind-scrollbar-hide'],
            
}

