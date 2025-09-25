import { expect, test } from "@playwright/test";

// Set UI V2 environment for these tests
test.use({
  extraHTTPHeaders: {
    "x-test-ui-version": "v2",
  },
});

test.describe("UI-V2 smoke", () => {
  test("welcome page loads with UI V2 elements", async ({ page }) => {
    // Set UI V2 flag via environment variable simulation
    await page.addInitScript(() => {
      // Mock import.meta.env for UI V2
      Object.defineProperty(window, "import", {
        value: {
          meta: {
            env: {
              VITE_UI_V2: "true",
            },
          },
        },
      });
    });

    await page.goto("/");

    // Check for new UI V2 text elements
    await expect(page.getByText("Corporate AI Intelligence")).toBeVisible();
    await expect(page.getByText("AI Executive Assistant")).toBeVisible();

    // Check for the executive cards
    await expect(page.getByText("Strategic Analysis")).toBeVisible();
    await expect(page.getByText("Executive Reports")).toBeVisible();
    await expect(page.getByText("Risk Management")).toBeVisible();
    await expect(page.getByText("Resource Planning")).toBeVisible();
  });

  test("settings page loads with UI V2 elements", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "import", {
        value: {
          meta: {
            env: {
              VITE_UI_V2: "true",
            },
          },
        },
      });
    });

    await page.goto("/settings");
    await expect(page.getByText("Executive Control Panel")).toBeVisible();
  });

  test("chat route guard redirects when no key", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "import", {
        value: {
          meta: {
            env: {
              VITE_UI_V2: "true",
            },
          },
        },
      });
    });

    // Session ohne Key
    await page.context().clearCookies();
    await page.goto("/chat");
    await expect(page).toHaveURL(/\/settings/);
  });

  test("fallback to V1 when UI V2 flag is false", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "import", {
        value: {
          meta: {
            env: {
              VITE_UI_V2: "false",
            },
          },
        },
      });
    });

    await page.goto("/");

    // Should show V1 welcome text
    await expect(page.getByText("Willkommen")).toBeVisible();

    // Should NOT show V2 elements
    await expect(page.getByText("Corporate AI Intelligence")).not.toBeVisible();
  });
});
