import type { APIContext } from 'astro'
import rss from '@astrojs/rss'
import { getCollection, render } from 'astro:content'
import { blogPermalink, site } from '../../site.ts'

/** @param context Astro endpoint context. @returns RSS 2.0 XML for `/blog/index.xml`. */
export const GET = async (context: APIContext): Promise<Response> => {
	const posts = (await getCollection('blog', ({ data }) => !data.draft))
		.toSorted((left, right) => right.data.date.valueOf() - left.data.date.valueOf())
		.slice(0, site.rssLimit)

	const items = await Promise.all(
		posts.map(async (post) => {
			await render(post)
			return {
				title: post.data.title,
				pubDate: post.data.date,
				description: post.data.summary ?? post.data.seo_description ?? '',
				link: blogPermalink(post.id),
				content: post.rendered?.html ?? '',
				customData: `<author>${site.author.email} (${site.author.name})</author>`,
			}
		})
	)

	return rss({
		title: `Blog Posts on ${site.title}`,
		description: `Recent content in Blog Posts on ${site.title}`,
		site: context.site ?? site.baseURL,
		trailingSlash: true,
		xmlns: {
			atom: 'http://www.w3.org/2005/Atom',
		},
		customData: [
			`<language>${site.locale}</language>`,
			`<managingEditor>${site.author.email} (${site.author.name})</managingEditor>`,
			`<webMaster>${site.author.email} (${site.author.name})</webMaster>`,
			`<copyright>© 2025 Daniel Freytag</copyright>`,
			`<atom:link href="${new URL('/blog/index.xml', context.site ?? site.baseURL).href}" rel="self" type="application/rss+xml" />`,
		].join(''),
		items,
	})
}
