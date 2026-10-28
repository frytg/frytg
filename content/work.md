---
title: 'Work & Case Studies – DevOps, Broadcast Tech & EU Cloud'
date: 2026-10-23T08:00:00+00:00
seo_description: 'Selected engineering case studies by Daniel Freytag: ARD Eventhub real-time radio metadata, ARD RAKI responsible AI for ARD Popnacht, ARD Sounds voice assistants, declarative IaC, and self-hosted AI gateways.'
image: 'images/og-card/work-2026-Q4-A-2x1.jpg'
type: 'page'
layout: 'editorial'
sitemap:
  changefreq: 'monthly'
  priority: 0.9
---

`/work`

# selected work. shipped & running. {.word-reveal}

Selected infrastructure, broadcast-tech, and backend engineering projects — from public-broadcasting systems serving millions of listeners to responsible AI in live radio, voice-assistant platforms, declarative infrastructure, and self-hosted AI tools.

[work with me](/services/) [get in touch](/services/#contact)
{.cta-row}

### ARD Eventhub — Real-time radio metadata distribution {.editorial-row}

- **Context**: Public radio broadcasters across [ARD](https://www.ard.de/) produce continuous live metadata — now-playing tracks, show schedules, moderation topics, and regional contributions — that need to reach listener apps like [ARD Sounds](https://www.ardsounds.de/), smart speakers, and web players in real time.
- **Problem**: Each regional broadcaster used different studio systems and formats, so listener apps could not get one fast, shared feed of what was on air.
- **What I built**: Together with the team at [SWR Audio Lab](https://github.com/swrlab), we built, operated, and open-sourced **[ARD Eventhub](https://github.com/swrlab/ard-eventhub)** ([public documentation](https://swrlab.github.io/ard-eventhub/)): a central service that takes live studio events from participating ARD broadcasters, puts them in one format, and sends them on to the apps and players, with monitoring and automated deploys.
- **Stack**: TypeScript, Node.js, containerized cloud infrastructure, structured logging and observability, OpenAPI, full CI/CD.
- **Outcome**: Published as open source under [`swrlab/ard-eventhub`](https://github.com/swrlab/ard-eventhub) with public contributor documentation, powering live radio metadata across ARD's digital audio platforms. The system is currently also being migrated from public cloud to a sovereign, ARD-internal hosting environment.

### ARD RAKI — Responsible AI for ARD Popnacht {#ard-raki-popnacht .editorial-row}

- **Context**: Since early 2025, eight ARD pop stations — hr3, rbb 88.8, MDR JUMP, NDR 2, Bremen Vier, SR 1, SWR3, and WDR 2 — share the evening and night programmes _Pop – Die Abendshow_ and [_ARD Popnacht_](https://www.ard.de/die-ard/presse-kontakt/ard-pressemeldungen/2026/02-25-ard-popwellen-fuehren-regionalisierten-ki-service-fuer-wetter-und-verkehr-ein-100.html), produced by SWR3 with one live host for all stations. Weather and traffic could previously only be announced nationwide, with nothing specific to each listener's region.
- **What was built**: **RAKI** (_Radio Automation KI_), an ARD-internal AI data-processing and speech-output system developed and configured in close cooperation between SWR and WDR. Editors in the ARD weather and traffic desks write and check every text and assign it to a broadcast region; RAKI then voices those texts with a specially trained speech system matched to each station's sound design, using voices based on real presenters and built exclusively for this purpose.
- **Responsible-AI guardrails**: The AI mustn't formulate or alter content itself — editorial responsibility stays with people. Every AI-voiced item goes out with a clear transparency notice, the voices are governed by strict data-protection and security rules, and in acute danger situations (for example a wrong-way driver) the live presenter takes over as before. Keeping the system ARD-internal gives the broadcasters full sovereignty over the technology and the data.
- **Outcome**: Since March 2026, each participating station airs its own regional traffic at the top of the hour and regional weather and traffic at half past — in its familiar station sound, inside a shared programme reaching a million-strong audience.

### ARD Sounds Voice Assistants — Smart speakers & voice control {#ard-sounds-voice-assistants .editorial-row}

- **Context**: More and more listening happens away from the radio set — at breakfast, in the car, or under the shower. Listeners expect [ARD Sounds](https://www.ardsounds.de/) radio and podcast content on the smart speakers already in their homes, and hands-free control also matters for people with limited sight or mobility.
- **What I worked on**: Voice-assistant integrations that make ARD Sounds content playable through the major assistant ecosystems — [Google Assistant, Alexa, and Siri on Google Home, Alexa, Sonos, and similar speaker systems](https://hilfe.ard.de/artikel/ard-sounds-mit-sprachsteuerung-und-lautsprechersystemen/) — backed by the same metadata and audio-delivery pipelines that feed the apps and web players.
- **Stack**: Voice-assistant platforms, backend APIs, live radio metadata, audio delivery, hosted infrastructure.
- **Outcome**: ARD Sounds radio, news, and podcast content is available by voice on smart speakers — no screen, app, or radio set required.

![Daniel Freytag in live broadcast control rooms and production setups](images/about/web-about-2024-q1-3@2x.webp)

### Declarative Infrastructure as Code {#declarative-iac .editorial-row}

- **Context**: The same pattern I set up for client and team infrastructure, servers and cloud services described once in code and set up the same way every time, also has to work for small, long-lived services that one person operates alone.
- **Problem**: Servers set up by hand drift over time: passwords and keys get copied onto several machines, backups go untested, and nobody remembers how a machine was built six months later.
- **What I built**: A reusable pattern where every server and cloud resource is described in code and can be rebuilt on demand. That covers the machine setup, the running services, CDN, DNS, file storage, encrypted secrets, automated backups, and logs and metrics. The public example is my own small servers, at home and at the edge, in **[`frytg.digital/locally`](https://tangled.org/frytg.digital/locally)** ([background write-up](/blog/2026-w35-weeknotes-no10/)), which runs a Mastodon site ([`beoriginal.social`](https://beoriginal.social/)), a private chat server, and my own Bluesky server.
- **Stack**: NixOS, Terraform, Kubernetes, automated encrypted backups, and an observability stack.
- **Outcome**: The same pattern works from a large cloud host down to a small machine at home. Any part can be rebuilt from scratch with one command, secrets stay encrypted, backups run off-site, and logs and metrics are there, so someone new can get the same system running from the project files alone.

### `feather-ai-proxy` & `feather-ai-chat` — Self-hosted LLM gateway & native client {#feather-ai-proxy-chat-self-hosted-llm-gateway-native-client .editorial-row}

- **Context**: Daily engineering and writing across Mac, iPad, and iPhone needed access to several AI providers (OpenAI, Groq, OpenRouter, MiniMax) and local models (Ollama) without copying access keys onto every device, and without a heavy proxy that needs its own database.
- **Problem**: Most self-hosted AI gateways need a database, a cache, and a complex admin screen just to pass a chat request through. Most cross-platform chat apps also don't feel native on iPhone or iPad.
- **What I built**:
  - **`feather-ai-proxy`** — A small Go service in one container. Providers are switched on with settings, not a database, and chat from several AI providers streams through one address.
  - **`feather-ai-chat`** — A native app for Mac, iPad, and iPhone, with iCloud chat sync, built from a shared written spec and checked with automated screenshots.
- **Stack**: Go, Apple `container` / Docker, Tangled Spindles CI, Swift & SwiftUI, CloudKit, OpenRouter & Ollama.
- **Outcome**: One small service and one address behind the coding tools and the Apple devices. Each caller gets their own key, and nothing locks you to one vendor.

---

None of these projects is finished. They run, they change, and listeners never notice.
{.tagline-reveal .word-reveal}

---

## open source & side projects

Beyond client and broadcast systems, I publish open-source tools, reusable TypeScript packages, and experiments:

- **[Universal Activity Maps](https://tangled.org/frytg.digital/pkgy/tree/main/universal-activitymap)** — A small server that draws contribution charts for GitHub, Tangled, Mastodon, and Bluesky. Live at [`universal-activitymap.frytg.deno.net`](https://universal-activitymap.frytg.deno.net).

[![My GitHub contributions as an activity chart](https://universal-activitymap.frytg.deno.net/github/frytg/default-auto?weeks=14)](https://universal-activitymap.frytg.deno.net/github/frytg/default-auto?weeks=14)

- **[`@frytg/*` utility packages on JSR](https://tangled.org/frytg.digital/utility)** — Small TypeScript libraries for Node, Bun, and Deno: [`@frytg/logger`](https://jsr.io/@frytg/logger) (a logger), [`@frytg/dates`](https://jsr.io/@frytg/dates) (date helpers), and [`@frytg/check-required-env`](https://jsr.io/@frytg/check-required-env) (a check that required settings are present before the app starts).
- **[`frytg.digital/pkgy`](https://tangled.org/frytg.digital/pkgy)** — Everyday scripts, hardware experiments (ESPHome e-ink displays, M5Stack CoreInk), and small services hosted on Tangled.
- **[SWR Audio Lab open source (`@swrlab`)](https://github.com/swrlab)** — Public repositories and our team's [Engineering Principles](https://github.com/swrlab/swrlab/blob/main/PRINCIPLES.md).
- **[`frytg-digital`](https://tangled.org/frytg.digital/frytg-digital)** — The source code for this site, published on Bunny CDN and also listed on [Standard.site](https://pdsls.dev/at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.publication/3mptaiprnps2m).

---

## need something similar built or untangled?

I'm available for scoped consulting, architecture reviews, EU cloud migrations, and ongoing technical support.

[explore services](/services/) [get in touch](/services/#contact)
{.cta-row}
