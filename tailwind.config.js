/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          light: '#112240',
          mid: '#1B3A5C',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#E8D48B',
        },
        cream: '#F7F5F0',
        white: '#FEFDFB',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
