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

### ImageMagick (ATProto covers)

`just atproto-prepare-covers` (also run by `just atproto-dry-run` and `just atproto-publish`) shells out to `magick`. Install it via Homebrew, not mise — the conda build mise pulls in links `libheif` against Homebrew's `webp` and fails to load without it:

```sh
brew install imagemagick
```

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

## Exclude your own visits from Umami

Umami skips tracking when the `umami.disabled` key is set in `localStorage`. The key is per origin, so set it once in each browser and on each host you use (`www.frytg.digital`, plus any preview host). Open the dev tools console on the site and run:

```js
localStorage.setItem('umami.disabled', 1)
```

To track your visits again, run `localStorage.removeItem('umami.disabled')`. Clearing site data also removes the key. See [Umami: exclude my own visits](https://docs.umami.is/docs/exclude-my-own-visits).

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

## Editorial Pages

`content/services.md` and `content/work.md` use `layout: 'editorial'`;
`assets/css/editorial.css` owns their shared presentation. other pages keep the existing layout.

- mark split headings with `{.editorial-row}` or `{#stable-link .editorial-row}`.
  the build groups the heading and following content into a labelled section with a flexible body.
- use `{.editorial-section}` for full-width chapters or contact sections; nested split headings work too.
- a peer or higher-level heading ends the section. horizontal rules also end it; standalone image-pipeline media
  stays outside split rows so photos keep their full-width placement.
- everything else is inferred from position; no per-paragraph markers needed:
  paragraph before `h1` → path, first paragraph after `h1` → intro, paragraph after the cta row → context;
  in a row body the first paragraph → summary and the last → note; in a section body a paragraph before a
  list → list-lead, an image-only paragraph → media, and the last → note. all other paragraphs use the
  shared default. explicit `{.class}` markers still win over inference (e.g. `.cta-row`).
- work-page wording and links stay in Markdown; layout markers don't change either.
- run `just test`, `just lint`, and `just build`; the build also runs the editorial regression tests in
  `.scripts/verify-editorial.ts`.
  use `just preview` to check narrow and desktop layouts locally.
- design reference: [dotfiles design system](https://tangled.org/frytg.digital/dotfiles/blob/main/context/DESIGN.md).

mdx is not needed here: the `{#id .class}` heading markers plus positional inference cover this site's
needs. mdx would make sense only if pages later need real components or embedded interactivity.

## Image Configuration

Image paths in Markdown and front matter use the `assets/` convention — e.g. `images/blog/foo.jpg` resolves to `assets/images/blog/foo.jpg` at build time. That path is not relative to the Markdown file, so editor Markdown preview cannot find the files on its own.

**Editor preview fix:** a symlink at the project root maps `images/` → `assets/images/`. VS Code and Cursor resolve `images/...` from the workspace root when previewing Markdown, so `![alt](images/blog/foo.jpg)` loads correctly without changing those paths.

```sh
ln -sfn assets/images images   # re-create if missing (e.g. after a fresh clone on Windows)
```

Alternatively, preview via `just dev` and open [localhost:4321](http://localhost:4321) for pixel-accurate rendering including responsive srcsets.
