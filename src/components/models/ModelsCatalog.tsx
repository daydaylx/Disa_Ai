import { useEffect, useMemo, useState } from "react";

import { loadModelCatalog, type ModelEntry } from "@/config/models";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSettings } from "@/hooks/useSettings";
import { CheckCircle, Search, Sparkles, Star, Zap } from "@/lib/icons";
import { coercePrice, formatPricePerK } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Skeleton,
} from "@/ui";

interface ModelsCatalogProps {
  className?: string;
}

function getQualityScore(entry: ModelEntry) {
  if (typeof entry.qualityScore === "number") return entry.qualityScore;
  if (entry.tags.includes("flagship")) return 92;
  if (entry.tags.includes("fast")) return 78;
  return 70;
}

function getContextTokens(entry?: ModelEntry) {
  if (!entry) return 0;
  return entry.ctx ?? entry.contextTokens ?? 0;
}

function getPriceLabel(entry: ModelEntry) {
  const inputPrice = coercePrice(entry.pricing?.in, 0);
  const outputPrice = coercePrice(entry.pricing?.out, 0);
  if (inputPrice === 0 && outputPrice === 0) return "Kostenlos";
  if (inputPrice === 0) return `${formatPricePerK(outputPrice)} out`;
  if (outputPrice === 0) return `${formatPricePerK(inputPrice)} in`;
  return `${formatPricePerK(inputPrice)} · ${formatPricePerK(outputPrice, { currencySymbol: "" })} out`;
}

export function ModelsCatalog({ className }: ModelsCatalogProps) {
  const { settings, setPreferredModel } = useSettings();
  const { favorites, toggleModelFavorite, isModelFavorite } = useFavorites();
  const [catalog, setCatalog] = useState<ModelEntry[] | null>(null);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadModelCatalog()
      .then((data) => {
        if (!active) return;
        setCatalog(data);
        const preferred = data.find((m) => m.id === settings.preferredModelId);
        setSelectedId(preferred?.id ?? data[0]?.id ?? null);
      })
      .catch(() => {
        if (!active) return;
        setCatalog([]);
      });
    return () => {
      active = false;
    };
  }, [settings.preferredModelId]);

  const recommended = useMemo(() => {
    if (!catalog) return [] as ModelEntry[];
    return [...catalog].sort((a, b) => getQualityScore(b) - getQualityScore(a)).slice(0, 3);
  }, [catalog]);

  const filtered = useMemo(() => {
    if (!catalog) return [] as ModelEntry[];
    const query = search.trim().toLowerCase();
    if (!query) return catalog;
    return catalog.filter((entry) => {
      const haystack =
        `${entry.id} ${entry.label ?? ""} ${entry.provider ?? ""} ${entry.tags.join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [catalog, search]);

  const activeModelId = selectedId ?? settings.preferredModelId;

  return (
    <div className={cn("flex h-full flex-col gap-4", className)}>
      <div className="rounded-2xl border border-border-ink/15 bg-surface-1 p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
              Modelle
            </p>
            <h1 className="text-xl font-bold text-ink-primary">Schnellauswahl & Details</h1>
            <p className="text-sm text-ink-secondary">
              Finde ein Modell für deinen Anwendungsfall und setze es als Standard für neue Chats.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border-ink/20 bg-surface-2 px-3 py-2 text-xs text-ink-secondary">
            <CheckCircle className="h-4 w-4 text-accent-primary" />
            <span>{favorites.models.items.length} Favoriten</span>
            <span className="mx-1 text-border-ink">·</span>
            <span>{catalog?.length ?? 0} Modelle</span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr,320px] lg:items-center">
          <div className="flex items-center gap-3 rounded-xl border border-border-ink/20 bg-surface-1 px-3 py-2">
            <Search className="h-4 w-4 text-ink-tertiary" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nach Modellen suchen (z.B. GPT, Claude, Llama)"
              className="h-11 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
              aria-label="Modelle suchen"
            />
          </div>
          <div className="flex flex-wrap gap-2 rounded-xl border border-border-ink/20 bg-surface-2 px-3 py-2 text-xs text-ink-secondary">
            <Badge variant="outline" className="flex items-center gap-1 text-[11px]">
              <Zap className="h-3.5 w-3.5 text-accent-primary" />
              {settings.preferredModelId}
            </Badge>
            <Badge variant="secondary" className="text-[11px]">
              Kontext:{" "}
              {getContextTokens(catalog?.find((m) => m.id === settings.preferredModelId)) || "—"}{" "}
              Tokens
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
        <Card className="h-full" padding="sm">
          <CardHeader>
            <CardTitle className="text-lg">Empfehlungen</CardTitle>
            <CardDescription>
              Für die meisten Chats: robuste Modelle mit guter Qualität und Preis-Leistung.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {!catalog && (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            )}
            {catalog && recommended.length === 0 && (
              <p className="text-sm text-ink-secondary">Keine Modelle gefunden.</p>
            )}
            {recommended.map((model) => {
              const isActive = activeModelId === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(model.id);
                    setPreferredModel(model.id);
                  }}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition",
                    isActive
                      ? "border-accent-primary/50 bg-accent-primary/10 shadow-[0_8px_30px_-16px_rgba(109,140,255,0.8)]"
                      : "border-border-ink/20 bg-surface-1 hover:border-accent-primary/30 hover:bg-surface-2",
                  )}
                  aria-pressed={isActive}
                  data-testid={`recommended-${model.id}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-ink-secondary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-primary">
                      {model.label ?? model.id}
                    </p>
                    <p className="text-xs text-ink-secondary">{model.provider}</p>
                  </div>
                  <Badge variant={isActive ? "secondary" : "outline"} className="text-[11px]">
                    {getPriceLabel(model)}
                  </Badge>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-3">
          {catalog === null && (
            <div className="space-y-2 rounded-2xl border border-border-ink/20 bg-surface-1 p-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {catalog !== null && filtered.length === 0 && (
            <div className="rounded-2xl border border-border-ink/20 bg-surface-1 p-5 text-sm text-ink-secondary">
              Keine Modelle entsprechen deiner Suche. Entferne Filter oder prüfe die Schreibweise.
            </div>
          )}

          {filtered.map((model) => {
            const isActive = activeModelId === model.id;
            const isFavorite = isModelFavorite(model.id);
            return (
              <Card
                key={model.id}
                className="border border-border-ink/15"
                padding="sm"
                data-testid={`model-card-${model.id}`}
              >
                <CardHeader className="gap-2">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-ink-secondary">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base">{model.label ?? model.id}</CardTitle>
                      <CardDescription className="text-xs">{model.provider}</CardDescription>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-pressed={isFavorite}
                      aria-label={
                        isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"
                      }
                      onClick={() => toggleModelFavorite(model.id)}
                      className={cn(
                        "h-9 w-9 rounded-full",
                        isFavorite ? "text-accent-primary" : "text-ink-secondary",
                      )}
                      data-testid={`favorite-${model.id}`}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          isFavorite ? "fill-accent-primary text-accent-primary" : "",
                        )}
                      />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-3 space-y-3">
                  <div className="flex flex-wrap gap-2 text-xs text-ink-secondary">
                    <Badge variant="outline" className="text-[11px]">
                      Kontext{" "}
                      {getContextTokens(model)
                        ? `${Math.round(getContextTokens(model) / 1000)}K`
                        : "—"}
                    </Badge>
                    <Badge variant="outline" className="text-[11px]">
                      {getPriceLabel(model)}
                    </Badge>
                    {model.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[11px] capitalize">
                        {tag.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedId(model.id);
                        setPreferredModel(model.id);
                      }}
                      variant={isActive ? "secondary" : "primary"}
                      aria-pressed={isActive}
                    >
                      {isActive ? "Als Standard gesetzt" : "Als Standard nutzen"}
                    </Button>
                    <span className="text-xs text-ink-tertiary">
                      Qualitätsscore: {getQualityScore(model)} · Kontext{" "}
                      {getContextTokens(model) || "—"} Tokens
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
