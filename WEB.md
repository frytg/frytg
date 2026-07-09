# FRYTG digital Website

## Local Setup

Install [Nub](https://nubjs.com/docs/install) and [Hugo](https://gohugo.io/installation/).

```sh
brew install hugo
```

### Install Dependencies

Use nub to install everything:

```sh
nub install
```

### Run local server

First make sure fonts are compiled with Vite (we need to build tailwind simply to have the output file and prevent Vite from initially failing):

```sh
just dev
```

Visit the site at [localhost:1313](http://localhost:1313).

## Production Build

This will run all required commands and build the site for production in `/public`:

```sh
just build
```

## Sync to Bunny Storage

```bash
just deploy
```

## Image Configuration

Image paths in Markdown and front matter use Hugo's `assets/` convention — e.g. `images/blog/foo.jpg` resolves to `assets/images/blog/foo.jpg` at build time via `resources.Get`. That path is not relative to the Markdown file, so editor Markdown preview cannot find the files on its own.

**Editor preview fix:** a symlink at the project root maps `images/` → `assets/images/`. VS Code and Cursor resolve `images/...` from the workspace root when previewing Markdown, so `![alt](images/blog/foo.jpg)` loads correctly without changing Hugo paths.

```sh
ln -sfn assets/images images   # re-create if missing (e.g. after a fresh clone on Windows)
```

Alternatively, preview via `just dev` and open [localhost:1313](http://localhost:1313) for pixel-accurate rendering including responsive srcsets.

Main inspiration for the template

- [Responsive and optimized images with Hugo](https://www.brycewray.com/posts/2022/06/responsive-optimized-images-hugo/)
- [How To Add Image Processing to Your Hugo Website and Improve Performance](https://alexlakatos.com/web/2020/07/17/hugo-image-processing/)
- [WebP and AVIF images on a Hugo website](https://pawelgrzybek.com/webp-and-avif-images-on-a-hugo-website/)
