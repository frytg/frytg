export type EditorialNode = {
	type: string
	tagName?: string
	properties?: Record<string, unknown>
	children?: EditorialNode[]
	value?: string
}

const SECTION_CLASSES = ['editorial-row', 'editorial-section'] as const
const HEADING = /^h[1-6]$/

/**
 * read normalized element classes.
 * @param node source node.
 * @returns class names, excluding non-string values.
 */
const classNames = (node: EditorialNode): string[] => {
	const value = node.properties?.className ?? []
	return (Array.isArray(value) ? value : [value]).filter((item): item is string => typeof item === 'string')
}

/**
 * identify standalone media that should remain outside a split reading column.
 * @param node source node, including raw HTML from the image pipeline.
 * @returns whether this node occupies the full section width.
 */
const isFullWidthMedia = (node: EditorialNode): boolean => {
	if (node.type === 'raw') {
		return /^\s*<(?:div|figure|picture|img)\b/.test(node.value ?? '') && /<(?:picture|img)\b/.test(node.value ?? '')
	}
	return node.type === 'element' && ['figure', 'picture', 'img'].includes(node.tagName ?? '')
}

/**
 * group marked headings and their following content; preserve heading depth and source order.
 * @param nodes sibling nodes to compose.
 * @returns semantic sections, with unmarked content left intact.
 */
const groupSections = (nodes: EditorialNode[]): EditorialNode[] => {
	const result: EditorialNode[] = []
	let index = 0

	while (index < nodes.length) {
		const heading = nodes[index]
		if (!heading) {
			break
		}
		const classes = classNames(heading)
		const sectionClass = SECTION_CLASSES.find((name) => classes.includes(name))
		if (heading.type !== 'element' || !HEADING.test(heading.tagName ?? '') || !sectionClass) {
			result.push(heading)
			index += 1
			continue
		}

		const depth = Number(heading.tagName?.slice(1))
		const body: EditorialNode[] = []
		index += 1
		while (index < nodes.length) {
			const next = nodes[index]
			if (!next) {
				break
			}
			const nextDepth = HEADING.test(next.tagName ?? '') ? Number(next.tagName?.slice(1)) : undefined
			if (
				(nextDepth !== undefined && nextDepth <= depth) ||
				next.tagName === 'hr' ||
				(sectionClass === 'editorial-row' && isFullWidthMedia(next))
			) {
				break
			}
			body.push(next)
			index += 1
		}

		heading.properties = {
			...heading.properties,
			className: classes.filter((name) => name !== sectionClass),
		}
		result.push({
			type: 'element',
			tagName: 'section',
			properties: { className: [sectionClass], ariaLabelledBy: heading.properties.id },
			children: [
				heading,
				{
					type: 'element',
					tagName: 'div',
					properties: { className: ['editorial-body'] },
					children: groupSections(body),
				},
			],
		})
	}

	return result
}

/**
 * compose explicitly marked editorial sections after heading attributes and anchors resolve.
 * @returns a build-time plugin; no client-side layout code.
 */
export const rehypeEditorial = () => {
	return (tree: { type: string; children?: EditorialNode[] }): void => {
		if (tree.children) {
			tree.children = groupSections(tree.children)
		}
	}
}
