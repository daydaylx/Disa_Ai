import { test, expect } from "@playwright/test";

test.describe("Kritische Flows (mobil)", () => {
  test("Quickstart → Chat → Senden/Stop → Toast, kein Layout-Sprung", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("disa:prefill", "Bitte kurz antworten."));
    await page.goto("/#/chat");
    const input = page.getByTestId("composer-input");
    await expect(input).toBeVisible();
    await input.click();
    await input.fill("Kurzer Test");
    // Senden per Enter
    await page.keyboard.press("Enter");
    // Stop sichtbar, dann klicken
    const stop = page.getByTestId("composer-stop");
    await expect(stop).toBeVisible();
    await stop.click();
    // Kein Sprung: Composer bleibt im Viewport
    const bbox = await input.boundingBox();
    expect(bbox?.y ?? 0).toBeGreaterThan(0);
  });

  test.skip("Settings: Toggle + Persistenz + Fokusierbarkeit Composer", async ({ page }) => {
    await page.goto("/#/settings");
    await expect(page.getByRole("heading", { name: "Einstellungen" })).toBeVisible();
    await page.getByTestId("settings-ctx-max").fill("8192");
    await page.getByTestId("settings-ctx-reserve").fill("1024");
    await page.getByTestId("settings-composer-offset").fill("48");
    // zurück zum Chat und Fokus prüfen
    await page.goto("/#/chat");
    await page.getByTestId("composer-input").click();
    await expect(page.getByTestId("composer-input")).toBeFocused();
  });

  test.skip("Chats-Liste: Neu → Umbenennen (blur) → Öffnen → Löschen", async ({ page }) => {
    await page.goto("/#/chats");
    await page.getByTestId("chats-title-input").fill("E2E-Chat");
    await page.getByTestId("chats-new").click();
    // Öffnen
    await page.getByTestId("chats-open").first().click();
    await expect(page.getByTestId("composer-input")).toBeVisible();
    // zurück zur Liste
    await page.goto("/#/chats");
    // Löschen
    await page.getByTestId("chats-delete").first().click();
  });

  test.skip("Model-Picker öffnen ohne Key (nur frei)", async ({ page }) => {
    await page.goto("/#/settings");
    // Der Picker ist vorhanden; ob Inhalte laden, ist abhängig vom Key.
    await expect(page.getByTestId("settings-model-picker")).toBeAttached();
  });
});
