import { useEffect, useState } from "react";

import { getCurrentLocale, getTranslations, type Locale, setLocale } from "../lib/i18n";

/**
 * Hook to access translations and current locale
 */
export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(getCurrentLocale);
  const [translations, setTranslations] = useState(() => getTranslations(locale));

  useEffect(() => {
    // Listen for locale changes from other tabs/components
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "disa:locale" && (event.newValue === "de" || event.newValue === "en")) {
        setLocaleState(event.newValue);
        setTranslations(getTranslations(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setLocaleState(newLocale);
    setTranslations(getTranslations(newLocale));
  };

  return {
    locale,
    t: translations,
    changeLocale,
  };
}
