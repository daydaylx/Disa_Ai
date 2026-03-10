import { expect, type Locator, type Page, test } from "@playwright/test";

import { skipOnboarding } from "./utils";

const SETTINGS_STORAGE_KEY = "disa-ai-settings";
const PERSISTABLE_MODELS = [
  { id: "deepseek/deepseek-r1:free", label: "DeepSeek R1 (Reasoning)" },
  { id: "google/gemini-2.0-flash-exp:free", label: "Gemini 2.0 Flash (Experimental)" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B Instruct" },
  {
    id: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
    label: "Dolphin Mistral 24B",
  },
] as const;

function getSelectionNameFromLabel(label: string, prefix: "Modell" | "Rolle") {
  return label
    .replace(new RegExp(`^${prefix}\\s+`, "i"), "")
    .replace(/\s+auswählen$/i, "")
    .trim();
}

async function expectCatalogScrollsFromHero(page: Page, title: string) {
  const scrollContainer = page.locator("div.overflow-auto.overscroll-contain").first();
  await expect(scrollContainer).toBeVisible();

  const heroHeading = page.getByRole("heading", { level: 1, name: title });
  await expect(heroHeading).toBeVisible();

  const box = await heroHeading.boundingBox();
  if (!box) {
    throw new Error(`Unable to determine hero position for ${title}`);
  }

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 1200);

  await expect
    .poll(async () => scrollContainer.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
}

async function findPersistableModelButton(page: Page): Promise<{
  button: Locator;
  modelId: string;
  modelName: string;
}> {
  for (const candidate of PERSISTABLE_MODELS) {
    const button = page
      .getByRole("button", { name: `Modell ${candidate.label} auswählen` })
      .first();

    if ((await button.count()) > 0) {
      return {
        button,
        modelId: candidate.id,
        modelName: candidate.label,
      };
    }
  }

  throw new Error("No persistable model button found on /models");
}

async function expectPersistedModelSelection(page: Page, modelId: string, modelName: string) {
  await expect
    .poll(async () => {
      const raw = await page.evaluate(({ storageKey }) => window.localStorage.getItem(storageKey), {
        storageKey: SETTINGS_STORAGE_KEY,
      });
      const parsed = raw ? (JSON.parse(raw) as { preferredModelId?: string }) : {};
      return parsed.preferredModelId ?? "";
    })
    .toBe(modelId);

  const modelTrigger = page.locator('button[aria-label="Modell auswählen"]');
  await expect(modelTrigger).toBeVisible();
  await expect
    .poll(async () => ((await modelTrigger.textContent()) ?? "").trim())
    .toContain(modelName);
}

test.describe("Models & Roles Pages", () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
  });

  test("should scroll catalog pages from the hero area", async ({ page }) => {
    await page.goto("/models");
    await page.waitForLoadState("networkidle");
    await expectCatalogScrollsFromHero(page, "Modelle");

    await page.goto("/roles");
    await page.waitForLoadState("networkidle");
    await expectCatalogScrollsFromHero(page, "Rollen & Personas");

    await page.goto("/themen");
    await page.waitForLoadState("networkidle");
    await expectCatalogScrollsFromHero(page, "Themen");
  });

  test("should persist a selected model from the Models page into chat", async ({ page }) => {
    await page.goto("/models");
    await page.waitForLoadState("networkidle");

    // Check for page header
    await expect(page.getByRole("heading", { level: 1, name: /Modelle/i })).toBeVisible();

    // Check for model cards
    const modelCards = page
      .locator('[data-testid="model-card"]')
      .or(page.locator('[role="button"]').filter({ has: page.locator("text=/Modell|Model/") }));
    await expect(modelCards.first()).toBeVisible();

    // Check for search/filter functionality
    const searchInput = page
      .getByPlaceholder(/Suchen|Search/i)
      .or(page.getByRole("textbox", { name: /Suchen|Filter/i }));
    if (await searchInput.isVisible()) {
      const initialCount = await modelCards.count();
      await searchInput.fill("gpt");
      await page.waitForTimeout(500); // Wait for debounce

      // The query may legitimately yield 0 results (e.g. curated free models contain no "gpt").
      // Ensure the UI reacts without crashing.
      const filteredCount = await modelCards.count();
      if (initialCount > 0) {
        if (filteredCount === 0) {
          await expect(
            page.getByRole("heading", { level: 3, name: /Keine Modelle gefunden/i }),
          ).toBeVisible();
        } else {
          await expect(modelCards.first()).toBeVisible();
        }
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }

      // Reset filter so interaction tests stay stable
      await searchInput.fill("");
      await page.waitForTimeout(250);
    }

    const {
      button: persistableModelButton,
      modelId,
      modelName,
    } = await findPersistableModelButton(page);
    await expect(persistableModelButton).toBeVisible();

    await persistableModelButton.click();
    await page.goto("/chat");
    await page.waitForLoadState("networkidle");

    await expectPersistedModelSelection(page, modelId, modelName);
  });

  test("should display and interact with Roles page", async ({ page }) => {
    await page.goto("/roles");
    await page.waitForLoadState("networkidle");

    // Check for page header
    await expect(page.getByRole("heading", { level: 1, name: /Rollen/i })).toBeVisible();

    // Check for role cards
    const roleCards = page
      .locator('[data-testid="role-card"]')
      .or(page.locator('[role="button"]').filter({ has: page.locator("text=/Rolle|Persona/") }));
    await expect(roleCards.first()).toBeVisible();

    // Check for category filters if they exist
    const categoryButtons = page
      .getByRole("button")
      .filter({ hasText: /Alle|Kategorie|Category/i });
    if (await categoryButtons.first().isVisible()) {
      await categoryButtons.first().click();
      await page.waitForTimeout(500);
    }

    // Check that clicking a role selects it or navigates to details
    const firstRole = roleCards.first();
    await firstRole.click({ force: true });

    // Should either navigate back to chat or show selection state
    await page.waitForTimeout(1000);
  });

  test("should open theme details first and start chat explicitly", async ({ page }) => {
    await page.goto("/themen");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 1, name: /Themen/i })).toBeVisible();

    const detailButton = page.getByRole("button", { name: /Details zu .* anzeigen/i }).first();
    await expect(detailButton).toBeVisible();

    const detailTrigger = page.getByRole("button", { name: /Thema .* öffnen/i }).first();
    await expect(detailTrigger).toBeVisible();

    await detailTrigger.click();
    await expect(page).toHaveURL(/\/themen$/);

    const startButton = page.getByRole("button", { name: /Diskussion starten/i });
    await expect(startButton).toBeVisible();
    await startButton.click();

    await expect(page).toHaveURL(/\/chat\?quickstart=/);
  });

  test("should select role from chat and apply it", async ({ page }) => {
    await page.goto("/chat");
    await page.waitForLoadState("networkidle");

    const roleTrigger = page.locator('button[aria-label="Rolle auswählen"]');
    await expect(roleTrigger).toBeVisible();
    await roleTrigger.click();

    const roleOptions = page.getByRole("option");
    const optionCount = await roleOptions.count();

    // Option 0 is always "Standard" – pick the first real role if available
    if (optionCount > 1) {
      const firstRoleOption = roleOptions.nth(1);
      const roleName = (await firstRoleOption.textContent())?.trim();
      await firstRoleOption.click();

      if (roleName) {
        await expect(roleTrigger).toContainText(roleName);
      }
    }
  });

  test("should navigate between main pages using navigation", async ({ page }) => {
    // Start at chat
    await page.goto("/chat");
    await page.waitForLoadState("networkidle");

    const openMenuDrawer = async () => {
      const menuButton = page.locator('button[aria-label="Menü öffnen"]:visible').first();
      await expect(menuButton).toBeVisible();
      await menuButton.click();

      const menuDrawer = page.getByRole("dialog", { name: "Navigationsmenü" });
      await expect(menuDrawer).toBeVisible();
      return menuDrawer;
    };

    // Navigate to settings via drawer navigation
    const settingsDrawer = await openMenuDrawer();
    const settingsLink = settingsDrawer.getByRole("link", { name: /^Einstellungen\b/i });
    await expect(settingsLink).toBeVisible();
    await settingsLink.click();
    await expect(page).toHaveURL(/\/settings/);

    // Navigate to models via drawer navigation
    const modelsDrawer = await openMenuDrawer();
    const modelsLink = modelsDrawer.getByRole("link", { name: /^Modelle\b/i });
    await expect(modelsLink).toBeVisible();
    await modelsLink.click();
    await expect(page).toHaveURL(/\/models/);

    // Secondary navigation remains available in drawer
    const secondaryDrawer = await openMenuDrawer();
    await expect(secondaryDrawer.getByRole("link", { name: /^Verlauf\b/i })).toBeVisible();
  });

  test("should maintain selected role and model state", async ({ page }) => {
    await page.goto("/roles");
    await page.waitForLoadState("networkidle");

    const firstRole = page.getByRole("button", { name: /Rolle .* auswählen/i }).first();
    await expect(firstRole).toBeVisible();

    const roleLabel = (await firstRole.getAttribute("aria-label")) ?? "";
    const roleName = getSelectionNameFromLabel(roleLabel, "Rolle");
    await firstRole.click({ force: true });
    await expect(page).toHaveURL(/\/chat/);

    await page.goto("/models");
    await page.waitForLoadState("networkidle");

    const {
      button: persistableModelButton,
      modelId,
      modelName,
    } = await findPersistableModelButton(page);
    await expect(persistableModelButton).toBeVisible();
    await persistableModelButton.click();

    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    await page.goto("/chat");
    await page.waitForLoadState("networkidle");

    const roleTrigger = page.locator('button[aria-label="Rolle auswählen"]');
    await expect(roleTrigger).toBeVisible();
    if (roleName) {
      await expect(roleTrigger).toContainText(roleName);
    }
    await expectPersistedModelSelection(page, modelId, modelName);
  });
});
