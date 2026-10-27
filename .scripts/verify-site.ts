// Verify the production build: trailing-slash permalinks, Sharp srcset, RSS, JSON-LD, and internal links.
// Run via `just build` after `astro build`. Does not run Sequoia.

import { access, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { glob } from 'glob'

const ROOT = join(import.meta.dirname, '..')
const PUBLIC_DIR = join(ROOT, 'public')
const SAMPLE_POST = '2026-w33-weeknotes-no8'
const SIBLING_POST = '2026-w30-weeknotes-no5'
const SERVICE_ANCHORS = [
	'cloud-devops-for-small-teams',
	'eu-sovereign-hosting-migrations',
	'audio-broadcast-tech',
	'backend-api-development',
	'websites-cms',
	'responsible-ai-adoption-integration',
	'maintenance-retainers',
] as const

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
		if (
			!html.includes(
				'<title>Daniel Freytag – Freelance DevOps &amp; Backend Engineer (Media, Audio &amp; EU Cloud)</title>'
			) &&
			!html.includes('<title>Daniel Freytag – Freelance DevOps & Backend Engineer (Media, Audio & EU Cloud)</title>')
		) {
			console.error('Homepage is missing the document title with role clause')
			failures += 1
		} else {
			console.log('OK homepage document title')
		}
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
		const homepagePriority = html.match(/fetchpriority="high"/g) ?? []
		if (homepagePriority.length !== 1 || !html.includes('loading="eager"')) {
			console.error('Homepage should eager-load exactly one content image')
			failures += 1
		} else {
			console.log('OK homepage LCP image priority')
		}
		if (!html.includes('"sameAs"') || !html.includes('beoriginal.social/@FRYTG')) {
			console.error('Homepage JSON-LD is missing Person.sameAs social profiles')
			failures += 1
		} else {
			console.log('OK homepage Person.sameAs')
		}
		if (
			!html.includes('"jobTitle":"DevOps & Backend Engineer"') &&
			!html.includes('"jobTitle":"DevOps &amp; Backend Engineer"')
		) {
			console.error('Homepage JSON-LD is missing Person.jobTitle')
			failures += 1
		} else {
			console.log('OK homepage Person.jobTitle')
		}
		if (!html.includes('"ProfessionalService"') || !html.includes('"areaServed"')) {
			console.error('Homepage JSON-LD is missing ProfessionalService or areaServed')
			failures += 1
		} else {
			console.log('OK homepage ProfessionalService JSON-LD')
		}
		if (!html.includes('type="application/rss+xml"') || !html.includes('/blog/index.xml')) {
			console.error('Homepage <head> is missing RSS alternate link')
			failures += 1
		} else {
			console.log('OK homepage RSS <head> link')
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
		if (!html.includes('"dateModified"') || !html.includes('"wordCount"') || !html.includes('"ImageObject"')) {
			console.error(`Post ${SAMPLE_POST} JSON-LD is missing image, dateModified, or wordCount`)
			failures += 1
		} else {
			console.log(`OK /blog/${SAMPLE_POST}/ BlogPosting JSON-LD`)
		}
		if (!html.includes('"sameAs"') || !html.includes('github.com/FRYTG')) {
			console.error(`Post ${SAMPLE_POST} JSON-LD is missing author sameAs`)
			failures += 1
		} else {
			console.log(`OK /blog/${SAMPLE_POST}/ Person.sameAs`)
		}
		const postPriority = html.match(/fetchpriority="high"/g) ?? []
		if (postPriority.length !== 1) {
			console.error(`Post ${SAMPLE_POST} should eager-load exactly one content image`)
			failures += 1
		} else {
			console.log(`OK /blog/${SAMPLE_POST}/ LCP image priority`)
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
		['services', join(PUBLIC_DIR, 'services', 'index.html')],
		['work', join(PUBLIC_DIR, 'work', 'index.html')],
		['social', join(PUBLIC_DIR, 'social', 'index.html')],
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

	const services = join(PUBLIC_DIR, 'services', 'index.html')
	if (await exists(services)) {
		const html = await readFile(services, 'utf-8')
		const rows = html.match(/<section class="editorial-row"/g) ?? []
		if (
			!html.includes('editorial-page') ||
			rows.length !== SERVICE_ANCHORS.length ||
			!SERVICE_ANCHORS.every(
				(anchor) => html.includes(`aria-labelledby="${anchor}"`) && html.includes(`id="${anchor}"`)
			)
		) {
			console.error('services page is missing its shared editorial layout or labelled service sections')
			failures += 1
		} else {
			console.log('OK services editorial layout and labelled sections')
		}
		if (html.includes('id="footer-availability"')) {
			console.error('services page must not repeat the availability callout after its contact section')
			failures += 1
		}
		if (!html.includes('id="how-i-work"') || !html.includes('id="contact"')) {
			console.error('services page is missing collaboration or contact anchors')
			failures += 1
		} else {
			console.log('OK services collaboration and contact anchors')
		}
	}

	const work = join(PUBLIC_DIR, 'work', 'index.html')
	if (await exists(work)) {
		const html = await readFile(work, 'utf-8')
		const anchors = [
			'ard-eventhub-real-time-radio-metadata-distribution',
			'ard-raki-popnacht',
			'ard-sounds-voice-assistants',
			'declarative-iac',
			'feather-ai-proxy-chat-self-hosted-llm-gateway-native-client',
		]
		const rows = html.match(/<section class="editorial-row"/g) ?? []
		if (
			!html.includes('editorial-page') ||
			rows.length !== anchors.length ||
			!anchors.every((anchor) => html.includes(`aria-labelledby="${anchor}"`) && html.includes(`id="${anchor}"`)) ||
			!html.includes('<picture>') ||
			!html.includes('universal-activitymap.frytg.deno.net/github/frytg/default-auto?weeks=14')
		) {
			console.error('work page is missing labelled case studies, its photo, or the live chart')
			failures += 1
		} else {
			console.log('OK work editorial layout, case-study anchors, photo, and live chart')
		}
	}

	if (await exists(join(PUBLIC_DIR, 'dev', 'index.html'))) {
		console.error('removed dev route must not be generated')
		failures += 1
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

	const htmlFiles = await glob('**/*.html', { cwd: PUBLIC_DIR, nodir: true })
	const htmlByPath = new Map<string, string>()
	for (const rel of htmlFiles) {
		htmlByPath.set(join(PUBLIC_DIR, rel), await readFile(join(PUBLIC_DIR, rel), 'utf-8'))
	}

	let checkedInternalLinks = 0
	for (const [filePath, html] of htmlByPath) {
		const hrefMatches = html.matchAll(/\bhref="([^"]+)"/g)
		for (const match of hrefMatches) {
			const href = match[1]
			if (!href || /^[a-z][a-z\d+\-.]*:/i.test(href) || href.startsWith('//')) {
				continue
			}

			const [rawPath, fragment] = href.split('#')
			let targetFile: string
			if (!rawPath) {
				targetFile = filePath
			} else if (rawPath.startsWith('/')) {
				targetFile = rawPath.endsWith('/') ? join(PUBLIC_DIR, rawPath, 'index.html') : join(PUBLIC_DIR, rawPath)
			} else {
				targetFile = join(dirname(filePath), rawPath)
			}

			if (!(await exists(targetFile))) {
				console.error(`Broken internal link in ${filePath}: href="${href}" -> missing ${targetFile}`)
				failures += 1
				continue
			}

			if (fragment) {
				const targetHtml = htmlByPath.get(targetFile) ?? (await readFile(targetFile, 'utf-8'))
				if (!targetHtml.includes(`id="${fragment}"`) && !targetHtml.includes(`id='${fragment}'`)) {
					console.error(`Broken fragment in ${filePath}: href="${href}" -> #${fragment} not found in ${targetFile}`)
					failures += 1
					continue
				}
			}
			checkedInternalLinks += 1
		}
	}
	console.log(`OK ${checkedInternalLinks} internal links and #fragments verified`)

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
