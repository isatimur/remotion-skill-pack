import type { ToolDefinition } from "../index.js";

export const createCompositionTool: ToolDefinition = {
  name: "create_composition",
  description:
    "Generate a starter composition.json for a Remotion video. Provide a chapter title and up to 5 key ideas; returns a ready-to-edit composition spec.",
  inputSchema: {
    type: "object",
    required: ["title"],
    properties: {
      title: { type: "string", description: "Chapter or presentation title" },
      slug: { type: "string", description: "kebab-case slug (e.g. chapter-01-the-shift)" },
      theme: { type: "string", enum: ["book-chapter", "minimal-dark", "social"], default: "book-chapter" },
      format: { type: "string", enum: ["landscape", "social"], default: "landscape", description: "landscape = 1920×1080; social = 1080×1920 vertical (Reels/Shorts)" },
      keyIdeas: {
        type: "array",
        items: { type: "string" },
        maxItems: 5,
        description: "Core ideas for concept scenes",
      },
    },
  },
  async handler(input) {
    const { title, slug: rawSlug, theme = "book-chapter", format = "landscape", keyIdeas = [] } = input as {
      title: string;
      slug?: string;
      theme?: string;
      format?: "landscape" | "social";
      keyIdeas?: string[];
    };
    const isSocial = format === "social";
    const slug =
      rawSlug ??
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const scenes: Array<{ id: string; type: string; durationFrames: number; props: Record<string, unknown>; transitionIn?: string }> = [
      {
        id: "s1-title",
        type: "title",
        durationFrames: isSocial ? 60 : 120,
        props: { headline: title, subhead: isSocial ? "" : "From Copilot to Colleague", eyebrow: "" },
      },
    ];

    if (keyIdeas.length > 0) {
      scenes.push({
        id: "s2-thesis",
        type: "concept",
        durationFrames: 180,
        props: { heading: "Core Ideas", bullets: keyIdeas.slice(0, 4) },
      });
    }

    if (isSocial) {
      // Social / vertical format — short punchy scenes for Reels/Shorts
      scenes.push(
        { id: "s3-insight", type: "insight", durationFrames: 120, props: { claim: "Add the core non-obvious claim here.", category: "Key Insight", source: "" }, transitionIn: "slide" },
        { id: "s4-evidence", type: "evidence", durationFrames: 90, props: { value: "?%", label: "Add the key statistic", source: "Source" }, transitionIn: "fade" },
        { id: "s5-outro", type: "outro", durationFrames: 60, props: { headline: "Follow for more.", callToAction: "", subline: "" }, transitionIn: "fade" },
      );
    } else {
      scenes.push(
        { id: "s3-transition", type: "transition", durationFrames: 60, props: { label: "The Argument", accent: true } },
        { id: "s4-diagram", type: "diagram", durationFrames: 240, props: { heading: "Visualization", imagePath: "diagrams/placeholder.png", caption: "" } },
        { id: "s5-insight", type: "insight", durationFrames: 150, props: { claim: "Add the core non-obvious claim here.", category: "Key Insight", source: "" }, transitionIn: "fade" },
        { id: "s6-quote", type: "quote", durationFrames: 150, props: { text: "Add a key quote here.", attribution: "", context: "" } },
        { id: "s7-transition", type: "transition", durationFrames: 60, props: { label: "What to Do", accent: true } },
        { id: "s8-takeaways", type: "concept", durationFrames: 180, props: { heading: "Key Takeaways", bullets: ["Takeaway 1", "Takeaway 2", "Takeaway 3"] } },
        { id: "s9-outro", type: "outro", durationFrames: 150, props: { headline: "", callToAction: "fromcopilottocolleague.com", subline: "Read the full chapter" } },
      );
    }

    const spec = {
      meta: { title, fps: 30, width: isSocial ? 1080 : 1920, height: isSocial ? 1920 : 1080, slug },
      globalTheme: theme,
      scenes,
    };

    return { composition: spec, totalFrames: scenes.reduce((s, sc) => s + sc.durationFrames, 0) };
  },
};
