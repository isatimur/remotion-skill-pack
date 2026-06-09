import { describe, it, expect } from "vitest";
import { listToolDefinitions } from "../src/index.js";

describe("MCP tools", () => {
  const tools = listToolDefinitions();

  it("exposes exactly 6 tools", () => {
    expect(tools).toHaveLength(6);
  });

  it("has the expected tool names", () => {
    const names = tools.map((t) => t.name);
    expect(names).toContain("create_composition");
    expect(names).toContain("validate_composition");
    expect(names).toContain("render_to_tsx");
    expect(names).toContain("list_themes");
    expect(names).toContain("get_scene_template");
    expect(names).toContain("generate_composition_from_text");
  });

  it("each tool has description and inputSchema", () => {
    for (const tool of tools) {
      expect(tool.description.length).toBeGreaterThan(10);
      expect(tool.inputSchema).toBeDefined();
    }
  });

  it("create_composition returns a valid spec shape", async () => {
    const tool = tools.find((t) => t.name === "create_composition")!;
    const result = await tool.handler({ title: "Chapter 1", theme: "book-chapter" }) as Record<string, unknown>;
    expect(result.composition).toBeDefined();
    const comp = result.composition as Record<string, unknown>;
    expect(comp.globalTheme).toBe("book-chapter");
    expect(Array.isArray(comp.scenes)).toBe(true);
  });

  it("create_composition social format returns 1080x1920", async () => {
    const tool = tools.find((t) => t.name === "create_composition")!;
    const result = await tool.handler({ title: "Daily Insight", theme: "social", format: "social" }) as Record<string, unknown>;
    const comp = result.composition as Record<string, unknown>;
    const meta = comp.meta as Record<string, unknown>;
    expect(meta.width).toBe(1080);
    expect(meta.height).toBe(1920);
  });

  it("get_scene_template returns template for all 14 scene types", async () => {
    const tool = tools.find((t) => t.name === "get_scene_template")!;
    const types = [
      "title", "concept", "diagram", "quote", "code", "stats", "transition", "outro",
      "insight", "evidence", "person", "contrast", "framework", "narrative",
    ];
    for (const type of types) {
      const result = await tool.handler({ type }) as Record<string, unknown>;
      expect(result.durationFrames).toBeGreaterThan(0);
    }
  });

  it("validate_composition rejects bad JSON", async () => {
    const tool = tools.find((t) => t.name === "validate_composition")!;
    const result = await tool.handler({ json: "not-json" }) as Record<string, unknown>;
    expect(result.valid).toBe(false);
  });

  it("generate_composition_from_text returns a composition with scenes", async () => {
    const tool = tools.find((t) => t.name === "generate_composition_from_text")!;
    const text = `AI engineering has changed everything. The bottleneck has shifted from compute to taste.

Developers who understand evals ship faster. 87% of teams that use automated evals reduce bugs by 3x.

Before: manual review, slow cycles, low confidence. After: automated pipelines, 15-minute loops, 99% coverage.`;
    const result = await tool.handler({ text, format: "landscape", theme: "book-chapter" }) as Record<string, unknown>;
    expect(result.composition).toBeDefined();
    const comp = result.composition as Record<string, unknown>;
    expect(Array.isArray(comp.scenes)).toBe(true);
    expect((comp.scenes as unknown[]).length).toBeGreaterThan(2);
    expect(result.guidance).toBeDefined();
  });

  it("generate_composition_from_text detects stats and contrast", async () => {
    const tool = tools.find((t) => t.name === "generate_composition_from_text")!;
    const text = `The numbers are clear: 92% adoption in 2024. Before AI tools, teams spent 40% of time on boilerplate. After, that dropped to 5%. vs. the old way, this is transformative.`;
    const result = await tool.handler({ text }) as Record<string, unknown>;
    const comp = result.composition as Record<string, unknown>;
    const scenes = comp.scenes as Array<{ type: string }>;
    const types = scenes.map((s) => s.type);
    expect(types).toContain("evidence");
    expect(types).toContain("contrast");
  });

  it("generate_composition_from_text social format produces short scenes", async () => {
    const tool = tools.find((t) => t.name === "generate_composition_from_text")!;
    const text = "The shift from assistant to delegate is the defining career move of the decade.";
    const result = await tool.handler({ text, format: "social", theme: "social" }) as Record<string, unknown>;
    const comp = result.composition as Record<string, unknown>;
    const meta = comp.meta as Record<string, unknown>;
    expect(meta.width).toBe(1080);
    expect(meta.height).toBe(1920);
    expect((result.totalSeconds as number)).toBeLessThanOrEqual(30);
  });
});
