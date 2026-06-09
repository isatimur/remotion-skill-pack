import { describe, it, expect } from "vitest";
import { validateComposition, totalFrames } from "../src/index.js";

const VALID: unknown = {
  meta: { title: "Test Video", fps: 30, width: 1920, height: 1080, slug: "test-video" },
  globalTheme: "book-chapter",
  scenes: [
    { id: "s1", type: "title", durationFrames: 120, props: { headline: "Hello" } },
    { id: "s2", type: "outro", durationFrames: 150, props: { headline: "Bye" } },
  ],
};

describe("validateComposition", () => {
  it("accepts a valid composition", async () => {
    const result = await validateComposition(VALID);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects missing globalTheme", async () => {
    const bad = { ...VALID as object, globalTheme: undefined };
    const result = await validateComposition(bad);
    expect(result.valid).toBe(false);
  });

  it("rejects unknown scene type", async () => {
    const bad = {
      ...(VALID as Record<string, unknown>),
      scenes: [{ id: "s1", type: "unknown-type", durationFrames: 90, props: {} }],
    };
    const result = await validateComposition(bad);
    expect(result.valid).toBe(false);
  });

  it("rejects invalid globalTheme value", async () => {
    const bad = { ...(VALID as object), globalTheme: "neon-pink" };
    const result = await validateComposition(bad);
    expect(result.valid).toBe(false);
  });
});

describe("totalFrames", () => {
  it("sums durationFrames across all scenes", () => {
    const spec = VALID as Parameters<typeof totalFrames>[0];
    expect(totalFrames(spec)).toBe(270);
  });
});
