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

describe("generateSceneTsx", () => {
  it("produces valid-looking TSX with import statement", async () => {
    const theme = await loadTheme("book-chapter");
    const tsx = generateSceneTsx(SPEC, theme);
    expect(tsx).toContain("import React from 'react'");
    expect(tsx).toContain("from 'remotion'");
    expect(tsx).toContain("Scene_s1_title");
    expect(tsx).toContain("Scene_s2_concept");
    expect(tsx).toContain("Scene_s3_outro");
    expect(tsx).toContain("durationInFrames = 420");
    expect(tsx).toContain("fps = 30");
  });

  it("includes Sequence with correct offsets", async () => {
    const theme = await loadTheme("book-chapter");
    const tsx = generateSceneTsx(SPEC, theme);
    expect(tsx).toContain("offset_s1_title = 0");
    expect(tsx).toContain("offset_s2_concept = 120");
    expect(tsx).toContain("offset_s3_outro = 270");
  });

  it("references theme colors", async () => {
    const theme = await loadTheme("book-chapter");
    const tsx = generateSceneTsx(SPEC, theme);
    expect(tsx).toContain("#0f0f14");
    expect(tsx).toContain("#6ee7b7");
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
