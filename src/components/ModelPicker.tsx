import React from "react";

import { loadModelCatalog, type Safety } from "../config/models";
import { getApiKey } from "../services/openrouter";

type RolePolicy = Safety | "any";
type Price = { in?: number; out?: number };

// Safety der Modelle kann auch "free" sein (aus dem Katalog abgeleitet)
type ModelEntry = {
  id: string;
  label?: string;
  provider?: string;
  ctx?: number;
  tags: string[];
  pricing?: Price;
  safety: "free" | "moderate" | "strict" | "any";
};

type Props = {
  value: string | null;
  onChange: (id: string) => void;
  /** optional: von der Rolle empfohlene Policy; wird als zusätzlicher Filter angewendet */
  policyFromRole?: RolePolicy;
};

function isFreeModel(m: ModelEntry): boolean {
  const pin = typeof m.pricing?.in === "number" ? m.pricing!.in! : 0;
  const pout = typeof m.pricing?.out === "number" ? m.pricing!.out! : 0;
  if (pin === 0 && pout === 0) return true;
  const tags = (m.tags ?? []).map((t) => String(t).toLowerCase());
  if (tags.includes("free") || tags.includes("gratis")) return true;
  if (String(m.id).toLowerCase().includes(":free")) return true;
  return false;
}

export default function ModelPicker({ value, onChange, policyFromRole = "any" }: Props) {
  const [all, setAll] = React.useState<ModelEntry[]>([]);
  const [q, setQ] = React.useState("");
  const [provider, setProvider] = React.useState<string>("all");
  const [onlyFree, setOnlyFree] = React.useState<boolean>(false);
  const [minCtx, setMinCtx] = React.useState<number>(0);

  React.useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const list = await loadModelCatalog();
        if (ok) setAll(list as ModelEntry[]);
      } catch {
        if (ok) setAll([]);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  const providers = React.useMemo(() => {
    const set = new Set<string>();
    all.forEach((m) => m.provider && set.add(m.provider));
    return ["all", ...Array.from(set).sort()];
  }, [all]);

  const filtered = React.useMemo(() => {
    const norm = q.trim().toLowerCase();
    const matchesPolicy = (m: ModelEntry) => {
      // "any" oder "loose" → keine Einschränkung
      if (policyFromRole === "any" || policyFromRole === "loose") return true;
      // "free" immer zulassen
      if (m.safety === "free") return true;
      // sonst exakte Übereinstimmung (moderate/strict)
      return m.safety === policyFromRole;
    };
    return all.filter((m) => {
      // expliziter Rollen-Policy-Filter
      if (!matchesPolicy(m)) return false;
      // UI-Filter
      if (onlyFree && !isFreeModel(m)) return false;
      if (provider !== "all" && m.provider !== provider) return false;
      if (minCtx > 0 && (m.ctx ?? 0) < minCtx) return false;

      if (norm === "") return true;
      const hay = `${m.id} ${m.label ?? ""} ${m.provider ?? ""} ${m.tags?.join(" ") ?? ""}`.toLowerCase();
      return hay.includes(norm);
    });
  }, [all, q, provider, onlyFree, minCtx, policyFromRole]);

  return (
    <section className="space-y-3">
      {(!getApiKey() || getApiKey() === "") && (
        <div className="rounded-md border border-amber-700/40 bg-amber-900/20 px-3 py-2 text-xs text-amber-200">
          Hinweis: Für das Laden der Modell‑Liste ist ein OpenRouter API‑Key nötig (Einstellungen).
        </div>
      )}
      {policyFromRole !== "any" && (
        <div className="rounded-md border border-border bg-background/60 px-3 py-2 text-xs text-neutral-300">
          Rollen-Policy aktiv: <span className="font-medium">{policyFromRole}</span> – Liste entsprechend gefiltert.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Modell suchen…"
          aria-label="Modell suchen"
          className="min-w-[200px] flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          aria-label="Provider filtern"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          {providers.map((p) => (
            <option key={p} value={p}>
              {p === "all" ? "Alle Provider" : p}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyFree}
            onChange={(e) => setOnlyFree(e.target.checked)}
            aria-label="Nur freie Modelle zeigen"
          />
          Nur frei
        </label>
        <label className="flex items-center gap-2 text-sm">
          min. Kontext:
          <input
            type="number"
            min={0}
            step={512}
            value={minCtx}
            onChange={(e) => setMinCtx(Number(e.target.value) || 0)}
            className="w-24 rounded-md border border-border bg-background px-2 py-1"
            aria-label="Minimale Kontextgröße in Tokens"
          />
        </label>
      </div>

      <div className="max-h-[360px] overflow-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-background/90 backdrop-blur">
            <tr className="text-left">
              <th className="px-3 py-2 font-medium">Modell</th>
              <th className="px-3 py-2 font-medium">Provider</th>
              <th className="px-3 py-2 font-medium">Kontext</th>
              <th className="px-3 py-2 font-medium">Preis/1k</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const active = value === m.id;
              const priceIn = m.pricing?.in ?? 0;
              const priceOut = m.pricing?.out ?? 0;
              const priceLabel = priceIn || priceOut ? `${priceIn}/${priceOut}` : (isFreeModel(m) ? "frei" : "—");
              return (
                <tr
                  key={m.id}
                  aria-selected={active}
                  onClick={() => onChange(m.id)}
                  className={`cursor-pointer border-t border-border hover:bg-white/5 aria-selected:bg-white/10`}
                >
                  <td className="px-3 py-2">
                    <div className="font-medium">{m.label ?? m.id}</div>
                    <div className="text-xs opacity-70">{m.id}</div>
                  </td>
                  <td className="px-3 py-2">{m.provider ?? "—"}</td>
                  <td className="px-3 py-2">{m.ctx ?? "—"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{priceLabel}</td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center opacity-70">
                  Keine Modelle gefunden. Prüfe Filter und API‑Key.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
