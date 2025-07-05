# run `just` in the CLI to see the list of shortcuts
_default:
	just --list

build:
	rm -rf public
	rm -f assets/css/_main-compiled.scss
	rm -rf assets/css/dist
	bunx vite build
	bunx hugo --minify

dev:
	bunx concurrently 'bunx vite' 'bunx hugo server'
