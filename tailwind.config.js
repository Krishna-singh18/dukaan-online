/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#176B3A',
          dark: '#10512B',
          light: '#E8F5E9',
        },
        secondary: '#E8F5E9',
        background: '#FAFCF8',
        surface: '#FFFFFF',
        mainText: '#202820',
        secondaryText: '#6B746B',
        accent: '#F5A623',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

