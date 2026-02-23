import fs from "node:fs";
import path from "node:path";

import { expect, type Page, test } from "@playwright/test";

const IS_LIVE = process.env.PLAYWRIGHT_LIVE === "1";
const LIVE_BASE_URL = process.env.LIVE_BASE_URL ?? "https://disaai.de";
const TODAY = process.env.UI_BASELINE_DATE ?? new Date().toISOString().slice(0, 10);
const REPORT_DIR =
  process.env.UI_REPORT_DIR ?? path.join("docs", "reports", `ui-after-${TODAY}`, "phase-1");

const VIEWPORTS = [
  { width: 360, height: 800, label: "360x800" },
  { width: 390, height: 844, label: "390x844" },
  { width: 412, height: 915, label: "412x915" },
  { width: 430, height: 932, label: "430x932" },
  // Optional control point
  { width: 768, height: 1024, label: "768x1024" },
];

const ROUTES = ["/chat", "/models", "/roles", "/settings", "/themen", "/feedback"];

const SETTINGS_KEY = "disa-ai-settings";
const LAST_CONVERSATION_KEY = "disa:last-conversation-id";

function routeLabel(route: string): string {
  const normalized = route.replace(/^\/+|\/+$/g, "");
  return normalized || "home";
}

async function waitForSettled(page: Page, route: string) {
  const targetUrl = new URL(route, LIVE_BASE_URL).toString();
  const response = await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  expect(response, `Keine Antwort für ${targetUrl}`).not.toBeNull();
  expect(response?.status(), `Unerwarteter Status für ${targetUrl}`).toBeLessThan(400);
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
  await page.waitForTimeout(1200);

  await dismissUpdateToasts(page);
}

async function dismissUpdateToasts(page: Page) {
  const updateToastCloseButtons = page.getByRole("button", {
    name: /Benachrichtigung schließen/i,
  });
  const closeCount = await updateToastCloseButtons.count().catch(() => 0);

  if (closeCount === 0) {
    return;
  }

  for (let i = 0; i < closeCount; i += 1) {
    const closeButton = updateToastCloseButtons.nth(i);
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click({ force: true }).catch(() => undefined);
    }
  }

  await page.waitForTimeout(150);
}

async function saveShot(page: Page, route: string, state: string, viewport: string) {
  const fileName = `${routeLabel(route)}__${state}__${viewport}.png`;
  const filePath = path.join(REPORT_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage: false });
}

async function openDrawer(page: Page): Promise<boolean> {
  const trigger = page.locator('button[aria-label="Menü öffnen"]').first();
  if (!(await trigger.isVisible().catch(() => false))) {
    return false;
  }

  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Navigationsmenü" });
  await expect(drawer).toBeVisible({ timeout: 5000 });
  return true;
}

async function closeDrawer(page: Page) {
  const close = page.locator('button[aria-label="Menü schließen"]').first();
  if (await close.isVisible().catch(() => false)) {
    await close.click();
  } else {
    await page.keyboard.press("Escape").catch(() => undefined);
  }
  await page.waitForTimeout(250);
}

async function openHistoryPanel(page: Page): Promise<boolean> {
  const trigger = page.locator('button[aria-label="Verlauf öffnen"]').first();
  if (!(await trigger.isVisible().catch(() => false))) {
    return false;
  }

  await trigger.click();
  const panel = page.getByRole("dialog").filter({ hasText: "Inhaltsverzeichnis" });
  await expect(panel).toBeVisible({ timeout: 5000 });
  return true;
}

async function closeHistoryPanel(page: Page) {
  // Klick in den Backdrop-Bereich
  await page.mouse.click(8, 8);
  await page.waitForTimeout(300);
}

async function focusComposer(page: Page) {
  const input = page.getByTestId("composer-input");
  await expect(input).toBeVisible({ timeout: 10_000 });
  await dismissUpdateToasts(page);
  await input.click({ timeout: 10_000 }).catch(async () => {
    await dismissUpdateToasts(page);
    await input.click({ force: true, timeout: 10_000 });
  });
  await input.fill("Keyboard Fokus Test");
  await page.waitForTimeout(300);
}

async function seedLongChatConversation(page: Page) {
  const now = Date.now();
  const conversationId = `qa-baseline-${now}`;
  const createdAt = new Date(now - 2 * 60_000).toISOString();
  const updatedAt = new Date(now).toISOString();

  const messages = Array.from({ length: 120 }).map((_, index) => {
    const isUser = index % 2 === 0;
    return {
      id: `qa-msg-${index}`,
      role: isUser ? "user" : "assistant",
      content: isUser
        ? `Lange Historie Nachricht ${index} – Nutzertext mit etwas mehr Inhalt für Scrollhöhe.`
        : `Assistenzantwort ${index} – ebenfalls länger, damit die Liste sicher scrollbar wird.`,
      timestamp: new Date(now - (120 - index) * 30_000).toISOString(),
      model: "openai/gpt-4o-mini",
    };
  });

  await page.evaluate(
    async ({
      settingsKey,
      lastConversationKey,
      conversation,
      metadata,
    }: {
      settingsKey: string;
      lastConversationKey: string;
      conversation: {
        id: string;
        title: string;
        createdAt: string;
        updatedAt: string;
        model: string;
        messageCount: number;
        messages: Array<{
          id: string;
          role: string;
          content: string;
          timestamp: string;
          model: string;
        }>;
      };
      metadata: {
        id: string;
        title: string;
        createdAt: string;
        updatedAt: string;
        model: string;
        messageCount: number;
      };
    }) => {
      const safeParse = (value: string | null): Record<string, unknown> => {
        if (!value) return {};
        try {
          return JSON.parse(value) as Record<string, unknown>;
        } catch {
          return {};
        }
      };

      const currentSettings = safeParse(localStorage.getItem(settingsKey));
      localStorage.setItem(
        settingsKey,
        JSON.stringify({
          ...currentSettings,
          hasCompletedOnboarding: true,
          enableAnalytics: false,
        }),
      );
      localStorage.setItem(lastConversationKey, conversation.id);

      await new Promise<void>((resolve, reject) => {
        const openRequest = indexedDB.open("DisaAI");

        openRequest.onerror = () => {
          reject(openRequest.error ?? new Error("IndexedDB open failed"));
        };

        openRequest.onsuccess = () => {
          const db = openRequest.result;
          if (
            !db.objectStoreNames.contains("conversations") ||
            !db.objectStoreNames.contains("metadata")
          ) {
            db.close();
            reject(new Error("Expected IndexedDB stores conversations/metadata are missing"));
            return;
          }

          const tx = db.transaction(["conversations", "metadata"], "readwrite");
          tx.objectStore("conversations").put(conversation);
          tx.objectStore("metadata").put(metadata);

          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => {
            db.close();
            reject(tx.error ?? new Error("IndexedDB write failed"));
          };
        };
      });
    },
    {
      settingsKey: SETTINGS_KEY,
      lastConversationKey: LAST_CONVERSATION_KEY,
      conversation: {
        id: conversationId,
        title: "QA Baseline Long History",
        createdAt,
        updatedAt,
        model: "openai/gpt-4o-mini",
        messageCount: messages.length,
        messages,
      },
      metadata: {
        id: conversationId,
        title: "QA Baseline Long History",
        createdAt,
        updatedAt,
        model: "openai/gpt-4o-mini",
        messageCount: messages.length,
      },
    },
  );
}

async function forceScrollableState(page: Page) {
  await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>("*"))
      .filter((el) => {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        return (
          (overflowY === "auto" || overflowY === "scroll") &&
          el.scrollHeight > el.clientHeight + 30 &&
          el.clientHeight > 120
        );
      })
      .sort((a, b) => b.clientHeight - a.clientHeight);

    const target = candidates[0];
    if (target) {
      const maxScrollTop = target.scrollHeight - target.clientHeight;
      target.scrollTop = Math.min(maxScrollTop, Math.max(300, Math.floor(maxScrollTop * 0.55)));
    }
  });
  await page.waitForTimeout(350);
}

test.skip(!IS_LIVE, "Setze PLAYWRIGHT_LIVE=1 für den Live-Baseline-Lauf.");

test.describe.configure({ mode: "serial" });

test.describe("Live UI Baseline (mobile-first)", () => {
  test.beforeAll(() => {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const safeParse = (value: string | null): Record<string, unknown> => {
        if (!value) return {};
        try {
          return JSON.parse(value) as Record<string, unknown>;
        } catch {
          return {};
        }
      };

      const currentSettings = safeParse(localStorage.getItem("disa-ai-settings"));
      localStorage.setItem(
        "disa-ai-settings",
        JSON.stringify({
          ...currentSettings,
          hasCompletedOnboarding: true,
          enableAnalytics: false,
          showNSFWContent: false,
        }),
      );

      // Prevent persistent SW update toast from blocking pointer interactions in baseline runs.
      sessionStorage.setItem("disa-pwa-update-shown", "true");
    });
  });

  for (const viewport of VIEWPORTS) {
    test.describe(`Viewport ${viewport.label}`, () => {
      for (const route of ROUTES) {
        test(`Route ${route}`, async ({ page }) => {
          test.setTimeout(180_000);
          const isControlViewport = viewport.label === "768x1024";

          await page.setViewportSize({ width: viewport.width, height: viewport.height });

          await waitForSettled(page, route);
          await saveShot(page, route, "default", viewport.label);

          if (await openDrawer(page)) {
            await saveShot(page, route, "drawer-open", viewport.label);
            await closeDrawer(page);
          }

          if (route === "/chat") {
            if (!isControlViewport && (await openHistoryPanel(page))) {
              await saveShot(page, route, "history-open", viewport.label);
              await closeHistoryPanel(page);
            }

            await focusComposer(page);
            await saveShot(page, route, "keyboard-focus", viewport.label);

            if (!isControlViewport) {
              await seedLongChatConversation(page);
              await waitForSettled(page, route);

              const chatLog = page.locator('div[role="log"][aria-label="Chat messages"]');
              await expect(chatLog).toBeVisible({ timeout: 10_000 });
              await chatLog.evaluate((el) => {
                el.scrollTop = 0;
              });
              await page.waitForTimeout(500);

              const scrollFab = page
                .locator('button[aria-label="Zum Ende scrollen"]')
                .or(page.locator('button[aria-label*="neue Nachrichten"]'));
              await expect(scrollFab.first()).toBeVisible({ timeout: 10_000 });
              await saveShot(page, route, "long-history-scrollfab", viewport.label);
            }
          }

          if (!isControlViewport && route === "/models") {
            const cards = page.getByTestId("model-card");
            const count = await cards.count();
            if (count > 0) {
              await cards.nth(Math.min(10, count - 1)).scrollIntoViewIfNeeded();
            }
            await forceScrollableState(page);
            await saveShot(page, route, "long-list-scroll", viewport.label);
          }

          if (!isControlViewport && route === "/roles") {
            const cards = page.getByTestId("role-card");
            const count = await cards.count();
            if (count > 0) {
              await cards.nth(Math.min(10, count - 1)).scrollIntoViewIfNeeded();
            }
            await forceScrollableState(page);
            await saveShot(page, route, "long-list-scroll", viewport.label);
          }
        });
      }
    });
  }
});
