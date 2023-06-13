/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      colors: {
        gray: {
          100: '#f5f7fa',
          200: '#e4eaf0',
          300: '#d3dde3',
          400: '#c2cfd6',
          500: '#dae7f8', // Base gray color
          600: '#a9b7c5',
          700: '#788693',
          800: '#465161',
          900: '#141b22',
        },
        blue: {
          100: '#ebf8ff',
          200: '#bee3f8',
          300: '#90cdf4',
          400: '#63b3ed',
          500: '#4299e1',
          600: '#3182ce',
          700: '#2b6cb0',
          800: '#2c5282',
          900: '#2a4365',
        },
        green: {
          100: '#f0fdf4',
          200: '#d1f9e1',
          300: '#a1f0c3',
          400: '#72e79e',
          500: '#50c878', // Base green color
          600: '#47b46d',
          700: '#3d9d62',
          800: '#338658',
          900: '#276c4d',
        },
      },
    },
  },
  plugins: [],
};
