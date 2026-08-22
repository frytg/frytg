import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const sitemapSchema = z
	.object({
		changefreq: z.string().optional(),
		priority: z.number().optional(),
		disable: z.boolean().optional(),
	})
	.optional()

const pages = defineCollection({
	loader: glob({ pattern: '{_index,social,uses,dev,legal}.md', base: './content' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date().optional(),
		seo_description: z.string().optional(),
		image: z.string().optional(),
		type: z.string().optional(),
		layout: z.string().optional(),
		noindex: z.boolean().optional(),
		sitemap: sitemapSchema,
	}),
})

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: './content/blog' }),
	schema: z.object({
		title: z.string(),
		draft: z.boolean().default(false),
		seo_description: z.string().optional(),
		summary: z.string().optional(),
		image: z.string().optional(),
		atprotoImage: z.string().optional(),
		date: z.coerce.date(),
		tags: z.array(z.string()).default([]),
		categories: z.array(z.string()).default([]),
		atUri: z.string().optional(),
		highlight_bold: z.boolean().optional(),
	}),
})

export const collections = { pages, blog }
