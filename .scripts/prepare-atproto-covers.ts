import { spawn } from 'node:child_process'
import { glob } from 'glob'
import { mkdir, readFile, stat } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import process from 'node:process'
import { text } from 'node:stream/consumers'
import { parse as parseYaml } from 'yaml'

const ROOT = join(import.meta.dirname, '..')
const CONFIG_PATH = join(ROOT, 'sequoia.json')
const ATPROTO_IMAGES_SUBDIR = 'atproto'
/** Matches sequoia-cli COVER_IMAGE_MAX_SIZE */
const MAX_COVER_IMAGE_BYTES = 1024 * 1024 - 1

type SequoiaConfig = {
	contentDir: string
	imagesDir?: string
	ignore?: string[]
	frontmatter?: {
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

async function resolveImagePath(
	config: SequoiaConfig,
	imagePath: string,
): Promise<string | undefined> {
	const imagesDir = config.imagesDir
		? join(ROOT, config.imagesDir)
		: undefined
	const contentDir = join(ROOT, config.contentDir)

	if (imagesDir) {
		const imagesDirBaseName = basename(config.imagesDir ?? '')
		const imagesDirIndex = imagePath.indexOf(imagesDirBaseName)
		const relativePath =
			imagesDirIndex !== -1
				? imagePath
						.substring(imagesDirIndex + imagesDirBaseName.length)
						.replace(/^[/\\]/, '')
				: basename(imagePath)
		const resolved = join(imagesDir, relativePath)
		try {
			await stat(resolved)
			return resolved
		} catch {
			// fall through
		}
	}

	const contentRelative = join(contentDir, imagePath)
	try {
		await stat(contentRelative)
		return contentRelative
	} catch {
		return undefined
	}
}

function atprotoOutputPath(sourcePath: string, imagesDir: string): string {
	const imagesRoot = join(ROOT, imagesDir)
	const relative = sourcePath.slice(imagesRoot.length + 1)
	return join(imagesRoot, ATPROTO_IMAGES_SUBDIR, relative)
}

async function compressToLimit(
	source: string,
	destination: string,
): Promise<void> {
	await mkdir(dirname(destination), { recursive: true })

	for (const quality of [85, 80, 75, 70]) {
		const proc = spawn(
			'magick',
			[
				source,
				'-resize',
				'2560x>',
				'-strip',
				'-quality',
				String(quality),
				destination,
			],
			{ stdout: 'ignore', stderr: 'pipe' },
		)
		const [stderr, exitCode] = await Promise.all([
			proc.stderr ? text(proc.stderr) : Promise.resolve(''),
			new Promise<number | null>((resolve) => proc.on('close', resolve)),
		])
		if (exitCode !== 0) {
			throw new Error(`magick failed for ${source}:\n${stderr}`)
		}

		const { size } = await stat(destination)
		if (size <= MAX_COVER_IMAGE_BYTES) {
			return
		}
	}

	const { size } = await stat(destination)
	throw new Error(
		`Could not compress ${source} below 1MB (best effort: ${(size / 1_000_000).toFixed(1)}MB)`,
	)
}

async function main(): Promise<void> {
	const config = JSON.parse(
		await readFile(CONFIG_PATH, 'utf-8'),
	) as SequoiaConfig
	const imagesDir = config.imagesDir ?? 'assets/images'
	const contentDir = join(ROOT, config.contentDir)
	const ignore = config.ignore ?? []
	const draftField = config.frontmatter?.draft ?? 'draft'
	const files = await glob('**/*.{md,mdx}', { cwd: contentDir })

	let created = 0

	for (const file of files) {
		if (ignore.some((pattern) => file === pattern || file.endsWith(pattern))) {
			continue
		}

		const raw = await readFile(join(contentDir, file), 'utf-8')
		const frontmatter = parseFrontmatter(raw)
		if (frontmatter[draftField] === true) {
			continue
		}

		const sourceImage = frontmatter.image
		if (typeof sourceImage !== 'string' || sourceImage.length === 0) {
			continue
		}

		const resolved = await resolveImagePath(config, sourceImage)
		if (!resolved) {
			console.warn(`Skipping ${file}: source image not found (${sourceImage})`)
			continue
		}

		const { size } = await stat(resolved)
		if (size <= MAX_COVER_IMAGE_BYTES) {
			continue
		}

		const destination = atprotoOutputPath(resolved, imagesDir)
		const destStat = await stat(destination).catch(() => undefined)
		const sourceStat = await stat(resolved)
		if (
			destStat &&
			destStat.mtimeMs >= sourceStat.mtimeMs &&
			destStat.size <= MAX_COVER_IMAGE_BYTES
		) {
			console.log(`Up to date ${basename(destination)}`)
			continue
		}

		await compressToLimit(resolved, destination)
		const compressedSize = (await stat(destination)).size
		console.log(
			`Created ${destination.replace(`${ROOT}/`, '')} (${(compressedSize / 1024).toFixed(0)}KB)`,
		)
		created += 1
	}

	if (created === 0) {
		console.log('ATProto cover images are up to date.')
	}
}

main().catch((error: unknown) => {
	console.error(error)
	process.exit(1)
})
