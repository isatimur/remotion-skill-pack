import type { ToolDefinition } from "../index.js";

export const generateFromTextTool: ToolDefinition = {
  name: "generate_composition_from_text",
  description:
    "Analyze raw text (blog post, book chapter, transcript, essay) and return a ready-to-edit composition spec blueprint. Detects scene type opportunities (insight, evidence, contrast, code, quote) from the text structure. The AI agent fills in the actual props from the source material.",
  inputSchema: {
    type: "object",
    required: ["text"],
    properties: {
      text: { type: "string", description: "Raw text content to convert to video" },
      format: {
        type: "string",
        enum: ["landscape", "social"],
        default: "landscape",
        description: "landscape = 1920×1080 (chapter video); social = 1080×1920 (Reels/Shorts, 15-30s)",
      },
      theme: {
        type: "string",
        enum: ["book-chapter", "minimal-dark", "social"],
        default: "book-chapter",
      },
      maxDurationSeconds: {
        type: "number",
        default: 180,
        description: "Target max video length in seconds",
      },
    },
  },
  async handler(input) {
    const {
      text,
      format = "landscape",
      theme = "book-chapter",
    } = input as { text: string; format?: string; theme?: string; maxDurationSeconds?: number };

    const isSocial = format === "social";
    const fps = 30;

    // ── Text analysis ────────────────────────────────────────────────────────
    const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
    const statsMatches = text.match(/\b\d+(?:\.\d+)?%|\b\d{4,}(?:,\d{3})*\b/g) ?? [];
    const hasNumbers = statsMatches.length > 0;
    const hasCode = /```[\s\S]*?```/.test(text);
    const hasComparison = /(?:vs\.|versus|compared to|before[^.]*after|old[^.]*new)/i.test(text);
    const hasNamedPerson = /(?:[A-Z][a-z]+ [A-Z][a-z]+)|(?:Dr\.|Prof\.)/.test(text);

    // Extract title (first heading or first sentence ≤ 15 words)
    const headingMatch = text.match(/^#+ (.+)$/m);
    const firstSentence = sentences[0]?.trim() ?? "";
    const titleText =
      headingMatch?.[1]?.trim() ??
      (firstSentence.split(" ").length <= 15 ? firstSentence.replace(/[.!?]$/, "") : "Video Title");

    // Best short claim for insight (8–15 word sentences)
    const insightCandidates = sentences.filter((s) => {
      const wc = s.trim().split(" ").length;
      return wc >= 8 && wc <= 16;
    });
    const bestInsight = insightCandidates[0]?.trim().replace(/[.!?]$/, "") ?? "";

    // Best pull quote (≤ 20 words, vivid)
    const quoteCandidates = sentences.filter((s) => {
      const wc = s.trim().split(" ").length;
      return wc >= 10 && wc <= 22;
    });
    const bestQuote = quoteCandidates[1]?.trim() ?? "";

    const slug = titleText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);

    // ── Scene blueprint ───────────────────────────────────────────────────────
    const scenes: Array<{
      id: string;
      type: string;
      durationFrames: number;
      transitionIn?: string;
      props: Record<string, unknown>;
      _note: string;
    }> = [];

    const D = (landscape: number, social: number) => (isSocial ? social : landscape);

    // Always: title
    scenes.push({
      id: "s1-title",
      type: "title",
      durationFrames: D(120, 60),
      props: { headline: titleText, subhead: "", eyebrow: "" },
      _note: "Opening title card — edit headline from source",
    });

    // Core claim as insight
    if (bestInsight) {
      scenes.push({
        id: "s2-insight",
        type: "insight",
        durationFrames: D(150, 90),
        transitionIn: "fade",
        props: { claim: bestInsight, category: "Key Insight", source: "" },
        _note: "Non-obvious central claim — pick strongest sentence",
      });
    }

    // Content paragraphs → concept or narrative
    const contentParas = paragraphs.slice(0, isSocial ? 1 : 3);
    contentParas.forEach((para, i) => {
      const wc = para.split(" ").length;
      const idx = scenes.length + 1;
      if (wc < 40) {
        scenes.push({
          id: `s${idx}-concept`,
          type: "concept",
          durationFrames: D(180, 120),
          transitionIn: "slide",
          props: { heading: "Fill in heading", bullets: ["Key point from paragraph", "Supporting evidence", "Implication"] },
          _note: `Paragraph ${i + 1} → concept scene (< 40 words)`,
        });
      } else {
        scenes.push({
          id: `s${idx}-narrative`,
          type: "narrative",
          durationFrames: D(240, 150),
          transitionIn: "fade",
          props: {
            text: para.slice(0, 220).trim(),
            highlight: "",
          },
          _note: `Paragraph ${i + 1} → narrative reveal (≥ 40 words)`,
        });
      }
    });

    // Evidence if stats detected
    if (hasNumbers) {
      scenes.push({
        id: `s${scenes.length + 1}-evidence`,
        type: "evidence",
        durationFrames: D(150, 90),
        transitionIn: "wipe",
        props: {
          value: statsMatches[0] ?? "?",
          label: "Fill in what this number represents",
          source: "Fill in source",
          context: statsMatches[1] ? `Also: ${statsMatches[1]}` : "",
        },
        _note: "Detected numbers in text — fill in label and source",
      });
    }

    // Contrast if comparison language detected
    if (hasComparison) {
      scenes.push({
        id: `s${scenes.length + 1}-contrast`,
        type: "contrast",
        durationFrames: D(240, 150),
        transitionIn: "slide",
        props: {
          heading: "Fill in comparison heading",
          left: { label: "Before", points: ["Point 1", "Point 2", "Point 3"] },
          right: { label: "After", points: ["Point 1", "Point 2", "Point 3"] },
        },
        _note: "Comparison language detected — fill in before/after from text",
      });
    }

    // Code if fenced block detected
    if (hasCode) {
      const codeMatch = text.match(/```(?:\w+)?\n?([\s\S]*?)```/);
      scenes.push({
        id: `s${scenes.length + 1}-code`,
        type: "code",
        durationFrames: D(240, 180),
        transitionIn: "fade",
        props: {
          heading: "Code Example",
          language: "python",
          code: codeMatch?.[1] ? codeMatch[1].slice(0, 300).trim() : "# Fill in code",
          caption: "What this illustrates",
        },
        _note: "Fenced code block detected — verify language and caption",
      });
    }

    // Named person
    if (hasNamedPerson) {
      scenes.push({
        id: `s${scenes.length + 1}-person`,
        type: "person",
        durationFrames: D(180, 120),
        transitionIn: "fade",
        props: {
          name: "Fill in person name",
          title: "Fill in title / role",
          quote: bestQuote || "Fill in memorable quote",
          imagePath: "",
        },
        _note: "Named person detected — fill in name, title, quote from text",
      });
    } else if (bestQuote && !isSocial) {
      // Pull quote if no named person
      scenes.push({
        id: `s${scenes.length + 1}-quote`,
        type: "quote",
        durationFrames: D(150, 90),
        transitionIn: "fade",
        props: { text: bestQuote, attribution: "", context: "Fill in context" },
        _note: "Strongest pull quote from text",
      });
    }

    // Always: outro
    scenes.push({
      id: `s${scenes.length + 1}-outro`,
      type: "outro",
      durationFrames: D(150, 60),
      transitionIn: "fade",
      props: { headline: "Fill in closing statement.", callToAction: "", subline: "" },
      _note: "Closing card — add CTA",
    });

    const totalFrames = scenes.reduce((s, sc) => s + sc.durationFrames, 0);
    const totalSeconds = Math.round(totalFrames / fps);

    // Strip _note from the composition output
    const compositionScenes = scenes.map(({ _note: _, ...sc }) => sc);

    return {
      composition: {
        meta: { title: titleText, fps, width: isSocial ? 1080 : 1920, height: isSocial ? 1920 : 1080, slug },
        globalTheme: theme,
        scenes: compositionScenes,
      },
      totalFrames,
      totalSeconds,
      sceneCount: scenes.length,
      detectedFeatures: { hasNumbers, hasCode, hasComparison, hasNamedPerson, sentenceCount: sentences.length, paragraphCount: paragraphs.length },
      guidance: scenes.map((sc) => ({ id: sc.id, type: sc.type, note: sc._note })),
    };
  },
};
