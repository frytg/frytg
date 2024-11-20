---
title: '/dev - My development projects'
date: 2024-11-20T08:00:00+00:00
seo_description: 'A brief overview of tools that I use for my work and personal projects.'
image: 'images/og-card/dev-2024-Q4-A-2x1.jpg'
type: 'page'
layout: 'plain'
sitemap:
  changefreq: 'monthly'
  priority: 0.7
---

# `/dev`

As most of my work revolves around software development, this serves as a non-complete overview of tools that I have published or otherwise created.

Also check out [`/uses`](/uses) for a list of tools that I use daily.

## GitHub Charts in Rust

![GitHub chart](https://githubchart-rust.deno.dev/frytg/dark)

This little project idea led me to forking [a Ruby project](https://github.com/akerl/githubchart) that parses the GitHub contribution data and generates an SVG output. [`githubchart-rust`](https://github.com/frytg/githubchart-rust) is a Rust rewrite of the same idea. Compiling it to WASM, also makes it easier to embed it in a website by throwing it on a serverless environment using [a simple Deno script](https://github.com/frytg/githubchart-rust/blob/main/web/deno.ts).

## Scripts and Tools

I recently started to collect some useful everyday scripts that I use for my work and personal projects in a new repository: 🔗 [`frytg/scripty`](https://github.com/frytg/scripty). Also some useful wrappers or dependencies in [`frytg/js-utils`](https://github.com/frytg/js-utils). Both are somewhat work in progress and will hopefully grow over time.

Scripty also includes a little endpoint to get or test the current connection: 🔗 [ip.srv.earth](https://ip.srv.earth/?pretty)

To get Google Cloud Workload Identity Federation tokens in a fly.io OpenID environment, I've published a small wrapper binary: 🔗 [`flyio-openid-token`](/blog/2024-11-20-flyio-openid-token).

## Engineering Principles

In our team at work (SWR Audio Lab), we have a set of engineering principles that guide our work. They are public for everyone to see: 🔗 [Engineering Principles](https://github.com/swrlab/swrlab/blob/main/PRINCIPLES.md).

## Work Tools

Besides the engineering principles, we also have a set of tools and services that we're using and publishing from our team as open source on GitHub: 🔗 [`@swrlab`](https://github.com/swrlab).

This also includes [ARD Eventhub](https://github.com/swrlab/ard-eventhub), a service for distributing live metadata in ARD, that we've built and published.

## More...

Obviously this list is not complete. There are a lot more systems that I manage, work on, or otherwise contribute to.

There's also always more to learn. Currently very deep into [_Rust_](https://www.rust-lang.org/) and [_Go_](https://go.dev/).

---

The source code of this website is available on [GitHub `frytg/frytg`](https://github.com/frytg/frytg).
