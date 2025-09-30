import { expect, test } from "@playwright/test";

test.describe("Navigation Tests", () => {
  test("should navigate to the chat page (V1)", async ({ page }) => {
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

    await page.goto("/");
    await expect(page).toHaveTitle(/Disa AI/);
    await expect(page.getByText("Willkommen")).toBeVisible();
  });

  test("should navigate with default configuration", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Disa AI/);

    // Should load either V1 or V2 content
    const hasV1Content = await page.getByText("Willkommen").count();
    const hasV2Content = await page.getByText("Corporate AI Intelligence").count();
    expect(hasV1Content + hasV2Content).toBeGreaterThan(0);
  });
});
