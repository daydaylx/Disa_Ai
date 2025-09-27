import { expect, test } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("App loads and shows initial state (V1 UI)", async ({ page }) => {
    // Force V1 UI
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

    // Starte die App. Passe ggf. baseURL in playwright.config an.
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Titel: robust und case-insensitive
    await expect(page).toHaveTitle(/disa ai/i);

    // Root-Container: akzeptiere #main oder #root, je nach Build/HTML
    const hasMain = await page.locator("#main").count();
    const target = hasMain ? page.locator("#main") : page.locator("#root");
    await expect(target).toBeVisible();

    // V1 specific content check
    await expect(page.getByText("Willkommen")).toBeVisible();
  });

  test("App loads and shows initial state (V2 UI)", async ({ page }) => {
    // Force V2 UI
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

    // Starte die App. Passe ggf. baseURL in playwright.config an.
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Titel: robust und case-insensitive
    await expect(page).toHaveTitle(/disa ai/i);

    // Root-Container: akzeptiere #main oder #root, je nach Build/HTML
    const hasMain = await page.locator("#main").count();
    const target = hasMain ? page.locator("#main") : page.locator("#root");
    await expect(target).toBeVisible();

    // V2 specific content checks
    await expect(page.getByText("Corporate AI Intelligence")).toBeVisible();
    await expect(page.getByText("AI Executive Assistant")).toBeVisible();
  });

  test("App loads with default configuration", async ({ page }) => {
    // No UI version forced - use default
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Titel: robust und case-insensitive
    await expect(page).toHaveTitle(/disa ai/i);

    // Root-Container: akzeptiere #main oder #root, je nach Build/HTML
    const hasMain = await page.locator("#main").count();
    const target = hasMain ? page.locator("#main") : page.locator("#root");
    await expect(target).toBeVisible();

    // Check that at least some content is loaded (could be either V1 or V2)
    const hasWillkommen = await page.getByText("Willkommen").count();
    const hasCorporate = await page.getByText("Corporate AI Intelligence").count();
    expect(hasWillkommen + hasCorporate).toBeGreaterThan(0);
  });
});
