import { cn } from "../../lib/cn";
export function Tabs({
  value,
  onChange,
  items,
}: {
  value: string;
  onChange: (v: string) => void;
  items: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="inline-flex gap-1 rounded-[var(--surface-radius-pill)] border border-[hsl(var(--fg-dim)/0.25)] bg-[hsl(var(--bg1)/0.6)] p-1">
      {items.map((it) => (
        <button
          key={it.value}
          onClick={() => onChange(it.value)}
          className={cn(
            "rounded-[var(--surface-radius-pill)] px-3 py-1.5 text-sm",
            value === it.value
              ? "bg-[hsl(var(--acc1)/0.18)] text-[hsl(var(--acc1))]"
              : "text-[hsl(var(--fg-dim))] hover:bg-[hsl(var(--bg1)/0.5)]",
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
