module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        customBlue: {
          DEFAULT: "#002F63",
          50: "#E6E9F2",
          100: "#CCD3E6",
          200: "#99A6CD",
          300: "#6678B4",
          400: "#335B9B",
          500: "#002F63",
          600: "#002950",
          700: "#001F3D",
          800: "#00152A",
          900: "#000B17",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
}
