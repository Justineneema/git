/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: '#1B5E20',
        accent: '#8DAA9D',
        soil: '#6B4F4F',
        sky: '#F1F8E9',
        textDark: '#333333',
      },
    },
  },
  plugins: [],
}


