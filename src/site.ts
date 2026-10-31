export const site = {
	title: 'Daniel Freytag',
	documentTitle: 'Daniel Freytag – Freelance DevOps & Backend Engineer (Media, Audio & EU Cloud)',
	baseURL: 'https://www.frytg.digital/',
	locale: 'en-US',
	author: {
		email: 'contact@frytg.com',
		name: 'Daniel Freytag',
		jobTitle: 'DevOps & Backend Engineer',
	},
	availability: 'Currently taking on freelance projects',
	ogImage: 'images/og-card/about-2024-Q1-A-2x1.jpg',
	fathomSite: 'BCUBYJDW',
	umami: {
		scriptUrl: 'https://umami.frytg.digital/script.js',
		websiteId: '25be392c-432d-4dc2-8bb0-15a4b0c4811d',
	},
	rssTitle: 'Blog Posts from Daniel Freytag',
	rssLimit: 20,
	menus: {
		main: [
			{ name: 'About', href: '/' },
			{ name: 'Work', href: '/work/' },
			{ name: 'Services', href: '/services/' },
			{ name: 'Blog', href: '/blog/' },
			{ name: 'Social', href: '/social/' },
			{ name: 'Contact', href: '/services/#contact' },
		],
		social: [
			{
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/frytg/',
				handle: 'frytg',
				post: ',',
			},
			{
				name: 'Mastodon',
				url: 'https://beoriginal.social/@FRYTG',
				handle: '@FRYTG@beoriginal.social',
				post: ',',
			},
			{
				name: 'Tangled',
				url: 'https://tangled.org/frytg.digital',
				handle: 'frytg.digital',
				post: ',',
			},
			{
				name: 'GitHub',
				url: 'https://github.com/FRYTG',
				handle: '@FRYTG',
				post: ',',
			},
			{
				name: 'Bluesky',
				url: 'https://bsky.app/profile/frytg.digital',
				handle: '@frytg.digital',
				post: ',',
			},
			{
				name: 'Matrix',
				url: 'https://matrix.to/#/@frytg:beoriginal.social',
				handle: '@frytg:beoriginal.social',
				post: ',',
			},
			{
				name: 'Instagram',
				url: 'https://www.instagram.com/dan.frytg/',
				handle: 'dan.frytg',
				post: ',',
			},
			{
				name: 'Threads',
				url: 'https://threads.net/@dan.frytg/',
				handle: 'dan.frytg',
				post: ', or',
			},
			{
				name: 'Twitter',
				url: 'https://twitter.com/FRYTG',
				handle: '@FRYTG',
				post: '',
			},
		],
	},
} as const

/** @param slug Blog filename without `.md`. @returns Trailing-slash permalink. */
export const blogPermalink = (slug: string): string => `/blog/${slug}/`

/** @param path Absolute site path. @returns Absolute URL on the production origin. */
export const absoluteUrl = (path: string): string => new URL(path, site.baseURL).href
