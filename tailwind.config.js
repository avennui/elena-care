/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FFFFFF",
        t1: "#000000",
        t2: "#444444",
        t3: "#999999",
        accent: "#0000FF",
        danger: "#FF0000",
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
    },
  },
  plugins: [],
};
