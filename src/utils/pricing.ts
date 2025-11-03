const DEFAULT_LOCALE = "de-DE";
const DEFAULT_SYMBOL = "$";

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(locale: string): Intl.NumberFormat {
  if (!formatterCache.has(locale)) {
    formatterCache.set(
      locale,
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }),
    );
  }
  return formatterCache.get(locale)!;
}

export function normalizePrice(value: unknown): number | undefined {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

export function coercePrice(value: unknown, fallback = 0): number {
  const normalized = normalizePrice(value);
  return normalized ?? fallback;
}

type FormatOptions = {
  locale?: string;
  currencySymbol?: string;
  unit?: "1K";
};

export function formatPricePerK(price: number, options?: FormatOptions): string {
  if (!Number.isFinite(price)) {
    return "—";
  }

  if (price === 0) {
    return "Kostenlos";
  }

  const locale = options?.locale ?? DEFAULT_LOCALE;
  const symbol = options?.currencySymbol ?? DEFAULT_SYMBOL;
  const formatter = getFormatter(locale);

  return `${symbol}${formatter.format(price)}/1K`;
}
