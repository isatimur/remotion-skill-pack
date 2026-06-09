import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Theme } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUNDLED_THEMES_DIR = join(__dirname, "..", "themes");

export async function loadTheme(name: string): Promise<Theme> {
  const themeDir = join(BUNDLED_THEMES_DIR, name);
  const themePath = join(themeDir, "theme.json");
  let raw: string;
  try {
    raw = await readFile(themePath, "utf-8");
  } catch {
    const available = ["book-chapter", "minimal-dark"];
    throw new Error(`Theme "${name}" not found. Available: ${available.join(", ")}`);
  }
  return JSON.parse(raw) as Theme;
}

export async function loadThemePalette(name: string): Promise<string> {
  const palettePath = join(BUNDLED_THEMES_DIR, name, "palette.md");
  return readFile(palettePath, "utf-8");
}

export async function listThemes(): Promise<Array<{ name: string; description: string }>> {
  const themes = ["book-chapter", "minimal-dark"];
  const results = await Promise.all(
    themes.map(async (t) => {
      const theme = await loadTheme(t);
      return { name: t, description: theme.description ?? "" };
    })
  );
  return results;
}
