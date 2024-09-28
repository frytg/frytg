import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
	mode: 'production',
	publicDir: false,
	base: '/css/dist',

	build: {
		// set primary output and asset config
		outDir: resolve(__dirname, './assets/css/compiled/'),
		emptyOutDir: true,

		// generate manifest.json in outDir
		manifest: 'manifest.json',

		minify: 'esbuild',
		chunkSizeWarningLimit: 1000,

		rollupOptions: {
			input: {
				main: resolve(__dirname, './assets/css/_main-compiled.scss'),
				fonts: resolve(__dirname, './assets/css/fonts.scss'),
			},

			makeAbsoluteExternalsRelative: true,

			output: {
				dir: 'assets/css/dist',
				entryFileNames: 'entry/[name]-[hash].js',
				chunkFileNames: 'chunks/[name]-[hash].js',
				assetFileNames: '[name].[ext]',
			},
		},

		sourcemap: false,
	},

	devSourcemap: false,
})
