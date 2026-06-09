import { describe, it, expect } from "vitest";
import { resolveAdapterScript } from "../src/index.js";

const ADAPTERS = ["claude-code", "cursor", "copilot", "codex", "gemini-cli", "cli"] as const;

describe("resolveAdapterScript", () => {
  for (const adapter of ADAPTERS) {
    it(`resolves ${adapter} on darwin`, () => {
      const p = resolveAdapterScript(adapter, "darwin");
      expect(p).toMatch(new RegExp(`adapters/${adapter}/install\\.sh$`));
    });
    it(`resolves ${adapter} on win32`, () => {
      const p = resolveAdapterScript(adapter, "win32");
      expect(p).toMatch(new RegExp(`adapters[/\\\\]${adapter}[/\\\\]install\\.ps1$`));
    });
  }

  it("throws on unknown adapter", () => {
    expect(() => resolveAdapterScript("vscode", "linux")).toThrow(/unknown adapter/i);
  });
});
