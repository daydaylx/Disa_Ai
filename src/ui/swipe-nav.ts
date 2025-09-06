/* Lightweight Swipe Navigation between top-level views
 * Left/Right swipe switches: Chat ↔ Chats ↔ Quickstart ↔ Settings
 * - Ignores when starting on interactive elements (inputs, buttons, links)
 * - Only triggers on mostly-horizontal, brisk swipes
 */
(() => {
  let startX = 0;
  let startY = 0;
  let startT = 0;
  let startEl: EventTarget | null = null;

  function isInteractive(el: Element | null): boolean {
    if (!el) return false;
    return Boolean(
      el.closest(
        'input, textarea, select, button, a, [contenteditable], [data-no-swipe], [role="button"]',
      ),
    );
  }

  function currentIndex(): number {
    const h = (location.hash || '#').toLowerCase();
    const order = ['#/chat', '#/chats', '#/quickstart', '#/settings'];
    const idx = order.findIndex((p) => h.startsWith(p));
    return idx >= 0 ? idx : 0;
  }

  function goToIndex(i: number) {
    const order = ['#/chat', '#/chats', '#/quickstart', '#/settings'];
    const clamped = Math.max(0, Math.min(order.length - 1, i));
    const target = order[clamped];
    if (location.hash !== target) location.hash = target;
  }

  window.addEventListener(
    'touchstart',
    (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const t = e.changedTouches[0];
      startX = t.clientX;
      startY = t.clientY;
      startT = Date.now();
      startEl = e.target;
    },
    { passive: true },
  );

  window.addEventListener(
    'touchend',
    (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      // Ignore swipes from inputs/buttons etc.
      if (isInteractive((startEl as Element) ?? null)) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dt = Date.now() - startT;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      // Heuristics: mostly horizontal, sufficiently long, reasonably quick
      const H_THRESH = 40; // kürzerer Swipe reicht
      const V_RATIO = 1.3; // etwas toleranter bei Vertikalanteil
      const MAX_DT = 600;  // schnellerer Wisch nötig
      if (absX < H_THRESH || absX < absY * V_RATIO || dt > MAX_DT) return;
      const idx = currentIndex();
      if (dx < 0) goToIndex(idx + 1);
      else if (dx > 0) goToIndex(idx - 1);
    },
    { passive: true },
  );
})();

export {};
