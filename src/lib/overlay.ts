const OVERLAY_ROOT_ID = "app-overlay-root";

type ScrollLockState = {
  count: number;
  overflow: string;
  overscrollBehavior: string;
  touchAction: string;
};

const scrollLocks = new WeakMap<HTMLElement, ScrollLockState>();

function resolveActiveScrollOwner(): HTMLElement {
  const activeOwner = document.querySelector<HTMLElement>('[data-scroll-owner="active"]');
  return activeOwner ?? document.documentElement;
}

function lockElementScroll(target: HTMLElement): () => void {
  const existing = scrollLocks.get(target);

  if (existing) {
    existing.count += 1;
    scrollLocks.set(target, existing);
    return () => unlockElementScroll(target);
  }

  const state: ScrollLockState = {
    count: 1,
    overflow: target.style.overflow,
    overscrollBehavior: target.style.overscrollBehavior,
    touchAction: target.style.touchAction,
  };

  scrollLocks.set(target, state);
  target.style.overflow = "hidden";
  target.style.overscrollBehavior = "none";
  target.style.touchAction = "none";

  return () => unlockElementScroll(target);
}

function unlockElementScroll(target: HTMLElement): void {
  const state = scrollLocks.get(target);
  if (!state) return;

  state.count -= 1;

  if (state.count > 0) {
    scrollLocks.set(target, state);
    return;
  }

  target.style.overflow = state.overflow;
  target.style.overscrollBehavior = state.overscrollBehavior;
  target.style.touchAction = state.touchAction;
  scrollLocks.delete(target);
}

export function getOverlayRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.getElementById(OVERLAY_ROOT_ID);
}

export function lockActiveScrollOwner(): () => void {
  if (typeof document === "undefined") return () => {};
  return lockElementScroll(resolveActiveScrollOwner());
}
