import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { AlertTriangle, Check, NotchSquare, X } from "@/lib/icons";
import { getOverlayRoot } from "@/lib/overlay";

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

export function useToastsOptional() {
  return useContext(ToastsContext);
}

function ToastItem({
  toast,
  onDismiss,
  kindClasses,
  iconClasses,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
  kindClasses: Record<ToastKind, string>;
  iconClasses: Record<ToastKind, string>;
}) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = toast.duration ?? 5000;
    if (duration <= 0) return undefined;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [toast.duration]);

  return (
    <div
      className={`pointer-events-auto disa-toast-in disa-notch disa-notch--md disa-notch--interactive rounded-md bg-surface-2 px-4 py-3 text-sm shadow-raiseLg transition-all duration-fast overflow-hidden relative ${kindClasses[toast.kind]}`}
    >
      {/* Progress bar at bottom */}
      {(toast.duration ?? 5000) > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-surface-inset overflow-hidden">
          <div
            className={`h-full transition-all ease-linear ${iconClasses[toast.kind].replace("text-", "bg-")}`}
            style={{
              width: `${progress}%`,
              transitionDuration: "100ms",
            }}
          />
        </div>
      )}

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
          className="ml-1 rounded-sm px-2 text-ink-secondary hover:text-text-primary hover:bg-surface-inset transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glass-focus-ring)]"
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
  );
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

    const overlayRoot = getOverlayRoot();
    if (!overlayRoot) return undefined;

    let node = document.getElementById("toast-root");
    let created = false;
    if (!node) {
      node = document.createElement("div");
      node.id = "toast-root";
      overlayRoot.appendChild(node);
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
      success: "ring-1 ring-status-success/30 shadow-[var(--shadow-status-success)]",
      error: "ring-1 ring-status-error/30 shadow-[var(--shadow-status-error)]",
      warning: "ring-1 ring-status-warning/30 shadow-[var(--shadow-status-warning)]",
      info: "ring-1 ring-status-info/30 shadow-[var(--shadow-status-info)]",
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
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          kindClasses={kindClasses}
          iconClasses={iconClasses}
        />
      ))}
    </div>,
    portalNode,
  );
}
