import * as React from "react";
import type { ModelEntry, Category, LoadOptions } from "../config/models";
import { loadModelCatalog, labelForModel, chooseDefaultModel, DEFAULT_MODEL_ID } from "../config/models";

const LS_SELECTED = "disa:models:selected";
const LS_FILTERS = "disa:models:filters";

export interface ModelFilters {
search: string;
freeOnly: boolean;
cheapOnly: boolean;
categories: Category[];
providers: string[];
tags: string[];
maxPriceIn?: number | null;
}

export interface UseModelOptions {
apiKey?: string;
allow?: string[];
preferFree?: boolean;
}

export interface UseModelState {
list: ModelEntry[];
filtered: ModelEntry[];
groups: Record<Category, ModelEntry[]>;
model: string;
setModel: (id: string) => void;
filters: ModelFilters;
setFilters: (next: ModelFilters) => void;
labelFor: (id: string) => string;
}

const DEFAULT_FILTERS: ModelFilters = {
search: "",
freeOnly: false,
cheapOnly: false,
categories: [],
providers: [],
tags: [],
maxPriceIn: null,
};

function persist<T>(key: string, value: T): void {
try {
localStorage.setItem(key, JSON.stringify(value));
} catch {
/* ignore */
}
}

function restore<T>(key: string, fallback: T): T {
try {
const raw = localStorage.getItem(key);
if (!raw) return fallback;
return JSON.parse(raw) as T;
} catch {
return fallback;
}
}

export function useModel(opts?: UseModelOptions): UseModelState {
const [list, setList] = React.useState<ModelEntry[]>([]);
const [model, setModelState] = React.useState<string>(() => restore<string>(LS_SELECTED, DEFAULT_MODEL_ID));
const [filters, setFiltersState] = React.useState<ModelFilters>(() => restore<ModelFilters>(LS_FILTERS, DEFAULT_FILTERS));

// Laden (mit Abbruch-Flag)
React.useEffect(() => {
let alive = true;
(async () => {
const baseOpts: LoadOptions = {};
if (opts?.allow && opts.allow.length > 0) baseOpts.allow = opts.allow;
if (opts?.preferFree === true) baseOpts.preferFree = true;

  const newList = await loadModelCatalog(baseOpts);
  if (!alive) return;
  setList(newList);

  // falls aktuelles Modell nicht in Liste: ersetzen
  if (!newList.some((m) => m.id === model)) {
    const args: { list?: ModelEntry[]; allow?: string[]; preferFree?: boolean } = {
      list: newList,
      ...(opts?.allow && opts.allow.length > 0 ? { allow: opts.allow } : {}),
      ...(opts?.preferFree ? { preferFree: true } : {}),
    };
    const def = chooseDefaultModel(args);
    setModelState(def);
    persist(LS_SELECTED, def);
  }
})();
return () => {
  alive = false;
};
// bewusst: nur bei allow/preferFree ändern
// eslint-disable-next-line react-hooks/exhaustive-deps


}, [opts?.allow?.join("|"), opts?.preferFree]);

const setModel = React.useCallback((id: string) => {
setModelState(id);
persist(LS_SELECTED, id);
}, []);

const labelFor = React.useCallback(
(id: string) => labelForModel(id, list),
[list]
);

const filtered: ModelEntry[] = React.useMemo(() => {
if (list.length === 0) return [];
const q = filters.search.trim().toLowerCase();
const catSet = new Set(filters.categories);
const provSet = new Set(filters.providers.map((p) => p.toLowerCase()));
const tagSet = new Set(filters.tags.map((t) => t.toLowerCase()));
const maxIn = typeof filters.maxPriceIn === "number" ? filters.maxPriceIn : null;

return list.filter((m) => {
  if (filters.freeOnly && !m.free) return false;
  if (filters.cheapOnly) {
    const pin = m.priceIn ?? 0;
    if (pin > 0.3) return false; // ~$0.30/M tok als "cheap"-Schwelle
  }
  if (catSet.size > 0) {
    if (!m.categories.some((c) => catSet.has(c))) return false;
  }
  if (provSet.size > 0) {
    if (!provSet.has(m.provider.toLowerCase())) return false;
  }
  if (tagSet.size > 0) {
    const lowerTags = m.tags.map((t) => t.toLowerCase());
    let all = true;
    tagSet.forEach((t) => {
      if (!lowerTags.includes(t)) all = false;
    });
    if (!all) return false;
  }
  if (maxIn !== null) {
    const pin = m.priceIn ?? 0;
    if (pin > maxIn) return false;
  }
  if (q.length > 0) {
    const hay = `${m.label} ${m.id} ${m.provider} ${m.tags.join(" ")}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
});


}, [list, filters]);

const groups: Record<Category, ModelEntry[]> = React.useMemo(() => {
const out: Record<Category, ModelEntry[]> = { general: [], coding: [], vision: [], long: [] };
for (const m of filtered) {
for (const c of m.categories) {
out[c].push(m);
}
}
const sorter = (a: ModelEntry, b: ModelEntry) => {
if (a.free && !b.free) return -1;
if (!a.free && b.free) return 1;
const ain = a.priceIn ?? 0;
const bin = b.priceIn ?? 0;
if (ain !== bin) return ain - bin;
return a.label.localeCompare(b.label);
};
out.general.sort(sorter);
out.coding.sort(sorter);
out.vision.sort(sorter);
out.long.sort(sorter);
return out;
}, [filtered]);

const setFilters = React.useCallback((next: ModelFilters) => {
setFiltersState(next);
persist(LS_FILTERS, next);
}, []);

return { list, filtered, groups, model, setModel, filters, setFilters, labelFor };
}
