// Verify the production build: trailing-slash permalinks, Sharp srcset, RSS.
// Run via `just build` after `astro build`. Does not run Sequoia.

import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const ROOT = join(import.meta.dirname, '..')
const PUBLIC_DIR = join(ROOT, 'public')
const SAMPLE_POST = '2026-w33-weeknotes-no8'
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
 * Check production artifacts in public/.
 */
const main = async (): Promise<void> => {
	let failures = 0

	const home = join(PUBLIC_DIR, 'index.html')
	if (!(await exists(home))) {
		console.error('Missing public/index.html')
		failures += 1
	} else {
		const html = await readFile(home, 'utf-8')
		if (!html.includes('class="text-3xl title-style"') && !html.includes("class='text-3xl title-style'")) {
			console.error('Homepage is missing the {.title-style} class')
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

	const post = join(PUBLIC_DIR, 'blog', SAMPLE_POST, 'index.html')
	if (!(await exists(post))) {
		console.error(`Missing trailing-slash permalink public/blog/${SAMPLE_POST}/index.html`)
		failures += 1
	} else {
		const html = await readFile(post, 'utf-8')
		if (!html.includes('<picture>') || !html.includes('srcset="') || !html.includes('image/webp')) {
			console.error(`Post ${SAMPLE_POST} is missing WebP srcset`)
			failures += 1
		} else {
			console.log(`OK /blog/${SAMPLE_POST}/ picture srcset`)
		}
		if (!html.includes('rel="site.standard.document"')) {
			console.error(`Post ${SAMPLE_POST} is missing atUri link`)
			failures += 1
		} else {
			console.log(`OK /blog/${SAMPLE_POST}/ atUri`)
		}
	}

	const sibling = join(PUBLIC_DIR, 'blog', SIBLING_POST, 'index.html')
	if (!(await exists(sibling))) {
		console.error(`Missing public/blog/${SIBLING_POST}/index.html`)
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

	const feed = join(PUBLIC_DIR, 'blog', 'index.xml')
	if (!(await exists(feed))) {
		console.error('Missing public/blog/index.xml')
		failures += 1
	} else {
		const xml = await readFile(feed, 'utf-8')
		if (!xml.includes('<content:encoded>')) {
			console.error('RSS is missing content:encoded')
			failures += 1
		} else {
			console.log('OK RSS content:encoded')
		}
		if (!xml.includes(`/blog/${SAMPLE_POST}/`)) {
			console.error(`RSS is missing trailing-slash link for ${SAMPLE_POST}`)
			failures += 1
		} else {
			console.log('OK RSS trailing-slash permalinks')
		}
	}

	const blogIndex = join(PUBLIC_DIR, 'blog', 'index.html')
	if (await exists(blogIndex)) {
		const html = await readFile(blogIndex, 'utf-8')
		if (!html.includes('>cloud</a> <a href="/categories/europe/">europe</a>')) {
			console.error('Blog index is missing spaces between category links')
			failures += 1
		} else {
			console.log('OK blog index category link gaps')
		}
	}

	const routes = [
		['social', join(PUBLIC_DIR, 'social', 'index.html')],
		['uses', join(PUBLIC_DIR, 'uses', 'index.html')],
		['dev', join(PUBLIC_DIR, 'dev', 'index.html')],
		['legal', join(PUBLIC_DIR, 'legal', 'index.html')],
		['blog', join(PUBLIC_DIR, 'blog', 'index.html')],
		['tags', join(PUBLIC_DIR, 'tags', 'index.html')],
		['categories', join(PUBLIC_DIR, 'categories', 'index.html')],
		['sitemap.xml', join(PUBLIC_DIR, 'sitemap.xml')],
		['robots.txt', join(PUBLIC_DIR, 'robots.txt')],
	] as const

	for (const [name, path] of routes) {
		if (!(await exists(path))) {
			console.error(`Missing /${name}/ artifact at ${path}`)
			failures += 1
		} else {
			console.log(`OK /${name}${name.includes('.') ? '' : '/'}`)
		}
	}

	const legal = join(PUBLIC_DIR, 'legal', 'index.html')
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
		console.error(`\nSite verification failed (${failures} issue${failures === 1 ? '' : 's'}).`)
		process.exit(1)
	}

	console.log('Site verification passed.')
}

main().catch((error: unknown) => {
	console.error(error)
	process.exit(1)
})
