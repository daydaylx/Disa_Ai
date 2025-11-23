import type { Page } from "@playwright/test";

/**
 * Mock external resources that cause DNS failures in test environment
 * Call this before page.goto() in every test
 */
export async function blockExternalResources(page: Page): Promise<void> {
  await page.route("**/*", (route) => {
    const url = route.request().url();

    // Mock Google Fonts with empty CSS (prevents ERR_NAME_NOT_RESOLVED crash)
    if (url.includes("fonts.googleapis.com")) {
      route.fulfill({
        status: 200,
        contentType: "text/css",
        body: "/* Mocked Google Fonts */",
      });
      return;
    }

    // Mock gstatic font files with empty response
    if (url.includes("fonts.gstatic.com")) {
      route.fulfill({
        status: 200,
        contentType: "font/woff2",
        body: "",
      });
      return;
    }

    // Allow all other requests
    route.continue();
  });
}
