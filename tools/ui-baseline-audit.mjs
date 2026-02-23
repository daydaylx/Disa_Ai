import fs from "node:fs";
import path from "node:path";

import { chromium } from "playwright";

const LIVE_BASE_URL = process.env.LIVE_BASE_URL ?? "https://disaai.de";
const DATE = process.env.UI_BASELINE_DATE ?? new Date().toISOString().slice(0, 10);
const REPORT_DIR =
  process.env.UI_REPORT_DIR ?? path.join("docs", "reports", `ui-after-${DATE}`, "phase-1");

const VIEWPORTS = [
  { width: 360, height: 800, label: "360x800" },
  { width: 390, height: 844, label: "390x844" },
  { width: 412, height: 915, label: "412x915" },
  { width: 430, height: 932, label: "430x932" },
  { width: 768, height: 1024, label: "768x1024" },
];

const ROUTES = ["/chat", "/models", "/roles", "/settings", "/themen", "/feedback"];

const SETTINGS_KEY = "disa-ai-settings";
const LAST_CONVERSATION_KEY = "disa:last-conversation-id";

function screenshotName(route, state, viewportLabel) {
  const r = route.replace(/^\/+|\/+$/g, "") || "home";
  return `${r}__${state}__${viewportLabel}.png`;
}

async function waitForSettled(page, route) {
  const targetUrl = new URL(route, LIVE_BASE_URL).toString();
  const response = await page.goto(targetUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  if (!response || response.status() >= 400) {
    throw new Error(`Navigation failed for ${targetUrl} status=${response?.status()}`);
  }

  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => undefined);
  await page.waitForTimeout(1000);
  await dismissUpdateToasts(page);
}

async function dismissUpdateToasts(page) {
  const closeButtons = page.getByRole("button", {
    name: /Benachrichtigung schließen/i,
  });
  const count = await closeButtons.count().catch(() => 0);
  if (count === 0) return;

  for (let i = 0; i < count; i += 1) {
    const button = closeButtons.nth(i);
    if (await button.isVisible().catch(() => false)) {
      await button.click({ force: true }).catch(() => undefined);
    }
  }

  await page.waitForTimeout(150);
}

async function openDrawer(page) {
  const trigger = page.locator('button[aria-label="Menü öffnen"]').first();
  if (!(await trigger.isVisible().catch(() => false))) return false;

  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Navigationsmenü" });
  await drawer.waitFor({ state: "visible", timeout: 5000 });
  return true;
}

async function closeDrawer(page) {
  const close = page.locator('button[aria-label="Menü schließen"]').first();
  if (await close.isVisible().catch(() => false)) {
    await close.click();
  } else {
    await page.keyboard.press("Escape").catch(() => undefined);
  }
  await page.waitForTimeout(250);
}

async function openHistoryPanel(page) {
  const trigger = page.locator('button[aria-label="Verlauf öffnen"]').first();
  if (!(await trigger.isVisible().catch(() => false))) return false;

  await trigger.click();
  const panel = page.getByRole("dialog").filter({ hasText: "Inhaltsverzeichnis" });
  await panel.waitFor({ state: "visible", timeout: 5000 });
  return true;
}

async function closeHistoryPanel(page) {
  await page.mouse.click(8, 8);
  await page.waitForTimeout(250);
}

async function focusComposer(page) {
  const input = page.getByTestId("composer-input");
  if (!(await input.isVisible().catch(() => false))) return false;
  await dismissUpdateToasts(page);
  await input.click({ timeout: 10_000 }).catch(async () => {
    await dismissUpdateToasts(page);
    await input.click({ force: true, timeout: 10_000 });
  });
  await input.fill("Keyboard Fokus Test");
  await page.waitForTimeout(250);
  return true;
}

async function seedLongChatConversation(page) {
  const now = Date.now();
  const id = `qa-audit-${now}`;
  const createdAt = new Date(now - 120_000).toISOString();
  const updatedAt = new Date(now).toISOString();
  const messages = Array.from({ length: 120 }).map((_, index) => ({
    id: `qa-audit-msg-${index}`,
    role: index % 2 === 0 ? "user" : "assistant",
    content:
      index % 2 === 0
        ? `Lange Historie Nachricht ${index} mit zusätzlichem Inhalt.`
        : `Assistenzantwort ${index} mit zusätzlichem Inhalt.`,
    timestamp: new Date(now - (120 - index) * 30_000).toISOString(),
    model: "openai/gpt-4o-mini",
  }));

  await page.evaluate(
    async ({ settingsKey, lastConversationKey, id, createdAt, updatedAt, messages }) => {
      const parse = (value) => {
        if (!value) return {};
        try {
          return JSON.parse(value);
        } catch {
          return {};
        }
      };

      const currentSettings = parse(localStorage.getItem(settingsKey));
      localStorage.setItem(
        settingsKey,
        JSON.stringify({
          ...currentSettings,
          hasCompletedOnboarding: true,
          enableAnalytics: false,
          showNSFWContent: false,
        }),
      );
      localStorage.setItem(lastConversationKey, id);

      await new Promise((resolve, reject) => {
        const req = indexedDB.open("DisaAI");
        req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
        req.onsuccess = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains("conversations") || !db.objectStoreNames.contains("metadata")) {
            db.close();
            reject(new Error("IndexedDB stores missing"));
            return;
          }

          const tx = db.transaction(["conversations", "metadata"], "readwrite");
          tx.objectStore("conversations").put({
            id,
            title: "QA Audit Long History",
            createdAt,
            updatedAt,
            model: "openai/gpt-4o-mini",
            messageCount: messages.length,
            messages,
          });
          tx.objectStore("metadata").put({
            id,
            title: "QA Audit Long History",
            createdAt,
            updatedAt,
            model: "openai/gpt-4o-mini",
            messageCount: messages.length,
          });
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
    { settingsKey: SETTINGS_KEY, lastConversationKey: LAST_CONVERSATION_KEY, id, createdAt, updatedAt, messages },
  );
}

async function forceScrollableState(page) {
  await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll("*")).filter((element) => {
      const el = /** @type {HTMLElement} */ (element);
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      return (
        (overflowY === "auto" || overflowY === "scroll") &&
        el.scrollHeight > el.clientHeight + 30 &&
        el.clientHeight > 100
      );
    });

    candidates.sort((a, b) => b.clientHeight - a.clientHeight);
    const target = /** @type {HTMLElement | undefined} */ (candidates[0]);
    if (!target) return;

    const max = target.scrollHeight - target.clientHeight;
    target.scrollTop = Math.min(max, Math.max(280, Math.floor(max * 0.6)));
  });
  await page.waitForTimeout(250);
}

async function collectIssues(page, route, state, viewportLabel) {
  return page.evaluate(
    ({ route, state, viewportLabel }) => {
      const issues = [];

      const isVisible = (element) => {
        if (!element) return false;
        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) {
          return false;
        }
        const r = element.getBoundingClientRect();
        return r.width > 1 && r.height > 1;
      };

      const box = (element) => {
        if (!isVisible(element)) return null;
        const r = element.getBoundingClientRect();
        return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
      };

      const overlaps = (a, b) =>
        !!a && !!b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

      const navElement = document.querySelector('[data-testid="mobile-bottom-nav"]');
      const nav = box(navElement);
      const composerInput = document.querySelector('[data-testid="composer-input"]');
      const composer = box(
        composerInput?.closest("div.pointer-events-auto") ||
          composerInput?.parentElement?.parentElement ||
          composerInput,
      );
      const fab = box(
        document.querySelector(
          'button[aria-label="Zum Ende scrollen"], button[aria-label*="neue Nachrichten"]',
        ),
      );
      const drawer = box(document.querySelector('[role="dialog"][aria-label="Navigationsmenü"]'));

      const screenshot = `${route.replace(/^\//, "") || "home"}__${state}__${viewportLabel}.png`;

      if (navElement && isVisible(navElement)) {
        issues.push({
          screenshot,
          type: "Deprecated UI",
          component: "MobileBottomNav",
          cause: "Bottom Navigation ist sichtbar, obwohl sie vollständig entfernt sein muss",
          severity: "S1",
        });
      }

      if (composer && nav && composer.bottom > nav.top + 2) {
        issues.push({
          screenshot,
          type: "Overlap",
          component: "Composer + MobileBottomNav",
          cause: `Composer-Bottom ${Math.round(composer.bottom)} > Nav-Top ${Math.round(nav.top)}`,
          severity: "S1",
        });
      }

      if (fab && nav && overlaps(fab, nav)) {
        issues.push({
          screenshot,
          type: "Layering",
          component: "ScrollToBottom + MobileBottomNav",
          cause: "FAB überlappt Bottom-Navigation",
          severity: "S2",
        });
      }

      if (fab && composer && overlaps(fab, composer)) {
        issues.push({
          screenshot,
          type: "Layering",
          component: "ScrollToBottom + Composer",
          cause: "FAB kollidiert mit Composer",
          severity: "S2",
        });
      }

      if (drawer && nav && overlaps(drawer, nav)) {
        issues.push({
          screenshot,
          type: "Layering",
          component: "AppMenuDrawer + MobileBottomNav",
          cause: "Drawer überlappt sichtbare BottomNav",
          severity: "S2",
        });
      }

      const root = document.scrollingElement || document.documentElement;
      const rootScrollable = root.scrollHeight > root.clientHeight + 5;
      const innerScrollables = Array.from(document.querySelectorAll("*")).filter((el) => {
        if (!isVisible(el)) return false;
        const style = window.getComputedStyle(el);
        return (
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          el.scrollHeight > el.clientHeight + 5 &&
          el.clientHeight > 80
        );
      });

      if (rootScrollable && innerScrollables.length > 0) {
        issues.push({
          screenshot,
          type: "Double Scrollbar",
          component: "Body/Root + Inner Scroll Container",
          cause: `Root + ${innerScrollables.length} innere Scrollcontainer`,
          severity: "S2",
        });
      }

      if (innerScrollables.length >= 3) {
        issues.push({
          screenshot,
          type: "Überladung",
          component: "Mehrere Scroll-Container",
          cause: `${innerScrollables.length} Scrollcontainer sichtbar`,
          severity: "S3",
        });
      }

      if (route === "/feedback" && nav) {
        const textarea = box(document.querySelector("#feedback-message"));
        if (textarea && textarea.bottom > nav.top + 4) {
          issues.push({
            screenshot,
            type: "Clipping",
            component: "Feedback textarea + MobileBottomNav",
            cause: "Textarea ragt in BottomNav-Bereich",
            severity: "S2",
          });
        }
      }

      return issues;
    },
    { route, state, viewportLabel },
  );
}

async function run() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ locale: "de-DE", timezoneId: "Europe/Berlin" });
  const page = await context.newPage();

  await page.addInitScript(() => {
    const parse = (value) => {
      if (!value) return {};
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    };

    const current = parse(localStorage.getItem("disa-ai-settings"));
    localStorage.setItem(
      "disa-ai-settings",
      JSON.stringify({
        ...current,
        hasCompletedOnboarding: true,
        enableAnalytics: false,
        showNSFWContent: false,
      }),
    );

    // Avoid persistent SW update toast blocking pointer events during audits.
    sessionStorage.setItem("disa-pwa-update-shown", "true");
  });

  /** @type {Array<{screenshot:string,type:string,component:string,cause:string,severity:string}>} */
  const collected = [];

  try {
    for (const viewport of VIEWPORTS) {
      const isControlViewport = viewport.label === "768x1024";
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const route of ROUTES) {
        await waitForSettled(page, route);
        collected.push(...(await collectIssues(page, route, "default", viewport.label)));

        if (await openDrawer(page)) {
          collected.push(...(await collectIssues(page, route, "drawer-open", viewport.label)));
          await closeDrawer(page);
        }

        if (route === "/chat") {
          if (!isControlViewport && (await openHistoryPanel(page))) {
            collected.push(...(await collectIssues(page, route, "history-open", viewport.label)));
            await closeHistoryPanel(page);
          }

          if (await focusComposer(page)) {
            collected.push(...(await collectIssues(page, route, "keyboard-focus", viewport.label)));
          }

          if (!isControlViewport) {
            await seedLongChatConversation(page);
            await waitForSettled(page, route);
            const chatLog = page.locator('div[role="log"][aria-label="Chat messages"]');
            await chatLog.evaluate((el) => {
              el.scrollTop = 0;
            });
            await page.waitForTimeout(250);
            collected.push(...(await collectIssues(page, route, "long-history-scrollfab", viewport.label)));
          }
        }

        if (!isControlViewport && route === "/models") {
          await forceScrollableState(page);
          collected.push(...(await collectIssues(page, route, "long-list-scroll", viewport.label)));
        }

        if (!isControlViewport && route === "/roles") {
          await forceScrollableState(page);
          collected.push(...(await collectIssues(page, route, "long-list-scroll", viewport.label)));
        }
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }

  const dedup = [];
  const seen = new Set();
  for (const issue of collected) {
    const key = [issue.screenshot, issue.type, issue.component, issue.cause, issue.severity].join("|");
    if (!seen.has(key)) {
      seen.add(key);
      dedup.push(issue);
    }
  }

  fs.writeFileSync(
    path.join(REPORT_DIR, "ui-signals.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        total: dedup.length,
        issues: dedup,
      },
      null,
      2,
    ),
  );

  console.log(`ui-signals.json written (${dedup.length} issues)`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
