---
title: Migrating a GitHub repository to Tangled
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
atUri: 'at://did:plc:jttpxcpdum6st5hh6dwf6f72/site.standard.document/3mqa7bufja22x'
---

## The backstory

git...

## Signing up for Tangled

Make sure your public key(s) is added to Tangled on [tangled.org/settings/keys](https://tangled.org/settings/keys).

## Migrating a repository

Also see [Tangled docs "_Migrating an existing repository_"](https://docs.tangled.org/quick-start-guide#migrating-an-existing-repository)

1. Make sure your `main` branch is clean and pushed
2. Go to [tangled.org/repo/new](https://tangled.org/repo/new) and create a new one
   1. The resulting site will show you the created did (`git@tangled.org:did:plc:...`)
3. Use [`git-sync`](https://github.com/entireio/git-sync) (see [install guide here](https://github.com/entireio/git-sync#installation)) to copy the `main` branch over – depending in repo size this may take a while

   ```bash
   git-sync sync --branch main "git@github.com:frytg/pkgy.git" "git@tangled.org:did:plc:mc3ztkdooczcg7ojmovuel22"
   ```

4. Optionally, check current remote setup with `git remote -v`
5. Update the remote URL – you can use the did or something `git@tangled.org:user.tngl.sh/my-project`

   ```bash
   git remote set-url origin git@tangled.org:did:plc:mc3ztkdooczcg7ojmovuel22
   ```

6. Test with `git push origin main`

You should see something like this:

> Welcome to Tangled's hosted knot! 🧶
> Everything up-to-date

## Syncing Tangled to GitHub

To keep the old repository on GitHub in sync, i like to use a Spindle workflow. Spindles are the Tangled version of GitHub Actions.

To make this work, first setup a deploy key.

Go to your newly created repo -> _Settings_ -> _Pipelines_ and choose the default hosted Spindle, then save. Afterwards create a new SSH key and save it to _Secrets_ in `GITHUB_DEPLOY_KEY`.

Then on GitHub in your old repo, go to _Settings_ -> _Deploy keys_ and add the public key version. Make sure _Allow write access_ is toggled on.

### Spindle Workflow

Create a new file in `.tangled/workflows/github-mirror.yml` and update the `GIT_REMOTE_REPO` env and `user.name`.

```yaml
# Spindle docs: https://docs.tangled.org/spindles#spindles
# Mirror pushes from Tangled to github.com/frytg/dotfiles.
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
