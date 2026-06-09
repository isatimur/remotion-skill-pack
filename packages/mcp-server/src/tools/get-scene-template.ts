import type { ToolDefinition } from "../index.js";

const TEMPLATES: Record<string, { durationFrames: number; props: Record<string, unknown> }> = {
  title: {
    durationFrames: 120,
    props: { headline: "Chapter N — Title Here", subhead: "Chapter N", eyebrow: "From Copilot to Colleague" },
  },
  concept: {
    durationFrames: 180,
    props: { heading: "Section Heading", bullets: ["First key point", "Second key point", "Third key point"], note: "" },
  },
  diagram: {
    durationFrames: 240,
    props: { heading: "Diagram Title", imagePath: "diagrams/concepts/your-diagram.png", caption: "One-line caption", imagePosition: "center" },
  },
  quote: {
    durationFrames: 150,
    props: { text: "The quote text goes here.", attribution: "Chapter N", context: "Brief framing" },
  },
  code: {
    durationFrames: 240,
    props: { heading: "Code Example Title", language: "python", code: "# Your code here\nresult = agent.run(prompt)", caption: "What this illustrates" },
  },
  stats: {
    durationFrames: 240,
    props: { heading: "By the Numbers", stats: [{ value: "42", label: "Short label" }, { value: "97%", label: "Short label" }] },
  },
  transition: {
    durationFrames: 60,
    props: { label: "Part 2 — The Solution", accent: true },
  },
  outro: {
    durationFrames: 150,
    props: { headline: "Your closing one-liner.", callToAction: "fromcopilottocolleague.com", subline: "Read the full chapter" },
  },
};

export const getSceneTemplateTool: ToolDefinition = {
  name: "get_scene_template",
  description: "Return example props and recommended durationFrames for a given scene type.",
  inputSchema: {
    type: "object",
    required: ["type"],
    properties: {
      type: {
        type: "string",
        enum: ["title", "concept", "diagram", "quote", "code", "stats", "transition", "outro"],
      },
    },
  },
  async handler(input) {
    const { type } = input as { type: string };
    const template = TEMPLATES[type];
    if (!template) return { error: `Unknown scene type: ${type}` };
    return { type, ...template };
  },
};
