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

# build the site for production
[group('BUILD')]
build:
	rm -rf public
	rm -f assets/css/_main-compiled.scss
	rm -rf assets/css/dist
	bunx vite build
	bunx hugo --minify

# sync to bunny storage
[group('BUILD')]
deploy:
	just _env "bun run .scripts/rsync-to-bunny-storage.ts"

# run dev server locally
[group('DEV')]
dev:
	bunx concurrently 'bunx vite' 'bunx hugo server'

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
