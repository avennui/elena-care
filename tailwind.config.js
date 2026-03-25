/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAFA",
        surface: "#FFFFFF",
        line: "#E8E8E8",
        accent: "#0047FF",
        t1: "#000000",
        t2: "#666666",
        t3: "#999999",
        danger: "#D63030",
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-out",
        slideUp: "slideUp 200ms ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0", transform: "translateY(4px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(4px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
