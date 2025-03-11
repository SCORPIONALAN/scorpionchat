/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import { TEMAS } from './src/constants';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui
  ],
  daisyui:{
    themes: TEMAS
  }
}

