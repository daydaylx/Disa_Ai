/* eslint-disable no-empty */
(function initGuards(){
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const apply = () => {
    try {
      // TODO: echte Layout-Fixes rein, derzeit bewusst no-op
    } catch (_e) {}
  };

  apply();

  // MutationObserver – sicher und aufräumen
  try {
    const mo = new MutationObserver(() => apply());
    mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
    window.addEventListener('beforeunload', () => { try { mo.disconnect(); } catch (_e) {} });
  } catch (_e) {}

  // ResizeObserver wenn da, sonst Fallback mit window-Handle (hart typisiert)
  try {
    if ('ResizeObserver' in window) {
      const ro = new (window as any).ResizeObserver(() => apply());
      if (document.body) ro.observe(document.body);
      window.addEventListener('beforeunload', () => { try { ro.disconnect(); } catch (_e) {} });
    } else {
      const w = window as unknown as Window & typeof globalThis;
      const onr = () => apply();
      w.addEventListener('resize', onr, { passive: true } as any);
      w.addEventListener('beforeunload', () => { try { w.removeEventListener('resize', onr as any); } catch (_e) {} });
    }
  } catch (_e) {}
})();
export {};
