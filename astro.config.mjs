import { unified } from '@astrojs/markdown-remark'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { responsiveImages } from './src/integrations/responsive-images.ts'
import { rehypeMarkup } from './src/plugins/rehype-markup.ts'
import { remarkHugoImages } from './src/plugins/remark-hugo-images.ts'
import { remarkSiblingLinks } from './src/plugins/remark-sibling-links.ts'

export default defineConfig({
	site: 'https://www.frytg.digital',
	trailingSlash: 'always',
	output: 'static',
	outDir: 'dist',
	publicDir: 'static',
	integrations: [responsiveImages()],
	markdown: {
		processor: unified({
			remarkPlugins: [remarkSiblingLinks, remarkHugoImages],
			rehypePlugins: [rehypeMarkup],
		}),
	},
	image: {
		service: {
			entrypoint: 'astro/assets/services/sharp',
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
})
