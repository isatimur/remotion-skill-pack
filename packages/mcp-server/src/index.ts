#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { createCompositionTool } from "./tools/create-composition.js";
import { validateCompositionTool } from "./tools/validate-composition.js";
import { renderToTsxTool } from "./tools/render-to-tsx.js";
import { listThemesTool } from "./tools/list-themes.js";
import { getSceneTemplateTool } from "./tools/get-scene-template.js";
import { generateFromTextTool } from "./tools/generate-from-text.js";

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (input: Record<string, unknown>) => Promise<unknown>;
}

const TOOLS: ToolDefinition[] = [
  createCompositionTool,
  validateCompositionTool,
  renderToTsxTool,
  listThemesTool,
  getSceneTemplateTool,
  generateFromTextTool,
];

export function listToolDefinitions(): ToolDefinition[] {
  return TOOLS;
}

export async function main() {
  const server = new Server(
    { name: "remotion-skill-pack", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = TOOLS.find((t) => t.name === request.params.name);
    if (!tool) {
      return {
        content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
        isError: true,
      };
    }
    try {
      const result = await tool.handler(
        (request.params.arguments ?? {}) as Record<string, unknown>,
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { content: [{ type: "text", text: message }], isError: true };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
