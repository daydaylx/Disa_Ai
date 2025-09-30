import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Models und Einstellungen", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("Modelle: Oberfläche mit Suche, Filtern und Persona-Auswahl", async ({ page }) => {
    await page.getByTestId("nav.models").click();
    await expect(page).toHaveURL("/models");

    await expect(page.getByRole("heading", { name: "Modelle & Rollen" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Rolle/ })).toBeVisible();
    await expect(page.getByPlaceholder("Modell oder Anbieter suchen...")).toBeVisible();
    await expect(page.getByRole("button", { name: "Kostenlos" })).toBeVisible();

    const axe = new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa"]);
    const results = await axe.analyze();
    expect(results.violations).toEqual([]);
  });

  test("Modelle: Filter und Suche reagieren", async ({ page }) => {
    await page.getByTestId("nav.models").click();

    await page.getByRole("button", { name: "Kostenlos" }).click();
    await expect(page.getByRole("button", { name: "Kostenlos" })).toHaveClass(/bg-accent-500/);
    await page.getByRole("button", { name: "Kostenlos" }).click();

    await page.getByPlaceholder("Modell oder Anbieter suchen...").fill("deepseek");
    await page.waitForTimeout(500);

    const matchingCard = page
      .getByTestId("model-card")
      .filter({ hasText: /deepseek/i })
      .first();
    const fallbackText = page.getByText("Keine Modelle gefunden.");
    const hasMatches = await matchingCard.count();

    if (hasMatches > 0) {
      await expect(matchingCard).toBeVisible();
    } else {
      await expect(fallbackText).toBeVisible();
    }
  });

  test("Modelle: Modell auswählen zeigt Bestätigung", async ({ page }) => {
    await page.getByTestId("nav.models").click();
    const cards = page.getByTestId("model-card");
    const cardCount = await cards.count();

    if (cardCount > 0) {
      await cards.first().click();
      await expect(page.getByText("Modell gewählt")).toBeVisible({ timeout: 5000 });
    } else {
      await expect(page.getByText("Keine Modelle gefunden.")).toBeVisible();
    }
  });

  test("Einstellungen: API-Schlüssel speichern", async ({ page }) => {
    await page.getByTestId("nav.settings").click();
    await expect(page).toHaveURL("/settings");

    await expect(page.getByRole("heading", { name: "Einstellungen" })).toBeVisible();
    await page.fill("#apiKey", "sk-or-test-12345");
    await page.getByRole("button", { name: "Schlüssel speichern" }).click();
    await expect(page.getByText("Schlüssel gespeichert")).toBeVisible({ timeout: 5000 });
  });

  test("Navigation funktioniert zwischen den Hauptseiten", async ({ page }) => {
    await page.getByTestId("nav.models").click();
    await expect(page).toHaveURL("/models");

    await page.getByTestId("nav.settings").click();
    await expect(page).toHaveURL("/settings");

    await page.getByTestId("nav.chat").click();
    await expect(page).toHaveURL("/chat");
  });
});
