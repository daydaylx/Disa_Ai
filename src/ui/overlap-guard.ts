// Deaktiviert Tabbar-Pointer, wenn sie Send/Stop überlappt.
(function () {
  function rect(el: Element | null) {
    return el ? (el as HTMLElement).getBoundingClientRect() : null;
  }
  function intersects(a: DOMRect, b: DOMRect) {
    return !(b.right <= a.left || b.left >= a.right || b.bottom <= a.top || b.top >= a.bottom);
  }
  function setAllPointer(el: HTMLElement, value: string | null) {
    const nodes: HTMLElement[] = [el, ...(Array.from(el.children) as HTMLElement[])];
    nodes.forEach((n) => {
      if (value === null) n.style.removeProperty("pointer-events");
      else n.style.setProperty("pointer-events", value, "important"); // override !important aus CSS
    });
  }
  function update() {
    const bar = document.querySelector('nav[aria-label="Main Navigation"]') as HTMLElement | null;
    if (!bar) return;
    const send = document.querySelector('[data-testid="composer-send"]') as HTMLElement | null;
    const stop = document.querySelector('[data-testid="composer-stop"]') as HTMLElement | null;
    const target = stop || send;
    if (!target) {
      setAllPointer(bar, null);
      return;
    }
    const br = rect(bar);
    const tr = rect(target);
    if (!br || !tr) {
      setAllPointer(bar, null);
      return;
    }
    const overlap = intersects(br, tr);
    if (overlap) setAllPointer(bar, "none");
    else setAllPointer(bar, null);
  }

  ["resize", "scroll"].forEach((ev) => window.addEventListener(ev, update, { passive: true }));
  window.addEventListener("load", update);
  const mo = new MutationObserver(update);
  mo.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "class"],
  });
  setInterval(update, 600); // Sicherheitsnetz
})();
export {};
