# remotion-skill-pack

> Turn your AI coding agent into a video producer — structured specs in, real `.mp4` out.

[![npm version](https://img.shields.io/npm/v/@remotion-skill-pack/mcp-server?label=npm&color=cb3837&logo=npm)](https://www.npmjs.com/package/@remotion-skill-pack/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/isatimur/remotion-skill-pack?style=social)](https://github.com/isatimur/remotion-skill-pack/stargazers)

<!-- TODO: hero demo GIF/MP4 of a rendered Remotion video — render an actual sample and embed here. Highest-leverage missing asset. -->

Give any AI coding agent the ability to author [Remotion](https://www.remotion.dev/) video compositions as structured JSON specs that render to production-ready `.mp4` files.

> ⭐ If this saves you an afternoon of Remotion boilerplate, star the repo — it's how others find it.

## Install

```bash
# Claude Code
npx @remotion-skill-pack/install claude-code

# Cursor
npx @remotion-skill-pack/install cursor

# GitHub Copilot
npx @remotion-skill-pack/install copilot

# Codex / Gemini CLI / CLI
npx @remotion-skill-pack/install codex
npx @remotion-skill-pack/install gemini-cli
npx @remotion-skill-pack/install cli
```

## Render

```bash
npx @remotion-skill-pack/render composition.json -o out/
npx @remotion-skill-pack/render composition.json -o out/ --theme minimal-dark
```

## Why this vs. plain Remotion / other tools

- **Structured, agent-authorable specs** — agents emit a validated `composition.json` instead of hand-writing React/TSX, so output is predictable and reviewable.
- **Multi-agent install in one command** — works across Claude Code, Cursor, Copilot, Codex, and Gemini CLI; no per-tool glue code.
- **Renders to real `.mp4`** — the spec compiles to a Remotion composition and renders an actual video file, not a preview or a mockup.
- **No boilerplate** — skip wiring `<Composition>`, sequences, and timing by hand; themes and the schema handle layout, so the agent focuses on content.

## Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `@remotion-skill-pack/core` | 0.1.0 | Schema, SKILL.md, bundled themes |
| `@remotion-skill-pack/render` | 0.1.0 | CLI + API: composition.json → TSX |
| `@remotion-skill-pack/mcp-server` | 0.1.0 | MCP stdio server (5 tools) |
| `@remotion-skill-pack/install` | 0.1.0 | Adapter installer |
| `@remotion-skill-pack/create-template` | 0.1.0 | Theme scaffolder |
| `remotion-skill-pack-render` | 0.1.0 | Python CLI wrapper (PyPI) |

## Themes

- **book-chapter** — dark studio (`#0f0f14` bg, `#6ee7b7` accent); designed for *From Copilot to Colleague*
- **minimal-dark** — clean neutral dark (`#111827` bg, `#60a5fa` accent)

## License

MIT
