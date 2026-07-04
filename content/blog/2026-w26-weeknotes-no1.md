---
title: Weeknotes no.1 – atproto, homelab, and AI
draft: false
seo_description: A week of exploring the atproto protocol, homelab, and AI.
summary: A week of exploring the atproto protocol, homelab, and AI.
image: images/blog/weeknotes-og-card-2x1.jpg
date: 2026-06-25T12:08:17+00:00
categories:
  - weeknotes
tags:
  - weeknotes
  - homelab
  - minipc
  - atproto
  - fediverse
  - AI
  - agents
atUri: 'at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.document/3mptaq3islc2m'
---

i loved the idea of reoccurring weeknotes from other blogs like [mijndertstuij.nl](https://mijndertstuij.nl/weeknotes/24-2026/).

disclaimer: _do not expect this to be overly regular. if there's nothing to note (or no time) i won't post :)_

## atproto & the fediverse ⁂

i've spent some significant time reading the detailed specs and concepts around the [`at://`](https://atproto.com/docs) protocol and honestly things are starting to make so much sense. i also stumbled upon [tangled.org](https://tangled.org/frytg.digital) which is a git-type project that builds the social features on top of at proto – still in alpha stage but very promising. set up one [repo over there](https://tangled.org/frytg.digital/dotfiles) that is being synced back to [github](https://github.com/frytg/dotfiles).

if you're also a nerd, go play with [pdsls.dev](https://pdsls.dev/at://did:plc:jttpxcpdum6st5hh6dwf6f72), this has helped me so much in understanding the structure and concepts around personal data servers (PDS) and the atproto protocol.

## ai, homelab, hermes 🧠

any time spent on social media bombards me with posts and updates of people building out their [hermes](https://hermes-agent.nousresearch.com) setup and since i skipped the whole openclaw hype, i caved and set it up on my homelab mini pc.
i made the mistake and first tried to connect it to my own matrix/ tuwunel instance, which in true matrix fashion was quite complicated (don't do that)... telegram on the other hand is super easy and way speedier.

hermes definitely is a nerd and tech tool for now. this is not something you could let a normal person use, the UX just isn't there for it. but it's a great playground to experiment where the future will lead us. and for that it works amazingly well. all of the world's models available in a telegram chat, linked to personal context, an own obsidian vault, session history, skills, mcps, and the whole shebang: an ai nerd's dream ;)

so far i used it to debug some annoying home assistant automations, wrote several documents as a test, and added a few agent cronjobs to regularly check up on things.

## links and cool stuff

- [artificial analysis](https://artificialanalysis.ai/models/glm-5-2) has very cool (and detailed!) model comparison charts
- [npmx.dev](https://npmx.dev) is such a better version of the sluggish npmjs.com website
- [mdn](https://developer.mozilla.org/en-US/blog/introducing-mdn-mcp-server/) now has an mcp server
- top read: [Modern Engineering Values](https://cpojer.net/posts/modern-engineering-values)
  - fav quote: _The best engineers exhibit strong ownership and domain expertise in the area they work in. Agents amplify ownership. Someone who deeply understands a product can now execute faster, while someone without context can generate much more noise. As a result, coordination becomes more expensive._ **_I believe the most effective teams will be small, often two to three people, with clear ownership boundaries and isolated repositories_**
  - primary learning: context needs to be in repos, not locked in notion or confluence for better agent access
- Ryo Lu (design at cursor) gave [a really interesting presentation](https://youtu.be/az6OEZV8iHw?is=lP4Sz6fd8FY0aZks) at their conference about the future of coding and development – i recommend watching it!
  - "_AI is collapsing the distance between ideas and reality._"
  - "_If AI makes execution cheaper but judgment weaker, we do not get a renaissance. We get slop with working buttons._"
- slightly concerning, but interesting article about [end-to-end encryption on whatsapp](https://medium.com/%400xaxgb/whatsapps-e2e-encryption-is-the-biggest-lie-in-tech-history-and-i-can-prove-it-mathematically-46ebdffeb319)
- very non tech: over here it's been up to 38+ºC; a little plate on the balcony with fresh water has been an absolute hit with the local birds 🐥
- i updated my [/social](/social/) page with some recent additions

## quote of the week

heard this in a tiktok (sigh) this week:

> "_If you write a problem down clearly and specifically, you have solved half of it._" (Kidlin's law)
