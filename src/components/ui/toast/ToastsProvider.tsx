import React, { createContext, useContext, useState } from "react";

type ToastKind = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  message: string;
  duration?: number;
}

interface ToastsContextType {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id">) => void;
  remove: (id: string) => void;
}

const ToastsContext = createContext<ToastsContextType | undefined>(undefined);

export function ToastsProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
  };

  const remove = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastsContext.Provider value={{ toasts, push, remove }}>
      {children}
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