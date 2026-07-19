// Verify blog post paths and cover images are ready for ATProto publishing.
// Ensures Sequoia paths match Hugo permalinks and cover images exist under 1 MB.
// Run via `just atproto-verify-paths` before publish or dry-run.

import { spawn } from 'node:child_process'
import { glob } from 'glob'
import { access, readFile, stat } from 'node:fs/promises'
import { basename, join, relative } from 'node:path'
import process from 'node:process'
import { text } from 'node:stream/consumers'
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

function parseFrontmatter(raw: string): Record<string, unknown> {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
	if (!match?.[1]) {
		return {}
	}
	return parseYaml(match[1]) as Record<string, unknown>
}

function slugFromPath(relativePath: string): string {
	return basename(relativePath).replace(/\.mdx?$/, '')
}

function sequoiaPath(config: SequoiaConfig, slug: string): string {
	const prefix = config.pathPrefix ?? '/posts'
	return `${prefix}/${slug}`
}

async function exists(path: string): Promise<boolean> {
	try {
		await access(path)
		return true
	} catch {
		return false
	}
}

async function resolveCoverImagePath(
	config: SequoiaConfig,
	coverImage: string,
): Promise<string | undefined> {
	const imagesDir = config.imagesDir
		? join(ROOT, config.imagesDir)
		: undefined
	const contentDir = join(ROOT, config.contentDir)

	if (imagesDir) {
		const imagesDirBaseName = basename(config.imagesDir ?? '')
		const imagesDirIndex = coverImage.indexOf(imagesDirBaseName)
		const relativePath =
			imagesDirIndex !== -1
				? coverImage
						.substring(imagesDirIndex + imagesDirBaseName.length)
						.replace(/^[/\\]/, '')
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

async function hugoPermalinks(): Promise<Map<string, string>> {
	const proc = spawn('hugo', ['list', 'all'], {
		cwd: ROOT,
		stdout: 'pipe',
		stderr: 'pipe',
	})
	const [stdout, stderr, exitCode] = await Promise.all([
		proc.stdout ? text(proc.stdout) : Promise.resolve(''),
		proc.stderr ? text(proc.stderr) : Promise.resolve(''),
		new Promise<number | null>((resolve) => proc.on('close', resolve)),
	])

	if (exitCode !== 0) {
		throw new Error(`hugo list all failed:\n${stderr}`)
	}

	const paths = new Map<string, string>()
	for (const line of stdout.trim().split('\n').slice(1)) {
		const path = line.split(',')[0]
		if (!path?.startsWith('content/blog/') || path.endsWith('_index.md')) {
			continue
		}

		const permalinkMatch = line.match(
			/(https:\/\/www\.frytg\.digital\/blog\/[^,\s]+)/,
		)
		if (!permalinkMatch?.[1]) {
			continue
		}

		const slug = basename(path).replace(/\.mdx?$/, '')
		paths.set(slug, new URL(permalinkMatch[1]).pathname)
	}
	return paths
}

async function main(): Promise<void> {
	const config = JSON.parse(
		await readFile(CONFIG_PATH, 'utf-8'),
	) as SequoiaConfig
	const contentDir = join(ROOT, config.contentDir)
	const ignore = config.ignore ?? []
	const draftField = config.frontmatter?.draft ?? 'draft'
	const coverField = config.frontmatter?.coverImage ?? 'atprotoImage'
	const files = await glob('**/*.{md,mdx}', { cwd: contentDir })

	let mismatches = 0
	const hugoPaths = await hugoPermalinks()

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
		const hugoPath = hugoPaths.get(slug)

		if (!hugoPath) {
			console.error(`Missing Hugo permalink for blog slug: ${slug}`)
			mismatches += 1
			continue
		}

		const normalizedHugo = hugoPath.replace(/\/$/, '')
		if (normalizedHugo !== expected) {
			console.error(
				`Path mismatch for ${relative(ROOT, join(contentDir, file))}: sequoia=${expected}, hugo=${normalizedHugo}`,
			)
			mismatches += 1
		} else {
			console.log(`OK ${slug} -> ${expected}`)
		}

		const coverImageValue =
			frontmatter[coverField] ?? frontmatter.image
		if (typeof coverImageValue === 'string' && coverImageValue.length > 0) {
			const resolved = await resolveCoverImagePath(config, coverImageValue)
			if (!resolved) {
				console.error(
					`Cover image not found for ${slug}: ${coverImageValue} (check sequoia.json imagesDir)`,
				)
				mismatches += 1
			} else {
				const { size } = await stat(resolved)
				if (size > MAX_COVER_IMAGE_BYTES) {
					console.error(
						`Cover image for ${slug} must be less than 1MB: ${resolved} (${(size / 1_000_000).toFixed(1)}MB)`,
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
