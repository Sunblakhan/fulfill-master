/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent_1: "#86efac",
        accent_1_hover: "#bbf7d0",
        accent_2: "#3b82f6",
        accent_2_hover: "#3366cc",
      },
    },
  },
  plugins: [],
  darkMode: ["class"],
};
