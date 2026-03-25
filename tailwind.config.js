/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050507",
        surface: "#0a0a0f",
        line: "#1a1a24",
        accent: "#5B5FFF",
        t1: "#ffffff",
        t2: "#a0a0b0",
        t3: "#555566",
      },
      animation: {
        pulse_new: "pulse_new 300ms ease-out",
      },
      keyframes: {
        pulse_new: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
