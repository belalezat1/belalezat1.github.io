/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: {
        background: "#0B0C0E",
        surface: "#111316",
        raised: "#17191D",
        text: "#F1F1EE",
        muted: "#A1A19B",
        border: "#292B30",
        accent: "#B49A68",
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
