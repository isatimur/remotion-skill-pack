import { validateComposition, loadTheme } from "@remotion-skill-pack/core";
import type { CompositionSpec } from "@remotion-skill-pack/core";
import { generateSceneTsx, generateRootTsx, generateEntryTsx } from "@remotion-skill-pack/render";
import type { ToolDefinition } from "../index.js";

export const renderToTsxTool: ToolDefinition = {
  name: "render_to_tsx",
  description: "Convert a composition JSON string to Remotion TSX source files. Returns Scene.tsx, Root.tsx, and entry.tsx as strings.",
  inputSchema: {
    type: "object",
    required: ["json"],
    properties: {
      json: { type: "string", description: "The composition JSON as a string" },
      theme: { type: "string", description: "Theme override (book-chapter | minimal-dark)" },
    },
  },
  async handler(input) {
    const { json, theme: themeOverride } = input as { json: string; theme?: string };
    let spec: CompositionSpec;
    try {
      spec = JSON.parse(json) as CompositionSpec;
    } catch {
      return { error: "Invalid JSON" };
    }
    const validation = await validateComposition(spec);
    if (!validation.valid) return { error: "Validation failed", errors: validation.errors };

    const themeName = themeOverride ?? spec.globalTheme ?? "book-chapter";
    const theme = await loadTheme(themeName);

    return {
      "Scene.tsx": generateSceneTsx(spec, theme),
      "Root.tsx": generateRootTsx(spec),
      "entry.tsx": generateEntryTsx(spec),
    };
  },
};
