# FRYTG digital Website

## Local Setup

### Install Hugo

```sh
brew install hugo
```

### Install Dependencies

If Node (>=v20) or Yarn are not set:

```sh
corepack enable && yarn set version stable
```

Then install the dependencies:

```sh
yarn install
```

### Run local server

First make sure fonts are compiled with Vite (we need to build tailwind simply to have the output file and prevent Vite from initially failing):

```sh
yarn tailwind:build && yarn vite:build
```

Then run the Tailwind local server

```sh
yarn tailwind:local
```

And the Hugo server:

```sh
yarn hugo:local
```

Visit the site at [localhost:1313](http://localhost:1313).

You can clean temporary files with:

```sh
yarn clean
```

## Production Build

This will run all required commands and build the site for production in `/public`:

```sh
yarn build:prod
```

## Image Configuration

Main inspiration for the template

- [Responsive and optimized images with Hugo](https://www.brycewray.com/posts/2022/06/responsive-optimized-images-hugo/)
- [How To Add Image Processing to Your Hugo Website and Improve Performance](https://alexlakatos.com/web/2020/07/17/hugo-image-processing/)
- [WebP and AVIF images on a Hugo website](https://pawelgrzybek.com/webp-and-avif-images-on-a-hugo-website/)
