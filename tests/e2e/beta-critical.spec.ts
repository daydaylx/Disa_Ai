import { expect, test } from "@playwright/test";

import { setupApiKeyStorage, setupChatApiStreamingMock } from "./api-mock";

test.describe("Beta Critical Path", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiKeyStorage(page);
    await setupChatApiStreamingMock(page);
    await page.goto("/");
  });

  test("1. App loads and navigation works", async ({ page }) => {
    // Check Hero - Updated text
    await expect(page.getByRole("heading", { name: "Dein ruhiges KI-Studio" })).toBeVisible();

    // Open Menu
    await page.getByRole("button", { name: "Menü öffnen" }).click();

    // Click on 'Chat'
    await page.getByRole("link", { name: "Chat" }).click();
    await expect(page).toHaveURL(/\/chat/);

    // Verify Chat Page loaded
    const composer = page.getByTestId("composer-input");
    await expect(composer).toBeVisible();
  });

  test("2. Role selection", async ({ page }) => {
    await page.goto("/roles");
    await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible();
  });

  test("3. Model selection persistence", async ({ page }) => {
    await page.goto("/models");
    // Since AppHeader was updated to use h1
    await expect(page.getByRole("heading", { level: 1, name: "Modelle" })).toBeVisible();
  });

  test("4. Chat functionality", async ({ page }) => {
    await page.goto("/chat");
    const composer = page.getByTestId("composer-input");
    await composer.fill("Hallo");
    await composer.press("Enter");

    await expect(page.getByText("Hallo", { exact: true })).toBeVisible();
    await expect(page.getByText("Hallo das ist eine Test-Antwort")).toBeVisible();
  });

  test("5. Youth filter toggle", async ({ page }) => {
    await page.goto("/settings/youth");

    // Handle prompt for age verification
    page.on('dialog', dialog => dialog.accept("1990"));

    const switchControl = page.getByRole("switch", { name: "Jugendschutz aktivieren" });
    await expect(switchControl).toBeVisible();

    // Default state is Checked (Protection ON)
    await expect(switchControl).toBeChecked();

    await switchControl.click();

    // Expect Unchecked (Protection OFF)
    await expect(switchControl).not.toBeChecked();

    await page.reload();
    await expect(switchControl).not.toBeChecked();
  });

  test("6. Settings Export/Import", async ({ page }) => {
     // First, create a conversation so export is enabled
     await page.goto("/chat");
     const composer = page.getByTestId("composer-input");
     await composer.fill("Test Msg");
     await composer.press("Enter");
     await expect(page.getByText("Hallo das ist eine Test-Antwort")).toBeVisible();

     // Now go to export
     await page.goto("/settings/api-data");

     const exportBtn = page.getByRole("button", { name: "Alle Gespräche exportieren" });

     // Wait for button to be enabled, reload if needed to refresh stats
     if (await exportBtn.isDisabled()) {
        await page.reload();
     }
     await expect(exportBtn).toBeEnabled({ timeout: 15000 });

     await exportBtn.click();
     await expect(page.getByText("Export erfolgreich")).toBeVisible();
  });
});
