#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-full}"

if [ -n "${RSP_CORE_DIR:-}" ] && [ -f "$RSP_CORE_DIR/SKILL.md" ]; then
  CORE_DIR="$RSP_CORE_DIR"
else
  CORE_PKG_DIR=$(node -e "console.log(require.resolve('@remotion-skill-pack/core/skill'))" 2>/dev/null || true)
  if [ -z "$CORE_PKG_DIR" ]; then
    echo "ERROR: cannot locate @remotion-skill-pack/core." >&2; exit 1
  fi
  CORE_DIR=$(dirname "$CORE_PKG_DIR")
fi

mkdir -p .cursor/rules
SKILL_BODY=$(cat "$CORE_DIR/SKILL.md")
cat > .cursor/rules/remotion-skill-pack.mdc <<EOF
---
description: remotion-skill-pack — Remotion video composition skill
globs: ["**/*.json", "**/*.tsx"]
---

$SKILL_BODY
EOF

echo "remotion-skill-pack › cursor adapter"
echo "  ✓  Installed rule at .cursor/rules/remotion-skill-pack.mdc"

if [ "$MODE" = "full" ]; then
  MCP=.cursor/mcp.json
  if [ ! -f "$MCP" ]; then echo '{ "mcpServers": {} }' > "$MCP"; fi
  node - <<EOF2
const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync('$MCP', 'utf-8'));
cfg.mcpServers = cfg.mcpServers || {};
cfg.mcpServers['remotion-skill-pack'] = { command: 'npx', args: ['@remotion-skill-pack/mcp-server'] };
fs.writeFileSync('$MCP', JSON.stringify(cfg, null, 2));
EOF2
  echo "  ✓  MCP server registered in $MCP"
fi
echo "Done."
