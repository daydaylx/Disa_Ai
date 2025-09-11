import * as React from 'react';

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

  // Gruppiert potenzielle Duplikate (z. B. ":free" Varianten) zu einer Zeile
  type Merged = ModelEntry & { freeBadge: boolean; ids: string[] };
  const mergedAll = React.useMemo<Merged[]>(() => {
    const byKey = new Map<string, Merged>();
    const keyOf = (id: string) => id.replace(/:free$/i, "");
    for (const m of all) {
      const k = keyOf(m.id);
      const prev = byKey.get(k);
      const isFree = isFreeModel(m);
      if (!prev) {
        byKey.set(k, {
          ...m,
          id: m.id, // wird später ggf. auf "bevorzugt" gesetzt
          freeBadge: isFree,
          ids: [m.id],
          ctx: m.ctx ?? 0,
          pricing: {} as Price,
        });
      } else {
        prev.ids.push(m.id);
        prev.freeBadge = prev.freeBadge || isFree;
        prev.ctx = Math.max(prev.ctx ?? 0, m.ctx ?? 0);
        const pin = Math.min(prev.pricing?.in ?? Infinity, m.pricing?.in ?? Infinity);
        const pout = Math.min(prev.pricing?.out ?? Infinity, m.pricing?.out ?? Infinity);
        const next: Price = {};
        if (Number.isFinite(pin)) next.in = pin;
        if (Number.isFinite(pout)) next.out = pout;
        prev.pricing = { ...(prev.pricing ?? {}), ...next } as Price;
        // Bevorzugte ID: wenn bereits free und jetzt paid → bevorzugt paid, sonst erste
        const wasFree = /:free$/i.test(prev.id);
        if (wasFree && !isFree) prev.id = m.id;
      }
    }
    return Array.from(byKey.values());
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
      if (policyFromRole === "any" || policyFromRole === "loose") return true;
      if (m.safety === "free") return true;
      return m.safety === policyFromRole;
    };
    const base = mergedAll.filter((m) => {
      if (!matchesPolicy(m)) return false;
      if (onlyFree && !isFreeModel(m)) return false;
      if (provider !== "all" && m.provider !== provider) return false;
      if (minCtx > 0 && (m.ctx ?? 0) < minCtx) return false;
      if (policy !== "any" && m.safety !== policy && !(policy === "free" && isFreeModel(m))) {
        return false;
      }
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
  }, [mergedAll, q, provider, onlyFree, minCtx, policyFromRole, policy, cost, sortBy, priceBucket, priceIn, priceOut]);

  return (
    <section className="space-y-3" data-testid="settings-model-picker">
      {(!getApiKey() || getApiKey() === "") && (
        <div className="rounded-md border border-amber-700/40 bg-amber-900/20 px-3 py-2 text-xs text-amber-200">
          Hinweis: Für das Laden der Modell‑Liste ist ein OpenRouter API‑Key nötig (Einstellungen).
        </div>
      )}
      {policyFromRole !== "any" && (
        <div className="rounded-md border border-border bg-background/60 px-3 py-2 text-xs text-text-muted">
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
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setPolicy(e.target.value as "any" | "free" | "moderate" | "strict")
          }
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
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setCost(e.target.value as "all" | "free" | "low" | "med" | "high")
          }
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
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSortBy(e.target.value as "label" | "price" | "ctx")
          }
          aria-label="Sortierung"
          className="input text-sm"
        >
          <option value="label">Name</option>
          <option value="price">Preis</option>
          <option value="ctx">Kontext</option>
        </select>
      </div>

      <div className="max-h-[420px] overflow-y-auto space-y-2 p-1" data-no-swipe>
        {filtered.map((m) => {
          const active = value === m.id;
          return (
            <div
              key={m.id}
              aria-selected={active}
              onClick={() => onChange(m.id)}
              className="card-solid grid cursor-pointer grid-cols-3 items-center gap-3 p-3 text-sm transition-transform hover:-translate-y-[1px] aria-selected:ring-2 aria-selected:ring-ring"
            >
              <div className="col-span-2 min-w-0">
                <div className="truncate font-medium text-foreground">{m.label ?? m.id}</div>
                <div className="truncate text-xs text-muted-foreground">{m.provider ?? "—"}</div>
              </div>
              <div className="flex items-center justify-end gap-2 text-xs">
                {(isFreeModel(m) || (m as any).freeBadge) && (
                  <span className="rounded-full border border-white/30 bg-white/60 px-2 py-0.5 text-success backdrop-blur-md">free</span>
                )}
                <span className={`rounded-full border border-white/30 bg-white/60 px-2 py-0.5 backdrop-blur-md ${m.safety === 'strict' ? 'text-error' : m.safety === 'moderate' ? 'text-warning' : 'text-success'}`}>
                  {m.safety}
                </span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Keine Modelle gefunden. Prüfe Filter und API‑Key.
          </div>
        )}
      </div>
    </section>
  );
}
