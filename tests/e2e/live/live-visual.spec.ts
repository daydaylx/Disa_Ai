import fs from "node:fs";
import path from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const isLive = process.env.PLAYWRIGHT_LIVE === "1";
const liveBaseUrl = process.env.LIVE_BASE_URL ?? "https://disaai.de";
const routes = (process.env.LIVE_PATHS ?? "/")
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);

const artifactsDir = path.join("test-results", "live");

const toSlug = (value: string): string => {
  const normalised = value.replace(/^\/+|\/+$/g, "");
  const slug = normalised.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
  return slug.length ? slug : "home";
};

test.skip(!isLive, "Set PLAYWRIGHT_LIVE=1 to hit the live deployment.");

test.describe("Live visual + a11y", () => {
  test.beforeAll(() => {
    fs.mkdirSync(artifactsDir, { recursive: true });
  });

  for (const route of routes) {
    const label = toSlug(route);

    test(`captures ${route || "/"}`, async ({ page }, testInfo) => {
      test.setTimeout(120_000);
      const targetUrl = new URL(route || "/", liveBaseUrl).toString();
      const consoleErrors: string[] = [];

      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(message.text());
        }
      });

      const response = await page.goto(targetUrl, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
      });

      expect(response, `No response for ${targetUrl}`).not.toBeNull();
      expect(response?.status(), `Unexpected status for ${targetUrl}`).toBeLessThan(400);

      await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
      await page.waitForTimeout(1500);

      const screenshotPath = path.join(artifactsDir, `${testInfo.project.name}-${label}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      await testInfo.attach(`screenshot-${label}`, {
        path: screenshotPath,
        contentType: "image/png",
      });

      const axe = new AxeBuilder({ page });
      const axeResults = await axe.analyze();
      const axePath = path.join(artifactsDir, `${testInfo.project.name}-${label}-axe.json`);
      fs.writeFileSync(axePath, JSON.stringify(axeResults, null, 2));
      await testInfo.attach(`axe-${label}`, { path: axePath, contentType: "application/json" });

      if (axeResults.violations.length) {
        testInfo.annotations.push({
          type: "axe",
          description: `${axeResults.violations.length} violations recorded (see ${path.basename(axePath)})`,
        });
      }

      expect(axeResults.violations, `${label} accessibility violations`).toEqual([]);

      if (consoleErrors.length) {
        const consolePath = path.join(
          artifactsDir,
          `${testInfo.project.name}-${label}-console.txt`,
        );
        fs.writeFileSync(consolePath, consoleErrors.join("\n"));
        await testInfo.attach(`console-${label}`, { path: consolePath, contentType: "text/plain" });
      }
    });
  }
});
