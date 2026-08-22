import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

export type BlogPost = CollectionEntry<'blog'>

export type TaxonomyField = 'tags' | 'categories'

export type TaxonomyTerm = {
	name: string
	slug: string
	posts: BlogPost[]
}

/**
 * @param value Taxonomy name.
 * @returns URL slug for this site's ASCII tags/categories.
 */
export const urlize = (value: string): string =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')

/**
 * @returns Published blog posts, newest first.
 */
export const publishedPosts = async (): Promise<BlogPost[]> => {
	const posts = await getCollection('blog', ({ data }) => !data.draft)
	return posts.toSorted((left, right) => right.data.date.valueOf() - left.data.date.valueOf())
}

/**
 * @param posts Published posts.
 * @param field Front-matter taxonomy array.
 * @returns Unique terms with matching posts.
 */
export const taxonomyTerms = (posts: BlogPost[], field: TaxonomyField): TaxonomyTerm[] => {
	const names = [...new Set(posts.flatMap((post) => post.data[field]))].toSorted((left, right) =>
		left.localeCompare(right, 'en')
	)
	return names.map((name) => {
		const slug = urlize(name)
		return {
			name,
			slug,
			posts: posts.filter((post) => post.data[field].some((value) => urlize(value) === slug)),
		}
	})
}
