import { expect, test } from "@playwright/test";

test("Feedback Formular ausfüllen und absenden", async ({ page }) => {
  // Skip Onboarding
  await page.addInitScript(() => {
    localStorage.setItem("disa-ai-settings", JSON.stringify({ hasCompletedOnboarding: true }));
  });

  await page.goto("/feedback");

  // Header prüfen
  await expect(page.getByRole("heading", { name: "Feedback senden" })).toBeVisible();

  // Textarea ausfüllen
  await page.getByPlaceholder("Was ist dir aufgefallen?").fill("Automatischer Test-Report");

  // Absenden
  await page.getByRole("button", { name: "Feedback absenden" }).click();

  // Toast erwarten (oder Button Text ändert sich)
  // Da Toast animiert ist, prüfen wir, ob wir weitergeleitet werden
  // oder ob der Toast erscheint.
  await expect(page.getByText("Feedback gesendet")).toBeVisible({ timeout: 5000 });

  // Redirect prüfen
  await expect(page).toHaveURL(/\/settings/);
});
