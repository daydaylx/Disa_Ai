import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { AlertTriangle, Check, NotchSquare, X } from "@/lib/icons";

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
      success: "ring-1 ring-status-success/30 shadow-[0_0_16px_rgba(16,185,129,0.3)]",
      error: "ring-1 ring-status-error/30 shadow-[0_0_16px_rgba(239,68,68,0.3)]",
      warning: "ring-1 ring-status-warning/30 shadow-[0_0_16px_rgba(245,158,11,0.3)]",
      info: "ring-1 ring-status-info/30 shadow-[0_0_16px_rgba(6,182,212,0.3)]",
    }),
    [],
  );

  const iconClasses = useMemo(
    () => ({
      success: "text-status-success",
      error: "text-status-error",
      warning: "text-status-warning",
      info: "text-status-info",
    }),
    [],
  );

  if (!portalNode || toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-toast flex flex-col gap-3 sm:inset-auto sm:right-4 sm:top-4 sm:max-w-sm"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto disa-toast-in disa-notch disa-notch--md disa-notch--interactive rounded-md bg-surface-2 px-4 py-3 text-sm shadow-raiseLg transition-all duration-fast ${kindClasses[toast.kind]}`}
        >
          <div className="flex items-start gap-3">
            {/* Status Icon */}
            <div className={`mt-0.5 ${iconClasses[toast.kind]}`}>
              {toast.kind === "success" && <Check className="h-4 w-4" />}
              {toast.kind === "error" && <X className="h-4 w-4" />}
              {toast.kind === "warning" && <AlertTriangle className="h-4 w-4" />}
              {toast.kind === "info" && <NotchSquare className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              {toast.title && (
                <p className="font-semibold text-text-primary leading-snug">{toast.title}</p>
              )}
              {toast.message && (
                <p className="mt-1 text-xs text-text-secondary leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="Benachrichtigung schließen"
              className="ml-1 rounded-sm px-2 text-ink-secondary hover:text-text-primary hover:bg-surface-inset transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              onClick={() => onDismiss(toast.id)}
            >
              ×
            </button>
          </div>
          {toast.action && (
            <button
              type="button"
              className={`mt-3 rounded-sm px-3 py-1.5 text-xs font-semibold transition-all duration-fast shadow-raise hover:shadow-raiseLg active:scale-95 ${iconClasses[toast.kind]} bg-surface-inset`}
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
