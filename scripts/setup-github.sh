#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# setup-github.sh — one-time GitHub repository metadata setup.
#
# These commands MUTATE the live GitHub repo. Review them, then run this
# script manually (or copy/paste the commands). It is intentionally NOT run
# by any automated tooling.
#
# Prereqs: `gh` CLI authenticated with repo admin scope (`gh auth login`).
# ---------------------------------------------------------------------------

REPO="isatimur/remotion-skill-pack"

# Homepage: the deployed marketing site lives in ./web and is served via
# Vercel (see web/vercel.json). The production domain is not committed to the
# repo, so confirm the live URL before running.
# TODO(confirm): replace with the actual deployed Vercel URL.
HOMEPAGE="https://remotion-skill-pack.vercel.app"

DESCRIPTION="Give your AI coding agent (Claude Code, Cursor, Copilot, Codex, Gemini) the power to author Remotion video compositions as structured specs that render to real .mp4 files."

gh repo edit "$REPO" \
  --description "$DESCRIPTION" \
  --homepage "$HOMEPAGE" \
  --add-topic remotion \
  --add-topic video \
  --add-topic ai-agent \
  --add-topic mcp \
  --add-topic model-context-protocol \
  --add-topic claude-code \
  --add-topic react-video \
  --add-topic cursor \
  --add-topic llm \
  --add-topic ai-video

# ---------------------------------------------------------------------------
# Social Preview image (cannot be set via gh CLI — do this in the browser):
#
#   1. Produce a 1280x640 PNG/JPG (GitHub crops to ~1200x630 in cards).
#      Suggested content: the repo name, the one-line tagline, a rendered
#      frame from a sample Remotion video, and the npm install command.
#   2. Go to: https://github.com/isatimur/remotion-skill-pack
#      → Settings → General → Social preview → "Edit" → upload the image.
#   3. Verify the card with: https://www.opengraph.xyz/url/https%3A%2F%2Fgithub.com%2Fisatimur%2Fremotion-skill-pack
#
# NOTE: this social preview image still needs to be designed/produced — it
# does not exist in the repo yet.
# ---------------------------------------------------------------------------
