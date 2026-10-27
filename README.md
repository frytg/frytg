# ✨ Hello world, I'm Dan ✨

```js
export default {
	nickName: 'Dan',
	pronouns: ['he', 'him'],
	location: 'Black Forest, Germany',
	techStack: [
		'JavaScript',
		'rust',
		'go',
		'Node.js',
		'Bun',
		'Deno',
		'Vue.js',
		'Vite',
		'google-cloud-platform',
		'aws',
		'fastly',
		'terraform',
	],
	interests: [
		'eu',
		'privacy',
		'security',
		'cloud',
		'IoT',
		'DevOps',
		'SRE',
		'infrastructure-as-code',
		'outdoors',
		'cycling',
		'nature',
		'vanlife',
	],
	webUrl: 'https://www.frytg.digital/',
}
```

## services page

`content/services.md` owns the copy; the `.services-page` rules in `assets/css/main.css` own the layout.
short outcome-led sections replace hypothetical packages and tool inventories; real evidence links to `/work/`.
existing service anchors stay stable for homepage links.

- each service heading has a `.service-summary` paragraph and a `.service-proof` paragraph; keep that source order.
- desktop uses a heading rail beside the copy; mobile stacks everything in reading order. no extra javascript.
- the services page skips the footer availability callout; its own contact section already handles that job.
- run `just lint` and `just build`; the build checks service rows, anchors, and internal links.
- run `just preview` to review the production build locally; check narrow and desktop widths before deploying.
- design reference: [dotfiles design system](https://tangled.org/frytg.digital/dotfiles/blob/main/context/DESIGN.md).

Learn more on [frytg.digital](https://www.frytg.digital/) and find me on several social media sites: [frytg.digital/social](https://www.frytg.digital/social) 🤝

📻 You can check out some of my work at [github.com/swrlab](https://github.com/swrlab) or [lab.swr.de](https://lab.swr.de), where we are developing future radio experiences with a strong focus on modern tools and audio projects.

I'm also the man behind some other websites, helping them scale and deliver pages with the best-possible performance to millions of users.

![Profile Details](https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=frytg&theme=github_dark)
