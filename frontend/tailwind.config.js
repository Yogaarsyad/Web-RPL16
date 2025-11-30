// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2563EB', // Biru utama (bg-primary)
        'primary-hover': '#1D4ED8', // Biru saat hover (hover:bg-primary-hover)
        'secondary': '#F3F4F6', // Abu-abu muda (bg-secondary)
        'dark': '#111827', // Abu-abu gelap (bg-dark)
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'], // Mengatur font default
      }
    },
  },
  plugins: [],
}
