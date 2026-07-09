import { glob } from 'glob'
import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { parse as parseYaml } from 'yaml'

const ROOT = join(import.meta.dirname, '..')
const PUBLIC_DIR = join(ROOT, 'public')
const CONTENT_DIR = join(ROOT, 'content/blog')
const WELL_KNOWN_SOURCE = join(
	ROOT,
	'static/.well-known/site.standard.publication',
)
const WELL_KNOWN_OUTPUT = join(
	PUBLIC_DIR,
	'.well-known/site.standard.publication',
)

async function exists(path: string): Promise<boolean> {
	try {
		await access(path)
		return true
	} catch {
		return false
	}
}

function parseFrontmatter(raw: string): Record<string, unknown> {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
	if (!match?.[1]) {
		return {}
	}
	return parseYaml(match[1]) as Record<string, unknown>
}

async function main(): Promise<void> {
	let failures = 0

	if (await exists(WELL_KNOWN_SOURCE)) {
		if (!(await exists(WELL_KNOWN_OUTPUT))) {
			console.error(
				'Missing built publication verification file at public/.well-known/site.standard.publication',
			)
			failures += 1
		} else {
			const source = (await readFile(WELL_KNOWN_SOURCE, 'utf-8')).trim()
			const output = (await readFile(WELL_KNOWN_OUTPUT, 'utf-8')).trim()
			if (source !== output) {
				console.error(
					'Publication verification file in public/ does not match static/.well-known/site.standard.publication',
				)
				failures += 1
			} else {
				console.log(`OK publication verification file -> ${source}`)
			}
		}
	} else {
		console.log(
			'Skip publication verification file check (run `just atproto-init` first)',
		)
	}

	const files = await glob('**/*.{md,mdx}', { cwd: CONTENT_DIR })
	for (const file of files) {
		const raw = await readFile(join(CONTENT_DIR, file), 'utf-8')
		const frontmatter = parseFrontmatter(raw)
		const atUri = frontmatter.atUri

		if (typeof atUri !== 'string' || !atUri.startsWith('at://')) {
			continue
		}

		const slug = file.replace(/\.mdx?$/, '')
		const htmlPath = join(PUBLIC_DIR, 'blog', slug, 'index.html')
		if (!(await exists(htmlPath))) {
			console.error(`Missing built HTML for ${slug}`)
			failures += 1
			continue
		}

		const html = await readFile(htmlPath, 'utf-8')
		if (
			!html.includes(`href="${atUri}"`) &&
			!html.includes(`href='${atUri}'`)
		) {
			console.error(`Missing document verification tag in ${htmlPath}`)
			failures += 1
			continue
		}

		console.log(`OK document verification tag for ${slug}`)
	}

	if (failures > 0) {
		process.exit(1)
	}

	console.log('ATProto build verification passed.')
}

main().catch((error: unknown) => {
	console.error(error)
	process.exit(1)
})
