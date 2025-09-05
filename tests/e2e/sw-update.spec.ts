import { test, expect } from "@playwright/test";

test("SW-Update-Toast via global Toast-Bus erscheint und ist klickbar", async ({ page }) => {
  await page.goto("/");

  // Stubbe reload, damit Klick überprüfbar ist
  await page.addInitScript(() => {
    (window as any).__reloaded = 0;
    const orig = window.location.reload.bind(window.location);
    // @ts-ignore
    window.location.reload = () => { (window as any).__reloaded++; };
    (window as any).__origReload = orig;
  });

  // Stelle sicher, dass der Toast-Portal im DOM existiert (muss nicht sichtbar sein)
  await page.locator('#toasts-portal').waitFor({ state: 'attached' });

  // Dispatch globaler Toast
  await page.evaluate(() => {
    const ev = new CustomEvent("disa:toast", {
      detail: {
        kind: "info",
        title: "Update verfügbar",
        message: "Eine neue Version ist bereit.",
        action: {
          label: "Neu laden",
          onClick: () => { (window as any).__reloaded = ((window as any).__reloaded || 0) + 1; }
        }
      }
    });
    window.dispatchEvent(ev);
  });

  await expect(page.getByText("Update verfügbar")).toBeVisible();
  await page.getByRole("button", { name: "Neu laden" }).click();

  const reloaded = await page.evaluate(() => (window as any).__reloaded || 0);
  expect(reloaded).toBeGreaterThan(0);
});
