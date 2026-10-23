import { absoluteUrl, site } from '../site.ts'
import { OG_HEIGHT, OG_WIDTH, renderOgImage } from './responsive-images.ts'

export const WEBSITE_ID = `${site.baseURL}#website`
export const PERSON_ID = `${site.baseURL}#person`
export const SERVICE_ID = `${site.baseURL}#service`
export const AREA_SERVED = ['DE', 'AT', 'CH', 'EU'] as const

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

type PageJsonLdFields = {
	id: string
	title: string
	url: string
	description: string
	imageUrl: string
}

/**
 * @returns Profile URLs for Person.sameAs (LinkedIn, Mastodon, Tangled, GitHub, …).
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
 * site to LinkedIn, Mastodon, Tangled, Bluesky, GitHub, and other listed profiles.
 * @param fields Optional description and image URL.
 * @returns schema.org Person.
 */
export const personNode = (fields: PersonFields = {}): Record<string, unknown> => ({
	'@type': 'Person',
	'@id': PERSON_ID,
	name: site.author.name,
	url: site.baseURL,
	email: site.author.email,
	jobTitle: site.author.jobTitle,
	areaServed: AREA_SERVED,
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'Ehrenkirchen (Freiburg region)',
		addressRegion: 'Baden-Württemberg',
		addressCountry: 'DE',
	},
	knowsAbout: [
		'DevOps',
		'Cloud Infrastructure',
		'Terraform',
		'Kubernetes',
		'EU Cloud Migration',
		'Audio & Broadcast Engineering',
		'TypeScript',
		'Go',
		'Rust',
		'Self-Hosted AI',
	],
	sameAs: sameAsUrls(),
	...(fields.description ? { description: fields.description } : {}),
	...(fields.image ? { image: fields.image } : {}),
})

/**
 * schema.org ProfessionalService node describing freelance engineering services.
 * @param fields Optional description and image URL.
 * @returns schema.org ProfessionalService.
 */
export const professionalServiceNode = (fields: PersonFields = {}): Record<string, unknown> => ({
	'@type': 'ProfessionalService',
	'@id': SERVICE_ID,
	name: `${site.author.name} – Freelance DevOps & Backend Engineering`,
	url: absoluteUrl('/services/'),
	email: site.author.email,
	provider: { '@id': PERSON_ID },
	founder: { '@id': PERSON_ID },
	areaServed: AREA_SERVED,
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'Ehrenkirchen (Freiburg region)',
		addressRegion: 'Baden-Württemberg',
		addressCountry: 'DE',
	},
	serviceType: [
		'Cloud & DevOps for Small Teams',
		'EU-Sovereign Hosting & Cloud Migrations',
		'Audio & Broadcast Backend Engineering',
		'Backend & API Development (TypeScript, Go, Rust)',
		'Self-Hosted & Privacy-First AI',
		'Infrastructure & Software Maintenance Retainers',
	],
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
 * Homepage WebSite + Person + ProfessionalService graph.
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
		professionalServiceNode({ description: fields.description, image: fields.imageUrl }),
	],
})

/**
 * Content page JSON-LD (`WebPage` / `ProfilePage` + `Person` + `ProfessionalService`).
 * @param fields Page metadata.
 * @returns JSON-LD `@graph` payload.
 */
export const pageJsonLd = (fields: PageJsonLdFields): Record<string, unknown> => {
	const pageType = fields.id === 'about' ? 'ProfilePage' : 'WebPage'
	const includeService = fields.id === 'services' || fields.id === 'work' || fields.id === 'about'
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': pageType,
				'@id': fields.url,
				name: fields.title,
				url: fields.url,
				description: fields.description,
				isPartOf: { '@type': 'WebSite', '@id': WEBSITE_ID },
				about: { '@id': PERSON_ID },
				...(fields.id === 'about' ? { mainEntity: { '@id': PERSON_ID } } : {}),
			},
			personNode({ image: fields.imageUrl }),
			...(includeService ? [professionalServiceNode({ description: fields.description, image: fields.imageUrl })] : []),
		],
	}
}

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
