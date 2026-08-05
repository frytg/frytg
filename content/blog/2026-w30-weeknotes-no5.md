---
title: Weeknotes no.5 – a buzz-ing tech bubble 🐝
draft: false
seo_description: slightly late, but buzzing content
summary: slightly late, but buzzing content
image: images/blog/weeknotes-og-card-2x1.jpg
date: 2026-07-26T22:17:00+00:00
categories:
  - weeknotes
tags:
  - weeknotes
  - AI
  - agents
  - coding
atUri: 'at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.document/3mrpwkx2krm2x'
---

is a weeknotes blog post actually late, if you can just backdate the article? 👀

![x-lab floor](images/blog/2026-weeknotes/2026-07-26-weeknotes-5.jpg)

anyways, we had a couple of team workshop days in person in our office. while i really enjoy working remotely, it's always nice to see everyone in person to work on new plans and projects.

i finally also had some time to run [exo labs](https://exolabs.net) on three macs locally. exo is a tool that lets you easily connect multiple macs so they can share computing and memory power to run larger ai models in a shared environment. i wasn't fully committed to enabling RDMA (some special shared memory over thunderbolt) yet, so performance wasn't crazy, but great to play with it.

also just published a quick guide on [migrating github repos to tangled](./2026-07-28-migrating-to-tangled.md).

---

## links, tools, and articles

just three things worth noting:

- 🚀 "_DRIVE is a framework for measuring engineering organizational health in the age of AI._" [cortex.io/drive](https://www.cortex.io/drive)
  - **Delivery**: Are we shipping fast and is it sustainable?
  - **Reliability**: Are we delivering on our promises to customers?
  - **Initiatives**: Are our org-wide engineering investments making progress?
  - **Vigilance**: Are we actively defending our systems and managing our acceptable risk?
  - **Efficiency**: Are we allocating resources to the right problems?
- 🐝 jack from twitter launched [buzz](https://github.com/block/buzz) - a slack alternative with agents and git that runs on nostr
  - reading from people using it, this seems to be touching a nerve
  - while [nostr](https://nostr.com) is not without its critics, this seems like a smart way to build on top of it
  - smart that agents are getting their own identity instead of borrowing the one from the creator like in most other tools
- 🍰 i have noted in past weeknotes how i've become a huge fan of [pi](https://pi.dev) as a coding agent harness and i still am
  - with its whole config checked into my [`dotfiles`](https://tangled.org/frytg.digital/dotfiles) repo all changes are version controlled and synced between my machines
  - i'm replacing so many of those slightly annoying everyday tasks with self-written [skills](https://tangled.org/frytg.digital/dotfiles/tree/main/skills)
