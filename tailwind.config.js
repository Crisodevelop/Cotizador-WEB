/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F8FAFC",
        text: "#0F172A",
        primary: "#4F46E5",
        secondary: "#6366F1",
        border: "#E2E8F0",
        surface: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
