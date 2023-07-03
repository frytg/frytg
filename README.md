# frytg.com website

This repo holds the content for my [frytg.com](https://www.frytg.com) personal website. It uses Jekyll to build a Jamstack-style site, currently hosted on [bunny.net](https://bunny.net).

- [frytg.com website](#frytgcom-website)
  - [Local Setup](#local-setup)
  - [Build](#build)
  - [M1](#m1)
  - [Local Development](#local-development)

## Local Setup

One will need Jekyll installed, for us [Mac](https://jekyllrb.com/docs/installation/macos/) users this requires the Xcode tools:

```shell
xcode-select --install
```

If Ruby is not installed, this need to be done next: [jekyllrb.com/docs/installation/macos/#brew](https://jekyllrb.com/docs/installation/macos/#brew).

Install Jekyll:

```shell
gem install --user-install bundler jekyll
```

Install Gems:

```shell
yarn install:bundle
```

## Build

To create a build, simply use the pre-defined script command:

```shell
yarn build
```

or

```shell
yarn build:m1
```

The output will be in the [/dist](/dist) folder.

## M1

Possible fixes for M1 Macs:

- `brew list openssl` / `brew install openssl`
- `gem install eventmachine -v '1.2.7' -- --with-openssl-dir=$(brew --prefix libressl)`

## Local Development

To improve or update the site locally use this command to start a hot-reloading server:

```sh
yarn local
```
