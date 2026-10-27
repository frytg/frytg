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

## editorial pages

`content/services.md` and `content/work.md` use `layout: 'editorial'`;
`assets/css/editorial.css` owns their shared presentation. other pages keep the existing layout.

- mark split headings with `{.editorial-row}` or `{#stable-link .editorial-row}`.
  the build groups the heading and following content into a labelled section with a flexible body.
- use `{.editorial-section}` for full-width chapters or contact sections; nested split headings work too.
- a peer or higher-level heading ends the section. horizontal rules also end it; standalone image-pipeline media
  stays outside split rows so photos keep their full-width placement.
- everything else is inferred from position; no per-paragraph markers needed:
  paragraph before `h1` → path, first paragraph after `h1` → intro, paragraph after the cta row → context;
  in a row body the first paragraph → summary and the last → note; in a section body a paragraph before a
  list → list-lead, an image-only paragraph → media, and the last → note. all other paragraphs use the
  shared default. explicit `{.class}` markers still win over inference (e.g. `.cta-row`).
- work-page wording and links stay in Markdown; layout markers don't change either.
- run `just test`, `just lint`, and `just build`; the build also runs the editorial regression tests in
  `.scripts/verify-editorial.ts`.
  use `just preview` to check narrow and desktop layouts locally.
- design reference: [dotfiles design system](https://tangled.org/frytg.digital/dotfiles/blob/main/context/DESIGN.md).

mdx is not needed here: the `{#id .class}` heading markers plus positional inference cover this site's
needs. mdx would make sense only if pages later need real components or embedded interactivity.

Learn more on [frytg.digital](https://www.frytg.digital/) and find me on several social media sites: [frytg.digital/social](https://www.frytg.digital/social) 🤝

📻 You can check out some of my work at [github.com/swrlab](https://github.com/swrlab) or [lab.swr.de](https://lab.swr.de), where we are developing future radio experiences with a strong focus on modern tools and audio projects.

I'm also the man behind some other websites, helping them scale and deliver pages with the best-possible performance to millions of users.

![Profile Details](https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=frytg&theme=github_dark)
