#!/usr/bin/env bash
# install.sh — GitHub Copilot adapter for remotion-skill-pack
# Writes/updates a named section in .github/copilot-instructions.md (project-scoped).
# Multiple skill packs can coexist — each owns its own sentinel-delimited section.
set -euo pipefail

MODE="${1:-full}"
SKILL_NAME="remotion-skill-pack"

if [ -n "${RSP_CORE_DIR:-}" ] && [ -f "$RSP_CORE_DIR/SKILL.md" ]; then
  CORE_DIR="$RSP_CORE_DIR"
else
  CORE_PKG_DIR=$(node -e "console.log(require.resolve('@remotion-skill-pack/core/skill'))" 2>/dev/null || true)
  if [ -z "$CORE_PKG_DIR" ]; then
    echo "ERROR: cannot locate @remotion-skill-pack/core." >&2; exit 1
  fi
  CORE_DIR=$(dirname "$CORE_PKG_DIR")
fi

COPILOT_DIR=".github"
COPILOT_FILE="$COPILOT_DIR/copilot-instructions.md"
VSCODE_DIR=".vscode"
MCP_FILE="$VSCODE_DIR/mcp.json"

echo "remotion-skill-pack › copilot adapter"
echo "  mode:   $MODE"
echo "  target: $(pwd)/$COPILOT_FILE"
echo ""

mkdir -p "$COPILOT_DIR"

SKILL_BODY=$(awk '
  /^---$/ && !seen { seen=1; in_front=1; next }
  in_front && /^---$/ { in_front=0; next }
  !in_front { print }
' "$CORE_DIR/SKILL.md")

SECTION_FILE=$(mktemp)
cat > "$SECTION_FILE" <<EOF
<!-- BEGIN $SKILL_NAME -->
$SKILL_BODY
<!-- END $SKILL_NAME -->
EOF

node -e "
  const fs = require('fs');
  const begin = '<!-- BEGIN $SKILL_NAME -->';
  const end   = '<!-- END $SKILL_NAME -->';
  const section = fs.readFileSync('$SECTION_FILE', 'utf8').trim();

  if (!fs.existsSync('$COPILOT_FILE')) {
    fs.writeFileSync('$COPILOT_FILE', section + '\n');
  } else {
    let content = fs.readFileSync('$COPILOT_FILE', 'utf8');
    const startIdx = content.indexOf(begin);
    if (startIdx === -1) {
      content = content.trimEnd() + '\n\n' + section + '\n';
    } else {
      const endIdx = content.indexOf(end, startIdx) + end.length;
      content = content.slice(0, startIdx).trimEnd() + '\n\n' + section + '\n' + content.slice(endIdx).trimStart();
      if (!content.endsWith('\n')) content += '\n';
    }
    fs.writeFileSync('$COPILOT_FILE', content);
  }
"

rm "$SECTION_FILE"
echo "  ✓  $COPILOT_FILE updated (section: $SKILL_NAME)"

if [ "$MODE" = "full" ]; then
  mkdir -p "$VSCODE_DIR"
  if [ -f "$MCP_FILE" ]; then
    EXISTING=$(cat "$MCP_FILE")
    UPDATED=$(node -e "
      const cfg = JSON.parse(process.argv[1]);
      cfg.servers = cfg.servers || {};
      cfg.servers['remotion-skill-pack'] = { type: 'stdio', command: 'npx', args: ['@remotion-skill-pack/mcp-server'] };
      process.stdout.write(JSON.stringify(cfg, null, 2));
    " "$EXISTING")
    printf '%s\n' "$UPDATED" > "$MCP_FILE"
  else
    cat > "$MCP_FILE" <<'JSON'
{
  "servers": {
    "remotion-skill-pack": {
      "type": "stdio",
      "command": "npx",
      "args": ["@remotion-skill-pack/mcp-server"]
    }
  }
}
JSON
  fi
  echo "  ✓  MCP server registered in $MCP_FILE"
fi

echo ""
echo "Done. Open GitHub Copilot Chat in VS Code — the skill is now in context."
