/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // MTB Brand Colour Palette
      colors: {
        brand: {
          red: '#DC2626',        // Primary red
          'red-dark': '#B91C1C', // Darker red for hover states
          'red-light': '#EF4444', // Lighter red for accents
          black: '#000000',      // Pure black
          dark: '#0A0A0A',       // Slightly off-black for surfaces
          surface: '#171717',    // Card/surface backgrounds
          gold: '#F59E0B',       // Accent for highlights
        }
      },
      // Custom fonts - Urbanist for headings and body
      fontFamily: {
        heading: ['Urbanist', 'sans-serif'],
        body: ['Urbanist', 'sans-serif'],
      },
      // Custom spacing for consistent layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Smooth animations
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

