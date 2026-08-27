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
	priority: boolean
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
		const html = await renderResponsivePicture(job.image.url, job.image.alt ?? '', {
			title: job.image.title,
			priority: job.priority,
		})
		if (html) {
			job.parent.children[job.index] = { type: 'html', value: html }
		}
	}
}

/**
 * Replace Markdown `images/` destinations with Sharp `<picture>` HTML.
 * Standalone image paragraphs become a single HTML block so we don't leave empty `<p>` wrappers.
 * The first content image on the page is the LCP candidate (eager + fetchpriority=high).
 * @returns Async remark plugin.
 */
export const remarkImages = () => {
	return async (tree: { type: string }): Promise<void> => {
		const paragraphJobs: ImageJob[] = []
		const inlineJobs: ImageJob[] = []
		const lifted = new Set<ImageNode>()
		let assignedPriority = false

		/**
		 * @param job Image location without priority.
		 * @returns Job with priority set on the first image in document order.
		 */
		const withPriority = (job: Omit<ImageJob, 'priority'>): ImageJob => {
			const priority = !assignedPriority
			if (priority) {
				assignedPriority = true
			}
			return { ...job, priority }
		}

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
			paragraphJobs.push(withPriority({ image, index, parent: parent as ParentNode }))
		})

		visit(tree, 'image', (node: ImageNode, index, parent) => {
			if (typeof index !== 'number' || !parent || !node.url.startsWith('images/') || lifted.has(node)) {
				return
			}
			inlineJobs.push(withPriority({ image: node, index, parent: parent as ParentNode }))
		})

		await applyJobs(paragraphJobs)
		await applyJobs(inlineJobs)
	}
}
