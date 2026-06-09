#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-full}"
TARGET="${HOME}/.gemini/extensions/remotion-skill-pack"

if [ -n "${RSP_CORE_DIR:-}" ] && [ -f "$RSP_CORE_DIR/SKILL.md" ]; then
  CORE_DIR="$RSP_CORE_DIR"
else
  CORE_PKG_DIR=$(node -e "console.log(require.resolve('@remotion-skill-pack/core/skill'))" 2>/dev/null || true)
  if [ -z "$CORE_PKG_DIR" ]; then
    echo "ERROR: cannot locate @remotion-skill-pack/core." >&2; exit 1
  fi
  CORE_DIR=$(dirname "$CORE_PKG_DIR")
fi

mkdir -p "$TARGET"
cat > "$TARGET/extension.json" <<JSON
{
  "name": "remotion-skill-pack",
  "description": "Remotion video composition skill for AI agents",
  "context_files": ["$CORE_DIR/SKILL.md"],
  "mcpServers": {
    "remotion-skill-pack": { "command": "npx", "args": ["@remotion-skill-pack/mcp-server"] }
  }
}
JSON

if [ "$MODE" = "lite" ]; then
  node - <<EOF
const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync('$TARGET/extension.json', 'utf-8'));
delete cfg.mcpServers;
fs.writeFileSync('$TARGET/extension.json', JSON.stringify(cfg, null, 2));
EOF
fi

echo "remotion-skill-pack › gemini-cli adapter"
echo "  ✓  Installed extension at $TARGET"
echo "Done."
