import React from "react";

type ToastItem = { id: string; text: string; type?: "info" | "error" | "success" };
type Ctx = { show: (text: string, type?: ToastItem["type"]) => void; };

const C = React.createContext<Ctx | null>(null);
const uid = () => Math.random().toString(36).slice(2, 9);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const show = (text: string, type: ToastItem["type"] = "info") => {
    const id = uid();
    setItems((a) => [...a, { id, text, type }]);
    window.setTimeout(() => setItems((a) => a.filter((x) => x.id !== id)), 3000);
  };
  return (
    <C.Provider value={{ show }}>
      {children}
      <div className="fixed right-3 bottom-3 z-[60] flex flex-col gap-2">
        {items.map((t) => (
          <div key={t.id} className={"px-3 py-2 rounded-xl shadow text-sm " + (
            t.type === "error" ? "bg-red-600 text-white" :
            t.type === "success" ? "bg-emerald-600 text-white" :
            "bg-black text-white"
          )}>
            {t.text}
          </div>
        ))}
      </div>
    </C.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(C);
  if (!ctx) throw new Error("ToastProvider fehlt");
  return ctx;
}
