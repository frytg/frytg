const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
	content: ['./content/**/*.{html,js,md}', './layouts/**/*.{html,js}'],
	theme: {
		extend: {
			colors: {
				white: 'var(--frytg-color-off-white)',
				yellow: 'var(--frytg-color-yellow)',
				orange: 'var(--frytg-color-orange)',
				grey: 'var(--frytg-color-grey)',
				greeny: 'var(--frytg-color-greeny)',
				'social-instagram': '#F66C32',
			},
		},
		fontFamily: {
			...fontFamily,
			sans: ['InterVariable', ...fontFamily.sans],
		},
		fontSize: {
			xs: ['0.75rem'],
			sm: ['0.875rem'],
			base: ['1rem', '1.5rem'],
			lg: ['1.125rem', '1.9rem'],
			xl: ['1.25rem', '2rem'],
			'2xl': ['1.5rem', '2.1rem'],
			'3xl': ['1.875rem', '2.25rem'],
			'4xl': ['2.25rem', '2.5rem'],
			'5xl': ['3rem', '3.5rem'],
			'6xl': ['3.75rem', '4rem'],
			'7xl': ['4.5rem', '5rem'],
			'8xl': ['6rem'],
			'9xl': ['8rem'],
		},
	},
	plugins: [],
}
