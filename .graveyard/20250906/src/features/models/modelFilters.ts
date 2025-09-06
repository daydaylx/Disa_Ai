export type Tag = "chat" | "code" | "nsfw" | "vision" | "long" | "free";

export interface Filters {
  q: string;
  tags: Partial<Record<Tag, boolean>>;
  maxPriceUsdPerMTok?: number; // optional, NICHT mit undefined setzen
}

export interface ModelLike {
  id: string;
  label?: string;
  description?: string;
  context?: number; // Tokens
  tags?: Tag[];
  pricing?: {
    prompt?: number; // USD per 1M tokens
    completion?: number; // USD per 1M tokens
    free?: boolean;
  };
}

export function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function matchesSearch(m: ModelLike, q: string) {
  if (!q) return true;
  const nq = normalize(q);
  const blob = normalize(
    [m.id, m.label ?? "", m.description ?? "", (m.tags ?? []).join(" ")].join(" | "),
  );
  return blob.includes(nq);
}

export function matchesTags(m: ModelLike, tags: Filters["tags"]) {
  if (!tags) return true;
  const set = new Set(m.tags ?? []);
  if (tags.free && !(m.pricing?.free === true)) return false;
  if (tags.code && !set.has("code")) return false;
  if (tags.nsfw && !set.has("nsfw")) return false;
  if (tags.vision && !set.has("vision")) return false;
  if (tags.long && !(m.context && m.context >= 128_000)) return false;
  return true;
}

export function matchesPrice(m: ModelLike, cap?: number) {
  if (cap == null) return true; // kein Cap → passt
  const p = m.pricing?.prompt ?? Number.POSITIVE_INFINITY;
  const c = m.pricing?.completion ?? Number.POSITIVE_INFINITY;
  const eff = Math.max(p, c);
  return eff <= cap;
}

export function filterModels(models: ModelLike[], f: Filters) {
  return models
    .filter((m) => matchesSearch(m, f.q))
    .filter((m) => matchesTags(m, f.tags))
    .filter((m) => matchesPrice(m, f.maxPriceUsdPerMTok));
}
