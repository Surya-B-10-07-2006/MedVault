/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        medBlue: {
          DEFAULT: '#2D9CDB',
          light: '#E4F2FF',
        },
        medTeal: '#27AE60',
        medGrey: '#F4F6F8',
        medDark: '#1B2631',
        primary: {
          50: '#e6f7f9',
          100: '#b3e7ee',
          200: '#80d7e3',
          300: '#4dc7d8',
          400: '#26b8cc',
          500: '#2D9CDB',
          600: '#2589C1',
          700: '#1C6B98',
          800: '#144E6F',
          900: '#0B3145',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        card: '0 4px 6px -1px rgba(13, 148, 136, 0.08), 0 2px 4px -2px rgba(13, 148, 136, 0.04)',
      },
      animation: {
        'cross-spin': 'crossSpin 1.5s ease-in-out infinite',
      },
      keyframes: {
        crossSpin: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};
