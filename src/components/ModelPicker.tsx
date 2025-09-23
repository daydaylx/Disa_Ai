import * as React from "react";

import { loadModelCatalog, type Safety } from "../config/models";
import { cn } from "../lib/utils/cn";
import { getApiKey } from "../services/openrouter";
import { Icon } from "./ui/Icon";

type RolePolicy = Safety | "any";
type Price = { in?: number; out?: number };

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
  policyFromRole?: RolePolicy;
};

type MergedEntry = ModelEntry & { freeBadge: boolean; ids: string[] };

const FAVORITES_KEY = "disa:model:favorites";
const normalizeId = (id: string) => id.replace(/:free$/i, "").toLowerCase();

function isFreeModel(m: ModelEntry): boolean {
  const pin = typeof m.pricing?.in === "number" ? m.pricing!.in! : 0;
  const pout = typeof m.pricing?.out === "number" ? m.pricing!.out! : 0;
  if (pin === 0 && pout === 0) return true;
  const tags = (m.tags ?? []).map((t) => String(t).toLowerCase());
  if (tags.includes("free") || tags.includes("gratis")) return true;
  return String(m.id).toLowerCase().includes(":free");
}

function isCodeModel(m: ModelEntry): boolean {
  const haystack = `${m.id} ${m.label ?? ""} ${(m.tags ?? []).join(" ")}`.toLowerCase();
  return /code|coder|coding|program|dev/.test(haystack);
}

function formatPrice(pricing?: Price): string {
  const fmt = (value?: number) => {
    if (typeof value !== "number" || Number.isNaN(value)) return null;
    if (value === 0) return "0";
    if (value >= 1) return value.toFixed(2);
    if (value >= 0.01) return value.toFixed(2);
    return value.toPrecision(2);
  };
  const pin = fmt(pricing?.in);
  const pout = fmt(pricing?.out);
  if (!pin && !pout) return "—";
  if (pin && pout) return `$${pin} / $${pout}`;
  return `$${pin ?? pout}`;
}

function safetyLabel(value: ModelEntry["safety"]): string {
  if (value === "strict") return "Strikt";
  if (value === "moderate") return "Moderat";
  if (value === "free") return "Frei";
  return "Flexibel";
}

function costBucketLabel(bucket: "free" | "low" | "med" | "high"): string {
  if (bucket === "free") return "Frei";
  if (bucket === "low") return "Günstig";
  if (bucket === "med") return "Mittel";
  return "Premium";
}

export default function ModelPicker({ value, onChange, policyFromRole = "any" }: Props) {
  const [all, setAll] = React.useState<ModelEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [q, setQ] = React.useState("");
  const [provider, setProvider] = React.useState<string>("all");
  const [onlyFree, setOnlyFree] = React.useState<boolean>(() => !getApiKey());
  const [onlyCode, setOnlyCode] = React.useState<boolean>(false);
  const [onlyFavorites, setOnlyFavorites] = React.useState<boolean>(false);
  const [minCtx, setMinCtx] = React.useState<number>(0);
  const [policy, setPolicy] = React.useState<"any" | "free" | "moderate" | "strict">("any");
  const [cost, setCost] = React.useState<"all" | "free" | "low" | "med" | "high">("all");
  const [sortBy, setSortBy] = React.useState<"label" | "price" | "ctx">("label");
  const [favorites, setFavorites] = React.useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((id) => normalizeId(String(id)));
    } catch {
      /* ignore */
    }
    return [];
  });

  React.useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        const list = await loadModelCatalog();
        if (ok) {
          setAll(list as ModelEntry[]);
          setLoading(false);
        }
      } catch {
        if (ok) {
          setAll([]);
          setLoading(false);
        }
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  const favoritesSet = React.useMemo(
    () => new Set(favorites.map((id) => normalizeId(id))),
    [favorites],
  );

  const providers = React.useMemo(() => {
    const set = new Set<string>();
    all.forEach((m) => m.provider && set.add(m.provider));
    return ["all", ...Array.from(set).sort()];
  }, [all]);

  const mergedAll = React.useMemo<MergedEntry[]>(() => {
    const byKey = new Map<string, MergedEntry>();
    const keyOf = (id: string) => id.replace(/:free$/i, "");
    for (const m of all) {
      const k = keyOf(m.id);
      const prev = byKey.get(k);
      const isFree = isFreeModel(m);
      if (!prev) {
        byKey.set(k, {
          ...m,
          id: m.id,
          freeBadge: isFree,
          ids: [m.id],
          ctx: m.ctx ?? 0,
          pricing: { ...(m.pricing ?? {}) },
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
        if (/:free$/i.test(prev.id) && !isFree) prev.id = m.id;
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
      if (avg <= 0.1) return "low";
      if (avg <= 0.5) return "med";
      return "high";
    },
    [priceIn, priceOut],
  );

  const isFavoriteModel = React.useCallback(
    (entry: MergedEntry) => {
      const ids = entry.ids && entry.ids.length ? entry.ids : [entry.id];
      return (
        ids.some((id) => favoritesSet.has(normalizeId(id))) ||
        favoritesSet.has(normalizeId(entry.id))
      );
    },
    [favoritesSet],
  );

  const toggleFavorite = React.useCallback((entry: MergedEntry) => {
    setFavorites((prev) => {
      const next = new Set(prev.map((id) => normalizeId(id)));
      const ids = entry.ids && entry.ids.length ? entry.ids : [entry.id];
      const normalizedIds = [...ids, entry.id].map(normalizeId);
      const has = normalizedIds.some((id) => next.has(id));
      normalizedIds.forEach((id) => {
        if (has) next.delete(id);
        else next.add(id);
      });
      return Array.from(next);
    });
  }, []);

  const filtered = React.useMemo(() => {
    const norm = q.trim().toLowerCase();
    const matchesPolicy = (m: ModelEntry) => {
      if (policyFromRole === "any" || policyFromRole === "loose") return true;
      if (m.safety === "free") return true;
      return m.safety === policyFromRole;
    };

    const list = mergedAll.filter((m) => {
      if (!matchesPolicy(m)) return false;
      if (onlyFree && !isFreeModel(m)) return false;
      if (onlyCode && !isCodeModel(m)) return false;
      if (onlyFavorites && !isFavoriteModel(m)) return false;
      if (provider !== "all" && m.provider !== provider) return false;
      if (minCtx > 0 && (m.ctx ?? 0) < minCtx) return false;
      if (policy !== "any" && m.safety !== policy && !(policy === "free" && isFreeModel(m))) {
        return false;
      }
      if (cost !== "all" && priceBucket(m) !== cost) return false;
      if (norm !== "") {
        const hay =
          `${m.id} ${m.label ?? ""} ${m.provider ?? ""} ${(m.tags ?? []).join(" ")}`.toLowerCase();
        if (!hay.includes(norm)) return false;
      }
      return true;
    });

    const arr = list.slice();
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
  }, [
    mergedAll,
    q,
    provider,
    onlyFree,
    onlyCode,
    onlyFavorites,
    minCtx,
    policyFromRole,
    policy,
    cost,
    sortBy,
    priceBucket,
    priceIn,
    priceOut,
    isFavoriteModel,
  ]);

  return (
    <section className="model-picker" data-testid="settings-model-picker">
      {(!getApiKey() || getApiKey() === "") && (
        <div className="model-picker__banner" role="status">
          Hinweis: Für das Laden der Modell‑Liste ist ein OpenRouter API‑Key nötig (Einstellungen).
        </div>
      )}
      {policyFromRole !== "any" && (
        <div className="model-picker__banner model-picker__banner--muted">
          Rollen-Policy aktiv: <span className="font-medium">{policyFromRole}</span> – Liste
          entsprechend gefiltert.
        </div>
      )}

      <div className="model-picker__filters">
        <div className="model-picker__search">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Modell suchen…"
            aria-label="Modell suchen"
            className="input min-w-[220px] flex-1 text-sm transition-all duration-200 focus:scale-[1.01] focus:shadow-lg focus:shadow-accent-teal/10"
            data-testid="model-search"
          />
        </div>
        <div className="model-picker__chips" role="group" aria-label="Schnellfilter">
          <button
            type="button"
            className={cn("chip chip-toggle", onlyFavorites && "chip-toggle--active")}
            onClick={() => setOnlyFavorites((prev) => !prev)}
            data-testid="model-filter-chip-favorite"
          >
            <Icon name={onlyFavorites ? "star-filled" : "star"} size={16} aria-hidden />
            Favoriten
          </button>
          <button
            type="button"
            className={cn("chip chip-toggle", onlyFree && "chip-toggle--active")}
            onClick={() => setOnlyFree((prev) => !prev)}
            data-testid="model-filter-chip-free"
          >
            <span aria-hidden>💸</span>
            Frei
          </button>
          <button
            type="button"
            className={cn("chip chip-toggle", onlyCode && "chip-toggle--active")}
            onClick={() => setOnlyCode((prev) => !prev)}
            data-testid="model-filter-chip-code"
          >
            <span aria-hidden>💻</span>
            Code
          </button>
        </div>
      </div>

      <div className="model-picker__advanced" role="group" aria-label="Detailfilter">
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
        <label className="model-picker__field">
          <span>min. Kontext</span>
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

      <div className="model-picker__results" role="listbox" aria-label="Modelle">
        {loading ? (
          <div className="model-picker__loading" role="status" aria-label="Modelle werden geladen">
            <div className="loading-skeleton">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
            <p className="loading-text">Modelle werden geladen...</p>
          </div>
        ) : (
          filtered.map((m) => {
            const isFavorite = isFavoriteModel(m);
            const isCode = isCodeModel(m);
            const active = value
              ? value === m.id ||
                (m.ids && m.ids.includes(value)) ||
                normalizeId(value) === normalizeId(m.id)
              : false;
            const context = m.ctx ? `${m.ctx.toLocaleString("de-DE")} Tokens` : "—";
            const isFree = isFreeModel(m) || m.freeBadge;
            const priceLabel = isFree ? "Frei" : formatPrice(m.pricing);
            const costBucket = priceBucket(m);
            const costLabel = costBucketLabel(costBucket);

            const handleSelect = () => onChange(m.id);
            const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleSelect();
              }
            };

            return (
              <div
                key={m.id}
                role="option"
                aria-selected={active}
                tabIndex={0}
                className={cn("model-card", active && "model-card--active")}
                onClick={handleSelect}
                onKeyDown={handleKeyDown}
                data-testid="model-option"
              >
                <div className="model-card__header">
                  <div className="model-card__title-group">
                    <div className="model-card__title">{m.label ?? m.id}</div>
                    <div className="model-card__subtitle">
                      {m.provider ?? "Unbekannter Provider"}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={cn(
                      "model-card__favorite",
                      isFavorite && "model-card__favorite--active",
                    )}
                    aria-pressed={isFavorite}
                    aria-label={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite(m);
                    }}
                    data-testid="model-favorite-toggle"
                  >
                    <Icon name={isFavorite ? "star-filled" : "star"} size={18} aria-hidden />
                  </button>
                </div>

                <div className="model-card__meta">
                  <span title="Kontextfenster">Kontext: {context}</span>
                  <span title="Kosten pro 1k Tokens">Kosten: {priceLabel}</span>
                  <span>Sicherheit: {safetyLabel(m.safety)}</span>
                </div>

                <div className="model-card__tags">
                  {isFavorite && <span className="model-chip model-chip--favorite">Favorit</span>}
                  {isFree && <span className="model-chip model-chip--free">Free</span>}
                  {isCode && <span className="model-chip model-chip--code">Code</span>}
                  <span className={cn("model-chip", `model-chip--safety-${m.safety}`)}>
                    {safetyLabel(m.safety)}
                  </span>
                  {!isFree && <span className="model-chip model-chip--cost">{costLabel}</span>}
                </div>
              </div>
            );
          })
        )}

        {!loading && filtered.length === 0 && (
          <div className="model-picker__empty" role="status">
            Keine Modelle gefunden. Passe Filter oder Suchbegriff an.
          </div>
        )}
      </div>
    </section>
  );
}
