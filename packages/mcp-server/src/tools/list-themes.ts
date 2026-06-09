import { listThemes, loadThemePalette } from "@remotion-skill-pack/core";
import type { ToolDefinition } from "../index.js";

export const listThemesTool: ToolDefinition = {
  name: "list_themes",
  description: "List all available remotion-skill-pack themes with name, description, and palette summary.",
  inputSchema: { type: "object", properties: {} },
  async handler(_input) {
    const themes = await listThemes();
    const withPalettes = await Promise.all(
      themes.map(async (t) => {
        const palette = await loadThemePalette(t.name);
        return { ...t, palette };
      }),
    );
    return { themes: withPalettes };
  },
};
