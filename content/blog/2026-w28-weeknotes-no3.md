---
title: Weeknotes no.3 – how AI-pilled are you? 🧠💊
draft: false
seo_description: Taken the ai fluency index test?
summary: Taken the ai fluency index test?
image: images/blog/weeknotes-og-card-2x1.jpg
date: 2026-07-09T16:17:00+00:00
categories:
  - weeknotes
tags:
  - weeknotes
  - homelab
  - AI
  - agents
  - coding
atUri: "at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.document/3mqa7bufja22x"
---

depending on how deep you are in the tech and ai bubble you may have heard of the term "_ai-pilled_": "_The transformative moment when someone fully embraces AI’s capabilities, often after a mind-opening, sleepless deep-dive._" (from [thedictionaryofpresentfutures.com](https://www.thedictionaryofpresentfutures.com/post/pilled)).

there's even an [ai fluency index](https://www.ai-pilled.com/) test you can take to evaluate your level. while this may sound a lot like some annoying ai hype bro stuff, there's a valid point here: different people are differently ahead (or behind) in terms of ai knowledge and adoption ([roadmap.sh](https://roadmap.sh/ai-engineer) is a good high-level overview).

[lenny rachitsky](https://x.com/lennysan) who runs lenny's newsletter and podcast where he dives deep into current tech trends, product management and more, just ran the annual tech worker sentiment survey for the second time and the key result fully aligns:

> Today we’re back with the results from our 2026 survey, and it’s **a tale of two workforces**.
>
> One half feels amplified by AI—more capable, more confident, more excited than they’ve been in _their entire career_. The other half feels shaken by it—less sure of their value and whether there’s still a place for them. Which side of that line people fall on predicts how they feel about their career more than anything else, including their current role, seniority, company size, or any other measure we collected. The workforce is bifurcating into two realities.
> (from [lennysnewsletter.com](https://www.lennysnewsletter.com/p/how-tech-workers-are-feeling-in-2026))

while there are real concerns from the survey such as rising rates of burnout and fear of job loss the underlying shift is clear: **ai is disrupting everything**.

as someone who is more of an early adopter and wants to try out new tools these are exciting times! new agents, tools, and models basically emerge faster than one can try and evaluate them. yet somehow this is less of a concern to me than the sheer sleepy attitude that most companies are presenting. maybe it's a german or european thing, but it seems like they're still caught up in digitalization before they can even start an ai migration. and rolling out a chatbot or copilot is not a real ai migration!

we over engineered all bureaucratic aspects in big companies that by the time someone pushes a new tool through all of its hurdles, it's already obsolete and the market trends have long moved on.

that all goes back to the ai-pilled self-test (and even deeper): how can we expect engineers that are pushing java code on in-house vmware machines to care or be interested in agent loops, agentic frameworks, or what the latest buzzwords are?

it all comes down to the basics, the foundations. if you're burdened with technical debt, lack of proper metadata infrastructure, or an instinctive drive for change, this ai revolution is gonna be so much harder for you – and might eat you alive. ⚰️

![pi terminal coding agent](images/blog/2026-weeknotes/2026-07-09-pi.png)

## tool of the week award 🏆

in a world of claude code, codex, and more, i've always preferred my trusty cursor app. it works so well and they made huge improvements to the product with every update.

yet, somehow this past week i became quite interested in [pi](https://pi.dev/). this little terminal coding agent follows very different principles and is built suuuuuper minimalistic from the ground up. it also works really well as a plugin inside [zed](https://zed.dev/docs/ai/external-agents#pi). two well built and minimal apps. 🤝🏼

there's a [really good talk](https://youtu.be/RjfbvDXpFls?is=xiYOLUD43274b2Kn) by the creator mario zechner about the idea behind it.

databricks [evaluated coding harnesses](https://www.databricks.com/blog/benchmarking-coding-agents-databricks-multi-million-line-codebase) and found that using efficient harnesses like pi, and measuring cost-per-task rather than cost-per-token can dramatically reduce ai coding costs while maintaining quality. also, open models are now capable of handling even the most difficult tasks.

## links, tools, and articles

- [ecosia](https://blog.ecosia.org/ai-free-search/) now lets you choose ai-free search
- [entire](https://entire.io/blog/an-entirely-new-git-hosting-network) is coming out of stealth and is getting more vocal about their tools – driven by the former github ceo thomas dohmke, they are building interesting global git caching
  - generally it seems like git(hub) alternatives are a big topic: cursor is launching [origin](https://cursor.com/origin) later this year; [tangled](https://tangled.org) is getting a lot of traction in the at proto community; gitlawb is building a [network](https://gitlawb.com/network) for ai agent code storage based on _did_ identities; zed is building [deltadb](https://zed.dev/deltadb) with a similar-ish idea, and more...
- the creator of pixelfed, loops, and more built a landing page [fediverse.info](https://fediverse.info/), a good step, but the fediverse is still tricky for non-techy users to onboard
- bun wrote about their insane [zig to rust](https://bun.com/blog/bun-in-rust) rewrite burning through the equivalent of $165k in tokens
  - while there's a degree of criticism that's valid, this is a really good example of the things that are about to come
- [dnsglobe](https://github.com/514-labs/dnsglobe) seems like an interesting cli to watch dns propagation for major public resolvers
- [openrouter](https://openrouter.ai/) 💚 this is by far not a new or revolutionary tool, but one that i use every day. instead multiple subscriptions i just charge it with $50 every now and then and it sits behind so many tools and apps, from hermes, to osaurus, pi, and more. it's also great that every api key has its own daily/ weekly limits. this way there's no chance at getting bankrupted on wild llm calls
- read one of the cooler bio one-liner pitches from [deeptune](https://x.com/deeptuneai?s=21): "_training gym for agents_" 🏋🏼‍♂️
- hugging face now has a [filter setting by hardware](https://huggingface.co/changelog/filter-models-by-hardware), so one can only view the models that work on a certain setup

🫶🏼 if you made it this far, congratulations to you for reading and to me for being consistent and publishing the third weeknotes in a row 🚀 if you have any feedback or criticism, [please do reach out](/social/) 🙏

this blog post was written without ai, but with the support of a hammock. ☀️😎
