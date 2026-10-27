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
 * assign an inferred class without overriding explicit classes like `.cta-row`.
 * @param node element to annotate.
 * @param className inferred class.
 */
const assign = (node: EditorialNode, className: string): void => {
	if (classNames(node).length) {
		return
	}
	node.properties = { ...node.properties, className: [className] }
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
 * whether a paragraph renders as a single image, optionally wrapped in a link.
 * @param node paragraph element.
 * @returns whether to size it as an image example.
 */
const isImageParagraph = (node: EditorialNode): boolean => {
	const children = node.children ?? []
	if (children.length !== 1) {
		return false
	}
	const inner = children[0]
	if (inner?.type === 'element' && inner.tagName === 'img') {
		return true
	}
	if (inner?.type === 'element' && inner.tagName === 'a') {
		const linked = inner.children ?? []
		return linked.length === 1 && linked[0]?.type === 'element' && linked[0]?.tagName === 'img'
	}
	return false
}

/**
 * apply the shared editorial conventions inside a section body: image examples,
 * list leads, and first/last paragraph styling. explicit classes always win.
 * @param body direct children of a section body.
 * @param kind row (split reading column) or section (full-width).
 */
const annotateBody = (body: EditorialNode[], kind: 'row' | 'section'): void => {
	const paragraphs = body
		.map((node, index) => ({ node, index }))
		.filter((entry) => entry.node.type === 'element' && entry.node.tagName === 'p')
	const firstParagraph = paragraphs[0]?.node
	const lastParagraph = paragraphs.at(-1)?.node

	for (const entry of paragraphs) {
		const { node, index } = entry
		const next = body[index + 1]
		const nextIsList = next?.type === 'element' && (next.tagName === 'ul' || next.tagName === 'ol')
		if (nextIsList) {
			assign(node, 'editorial-list-lead')
			continue
		}
		if (kind === 'section' && isImageParagraph(node)) {
			assign(node, 'editorial-media')
			continue
		}
		if (node === firstParagraph && kind === 'row') {
			assign(node, 'editorial-summary')
			continue
		}
		if (node === lastParagraph && paragraphs.length > 1) {
			assign(node, 'editorial-note')
		}
	}
}

/**
 * annotate the page opening: path, intro, and context paragraphs.
 * @param nodes top-level page nodes, before the first section.
 */
const annotateOpening = (nodes: EditorialNode[]): void => {
	const firstSection = nodes.findIndex((node) => {
		if (node.type !== 'element' || !HEADING.test(node.tagName ?? '')) {
			return false
		}
		return SECTION_CLASSES.some((name) => classNames(node).includes(name))
	})
	const end = firstSection === -1 ? nodes.length : firstSection

	for (let index = 0; index < end; index += 1) {
		const node = nodes[index]
		if (node?.type !== 'element' || node.tagName !== 'p') {
			continue
		}
		const prev = nodes[index - 1]
		const next = nodes[index + 1]
		const prevIsH1 = prev?.type === 'element' && prev.tagName === 'h1'
		const nextIsH1 = next?.type === 'element' && next.tagName === 'h1'
		const prevIsCta = prev?.type === 'element' && classNames(prev).includes('cta-row')
		if (nextIsH1) {
			assign(node, 'editorial-path')
		} else if (prevIsH1) {
			assign(node, 'editorial-intro')
		} else if (prevIsCta) {
			assign(node, 'editorial-context')
		}
	}
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
		const bodyChildren = groupSections(body)
		annotateBody(bodyChildren, sectionClass === 'editorial-row' ? 'row' : 'section')
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
					children: bodyChildren,
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
			annotateOpening(tree.children)
			tree.children = groupSections(tree.children)
		}
	}
}
