# run `just` in the CLI to see the list of shortcuts
_default:
	just --list

# use a default sops file, or allow to be overridden by SOPS_ENV_FILE environment variable
DEFAULT_SOPS_FILE := '.env.sops.yaml'
SELECTED_SOPS_FILE := env('SOPS_ENV_FILE', DEFAULT_SOPS_FILE)

# run a command with the selected sops file (injecting environment variables)
_env *args:
	@echo "Running command with SOPS > {{ args }}"
	@sops exec-env {{ SELECTED_SOPS_FILE }} "{{ args }}"

# install toolchain (mise) + package dependencies (aube)
[group('DEV-SETUP')]
install:
	mise install  
	aube install --silent

# update package dependencies
[group('DEV-SETUP')]
update:
	mise upgrade --bump -y --local
	mise outdated --quiet
	aube update --silent
	just format

[group('LOCAL')]
lint:
	oxlint

[group('LOCAL')]
format:
	oxlint --fix
	oxfmt

# build vite
[group('BUILD')]
build-vite:
	rm -rf public
	rm -f assets/css/_main-compiled.scss
	rm -rf assets/css/dist
	aubx vite build
alias vite := build-vite

# build the site for production
[group('BUILD')]
build:
	just build-vite
	hugo build --minify
	just verify-build

# verify public/ contains no dev-server URLs
[group('BUILD')]
verify-build:
	aube node .scripts/verify-production-build.ts

# fail if any Hugo process is running (dev server must not be active)
[group('BUILD')]
verify-no-hugo:
	aube node .scripts/verify-no-hugo-process.ts

# initialize Standard.site publication (one-time; requires ATP credentials in SOPS)
[group('ATP')]
atproto-init:
	just _env "aube node .scripts/atproto-init.ts"

# verify Sequoia paths match Hugo permalinks
[group('ATP')]
atproto-verify-paths:
	aube node .scripts/verify-atproto-paths.ts

# preview ATProto publish (paths + Sequoia dry-run when credentials exist)
[group('ATP')]
atproto-dry-run:
	just atproto-prepare-covers
	just atproto-verify-paths
	just _env "aubx sequoia publish --dry-run"

# verify built HTML contains ATProto verification tags
[group('ATP')]
atproto-verify-build:
	aube node .scripts/verify-atproto-build.ts

# publish blog posts to ATProto (Standard.site)
[group('ATP')]
atproto-prepare-covers:
	aube node .scripts/prepare-atproto-covers.ts

atproto-publish:
	just atproto-prepare-covers
	just atproto-verify-paths
	just _env "aubx sequoia publish"

# update the site.standard.publication icon on the PDS (Bluesky embed-card favicon)
[group('ATP')]
atproto-update-publication-icon:
	just _env "aube node .scripts/atproto-update-publication-icon.ts"

# full publish pipeline: ATProto init → publish → build → deploy → purge
[group('BUILD')]
publish:
	# just atproto-init
	just verify-no-hugo
	just atproto-publish
	just build
	just deploy
	just purge
	just atproto-verify-build

# sync to bunny storage
[group('BUNNY')]
deploy:
	just verify-no-hugo
	just verify-build
	just _env "aube node .scripts/rsync-to-bunny-storage.ts"

# purge bunny pull zone cache
[group('BUNNY')]
purge:
	just _env "aube node .scripts/purge-bunny-pull-zone.ts"

# run dev server locally
[group('DEV')]
dev:
	aube x concurrently 'aubx vite' 'just local'

# run hugo dev server locally
[group('DEV')]
local:
	just build-vite
	hugo server --renderToMemory

# Astro spike (does not replace `just build`; writes to dist/, not public/)
[group('SPIKE')]
spike:
	ASTRO_TELEMETRY_DISABLED=1 aubx astro build
	aube node .scripts/verify-astro-spike.ts

# Astro spike dev server (http://localhost:4321)
[group('SPIKE')]
spike-dev:
	ASTRO_TELEMETRY_DISABLED=1 aubx astro dev

## ---------------------------------
## ENCRYPTION shortcuts

# add/ remove keys (if .sops.yaml setup was changed)
[group('ENCRYPTION')]
update-keys:
	just _update-key .env.sops.yaml

_update-key file:
	sops updatekeys {{ file }}

# rotate keys (refreshed internal encryption keys)
[group('ENCRYPTION')]
rotate-keys:
	just _rotate-key .env.sops.yaml

_rotate-key file:
	sops rotate --in-place {{ file }}

# make changes to a secret file
[group('ENCRYPTION')]
edit-key file:
	EDITOR=nano sops edit {{ file }}
