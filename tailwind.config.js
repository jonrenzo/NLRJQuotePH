/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './features/**/*.{js,ts,tsx}',
    './config/**/*.{js,ts,tsx}',
    './data/**/*.{js,ts,tsx}',
    './lib/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
