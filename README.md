# remotion-skill-pack

AI agent skill pack for producing [Remotion](https://www.remotion.dev/) video presentations. Install once, and your AI coding agent can author structured composition specs that render to production-ready `.mp4` files.

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
