import type { APIContext } from 'astro'
import { site } from '../site.ts'

/** @param context Astro endpoint context. @returns `robots.txt`. */
export const GET = (context: APIContext): Response => {
	const sitemap = new URL('sitemap.xml', context.site ?? site.baseURL).href
	const body = `User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`
	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	})
}
