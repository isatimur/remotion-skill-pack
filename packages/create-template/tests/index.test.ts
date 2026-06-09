import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("create-template package", () => {
  it("has a valid package.json with the expected bin", async () => {
    const raw = await readFile(join(__dirname, "..", "package.json"), "utf-8");
    const pkg = JSON.parse(raw) as { name: string; bin: Record<string, string> };
    expect(pkg.name).toBe("@remotion-skill-pack/create-template");
    expect(pkg.bin["create-remotion-template"]).toBeDefined();
  });
});
