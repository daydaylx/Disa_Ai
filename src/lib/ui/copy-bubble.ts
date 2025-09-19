/**
 * Fügt Copy-UX zu Chat-Bubbles hinzu (Tap/Long-Press und Button).
 * Greift generisch auf .message / [data-message] / .bubble.
 */
const SELECTOR = '.message, [data-message], [data-role="message"], .bubble';

function findBubble(el: Element | null): HTMLElement | null {
  return el && ((el as HTMLElement).closest?.(SELECTOR) as HTMLElement | null);
}

function ensureCopyButton(bubble: HTMLElement) {
  if (bubble.querySelector(".bubble-copy-btn")) return;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "bubble-copy-btn";
  btn.setAttribute("aria-label", "In die Zwischenablage kopieren");
  btn.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
  btn.addEventListener("click", () => copyBubbleText(bubble));
  bubble.appendChild(btn);
}

function bubbleText(bubble: HTMLElement): string {
  // Text ohne „Kopiert“-Toast u.ä.
  const clone = bubble.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".bubble-copy-btn,.bubble-copied").forEach((n) => n.remove());
  return clone.innerText.trim();
}

async function copyBubbleText(bubble: HTMLElement) {
  const text = bubbleText(bubble);
  try {
    await navigator.clipboard.writeText(text);
    showCopied(bubble);
  } catch {
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showCopied(bubble);
    } finally {
      document.body.removeChild(ta);
    }
  }
}

function showCopied(bubble: HTMLElement) {
  const toast = document.createElement("div");
  toast.className = "bubble-copied";
  toast.textContent = "Kopiert";
  bubble.appendChild(toast);
  setTimeout(() => toast.remove(), 1300);
}

export function enhanceMessageCopy() {
  // Initial vorhandene Bubbles ausrüsten
  document.querySelectorAll(SELECTOR).forEach((el) => ensureCopyButton(el as HTMLElement));
  // Event Delegation: Long-Press für Mobile
  let touchTimer: number | null = null;
  let touchTarget: HTMLElement | null = null;

  document.addEventListener(
    "touchstart",
    (e) => {
      const b = findBubble(e.target as Element);
      if (!b) return;
      touchTarget = b;
      b.classList.add("bubble--show-copy");
      touchTimer = window.setTimeout(() => copyBubbleText(b), 550); // Long-Press kopiert
    },
    { passive: true },
  );

  const cancelTouch = () => {
    if (touchTimer) {
      clearTimeout(touchTimer);
      touchTimer = null;
    }
    if (touchTarget) {
      touchTarget.classList.remove("bubble--show-copy");
      touchTarget = null;
    }
  };
  document.addEventListener("touchend", cancelTouch, { passive: true });
  document.addEventListener("touchmove", cancelTouch, { passive: true });
  document.addEventListener("touchcancel", cancelTouch, { passive: true });

  // MutationObserver: spätere Bubbles bekommen Knopf auch
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      m.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return;
        if (n.matches?.(SELECTOR)) ensureCopyButton(n);
        n.querySelectorAll?.(SELECTOR).forEach((el) => ensureCopyButton(el as HTMLElement));
      });
    }
  });
  mo.observe(document.getElementById("root") ?? document.body, { childList: true, subtree: true });
}
