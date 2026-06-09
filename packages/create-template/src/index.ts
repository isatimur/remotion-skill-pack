#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Command } from "commander";

const program = new Command();

program
  .name("create-remotion-template")
  .description("Scaffold a new remotion-skill-pack theme package")
  .argument("<name>", "Theme name (kebab-case, e.g. my-brand-video)")
  .action(async (name: string) => {
    const dir = `theme-${name}`;
    await mkdir(join(dir, "layouts"), { recursive: true });

    await writeFile(
      join(dir, "package.json"),
      JSON.stringify({
        name: `@remotion-skill-pack/theme-${name}`,
        version: "0.1.0",
        description: `${name} theme for remotion-skill-pack`,
        license: "MIT",
        files: ["theme.json", "palette.md", "layouts"],
        peerDependencies: { "@remotion-skill-pack/core": ">=0.1.0" },
      }, null, 2),
    );

    await writeFile(
      join(dir, "theme.json"),
      JSON.stringify({
        name,
        version: "0.1.0",
        description: `Custom theme: ${name}`,
        colors: {
          background: "#0f0f14",
          surface: "#1a1a24",
          text: "#f0f0f0",
          textMuted: "#a0a0b0",
          accent: "#6ee7b7",
          accentDim: "#2d9e7a",
          border: "#2a2a3a",
          code: "#1e1e2e",
        },
        typography: {
          heading: "Inter, system-ui, sans-serif",
          body: "Inter, system-ui, sans-serif",
          mono: "JetBrains Mono, monospace",
        },
        animation: {
          entryDuration: 15,
          transitionDuration: 15,
          springConfig: { damping: 20, mass: 1, stiffness: 180 },
        },
      }, null, 2),
    );

    await writeFile(
      join(dir, "palette.md"),
      `# ${name} Palette\n\nCustom theme for remotion-skill-pack.\n\nEdit theme.json to set your brand colors.\n`,
    );

    await writeFile(
      join(dir, "layouts", "README.md"),
      `# Layouts\n\nAdd custom layout notes here to guide AI agents using this theme.\n`,
    );

    process.stdout.write(`✓ Created theme-${name}/\n`);
    process.stdout.write(`  Edit theme.json to set your colors, then:\n`);
    process.stdout.write(`  cd theme-${name} && npm publish --access public\n`);
  });

program.parse();
