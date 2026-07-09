import { glob } from 'glob'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const ROOT = join(import.meta.dirname, '..')
const PUBLIC_DIR = join(ROOT, 'public')

const FORBIDDEN_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
	{ label: 'localhost', pattern: /localhost/i },
	{ label: '127.0.0.1', pattern: /127\.0\.0\.1/ },
	{ label: 'livereload', pattern: /livereload/i },
]

async function main(): Promise<void> {
	const files = await glob('**/*.{html,xml,txt,json}', {
		cwd: PUBLIC_DIR,
		nodir: true,
	})

	if (files.length === 0) {
		console.error('No built files found in public/. Run `just build` first.')
		process.exit(1)
	}

	let failures = 0

	for (const file of files) {
		const content = await readFile(join(PUBLIC_DIR, file), 'utf-8')

		for (const { label, pattern } of FORBIDDEN_PATTERNS) {
			if (!pattern.test(content)) {
				continue
			}

			const lineNumber = content
				.split('\n')
				.findIndex((line) => pattern.test(line))

			console.error(
				`Found ${label} in public/${file}:${lineNumber + 1}`,
			)
			failures += 1
		}
	}

	if (failures > 0) {
		console.error(
			`\nProduction build verification failed (${failures} issue${failures === 1 ? '' : 's'}).`,
		)
		console.error(
			'Run `just build` before deploy. Use `just dev` for local preview (renders to memory, not public/).',
		)
		process.exit(1)
	}

	console.log(
		`Production build verification passed (${files.length} files scanned).`,
	)
}

main().catch((error: unknown) => {
	console.error(error)
	process.exit(1)
})
