import { visit } from 'unist-util-visit'
import { blogPermalink } from '../site.ts'

type LinkNode = {
	type: 'link'
	url: string
	title?: string | null
	data?: { hProperties?: Record<string, unknown> }
}

const ASSET_EXT = /\.(png|jpe?g|gif|webp|svg|pdf|mp4|zip)$/i

/**
 * @param url Markdown link destination.
 * @returns True when the destination is an absolute `http(s):` (or other scheme) URL.
 */
const isAbsoluteUrl = (url: string): boolean => /^[a-z][a-z\d+\-.]*:/i.test(url)

/**
 * Resolve a sibling `.md` (or extensionless) destination to `/blog/<slug>/`.
 * @param url Markdown link destination.
 * @returns Site-absolute href with optional fragment, or `undefined` to leave the URL alone.
 */
const resolveSiblingHref = (url: string): string | undefined => {
	if (isAbsoluteUrl(url) || url.startsWith('/') || url.startsWith('#')) {
		return undefined
	}

	const hashIndex = url.indexOf('#')
	const path = (hashIndex === -1 ? url : url.slice(0, hashIndex)).replace(/^\.\//, '')
	const fragment = hashIndex === -1 ? '' : url.slice(hashIndex)
	if (!path || ASSET_EXT.test(path) || path.includes('/')) {
		return undefined
	}

	const slug = path.replace(/\.md$/, '')
	return `${blogPermalink(slug)}${fragment}`
}

/**
 * Sibling Markdown filenames become permalinks; absolute URLs open externally.
 * @returns Remark plugin.
 */
export const remarkSiblingLinks = () => {
	return (tree: { type: string }): void => {
		visit(tree, 'link', (node: LinkNode) => {
			if (isAbsoluteUrl(node.url)) {
				node.data = {
					...node.data,
					hProperties: {
						...node.data?.hProperties,
						rel: 'external noopener',
						target: '_blank',
					},
				}
				return
			}

			const href = resolveSiblingHref(node.url)
			if (href) {
				node.url = href
			}
		})
	}
}
