/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#030303', // Deepest Obsidian Black
          800: '#0a0a0c', // Dark Midnight
          700: '#151518', // Very dark gray for borders
        },
        brand: {
          blue: '#38bdf8', // Elegant sky blue
          light: '#7dd3fc', // Very light blue for highlights
          accent: '#818cf8', // Indigo accent
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}