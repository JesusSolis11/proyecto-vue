/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeInUp: { '0%': {opacity:'0',transform:'translateY(30px)'}, '100%': {opacity:'1',transform:'translateY(0)'} },
        fadeInDown:{ '0%': {opacity:'0',transform:'translateY(-30px)'}, '100%': {opacity:'1',transform:'translateY(0)'} },
        slideInLeft:{ '0%': {opacity:'0',transform:'translateX(-30px)'}, '100%': {opacity:'1',transform:'translateX(0)'} },
        slideInRight:{ '0%': {opacity:'0',transform:'translateX(30px)'}, '100%': {opacity:'1',transform:'translateX(0)'} },
        scaleIn:{ '0%': {opacity:'0',transform:'scale(0.9)'}, '100%': {opacity:'1',transform:'scale(1)'} },
        bounceGentle:{ '0%,100%': {transform:'translateY(-5%)','animation-timing-function':'cubic-bezier(0.8,0,1,1)'},
                       '50%': {transform:'none','animation-timing-function':'cubic-bezier(0,0,0.2,1)'} },
      },
    },
  },
  plugins: [
    forms({ strategy: 'class' }),
  ],
}
