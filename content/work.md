---
title: 'Work & Case Studies – DevOps, Broadcast Tech & EU Cloud'
date: 2026-10-23T08:00:00+00:00
seo_description: 'Selected engineering case studies by Daniel Freytag: ARD Eventhub real-time radio metadata, ARD RAKI responsible AI for ARD Popnacht, ARD Sounds voice assistants, declarative IaC, and self-hosted AI gateways.'
image: 'images/og-card/work-2026-Q4-A-2x1.jpg'
type: 'page'
layout: 'plain'
sitemap:
  changefreq: 'monthly'
  priority: 0.9
---

# `/work`

Selected infrastructure, broadcast-tech, and backend engineering projects — from public-broadcasting systems serving millions of listeners to responsible AI in live radio, voice-assistant platforms, declarative infrastructure, and self-hosted AI tools.

[Work with me](/services/) [Get in touch](/services/#contact)
{.cta-row}

---

## Case Studies

### ARD Eventhub — Real-time radio metadata distribution

- **Context**: Public radio broadcasters across [ARD](https://www.ard.de/) produce continuous live metadata — now-playing tracks, show schedules, moderation topics, and regional contributions — that need to reach listener apps like [ARD Sounds](https://www.ardsounds.de/), smart speakers, and web players in real time.
- **Problem**: Each regional broadcaster historically operated different studio playout systems and delivery formats, making it slow and brittle for downstream platforms to consume a unified, low-latency stream of live radio metadata.
- **What I built**: Together with the team at [SWR Audio Lab](https://github.com/swrlab), we built, operated, and open-sourced **[ARD Eventhub](https://github.com/swrlab/ard-eventhub)** ([public documentation](https://swrlab.github.io/ard-eventhub/)) — a central ingestion and distribution service that normalizes live studio events from participating ARD broadcasters and fans them out to downstream consumers with structured observability and automated deployment pipelines.
- **Stack**: TypeScript, Node.js, containerized cloud infrastructure, structured logging and Datadog observability, OpenAPI, GitHub Actions CI/CD.
- **Outcome**: Published as open source under [`swrlab/ard-eventhub`](https://github.com/swrlab/ard-eventhub) with public contributor documentation, powering live radio metadata across ARD's digital audio platforms. The system is currently also being migrated from public cloud to a sovereign, ARD-internal hosting environment.

### ARD RAKI — Responsible AI for ARD Popnacht {#ard-raki-popnacht}

- **Context**: Since early 2025, eight ARD pop stations — hr3, rbb 88.8, MDR JUMP, NDR 2, Bremen Vier, SR 1, SWR3, and WDR 2 — share the evening and night programmes _Pop – Die Abendshow_ and [_ARD Popnacht_](https://www.ard.de/die-ard/presse-kontakt/ard-pressemeldungen/2026/02-25-ard-popwellen-fuehren-regionalisierten-ki-service-fuer-wetter-und-verkehr-ein-100.html), produced by SWR3 with one live host for all stations. Weather and traffic could previously only be announced nationwide, with nothing specific to each listener's region.
- **What was built**: **RAKI** (_Radio Automation KI_), an ARD-internal AI data-processing and speech-output system developed and configured in close cooperation between SWR and WDR. Editors in the ARD weather and traffic desks write and check every text and assign it to a broadcast region; RAKI then voices those texts with a specially trained speech system matched to each station's sound design, using voices based on real presenters and built exclusively for this purpose.
- **Responsible-AI guardrails**: The AI mustn't formulate or alter content itself — editorial responsibility stays with people. Every AI-voiced item goes out with a clear transparency notice, the voices are governed by strict data-protection and security rules, and in acute danger situations (for example a wrong-way driver) the live presenter takes over as before. Keeping the system ARD-internal gives the broadcasters full sovereignty over the technology and the data.
- **Outcome**: Since March 2026, each participating station airs its own regional traffic at the top of the hour and regional weather and traffic at half past — in its familiar station sound, inside a shared programme reaching a million-strong audience.

### ARD Sounds Voice Assistants — Smart speakers & voice control {#ard-sounds-voice-assistants}

- **Context**: More and more listening happens away from the radio set — at breakfast, in the car, or under the shower. Listeners expect [ARD Sounds](https://www.ardsounds.de/) radio and podcast content on the smart speakers already in their homes, and hands-free control also matters for people with limited sight or mobility.
- **What I worked on**: Voice-assistant integrations that make ARD Sounds content playable through the major assistant ecosystems — [Google Assistant, Alexa, and Siri on Google Home, Alexa, Sonos, and similar speaker systems](https://hilfe.ard.de/artikel/ard-sounds-mit-sprachsteuerung-und-lautsprechersystemen/) — backed by the same metadata and audio-delivery pipelines that feed the apps and web players.
- **Stack**: Voice-assistant platforms (Skills/Actions), backend APIs, live radio metadata, audio delivery, containerized cloud infrastructure.
- **Outcome**: ARD Sounds radio, news, and podcast content is available by voice on smart speakers — no screen, app, or radio set required.

![Daniel Freytag in live broadcast control rooms and production setups](images/about/web-about-2024-q1-3@2x.webp)

### Declarative Infrastructure as Code {#declarative-iac}

- **Context**: The same pattern I set up for client and team infrastructure — declarative hosts, container workloads, and cloud edge resources described once in code and applied reproducibly — also has to work for small, long-lived services that one person operates alone.
- **Problem**: Ad-hoc servers and manual configuration snowflake over time: secrets sprawl across machines, backups go untested, and nobody remembers how a host was built six months later.
- **What I built**: A reusable pattern where every server, container, and cloud resource is described in code and can be reproduced on demand — covering host configuration, Kubernetes workloads, cloud edge resources (CDN, DNS, object storage), encrypted secrets, automated backups, and a full observability stack. The public example of the pattern in daily use is my own homelab and edge infrastructure in **[`frytg.digital/locally`](https://tangled.org/frytg.digital/locally)** ([background write-up](/blog/2026-w35-weeknotes-no10/)), which runs federated services like a Mastodon instance ([`beoriginal.social`](https://beoriginal.social/)), a Matrix homeserver, and an AT Protocol PDS on low-power at-home nodes.
- **Stack**: NixOS, Terraform, Kubernetes, automated encrypted backups, and an observability stack.
- **Outcome**: One declarative pattern from cloud to edge — any part of the infrastructure can be rebuilt from scratch with a single command, no secrets stored in plain text, automated off-site backups, and full metrics and logs, so a new engineer can get the same system running from a clean checkout without tribal knowledge.

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

Beyond client and broadcast systems, I publish open-source tools, reusable TypeScript packages, and experiments:

- **[Universal Activity Maps](https://tangled.org/frytg.digital/pkgy/tree/main/universal-activitymap)** — A TypeScript + Hono server (evolved from a Rust/WASM port [`githubchart-rust`](https://tangled.org/frytg.digital/pkgy/tree/main/githubchart-rust)) that renders SVG contribution charts and JSON activity data across GitHub, Tangled, Mastodon, and Bluesky. Live at [`universal-activitymap.frytg.deno.net`](https://universal-activitymap.frytg.deno.net).

[![My GitHub contributions as an activity chart](https://universal-activitymap.frytg.deno.net/github/frytg/default-auto?weeks=14)](https://universal-activitymap.frytg.deno.net/github/frytg/default-auto?weeks=14)

- **[`@frytg/*` utility packages on JSR](https://tangled.org/frytg.digital/utility)** — Zero-bloat, cross-runtime TypeScript libraries for Node, Bun, and Deno: [`@frytg/logger`](https://jsr.io/@frytg/logger) (structured syslog-level logging), [`@frytg/dates`](https://jsr.io/@frytg/dates) (date formatting and parsing), and [`@frytg/check-required-env`](https://jsr.io/@frytg/check-required-env) (fail-fast environment validation).
- **[`frytg.digital/pkgy`](https://tangled.org/frytg.digital/pkgy)** — Everyday scripts, hardware experiments (ESPHome e-ink displays, M5Stack CoreInk), and small services hosted on Tangled.
- **[SWR Audio Lab open source (`@swrlab`)](https://github.com/swrlab)** — Public repositories and our team's [Engineering Principles](https://github.com/swrlab/swrlab/blob/main/PRINCIPLES.md).
- **[`frytg-digital`](https://tangled.org/frytg.digital/frytg-digital)** — The source code for this Astro static site, published to Bunny CDN and AT Protocol ([Standard.site](https://pdsls.dev/at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.publication/3mptaiprnps2m)).

---

## Need something similar built or untangled?

I'm available for scoped consulting, architecture reviews, EU cloud migrations, and ongoing maintenance retainers.

[Explore services](/services/) [Get in touch](/services/#contact)
{.cta-row}
