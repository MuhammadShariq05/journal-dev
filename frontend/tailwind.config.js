/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#05B6D3",
        secondary: "#EF863E",
      },
      backgroundImage: {
        'login-sea-img': "url('./src/assets/images/sea.jpg')", 
        'signup-bg-img': "url('./src/assets/images/sea2.jpg')"
      },
    },
  },
  plugins: [],
}

// C:\projects\journal-dev\frontend\src\assets\images\
