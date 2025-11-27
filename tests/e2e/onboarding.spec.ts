import { expect, test } from "@playwright/test";

test.describe("Onboarding Flow", () => {
  test("zeigt Onboarding beim ersten Start und speichert Abschluss", async ({ page }) => {
    // Clear local storage to force onboarding
    await page.addInitScript(() => {
      localStorage.clear();
    });

    await page.goto("/");

    // Check for Overlay (Step 1)
    await expect(page.getByText("Willkommen bei Disa AI")).toBeVisible();
    await page.getByRole("button", { name: "Weiter" }).click();

    // Step 2
    await expect(page.getByText("Wie es funktioniert")).toBeVisible();
    await page.getByRole("button", { name: "Weiter" }).click();

    // Step 3
    await expect(page.getByText("Sicher & Fair")).toBeVisible();
    await page.getByRole("button", { name: "Loslegen" }).click();

    // Overlay should disappear
    await expect(page.getByText("Willkommen bei Disa AI")).not.toBeVisible();

    // Reload to verify persistence
    await page.reload();
    await expect(page.getByText("Willkommen bei Disa AI")).not.toBeVisible();
  });
});
