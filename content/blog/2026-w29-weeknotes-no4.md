---
title: Weeknotes no.4 – the art of saying no 🛑
draft: false
seo_description: In a world of vibe-coded apps and ai agents, the art of saying no is more important than ever.
summary: In a world of vibe-coded apps and ai agents, the art of saying no is more important than ever.
image: images/blog/weeknotes-og-card-2x1.jpg
date: 2026-07-19T14:17:00+00:00
categories:
  - weeknotes
tags:
  - weeknotes
  - AI
  - agents
  - coding
atUri: 'at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.document/3mqyyypy5gm2x'
---

this week i attended _käpsele innovation festival_ here in freiburg. _käpsele_ is a word from south-western germany for a clever person, someone with a smart mind. apart from the self-realization of most panelists that germany is over-engineering the future with compliance, research, and paperwork, and therefore hindering progress, one interesting learning was the growing number of businesses running on outdated systems. those weird linux and windows machines that were once set up with some legacy corporate software by external providers, that probably no longer exist. it's the "_never touch a running system_" mentality that's becoming a growing cybersecurity concern. one might argue that "[_always touch a running system_](https://bsky.app/profile/frytg.digital/post/3mqrkfm3ta22n)" could be a better approach.

in our [engineering principles](https://github.com/swrlab/swrlab/blob/main/PRINCIPLES.md) (which are long overdue for a rewrite) at work we once wrote:

> _All of our projects and services must be actively maintained (dependency and platform updates as well as security and CVE fixes) or need to be reevaluated and eventually turned off._

dead code is dangerous code. if you don't know what you have running in production, how are you supposed to protect it? and similarly if you don't touch or update it, how are you supposed to patch it?

in an era, where everyone can vibe-code themselves hyper-specific personal (web) apps, this is gonna create such a lovely avalanche of problems and security holes.

developers and engineers will need to learn the **art of saying NO** to slop feature requests, vibe coded apps, and other stuff that folks will come up with.

i am not per se against ai-written code; i am a heavy user and tinkerer myself. however, speed and inexperience shouldn't outweigh quality and security.

if you don't know what you're doing, don't do it.  
if you don't know what you're running, don't run it.  
if you don't know what you're building, don't build it.

🙏🏼

---

## links, tools, and articles

- on a similar note i [found](https://bsky.app/profile/jeremytheocharis.bsky.social/post/3mqpqmm3ee22z) this lovely article about the dissonance of LLM usage and the resulting flood of PRs from agents: [The LLM Critics Are Right. I Use LLMs Anyway.](https://www.theocharis.dev/blog/llm-critics-are-right-i-use-llms-anyway/)
- i discovered [`radar`](https://github.com/skyhook-io/radar) on github, which looks like a nice more interactive `k9s` alternative
- spent some time optimizing my [local terminal](https://tangled.org/frytg.digital/dotfiles) setup
  - a simple fix means it now starts up wayyyy faster
  - loving the use of [`herdr`](https://herdr.dev) along with [`pi`](https://pi.dev)
  - the [moshi](https://getmoshi.app) app also works so well with both of them
    - to make the SSH process a bit more secure i also [set up a key on my yubikey](https://tangled.org/frytg.digital/dotfiles/blob/main/SSH.md)
- mozilla published the [state of open source website](https://stateofopensource.ai)
  - key learning: **the competitive frontier has shifted to the "agentic harness":** – value is moving up from model weights to the orchestration, memory, and write-permission layers that sit above the model
- interesting article and stats: [SQLite Is All You Need](https://www.dbpro.app/blog/sqlite-is-all-you-need)
- [tiles](https://www.tiles.run/) seems like an interesting concept connecting local llms with at proto: [Own your AI with local models and open protocols](https://www.tiles.run/blog/own-your-ai)
- [@kepano](https://x.com/kepano) posted [an interesting graphic](https://x.com/kepano/status/2078550254027477399?s=20) adapting the [pace layers](https://en.wikipedia.org/wiki/Pace_layers) idea to modern software

FYI, the [rss feed to this blog](/blog/index.xml) now also serves the full article (just like the [at proto/standard.site](https://pdsls.dev/at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.document) entry).
