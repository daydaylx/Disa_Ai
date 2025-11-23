import { test } from "@playwright/test";

import { blockExternalResources } from "./helpers/block-external-resources";

test.describe("Network Debug With Mock", () => {
  test("Check if fonts are properly mocked", async ({ page }) => {
    const failedRequests: any[] = [];

    // Setup mocking FIRST
    await blockExternalResources(page);

    // Then setup logging
    page.on("requestfailed", (request) => {
      const failure = {
        url: request.url(),
        method: request.method(),
        failure: request.failure()?.errorText || "unknown",
      };
      console.log(`[REQUEST STILL FAILED]:`, JSON.stringify(failure, null, 2));
      failedRequests.push(failure);
    });

    page.on("crash", () => {
      console.log("[BROWSER CRASH]: Page crashed DESPITE mocking!");
      console.log("\n=== STILL FAILED REQUESTS ===");
      failedRequests.forEach((req) => console.log(JSON.stringify(req, null, 2)));
    });

    console.log("Attempting to load / WITH font mocking...");
    try {
      await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30000 });
      console.log("SUCCESS: Page loaded with mocked fonts!");
    } catch (error: any) {
      console.log("Goto failed:", error.message);
      console.log("\n=== FAILED REQUESTS DESPITE MOCKING ===");
      failedRequests.forEach((req) => console.log(JSON.stringify(req, null, 2)));
    }

    await page.waitForTimeout(1000);
  });
});
