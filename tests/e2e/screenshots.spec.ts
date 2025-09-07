import { test, expect } from "@playwright/test";
import fs from "node:fs";

test.describe("UI Screenshots (mobil)", () => {
  test.beforeAll(async () => {
    fs.mkdirSync("docs/screenshots", { recursive: true });
  });

  test("Chat", async ({ page }, testInfo) => {
    await page.goto("/#/chat");
    await expect(page.getByTestId("composer-input")).toBeVisible();
    const name = `docs/screenshots/chat-${testInfo.project.name}.png`;
    await page.screenshot({ path: name, fullPage: true });
  });

  test("Settings", async ({ page }, testInfo) => {
    await page.goto("/#/settings");
    await expect(page.getByRole("heading", { name: "Einstellungen" })).toBeVisible();
    const name = `docs/screenshots/settings-${testInfo.project.name}.png`;
    await page.screenshot({ path: name, fullPage: true });
  });

  test("Chats", async ({ page }, testInfo) => {
    await page.goto("/#/chats");
    await expect(page.getByTestId("chats-title-input")).toBeVisible();
    const name = `docs/screenshots/chats-${testInfo.project.name}.png`;
    await page.screenshot({ path: name, fullPage: true });
  });

  test("Quickstart", async ({ page }, testInfo) => {
    await page.goto("/#/quickstart");
    await expect(page.getByRole("heading", { name: "Quickstart" })).toBeVisible();
    const name = `docs/screenshots/quickstart-${testInfo.project.name}.png`;
    await page.screenshot({ path: name, fullPage: true });
  });
});

