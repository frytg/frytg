---
title: Weeknotes no.10 – migrating Mastodon to my homelab with Cloudflare Tunnels
draft: false
seo_description: Migrating from a €50 VPS to a self-hosted homelab with NixOS, k3s, Cloudflare Tunnels, Tailscale, and open-source services.
summary: migrating from a €50 VPS to a self-hosted homelab with NixOS, k3s, Cloudflare Tunnels, Tailscale, and open-source services.
image: images/og-card/2026-weeknotes/2026-08-27-weeknotes-og-card-2x1.jpg
date: 2026-08-27T17:17:00+00:00
categories:
  - weeknotes
tags:
  - weeknotes
  - homelab
atUri: 'at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.document/3mu33abh6ec2g'
---

![abstract homelab image](images/blog/2026-weeknotes/2026-08-27-weeknotes-10.jpg)

i've had this thought for a while to fully migrate my cloud VPS to the homelab. i got into the whole [#homelab](https://www.reddit.com/r/homelab/) bubble in early 2025 when i bought a _GMKtec G3 Plus_ mini pc. it's been a great nerd playground setting up NixOS and k3s.
last year i added a _Lenovo ThinkCentre M715q_ which i bought second hand on _Kleinanzeigen_. total bargain at that time considering the included 32GB of memory. this one also doesn't run in our home, but a different off-site building with good 1gig internet connection (still connected to my Tailscale network).
while those two machines are running useful applications (e.g. home assistant), they are quite underused.

at the same time i was spending 50+ euros on a VPS (from UpCloud) each month. this one mainly ran my Matrix homeserver (using [`tuwunel`](https://matrix-construct.github.io/tuwunel/introduction.html)), my mastodon instance ([beoriginal.social](https://beoriginal.social/home)), and more recently also my [AT Proto PDS](https://pdsls.dev/pds.beoriginal.social).  
the migration blocker so far: ingress access and tunneling.

since both pcs live behind dynamic IPs and NAT the only option was to expose them with tunnels. Tailscale (my preferred option) however has this weird "_Traffic sent over a Funnel is subject to non-configurable bandwidth limits._" sentence in their [docs](https://tailscale.com/docs/features/tailscale-funnel?q=funnel#requirements-and-limitations). is that 1GB? TB? PB?  
so the other easy option was Cloudflare, whose tunnel option overall feels more mature. but that meant migrating the domain (or at least nameservers) into their hands. since the services don't run on my primary domain, but on the `beoriginal.social` world, i finally gave in this week. after 48 hours of wait time disabling DNSSEC, it was time to migrate. overall, this worked out really well. a few [config changes](https://tangled.org/frytg.digital/locally) and the k3s deployments were on the different host. Cloudflare tunnels were a learning curve, but seem really performant and solid so far.

> tip: run at least two cloudflare container replicas (no autoscaling)! i thought i could get away with one, but it's actually more stable, especially for re-applying configs or restarting pods.

## in other homelab news

- [moshi](https://getmoshi.app) (whose iphone & ipad app i love) [made](https://x.com/odd_joel/status/2092242087165223124) a desktop/ browser version which is quite fun to use
  - in general: `moshi` + [`herdr`](https://herdr.dev) + [`pi`](https://pi.dev) are such a great combo! 🚀
- i also played with [`fx`](https://fx.sh) the last two weeks, but somehow it doesn't feel right. it is more minimal and easier to set up, but somehow also has a mind of its own and often ignores stuff and follows its own path...
- after having it on my to do list for too many weeks, i finally set up my own [Open WebUI](https://github.com/open-webui/open-webui/) deployment: works really well and seems like a good central solution instead of chat apps on every computer, plus easy remote access with Tailscale!
  - downside: they don't follow the normal [skills.md](https://skills.md) format with yaml frontmatter and import/export JSON files :/
