import { test, expect } from "@playwright/test";

test.describe("Chat – Grundfunktionen (mobil)", () => {
  test("Skip-Link fokussiert Hauptbereich", async ({ page }) => {
    await page.goto("/#/");
    // Tab → Skip-Link → Enter
    await page.keyboard.press("Tab");
    const skip = page.locator("a.skip-link");
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("Composer: Enter sendet, Shift+Enter macht Zeilenumbruch", async ({ page }) => {
    await page.goto("/#/");
    const input = page.getByTestId("composer-input");

    // Shift+Enter → Zeilenumbruch, NICHT senden
    await input.click();
    await input.type("Zeile 1");
    await page.keyboard.down("Shift");
    await page.keyboard.press("Enter");
    await page.keyboard.up("Shift");
    await input.type("Zeile 2");
    await expect(input).toHaveValue(/Zeile 1\nZeile 2/);

    // Enter (ohne Shift) → senden
    await page.keyboard.press("Enter");

    // Erwartung: User-Bubble sichtbar (wir prüfen einfach, dass Feld geleert ist und eine neue Nachricht existiert)
    await expect(input).toHaveValue("");
    // Es sollten mindestens 2 Bubbles existieren (Start-Assi + User)
    const bubbles = page.locator(".msg");
    await expect(bubbles).toHaveCount(2, { timeout: 5000 });

    // Nach ~600ms kommt die Demo-Antwort → Count >= 3
    await expect(bubbles).toHaveCount(3, { timeout: 5000 });
  });

  test("Kopieren aus Nachricht zeigt Toast", async ({ page }) => {
    await page.goto("/#/");
    // Kopiere die erste sichtbare Nachricht
    await page.getByRole("button", { name: "Nachricht kopieren" }).first().click();
    await expect(page.getByText("Nachricht kopiert.")).toBeVisible();
  });
});
