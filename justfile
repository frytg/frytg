# run `just` in the CLI to see the list of shortcuts
_default:
	just --list

# use a default sops file, or allow to be overridden by SOPS_ENV_FILE environment variable
DEFAULT_SOPS_FILE:= '.env.sops.yaml'
SELECTED_SOPS_FILE:= env('SOPS_ENV_FILE', DEFAULT_SOPS_FILE)

# run a command with the selected sops file (injecting environment variables)
_env *args:
	@echo "Running command with SOPS > {{args}}"
	@sops exec-env {{SELECTED_SOPS_FILE}} "{{args}}"


# build vite
[group('BUILD')]
build-vite:
	rm -rf public
	rm -f assets/css/_main-compiled.scss
	rm -rf assets/css/dist
	bunx vite build
alias vite:=build-vite

# build the site for production
[group('BUILD')]
build:
	just build-vite
	bunx hugo --minify

# initialize Standard.site publication (one-time; requires ATP credentials in SOPS)
[group('ATP')]
atproto-init:
	just _env "bun run .scripts/atproto-init.ts"

# verify Sequoia paths match Hugo permalinks
[group('ATP')]
atproto-verify-paths:
	bun run .scripts/verify-atproto-paths.ts

# preview ATProto publish (paths + Sequoia dry-run when credentials exist)
[group('ATP')]
atproto-dry-run:
	just atproto-verify-paths
	just _env "bunx sequoia publish --dry-run"

# verify built HTML contains ATProto verification tags
[group('ATP')]
atproto-verify-build:
	bun run .scripts/verify-atproto-build.ts

# publish blog posts to ATProto (Standard.site)
[group('ATP')]
atproto-publish:
	just _env "bunx sequoia publish"

# full publish pipeline: ATProto init → publish → build → deploy → purge
[group('ATP')]
publish:
	just atproto-init
	just atproto-publish
	just build
	just deploy
	just purge
	just atproto-verify-build

# sync to bunny storage
[group('BUNNY')]
deploy:
	just _env "bun run .scripts/rsync-to-bunny-storage.ts"

# purge bunny pull zone cache
[group('BUNNY')]
purge:
	just _env "bun run .scripts/purge-bunny-pull-zone.ts"

# run dev server locally
[group('DEV')]
dev:
	bunx concurrently 'bunx vite' 'just local'

# run hugo dev server locally
[group('DEV')]
local:
	just build-vite
	bunx hugo server

lint:
	just build
	bunx biome lint
	bunx @google/design.md designmd lint DESIGN.md

## ---------------------------------
## ENCRYPTION shortcuts

# add/ remove keys (if .sops.yaml setup was changed)
[group('ENCRYPTION')]
update-keys:
	just _update-key .env.sops.yaml

_update-key file:
	sops updatekeys {{file}}

# rotate keys (refreshed internal encryption keys)
[group('ENCRYPTION')]
rotate-keys:
	just _rotate-key .env.sops.yaml

_rotate-key file:
	sops rotate --in-place {{file}}

# make changes to a secret file
[group('ENCRYPTION')]
edit-key file:
	EDITOR=nano sops edit {{file}}
