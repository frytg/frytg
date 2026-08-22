import { getCollection } from 'astro:content'
import { publishedPosts } from '../lib/content.ts'
import { formatDateIso } from '../lib/dates.ts'
import { absoluteUrl, blogPermalink } from '../site.ts'

type SitemapEntry = {
	path: string
	lastmod?: Date
	changefreq?: string
	priority?: number
}

/**
 * @param value XML text.
 * @returns Escaped XML.
 */
const escapeXml = (value: string): string =>
	value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

/**
 * @param entry Sitemap URL fields.
 * @returns One `<url>` element.
 */
const urlElement = (entry: SitemapEntry): string => {
	const loc = escapeXml(absoluteUrl(entry.path))
	const lastmod = entry.lastmod ? `\n    <lastmod>${formatDateIso(entry.lastmod)}</lastmod>` : ''
	const changefreq = entry.changefreq ? `\n    <changefreq>${escapeXml(entry.changefreq)}</changefreq>` : ''
	const priority =
		typeof entry.priority === 'number' && entry.priority > 0
			? `\n    <priority>${entry.priority.toFixed(1)}</priority>`
			: ''
	return `  <url>\n    <loc>${loc}</loc>${lastmod}${changefreq}${priority}\n  </url>`
}

/** @returns `sitemap.xml` excluding noindex and term pages. */
export const GET = async (): Promise<Response> => {
	const [pages, posts] = await Promise.all([getCollection('pages'), publishedPosts()])
	const entries: SitemapEntry[] = []

	for (const page of pages) {
		if (page.data.noindex || page.data.sitemap?.disable) {
			continue
		}

		const path = page.id === '_index' ? '/' : `/${page.id}/`
		entries.push({
			path,
			lastmod: page.data.date,
			changefreq: page.data.sitemap?.changefreq ?? 'monthly',
			priority: page.data.sitemap?.priority,
		})
	}

	entries.push({
		path: '/blog/',
		changefreq: 'monthly',
	})

	for (const post of posts) {
		entries.push({
			path: blogPermalink(post.id),
			lastmod: post.data.date,
			changefreq: 'monthly',
		})
	}

	entries.push({ path: '/tags/', changefreq: 'monthly' }, { path: '/categories/', changefreq: 'monthly' })

	const xml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map((entry) => urlElement(entry)).join('\n')}
</urlset>
`

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	})
}
