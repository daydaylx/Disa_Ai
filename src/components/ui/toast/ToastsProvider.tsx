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
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-[var(--space-stack-sm)] p-[var(--space-inline-md)]">
          {items.map((t) => (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex w-[min(96vw,640px)] items-start gap-[var(--space-inline-md)] rounded-[var(--radius-lg)] border border-border-strong bg-overlay-toast p-[var(--space-md)] text-overlay-toast-fg shadow-popover",
              )}
            >
              <div className="mt-0.5">{KIND_TO_ICON[t.kind]}</div>
              <div className="flex-1">
                {t.title ? (
                  <div className="text-body font-semibold leading-snug">{t.title}</div>
                ) : null}
                {t.message ? (
                  <div className="text-body leading-snug text-text-secondary">{t.message}</div>
                ) : null}
                {t.action ? (
                  <button
                    type="button"
                    className="mt-[var(--space-2xs)] inline-flex items-center justify-center rounded-[var(--radius-md)] border border-transparent px-[var(--space-inline-md)] py-[var(--space-3xs)] text-body-sm font-medium text-action-ghost hover:bg-action-ghost-hover focus-visible:shadow-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-border-focus)]"
                    onClick={t.action.onClick}
                  >
                    {t.action.label}
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Schließen"
                className="ml-[var(--space-inline-sm)] inline-flex size-[var(--size-touch-compact)] items-center justify-center rounded-[var(--radius-md)] text-text-tertiary transition-[background,color] duration-small ease-standard hover:bg-action-ghost-hover hover:text-text-primary focus-visible:shadow-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-border-focus)]"
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
