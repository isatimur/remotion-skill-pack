import { validateComposition, totalFrames } from "@remotion-skill-pack/core";
import type { ToolDefinition } from "../index.js";

export const validateCompositionTool: ToolDefinition = {
  name: "validate_composition",
  description: "Validate a composition JSON string against the remotion-skill-pack schema. Returns errors or { valid: true }.",
  inputSchema: {
    type: "object",
    required: ["json"],
    properties: {
      json: { type: "string", description: "The composition JSON as a string" },
    },
  },
  async handler(input) {
    const { json } = input as { json: string };
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      return { valid: false, errors: ["Invalid JSON: could not parse input"] };
    }
    const result = await validateComposition(parsed);
    if (!result.valid) return result;
    const spec = parsed as Parameters<typeof totalFrames>[0];
    const frames = totalFrames(spec);
    const seconds = Math.round(frames / (spec.meta?.fps ?? 30));
    return { valid: true, totalFrames: frames, durationSeconds: seconds, errors: [] };
  },
};
