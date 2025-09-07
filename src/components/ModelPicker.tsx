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
  const [onlyFree, setOnlyFree] = React.useState<boolean>(() => !getApiKey());
  const [minCtx, setMinCtx] = React.useState<number>(0);
  const [policy, setPolicy] = React.useState<"any" | "free" | "moderate" | "strict">("any");
  const [cost, setCost] = React.useState<"all" | "free" | "low" | "med" | "high">("all");
  const [sortBy, setSortBy] = React.useState<"label" | "price" | "ctx">("label");

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

  const priceIn = React.useCallback((m: ModelEntry): number => {
    return typeof m.pricing?.in === "number" ? (m.pricing!.in as number) : 0;
  }, []);
  const priceOut = React.useCallback((m: ModelEntry): number => {
    return typeof m.pricing?.out === "number" ? (m.pricing!.out as number) : 0;
  }, []);
  const priceBucket = React.useCallback(
    (m: ModelEntry): "free" | "low" | "med" | "high" => {
      if (isFreeModel(m)) return "free";
      const pin = priceIn(m);
      const pout = priceOut(m);
      const avg = (pin + pout) / 2 || Math.max(pin, pout) || 0;
      if (avg <= 0.1) return "low"; // <= $0.10 / 1k
      if (avg <= 0.5) return "med"; // <= $0.50 / 1k
      return "high";
    },
    [priceIn, priceOut],
  );

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
    const base = all.filter((m) => {
      // expliziter Rollen-Policy-Filter
      if (!matchesPolicy(m)) return false;
      // UI-Filter
      if (onlyFree && !isFreeModel(m)) return false;
      if (provider !== "all" && m.provider !== provider) return false;
      if (minCtx > 0 && (m.ctx ?? 0) < minCtx) return false;
      // Safety/Policy-Filter (Benutzerauswahl)
      if (policy !== "any" && m.safety !== policy && !(policy === "free" && isFreeModel(m))) {
        return false;
      }
      // Kostenkategorie
      if (cost !== "all" && priceBucket(m) !== cost) return false;

      if (norm === "") return true;
      const hay = `${m.id} ${m.label ?? ""} ${m.provider ?? ""} ${m.tags?.join(" ") ?? ""}`.toLowerCase();
      return hay.includes(norm);
    });
    // Sortierung
    const arr = base.slice();
    arr.sort((a, b) => {
      if (sortBy === "ctx") return (b.ctx ?? 0) - (a.ctx ?? 0);
      if (sortBy === "price") {
        const A = (priceIn(a) + priceOut(a)) / 2;
        const B = (priceIn(b) + priceOut(b)) / 2;
        return A - B;
      }
      const A = (a.label ?? a.id).toLowerCase();
      const B = (b.label ?? b.id).toLowerCase();
      return A.localeCompare(B);
    });
    return arr;
  }, [all, q, provider, onlyFree, minCtx, policyFromRole, policy, cost, sortBy, priceBucket, priceIn, priceOut]);

  return (
    <section className="space-y-3" data-testid="settings-model-picker">
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
          className="input min-w-[200px] flex-1 text-sm"
        />
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          aria-label="Provider filtern"
          className="input text-sm"
        >
          {providers.map((p) => (
            <option key={p} value={p}>
              {p === "all" ? "Alle Provider" : p}
            </option>
          ))}
        </select>
        <select
          value={policy}
          onChange={(e) => setPolicy(e.target.value as any)}
          aria-label="Policy/Safety filtern"
          className="input text-sm"
        >
          <option value="any">Alle Policies</option>
          <option value="free">Frei</option>
          <option value="moderate">Moderat</option>
          <option value="strict">Strikt</option>
        </select>
        <select
          value={cost}
          onChange={(e) => setCost(e.target.value as any)}
          aria-label="Kostenkategorie filtern"
          className="input text-sm"
        >
          <option value="all">Alle Kosten</option>
          <option value="free">Frei</option>
          <option value="low">Günstig (≤$0.10/1k)</option>
          <option value="med">Mittel (≤$0.50/1k)</option>
          <option value="high">Teuer (&gt;$0.50/1k)</option>
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
            className="input w-24"
            aria-label="Minimale Kontextgröße in Tokens"
          />
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          aria-label="Sortierung"
          className="input text-sm"
        >
          <option value="label">Name</option>
          <option value="price">Preis</option>
          <option value="ctx">Kontext</option>
        </select>
      </div>

      <div className="max-h-[360px] overflow-auto rounded-xl border border-white/10 bg-[#232832]/60 backdrop-blur-sm" data-no-swipe>
        <table className="w-full text-sm text-[#B0B6C0]">
          <thead className="sticky top-0 bg-background/90 backdrop-blur thead-grad">
            <tr className="text-left">
              <th className="px-3 py-2 font-medium text-[#F0F2F5]">Modell</th>
              <th className="px-3 py-2 font-medium">Provider</th>
              <th className="px-3 py-2 font-medium">Kontext</th>
              <th className="px-3 py-2 font-medium">Preis/1k</th>
              <th className="px-3 py-2 font-medium">Policy</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const active = value === m.id;
              const pin = priceIn(m);
              const pout = priceOut(m);
              const priceLabel = pin || pout ? `${pin}/${pout}` : (isFreeModel(m) ? "frei" : "—");
              const bucket = priceBucket(m);
              return (
                <tr
                  key={m.id}
                  aria-selected={active}
                  onClick={() => onChange(m.id)}
                  className={`cursor-pointer border-t border-border hover:bg-white/5 aria-selected:bg-white/10`}
                >
                  <td className="px-3 py-2">
                    <div className="truncate font-medium text-[#F0F2F5]">{m.label ?? m.id}</div>
                    <div className="truncate text-xs opacity-70">{m.id}</div>
                    <div className="mt-1 flex flex-wrap gap-1 text-[11px] opacity-80">
                      {isFreeModel(m) ? (
                        <span className="rounded-full border border-[#4FC3F7]/40 bg-[#4FC3F7]/10 px-2 py-0.5 text-[#4FC3F7]">free</span>
                      ) : (
                        <span className="rounded-full border border-white/10 bg-[#1A1D24]/60 px-2 py-0.5">
                          {bucket === "low" ? "günstig" : bucket === "med" ? "mittel" : "teuer"}
                        </span>
                      )}
                      {m.tags?.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-full border border-border px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2">{m.provider ?? "—"}</td>
                  <td className="px-3 py-2">{m.ctx ?? "—"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{priceLabel}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={
                        m.safety === "strict"
                          ? "rounded-md border border-red-700/40 bg-red-900/20 px-2 py-0.5 text-red-300"
                          : m.safety === "moderate"
                            ? "rounded-md border border-amber-700/40 bg-amber-900/20 px-2 py-0.5 text-amber-200"
                            : "rounded-md border border-emerald-700/40 bg-emerald-900/20 px-2 py-0.5 text-emerald-300"
                      }
                    >
                      {m.safety === "strict" ? "strikt" : m.safety === "moderate" ? "moderat" : "frei"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center opacity-70">
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
