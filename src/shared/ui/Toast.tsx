import { useCallback, useState } from "react";

export type ToastT = {
  id: string;
  text: string;
  kind: "info" | "error";
};

export default function Toast() {
  const [items, setItems] = useState<ToastT[]>([]);

  const add = useCallback((text: string, kind?: "info" | "error") => {
    const t: ToastT = {
      id: crypto.randomUUID?.() ?? String(Math.random()),
      text,
      kind: kind ?? "info",
    };
    setItems((prev) => [t, ...prev]);
  }, []);

  return (
    <div className="fixed bottom-2 right-2 space-y-2">
      {items.map((t) => (
        <div key={t.id} className="px-3 py-2 rounded text-white"
             style={{ background: t.kind === "error" ? "#b91c1c" : "#2563eb" }}>
          {t.text}
        </div>
      ))}
    </div>
  );
}
