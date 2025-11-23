import { test } from "@playwright/test";

test.describe("Network Debug", () => {
  test("Capture all network requests", async ({ page }) => {
    const failedRequests: any[] = [];

    // Listen to all network requests
    page.on("request", (request) => {
      console.log(`[REQUEST]: ${request.method()} ${request.url()}`);
    });

    // Listen to failed requests
    page.on("requestfailed", (request) => {
      const failure = {
        url: request.url(),
        method: request.method(),
        failure: request.failure()?.errorText || "unknown",
      };
      console.log(`[REQUEST FAILED]:`, JSON.stringify(failure, null, 2));
      failedRequests.push(failure);
    });

    // Listen to crashes
    page.on("crash", () => {
      console.log("[BROWSER CRASH]: Page crashed!");
      console.log("\n=== FAILED REQUESTS BEFORE CRASH ===");
      failedRequests.forEach((req) => console.log(JSON.stringify(req, null, 2)));
    });

    console.log("Attempting to load /...");
    try {
      await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30000 });
      console.log("Page loaded successfully!");
    } catch (error: any) {
      console.log("Goto failed:", error.message);
      console.log("\n=== FAILED REQUESTS SUMMARY ===");
      failedRequests.forEach((req) => console.log(JSON.stringify(req, null, 2)));
    }

    await page.waitForTimeout(1000);
  });
});
