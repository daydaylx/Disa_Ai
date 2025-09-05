import React from "react";

type ToastT = { id: string; text: string; kind?: "info" | "error" };
type Ctx = { show: (text: string, kind?: ToastT["kind"]) => void };
const ToastCtx = React.createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastT[]>([]);
  const show = (text: string, kind?: ToastT["kind"]) => {
    const t: ToastT = { id: crypto.randomUUID?.() ?? String(Math.random()), text };
    if (kind !== undefined) (t as any).kind = kind;
    setItems((p) => [...p, t]);
    setTimeout(() => setItems((p) => p.filter((x) => x.id !== t.id)), 3500);
  };
  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed left-0 right-0 bottom-3 flex flex-col items-center gap-2 z-50 px-3">
        {items.map((t) => (
          <div key={t.id} className={`px-3 py-2 rounded-xl text-sm shadow ${t.kind==="error"?"bg-red-600 text-white":"bg-black text-white dark:bg-white dark:text-black"}`}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() {
  const ctx = React.useContext(ToastCtx);
  if (!ctx) throw new Error("ToastProvider fehlt");
  return ctx;
}
