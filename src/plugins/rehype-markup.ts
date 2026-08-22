import { visit } from 'unist-util-visit'

type HastText = {
	type: 'text'
	value: string
}

type HastElement = {
	type: 'element'
	tagName: string
	properties?: Record<string, unknown> & { class?: string | string[]; className?: string | string[] }
	children?: Array<HastText | HastElement>
}

const ATTR_LINE = /(?:^|\n)\{\s*((?:\.[A-Za-z0-9_-]+\s*)+)\s*\}$/
const HEADING = /^h[1-6]$/

/**
 * @param tokenList `{.a .b}` inner tokens.
 * @returns Class names without the leading dots.
 */
const parseClassNames = (tokenList: string): string[] =>
	tokenList
		.trim()
		.split(/\s+/)
		.map((token) => token.slice(1))
		.filter(Boolean)

/**
 * @param node HAST node.
 * @returns Concatenated text.
 */
const toPlain = (node: HastText | HastElement): string => {
	if (node.type === 'text') {
		return node.value
	}
	return (node.children ?? []).map((child) => toPlain(child)).join('')
}

/**
 * @param node HAST node.
 * @returns Deepest last text node, if any.
 */
const lastTextNode = (node: HastText | HastElement): HastText | undefined => {
	if (node.type === 'text') {
		return node
	}
	const last = node.children?.at(-1)
	return last ? lastTextNode(last) : undefined
}

/**
 * @param value Heading text.
 * @returns URL fragment matching typical GitHub slugs.
 */
const slugify = (value: string): string => {
	const slug = value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/[\s-]+/g, '-')
	return slug || 'section'
}

/**
 * `{.class}` attributes plus heading ids/anchor links.
 * @returns Rehype plugin.
 */
export const rehypeMarkup = () => {
	return (tree: { type: string }): void => {
		const seen = new Map<string, number>()

		visit(tree, 'element', (node: HastElement) => {
			if (node.tagName === 'p') {
				const text = lastTextNode(node)
				if (!text) {
					return
				}

				const match = text.value.match(ATTR_LINE)
				if (!match?.[1]) {
					return
				}

				text.value = text.value.replace(ATTR_LINE, '')
				const className = parseClassNames(match[1])
				const existing = node.properties?.className ?? node.properties?.class ?? []
				const current = Array.isArray(existing) ? existing : [existing]
				node.properties = {
					...node.properties,
					className: [...current, ...className],
				}
				return
			}

			if (!HEADING.test(node.tagName)) {
				return
			}

			let id = slugify(toPlain(node))
			const count = seen.get(id) ?? 0
			seen.set(id, count + 1)
			if (count > 0) {
				id = `${id}-${count}`
			}

			node.properties = { ...node.properties, id }
			node.children = [
				...(node.children ?? []),
				{
					type: 'element',
					tagName: 'a',
					properties: {
						className: ['ml-1', 'text-base', 'no-underline', 'anchor-link'],
						href: `#${id}`,
						ariaLabel: 'Link to section',
					},
					children: [],
				},
			]
		})
	}
}
