export const site = {
	title: 'Daniel Freytag',
	baseURL: 'https://www.frytg.digital/',
	locale: 'en-US',
	author: {
		email: 'contact@frytg.com',
		name: 'Daniel Freytag',
	},
	ogImage: 'images/og-card/about-2024-Q1-A-2x1.jpg',
	fathomSite: 'BCUBYJDW',
	rssLimit: 20,
	menus: {
		main: [
			{ name: '/about', href: '/' },
			{ name: '/social', href: '/social/' },
			{ name: '/blog', href: '/blog/' },
			{ name: '/uses', href: '/uses/' },
			{ name: '/dev', href: '/dev/' },
		],
		social: [
			{
				name: 'Mastodon',
				url: 'https://beoriginal.social/@FRYTG',
				handle: '@FRYTG@beoriginal.social',
				post: ',',
			},
			{
				name: 'Matrix',
				url: 'https://matrix.to/#/@frytg:beoriginal.social',
				handle: '@frytg:beoriginal.social',
				post: ',',
			},
			{
				name: 'Bluesky',
				url: 'https://bsky.app/profile/frytg.digital',
				handle: '@FRYTG',
				post: ',',
			},
			{
				name: 'GitHub',
				url: 'https://github.com/FRYTG',
				handle: '@FRYTG',
				post: ',',
			},
			{
				name: 'Instagram',
				url: 'https://www.instagram.com/dan.frytg/',
				handle: 'dan.frytg',
				post: ',',
			},
			{
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/frytg/',
				handle: 'frytg',
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
