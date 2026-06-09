import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import {
  validateComposition,
  loadTheme,
  type CompositionSpec,
} from "@remotion-skill-pack/core";
import { generateSceneTsx, generateEntryTsx, generateRootTsx } from "./codegen.js";

export { generateSceneTsx, generateEntryTsx, generateRootTsx } from "./codegen.js";

export interface RenderOptions {
  outputDir: string;
  theme?: string;
}

export interface RenderResult {
  scenePath: string;
  rootPath: string;
  entryPath: string;
  errors?: string[];
}

export async function composeToTsx(
  specPath: string,
  options: RenderOptions,
): Promise<RenderResult> {
  const raw = await readFile(specPath, "utf-8");
  const spec = JSON.parse(raw) as CompositionSpec;

  const validation = await validateComposition(spec);
  if (!validation.valid) {
    return {
      scenePath: "",
      rootPath: "",
      entryPath: "",
      errors: validation.errors,
    };
  }

  const themeName = options.theme ?? spec.globalTheme ?? "book-chapter";
  const theme = await loadTheme(themeName);

  await mkdir(options.outputDir, { recursive: true });

  const sceneTsx = generateSceneTsx(spec, theme);
  const rootTsx = generateRootTsx(spec);
  const entryTsx = generateEntryTsx(spec);

  const scenePath = join(options.outputDir, "Scene.tsx");
  const rootPath = join(options.outputDir, "Root.tsx");
  const entryPath = join(options.outputDir, "entry.tsx");

  await Promise.all([
    writeFile(scenePath, sceneTsx, "utf-8"),
    writeFile(rootPath, rootTsx, "utf-8"),
    writeFile(entryPath, entryTsx, "utf-8"),
  ]);

  return { scenePath, rootPath, entryPath };
}
