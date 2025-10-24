#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";
import * as path from "path";
import * as fs from "fs/promises";

const execAsync = promisify(exec);

// ツール定義
const CONVERT_TOOL: Tool = {
  name: "convert_markdown_to_pdf",
  description: "Convert a Japanese Markdown file to a beautiful PDF file using md2pdf-ja. By default, only converts the Markdown content without adding extra metadata. Use optional parameters ONLY when explicitly requested by the user.",
  inputSchema: {
    type: "object",
    properties: {
      input: {
        type: "string",
        description: "Path to the input Markdown file",
      },
      output: {
        type: "string",
        description: "Path to the output PDF file (optional, defaults to input filename with .pdf extension)",
      },
      title: {
        type: "string",
        description: "Document title - DO NOT use unless explicitly requested by user. Omit this parameter by default.",
      },
      author: {
        type: "string",
        description: "Document author - DO NOT use unless explicitly requested by user. Omit this parameter by default.",
      },
      theme: {
        type: "string",
        enum: ["default", "academic", "business"],
        description: "Document theme - Only use if user explicitly specifies a theme. Omit this parameter by default.",
      },
      format: {
        type: "string",
        enum: ["A4", "A5", "B5", "Letter"],
        description: "Page format - Only use if user explicitly specifies a format. Omit this parameter by default.",
      },
      css: {
        type: "string",
        description: "Path to custom CSS file - Only use if user explicitly provides a CSS file. Omit this parameter by default.",
      },
    },
    required: ["input"],
  },
};

// MCPサーバーの作成
const server = new Server(
  {
    name: "md2pdf-ja-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ツール一覧のハンドラー
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [CONVERT_TOOL],
  };
});

// ツール実行のハンドラー
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "convert_markdown_to_pdf") {
    const args = request.params.arguments as {
      input: string;
      output?: string;
      title?: string;
      author?: string;
      theme?: string;
      format?: string;
      css?: string;
    };

    try {
      // 入力ファイルの存在確認
      const inputPath = path.resolve(args.input);
      await fs.access(inputPath);

      // コマンドラインオプションの構築
      let command = `md2pdf-ja "${inputPath}"`;

      if (args.output) {
        command += ` -o "${path.resolve(args.output)}"`;
      }

      if (args.title) {
        command += ` -t "${args.title}"`;
      }

      if (args.author) {
        command += ` -a "${args.author}"`;
      }

      if (args.theme) {
        command += ` --theme ${args.theme}`;
      }

      if (args.format) {
        command += ` --format ${args.format}`;
      }

      if (args.css) {
        const cssPath = path.resolve(args.css);
        await fs.access(cssPath);
        command += ` --css "${cssPath}"`;
      }

      // md2pdf-jaを実行
      const { stdout, stderr } = await execAsync(command);

      const outputPath = args.output || inputPath.replace(/\.md$/i, ".pdf");

      return {
        content: [
          {
            type: "text",
            text: `✅ PDF generated successfully!\n\nInput: ${inputPath}\nOutput: ${outputPath}\n\n${stdout}${stderr ? `\nWarnings:\n${stderr}` : ""}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Error converting Markdown to PDF:\n${error.message}\n\n${error.stderr || ""}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// サーバーの起動
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("md2pdf-ja MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
