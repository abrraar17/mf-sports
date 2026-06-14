/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D0D0D',
          light: '#1A1A1A',
          deep: '#000000',
        },
        accent: {
          DEFAULT: '#CC0000',
          dark: '#AA0000',
          light: '#FF1A1A',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};