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
	nubx vite build
alias vite:=build-vite

# build the site for production
[group('BUILD')]
build:
	just build-vite
	hugo --minify

# initialize Standard.site publication (one-time; requires ATP credentials in SOPS)
[group('ATP')]
atproto-init:
	just _env "nub .scripts/atproto-init.ts"

# verify Sequoia paths match Hugo permalinks
[group('ATP')]
atproto-verify-paths:
	nub .scripts/verify-atproto-paths.ts

# preview ATProto publish (paths + Sequoia dry-run when credentials exist)
[group('ATP')]
atproto-dry-run:
	just atproto-prepare-covers
	just atproto-verify-paths
	just _env "nubx sequoia publish --dry-run"

# verify built HTML contains ATProto verification tags
[group('ATP')]
atproto-verify-build:
	nub .scripts/verify-atproto-build.ts

# publish blog posts to ATProto (Standard.site)
[group('ATP')]
atproto-prepare-covers:
	nub .scripts/prepare-atproto-covers.ts

atproto-publish:
	just atproto-prepare-covers
	just _env "nubx sequoia publish"

# full publish pipeline: ATProto init → publish → build → deploy → purge
[group('BUILD')]
publish:
	# just atproto-init
	just atproto-publish
	just build
	just deploy
	just purge
	just atproto-verify-build

# sync to bunny storage
[group('BUNNY')]
deploy:
	just _env "nub .scripts/rsync-to-bunny-storage.ts"

# purge bunny pull zone cache
[group('BUNNY')]
purge:
	just _env "nub .scripts/purge-bunny-pull-zone.ts"

# run dev server locally
[group('DEV')]
dev:
	nubx concurrently 'nubx vite' 'just local'

# run hugo dev server locally
[group('DEV')]
local:
	just build-vite
	hugo server

lint:
	just build
	nubx biome lint
	nubx @google/design.md designmd lint DESIGN.md

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
