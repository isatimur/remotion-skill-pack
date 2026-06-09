#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-full}"
TARGET="${HOME}/.codex/skills/remotion-skill-pack"

if [ -n "${RSP_CORE_DIR:-}" ] && [ -f "$RSP_CORE_DIR/SKILL.md" ]; then
  CORE_DIR="$RSP_CORE_DIR"
else
  CORE_PKG_DIR=$(node -e "console.log(require.resolve('@remotion-skill-pack/core/skill'))" 2>/dev/null || true)
  if [ -z "$CORE_PKG_DIR" ]; then
    echo "ERROR: cannot locate @remotion-skill-pack/core." >&2; exit 1
  fi
  CORE_DIR=$(dirname "$CORE_PKG_DIR")
fi

mkdir -p "$TARGET/references" "$TARGET/themes"
cp "$CORE_DIR/SKILL.md" "$TARGET/SKILL.md"
cp -R "$CORE_DIR/themes" "$TARGET/"
cp "$CORE_DIR/references/element-templates.md" "$TARGET/references/"
cp "$CORE_DIR/references/themes.md" "$TARGET/references/"

echo "remotion-skill-pack › codex adapter"
echo "  ✓  Installed skill at $TARGET"

if [ "$MODE" = "full" ]; then
  MCP="${HOME}/.codex/mcp.json"
  mkdir -p "$(dirname "$MCP")"
  if [ ! -f "$MCP" ]; then echo '{ "mcpServers": {} }' > "$MCP"; fi
  node - <<EOF
const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync('$MCP', 'utf-8'));
cfg.mcpServers = cfg.mcpServers || {};
cfg.mcpServers['remotion-skill-pack'] = { command: 'npx', args: ['@remotion-skill-pack/mcp-server'] };
fs.writeFileSync('$MCP', JSON.stringify(cfg, null, 2));
EOF
  echo "  ✓  MCP server registered in $MCP"
fi

echo "Done."
