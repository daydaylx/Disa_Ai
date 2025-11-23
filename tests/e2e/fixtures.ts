import { test as base } from "@playwright/test";

/**
 * Extended test fixture that automatically blocks Google Fonts
 * to prevent DNS resolution failures and browser crashes in CI/headless environments
 */
export const test = base.extend({
  context: async ({ context }, use) => {
    // Block Google Fonts at the context level before any pages are created
    await context.route("**/*", (route) => {
      const url = route.request().url();

      if (url.includes("fonts.googleapis.com") || url.includes("fonts.gstatic.com")) {
        // Fulfill with empty responses instead of aborting
        if (url.includes("fonts.googleapis.com")) {
          route.fulfill({
            status: 200,
            contentType: "text/css",
            body: "/* Google Fonts blocked in E2E tests */",
          });
        } else {
          route.fulfill({
            status: 200,
            contentType: "font/woff2",
            body: "",
          });
        }
        return;
      }

      route.continue();
    });

    await use(context);
  },
});

export { expect } from "@playwright/test";
