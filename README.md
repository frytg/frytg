# www.frytg.com website

This repo holds the content for my [frytg.com](https://www.frytg.com) personal website. It uses Jekyll to build a Jamstack-style site, currently hosted on [bunny.net](https://bunny.net).

## Local Setup

One will need Jekyll installed, for us [Mac](https://jekyllrb.com/docs/installation/macos/) users this requires the Xcode tools:

```shell
xcode-select --install
```

If Ruby is not installed, this need to be done next: [jekyllrb.com/docs/insrutallation/macos/#brew](https://jekyllrb.com/docs/installation/macos/#brew).

Finally, installed Jekyll:

```shell
gem install --user-install bundler jekyll
```

Then install all plugins:

```shell
bundle install
```

## Build

To create a build, simply use the pre-defined script command:

```shell
yarn build
```

The output will be in the [/dist](/dist) folder.
