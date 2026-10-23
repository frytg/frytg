---
title: '/dev - My development projects'
date: 2026-08-21T08:00:00+00:00
seo_description: 'A brief overview of tools that I use for my work and personal projects.'
image: 'images/og-card/dev-2024-Q4-A-2x1.jpg'
type: 'page'
layout: 'plain'
sitemap:
  changefreq: 'monthly'
  priority: 0.7
---

# `/dev`

As most of my work revolves around software development, this serves as a non-complete overview of tools that I have published or otherwise created. For detailed architecture and client-facing project write-ups, see [`/work/`](/work/) and [`/services/`](/services/).

Also check out [`/uses/`](/uses/) for a list of tools that I use daily.

## Universal Activity Maps

It all started as [a Ruby project](https://github.com/akerl/githubchart) that parses GitHub contribution data and renders an SVG. I later rewrote the same idea in Rust as [`githubchart-rust`](https://tangled.org/frytg.digital/pkgy/tree/main/githubchart-rust) and compiled it to WASM so it could be embedded on a serverless endpoint.

The next iteration is [`universal-activitymap`](https://tangled.org/frytg.digital/pkgy/tree/main/universal-activitymap), a Hono server in TypeScript that renders the same kind of activity chart but for multiple providers — GitHub, Tangled, Mastodon, and Bluesky. It also serves the underlying data as JSON and follows the viewer's `prefers-color-scheme` for the `-auto` themes. Live deployment: [universal-activitymap.frytg.deno.net](https://universal-activitymap.frytg.deno.net).

### GitHub

[![GitHub Contributions](https://universal-activitymap.frytg.deno.net/github/frytg/default-auto?weeks=14)](https://universal-activitymap.frytg.deno.net/github/frytg/default-auto?weeks=14)

`GET /github/:user/:theme?` — pulls from GitHub's public contributions page.

### Tangled

[![Tangled Activity](https://universal-activitymap.frytg.deno.net/tangled/frytg.digital/default-auto?weeks=14)](https://universal-activitymap.frytg.deno.net/tangled/frytg.digital/default-auto?weeks=14)

`GET /tangled/:handle/:theme?` — pulls from the profile punchcard on tangled.org.

## Scripts and Tools

I recently started to collect some useful everyday scripts and small packages in a new repository on Tangled: 🔗 [`frytg.digital/pkgy`](https://tangled.org/frytg.digital/pkgy). It also includes useful wrappers or dependencies in [`frytg.digital/utility`](https://tangled.org/frytg.digital/utility). Both are somewhat work in progress and will hopefully grow over time.

## Engineering Principles

In our team at work (SWR Audio Lab), we have a set of engineering principles that guide our work. They are public for everyone to see: 🔗 [Engineering Principles](https://github.com/swrlab/swrlab/blob/main/PRINCIPLES.md).

## Work Tools

Besides the engineering principles, we also have a set of tools and services that we're using and publishing from our team as open source on GitHub: 🔗 [`@swrlab`](https://github.com/swrlab).

This also includes [ARD Eventhub](https://github.com/swrlab/ard-eventhub), a service for distributing live metadata in ARD, that we've built and published. Documentation: [swrlab.github.io/ard-eventhub](https://swrlab.github.io/ard-eventhub/).

## More...

Obviously this list is not complete. There are a lot more systems that I manage, work on, or otherwise contribute to.

There's also always more to learn. Currently very deep into [_Rust_](https://www.rust-lang.org/) and [_Go_](https://go.dev/).

---

The source code of this website is available on [Tangled `frytg.digital/frytg-digital`](https://tangled.org/frytg.digital/frytg-digital).
