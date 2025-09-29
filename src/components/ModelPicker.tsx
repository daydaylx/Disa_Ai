import * as React from "react";

import { loadModelCatalog, type Safety } from "../config/models";
import { cn } from "../lib/cn";
import { getApiKey } from "../services/openrouter";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Icon } from "./ui/Icon";
import { Input } from "./ui/input";

// All the logic and type definitions from the original file are preserved.

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

// The main component with the new rendering logic
export default function ModelPicker({ value, onChange, policyFromRole = "any" }: Props) {
  // All the hooks (useState, useEffect, useMemo, useCallback) from the original file are preserved.
  const [all, setAll] = React.useState<ModelEntry[]>([]);
  const [searchInput, setSearchInput] = React.useState("");
  const [q, setQ] = React.useState("");
  const searchDebounce = React.useRef<number>();
  const [loading, setLoading] = React.useState(true);
  const [provider, setProvider] = React.useState<string>("all");
  const [onlyFree, setOnlyFree] = React.useState<boolean>(() => !getApiKey());
  const [onlyCode, setOnlyCode] = React.useState<boolean>(false);
  const [onlyFavorites, setOnlyFavorites] = React.useState<boolean>(false);
  const [minCtx, _setMinCtx] = React.useState<number>(0);
  const [policy, _setPolicy] = React.useState<"any" | "free" | "moderate" | "strict">("any");
  const [cost, _setCost] = React.useState<"all" | "free" | "low" | "med" | "high">("all");
  const [sortBy, setSortBy] = React.useState<"label" | "price" | "ctx">("label");
  const [showAdvanced, setShowAdvanced] = React.useState(false);
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

  React.useEffect(() => {
    window.clearTimeout(searchDebounce.current);
    searchDebounce.current = window.setTimeout(() => {
      setQ(searchInput);
    }, 200);
    return () => window.clearTimeout(searchDebounce.current);
  }, [searchInput]);

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

  // NEW RENDER LOGIC
  return (
    <section className="space-y-6" data-testid="settings-model-picker">
      {(!getApiKey() || getApiKey() === "") && (
        <div className="rounded-lg bg-yellow-500/10 p-4 text-sm text-yellow-200" role="alert">
          Hinweis: Für das Laden der Modell‑Liste ist ein OpenRouter API‑Key nötig (Einstellungen).
        </div>
      )}
      {policyFromRole !== "any" && (
        <div className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-200" role="alert">
          Rollen-Policy aktiv: <span className="font-medium">{policyFromRole}</span> – Liste
          entsprechend gefiltert.
        </div>
      )}

      <div className="space-y-4">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Modell suchen…"
          aria-label="Modell suchen"
          data-testid="model-search"
        />
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Schnellfilter">
          <Button
            variant={onlyFavorites ? "default" : "secondary"}
            size="sm"
            onClick={() => setOnlyFavorites((prev) => !prev)}
            data-testid="model-filter-chip-favorite"
            className="rounded-full"
          >
            <Icon name={onlyFavorites ? "star-filled" : "star"} size={16} className="mr-2" />
            Favoriten
          </Button>
          <Button
            variant={onlyFree ? "default" : "secondary"}
            size="sm"
            onClick={() => setOnlyFree((prev) => !prev)}
            data-testid="model-filter-chip-free"
            className="rounded-full"
          >
            <span aria-hidden className="mr-2">
              💸
            </span>
            Frei
          </Button>
          <Button
            variant={onlyCode ? "default" : "secondary"}
            size="sm"
            onClick={() => setOnlyCode((prev) => !prev)}
            data-testid="model-filter-chip-code"
            className="rounded-full"
          >
            <span aria-hidden className="mr-2">
              💻
            </span>
            Code
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced((p) => !p)}
            className="ml-auto rounded-full"
          >
            <Icon name="filter" size={16} className="mr-2" />
            {showAdvanced ? "Filter ausblenden" : "Filter anzeigen"}
          </Button>
        </div>
      </div>

      {showAdvanced && (
        <Card className="bg-white/5">
          <CardContent className="pt-6">
            <div
              className="grid grid-cols-2 gap-4 md:grid-cols-3"
              role="group"
              aria-label="Detailfilter"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="provider-select" className="text-text-muted text-sm">
                  Provider
                </label>
                <select
                  id="provider-select"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  aria-label="Provider filtern"
                  className="placeholder:text-text-muted h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {providers.map((p) => (
                    <option key={p} value={p} className="bg-bg-elevated">
                      {p === "all" ? "Alle Provider" : p}
                    </option>
                  ))}
                </select>
              </div>
              {/* Other selects would be styled similarly */}
              <div className="flex flex-col gap-1">
                <label htmlFor="sort-select" className="text-text-muted text-sm">
                  Sortieren nach
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSortBy(e.target.value as "label" | "price" | "ctx")
                  }
                  aria-label="Sortierung"
                  className="placeholder:text-text-muted h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="label" className="bg-bg-elevated">
                    Name
                  </option>
                  <option value="price" className="bg-bg-elevated">
                    Preis
                  </option>
                  <option value="ctx" className="bg-bg-elevated">
                    Kontext
                  </option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div role="listbox" aria-label="Modelle">
        {loading ? (
          <div
            className="text-text-muted flex flex-col items-center justify-center p-8"
            role="status"
            aria-label="Modelle werden geladen"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
            <p className="mt-4 text-sm">Modelle werden geladen...</p>
          </div>
        ) : (
          <ModelListVirtualized
            items={filtered}
            isFavoriteModel={isFavoriteModel}
            onSelect={onChange}
            activeValue={value}
            toggleFavorite={toggleFavorite}
          />
        )}

        {!loading && filtered.length === 0 && (
          <div
            className="text-text-muted flex flex-col items-center justify-center p-8"
            role="status"
          >
            <Icon name="search-off" size={48} className="mb-4" />
            <h3 className="text-lg font-semibold">Keine Modelle gefunden</h3>
            <p className="text-sm">Passe deine Filter oder den Suchbegriff an.</p>
          </div>
        )}
      </div>
    </section>
  );
}

interface ModelListVirtualizedProps {
  items: MergedEntry[];
  isFavoriteModel: (entry: MergedEntry) => boolean;
  toggleFavorite: (entry: MergedEntry) => void;
  onSelect: (id: string) => void;
  activeValue: string | null;
}

function ModelListVirtualized({
  items,
  isFavoriteModel,
  toggleFavorite,
  onSelect,
  activeValue,
}: ModelListVirtualizedProps) {
  const INITIAL_BATCH = 30;
  const BATCH_SIZE = 30;
  const [visibleCount, setVisibleCount] = React.useState(INITIAL_BATCH);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setVisibleCount(INITIAL_BATCH);
  }, [items]);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        setVisibleCount((prev) => Math.min(items.length, prev + BATCH_SIZE));
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [items.length]);

  const visibleItems = React.useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  const renderCard = (m: MergedEntry) => {
    const isFavorite = isFavoriteModel(m);
    const active = Boolean(
      activeValue &&
        (activeValue === m.id ||
          (m.ids && m.ids.includes(activeValue)) ||
          normalizeId(activeValue) === normalizeId(m.id)),
    );

    const handleSelect = () => onSelect(m.id);
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSelect();
      }
    };

    return (
      <Card
        key={m.id}
        role="option"
        aria-selected={active}
        tabIndex={0}
        className={cn(
          "cursor-pointer transition-all",
          active && "ring-2 ring-primary",
          "focus-visible:ring-2 focus-visible:ring-primary",
        )}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        data-testid="model-option"
      >
        <CardHeader className="flex-row items-start justify-between pb-2">
          <div className="flex-1">
            <CardTitle>{m.label ?? m.id}</CardTitle>
            <CardDescription>{m.provider ?? "Unbekannter Provider"}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn("rounded-full px-2 py-1", isFavorite && "text-yellow-400")}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
            onClick={(event) => {
              event.stopPropagation();
              toggleFavorite(m);
            }}
            data-testid="model-favorite-toggle"
          >
            <Icon name={isFavorite ? "star-filled" : "star"} size={18} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="text-text-muted flex items-center justify-between text-sm">
            <span title="Kontextfenster">
              {m.ctx ? `${m.ctx.toLocaleString("de-DE")} Tokens` : "—"}
            </span>
            <span title="Kosten pro 1k Tokens">
              {isFreeModel(m) || m.freeBadge ? "Frei" : formatPrice(m.pricing)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {isFreeModel(m) && <Badge variant="default">Free</Badge>}
            {isCodeModel(m) && <Badge variant="secondary">Code</Badge>}
            <Badge>{safetyLabel(m.safety)}</Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((m) => renderCard(m))}
      </div>
      <div ref={sentinelRef} aria-hidden="true" />
    </>
  );
}
