import { test as setup } from "@playwright/test";
import { readFileSync } from "fs";
import { resolve } from "path";

const fixtures = {
  base: readFileSync(resolve("e2e/fixtures/base-response.json"), "utf-8"),
  rateLimit: readFileSync(resolve("e2e/fixtures/rate-limit.json"), "utf-8"),
  serverError: readFileSync(resolve("e2e/fixtures/server-error.json"), "utf-8"),
  timeout: readFileSync(resolve("e2e/fixtures/timeout-error.json"), "utf-8"),
  abort: readFileSync(resolve("e2e/fixtures/abort-error.json"), "utf-8"),
};

setup("mock api", async ({ page }) => {
  await page.route("**/api/openrouter", (route) => {
    const requestBody = route.request().postDataJSON();
    const { model } = requestBody;

    if (model.includes("error-rate-limit")) {
      return route.fulfill({
        status: 429,
        contentType: "application/json",
        body: fixtures.rateLimit,
      });
    }

    if (model.includes("error-server")) {
      return route.fulfill({
        status: 500,
        contentType: "application/json",
        body: fixtures.serverError,
      });
    }

    if (model.includes("error-timeout")) {
      return route.fulfill({
        status: 504,
        contentType: "application/json",
        body: fixtures.timeout,
      });
    }

    if (model.includes("error-abort")) {
      return route.abort();
    }

    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: fixtures.base,
    });
  });
});
