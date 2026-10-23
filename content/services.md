---
title: 'Services – Freelance DevOps, Backend & EU Cloud Consulting'
date: 2026-10-23T08:00:00+00:00
seo_description: 'Freelance DevOps engineer near Freiburg offering cloud infrastructure, EU-sovereign cloud migrations (Scaleway, Bunny), broadcast audio backends, TypeScript/Go/Rust APIs, self-hosted AI, and maintenance retainers.'
image: 'images/og-card/services-2026-Q4-A-2x1.jpg'
type: 'page'
layout: 'plain'
sitemap:
  changefreq: 'weekly'
  priority: 0.9
---

# `/services`

Hands-on DevOps, cloud infrastructure, and backend engineering for media organizations, product companies, and small engineering teams across the DACH region and Europe.

[Get in touch](#contact) [View case studies](/work/)
{.cta-row}

I focus on pragmatic infrastructure and backend software that a small team can understand, operate, and hand over without vendor lock-in or unnecessary complexity. Below are the six areas where I typically help clients.

---

## 1. Cloud & DevOps for small teams

Production infrastructure without needing a full-time platform department.

- **Who it's for**: Startups, agencies, and 3–30 person engineering teams whose developers are spending too much time babysitting deployments, debugging flaky pipelines, or deciphering surprise cloud bills.
- **Typical problems**: ClickOps infrastructure nobody dares to touch, slow or brittle CI/CD pipelines, missing alerting until customers complain, over-provisioned clusters on AWS or GCP, and secrets scattered across `.env` files.
- **What's delivered**: Reproducible Infrastructure as Code with **Terraform**, fast CI/CD pipelines (GitHub Actions, GitLab CI, Tangled Spindles), right-sized container setups (**Kubernetes / k3s**, managed containers, or **Fly.io**), **sops + age** secret management, actionable observability (**Grafana**, **Datadog**, **VictoriaMetrics / Loki**, **Better Stack**), and a clear cloud cost review across **Scaleway**, **GCP**, **AWS**, and **Fly.io**.
- **Example engagement**: A 2–3 week infrastructure audit and Terraform migration for a growing SaaS or media team — consolidating manual cloud resources into version-controlled IaC, cutting monthly cloud spend, and setting up alert routing with concise runbooks.

## 2. EU-sovereign hosting & migrations

Pragmatic European cloud and CDN architectures that take data residency and GDPR seriously without sacrificing developer experience.

- **Who it's for**: European companies, public-sector suppliers, media houses, and privacy-conscious SaaS teams looking to reduce reliance on US hyperscalers or meet strict EU data-residency requirements.
- **Typical problems**: Defaulting to US-centric cloud services out of habit, unclear sub-processor chains, egress fees that punish multi-provider setups, and fear that leaving AWS/GCP means giving up managed databases, object storage, or modern deployment workflows.
- **What's delivered**: Architecture assessment and zero- or low-downtime migration to European infrastructure — **Scaleway** (compute, managed PostgreSQL, S3-compatible Object Storage), **Bunny** (CDN, edge storage, DNS), **dns0.eu**, or hardened **NixOS / Linux** hosts — complete with automated restic/k8up backups, TLS, and a documented rollback plan.
- **Example engagement**: Migrating a web platform and asset pipeline from AWS S3 + CloudFront + ECS to Scaleway and Bunny CDN with Terraform, S3-portable storage abstractions, and automated CI deploys.

## 3. Audio & broadcast tech

Reliable real-time metadata pipelines, live streaming relays, and backend services built on 7+ years of public-broadcasting and live-production experience.

- **Who it's for**: Radio broadcasters, podcast networks, live-event producers, and audio platforms that need rock-solid delivery between studio playout systems, cloud relays, and listener apps.
- **Typical problems**: Inconsistent live metadata formats across stations, fragile on-premise encoders, expensive 24/7 cloud GPU instances sitting idle between live shows, and traffic spikes during breaking news or live broadcasts.
- **What's delivered**: Real-time metadata ingestion and distribution services (REST, WebSockets, SSE, MQTT), disposable **RTMP / SRT** ingest relays and on-demand cloud **vMix** GPU production environments via Terraform, plus high-cache-hit backend APIs for radio, podcast, and voice-assistant platforms.
- **Example engagement**: Designing and building a containerized live-metadata ingestion service or an automated on-demand SRT/RTMP cloud relay setup that spins up before a live broadcast and tears down cleanly afterward.

## 4. Backend & API development

Fast, well-typed APIs and background workers with minimal dependency footprint and high test coverage.

- **Who it's for**: Product and platform teams that need a senior backend engineer to design, build, or untangle a core API service, webhook pipeline, or edge worker.
- **Typical problems**: Bloated Node services with dozens of outdated dependencies, unvalidated request/response payloads causing runtime crashes, slow third-party integrations, and codebases that only run on one runtime.
- **What's delivered**: Clean, strictly typed services in **TypeScript** (**Node.js**, **Bun**, **Deno**) using web-standard frameworks like **Hono** and **Zod**, or compiled services in **Go** and **Rust** where single-binary deployment, memory predictability, or raw throughput fits better — complete with OpenAPI specs, structured syslog-level logging, Redis/Valkey caching, and universal unit/integration tests.
- **Example engagement**: Building a high-throughput API gateway or data-ingestion service in TypeScript (Hono) or Go, from RFC and schema design through containerization, observability, and load testing.

## 5. Self-hosted & privacy-first AI

Practical AI integrations where data stays under your control, model providers are swappable, and token spend is capped.

- **Who it's for**: Teams that want to integrate LLMs, structured classification, or speech-to-text into internal tools or customer products without scattering vendor API keys across client apps or leaking sensitive data.
- **Typical problems**: Hardcoded OpenAI SDK calls across multiple repositories, no per-team or per-key budget caps, compliance blockers around sending audio or internal documents to external training pipelines, and heavyweight proxy setups that need their own database just to route requests.
- **What's delivered**: Lightweight, stateless OpenAI-compatible LLM gateways (like [`feather-ai-proxy`](/work/#feather-ai-proxy-chat-self-hosted-llm-gateway-native-client)), multi-provider routing with hard spend limits (OpenRouter, EU-hosted endpoints, local **Ollama** / **exo** clusters), and self-hosted or on-device speech-to-text and audio transcription pipelines.
- **Example engagement**: Deploying a self-hosted LLM gateway and internal chat/automation workflow with strict API key scoping, provider fallback, and local speech-to-text transcription for editorial or engineering teams.

## 6. Maintenance retainers

_"Always touch a running system."_ Continuous care so production systems stay patched, observable, and boring.

- **Who it's for**: Teams with business-critical services, older Linux/container deployments, or completed client projects that don't justify a full-time DevOps hire but cannot afford silent bit-rot.
- **Typical problems**: Outdated base images and runtime versions, piling Dependabot/renovate alerts nobody reviews, expiring TLS certificates or tokens, untested database backups, and the [classic trap](/blog/2026-w29-weeknotes-no4/) of _"never touch a running system"_ until a CVE or hardware failure forces an emergency rewrite.
- **What's delivered**: Scheduled monthly maintenance — runtime and dependency upgrades, container image and OS patching, Terraform drift checks, backup restore drills, uptime/alert tuning, and a concise monthly health summary.
- **Example engagement**: Ongoing monthly retainer (starting at 1–2 days/month) keeping a set of Kubernetes/k3s workloads, Terraform states, and TypeScript/Go services current, patched, and verified.

---

## How I work

- **Remote-first, based near Freiburg**: I work remotely with teams across Germany, Austria, Switzerland, and the EU (CET/CEST), and am available for on-site workshops or kickoffs in southwest Germany (Freiburg, Karlsruhe, Stuttgart, Basel).
- **Written documentation by default**: Decisions live in short [RFCs](/work/) and Markdown docs inside your repository — not buried in chat threads or slides.
- **Built to last beyond my involvement**: I stick to standard tools, lean dependencies, and reproducible `justfile` + Terraform workflows so your team can run everything without me on day one after handover.
- **Availability**: Alongside my work at SWR Audio Lab, I take on **1–2 focused freelance projects or retainers at a time** (typically **2–4 days per month** for ongoing retainers or scoped multi-week delivery blocks).
- **Languages**: German (native) and English (fluent).

<!-- TODO: Decide whether to display day rates / fixed-scope starting prices here once finalized. -->

---

## Hire / Get in touch {#contact}

The fastest way to start is a short email or a free 30-minute intro call to check fit, scope, and timing.

- **Email**: [`contact@frytg.com`](mailto:contact@frytg.com?subject=Project%20inquiry%20%E2%80%93%20frytg.digital)
- **LinkedIn**: [`linkedin.com/in/frytg`](https://www.linkedin.com/in/frytg/)
- **Matrix (encrypted chat)**: [`@frytg:beoriginal.social`](https://matrix.to/#/@frytg:beoriginal.social)
- **30-min intro call**: [Request a slot via email](<mailto:contact@frytg.com?subject=30-min%20intro%20call%20%E2%80%93%20frytg.digital&body=Hi%20Dan%2C%0A%0AI'd%20like%20to%20book%20a%2030-minute%20intro%20call.%0A%0A-%20Project%20%2F%20context%3A%20%0A-%20Timeline%3A%20%0A-%20Budget%20range%3A%20%0A-%20Suggested%20times%20(CET)%3A%20>)

<!-- TODO: Optional — replace the mailto intro-call link above with a Cal.com booking link if desired. -->

### What to include in your message

A few bullet points are plenty — no formal RFP needed:

1. **Project & context** — What are you building, migrating, or trying to stabilize?
2. **Timeline** — When would you like to start, and is there a hard deadline or event date?
3. **Budget range or engagement mode** — Fixed-scope audit/project, short sprint, or ongoing monthly retainer?

[Email contact@frytg.com](mailto:contact@frytg.com?subject=Project%20inquiry%20%E2%80%93%20frytg.digital&body=Hi%20Dan%2C%0A%0A1.%20Project%20%26%20context%3A%20%0A2.%20Timeline%3A%20%0A3.%20Budget%20range%20%2F%20mode%3A%20) [Connect on LinkedIn](https://www.linkedin.com/in/frytg/)
{.cta-row}

_Privacy note: Consistent with the rest of this site, there is no third-party contact form widget or tracking script here — your email goes straight to my Proton Mail inbox._
