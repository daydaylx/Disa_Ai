#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { chromium, devices, type Browser, type Page } from "playwright";
import { z } from "zod";
import AxeBuilder from "@axe-core/playwright";

// Configuration
const DEFAULT_URL = "https://disaai.de";
const USER_AGENT = "DisaAI-Visual-Analyst/1.0 (MCP)";

// Global State
let browser: Browser | null = null;
let page: Page | null = null;
let isMobile = true; // Default to mobile-first for this project

// Tool Definitions
const server = new Server(
  {
    name: "disa-visual-analyst",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

async function ensurePage() {
  if (!browser) {
    browser = await chromium.launch({ headless: true }); // Set headless: false to watch
  }
  if (!page) {
    const context = await browser.newContext({
      userAgent: USER_AGENT,
      ...(isMobile ? devices["iPhone 14"] : devices["Desktop Chrome"]),
    });
    page = await context.newPage();
  }
  return page;
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "navigate",
        description: "Navigates the browser to a specific URL (Default: Live Site).",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "The URL to visit" },
          },
        },
      },
      {
        name: "set_viewport",
        description: "Switches between Mobile (iPhone 14) and Desktop viewport.",
        inputSchema: {
          type: "object",
          properties: {
            mode: { type: "string", enum: ["mobile", "desktop"] },
          },
          required: ["mode"],
        },
      },
      {
        name: "take_screenshot",
        description: "Takes a screenshot of the current page state for visual analysis.",
        inputSchema: {
          type: "object",
          properties: {
            fullPage: { type: "boolean" },
          },
        },
      },
      {
        name: "analyze_accessibility",
        description: "Runs an Axe-core accessibility scan on the current page.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "interact",
        description: "Performs click, hover, or fill interactions on page elements.",
        inputSchema: {
          type: "object",
          properties: {
            selector: { type: "string" },
            action: { type: "string", enum: ["click", "hover", "fill"] },
            value: { type: "string" },
          },
          required: ["selector", "action"],
        },
      },
      {
        name: "get_page_source",
        description: "Returns the simplified HTML structure for context.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const p = await ensurePage();

  try {
    switch (request.params.name) {
      case "navigate": {
        const url = String(request.params.arguments?.url || DEFAULT_URL);
        await p.goto(url, { waitUntil: "networkidle" });
        return {
          content: [
            { type: "text", text: `Navigated to ${url} (${isMobile ? "Mobile" : "Desktop"})` },
          ],
        };
      }

      case "set_viewport": {
        const mode = String(request.params.arguments?.mode);
        isMobile = mode === "mobile";
        // Close page to force context recreation with new device settings
        await p.close();
        page = null;
        await ensurePage();
        // Reload if we had a url
        return {
          content: [
            {
              type: "text",
              text: `Switched to ${isMobile ? "Mobile (iPhone 14)" : "Desktop (Chrome)"}. Please navigate again.`,
            },
          ],
        };
      }

      case "take_screenshot": {
        const fullPage = Boolean(request.params.arguments?.fullPage);
        const buffer = await p.screenshot({ fullPage, type: "jpeg", quality: 80 });
        const base64 = buffer.toString("base64");
        return {
          content: [
            {
              type: "image",
              data: base64,
              mimeType: "image/jpeg",
            },
            {
              type: "text",
              text: `Screenshot taken from ${p.url()}`,
            },
          ],
        };
      }

      case "analyze_accessibility": {
        const axe = new AxeBuilder({ page: p });
        const results = await axe.analyze();
        const violations = results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length,
          help: v.helpUrl,
        }));

        return {
          content: [
            {
              type: "text",
              text: violations.length
                ? `Found ${violations.length} accessibility violations:\n${JSON.stringify(violations, null, 2)}`
                : "No accessibility violations found!",
            },
          ],
        };
      }

      case "interact": {
        const { selector, action, value } = request.params.arguments as any;
        if (action === "click") await p.click(selector);
        if (action === "hover") await p.hover(selector);
        if (action === "fill") await p.fill(selector, value || "");

        return {
          content: [{ type: "text", text: `Performed ${action} on ${selector}` }],
        };
      }

      case "get_page_source": {
        // Return simplified body mainly
        const content = await p.evaluate(() => document.body.innerText);
        return {
          content: [{ type: "text", text: content.substring(0, 5000) + "..." }],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, "Unknown tool");
    }
  } catch (error) {
    return {
      isError: true,
      content: [
        { type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` },
      ],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Disa AI Visual MCP Server running on stdio");
}

run().catch(console.error);
