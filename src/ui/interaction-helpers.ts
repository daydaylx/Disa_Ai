(function () {
  function intoView(el: HTMLElement) {
    try {
      el.scrollIntoView({ block: "nearest" });
    } catch (_e) {
      void _e;
      /* ignore */
    }
  }
  document.addEventListener(
    "focusin",
    (e) => {
      const ta = (e.target as HTMLElement | null)?.closest(
        '[data-testid="composer-input"]',
      ) as HTMLElement | null;
      if (ta) intoView(ta);
    },
    { capture: true },
  );

  document.addEventListener(
    "mousedown",
    (e) => {
      const btn = (e.target as HTMLElement | null)?.closest(
        '[data-testid="composer-send"],[data-testid="composer-stop"]',
      ) as HTMLElement | null;
      if (btn) intoView(btn);
    },
    { capture: true },
  );
})();
export {};
