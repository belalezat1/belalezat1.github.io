/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#C5A059",
        "primary-light": "#E9C176",
        "surface-low":      "#0E0E0E",
        "surface-container": "#131313",
        "surface-high":     "#1C1C1C",
        "surface-highest":  "#252525",
        "on-surface":         "#E5E4E2",
        "on-surface-variant": "#9A8F80",
        outline:    "#4D4635",
        "outline-variant": "#2A2A2A",
      },
      fontFamily: {
        serif:  ['"Noto Serif"', 'serif'],
        sans:   ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
