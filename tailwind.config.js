const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./content/**/*.{html,js,md}', './layouts/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        grey: '#ddd',
        greeny: '#3E4939',
        yellow: '#FFFF11',
        orange: '#F09139',
        'social-instagram': '#F66C32',
      },
    },
    fontFamily: {
      ...fontFamily,
      sans: ['Inter', ...fontFamily.sans],
    },
    fontSize: {
      xs: ['0.75rem'],
      sm: ['0.875rem'],
      base: ['1rem'],
      lg: ['1.125rem', '1.9rem'],
      xl: ['1.25rem'],
      '2xl': ['1.5rem'],
      '3xl': ['1.875rem'],
      '4xl': ['2.25rem'],
      '5xl': ['3rem'],
      '6xl': ['3.75rem'],
      '7xl': ['4.5rem'],
      '8xl': ['6rem'],
      '9xl': ['8rem'],
    },
  },
  plugins: [],
};
