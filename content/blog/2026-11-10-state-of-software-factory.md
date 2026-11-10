---
title: State of the Software Factory (aka. Slop Theater)
draft: false
seo_description: market overview + my herdr / multiplexer setup, written for engineers who value quality, traceability and reproducibility over hype.
summary: market overview + my herdr / multiplexer setup, written for engineers who value quality, traceability and reproducibility over hype.
image: images/blog/2026-11-10-state-of-software-factory/software-factory-og-card-2x1.jpg
date: '2026-11-10T19:07:00+00:00'
disclaimer: Research and summaries assisted with AI, but the opinions and conclusions are my own. Some abstract images/ visualizations created with AI and humanly edited.
categories:
  - tech
tags:
  - work
  - ai
  - agents
  - software factory
atUri: at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.document/3mzy7kugsjs2q
---

TL;DR: **A software factory is essentially a modern SDLC or CI/CD where some or most of the workers are agents.**  
The interesting part is not the AI; it is the production line around it:
every change, no matter who (or what) wrote it, passes the same automated gates.

> fair warning: this post contains a bunch of twitter links. i know some people are not fans, but [that's where the party is going on right now](https://daringfireball.net/2026/10/x_once_again_marks_the_spot).

---

## The factory market in 60 seconds

```txt
  "software factory" on X, 27 Oct – 10 Nov 2026

  posts/day
   600 |                         ██  ← 6 Nov: Lauren Tan (@poteto)
       |                         ██     "it's marketing"
   400 |                      ▄▄ ██ ▄▄
       |                ▄▄ ▄▄ ██ ██ ██ ▄▄
   200 |       ▄▄ ▄▄ ▄▄ ██ ██ ██ ██ ██ ██ ▄▄
       |    ▄▄ ██ ██ ██ ██ ██ ██ ██ ██ ██ ██
     0 +------------------------------------
         (shape illustrative; peak ≈ 578 originals on 6 Nov,
          ≈ 2,600 originals in the last 7 days)
```

The debate has two camps, and both are partly right:

- **Builders and vendors** ([Factory's Eno Reyes](https://x.com/EnoReyes/status/2118767454721851680),
  [Warp's Zach Lloyd](https://x.com/zachlloydtweets/status/2118043142259888383), HumanLayer,
  [Matt Pocock with his course](https://x.com/mattpocockuk/status/2115538750147023323) and Sandcastle)
  see a real operating model: agents wired into the whole development lifecycle.
- **Skeptics** see a marketing term.
  - [Lauren Tan (@poteto)](https://x.com/poteto/status/2118613050462728659): spend tokens on deterministic engineering instead.
  - [dax @thdxr](https://x.com/thdxr/status/2118604739428426223): vendors selling factories produce a shockingly tiny amount of software.
  - [Gergely Orosz](https://x.com/GergelyOrosz/status/2119114323289420240): 99% of companies don't need one.
- **The middle ground**, in [Matt Pocock's words](https://x.com/mattpocockuk/status/2119748545691402733):
  "bullshit and a bandwagon, but also a real change."

### Definitions worth quoting

**[Warp](https://www.warp.dev/factories):**

> A factory is a fleet of agents wired to your SDLC — triggered by an issue, a Slack message, or a schedule, and coordinated from triage through review to a mergeable PR.

**[Eno Reyes (Factory CTO)](https://x.com/EnoReyes/status/2118767454721851680):**

> A real software factory standardizes the path, not the output: every signal becomes a change that passes the same blind checks until AI-written code breaks less often than human code and can automerge, while people step off the line to set goals, rules, and autonomy.

![modern SDLC by Eno Reyes](images/blog/2026-11-10-state-of-software-factory/factory-enoreyes.jpg)

_(image by Eno Reyes, CTO of Factory, from [his twitter thread](https://x.com/EnoReyes/status/2118767454721851680))_

### What remains

- The term is questionable, and that's fine. What matters is the idea underneath.
- The goal is not _"AI writes code"_. The goal is _"AI-written changes break less often than human ones, and we can measure it."_

![maturity ladder](images/blog/2026-11-10-state-of-software-factory/maturity-ladder.svg)

## The maturity ladder

Based on [@mardehaym's 7 steps](https://x.com/mardehaym/status/2113990724282724742) (which i quite liked) from scattered tools to orchestrated workflows:

1. **Tool adoption.** AI tools are scattered across the org, and a human runs each one. The workflow dies when that person is on leave (bus factor = 1).
2. **Context layer.** Knowledge is organized per domain, kept separate so agents don't mix up contexts.
3. **Harness engineering.** Evals, routing and quality gates come before choosing a model. The harness is the lasting investment; the LLM is a swappable part.
4. **Go headless.** Automations run on a server, on a schedule or on conditions, not on someone's laptop. **This is where most companies stall.**
5. **Governance.** Access control (RBAC) on every knowledge source, and a lifetime for every agent: retire it after 90 days idle or when its evals fail.
6. **Agent-to-agent.** Headless agents are chained along a value chain, with an LLM quality gate on every handoff.
7. **Step functions.** Orchestrated, semi- or fully automated workflows: agents handle the volume, humans handle the exceptions.

**Where we are:** my setup is roughly at step 4, with experiments in 5 and 6.

![software factory line](images/blog/2026-11-10-state-of-software-factory/factory-line.svg)

## My setup as a production line

**This is a snapshot of today, not a recommendation for next month.**

Tools in this space change every few days: harnesses, multiplexers and review bots get replaced constantly. What lasts is the foundation underneath (git, documentation, tests, infrastructure as code). Have that ready, and swapping any tool on top becomes a small change.

```txt
  ┌───────────────────────────────────────┐
  │ 1. ORDER INTAKE (triggers)            │
  │    user feedback · red CI ·           │
  │    updates · cron jobs                │
  └───────────────────┬───────────────────┘
                      ▼
  ┌───────────────────────────────────────┐
  │ 2. WORKSTATIONS (harnesses)           │
  │    pi · claude · cursor · droid       │
  │    reads: AGENTS.md · docs · RFCs     │
  └───────────────────┬───────────────────┘
                      ▼
  ┌───────────────────────────────────────┐
  │ 3. CONTROL ROOM (multiplexer)         │
  │    herdr · tmux · rex                 │
  │    1 human supervises many lines      │
  └───────────────────┬───────────────────┘
                      ▼
  ┌───────────────────────────────────────┐
  │ 4. VERSION CONTROL (git)              │
  │    branch/worktree per agent ·        │
  │    small commits · pull request       │
  └───────────────────┬───────────────────┘
                      ▼
  ┌───────────────────────────────────────┐
  │ 5. QUALITY CONTROL (review)           │
  │    frog · custom checks · CI tests ·  │
  │    cursor / claude / copilot review   │
  └─────────┬──────────────────┬──────────┘
            │ ✓ pass           │ ✗ fail
            ▼                  └─► back to 2
                                   (stop the line)
  ┌───────────────────────────────────────┐
  │ 6. SHIPPING (deploy)                  │
  │    trunk-based · main = prod ·        │
  │    auto-deploy                        │
  └───────────────────────────────────────┘
```

### The foundation needed for this

- git = source of truth
- hybrid connectivity with ACL = Tailscale
- reproducible infrastructure = everything is IaC (Kubernetes YAML, Terraform, NixOS)
- gated- or auto-deploys for every change = CI/CD pipelines

### Station details

- **Triggers:** user feedback, red CI, dependency updates and cron jobs. Work starts from a defined signal, not from someone's mood, and is traceable from ticket to commit.
- **Harnesses:** pi, Claude, Cursor, Droid, or others. They are interchangeable tools, so there's no vendor lock-in; the model is a commodity.
- **Multiplexer:** herdr, tmux and rex. One person supervises several agents in parallel, sees every session and can step in at any time.
- **Git:** a branch or worktree per agent, small commits and pull requests. Agents work in isolation and never touch main directly. Every change is a reviewable diff with history and can be reverted.
- **Review:** frog, custom checks, CI and Cursor / Claude / Copilot review. Several independent checks, like a four-eyes rule, but automated and the same every time.
- **Deploy:** trunk-based, main is prod. This only works _because_ of the gates before it: small changes, fast rollback.
- **Foundation:** git, Tailscale, IaC and more. Everything can be rebuilt from code, and nothing lives only on one machine.

Every station is familiar from classic CI/CD. The only new parts are the workstations (agents) and the control room. **Nothing reaches main without passing the same gates as a human pull request.**

![software factory layers](images/blog/2026-11-10-state-of-software-factory/factory-layers.svg)

## The foundation: context layers

Agents are only as good as the knowledge they can read. That knowledge is written down, versioned in git, and layered from general to specific:

```txt
  specific
     ▲   ┌──────────────────────────────────┐
     │   │ WHY: RFCs / decision records     │
     │   │ "we chose X over Y because…"     │
     │   └────────────────┬─────────────────┘
     │   ┌────────────────▼─────────────────┐
     │   │ WHAT: written documentation      │
     │   │ docs/ folder in every repo       │
     │   └────────────────┬─────────────────┘
     │   ┌────────────────▼─────────────────┐
     │   │ WHERE: monorepo-style layout     │
     │   │ one place, one history, one CI   │
     │   └────────────────┬─────────────────┘
     │   ┌────────────────▼─────────────────┐
     │   │ HOW (this repo): repo AGENTS.md  │
     │   │ build/test commands, rules       │
     │   └────────────────┬─────────────────┘
     │   ┌────────────────▼─────────────────┐
     │   │ HOW (everywhere): global         │
     │   │ AGENTS.md · skills · dotfiles    │
     ▼   └──────────────────────────────────┘
  general
```

- **[RFCs](https://tangled.org/frytg.digital/dotfiles/blob/main/skills/rfc/SKILL.md):** dated proposals and decisions. **They are the why.** They stop agents (and new colleagues) from "fixing" things that are deliberate.
- **`docs/` folder and written documentation:** architecture, runbooks, onboarding. Knowledge that otherwise lives only in people's heads.
- **monorepo-style layout:** related services, infra and docs in one place. The agent sees the whole picture, and one change can span code, infra and docs.
- **repo AGENTS.md:** how to build, test and lint, and what not to touch. The local work instruction for this station.
- **[skills](https://tangled.org/frytg.digital/dotfiles/tree/main/skills), global agents, [dotfiles](https://tangled.org/frytg.digital/dotfiles):** reusable workflows (release, dependency check, review) plus shell and tool config. Repeatable procedures instead of improvised ones.
- **global [AGENTS.md](https://tangled.org/frytg.digital/dotfiles/blob/main/.agents/AGENTS.md):** personal conventions such as language, commit style and security rules. The same standards apply in every repo without repeating them.

Good documentation was always good engineering.  
With agents it becomes the input to production.  
A gap in the docs is now a gap in the output.

![abstract herdr app](images/blog/2026-11-10-state-of-software-factory/herdr-app-t.svg)

## The control room: `herdr` + multiplexer

```txt
 ┌────────────────────────── herdr / tmux ─────────────────────────────┐
 │ ┌─ pane 1 ───────────┐ ┌─ pane 2 ───────────┐ ┌─ pane 3 ───────────┐│
 │ │ repo-a             │ │ repo-b             │ │ infra              ││
 │ │ agent: claude      │ │ agent: pi          │ │ agent: cursor      ││
 │ │ task: fix red CI   │ │ task: dep update   │ │ task: IaC drift    ││
 │ │ status: ▶ running  │ │ status: ⏸ needs me │ │ status: ✓ PR open  ││
 │ └────────────────────┘ └────────────────────┘ └────────────────────┘│
 │                                                                     │
 │  Mac mini (remote agent machine)  ◄── Tailscale ──►  laptop / iPad  │
 └─────────────────────────────────────────────────────────────────────┘
```

- the agents run on a dedicated machine, not a laptop (that's "going headless", step 4 of the ladder).
- the human is the shift supervisor: decides tasks, checks status, unblocks, approves, steers.
- secure access globally through Tailscale; credentials come from 1Password or SOPS, rarely stored on disk.

[Herdr](https://herdr.dev) moved from a terminal UI to a native Rust + GPUI desktop app (macOS, Linux, Windows, [plus iPhone, iPad and Android](https://herdr.dev/mobile/)).

The original terminal version still exists as Herdr TUI, but it's a separate program and doesn't share agents with the new app.

Two details matter here:

- **The agents don't live in the window.** They run in `herdr-core`, a small server on the machine. Quit, update or crash the app, and every agent keeps working. Other machines join over SSH and/or Tailscale in the same sidebar.
- **Any agent can modify the app itself.** Layout, sidebar, tabs, keys and themes are plain files in `~/.config/herdr-app`, with their own `AGENTS.md` explaining them. You say _"put a timer on each tab"_ and your agent writes the change. The tool follows the same principle as the rest of the setup: [everything is a file](https://stephango.com/file-over-app), versioned, and documented for agents.

My personal herdr config is in my [dotfiles repo](https://tangled.org/frytg.digital/dotfiles/tree/main/herdr-app), so every machine automatically has the latest app config.

There's currently a whole sprawl of similar tools. Of course, the classic `tmux` is still a great multiplexer. `rex` from [superlogical](https://www.superlogical.com) is now in beta. Then there are also other less terminal-style apps like [Orca](https://www.onorca.dev), [Paseo](https://paseo.sh) or [Paradev](https://paradev.com).

![slop theater spotlight](images/blog/2026-11-10-state-of-software-factory/slop-theater.svg)

## Honest limits: "slop theater" check

```txt
   WHAT WORKS                          WHAT DOESN'T (YET)
   ──────────                          ──────────────────
   ✓ dependency/update chores          ✗ fuzzy product decisions
   ✓ fixing red CI                     ✗ big cross-cutting refactors
   ✓ small, well-specified changes     ✗ anything without tests
   ✓ IaC drift, boilerplate            ✗ review is the bottleneck
                                       ⚠ auto-approve: where's the line?
```

- No tests, no factory. The gates are only as good as the test suite.
- No docs, no factory. Agents can't follow rules nobody wrote down.
- Review capacity is the real limit, not how fast code gets written.

![what's next timeline](images/blog/2026-11-10-state-of-software-factory/whats-next.svg)

## What's next

```txt
  MARKET          PRODUCTS         SYSTEMS
  ──────          ────────         ───────
  definition      factories as     harnesses,
  war, review     products,        multiplexers,
  bottleneck      consolidation    models: weekly
      │                │                │
      └────────────────┼────────────────┘
                       ▼
        keep tools swappable, invest
        in foundations, measure output
```

### Market trends

- **The term is settling into practice, not "magic".** The loudest voices are fighting about what the word means: [Zach Lloyd](https://x.com/zachlloydtweets/status/2118043142259888383) calls it engineering rigor for how you deploy coding agents, and [Matt Pocock](https://x.com/mattpocockuk/status/2119748545691402733) calls it a bandwagon that still names a real change. The buzzword will fade, and the practices will stay.
- **Human attention is the new bottleneck.** Writing code is cheap now. Reviewing it isn't. [Warp](https://x.com/warpdotdev/status/2115507416255328311) moved its agents out of terminal sessions and into Slack, GitHub and Linear for exactly that reason.
- **"Dark factory" is the next fight.** That means lights-out pipelines that automerge with no human in the loop. It's still a niche topic, but it comes up more and more next to the review-bottleneck debate.
  - There's also a trend to classify PRs by "merge risk" (low, medium, high) and let low-risk ones merge automatically. I recently [had a skill written](https://tangled.org/frytg.digital/dotfiles/blob/main/skills/merge-risk/SKILL.md) that experimentally checks just that.

### Nothing is forever

- **Assume every tool is temporary.** The harness, the multiplexer and the model are swappable parts, and the setup above has a short shelf life.
- **Invest in what doesn't change:** git, tests, AGENTS.md, docs, RFCs and infrastructure as code. Each new tool plugs into them in minutes instead of weeks.
- **Measure, don't believe.** The only number that counts is whether agent-written changes break less often than human ones. Not posts, not demos.
- **Move from a personal line to a team line,** with governance: access control on knowledge sources, a lifetime for every agent, and evals that can retire it.

---

Also kudos to [@saerdnaer@chaos.social](https://chaos.social/@saerdnaer) for asking me to show my setup in our internal meeting, which triggered this whole write-up and visualizations.

### Appendix: terms in plain words

- **Agent:** a program that uses an LLM to plan and execute a task (edit code, run tests, open a PR).
- **Harness:** the tool wrapped around the model: prompts, tools, rules and limits (e.g. [Claude Code](https://claude.com/product/claude-code), [pi](https://pi.dev), [Cursor](https://cursor.com/), [Droid by Factory](https://factory.com), [Devin](https://devin.ai)).
- **Multiplexer:** a tool to run and watch many terminal sessions at once (tmux, herdr).
- **[`AGENTS.md`](https://agents.md):** a plain Markdown file of instructions that coding agents read before working in a repo.
- **[RFC](https://tangled.org/frytg.digital/dotfiles/blob/main/skills/rfc/SKILL.md):** "Request for Comments", a written, dated proposal explaining a decision and its reasons.
- **[MCP](https://tangled.org/frytg.digital/dotfiles/blob/main/docs/MCP.md):** Model Context Protocol, a standard plug-in interface that lets agents use tools and data sources.
- **Worktree:** a second checkout of the same git repo, so several agents can work on separate branches at once.
- **Headless:** runs on a server by itself, triggered automatically, with no human at a keyboard.
- **Automerge:** a PR is merged without a human click once all gates pass.
- **Dark factory:** a fully lights-out pipeline with no humans. Not what we do.
