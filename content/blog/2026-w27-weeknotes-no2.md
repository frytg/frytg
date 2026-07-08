---
title: Weeknotes no.2 – hello AT Proto & local LLM 🦋🦖
draft: false
seo_description: Added AT Proto publishing to my blog and played with local LLM models
summary: Added AT Proto publishing to my blog and played with local LLM models
image: images/blog/weeknotes-og-card-2x1.jpg
date: 2026-07-04T14:08:17+00:00
categories:
  - weeknotes
tags:
  - weeknotes
  - homelab
  - atproto
  - fediverse
  - AI
  - agents
  - bluesky
  - local-llm
atUri: "at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.document/3mptgjktoo22x"
---

Q3 is here! OKRs ready? have you already made the shareholders happy? :)

when asked for a time estimate for a project, i learned to not account for the time that **i need**, but the overhead around it. One of my favorite blog posts ever is [_The work is never just "the work"_](https://davestewart.co.uk/blog/the-work-is-never-just-the-work/), which gives a detailed and visual explanation of project bloat with all its overhead around it.
it came up again this week where one of our systems is going to get refactored and put into an even more central place. the migration? give us a week or two (or the cursor agent an hour)? the whole shebang around it? a month? two? three?...

anyway, it's been a productive week, i migrated my atmosphere/ atproto account to own PDS, tested local LLMs, and tried to keep up with all the cool new stuff around AI.

## my own PDS! 🦋

in the recent weeks i spent a lot of time reading up on the specs behind ActivityPub & [AT Proto](https://atproto.com). it's been an interesting learning curve and since one of the best ways (for me) to learn things is to build something with it, i started by migrating from the basic `bsky.social` PDS (personal data server) to my own. it now runs quietly on my little server in k3s. the migration itself is a bit scary (i went the [cli route](https://bsky.app/profile/frytg.digital/post/3mpofhwthhc2g)). if you mess up, your identity and keys in the PLC registry might be messed up forever.

this blog is now also connected to at proto and publishes [site.standard.document](https://standard.site) records (inspect them on [pdsls.dev](https://pdsls.dev/at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.document)).

if you want something with less work than a self-hosted pds, [eurosky.tech](https://eurosky.tech/accounts/) is worth checking out. they have a europe-hosted PDS open for everyone (plus an account migration tool).

one side project that came out of this was [proto-typer.frytg.com](https://proto-typer.frytg.com), a little web app for posting to bluesky & mastodon at the same time.

![Osaurus app on mac](images/blog/2026-weeknotes/2026-07-04-osaurus.png)

## local LLM 🧠

after last week's hermes agent experiments, i tried to run a few more local things. [osaurus](https://osaurus.ai) caught my eye in just the right moment. aside from its lovely playfulness with the 🦖 dinosaur emojis it's a super useful mac-only [mit-licensed](https://github.com/osaurus-ai/osaurus) app written natively in swift (not another electron wrapper!). it's certainly less nerdy than openclaw or hermes, but works super well in everyday usage.

i especially like the fact that it runs on my computer and i can give it access to folders and tools. these features seem to be integrated quite safely. commands run in an alpine [sandbox](https://docs.osaurus.ai/sandbox) on the apple containerization framework. this way i feel comfortable letting it do stuff to obsidian files or other apps.

a big bonus is also that it runs local models natively. you can download from a decent catalog of the usual Gemma, Qwen, and Mistral families. Gemma 4 E4B runs super well on my not-too-performant macbook air m2.
while yes, a lot of tasks will still run better on bigger cloud models, there's a case in point for local LLMs. i have that model on my computer now. technically i could run that thing until i'm 80, no government can lock that away ;)
it's also useful for more sensitive data, internal company docs, and so on – not that i would ever put those in there... ;)

in the business context i kept wondering why there's not so much more involvement around those topics? start small, get a few mac studios, migrate some use cases, learn and expand. [cohere](https://cohere.com) is super interesting to follow about this. they are betting big on enterprise data & model ownership.

i was a big Claude fanboy, but working with [Deepseek v4 pro](https://openrouter.ai/deepseek/deepseek-v4-pro) or Qwen has made me more critical. go and try some other models, you'd be surprised how well they all work now. some are even soooo cheap compared to the big ones. "_80% of workloads will be running on 99% cheaper models within 12-18 months_" [tweeted Brian](https://x.com/brian_armstrong/status/2063782620815876515) from Coinbase.

---

## other cool stuff and links

- [The Unbearable Cheapness of Open Weight Models](https://jamesoclaire.com/2026/06/25/the-unbearable-cheapness-of-open-weight-models/)
- [We are now factory engineers, not product engineers](https://x.com/zachlloydtweets/status/2069789929073262945)
- Waag (the dutch tech futurelab): [Why we moved our Bluesky data to Eurosky](https://waag.org/en/article/why-we-moved-our-bluesky-data-eurosky/)
- been researching for a database migration and found this good page: [postgresisenough.dev](https://postgresisenough.dev)
- [deno 2.9](https://deno.com/blog/v2.9#deno-desktop) is out and has an interesting `deno desktop` command for a lightweight electron-style standalone app
- from the creator of `zod`: [`nub`](https://github.com/nubjs/nub) a nice cli toolkit around nodejs projects (was critical at first, but testing it in one repo)
- [@rhyssullivan](https://x.com/rhyssullivan/status/2072819391834751312?s=61) built [integrations.sh](https://integrations.sh/) which is a nice overview of MCP servers and other APIs
- [gitlawb](https://gitlawb.com) launched a git-compatible decentralized network with did-based identities to make it work for agents and humans
