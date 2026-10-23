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
	// TODO: Update availability month/window as schedule changes.
	availability: 'Currently taking on freelance projects from November 2026',
	ogImage: 'images/og-card/about-2024-Q1-A-2x1.jpg',
	fathomSite: 'BCUBYJDW',
	rssTitle: 'Blog Posts from Daniel Freytag',
	rssLimit: 20,
	menus: {
		main: [
			{ name: 'Work', href: '/work/' },
			{ name: 'Services', href: '/services/' },
			{ name: 'Blog', href: '/blog/' },
			{ name: 'About', href: '/about/' },
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
