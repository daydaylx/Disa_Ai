import { useMemo, useState } from "react";

import type { ModelEntry } from "@/config/models";
import type { Safety } from "@/types/safety";

export type ModelPickerProps = {
  value: string | null;
  onChange: (id: string) => void;
  models: ModelEntry[];
  /** Optional policy hint derived from role in style.json */
  policyFromRole?: "any" | Safety | undefined;
  disabled?: boolean;
};

function fmtCtx(n?: number): string {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}
function fmtPriceUSD(p?: { in?: number; out?: number }): string {
  if (!p || (typeof p.in !== "number" && typeof p.out !== "number")) return "—";
  const pin = Number.isFinite(p.in!) ? p.in : undefined;
  const pout = Number.isFinite(p.out!) ? p.out : undefined;
  const fmt = (x: number) => (x >= 1 ? x.toFixed(2) : x.toPrecision(2));
  if (pin !== undefined && pout !== undefined) return `$${fmt(pin)}/${fmt(pout)} per 1M`;
  if (pin !== undefined) return `$${fmt(pin)} in / 1M`;
  if (pout !== undefined) return `$${fmt(pout)} out / 1M`;
  return "—";
}

export default function ModelPicker(props: ModelPickerProps) {
  const { value, onChange, models, disabled = false } = props;

  const [q, setQ] = useState("");
  const [onlyFree, setOnlyFree] = useState(false);

  const providers = useMemo(() => {
    const s = new Set<string>();
    for (const m of models) if (m.provider?.name) s.add(m.provider.name);
    return Array.from(s).sort();
  }, [models]);
  const [provider, setProvider] = useState<string>("");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return models.filter((m) => {
      if (onlyFree && !m.tags?.includes("free")) return false;
      if (provider && m.provider?.name !== provider) return false;
      if (!qq) return true;
      const hay = `${m.id} ${m.label} ${m.provider?.name ?? ""}`.toLowerCase();
      return hay.includes(qq);
    });
  }, [models, q, onlyFree, provider]);

  const current = useMemo(() => filtered.find((m) => m.id === (value ?? "")), [filtered, value]);

  return (
    <div className="flex flex-col gap-2 text-sm">
      <label className="text-sm font-medium">Modell</label>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 bg-white dark:bg-zinc-900"
          placeholder="Suche nach Name/Provider…"
          value={q}
          onChange={(e) => setQ((e.target as HTMLInputElement).value)}
          disabled={disabled || models.length === 0}
        />
        <label className="flex items-center gap-1 text-xs px-2 py-1 border rounded">
          <input
            type="checkbox"
            checked={onlyFree}
            onChange={(e) => setOnlyFree((e.target as HTMLInputElement).checked)}
            disabled={disabled || models.length === 0}
          />
          free
        </label>
        <select
          className="border rounded px-2 py-1 bg-white dark:bg-zinc-900"
          value={provider}
          onChange={(e) => setProvider((e.target as HTMLSelectElement).value)}
          disabled={disabled || models.length === 0}
          title="Provider filtern"
        >
          <option value="">alle Provider</option>
          {providers.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <select
        className="border rounded px-2 py-1 bg-white dark:bg-zinc-900"
        value={value ?? ""}
        onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
        disabled={disabled || filtered.length === 0}
      >
        {filtered.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>

      {filtered.length === 0 && (
        <p className="text-xs text-red-500">Keine passenden Modelle. Filter zurücksetzen?</p>
      )}

      {current && (
        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border">
            Provider: <code>{current.provider?.name ?? "?"}</code>
          </span>
          {current.tags?.includes("free") && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full border">free</span>
          )}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full border">
            ctx: {fmtCtx(current.ctx)}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full border">
            price: {fmtPriceUSD(current.price)}
          </span>
        </div>
      )}
    </div>
  );
}
