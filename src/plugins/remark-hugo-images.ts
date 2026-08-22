import { visit } from 'unist-util-visit'
import { renderResponsivePicture } from '../lib/responsive-images.ts'

type ImageNode = {
	type: 'image'
	url: string
	alt?: string | null
	title?: string | null
}

type HtmlNode = {
	type: 'html'
	value: string
}

type ParentNode = {
	children: Array<ImageNode | HtmlNode | { type: string; value?: string }>
}

type ImageJob = {
	image: ImageNode
	index: number
	parent: ParentNode
}

/**
 * @param node mdast child.
 * @returns True for nodes that do not produce visible content.
 */
const isIgnorable = (node: { type: string; value?: string }): boolean =>
	node.type === 'text' && !(node.value ?? '').trim()

/**
 * @param jobs Image replacements to apply.
 */
const applyJobs = async (jobs: ImageJob[]): Promise<void> => {
	for (const job of jobs) {
		const html = await renderResponsivePicture(job.image.url, job.image.alt ?? '', job.image.title)
		if (html) {
			job.parent.children[job.index] = { type: 'html', value: html }
		}
	}
}

/**
 * Replace Markdown images that use Hugo global `images/` paths with Sharp `<picture>` HTML.
 * Standalone image paragraphs become a single HTML block so we don't leave empty `<p>` wrappers.
 * @returns Async remark plugin.
 */
export const remarkHugoImages = () => {
	return async (tree: { type: string }): Promise<void> => {
		const paragraphJobs: ImageJob[] = []
		const inlineJobs: ImageJob[] = []
		const lifted = new Set<ImageNode>()

		visit(tree, 'paragraph', (node: ParentNode, index, parent) => {
			if (typeof index !== 'number' || !parent) {
				return
			}

			const image = node.children.find((child): child is ImageNode => child.type === 'image')
			if (!image || !image.url.startsWith('images/')) {
				return
			}

			const onlyImage = node.children.every((child) => child === image || isIgnorable(child))
			if (!onlyImage) {
				return
			}

			lifted.add(image)
			paragraphJobs.push({ image, index, parent: parent as ParentNode })
		})

		visit(tree, 'image', (node: ImageNode, index, parent) => {
			if (typeof index !== 'number' || !parent || !node.url.startsWith('images/') || lifted.has(node)) {
				return
			}
			inlineJobs.push({ image: node, index, parent: parent as ParentNode })
		})

		await applyJobs(paragraphJobs)
		await applyJobs(inlineJobs)
	}
}
