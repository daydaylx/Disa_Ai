import { expect, test } from "@playwright/test";

import { skipOnboarding } from "./utils";

/**
 * E2E-Smoke-Tests für die Chat-Oberfläche
 *
 * Diese Tests prüfen die kritischen UI-Elemente und grundlegenden Interaktionen
 * der Chat-Seite. Sie stellen sicher, dass:
 * - Alle wichtigen UI-Elemente sichtbar sind
 * - Nachrichten eingegeben und gesendet werden können
 * - Navigation und Menüs funktionieren
 */
test.describe("Chat Smoke Tests", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await page.goto("/");
    // Warte auf vollständiges Laden der Seite
    await page.waitForLoadState("networkidle");
  });

  test("should load chat interface with key elements", async ({ page }) => {
    // Prüfe Hauptmenü-Button (korrektes aria-label)
    await expect(page.locator('button[aria-label="Hauptmenü öffnen"]')).toBeVisible();

    // Prüfe Verlauf-Button
    await expect(page.locator('button[aria-label="Verlauf öffnen"]')).toBeVisible();

    // Prüfe Eingabefeld
    const input = page.getByTestId("composer-input");
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("aria-label", "Nachricht eingeben");

    // Prüfe Senden-Button
    const sendButton = page.locator('button[aria-label="Senden"]');
    await expect(sendButton).toBeVisible();

    // Prüfe Rollen-Auswahl (SelectTrigger mit aria-label)
    const roleSelector = page.locator('button[aria-label="Rolle auswählen"]');
    await expect(roleSelector).toBeVisible();

    // Prüfe Stil-Auswahl
    const styleSelector = page.locator('button[aria-label="Stil auswählen"]');
    await expect(styleSelector).toBeVisible();

    // Prüfe Kreativitäts-Auswahl
    const creativitySelector = page.locator('button[aria-label="Kreativität auswählen"]');
    await expect(creativitySelector).toBeVisible();
  });

  test("should allow typing and sending a message", async ({ page }) => {
    const input = page.getByTestId("composer-input");
    await input.fill("Test message");

    const sendButton = page.locator('button[aria-label="Senden"]');
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    // Eingabefeld sollte nach dem Senden geleert sein
    await expect(input).toHaveValue("");
  });

  test("should open main menu", async ({ page }) => {
    // Korrektes aria-label verwenden
    const menuButton = page.locator('button[aria-label="Hauptmenü öffnen"]');
    await menuButton.click();

    // Menü-Drawer sollte sichtbar sein
    const menuDrawer = page.getByRole("dialog", { name: "Navigationsmenü" });
    await expect(menuDrawer).toBeVisible();

    // Prüfe Navigation-Links
    await expect(menuDrawer.getByText("Einstellungen")).toBeVisible();
    await expect(menuDrawer.getByText("Impressum")).toBeVisible();

    // Menü schließen
    const closeButton = menuDrawer.locator('button[aria-label="Menü schließen"]');
    await closeButton.click();
    await expect(menuDrawer).not.toBeVisible();
  });

  test("should open history panel", async ({ page }) => {
    const historyButton = page.locator('button[aria-label="Verlauf öffnen"]');
    await historyButton.click();

    // History-Panel sollte sichtbar sein (kann dialog oder complementary sein)
    const historyPanel = page.getByRole("complementary").or(page.getByRole("dialog")).first();
    await expect(historyPanel).toBeVisible();

    // Prüfe Tabs im History-Panel
    await expect(historyPanel.getByText("Lesezeichen")).toBeVisible();
    await expect(historyPanel.getByText("Archiv")).toBeVisible();

    // Panel schließen durch Klick außerhalb
    await page.mouse.click(10, 10);
  });

  test("should interact with role selector", async ({ page }) => {
    // Klicke auf Rollen-Selektor (SelectTrigger)
    const roleSelector = page.locator('button[aria-label="Rolle auswählen"]');
    await roleSelector.click();

    // Dropdown sollte geöffnet sein - prüfe auf "Neutral Standard" Option (exakter Name)
    const neutralOption = page.getByRole("option", { name: "Neutral Standard" });
    await expect(neutralOption).toBeVisible();

    // Schließe durch Klick auf die Option
    await neutralOption.click();
  });

  test("should send message with Enter key", async ({ page }) => {
    const input = page.getByTestId("composer-input");
    await input.fill("Test with Enter");

    // Mit Enter senden
    await input.press("Enter");

    // Eingabefeld sollte geleert sein
    await expect(input).toHaveValue("");
  });

  test("should handle disabled send button with empty input", async ({ page }) => {
    const input = page.getByTestId("composer-input");
    const sendButton = page.locator('button[aria-label="Senden"]');

    // Senden-Button sollte bei leerem Input deaktiviert sein
    await expect(input).toHaveValue("");
    await expect(sendButton).toBeDisabled();

    // Button sollte nach Texteingabe aktiviert sein
    await input.fill("Some text");
    await expect(sendButton).toBeEnabled();
  });
});
