// Keyboard/Safe-Area Handling für iOS/Android (visualViewport)
(function () {
  if (typeof window === "undefined" || !("visualViewport" in window)) return;
  const vv = window.visualViewport as VisualViewport;

  function apply() {
    try {
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      document.documentElement.style.setProperty("--kb", kb > 0 ? `${kb}px` : "0px");
      document.body.classList.toggle("kb-open", kb > 0);
    } catch {
      /* ignore */
    }
  }

  ["resize", "scroll"].forEach((ev) => vv.addEventListener(ev, apply));
  window.addEventListener("orientationchange", () => setTimeout(apply, 150));
  apply();
})();
export {};
