# FRYTG digital Website

## Local Setup

Install [Bun](https://bun.sh/docs/installation) and [Hugo](https://gohugo.io/installation/).

```sh
brew install hugo
```

### Install Dependencies

Use bun to install everything:

```sh
bun install
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
bun run rsync
```

## Image Configuration

Main inspiration for the template

- [Responsive and optimized images with Hugo](https://www.brycewray.com/posts/2022/06/responsive-optimized-images-hugo/)
- [How To Add Image Processing to Your Hugo Website and Improve Performance](https://alexlakatos.com/web/2020/07/17/hugo-image-processing/)
- [WebP and AVIF images on a Hugo website](https://pawelgrzybek.com/webp-and-avif-images-on-a-hugo-website/)
