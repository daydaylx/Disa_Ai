import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { setupApiMocking } from "./global-setup";

const FIXED_NOW = 1_714_099_200_000; // 2024-04-25T00:00:00Z

test.beforeEach(async ({ page }) => {
  await setupApiMocking(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript((now) => {
    const fixedNow = now;
    const originalNow = Date.now;
    Date.now = () => fixedNow;
    // Keep a reference in case code relies on performance.now()
    const perf = window.performance;
    if (perf && perf.now) {
      const start = originalNow();
      const base = perf.now();
      perf.now = () => base + (fixedNow - start);
    }
  }, FIXED_NOW);
});

test("model picker empty state", async ({ page }) => {
  await page.goto("/models");
  await page.waitForTimeout(100);
  await expect(page).toHaveScreenshot("model-picker-empty.png", { fullPage: true, threshold: 0.1 });
});

const seedConversation = async (
  page: Page,
  data: {
    id: string;
    messages: { id: string; role: "assistant" | "user"; content: string }[];
    title?: string;
  },
) => {
  await page.addInitScript(
    ({ id, messages, title, timestamp }) => {
      const base = timestamp;
      const stored = messages.map((msg, index) => ({
        id: msg.id,
        createdAt: base + index,
        role: msg.role,
        content: msg.content,
      }));
      const meta = {
        id,
        title: title ?? "E2E Snapshot",
        createdAt: base,
        updatedAt: base + messages.length,
      };
      localStorage.setItem(`disa:conv:${id}:msgs`, JSON.stringify(stored));
      localStorage.setItem(`disa:conv:${id}:meta`, JSON.stringify(meta));
    },
    { ...data, timestamp: FIXED_NOW },
  );
};

test("running chat snapshot", async ({ page }) => {
  const convo = {
    id: "visual-running",
    messages: [
      { id: "user-1", role: "user", content: "Hey Disa, hast du Tipps für bessere Prompts?" },
      {
        id: "assistant-1",
        role: "assistant",
        content:
          "Natürlich! Starte mit Ziel + Kontext, grenze die Antwort ein (Format, Länge) und gib Beispiele.",
      },
    ],
  } as const;
  await seedConversation(page, convo);

  await page.goto(`/`);
  const log = page.locator('[aria-label="Chat messages"]');
  await log.waitFor();
  await page.waitForTimeout(150);

  await expect(page).toHaveScreenshot("chat-running.png", {
    fullPage: true,
    threshold: 0.1,
    mask: [page.locator(".chat-bubble__meta")],
  });
});

test("code block snapshot", async ({ page }) => {
  const convo = {
    id: "visual-code",
    messages: [
      {
        id: "assistant-code",
        role: "assistant",
        content:
          "Hier ein Beispiel:\n```ts\nexport const sum = (a: number, b: number) => a + b;\n```",
      },
    ],
  } as const;
  await seedConversation(page, convo);

  await page.goto(`/`);
  const log = page.locator('[aria-label="Chat messages"]');
  await log.waitFor();
  await page.waitForTimeout(150);

  await expect(log).toHaveScreenshot("chat-code.png", {
    threshold: 0.1,
    mask: [log.locator(".chat-bubble__meta")],
  });
});

test.skip("composer error snapshot", async ({ page }) => {
  // Skipped temporarily - the send button needs model to be available
  await page.addInitScript(() => {
    localStorage.setItem("disa:openrouter:key", "test-key");
  });

  await page.route("https://**", (route) => route.abort());
  await page.goto("/");
  const input = page.locator('[data-testid="composer-input"]');
  await input.waitFor();
  await input.fill("Bitte löse eine quadratische Gleichung.");
  await page.click('[data-testid="composer-send"]');
  const alert = page.locator("#composer-error");
  await alert.waitFor();
  await expect(page).toHaveScreenshot("chat-error.png", {
    fullPage: true,
    threshold: 0.1,
    mask: [page.locator(".chat-bubble__meta")],
  });
});

test("settings overview snapshot", async ({ page }) => {
  await page.goto("/settings");
  await page.waitForTimeout(100);
  await expect(page).toHaveScreenshot("settings-dark.png", { fullPage: true, threshold: 0.1 });
});

test("settings forced-light snapshot", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/settings");
  await page.waitForTimeout(100);
  await expect(page).toHaveScreenshot("settings-light.png", { fullPage: true, threshold: 0.1 });
});
