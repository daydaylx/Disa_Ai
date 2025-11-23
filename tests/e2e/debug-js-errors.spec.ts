import { test } from "@playwright/test";

import { blockExternalResources } from "./helpers/block-external-resources";

test.describe("JavaScript Error Debug", () => {
  test("Capture all JavaScript errors", async ({ page }) => {
    await blockExternalResources(page);

    const jsErrors: any[] = [];
    const consoleErrors: string[] = [];

    // Capture uncaught exceptions
    page.on("pageerror", (error) => {
      const errorInfo = {
        message: error.message,
        stack: error.stack,
      };
      console.log("[JS ERROR]:", JSON.stringify(errorInfo, null, 2));
      jsErrors.push(errorInfo);
    });

    // Capture console.error
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        console.log("[CONSOLE ERROR]:", text);
        consoleErrors.push(text);
      }
    });

    page.on("crash", () => {
      console.log("[BROWSER CRASH]!");
      console.log("\n=== JS ERRORS BEFORE CRASH ===");
      jsErrors.forEach((err) => console.log(JSON.stringify(err, null, 2)));
      console.log("\n=== CONSOLE ERRORS ===");
      consoleErrors.forEach((err) => console.log(err));
    });

    console.log("Loading page...");
    try {
      await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30000 });
      console.log("Page loaded!");
    } catch (error: any) {
      console.log("Goto failed:", error.message);
    }

    await page.waitForTimeout(2000);
  });
});
