import * as React from "react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "../../../lib/cn";
import { Icon } from "../Icon";
import type { ToastItem, ToastKind } from "./ToastTypes";

interface ToastsContextValue {
  push: (t: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastsContext = createContext<ToastsContextValue | null>(null);

export function useToasts() {
  const ctx = useContext(ToastsContext);
  if (!ctx) throw new Error("useToasts must be used within <ToastsProvider />");
  return ctx;
}

const KIND_TO_ICON: Record<ToastKind, React.ReactNode> = {
  info: <Icon name="info" />,
  success: <Icon name="success" />,
  warning: <Icon name="warning" />,
  error: <Icon name="error" />,
};

export const ToastsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const portalRef = useRef<HTMLElement | null>(null);

  const ensurePortal = () => {
    if (portalRef.current) return portalRef.current;
    const el = document.createElement("div");
    el.setAttribute("id", "toasts-portal");
    document.body.appendChild(el);
    portalRef.current = el;
    return el;
  };

  const dismiss = useCallback((id: string) => {
    setItems((list) => list.filter((i) => i.id !== id));
  }, []);

  const push = useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = crypto.randomUUID();
      const item: ToastItem = { id, durationMs: 5000, ...t };
      setItems((list) => [item, ...list]);
      if (item.durationMs && item.durationMs > 0) {
        window.setTimeout(() => dismiss(id), item.durationMs);
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo<ToastsContextValue>(() => ({ push, dismiss }), [push, dismiss]);

  // Global Toast-Bus: erlaubt Toaster außerhalb von React (z.B. SW-Update-Hinweis)
  React.useEffect(() => {
    const onToast = (ev: Event) => {
      try {
        const ce = ev as CustomEvent<Omit<ToastItem, "id">>;
        if (ce?.detail && typeof ce.detail === "object") {
          push(ce.detail);
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("disa:toast", onToast);
    return () => window.removeEventListener("disa:toast", onToast);
  }, [push]);

  return (
    <ToastsContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 p-3">
          {items.map((t) => (
            <div
              key={t.id}
              role="status"
              className={cn(
                "border-border-strong bg-surface-1 text-text-strong pointer-events-auto flex w-[min(96vw,640px)] items-start gap-3 rounded-lg border p-3 shadow-level",
                "tap-target",
              )}
            >
              <div className="mt-0.5">{KIND_TO_ICON[t.kind]}</div>
              <div className="flex-1">
                {t.title ? <div className="font-semibold leading-snug">{t.title}</div> : null}
                {t.message ? (
                  <div className="text-text-muted text-sm leading-snug">{t.message}</div>
                ) : null}
                {t.action ? (
                  <button
                    type="button"
                    className="tap-target text-brand hover:bg-brand/10 focus-visible:ring-brand-weak focus-visible:ring-offset-surface-1 mt-2 inline-flex items-center justify-center rounded-base border border-transparent px-3 py-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    onClick={t.action.onClick}
                  >
                    {t.action.label}
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Schließen"
                className="tap-target text-text-muted hover:bg-surface-2 hover:text-text-strong focus-visible:ring-brand-weak focus-visible:ring-offset-surface-1 ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={() => dismiss(t.id)}
              >
                <Icon name="close" />
              </button>
            </div>
          ))}
        </div>,
        ensurePortal(),
      )}
    </ToastsContext.Provider>
  );
};
