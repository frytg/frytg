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
