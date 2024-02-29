module.exports = {
  content: ['./content/**/*.{html,js,md}', './layouts/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        greeny: '#3E4939',
        yellow: '#FFFF11',
        orange: '#F09139',
      },
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
  },
  plugins: [],
};
