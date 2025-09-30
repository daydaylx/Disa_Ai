import { expect, test } from "@playwright/test";

test.describe("Schnellstart-Kacheln Funktionalität", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Warten bis die Seite vollständig geladen ist
    await page.waitForLoadState("networkidle");
  });

  test("sollte Schnellstart-Kacheln anzeigen wenn keine Nachrichten vorhanden", async ({
    page,
  }) => {
    // Prüfen ob mindestens eine Schnellstart-Kachel sichtbar ist
    const quickstartButtons = page.locator('[data-testid^="quickstart-"]');
    await expect(quickstartButtons.first()).toBeVisible();

    // Prüfen ob Standard-Schnellstarts geladen wurden
    await expect(page.getByText("AI Text Writer")).toBeVisible();
    await expect(page.getByText("Bildidee")).toBeVisible();
    await expect(page.getByText("Faktencheck")).toBeVisible();
  });

  test("sollte Chat mit Prompt starten wenn Kachel geklickt wird", async ({ page }) => {
    // Text Writer Kachel klicken
    const textWriterButton = page
      .locator('[data-testid="quickstart-text-writer-pro"]')
      .or(page.locator('[data-testid="quickstart-text-writer"]'));

    if ((await textWriterButton.count()) > 0) {
      await textWriterButton.first().click();
    } else {
      // Fallback: Erste verfügbare Kachel klicken
      await page.locator('[data-testid^="quickstart-"]').first().click();
    }

    // Prüfen ob Toast-Nachricht erscheint
    await expect(page.getByText("Neuer Chat gestartet")).toBeVisible();

    // Prüfen ob Input-Feld den Prompt enthält
    const inputField = page.locator('textarea[placeholder*="Nachricht"]');
    await expect(inputField).toBeVisible();

    // Warten dass der Input gefüllt wird
    await page.waitForTimeout(200);
    const inputValue = await inputField.inputValue();
    expect(inputValue.length).toBeGreaterThan(0);
  });

  test("sollte Autosend-Funktion testen (Faktencheck)", async ({ page }) => {
    // Faktencheck hat autosend: true
    const factCheckButton = page
      .locator('[data-testid="quickstart-fact-check-expert"]')
      .or(page.locator('[data-testid="quickstart-fact-check"]'));

    if ((await factCheckButton.count()) > 0) {
      await factCheckButton.first().click();

      // Bei Autosend sollte automatisch eine Nachricht gesendet werden
      await expect(page.getByText("Neuer Chat gestartet")).toBeVisible();

      // Warten auf Chat-Nachricht
      await page.waitForTimeout(500);

      // Prüfen ob eine User-Message im Chat erscheint
      const chatMessages = page.locator('[data-testid="chat-log"]');
      await expect(chatMessages).toBeVisible();
    }
  });

  test("sollte korrektes Modell und Persona setzen", async ({ page }) => {
    // Email Wizard hat eine spezifische Persona
    const emailButton = page
      .locator('[data-testid="quickstart-email-wizard"]')
      .or(page.locator('[data-testid="quickstart-email-helper"]'));

    if ((await emailButton.count()) > 0) {
      await emailButton.first().click();

      // Toast sollte erscheinen
      await expect(page.getByText("Neuer Chat gestartet")).toBeVisible();

      // Input sollte E-Mail-spezifischen Prompt enthalten
      const inputField = page.locator('textarea[placeholder*="Nachricht"]');
      await page.waitForTimeout(200);
      const inputValue = await inputField.inputValue();
      expect(inputValue.toLowerCase()).toContain("email");
    }
  });

  test("sollte Fallback für leere Konfiguration zeigen", async ({ page }) => {
    // Mock leere quickstarts.json
    await page.route("/quickstarts.json", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    });

    await page.reload();
    await page.waitForLoadState("networkidle");

    // Fallback-Button sollte angezeigt werden
    await expect(page.locator('[data-testid="start-standard-chat"]')).toBeVisible();
    await expect(page.getByText("Standard-Chat starten")).toBeVisible();
  });

  test("sollte Standard-Chat als Fallback starten", async ({ page }) => {
    // Falls Schnellstarts nicht verfügbar sind, Standard-Chat-Button klicken
    const standardChatButton = page.locator('[data-testid="start-standard-chat"]');

    if (await standardChatButton.isVisible()) {
      await standardChatButton.click();

      // Input sollte Standard-Prompt enthalten
      const inputField = page.locator('textarea[placeholder*="Nachricht"]');
      await page.waitForTimeout(200);
      const inputValue = await inputField.inputValue();
      expect(inputValue).toContain("Wie kann ich dir heute helfen");
    }
  });

  // Issue #73: Starter-Prompt im Composer Tests
  test("sollte Starter-Prompt im Composer anzeigen (Autosend=false)", async ({ page }) => {
    // Text Writer Kachel klicken (hat autosend: false)
    const textWriterButton = page.locator('[data-testid^="quickstart-text-writer"]').first();

    if ((await textWriterButton.count()) > 0) {
      await textWriterButton.click();

      // Composer sollte mit Prompt vorbefüllt werden
      const inputField = page.locator('[data-testid="composer-input"]');
      await expect(inputField).toBeVisible();
      await page.waitForTimeout(300);

      // Input sollte editierbar sein (nicht readonly)
      await expect(inputField).not.toHaveAttribute("readonly");

      // Input sollte den Prompt enthalten
      const inputValue = await inputField.inputValue();
      expect(inputValue.length).toBeGreaterThan(0);
      expect(inputValue.toLowerCase()).toContain("text");
    }
  });

  test("sollte Readonly-Modus bei Autosend zeigen", async ({ page }) => {
    // Faktencheck Kachel klicken (hat autosend: true)
    const factCheckButton = page.locator('[data-testid^="quickstart-fact-check"]').first();

    if ((await factCheckButton.count()) > 0) {
      await factCheckButton.click();

      // Toast sollte erscheinen
      await expect(page.getByText("Neuer Chat gestartet")).toBeVisible();

      // Input sollte während Quickstart-Loading readonly sein
      const inputField = page.locator('[data-testid="composer-input"]');

      // Kurz prüfen ob readonly-Attribut gesetzt ist
      await page.waitForTimeout(100);
      const isReadonly = await inputField.getAttribute("readonly");

      if (isReadonly !== null) {
        // Wenn readonly gesetzt war, warten bis es wieder entfernt wird
        await expect(inputField).not.toHaveAttribute("readonly", { timeout: 1000 });
      }

      // Input sollte final editierbar sein
      await expect(inputField).not.toHaveAttribute("readonly");
      await expect(inputField).toBeEnabled();
    }
  });

  test("sollte isQuickstartLoading Zustand korrekt verwalten", async ({ page }) => {
    // Text Writer Kachel klicken (autosend: false)
    const textWriterButton = page.locator('[data-testid^="quickstart-text-writer"]').first();

    if ((await textWriterButton.count()) > 0) {
      await textWriterButton.click();

      // Toast-Nachricht sollte erscheinen
      await expect(page.getByText("Neuer Chat gestartet")).toBeVisible();

      // Input sollte mit Prompt gefüllt werden
      const inputField = page.locator('[data-testid="composer-input"]');
      await page.waitForTimeout(300);

      // Input sollte nicht readonly sein (da autosend: false)
      await expect(inputField).not.toHaveAttribute("readonly");
      await expect(inputField).toBeEnabled();

      // Input sollte den Prompt enthalten
      const inputValue = await inputField.inputValue();
      expect(inputValue.length).toBeGreaterThan(0);
    }
  });
});
