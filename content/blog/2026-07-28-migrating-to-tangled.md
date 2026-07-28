---
title: Migrating a GitHub repository to Tangled
draft: false
seo_description: A quick step-by-step guide on migrating a repository from GitHub to Tangled
summary: A quick step-by-step guide on migrating a repository from GitHub to Tangled
image: images/og-card/dev-2024-Q4-A-2x1.jpg
date: 2026-07-28T07:17:00+00:00
tags:
  - coding
  - Tangled
  - atproto
  - git
atUri: 'at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.document/3mrpwkwyw242x'
---

## The backstory

GitHub seems to be beyond its peak i feel. The outages have become sort of a trending thing, and at the same time they keep adding new AI features instead of stability.

I had mentioned this in past weeknotes as well; there seems to be a sudden influx of git alternatives. Not just the usuals like Forgejo, GitLab, etc., but a lot of other new platforms ([gitlawb](https://gitlawb.com), [Cursor Origin](https://cursor.com/origin), etc.).

Of course a lot of them are aimed at AI agents since they have different requirements in terms of identity and throughput, but a lot are also born out of users' frustration with GitHub (me partly included).

## Signing up for Tangled

"_Tangled is a decentralized code hosting and collaboration platform_" ([docs](https://docs.tangled.org))

It builds on top of the [AT Proto](https://atproto.com) universe, therefore creating an "account" is as simple as logging in with your existing atmosphere account. Here's mine: [tangled.org/frytg.digital](https://tangled.org/frytg.digital).

Tangled then adds their records to your identity ([see example here](https://pdsls.dev/at://did:plc:jttpxcpdum6st5hh6dwf6f72#collections:sh.tangled)). Along with other AT Proto projects everything is public. So far there are no scoped or private repos.

On their platform code lives on Knots (which you can also [self-host](https://docs.tangled.org/knot-self-hosting-guide#knot-self-hosting-guide)).

To migrate a repository, make sure your public key(s) are added to Tangled on [tangled.org/settings/keys](https://tangled.org/settings/keys).

## Migrating a repository

Also see [Tangled docs "_Migrating an existing repository_"](https://docs.tangled.org/quick-start-guide#migrating-an-existing-repository)

1. Make sure your `main` branch is clean and pushed
2. Go to [tangled.org/repo/new](https://tangled.org/repo/new) and create a new repository
   1. The resulting site will show you the created _did_ (`git@tangled.org:did:plc:...`)
3. Use [`git-sync`](https://github.com/entireio/git-sync) (see [install guide here](https://github.com/entireio/git-sync#installation)) to copy the `main` branch over – depending on your repo size this may take a while

   ```bash
   git-sync sync --branch main "git@github.com:frytg/pkgy.git" "git@tangled.org:did:plc:mc3ztkdooczcg7ojmovuel22"
   ```

4. Optionally, check current remote setup with `git remote -v`
5. Update the remote URL – you can use the full path `git@tangled.org:user.tngl.sh/my-project` or the _did_ from previous steps

   ```bash
   git remote set-url origin git@tangled.org:did:plc:mc3ztkdooczcg7ojmovuel22
   ```

6. Test with `git push origin main`

You should see something like this:

> Welcome to Tangled's hosted knot! 🧶  
> Everything up-to-date

## Syncing Tangled to GitHub

To keep the old repository on GitHub in sync, I like to use a Spindle workflow. Spindles are the Tangled version of GitHub Actions.

To make this work, first set up a deploy key.

Go to your newly created repo -> _Settings_ -> _Pipelines_ and choose the default hosted Spindle, then save. Afterwards create a new SSH key and save it to _Secrets_ in `GITHUB_DEPLOY_KEY`. GitHub allows deploy keys to be used only once, so you'll need a new one per repo.

Then on GitHub in your old repo, go to _Settings_ -> _Deploy keys_ and add the public key version. Make sure _Allow write access_ is toggled on.

### Spindle Workflow

Create a new file in `.tangled/workflows/github-mirror.yml` and update the `GIT_REMOTE_REPO` env and `user.name`.

```yaml
# Spindle docs: https://docs.tangled.org/spindles#spindles
# Mirror pushes from Tangled to GitHub
# Add GITHUB_DEPLOY_KEY under Settings → Secrets and assign a spindle.

when:
  - event: ['push', 'manual']
    branch: ['main']

engine: microvm
image: nixos

clone:
  depth: 10

dependencies:
  - git
  - openssh

registry:
  nixpkgs: github:nixos/nixpkgs/nixos-unstable

environment:
  GIT_REMOTE_REPO: 'git@github.com:frytg/pkgy.git'

steps:
  - name: 'Mirror to GitHub'
    command: |
      set -euo pipefail

      if [ -z "${GITHUB_DEPLOY_KEY:-}" ]; then
        echo "GITHUB_DEPLOY_KEY not set — skipping"
        exit 0
      fi

      echo "TANGLED_REF_NAME: ${TANGLED_REF_NAME}"
      echo "TANGLED_SHA: ${TANGLED_SHA}"
      echo "HEAD: $(git rev-parse HEAD)"
      echo "GIT_REMOTE_REPO: ${GIT_REMOTE_REPO}"

      mkdir -p "$HOME/.ssh"
      chmod 700 "$HOME/.ssh"
      touch "$HOME/.ssh/known_hosts"

      eval "$(ssh-agent -s)" > /dev/null
      ssh-add - <<< "${GITHUB_DEPLOY_KEY}"
      ssh-keyscan -t rsa,ed25519 github.com >> "$HOME/.ssh/known_hosts"

      git config user.name "Daniel Freytag"
      git config user.email "ci@frytg.digital"
      git remote add mirror "${GIT_REMOTE_REPO}"
      git push --force mirror "HEAD:refs/heads/${TANGLED_REF_NAME}"
```

Push this file and see workflow progress in the web UI. Usually the process takes about 30 seconds.
