import { describe, it, expect } from "vitest";
import { listToolDefinitions } from "../src/index.js";

describe("MCP tools", () => {
  const tools = listToolDefinitions();

  it("exposes exactly 5 tools", () => {
    expect(tools).toHaveLength(5);
  });

  it("has the expected tool names", () => {
    const names = tools.map((t) => t.name);
    expect(names).toContain("create_composition");
    expect(names).toContain("validate_composition");
    expect(names).toContain("render_to_tsx");
    expect(names).toContain("list_themes");
    expect(names).toContain("get_scene_template");
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

  it("get_scene_template returns template for all scene types", async () => {
    const tool = tools.find((t) => t.name === "get_scene_template")!;
    const types = ["title", "concept", "diagram", "quote", "code", "stats", "transition", "outro"];
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
});
