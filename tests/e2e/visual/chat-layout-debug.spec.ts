import { expect, test } from "@playwright/test";

import { skipOnboarding } from "../utils";

type LayoutSnapshot = {
  viewport: { width: number; height: number };
  composerInput?: { x: number; y: number; width: number; height: number };
  sendButton?: { x: number; y: number; width: number; height: number };
  scrollLog?: { x: number; y: number; width: number; height: number };
  potentialFrameElements: Array<{
    selector: string;
    rect: { x: number; y: number; width: number; height: number };
    styles: { border: string; outline: string; boxShadow: string };
  }>;
};

test.describe("Chat Layout Debug (visual)", () => {
  test("captures layout + potential frame sources", async ({ page, browserName }) => {
    const tag = process.env.LAYOUT_TAG ?? "current";
    await skipOnboarding(page);
    await page.goto("/chat");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByTestId("composer-input")).toBeVisible();

    const viewports = [
      { name: "iphone-15", width: 390, height: 844 },
      { name: "android-small", width: 360, height: 740 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(250);

      const snapshot: LayoutSnapshot = await page.evaluate(() => {
        const vp = { width: window.innerWidth, height: window.innerHeight };

        const pick = (el: Element | null) => {
          if (!el) return undefined;
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        };

        const composerInput = pick(document.querySelector('[data-testid="composer-input"]'));
        const sendButton = pick(document.querySelector('button[aria-label="Senden"]'));
        const scrollLog =
          pick(document.querySelector('[role="log"][aria-label="Chat messages"]')) ??
          pick(document.querySelector('[data-testid="message-list"]'));

        // Heuristic: elements that touch viewport edges and might draw a “frame”
        const candidates: LayoutSnapshot["potentialFrameElements"] = [];
        const all = Array.from(document.querySelectorAll<HTMLElement>("body *"));

        for (const el of all) {
          const r = el.getBoundingClientRect();
          if (r.width < vp.width * 0.85 || r.height < vp.height * 0.7) continue;

          const touchesEdge =
            Math.abs(r.left) <= 1 ||
            Math.abs(r.top) <= 1 ||
            Math.abs(vp.width - r.right) <= 1 ||
            Math.abs(vp.height - r.bottom) <= 1;
          if (!touchesEdge) continue;

          const cs = getComputedStyle(el);
          const hasBorder =
            (parseFloat(cs.borderTopWidth) || 0) > 0 ||
            (parseFloat(cs.borderRightWidth) || 0) > 0 ||
            (parseFloat(cs.borderBottomWidth) || 0) > 0 ||
            (parseFloat(cs.borderLeftWidth) || 0) > 0;
          const hasOutline = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
          const hasShadow = cs.boxShadow !== "none";

          if (!hasBorder && !hasOutline && !hasShadow) continue;

          // Build a compact selector for debugging
          const selector = el.id
            ? `#${el.id}`
            : el.getAttribute("data-testid")
              ? `[data-testid="${el.getAttribute("data-testid")}"]`
              : el.classList.length
                ? `${el.tagName.toLowerCase()}.${Array.from(el.classList).slice(0, 3).join(".")}`
                : el.tagName.toLowerCase();

          candidates.push({
            selector,
            rect: { x: r.x, y: r.y, width: r.width, height: r.height },
            styles: {
              border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
              outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
              boxShadow: cs.boxShadow,
            },
          });

          if (candidates.length >= 12) break;
        }

        return {
          viewport: vp,
          composerInput,
          sendButton,
          scrollLog,
          potentialFrameElements: candidates,
        };
      });

      // Basic sanity: send button should be inside viewport bounds and not clipped
      if (snapshot.sendButton) {
        expect(snapshot.sendButton.x).toBeGreaterThanOrEqual(0);
        expect(snapshot.sendButton.y).toBeGreaterThanOrEqual(0);
        expect(snapshot.sendButton.x + snapshot.sendButton.width).toBeLessThanOrEqual(vp.width + 1);
        expect(snapshot.sendButton.y + snapshot.sendButton.height).toBeLessThanOrEqual(
          vp.height + 1,
        );
      }

      // Store a screenshot + JSON snapshot for before/after comparison
      await page.screenshot({
        path: `report/visual/chat-layout-${tag}-${vp.name}-${browserName}.png`,
        fullPage: true,
      });
      console.log(`[chat-layout-debug] ${vp.name}`, JSON.stringify(snapshot, null, 2));

      // Simulate “keyboard open” by shrinking viewport and focusing input.
      await page.getByTestId("composer-input").focus();
      await page.setViewportSize({ width: vp.width, height: Math.max(520, vp.height - 280) });
      await page.waitForTimeout(250);
      await page.screenshot({
        path: `report/visual/chat-layout-${tag}-${vp.name}-${browserName}-keyboard-sim.png`,
        fullPage: true,
      });
    }
  });
});
