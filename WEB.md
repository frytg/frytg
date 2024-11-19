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
bun tailwind:build && bun vite:build
```

Then run the Tailwind local server

```sh
bun tailwind:local
```

And the Hugo server:

```sh
bun hugo:local
```

Visit the site at [localhost:1313](http://localhost:1313).

You can clean temporary files with:

```sh
bun run clean
```

## Production Build

This will run all required commands and build the site for production in `/public`:

```sh
bun run build
```

## Image Configuration

Main inspiration for the template

- [Responsive and optimized images with Hugo](https://www.brycewray.com/posts/2022/06/responsive-optimized-images-hugo/)
- [How To Add Image Processing to Your Hugo Website and Improve Performance](https://alexlakatos.com/web/2020/07/17/hugo-image-processing/)
- [WebP and AVIF images on a Hugo website](https://pawelgrzybek.com/webp-and-avif-images-on-a-hugo-website/)
