(function () {
  function intoView(el: HTMLElement) {
    try {
      el.scrollIntoView({ block: "nearest" });
    } catch (_e) {
      void _e;
      /* ignore */
    }
  }

  // Enhanced keyboard and touch handling
  function ensureTouchTargetSize(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      element.style.minWidth = "44px";
      element.style.minHeight = "44px";
    }
  }

  // Focus handling for keyboard navigation
  document.addEventListener(
    "focusin",
    (e) => {
      const ta = (e.target as HTMLElement | null)?.closest(
        '[data-testid="composer-input"]',
      ) as HTMLElement | null;
      if (ta) {
        intoView(ta);
        // Ensure input is properly positioned on mobile
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            ta.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 300); // Wait for virtual keyboard
        }
      }
    },
    { capture: true },
  );

  // Enhanced mouse/touch handling
  document.addEventListener(
    "mousedown",
    (e) => {
      const btn = (e.target as HTMLElement | null)?.closest(
        '[data-testid="composer-send"],[data-testid="composer-stop"]',
      ) as HTMLElement | null;
      if (btn) {
        intoView(btn);
        ensureTouchTargetSize(btn);
      }
    },
    { capture: true },
  );

  // Touch-specific optimizations
  document.addEventListener(
    "touchstart",
    (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Ensure touch targets are properly sized
      const interactive = target.closest('button, [role="button"], a, input, select, textarea');
      if (interactive instanceof HTMLElement) {
        ensureTouchTargetSize(interactive);
      }

      // Handle composer interactions
      const composer = target.closest(
        '[data-testid="composer-send"],[data-testid="composer-stop"]',
      );
      if (composer instanceof HTMLElement) {
        intoView(composer);
        e.preventDefault(); // Prevent 300ms delay
      }
    },
    { passive: false, capture: true },
  );

  // Prevent double-tap zoom on specific elements
  document.addEventListener(
    "touchend",
    (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const preventZoom = target.closest(
        'button, [role="button"], input, select, textarea, [data-no-zoom]',
      );
      if (preventZoom) {
        e.preventDefault();
      }
    },
    { passive: false, capture: true },
  );

  // Handle viewport changes (virtual keyboard)
  let initialViewportHeight = window.visualViewport?.height || window.innerHeight;

  function handleViewportChange() {
    const currentHeight = window.visualViewport?.height || window.innerHeight;
    const heightDiff = initialViewportHeight - currentHeight;

    // Virtual keyboard likely opened if height decreased significantly
    if (heightDiff > 150) {
      document.documentElement.style.setProperty("--keyboard-height", `${heightDiff}px`);
      document.body.classList.add("keyboard-open");
    } else {
      document.documentElement.style.removeProperty("--keyboard-height");
      document.body.classList.remove("keyboard-open");
    }
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", handleViewportChange);
  } else {
    window.addEventListener("resize", handleViewportChange);
  }

  // Update initial height on orientation change
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    }, 100);
  });
})();
export {};
