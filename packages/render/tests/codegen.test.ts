import { describe, it, expect } from "vitest";
import { generateSceneTsx, generateEntryTsx, generateRootTsx } from "../src/codegen.js";
import { loadTheme } from "@remotion-skill-pack/core";
import type { CompositionSpec } from "@remotion-skill-pack/core";

const SPEC: CompositionSpec = {
  meta: { title: "Test", fps: 30, width: 1920, height: 1080, slug: "test-video" },
  globalTheme: "book-chapter",
  scenes: [
    { id: "s1-title", type: "title", durationFrames: 120, props: { headline: "Hello World", subhead: "Test" } },
    { id: "s2-concept", type: "concept", durationFrames: 150, props: { heading: "Key Ideas", bullets: ["Point one", "Point two"] } },
    { id: "s3-outro", type: "outro", durationFrames: 150, props: { headline: "Thank you", callToAction: "example.com" } },
  ],
};

const SPEC_WITH_TRANSITIONS: CompositionSpec = {
  meta: { title: "Transitions Test", fps: 30, width: 1920, height: 1080, slug: "transitions-test" },
  globalTheme: "book-chapter",
  scenes: [
    { id: "s1-title", type: "title", durationFrames: 120, props: { headline: "Hello" } },
    { id: "s2-insight", type: "insight", durationFrames: 150, props: { claim: "The shift is here", category: "Key Insight" }, transitionIn: "slide" },
    { id: "s3-outro", type: "outro", durationFrames: 90, props: { headline: "Done", callToAction: "test.com" }, transitionIn: "fade" },
  ],
};

describe("generateSceneTsx — core structure", () => {
  it("produces valid-looking TSX with import statements", async () => {
    const theme = await loadTheme("book-chapter");
    const tsx = generateSceneTsx(SPEC, theme);
    expect(tsx).toContain("import React from 'react'");
    expect(tsx).toContain("from 'remotion'");
    expect(tsx).toContain("from '@remotion/transitions'");
    expect(tsx).toContain("Scene_s1_title");
    expect(tsx).toContain("Scene_s2_concept");
    expect(tsx).toContain("Scene_s3_outro");
    expect(tsx).toContain("durationInFrames = 420");
    expect(tsx).toContain("fps = 30");
  });

  it("uses TransitionSeries instead of offset-based Sequence", async () => {
    const theme = await loadTheme("book-chapter");
    const tsx = generateSceneTsx(SPEC, theme);
    expect(tsx).toContain("TransitionSeries");
    expect(tsx).toContain("TransitionSeries.Sequence");
    expect(tsx).toContain("TransitionSeries.Transition");
  });

  it("wraps each scene in TransitionSeries.Sequence with correct durationInFrames", async () => {
    const theme = await loadTheme("book-chapter");
    const tsx = generateSceneTsx(SPEC, theme);
    expect(tsx).toContain('durationInFrames={120}');
    expect(tsx).toContain('durationInFrames={150}');
  });

  it("references theme colors", async () => {
    const theme = await loadTheme("book-chapter");
    const tsx = generateSceneTsx(SPEC, theme);
    expect(tsx).toContain("#0f0f14");
    expect(tsx).toContain("#6ee7b7");
  });
});

describe("generateSceneTsx — transition imports", () => {
  it("imports only the transition types used in the spec", async () => {
    const theme = await loadTheme("book-chapter");
    const tsx = generateSceneTsx(SPEC_WITH_TRANSITIONS, theme);
    expect(tsx).toContain("from '@remotion/transitions/slide'");
    expect(tsx).toContain("from '@remotion/transitions/fade'");
    expect(tsx).not.toContain("from '@remotion/transitions/wipe'");
    expect(tsx).not.toContain("from '@remotion/transitions/flip'");
  });

  it("omits transition imports for a single-scene spec", async () => {
    const single: CompositionSpec = {
      meta: { title: "Single", fps: 30, width: 1920, height: 1080, slug: "single" },
      globalTheme: "book-chapter",
      scenes: [{ id: "s1", type: "title", durationFrames: 90, props: { headline: "One" } }],
    };
    const theme = await loadTheme("book-chapter");
    const tsx = generateSceneTsx(single, theme);
    expect(tsx).not.toContain("from '@remotion/transitions/fade'");
    expect(tsx).toContain("TransitionSeries");
  });
});

describe("generateSceneTsx — new scene types", () => {
  it("renders insight scene with spring scale", async () => {
    const theme = await loadTheme("book-chapter");
    const spec: CompositionSpec = {
      meta: { title: "T", fps: 30, width: 1920, height: 1080, slug: "t" },
      globalTheme: "book-chapter",
      scenes: [{ id: "s1", type: "insight", durationFrames: 150, props: { claim: "The shift is real", category: "Insight" } }],
    };
    const tsx = generateSceneTsx(spec, theme);
    expect(tsx).toContain("scaleIn");
    expect(tsx).toContain("The shift is real");
    expect(tsx).toContain("Insight");
  });

  it("renders evidence scene with giant value", async () => {
    const theme = await loadTheme("book-chapter");
    const spec: CompositionSpec = {
      meta: { title: "T", fps: 30, width: 1920, height: 1080, slug: "t" },
      globalTheme: "book-chapter",
      scenes: [{ id: "s1", type: "evidence", durationFrames: 150, props: { value: "87%", label: "adoption rate", source: "Survey 2024" } }],
    };
    const tsx = generateSceneTsx(spec, theme);
    expect(tsx).toContain("87%");
    expect(tsx).toContain("adoption rate");
    expect(tsx).toContain("Survey 2024");
    expect(tsx).toContain("fontSize: 128");
  });

  it("renders person scene with avatar circle and staggered text", async () => {
    const theme = await loadTheme("book-chapter");
    const spec: CompositionSpec = {
      meta: { title: "T", fps: 30, width: 1920, height: 1080, slug: "t" },
      globalTheme: "book-chapter",
      scenes: [{ id: "s1", type: "person", durationFrames: 180, props: { name: "Ada Lovelace", title: "First Programmer", quote: "The engine has no originating power." } }],
    };
    const tsx = generateSceneTsx(spec, theme);
    expect(tsx).toContain("Ada Lovelace");
    expect(tsx).toContain("avatarScale");
    expect(tsx).toContain("textOpacity");
    expect(tsx).toContain("borderRadius: '50%'");
  });

  it("renders contrast scene with animated divider line", async () => {
    const theme = await loadTheme("book-chapter");
    const spec: CompositionSpec = {
      meta: { title: "T", fps: 30, width: 1920, height: 1080, slug: "t" },
      globalTheme: "book-chapter",
      scenes: [{ id: "s1", type: "contrast", durationFrames: 240, props: { heading: "Before vs After", left: { label: "Before", points: ["Slow", "Manual"] }, right: { label: "After", points: ["Fast", "Automated"] } } }],
    };
    const tsx = generateSceneTsx(spec, theme);
    expect(tsx).toContain("dividerH");
    expect(tsx).toContain("Before");
    expect(tsx).toContain("After");
    expect(tsx).toContain("linear-gradient");
  });

  it("renders framework scene with staggered 2x2 grid", async () => {
    const theme = await loadTheme("book-chapter");
    const spec: CompositionSpec = {
      meta: { title: "T", fps: 30, width: 1920, height: 1080, slug: "t" },
      globalTheme: "book-chapter",
      scenes: [{ id: "s1", type: "framework", durationFrames: 300, props: { heading: "Matrix", quadrants: { topLeft: { label: "Copilot", desc: "assists" }, topRight: { label: "Delegate", desc: "acts" }, bottomLeft: { label: "Tool", desc: "executes" }, bottomRight: { label: "Autopilot", desc: "operates" } }, xAxis: "Autonomy", yAxis: "Context" } }],
    };
    const tsx = generateSceneTsx(spec, theme);
    expect(tsx).toContain("q1");
    expect(tsx).toContain("q4");
    expect(tsx).toContain("gridTemplateColumns");
    expect(tsx).toContain("Copilot");
    expect(tsx).toContain("Delegate");
  });

  it("renders narrative scene with line-by-line reveal", async () => {
    const theme = await loadTheme("book-chapter");
    const spec: CompositionSpec = {
      meta: { title: "T", fps: 30, width: 1920, height: 1080, slug: "t" },
      globalTheme: "book-chapter",
      scenes: [{ id: "s1", type: "narrative", durationFrames: 240, props: { text: "The bottleneck has shifted from compute to taste and judgment in every domain.", highlight: "taste" } }],
    };
    const tsx = generateSceneTsx(spec, theme);
    expect(tsx).toContain("The bottleneck");
    expect(tsx).toContain("translateY");
  });
});

describe("generateSceneTsx — social theme", () => {
  it("uses social theme accent color in insight scene", async () => {
    const theme = await loadTheme("social");
    const spec: CompositionSpec = {
      meta: { title: "Reel", fps: 30, width: 1080, height: 1920, slug: "reel-test" },
      globalTheme: "social",
      scenes: [{ id: "s1", type: "insight", durationFrames: 90, props: { claim: "One non-obvious truth", category: "Daily insight" } }],
    };
    const tsx = generateSceneTsx(spec, theme);
    expect(tsx).toContain("#f472b6"); // social accent
    expect(tsx).toContain("#0a0a0f"); // social background
  });
});

describe("generateRootTsx", () => {
  it("registers the composition", () => {
    const root = generateRootTsx(SPEC);
    expect(root).toContain("Composition");
    expect(root).toContain("testVideoComposition");
  });
});

describe("generateEntryTsx", () => {
  it("calls registerRoot", () => {
    const entry = generateEntryTsx(SPEC);
    expect(entry).toContain("registerRoot");
  });
});
