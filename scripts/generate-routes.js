#!/usr/bin/env node

/**
 * Generate _routes.json for Cloudflare Pages
 * This ensures proper routing for the SPA while allowing static assets to be served directly
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const routes = {
  version: 1,
  include: ["/*"],
  exclude: ["/api/*"], // Only exclude API routes, let Cloudflare serve all static assets
};

// Ensure dist directory exists
const distPath = join(process.cwd(), "dist");
if (!existsSync(distPath)) {
  mkdirSync(distPath, { recursive: true });
}

// Write _routes.json
const routesPath = join(distPath, "_routes.json");
writeFileSync(routesPath, JSON.stringify(routes, null, 2));

console.log("✅ Generated _routes.json for Cloudflare Pages");
console.log(`📁 Location: ${routesPath}`);
console.log("🔧 Configuration:", JSON.stringify(routes, null, 2));
