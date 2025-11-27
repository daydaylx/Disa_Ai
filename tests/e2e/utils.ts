import { type Page } from "@playwright/test";

export async function skipOnboarding(page: Page) {
  await page.addInitScript(() => {
    // Setze existierende Settings oder erstelle neue
    const existing = localStorage.getItem("disa-ai-settings");
    let settings = {};
    try {
      settings = existing ? JSON.parse(existing) : {};
    } catch {
      // ignore error
    }

    localStorage.setItem(
      "disa-ai-settings",
      JSON.stringify({
        ...settings,
        hasCompletedOnboarding: true,
        // Optional: Weitere Defaults für stabile Tests
        showNSFWContent: false,
        enableAnalytics: false,
      }),
    );
  });
}
