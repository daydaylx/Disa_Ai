import { Page } from "@playwright/test";
import baseResponse from "../../../e2e/fixtures/base-response.json" with { type: "json" };
import rateLimit from "../../../e2e/fixtures/rate-limit.json" with { type: "json" };
import timeoutError from "../../../e2e/fixtures/timeout-error.json" with { type: "json" };
import abortError from "../../../e2e/fixtures/abort-error.json" with { type: "json" };
import serverError from "../../../e2e/fixtures/server-error.json" with { type: "json" };

export type InterceptScenario = 
  | "success"
  | "rate-limit" 
  | "timeout"
  | "abort"
  | "server-error";

export async function setupRequestInterception(
  page: Page,
  scenario: InterceptScenario = "success",
) {
  await page.route("**/v1/**", async (route) => {
    switch (scenario) {
      case "timeout":
        await route.abort("timedout");
        return;
      
      case "abort":
        await route.abort("aborted");
        return;
        
      case "rate-limit":
        await route.fulfill({
          status: 429,
          contentType: "application/json",
          body: JSON.stringify(rateLimit),
        });
        return;
        
      case "server-error":
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify(serverError),
        });
        return;
        
      case "success":
      default:
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(baseResponse),
        });
        return;
    }
  });
}
