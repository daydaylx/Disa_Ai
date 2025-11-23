import { test } from "@playwright/test";

test.describe("Console Log Debug", () => {
  test("Capture console logs and errors", async ({ page }) => {
    // Listen to all console messages
    page.on("console", (msg) => {
      console.log(`[BROWSER ${msg.type().toUpperCase()}]:`, msg.text());
    });

    // Listen to page errors
    page.on("pageerror", (error) => {
      console.log("[BROWSER UNCAUGHT ERROR]:", error.message);
      console.log("Stack:", error.stack);
    });

    // Listen to crashes
    page.on("crash", () => {
      console.log("[BROWSER CRASH]: Page crashed!");
    });

    console.log("Attempting to load /...");
    try {
      await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30000 });
      console.log("Page loaded successfully!");
    } catch (error: any) {
      console.log("Goto failed:", error.message);
    }

    // Wait a bit to see if there are delayed errors
    await page.waitForTimeout(2000);
  });
});
