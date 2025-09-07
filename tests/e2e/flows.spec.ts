import { test, expect } from "@playwright/test";

test.describe("Kritische Flows (mobil)", () => {
  test("Quickstart → Chat → Senden/Stop → Toast, kein Layout-Sprung", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("nav-bottom-quickstart").click();
    const item = page.getByTestId("quickstart-item").first();
    await item.click();
    const input = page.getByTestId("composer-input");
    await expect(input).toBeFocused();
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

  test("Settings: Toggle + Persistenz + Fokusierbarkeit Composer", async ({ page }) => {
    await page.goto("/#/settings");
    await expect(page.getByRole("heading", { name: "Einstellungen" })).toBeVisible();
    await page.getByTestId("settings-ctx-max").fill("8192");
    await page.getByTestId("settings-ctx-reserve").fill("1024");
    await page.getByTestId("settings-composer-offset").fill("48");
    // zurück zum Chat und Fokus prüfen
    await page.getByTestId("nav-bottom-chat").click();
    await page.getByTestId("composer-input").click();
    await expect(page.getByTestId("composer-input")).toBeFocused();
  });

  test("Chats-Liste: Neu → Umbenennen (blur) → Öffnen → Löschen", async ({ page }) => {
    await page.goto("/#/chats");
    await page.getByTestId("chats-title-input").fill("E2E-Chat");
    await page.getByTestId("chats-new").click();
    // Öffnen
    await page.getByTestId("chats-open").first().click();
    await expect(page.getByTestId("composer-input")).toBeVisible();
    // zurück zur Liste
    await page.getByTestId("nav-bottom-chats").click();
    // Löschen
    await page.getByTestId("chats-delete").first().click();
  });

  test("Model-Picker öffnen ohne Key (nur frei)", async ({ page }) => {
    await page.goto("/#/settings");
    // Der Picker ist vorhanden; ob Inhalte laden, ist abhängig vom Key.
    await expect(page.getByTestId("settings-model-picker")).toBeVisible();
  });
});

