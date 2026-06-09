#!/usr/bin/env bash
set -euo pipefail

if [ -n "${RSP_CORE_DIR:-}" ] && [ -f "$RSP_CORE_DIR/SKILL.md" ]; then
  CORE_DIR="$RSP_CORE_DIR"
else
  CORE_PKG_DIR=$(node -e "console.log(require.resolve('@remotion-skill-pack/core/skill'))" 2>/dev/null || true)
  if [ -z "$CORE_PKG_DIR" ]; then
    echo "ERROR: cannot locate @remotion-skill-pack/core." >&2; exit 1
  fi
  CORE_DIR=$(dirname "$CORE_PKG_DIR")
fi

mkdir -p ".remotion-skill-pack/references" ".remotion-skill-pack/themes"
cp "$CORE_DIR/SKILL.md" ".remotion-skill-pack/SKILL.md"
cp -R "$CORE_DIR/themes" ".remotion-skill-pack/"
cp "$CORE_DIR/references/element-templates.md" ".remotion-skill-pack/references/"
cp "$CORE_DIR/references/themes.md" ".remotion-skill-pack/references/"

echo "remotion-skill-pack › cli adapter"
echo "  ✓  Installed skill at .remotion-skill-pack/"
echo "Done."
