// Verify blog post paths and cover images are ready for ATProto publishing.
// Ensures Sequoia paths match `/blog/<filename>` slugs and cover images exist under 1 MB.
// Run via `just atproto-verify-paths` before publish or dry-run.

import { access, readFile, stat } from 'node:fs/promises'
import { basename, join, relative } from 'node:path'
import process from 'node:process'
import { glob } from 'glob'
import { parse as parseYaml } from 'yaml'

const ROOT = join(import.meta.dirname, '..')
const CONFIG_PATH = join(ROOT, 'sequoia.json')
const MAX_COVER_IMAGE_BYTES = 1024 * 1024 - 1

type SequoiaConfig = {
	siteUrl: string
	contentDir: string
	imagesDir?: string
	pathPrefix?: string
	ignore?: string[]
	frontmatter?: {
		publishDate?: string
		draft?: string
		coverImage?: string
	}
}

/**
 * @param raw Markdown file contents.
 * @returns Parsed YAML front matter, or an empty object.
 */
const parseFrontmatter = (raw: string): Record<string, unknown> => {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
	if (!match?.[1]) {
		return {}
	}
	return parseYaml(match[1]) as Record<string, unknown>
}

/**
 * @param relativePath Path relative to the Sequoia content directory.
 * @returns Filename without `.md` / `.mdx`.
 */
const slugFromPath = (relativePath: string): string => basename(relativePath).replace(/\.mdx?$/, '')

/**
 * @param config Sequoia config.
 * @param slug Blog filename without extension.
 * @returns Sequoia path (`/blog/<slug>`).
 */
const sequoiaPath = (config: SequoiaConfig, slug: string): string => {
	const prefix = config.pathPrefix ?? '/posts'
	return `${prefix}/${slug}`
}

/**
 * @param path Filesystem path.
 * @returns Whether the path exists.
 */
const exists = async (path: string): Promise<boolean> => {
	try {
		await access(path)
		return true
	} catch {
		return false
	}
}

/**
 * @param config Sequoia config.
 * @param coverImage Front-matter cover path.
 * @returns Absolute filesystem path, or `undefined` if missing.
 */
const resolveCoverImagePath = async (config: SequoiaConfig, coverImage: string): Promise<string | undefined> => {
	const imagesDir = config.imagesDir ? join(ROOT, config.imagesDir) : undefined
	const contentDir = join(ROOT, config.contentDir)

	if (imagesDir) {
		const imagesDirBaseName = basename(config.imagesDir ?? '')
		const imagesDirIndex = coverImage.indexOf(imagesDirBaseName)
		const relativePath =
			imagesDirIndex !== -1
				? coverImage.substring(imagesDirIndex + imagesDirBaseName.length).replace(/^[/\\]/, '')
				: basename(coverImage)
		const imagePath = join(imagesDir, relativePath)
		if (await exists(imagePath)) {
			return imagePath
		}
	}

	const contentRelative = join(contentDir, coverImage)
	if (await exists(contentRelative)) {
		return contentRelative
	}

	return undefined
}

/**
 * Compare Sequoia paths to filename slugs and check cover-image size.
 */
const main = async (): Promise<void> => {
	const config = JSON.parse(await readFile(CONFIG_PATH, 'utf-8')) as SequoiaConfig
	const contentDir = join(ROOT, config.contentDir)
	const ignore = config.ignore ?? []
	const draftField = config.frontmatter?.draft ?? 'draft'
	const coverField = config.frontmatter?.coverImage ?? 'atprotoImage'
	const files = await glob('**/*.{md,mdx}', { cwd: contentDir })

	let mismatches = 0

	for (const file of files) {
		if (ignore.some((pattern) => file === pattern || file.endsWith(pattern))) {
			continue
		}

		const raw = await readFile(join(contentDir, file), 'utf-8')
		const frontmatter = parseFrontmatter(raw)
		if (frontmatter[draftField] === true) {
			continue
		}

		const slug = slugFromPath(file)
		const expected = sequoiaPath(config, slug)
		const sitePath = `/blog/${slug}`

		if (sitePath !== expected) {
			console.error(
				`Path mismatch for ${relative(ROOT, join(contentDir, file))}: sequoia=${expected}, site=${sitePath}`
			)
			mismatches += 1
		} else {
			console.log(`OK ${slug} -> ${expected}`)
		}

		const coverImageValue = frontmatter[coverField] ?? frontmatter.image
		if (typeof coverImageValue === 'string' && coverImageValue.length > 0) {
			const resolved = await resolveCoverImagePath(config, coverImageValue)
			if (!resolved) {
				console.error(`Cover image not found for ${slug}: ${coverImageValue} (check sequoia.json imagesDir)`)
				mismatches += 1
			} else {
				const { size } = await stat(resolved)
				if (size > MAX_COVER_IMAGE_BYTES) {
					console.error(
						`Cover image for ${slug} must be less than 1MB: ${resolved} (${(size / 1_000_000).toFixed(1)}MB)`
					)
					mismatches += 1
				}
			}
		}
	}

	if (mismatches > 0) {
		process.exit(1)
	}

	console.log('All blog post paths and cover images are valid.')
}

main().catch((error: unknown) => {
	console.error(error)
	process.exit(1)
})
