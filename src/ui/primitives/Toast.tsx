import React, { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "error";
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { ...toast, id };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove after duration
      const duration = toast.duration ?? 5000;
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

function ToastContainer() {
  const context = useContext(ToastContext);
  if (!context) return null;

  const { toasts, removeToast } = context;

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed right-4 top-4 z-50 w-full max-w-sm space-y-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>,
    document.body,
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: () => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const variantClasses = {
    default: "",
    success: "glass-toast--success",
    warning: "glass-toast--warning",
    error: "glass-toast--error",
  };

  const classes = [
    "glass-toast",
    variantClasses[toast.variant || "default"],
    "animate-in slide-in-from-right duration-300",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="alert">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          {toast.title && <div className="font-semibold text-neutral-100">{toast.title}</div>}
          {toast.description && <div className="text-sm text-neutral-300">{toast.description}</div>}
        </div>
        <button
          onClick={onRemove}
          className="glass-backdrop--soft hover:glass-backdrop--medium rounded-md p-1 transition-colors"
          aria-label="Close notification"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
