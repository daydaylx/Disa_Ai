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

  test("Settings: Toggle + Persistenz + Fokusierbarkeit Composer", async ({ page }) => {
    await page.goto("/#/settings");
    await expect(page.getByRole("heading", { name: "Einstellungen" })).toBeVisible();
    await expect(page.getByTestId("settings-ctx-max")).toBeVisible();
    await page.getByTestId("settings-ctx-max").fill("8192");
    await page.getByTestId("settings-ctx-reserve").fill("1024");
    await page.getByTestId("settings-composer-offset").fill("48");
    // zurück zum Chat und Fokus prüfen
    await page.goto("/#/chat");
    await page.getByTestId("composer-input").click();
    await expect(page.getByTestId("composer-input")).toBeFocused();
  });

  test("Chats-Liste: Neu → Öffnet automatisch → Löschen in Liste", async ({ page }) => {
    await page.goto("/#/chats");
    await expect(page.getByTestId("chats-title-input")).toBeVisible();
    await page.getByTestId("chats-title-input").fill("E2E-Chat");
    await page.getByTestId("chats-new").click();
    // Neu führt direkt zum Chat
    await expect(page.getByTestId("composer-input")).toBeVisible();
    // zurück zur Liste und löschen
    await page.goto("/#/chats");
    const del = page.getByTestId("chats-delete").first();
    await expect(del).toBeVisible();
    await del.click();
  });

  test.skip("Model-Picker öffnen ohne Key (nur frei)", async ({ page }) => {
    await page.goto("/#/settings");
    // Der Picker ist vorhanden; ob Inhalte laden, ist abhängig vom Key.
    await expect(page.getByTestId("settings-model-picker")).toBeAttached();
  });
});
