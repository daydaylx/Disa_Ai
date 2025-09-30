import { expect, test } from "@playwright/test";

test.describe("App Loading Tests - Issue #75", () => {
  test.beforeEach(async ({ page }) => {
    // Capture console errors and warnings
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`Console error: ${msg.text()}`);
      }
      if (msg.type() === "warning") {
        console.warn(`Console warning: ${msg.text()}`);
      }
    });
  });

  test("sollte App erfolgreich vom Root-Pfad laden", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // App sollte erfolgreich mounten, nicht bei "Wird geladen..." hängen bleiben
    await expect(page.getByText("Wird geladen...")).not.toBeVisible({ timeout: 5000 });

    // Prüfe ob die tatsächliche App geladen wurde
    await expect(page.locator('[data-testid="chat-log"]')).toBeVisible({ timeout: 10000 });

    // Prüfe ob Schnellstart-Kacheln oder Standard-Chat-Button sichtbar sind
    const hasQuickstarts = await page.locator('[data-testid^="quickstart-"]').count();
    const hasStandardChat = await page.locator('[data-testid="start-standard-chat"]').count();

    expect(hasQuickstarts + hasStandardChat).toBeGreaterThan(0);
  });

  test("sollte App erfolgreich nach Reload laden", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Prüfe dass App initial lädt
    await expect(page.locator('[data-testid="chat-log"]')).toBeVisible({ timeout: 10000 });

    // Page Reload durchführen
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Nach Reload sollte App wieder normal funktionieren
    await expect(page.getByText("Wird geladen...")).not.toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="chat-log"]')).toBeVisible({ timeout: 10000 });
  });

  test("sollte Deep-Links (/chat) korrekt laden", async ({ page }) => {
    await page.goto("/chat");
    await page.waitForLoadState("networkidle");

    // Sollte nicht bei "Wird geladen..." hängen bleiben
    await expect(page.getByText("Wird geladen...")).not.toBeVisible({ timeout: 5000 });

    // Chat-Interface sollte sichtbar sein
    await expect(page.locator('[data-testid="chat-log"]')).toBeVisible({ timeout: 10000 });

    // URL sollte korrekt sein
    expect(page.url()).toMatch(/\/chat$/);
  });

  test("sollte Deep-Links (/models) korrekt laden", async ({ page }) => {
    await page.goto("/models");
    await page.waitForLoadState("networkidle");

    // Sollte nicht bei "Wird geladen..." hängen bleiben
    await expect(page.getByText("Wird geladen...")).not.toBeVisible({ timeout: 5000 });

    // Modelle-Interface sollte sichtbar sein (oder wird zu /chat umgeleitet)
    const url = page.url();
    if (url.includes("/models")) {
      // Falls Models-Page existiert, prüfe spezifischen Content
      await expect(page.getByText("Modelle")).toBeVisible({ timeout: 10000 });
    } else {
      // Falls redirect zu /chat, prüfe Chat-Interface
      await expect(page.locator('[data-testid="chat-log"]')).toBeVisible({ timeout: 10000 });
    }
  });

  test("sollte keine CSP-Errors in der Konsole haben", async ({ page }) => {
    const errors = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Warte etwas mehr um alle möglichen CSP-Fehler zu sammeln
    await page.waitForTimeout(2000);

    // Filtere CSP-spezifische Fehler
    const cspErrors = errors.filter(
      (error) =>
        error.toLowerCase().includes("content security policy") ||
        error.toLowerCase().includes("csp") ||
        error.toLowerCase().includes("refused to"),
    );

    expect(cspErrors).toHaveLength(0);
  });

  test("sollte JavaScript-Dateien korrekt laden (keine 404s)", async ({ page }) => {
    const failedRequests = [];

    page.on("response", (response) => {
      const url = response.url();
      const status = response.status();

      // Prüfe JavaScript- und CSS-Dateien
      if ((url.includes(".js") || url.includes(".css")) && status >= 400) {
        failedRequests.push({ url, status });
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Keine fehlgeschlagenen Asset-Requests
    expect(failedRequests).toHaveLength(0);
  });

  test("sollte korrekte MIME-Types für Assets verwenden", async ({ page }) => {
    const wrongMimeTypes = [];

    page.on("response", (response) => {
      const url = response.url();
      const contentType = response.headers()["content-type"] || "";

      // Prüfe JavaScript-Dateien
      if (
        url.endsWith(".js") &&
        !contentType.includes("javascript") &&
        !contentType.includes("module")
      ) {
        wrongMimeTypes.push({ url, contentType });
      }

      // Prüfe CSS-Dateien
      if (url.endsWith(".css") && !contentType.includes("css")) {
        wrongMimeTypes.push({ url, contentType });
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Alle Assets sollten korrekte MIME-Types haben
    expect(wrongMimeTypes).toHaveLength(0);
  });

  test("sollte App innerhalb angemessener Zeit laden", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // App sollte binnen 10 Sekunden vollständig geladen sein
    await expect(page.locator('[data-testid="chat-log"]')).toBeVisible({ timeout: 10000 });

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000); // Maximal 10 Sekunden

    console.log(`App loaded in ${loadTime}ms`);
  });
});
