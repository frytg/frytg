import type { AstroIntegration } from 'astro'
import { createReadStream, existsSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { copyImageCacheToDist, IMAGE_CACHE_DIR, IMAGE_PUBLIC_PREFIX, MIME_BY_EXT } from '../lib/responsive-images.ts'

/**
 * Serve `/_images` in `astro dev` and copy the Sharp cache into the build output.
 * @returns Astro integration.
 */
export const responsiveImages = (): AstroIntegration => ({
	name: 'responsive-images',
	hooks: {
		'astro:config:setup': ({ updateConfig }) => {
			updateConfig({
				vite: {
					plugins: [
						{
							name: 'serve-responsive-images',
							configureServer(server) {
								server.middlewares.use((req, res, next) => {
									const url = req.url ?? ''
									if (!url.startsWith(`${IMAGE_PUBLIC_PREFIX}/`)) {
										next()
										return
									}
									const rel = decodeURIComponent(url.slice(IMAGE_PUBLIC_PREFIX.length + 1))
									const file = normalize(join(IMAGE_CACHE_DIR, rel))
									if (!file.startsWith(IMAGE_CACHE_DIR) || !existsSync(file)) {
										next()
										return
									}
									res.setHeader('Content-Type', MIME_BY_EXT[extname(file)] ?? 'application/octet-stream')
									createReadStream(file).pipe(res)
								})
							},
						},
					],
				},
			})
		},
		'astro:build:done': async ({ dir }) => {
			await copyImageCacheToDist(dir)
		},
	},
})
