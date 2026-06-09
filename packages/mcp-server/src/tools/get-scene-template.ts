import type { ToolDefinition } from "../index.js";

const TEMPLATES: Record<string, { durationFrames: number; props: Record<string, unknown> }> = {
  // ── v0.1 scene types ──────────────────────────────────────────────────────
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

  // ── v0.2 knowledge video scene types ─────────────────────────────────────
  insight: {
    durationFrames: 150,
    props: {
      claim: "The bottleneck has shifted from compute to taste.",
      category: "Key Insight",
      source: "Chapter 2",
    },
  },
  evidence: {
    durationFrames: 150,
    props: {
      value: "87%",
      label: "of developers now use AI tools weekly",
      source: "Stack Overflow Survey 2024",
      context: "Up from 44% the previous year",
    },
  },
  person: {
    durationFrames: 180,
    props: {
      name: "Person Name",
      title: "Their Title / Role",
      quote: "A memorable thing they said about this topic.",
      imagePath: "assets/person.jpg",
    },
  },
  contrast: {
    durationFrames: 240,
    props: {
      heading: "Before vs. After",
      left: {
        label: "Before",
        points: ["Manual review cycles", "4-hour feedback loop", "50% test coverage"],
      },
      right: {
        label: "After",
        points: ["Automated eval pipeline", "15-minute feedback loop", "99% test coverage"],
      },
    },
  },
  framework: {
    durationFrames: 300,
    props: {
      heading: "The Context-Autonomy Matrix",
      quadrants: {
        topLeft: { label: "Copilot", desc: "High context, low autonomy" },
        topRight: { label: "Delegate", desc: "High context, high autonomy" },
        bottomLeft: { label: "Tool", desc: "Low context, low autonomy" },
        bottomRight: { label: "Autopilot", desc: "Low context, high autonomy" },
      },
      xAxis: "Autonomy",
      yAxis: "Context",
    },
  },
  narrative: {
    durationFrames: 240,
    props: {
      text: "This is the central paradox of AI engineering: the more capable the model, the harder it becomes to know when to trust it.",
      highlight: "central paradox",
    },
  },
};

const ALL_TYPES = Object.keys(TEMPLATES);

export const getSceneTemplateTool: ToolDefinition = {
  name: "get_scene_template",
  description:
    "Return example props and recommended durationFrames for a given scene type. Supports all 14 scene types including v0.2 knowledge video types: insight, evidence, person, contrast, framework, narrative.",
  inputSchema: {
    type: "object",
    required: ["type"],
    properties: {
      type: {
        type: "string",
        enum: ALL_TYPES,
      },
    },
  },
  async handler(input) {
    const { type } = input as { type: string };
    const template = TEMPLATES[type];
    if (!template) return { error: `Unknown scene type: ${type}. Available: ${ALL_TYPES.join(", ")}` };
    return { type, ...template };
  },
};
