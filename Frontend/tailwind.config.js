/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F47B20",
        secondary: "#2F2F2F",
        background: "#FFFFFF",
        accent: "#F5F5F5",
      },
    },
  },
  plugins: [],
};
