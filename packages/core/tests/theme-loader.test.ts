import { describe, it, expect } from "vitest";
import { loadTheme, loadThemePalette, listThemes } from "../src/index.js";

describe("loadTheme", () => {
  it("loads book-chapter theme", async () => {
    const t = await loadTheme("book-chapter");
    expect(t.name).toBe("book-chapter");
    expect(t.colors.accent).toBe("#6ee7b7");
    expect(t.animation.entryDuration).toBe(15);
  });

  it("loads minimal-dark theme", async () => {
    const t = await loadTheme("minimal-dark");
    expect(t.name).toBe("minimal-dark");
    expect(t.colors.accent).toBe("#60a5fa");
  });

  it("throws on unknown theme", async () => {
    await expect(loadTheme("neon-pink")).rejects.toThrow(/not found/i);
  });
});

describe("loadThemePalette", () => {
  it("returns markdown string for book-chapter", async () => {
    const md = await loadThemePalette("book-chapter");
    expect(md).toContain("book-chapter");
    expect(md).toContain("#6ee7b7");
  });
});

describe("listThemes", () => {
  it("returns both bundled themes", async () => {
    const themes = await listThemes();
    expect(themes.map((t) => t.name)).toContain("book-chapter");
    expect(themes.map((t) => t.name)).toContain("minimal-dark");
  });
});
