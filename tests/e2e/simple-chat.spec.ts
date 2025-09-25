import { expect, test } from "@playwright/test";

import { setupTestEnvironment } from "./global-setup";

test.describe("Simple Chat Tests", () => {
  test("should enable send button when model is loaded (V1)", async ({ page }) => {
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

    await setupTestEnvironment(page);
    await page.waitForTimeout(5000);
    await expect(page.getByRole("button", { name: "Senden" })).toBeEnabled();
  });

  test("should enable send button when model is loaded (V2)", async ({ page }) => {
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

    await setupTestEnvironment(page);
    await page.waitForTimeout(5000);

    // In V2, the send button should still be available with same functionality
    // Using testid selector for more robust testing
    const sendButton = page.getByTestId("composer-send");
    await expect(sendButton).toBeVisible();
    await expect(sendButton).toBeEnabled();
  });

  test("should enable send button with default UI", async ({ page }) => {
    await setupTestEnvironment(page);
    await page.waitForTimeout(5000);

    // Test with default UI configuration - should work with both versions
    // Use a more flexible approach that works with both UI versions
    const sendByRole = page.getByRole("button", { name: "Senden" });
    const sendByTestId = page.getByTestId("composer-send");

    // At least one of these should be present and enabled
    const roleButtonCount = await sendByRole.count();
    const testIdButtonCount = await sendByTestId.count();

    expect(roleButtonCount + testIdButtonCount).toBeGreaterThan(0);

    if (roleButtonCount > 0) {
      await expect(sendByRole.first()).toBeEnabled();
    } else {
      await expect(sendByTestId).toBeEnabled();
    }
  });
});
