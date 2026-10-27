import type { EditorialNode } from '../src/plugins/rehype-editorial.ts'
import { strict as assert } from 'node:assert'
import { rehypeEditorial } from '../src/plugins/rehype-editorial.ts'
import { rehypeMarkup } from '../src/plugins/rehype-markup.ts'

/**
 * create a text-bearing element fixture.
 * @param tagName element tag.
 * @param value visible text, including optional heading attributes.
 * @returns a source element.
 */
const element = (tagName: string, value: string): EditorialNode => ({
	type: 'element',
	tagName,
	children: [{ type: 'text', value }],
})

/**
 * run the production heading and section transforms.
 * @param children source nodes.
 * @returns composed root nodes.
 */
const compose = (children: EditorialNode[]): EditorialNode[] => {
	const tree = { type: 'root', children }
	rehypeMarkup()(tree)
	rehypeEditorial()(tree)
	return tree.children
}

/**
 * check section structure and return its content body.
 * @param section composed section.
 * @param id expected heading id and accessible section label.
 * @returns body children.
 */
const bodyOf = (section: EditorialNode | undefined, id: string): EditorialNode[] => {
	assert.equal(section?.tagName, 'section')
	assert.equal(section?.properties?.ariaLabelledBy, id)
	assert.equal(section?.children?.[0]?.properties?.id, id)
	assert.equal(section?.children?.[1]?.tagName, 'div')
	assert.deepEqual(section?.children?.[1]?.properties?.className, ['editorial-body'])
	return section?.children?.[1]?.children ?? []
}

/**
 * read the inferred class of a paragraph, or null when it keeps default styling.
 * @param node body child.
 * @returns inferred class name.
 */
const inferred = (node: EditorialNode | undefined): string | null => {
	assert.equal(node?.tagName, 'p')
	const classes = (node?.properties?.className as string[] | undefined) ?? []
	return classes.length ? classes[0] : null
}

// ordinary headings and paragraphs stay untouched
const ordinary = [element('h2', 'ordinary heading'), element('p', 'unchanged content')]
const ordinaryResult = compose(ordinary)
assert.equal(ordinaryResult[0], ordinary[0])
assert.equal(ordinaryResult[1], ordinary[1])
assert.equal(ordinaryResult[0]?.properties?.id, 'ordinary-heading')

// row bodies accept any paragraph count; first paragraph is the summary, last becomes the note
for (const [count, expected] of [
	[0, []],
	[1, ['editorial-summary']],
	[2, ['editorial-summary', 'editorial-note']],
	[3, ['editorial-summary', null, 'editorial-note']],
] as const) {
	const paragraphs = Array.from({ length: count }, (_, i) => element('p', `paragraph ${i}`))
	const result = compose([
		element('h2', 'flexible section {#stable-link .editorial-row}'),
		...paragraphs,
		element('h2', 'next section'),
	])
	const body = bodyOf(result[0], 'stable-link')
	assert.deepEqual(
		body.map((node) => inferred(node)),
		expected as readonly string[]
	)
	assert.equal(result[1]?.tagName, 'h2')
	assert.equal(result[1]?.properties?.id, 'next-section')
}

// page opening: path before h1, intro after h1, context after the cta row
const opening = compose([
	element('p', '`/services`'),
	element('h1', 'page headline'),
	element('p', 'opening sentence'),
	element('p', 'buttons\n{.cta-row}'),
	element('p', 'location line'),
	element('h2', 'first section {.editorial-row}'),
	element('p', 'section body'),
])
const openingBody = bodyOf(
	opening.find((node) => node.tagName === 'section' && node.properties?.ariaLabelledBy === 'first-section'),
	'first-section'
)
assert.equal(inferred(opening[0]), 'editorial-path')
assert.equal(inferred(opening[2]), 'editorial-intro')
assert.equal(inferred(opening[4]), 'editorial-context')
assert.equal(inferred(openingBody[0]), 'editorial-summary')

// explicit markers win over inference, and the cta row stays explicit
const explicit = compose([element('h2', 'section {.editorial-section}'), element('p', 'buttons\n{.cta-row}')])
const explicitBody = bodyOf(explicit[0], 'section')
assert.deepEqual(explicitBody[0]?.properties?.className, ['cta-row'])

// section bodies: list leads, image examples, and notes
const imageNode: EditorialNode = {
	type: 'element',
	tagName: 'p',
	children: [{ type: 'element', tagName: 'img', properties: { src: '/example.webp' } }],
}
const chartNode: EditorialNode = {
	type: 'element',
	tagName: 'p',
	children: [
		{
			type: 'element',
			tagName: 'a',
			properties: { href: 'https://example.com' },
			children: [{ type: 'element', tagName: 'img', properties: { src: 'https://example.com/chart.svg' } }],
		},
	],
}
const section = compose([
	element('h2', 'chapter {.editorial-section}'),
	element('p', 'three ways to work'),
	element('ul', 'list content'),
	element('p', 'supporting text'),
	imageNode,
	element('p', 'closing line'),
	element('h2', 'outro {.editorial-section}'),
	chartNode,
	element('p', 'contact hint'),
])
const chapter = bodyOf(section[0], 'chapter')
assert.equal(inferred(chapter[0]), 'editorial-list-lead')
assert.equal(inferred(chapter[2]), null)
assert.equal(inferred(chapter[4]), 'editorial-note')
const outro = bodyOf(section[1], 'outro')
assert.equal(inferred(outro[0]), 'editorial-media')
assert.equal(inferred(outro[1]), 'editorial-note')

// nested sections, full-width media, and horizontal rules end split rows
const image: EditorialNode = {
	type: 'raw',
	value: '<div class="content-column"><picture><img src="/example.webp" alt="example"></picture></div>',
}
const separator = element('hr', '')
const detail = element('p', 'project detail')
const nested = compose([
	element('h2', 'chapter {.editorial-section}'),
	element('h3', 'project {.editorial-row}'),
	detail,
	image,
	element('h3', 'another project {.editorial-row}'),
	element('ul', 'list content'),
	separator,
	element('h2', 'closing {.editorial-section}'),
	element('p', 'contact'),
])
const chapterBody = bodyOf(nested[0], 'chapter')
assert.deepEqual(bodyOf(chapterBody[0], 'project'), [detail])
assert.equal(chapterBody[1], image)
assert.equal(bodyOf(chapterBody[2], 'another-project')[0]?.tagName, 'ul')
assert.equal(nested[1], separator)
assert.equal(inferred(bodyOf(nested[2], 'closing')[0]), null)

// inline headings with custom ids and anchors keep working
const inlineHeading: EditorialNode = {
	type: 'element',
	tagName: 'h3',
	children: [element('code', 'sample-tool'), { type: 'text', value: ' {#custom-id .editorial-row}' }],
}
const inlineResult = compose([inlineHeading])
bodyOf(inlineResult[0], 'custom-id')
assert.equal(inlineHeading.children?.[0]?.children?.[0]?.value, 'sample-tool')
assert.equal(inlineHeading.children?.at(-1)?.properties?.href, '#custom-id')

// duplicate heading ids get unique suffixes
const duplicate = compose([
	element('h2', 'same heading {.editorial-row}'),
	element('h2', 'same heading {.editorial-row}'),
])
bodyOf(duplicate[0], 'same-heading')
bodyOf(duplicate[1], 'same-heading-1')

console.log(
	'editorial verification passed; inferred classes, explicit overrides, flexible bodies, nested sections, and anchors'
)
