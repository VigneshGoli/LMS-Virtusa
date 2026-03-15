/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f58025', // MLRIT orange
          600: '#e86f15',
          700: '#cf600f',
        },
        secondary: {
          DEFAULT: '#009444', // MLRIT green
          600: '#007a38',
          700: '#00602d',
        },
        neutral: {
          50: '#f8fafc',
          100: '#edf1f7',
        },
      },
      keyframes: {
        'gradient-slow': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(12px, -18px, 0) scale(1.05)' },
        },
      },
      animation: {
        'gradient-slow': 'gradient-slow 22s ease-in-out infinite',
        'float-slow': 'float-slow 24s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

