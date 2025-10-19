import { de } from "./locales/de";
import { en } from "./locales/en";

export type Locale = "de" | "en";

const translations = {
  de,
  en,
} as const;

/**
 * Get the current locale from browser or localStorage
 */
export function getCurrentLocale(): Locale {
  if (typeof window === "undefined") return "de";

  try {
    // Check localStorage first
    const stored = localStorage.getItem("disa:locale");
    if (stored === "en" || stored === "de") return stored;

    // Fall back to browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("en")) return "en";
    return "de"; // Default to German
  } catch {
    return "de";
  }
}

/**
 * Set the current locale
 */
export function setLocale(locale: Locale): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("disa:locale", locale);
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent("storage", { key: "disa:locale", newValue: locale }));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get translations for the current locale
 */
export function getTranslations(locale: Locale = getCurrentLocale()) {
  return translations[locale];
}

/**
 * Translation helper type for nested paths
 */
type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}${D}${Join<Extract<R, string[]>, D>}`
        : never
      : string;

export type TranslationPath = Join<PathsToStringProps<typeof de>, ".">;

/**
 * Get a nested translation by dot-notation path
 */
export function t(path: TranslationPath, locale: Locale = getCurrentLocale()): any {
  const translations = getTranslations(locale);
  const keys = path.split(".");

  let result: any = translations;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      console.warn(`Translation missing for path: ${path} (locale: ${locale})`);
      return path;
    }
  }

  return result;
}

// Re-export for convenience
export { de, en };
export type { Translations } from "./locales/de";
