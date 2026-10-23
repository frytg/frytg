---
title: 'Work & Case Studies – DevOps, Broadcast Tech & EU Cloud'
date: 2026-10-23T08:00:00+00:00
seo_description: 'Selected engineering case studies by Daniel Freytag: ARD Eventhub real-time radio metadata, disposable RTMP/SRT cloud livestreaming, NixOS/k3s IaC, and self-hosted AI gateways.'
image: 'images/og-card/work-2026-Q4-A-2x1.jpg'
type: 'page'
layout: 'plain'
sitemap:
  changefreq: 'monthly'
  priority: 0.9
---

# `/work`

Selected infrastructure, broadcast-tech, and backend engineering projects — from public-broadcasting systems serving millions of listeners to disposable live-streaming rigs, declarative NixOS/k3s infrastructure, and self-hosted AI tools.

[Work with me](/services/) [Get in touch](/services/#contact)
{.cta-row}

---

## Case Studies

### ARD Eventhub — Real-time radio metadata distribution

<!-- TODO: Employer sign-off check — this section only uses information already public on github.com/swrlab/ard-eventhub and swrlab.github.io/ard-eventhub/. Confirm with SWR before adding internal throughput metrics or broadcaster-specific operational details. -->

- **Context**: Public radio broadcasters across [ARD](https://www.ard.de/) produce continuous live metadata — now-playing tracks, show schedules, moderation topics, and regional contributions — that need to reach listener apps like [ARD Sounds](https://www.ardsounds.de/), smart speakers, and web players in real time.
- **Problem**: Each regional broadcaster historically operated different studio playout systems and delivery formats, making it slow and brittle for downstream platforms to consume a unified, low-latency stream of live radio metadata.
- **What I built**: Together with the team at [SWR Audio Lab](https://github.com/swrlab), we built, operated, and open-sourced **[ARD Eventhub](https://github.com/swrlab/ard-eventhub)** ([public documentation](https://swrlab.github.io/ard-eventhub/)) — a central ingestion and distribution service that normalizes live studio events from participating ARD broadcasters and fans them out to downstream consumers with structured observability and automated deployment pipelines.
- **Stack**: TypeScript, Node.js, containerized cloud infrastructure, structured logging and Datadog observability, OpenAPI, GitHub Actions CI/CD.
- **Outcome**: Published as open source under [`swrlab/ard-eventhub`](https://github.com/swrlab/ard-eventhub) with public contributor documentation, powering live radio metadata across ARD's digital audio platforms.

### Live event streaming — Disposable RTMP/SRT relays & cloud vMix {#live-event-streaming-disposable-rtmp-srt-relays-cloud-vmix}

- **Context**: Live conferences, hybrid events, and remote productions need resilient ingest relays (RTMP and SRT) and multi-camera video switching without hauling rack-mounted hardware to every venue or paying for idle cloud GPUs year-round.
- **Problem**: On-site uplink connections can drop or fluctuate, and keeping dedicated GPU cloud instances and streaming relays running 24/7 for occasional live broadcasts wastes budget and invites configuration drift.
- **What I built**: **[`event-livestream-tools`](https://github.com/frytg/event-livestream-tools)** — a set of reproducible scripts and infrastructure definitions to spin up disposable RTMP/SRT ingest relays and GPU-accelerated cloud **vMix** production VMs on demand before a broadcast, bond or relay incoming camera feeds, and tear the entire stack down cleanly once the event ends.
- **Stack**: SRT & RTMP streaming relays, cloud GPU VMs, vMix, Linux/containers, automated provisioning scripts.
- **Outcome**: Repeatable, spin-up-per-event broadcast infrastructure that eliminates idle monthly GPU and relay costs while giving live production teams a predictable cloud control room in minutes.

![Daniel Freytag in live broadcast control rooms and production setups](images/about/web-about-2024-q1-3@2x.webp)

### Homelab as production-grade IaC

- **Context**: Personal and federated production services — including a Mastodon instance ([`beoriginal.social`](https://beoriginal.social/)), a Matrix homeserver (`tuwunel`), an AT Protocol PDS (`pds.frytg.digital`), monitoring, and internal tools — needed a single declarative setup across local hardware and European cloud edge services.
- **Problem**: Running self-hosted services on ad-hoc cloud VPS instances cost 50+ EUR/month and accumulated manual configuration snowflaking, secret sprawl, and fragile backup routines.
- **What I built**: **[`frytg.digital/locally`](https://tangled.org/frytg.digital/locally)** ([background write-up](/blog/2026-w35-weeknotes-no10/)) — a multi-host declarative infrastructure repository combining **NixOS** host configurations, **k3s** Kubernetes manifests, **Terraform** for cloud edge resources (Scaleway, GCP, Bunny CDN, DNS, object storage), **sops + age** encrypted secrets, **k8up / restic** automated backups, and a full observability stack.
- **Stack**: NixOS, k3s, Terraform, sops (age/PGP), k8up & restic, VictoriaMetrics, VictoriaLogs, Grafana, Loki, Prometheus, Perses, Vector, Tailscale, Cloudflare Tunnels, `just`.
- **Outcome**: Consolidated recurring VPS workloads onto low-power NixOS + k3s nodes with zero plaintext secrets in git, one-command host synchronization via `just`, and end-to-end metrics, logs, and off-site encrypted backups.

### `feather-ai-proxy` & `feather-ai-chat` — Self-hosted LLM gateway & native client {#feather-ai-proxy-chat-self-hosted-llm-gateway-native-client}

- **Context**: Daily engineering and writing workflows across macOS, iPadOS, and iOS needed access to multiple LLM providers (OpenAI, Groq, OpenRouter, MiniMax) and local **Ollama** models without scattering provider API keys across devices or running a heavyweight proxy with its own database.
- **Problem**: Most self-hosted LLM gateways require Postgres, Redis, and complex admin UIs just to forward `/v1/chat/completions`, while most cross-platform chat apps are Electron wrappers that don't feel native on iPhone or iPad.
- **What I built**:
  - **`feather-ai-proxy`** — A stateless, single-container Go proxy that activates providers purely via environment variables, caches and merges upstream `/v1/models` as `provider/model` IDs, and streams `/v1/chat/completions`, `/v1/responses`, and `/v1/decisions` with zero database dependencies.
  - **`feather-ai-chat`** — A companion native SwiftUI client for Mac, iPad, and iPhone with iCloud (CloudKit) chat sync, built against a shared RFC-driven specification and tested via automated Xcode UI screenshot pipelines.
- **Stack**: Go, Apple `container` / Docker, Tangled Spindles CI, Swift & SwiftUI, CloudKit, OpenRouter & Ollama.
- **Outcome**: One lightweight container and one URL backing every coding agent, CLI tool, and native Apple device, with caller API key scoping and zero vendor lock-in.

---

## Open source & side projects

Beyond client and broadcast systems, I publish open-source tools, reusable TypeScript packages, and experiments (previously listed exclusively on [`/dev/`](/dev/)):

- **[Universal Activity Maps](https://tangled.org/frytg.digital/pkgy/tree/main/universal-activitymap)** — A TypeScript + Hono server (evolved from a Rust/WASM port [`githubchart-rust`](https://tangled.org/frytg.digital/pkgy/tree/main/githubchart-rust)) that renders SVG contribution charts and JSON activity data across GitHub, Tangled, Mastodon, and Bluesky, respecting `prefers-color-scheme`. Live at [`universal-activitymap.frytg.deno.net`](https://universal-activitymap.frytg.deno.net).
- **[`@frytg/*` utility packages on JSR](https://tangled.org/frytg.digital/utility)** — Zero-bloat, cross-runtime TypeScript libraries for Node, Bun, and Deno: [`@frytg/logger`](https://jsr.io/@frytg/logger) (structured syslog-level logging), [`@frytg/dates`](https://jsr.io/@frytg/dates) (date formatting and parsing), and [`@frytg/check-required-env`](https://jsr.io/@frytg/check-required-env) (fail-fast environment validation).
- **[`frytg.digital/pkgy`](https://tangled.org/frytg.digital/pkgy)** — Everyday scripts, hardware experiments (ESPHome e-ink displays, M5Stack CoreInk), and small services hosted on Tangled.
- **[SWR Audio Lab open source (`@swrlab`)](https://github.com/swrlab)** — Public repositories and our team's [Engineering Principles](https://github.com/swrlab/swrlab/blob/main/PRINCIPLES.md).
- **[`frytg.digital/frytg-digital`](https://tangled.org/frytg.digital/frytg-digital)** — The source code for this Astro static site, published to Bunny CDN and AT Protocol ([Standard.site](https://pdsls.dev/at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.publication/3mptaiprnps2m)).

You can also view the live SVG contribution charts on [`/dev/`](/dev/) or check out the hardware and software I use daily on [`/uses/`](/uses/).

---

## Need something similar built or untangled?

I'm available for scoped consulting, architecture reviews, EU cloud migrations, and ongoing maintenance retainers.

[Explore services](/services/) [Get in touch](/services/#contact)
{.cta-row}
