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
          DEFAULT: '#FFFFFF',
          light: '#F5F5F5',
          deep: '#EFEFEF',
        },
        accent: {
          DEFAULT: '#CC0000',
          dark: '#AA0000',
          light: '#FF2222',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
