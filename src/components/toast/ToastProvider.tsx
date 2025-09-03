import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastKind = "info" | "success" | "warn" | "error";
export interface ToastItem {
  id: string;
  kind: ToastKind;
  title: string;
  // mit exactOptionalPropertyTypes dürfen optionale Props explizit undefined sein:
  message?: string | undefined;
  action?: { label: string; onClick: () => void } | undefined;
}

const ToastCtx = createContext<{
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, "id">) => void;
  remove: (id: string) => void;
}>({ toasts: [], push: () => {}, remove: () => {} });

export const useToast = () => useContext(ToastCtx);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((xs) => xs.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    const item: ToastItem = { id, ...t };
    setToasts((xs) => [...xs, item]);
    // Auto-dismiss bei info/success ohne Aktion
    if (!t.action && (t.kind === "info" || t.kind === "success")) {
      setTimeout(() => remove(id), 2800);
    }
  }, [remove]);

  const value = useMemo(() => ({ toasts, push, remove }), [toasts, push, remove]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed top-3 right-3 z-[40] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[260px] max-w-[92vw] rounded-md p-3 shadow-lg border ${
              t.kind === "error" ? "bg-red-600/20 border-red-600/40" :
              t.kind === "warn" ? "bg-yellow-600/20 border-yellow-600/40" :
              t.kind === "success" ? "bg-emerald-600/20 border-emerald-600/40" :
              "bg-slate-700/40 border-slate-500/30"
            }`}
          >
            <div className="font-semibold mb-1">{t.title}</div>
            {t.message && <div className="text-sm opacity-90">{t.message}</div>}
            {t.action && (
              <div className="mt-2">
                <button className="btn" onClick={() => { t.action!.onClick(); remove(t.id); }}>
                  {t.action.label}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};
