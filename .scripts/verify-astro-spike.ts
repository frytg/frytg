// Verify the Astro spike output: trailing-slash permalinks, Sharp srcset, RSS.
// Run via `just spike` after `astro build`. Does not touch public/ or Sequoia.

import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const ROOT = join(import.meta.dirname, '..')
const DIST = join(ROOT, 'dist')
const SPIKE_POST = '2026-w33-weeknotes-no8'
const SIBLING_POST = '2026-w30-weeknotes-no5'

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
 * Check spike artifacts in dist/.
 */
const main = async (): Promise<void> => {
	let failures = 0

	const home = join(DIST, 'index.html')
	if (!(await exists(home))) {
		console.error('Missing dist/index.html')
		failures += 1
	} else {
		const html = await readFile(home, 'utf-8')
		if (!html.includes('class="text-3xl title-style"') && !html.includes("class='text-3xl title-style'")) {
			console.error('Homepage is missing the Goldmark {.title-style} class')
			failures += 1
		} else {
			console.log('OK homepage title-style class')
		}
		if (!html.includes('<picture>') || !html.includes('srcset=')) {
			console.error('Homepage is missing Sharp <picture> srcset')
			failures += 1
		} else {
			console.log('OK homepage responsive picture')
		}
		if (!html.includes('/_images/og-') && !html.includes('og:image')) {
			console.error('Homepage is missing OG image meta')
			failures += 1
		} else {
			console.log('OK homepage OG image')
		}
	}

	const post = join(DIST, 'blog', SPIKE_POST, 'index.html')
	if (!(await exists(post))) {
		console.error(`Missing trailing-slash permalink dist/blog/${SPIKE_POST}/index.html`)
		failures += 1
	} else {
		const html = await readFile(post, 'utf-8')
		if (!html.includes('<picture>') || !html.includes('srcset="') || !html.includes('image/webp')) {
			console.error(`Post ${SPIKE_POST} is missing WebP srcset`)
			failures += 1
		} else {
			console.log(`OK /blog/${SPIKE_POST}/ picture srcset`)
		}
		if (!html.includes('rel="site.standard.document"')) {
			console.error(`Post ${SPIKE_POST} is missing atUri link`)
			failures += 1
		} else {
			console.log(`OK /blog/${SPIKE_POST}/ atUri`)
		}
	}

	const sibling = join(DIST, 'blog', SIBLING_POST, 'index.html')
	if (!(await exists(sibling))) {
		console.error(`Missing dist/blog/${SIBLING_POST}/index.html`)
		failures += 1
	} else {
		const html = await readFile(sibling, 'utf-8')
		if (!html.includes('/blog/2026-07-28-migrating-to-tangled/')) {
			console.error(`Post ${SIBLING_POST} did not rewrite the sibling .md link`)
			failures += 1
		} else {
			console.log('OK sibling markdown link → /blog/2026-07-28-migrating-to-tangled/')
		}
	}

	const feed = join(DIST, 'blog', 'index.xml')
	if (!(await exists(feed))) {
		console.error('Missing dist/blog/index.xml')
		failures += 1
	} else {
		const xml = await readFile(feed, 'utf-8')
		if (!xml.includes('<content:encoded>')) {
			console.error('RSS is missing content:encoded')
			failures += 1
		} else {
			console.log('OK RSS content:encoded')
		}
		if (!xml.includes(`/blog/${SPIKE_POST}/`)) {
			console.error(`RSS is missing trailing-slash link for ${SPIKE_POST}`)
			failures += 1
		} else {
			console.log('OK RSS trailing-slash permalinks')
		}
	}

	const routes = [
		['social', join(DIST, 'social', 'index.html')],
		['uses', join(DIST, 'uses', 'index.html')],
		['dev', join(DIST, 'dev', 'index.html')],
		['legal', join(DIST, 'legal', 'index.html')],
		['blog', join(DIST, 'blog', 'index.html')],
		['tags', join(DIST, 'tags', 'index.html')],
		['categories', join(DIST, 'categories', 'index.html')],
		['sitemap.xml', join(DIST, 'sitemap.xml')],
		['robots.txt', join(DIST, 'robots.txt')],
	] as const

	for (const [name, path] of routes) {
		if (!(await exists(path))) {
			console.error(`Missing /${name}/ artifact at ${path}`)
			failures += 1
		} else {
			console.log(`OK /${name}${name.includes('.') ? '' : '/'}`)
		}
	}

	const legal = join(DIST, 'legal', 'index.html')
	if (await exists(legal)) {
		const html = await readFile(legal, 'utf-8')
		if (!html.includes('noindex')) {
			console.error('/legal/ is missing robots noindex')
			failures += 1
		} else {
			console.log('OK /legal/ noindex')
		}
	}

	if (failures > 0) {
		console.error(`\nAstro spike verification failed (${failures} issue${failures === 1 ? '' : 's'}).`)
		process.exit(1)
	}

	console.log('Astro spike verification passed.')
}

main().catch((error: unknown) => {
	console.error(error)
	process.exit(1)
})
