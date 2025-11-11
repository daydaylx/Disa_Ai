import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type ToastKind = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  kind: ToastKind;
  title?: string;
  message?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastsContextType {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => void;
  remove: (id: string) => void;
}

const ToastsContext = createContext<ToastsContextType | undefined>(undefined);

export function ToastsProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { ...toast, id };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove after duration
      const duration = toast.duration ?? 5000;
      if (duration > 0) {
        setTimeout(() => {
          remove(id);
        }, duration);
      }
    },
    [remove],
  );

  return (
    <ToastsContext.Provider value={{ toasts, push, remove }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={remove} />
    </ToastsContext.Provider>
  );
}

export function useToasts() {
  const context = useContext(ToastsContext);
  if (!context) {
    throw new Error("useToasts must be used within ToastsProvider");
  }
  return context;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    let node = document.getElementById("toast-root");
    let created = false;
    if (!node) {
      node = document.createElement("div");
      node.id = "toast-root";
      document.body.appendChild(node);
      created = true;
    }
    setPortalNode(node);

    return () => {
      if (created && node?.parentNode) {
        node.parentNode.removeChild(node);
      }
    };
  }, []);

  const kindClasses = useMemo(
    () => ({
      success: "border-[var(--success)] text-[var(--success)]",
      error: "border-[var(--danger)] text-[var(--danger)]",
      warning: "border-[var(--warning)] text-[var(--warning)]",
      info: "border-[var(--accent)] text-[var(--accent)]",
    }),
    [],
  );

  if (!portalNode || toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[var(--z-toast)] flex flex-col gap-3 sm:inset-auto sm:right-4 sm:top-4 sm:max-w-sm"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-2xl border bg-[var(--color-overlay-toast-bg)] px-4 py-3 text-sm shadow-neo-lg backdrop-blur-md ${kindClasses[toast.kind]}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {toast.title && (
                <p className="font-semibold text-[var(--color-overlay-toast-fg)]">{toast.title}</p>
              )}
              {toast.message && (
                <p className="mt-1 text-xs text-[color-mix(in_srgb,var(--color-overlay-toast-fg)_80%,transparent)]">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Benachrichtigung schließen"
              className="text-[inherit] transition-opacity hover:opacity-70"
              onClick={() => onDismiss(toast.id)}
            >
              ×
            </button>
          </div>
          {toast.action && (
            <button
              type="button"
              className="mt-3 rounded-xl border border-current px-3 py-1 text-xs font-semibold text-[inherit] transition-colors hover:bg-white/10"
              onClick={() => {
                toast.action?.onClick();
                onDismiss(toast.id);
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      ))}
    </div>,
    portalNode,
  );
}
