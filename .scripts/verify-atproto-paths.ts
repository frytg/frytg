import { glob } from 'glob'
import { readFile } from 'node:fs/promises'
import { basename, join, relative } from 'node:path'
import process from 'node:process'
import { parse as parseYaml } from 'yaml'

const ROOT = join(import.meta.dir, '..')
const CONFIG_PATH = join(ROOT, 'sequoia.json')

type SequoiaConfig = {
	siteUrl: string
	contentDir: string
	pathPrefix?: string
	ignore?: string[]
	frontmatter?: {
		publishDate?: string
		draft?: string
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

async function hugoPermalinks(): Promise<Map<string, string>> {
	const proc = Bun.spawn(['hugo', 'list', 'all'], {
		cwd: ROOT,
		stdout: 'pipe',
		stderr: 'pipe',
	})
	const [stdout, stderr, exitCode] = await Promise.all([
		new Response(proc.stdout).text(),
		new Response(proc.stderr).text(),
		proc.exited,
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
	}

	if (mismatches > 0) {
		process.exit(1)
	}

	console.log('All blog post paths match Hugo permalinks.')
}

main().catch((error: unknown) => {
	console.error(error)
	process.exit(1)
})
