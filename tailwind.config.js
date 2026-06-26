/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effcf6",
          100: "#d8f9ea",
          200: "#a3edc9",
          300: "#66e0a3",
          400: "#2bcd86",
          500: "#14b86f",
          600: "#0f9a5d",
          700: "#0b7a4a",
          900: "#063a24"
        }
      },
      boxShadow: {
        glow: "0 12px 30px rgba(20, 184, 111, 0.25)"
      }
    }
  },
  plugins: []
};
