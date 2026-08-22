# FRYTG digital Website

## Local Setup

Install [mise](https://mise.jdx.dev/) and [aube](https://aube.jdx.dev) (via mise).

```sh
brew install mise
eval "$(mise activate zsh)"  # or your shell
```

### Install Dependencies

Provision the pinned toolchain and install packages:

```sh
just install
```

That runs `mise install` then `aube install`. You can also run those directly.

### Run local server

```sh
just dev
```

Visit the site at [localhost:4321](http://localhost:4321).

## Production Build

This builds the static site into `/public`:

```sh
just build
```

## Sync to Bunny Storage

```bash
just deploy
```

## Internal links between Markdown pages

Sibling Markdown destinations resolve to page permalinks. Absolute URLs still open in a new tab with `rel="external noopener"`.

In blog posts (and any other content), you can link siblings by filename:

```md
[migrating github repos to tangled](2026-07-28-migrating-to-tangled.md)
[same page, no extension](2026-07-28-migrating-to-tangled)
[section fragment](2026-07-28-migrating-to-tangled.md#setup)
```

Root-absolute site paths still work as plain paths:

```md
[social](/social/)
[blog index](/blog/)
```

Prefer the filename form for peer posts in the same section — it survives slug/url changes better than hardcoding `/blog/...`, and editor preview can open the target `.md` file.

## Image Configuration

Image paths in Markdown and front matter use the `assets/` convention — e.g. `images/blog/foo.jpg` resolves to `assets/images/blog/foo.jpg` at build time. That path is not relative to the Markdown file, so editor Markdown preview cannot find the files on its own.

**Editor preview fix:** a symlink at the project root maps `images/` → `assets/images/`. VS Code and Cursor resolve `images/...` from the workspace root when previewing Markdown, so `![alt](images/blog/foo.jpg)` loads correctly without changing those paths.

```sh
ln -sfn assets/images images   # re-create if missing (e.g. after a fresh clone on Windows)
```

Alternatively, preview via `just dev` and open [localhost:4321](http://localhost:4321) for pixel-accurate rendering including responsive srcsets.
