/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00F2FF",
        accent: "#A5F3FC",
        background: "#030708",
        surface: "#0a0e0f",
        muted: "#9CA3AF",
      },
      fontFamily: {
        main: ["Iceland", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.4em",
      }
    },
  },
  plugins: [],
}
