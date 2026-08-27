import { absoluteUrl, site } from '../site.ts'
import { OG_HEIGHT, OG_WIDTH, renderOgImage } from './responsive-images.ts'

export const WEBSITE_ID = `${site.baseURL}#website`
export const PERSON_ID = `${site.baseURL}#person`

type PersonFields = {
	description?: string
	image?: string
}

type BlogPostingFields = {
	headline: string
	url: string
	description: string
	imageUrl: string
	datePublished: string
	dateModified: string
	keywords: string[]
	wordCount: number
}

/**
 * @returns Profile URLs for Person.sameAs (Mastodon, GitHub, LinkedIn, …).
 */
export const sameAsUrls = (): string[] => site.menus.social.map((item) => item.url)

/**
 * @param markdown Raw Markdown body.
 * @returns Whitespace-delimited word count.
 */
export const countWords = (markdown: string): number => markdown.trim().split(/\s+/u).filter(Boolean).length

/**
 * @param assetPath Front-matter or default OG asset path.
 * @returns Absolute URL of the cropped 1200×630 JPG.
 */
export const absoluteOgImageUrl = async (assetPath: string): Promise<string> => {
	const rendered = (await renderOgImage(assetPath)) ?? (await renderOgImage(site.ogImage))
	return absoluteUrl(rendered ?? site.ogImage)
}

/**
 * Full Person node. `sameAs` is the identity graph Google uses to join this
 * site to Mastodon, Bluesky, GitHub, LinkedIn, and the other listed profiles.
 * @param fields Optional description and image URL.
 * @returns schema.org Person.
 */
export const personNode = (fields: PersonFields = {}): Record<string, unknown> => ({
	'@type': 'Person',
	'@id': PERSON_ID,
	name: site.author.name,
	url: site.baseURL,
	jobTitle: site.author.jobTitle,
	sameAs: sameAsUrls(),
	...(fields.description ? { description: fields.description } : {}),
	...(fields.image ? { image: fields.image } : {}),
})

/**
 * @param url Absolute image URL.
 * @returns schema.org ImageObject at OG dimensions.
 */
export const ogImageObject = (url: string): Record<string, unknown> => ({
	'@type': 'ImageObject',
	url,
	width: OG_WIDTH,
	height: OG_HEIGHT,
})

/**
 * Homepage WebSite + Person graph. Person.sameAs lists every social profile.
 * @param fields Site description and Person image URL.
 * @returns JSON-LD `@graph` payload.
 */
export const homeJsonLd = (fields: { description: string; imageUrl: string }): Record<string, unknown> => ({
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebSite',
			'@id': WEBSITE_ID,
			url: site.baseURL,
			name: site.title,
			description: fields.description,
			inLanguage: site.locale,
			publisher: { '@id': PERSON_ID },
		},
		personNode({ description: fields.description, image: fields.imageUrl }),
	],
})

/**
 * @param fields Article metadata.
 * @returns schema.org BlogPosting whose author is the same Person (including sameAs).
 */
export const blogPostingJsonLd = (fields: BlogPostingFields): Record<string, unknown> => ({
	'@context': 'https://schema.org',
	'@type': 'BlogPosting',
	headline: fields.headline,
	url: fields.url,
	mainEntityOfPage: { '@type': 'WebPage', '@id': fields.url },
	description: fields.description,
	image: ogImageObject(fields.imageUrl),
	author: personNode({ image: fields.imageUrl }),
	publisher: { '@id': PERSON_ID },
	datePublished: fields.datePublished,
	dateModified: fields.dateModified,
	keywords: fields.keywords,
	wordCount: fields.wordCount,
})
