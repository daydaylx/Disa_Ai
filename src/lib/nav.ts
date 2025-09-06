/* eslint-disable no-undef */
export type AppTab = "chat" | "settings" | "home";

const EVT = "app:navigate";

export function navigate(tab: AppTab) {
  window.dispatchEvent(new CustomEvent(EVT, { detail: { tab } }));
}

export function subscribeNav(setter: (tab: AppTab) => void) {
  const fn = (e: Event) => {
    const ce = e as CustomEvent<{ tab: AppTab }>;
    if (ce?.detail?.tab) setter(ce.detail.tab);
  };
  window.addEventListener(EVT, fn as EventListener);
  return () => window.removeEventListener(EVT, fn as EventListener);
}
