---
title: Weeknotes no.11 – the cloud is on my shelf now
draft: false
seo_description: A journey from Apple Xserve and cloud infrastructure to a simple, secure homelab setup built for practical on-premises hosting.
summary: A journey from Apple Xserve and cloud infrastructure to a simple, secure homelab setup built for practical on-premises hosting.
image: images/og-card/2026-weeknotes/2026-09-06-weeknotes-og-card-2x1.jpg
date: 2026-09-06T19:17:00+00:00
categories:
  - weeknotes
tags:
  - weeknotes
  - homelab
atUri: 'at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.document/3muxb4xek6s2p'
---

![Apple Xserve](images/blog/2026-weeknotes/2026-09-06-weeknotes-11-1.jpg)

about 15 or so years ago my father had an apple xserve for his business (_remember back when there was a server version of mac os?_).  
it hosted their website and web shop. it was also the first time i got in contact with server administration, mysql, phpmyadmin, apache, and all that.  
i remember tweaking their php script that synced orders and products between the web shop and inventory system.  
and all of that lived in a server rack in the basement!

one day when i'm 80 years old, you can wake me up at night and i can still tell you our assigned static public ip address without hesitation :)

![official NAB Show bloggers pass](images/blog/2026-weeknotes/2026-09-06-weeknotes-11-2.jpg)

↑ _my official NAB Show bloggers pass back then_ ;)

later, i would also host my first blog on there (first wordpress, then expression engine and craft cms) when i was interested in filmmaking and the whole dslr camera bubble.  
_fun fact_: since i had quite a decent following on twitter back then, whenever i tweeted a new blog post, the whole web server would be unusable for a minute or two since all the crawlers hit it simultaneously...

then, _the cloud_ came around and i was fascinated by how i could spin up the most insane VMs with just a few clicks.

and there's a real usage for that, but deploying things on my homelab PC(s) has been quite fun recently as well.  
with some tunneling service up front that provides ingress and blocks the bots & DDoS, it's quite a nice setup now. everything else is tailscale and internal-only. this is also thanks to speedier basic fibre connections nowadays. one of my homelab PCs sits behind a 1 Gbps and the other behind 300 Mbps. for normal everyday stuff this is absolutely enough.

it's funny how i (and lots of others) went full circle, first deployed everything in _the cloud_ and are now coming back to appreciate _on-prem_ solutions again.

most importantly it's also a test with how little setup one can build and run everything. sometimes i see posts on [HN](https://news.ycombinator.com) or similar which read something like _using Flurb CI with GibberOps on my three node hypervisor setup blabla..._  
c'mon, your website has 100 viewers, not 100 million.

✌️
