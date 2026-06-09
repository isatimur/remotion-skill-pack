#!/usr/bin/env node
import { Command } from "commander";
import { composeToTsx } from "./index.js";

const program = new Command();

program
  .name("remotion-skill-pack-render")
  .description("Convert a composition.json spec to a Remotion TSX project")
  .argument("<spec>", "Path to composition.json")
  .option("-o, --output <dir>", "Output directory", "./out")
  .option("--theme <name>", "Override theme (book-chapter | minimal-dark)")
  .option("--render", "Also render to MP4 via Remotion CLI (requires Chrome)")
  .action(async (specPath: string, opts: { output: string; theme?: string; render?: boolean }) => {
    const result = await composeToTsx(specPath, {
      outputDir: opts.output,
      theme: opts.theme,
    });

    if (result.errors?.length) {
      process.stderr.write(`Composition validation failed:\n${result.errors.join("\n")}\n`);
      process.exit(1);
    }

    process.stdout.write(`✓ Scene.tsx  → ${result.scenePath}\n`);
    process.stdout.write(`✓ Root.tsx   → ${result.rootPath}\n`);
    process.stdout.write(`✓ entry.tsx  → ${result.entryPath}\n`);

    if (opts.render) {
      process.stdout.write(
        "\n⚠  --render flag detected. To render to MP4, run:\n" +
          `  cd ${opts.output} && npx remotion render ${result.entryPath} --output video.mp4\n` +
          "  (Requires @remotion/cli and Chrome installed)\n",
      );
    }
  });

program.parse();
