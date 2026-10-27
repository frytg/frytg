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

const ordinary = [element('h2', 'ordinary heading'), element('p', 'unchanged content')]
const ordinaryResult = compose(ordinary)
assert.equal(ordinaryResult[0], ordinary[0])
assert.equal(ordinaryResult[1], ordinary[1])
assert.equal(ordinaryResult[0]?.properties?.id, 'ordinary-heading')

for (const count of [0, 1, 3]) {
	const paragraphs = Array.from({ length: count }, (_, index) => element('p', `paragraph ${index}`))
	const result = compose([
		element('h2', 'flexible section {#stable-link .editorial-row}'),
		...paragraphs,
		element('h2', 'next section'),
	])
	assert.deepEqual(bodyOf(result[0], 'stable-link'), paragraphs)
	assert.equal(result[1]?.tagName, 'h2')
	assert.equal(result[1]?.properties?.id, 'next-section')
}

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
const chapter = bodyOf(nested[0], 'chapter')
assert.deepEqual(bodyOf(chapter[0], 'project'), [detail])
assert.equal(chapter[1], image)
assert.equal(bodyOf(chapter[2], 'another-project')[0]?.tagName, 'ul')
assert.equal(nested[1], separator)
assert.equal(bodyOf(nested[2], 'closing')[0]?.children?.[0]?.value, 'contact')

const inlineHeading: EditorialNode = {
	type: 'element',
	tagName: 'h3',
	children: [element('code', 'sample-tool'), { type: 'text', value: ' {#custom-id .editorial-row}' }],
}
const inlineResult = compose([inlineHeading])
bodyOf(inlineResult[0], 'custom-id')
assert.equal(inlineHeading.children?.[0]?.children?.[0]?.value, 'sample-tool')
assert.equal(inlineHeading.children?.at(-1)?.properties?.href, '#custom-id')

const duplicate = compose([
	element('h2', 'same heading {.editorial-row}'),
	element('h2', 'same heading {.editorial-row}'),
])
bodyOf(duplicate[0], 'same-heading')
bodyOf(duplicate[1], 'same-heading-1')

console.log('editorial verification passed; flexible bodies, nested sections, media, plain content, and anchors')
