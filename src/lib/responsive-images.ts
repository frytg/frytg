import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

export const RESP_WIDTHS = [960, 1280, 1600, 1920, 2560, 3840] as const
export const FALLBACK_WIDTH = 640
export const WEBP_QUALITY = 92
export const ORIGINAL_QUALITY = 87
export const IMG_SIZES = '(min-width: 1024px) 768px, 100vw'
export const OG_WIDTH = 1200
export const OG_HEIGHT = 630
export const IMAGE_PUBLIC_PREFIX = '/_images'

const ROOT = process.cwd()
const ASSETS_IMAGES = join(ROOT, 'assets/images')
export const IMAGE_CACHE_DIR = join(ROOT, '.cache/responsive-images')

export const MIME_BY_EXT: Record<string, string> = {
	'.webp': 'image/webp',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
}

type RasterFormat = 'jpeg' | 'png' | 'webp' | 'gif'

type PictureSource = {
	url: string
	width: number
}

/**
 * Resolve a Hugo global asset path (`images/blog/foo.jpg`) to a file under `assets/images`.
 * @param hugoPath Markdown/front-matter image path.
 * @returns Absolute filesystem path, or `undefined` if it is not a local asset.
 */
export const resolveHugoImagePath = (hugoPath: string): string | undefined => {
	const trimmed = hugoPath.replace(/^\.\//, '')
	if (!trimmed.startsWith('images/')) {
		return undefined
	}
	const absolute = join(ASSETS_IMAGES, trimmed.slice('images/'.length))
	const relativePath = relative(ASSETS_IMAGES, absolute)
	if (relativePath.startsWith('..') || !existsSync(absolute)) {
		return undefined
	}
	return absolute
}

/**
 * @param value Attribute text.
 * @returns HTML-attribute-escaped string.
 */
const escapeAttr = (value: string): string =>
	value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

/**
 * @param buffer Source bytes plus a processing spec.
 * @returns Short content-addressed token for the output filename.
 */
const fingerprint = (buffer: Buffer, spec: string): string =>
	createHash('sha256').update(buffer).update(spec).digest('hex').slice(0, 10)

/**
 * @param ext File extension including the dot.
 * @returns Sharp raster format, or `undefined` for SVG/unknown.
 */
const rasterFormatFromExt = (ext: string): RasterFormat | undefined => {
	switch (ext.toLowerCase()) {
		case '.jpg':
		case '.jpeg':
			return 'jpeg'
		case '.png':
			return 'png'
		case '.webp':
			return 'webp'
		case '.gif':
			return 'gif'
		default:
			return undefined
	}
}

/**
 * Write one resized variant into the image cache and return its public URL.
 * @param source Original image bytes.
 * @param basename Original filename without extension.
 * @param width Target width in px.
 * @param format Output format.
 * @param quality Encoder quality (ignored for PNG).
 * @returns Public URL under `/_images`.
 */
const writeVariant = async (
	source: Buffer,
	basename: string,
	width: number,
	format: RasterFormat,
	quality: number
): Promise<string> => {
	const spec = `${width}x-${format}-q${quality}-lanczos3`
	const hash = fingerprint(source, spec)
	const filename = `${basename}-${width}w-${hash}.${format === 'jpeg' ? 'jpg' : format}`
	const outPath = join(IMAGE_CACHE_DIR, filename)
	if (!existsSync(outPath)) {
		await mkdir(IMAGE_CACHE_DIR, { recursive: true })
		let pipeline = sharp(source).resize({
			width,
			withoutEnlargement: true,
			kernel: 'lanczos3',
		})
		if (format === 'webp') {
			pipeline = pipeline.webp({ quality })
		} else if (format === 'jpeg') {
			pipeline = pipeline.jpeg({ quality, mozjpeg: true })
		} else if (format === 'png') {
			pipeline = pipeline.png()
		} else {
			pipeline = pipeline.gif()
		}
		await writeFile(outPath, await pipeline.toBuffer())
	}
	return `${IMAGE_PUBLIC_PREFIX}/${filename}`
}

/**
 * @param sources Srcset entries.
 * @returns `url Nw` list for a `<source srcset>`.
 */
const srcsetAttr = (sources: PictureSource[]): string =>
	sources.map((entry) => `${entry.url} ${entry.width}w`).join(', ')

/**
 * Build a Hugo-equivalent `<picture>` (WebP + original srcset at 960–3840, fallback 640w).
 * @param hugoPath Markdown image destination (`images/...`).
 * @param alt Alt text.
 * @param title Optional title.
 * @returns HTML string, or `undefined` when the file is missing.
 */
export const renderResponsivePicture = async (
	hugoPath: string,
	alt: string,
	title?: string | null
): Promise<string | undefined> => {
	const absolute = resolveHugoImagePath(hugoPath)
	if (!absolute) {
		return undefined
	}

	const ext = extname(absolute)
	const titleAttr = title ? ` title="${escapeAttr(title)}"` : ''
	const altAttr = escapeAttr(alt)

	if (ext.toLowerCase() === '.svg') {
		const svgName = `${fingerprint(Buffer.from(absolute), 'svg')}-${absolute.split('/').at(-1)}`
		const cached = join(IMAGE_CACHE_DIR, svgName ?? 'image.svg')
		await mkdir(IMAGE_CACHE_DIR, { recursive: true })
		if (!existsSync(cached)) {
			await writeFile(cached, await readFile(absolute))
		}
		return `<div class="content-column my-8 overflow-hidden">
	<img class="w-full h-auto" src="${IMAGE_PUBLIC_PREFIX}/${svgName}" alt="${altAttr}"${titleAttr} loading="lazy" />
</div>`
	}

	const format = rasterFormatFromExt(ext)
	if (!format) {
		return undefined
	}

	const source = await readFile(absolute)
	const meta = await sharp(source).metadata()
	const originalWidth = meta.width ?? 0
	const originalHeight = meta.height ?? 0
	const basename = (absolute.split('/').at(-1) ?? 'image').replace(ext, '')
	const originalType = MIME_BY_EXT[ext.toLowerCase()] ?? `image/${format}`

	const eligibleWidths = RESP_WIDTHS.filter((width) => originalWidth >= width)
	const webpSources: PictureSource[] = []
	const originalSources: PictureSource[] = []

	for (const width of eligibleWidths) {
		webpSources.push({
			url: await writeVariant(source, basename, width, 'webp', WEBP_QUALITY),
			width,
		})
		originalSources.push({
			url: await writeVariant(source, basename, width, format, ORIGINAL_QUALITY),
			width,
		})
	}

	const fallbackUrl = await writeVariant(source, basename, FALLBACK_WIDTH, format, ORIGINAL_QUALITY)

	return `<div class="content-column my-8 overflow-hidden">
	<picture>
		<source type="image/webp" srcset="${srcsetAttr(webpSources)}" sizes="${IMG_SIZES}" />
		<source type="${originalType}" srcset="${srcsetAttr(originalSources)}" sizes="${IMG_SIZES}" />
		<img class="w-full h-auto" src="${fallbackUrl}" width="${originalWidth}" height="${originalHeight}" alt="${altAttr}"${titleAttr} loading="lazy" />
	</picture>
</div>`
}

/**
 * Crop a cover image to 1200×630 JPG, matching Hugo `fill Center`.
 * @param hugoPath Front-matter `image` path.
 * @returns Public URL of the cropped file, or `undefined` if missing.
 */
export const renderOgImage = async (hugoPath: string): Promise<string | undefined> => {
	const absolute = resolveHugoImagePath(hugoPath)
	if (!absolute) {
		return undefined
	}
	const source = await readFile(absolute)
	const spec = `${OG_WIDTH}x${OG_HEIGHT}-jpg-fill-center-q${ORIGINAL_QUALITY}`
	const hash = fingerprint(source, spec)
	const filename = `og-${hash}.jpg`
	const outPath = join(IMAGE_CACHE_DIR, filename)
	if (!existsSync(outPath)) {
		await mkdir(IMAGE_CACHE_DIR, { recursive: true })
		const buffer = await sharp(source)
			.resize({
				width: OG_WIDTH,
				height: OG_HEIGHT,
				fit: 'cover',
				position: 'centre',
				kernel: 'lanczos3',
			})
			.jpeg({ quality: ORIGINAL_QUALITY, mozjpeg: true })
			.toBuffer()
		await writeFile(outPath, buffer)
	}
	return `${IMAGE_PUBLIC_PREFIX}/${filename}`
}

/**
 * Copy cached derivatives into the Astro `dist/_images` tree after build.
 * @param distDir Build output directory (`file:` URL from `astro:build:done`).
 */
export const copyImageCacheToDist = async (distDir: URL): Promise<void> => {
	if (!existsSync(IMAGE_CACHE_DIR)) {
		return
	}
	const target = join(fileURLToPath(distDir), IMAGE_PUBLIC_PREFIX.replace(/^\//, ''))
	await cp(IMAGE_CACHE_DIR, target, { recursive: true })
}
