/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette Life Manager — reprise à l'identique
        surface: {
          950: '#0d0a07',
          900: '#1a1208',
          800: '#2a1e0f',
          700: '#3d2e18',
          600: '#5c4425',
          500: '#7a5c35',
          400: '#a07848',
          300: '#c49a62',
          200: '#d4b48a',
          100: '#e8d5b5',
          50:  '#f5ede0',
        },
        primary: {
          900: '#3b1a00',
          800: '#5c2800',
          700: '#7a3800',
          600: '#9c4d00',
          500: '#c06400',
          400: '#d97c1a',
          300: '#e8962e',
          200: '#f0ae52',
          100: '#f7cc88',
          50:  '#fde9c4',
        },
        accent: {
          500: '#d4a853',
          400: '#e0bc72',
          300: '#e8cc8a',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
