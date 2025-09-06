/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
import * as React from "react";

import { loadStyles, type StyleItem } from "../lib/configLoader";

const STYLE_KEY = "disa_style_id";

export const PersonaContext = React.createContext<{
  styles: StyleItem[];
  loading: boolean;
  error: string | null;
  styleId: string | null;
  setStyleId: React.Dispatch<React.SetStateAction<string | null>>;
  current: StyleItem | null;
}>({
  styles: [],
  loading: true,
  error: null,
  styleId: null,
  setStyleId: () => {},
  current: null,
});

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [styles, setStyles] = React.useState<StyleItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [styleId, setStyleId] = React.useState<string | null>(() => {
    try {
      return localStorage.getItem(STYLE_KEY);
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const items = await loadStyles();
        if (!alive) return;
        setStyles(items);
        if (!styleId && items[0]?.id) {
          try {
            localStorage.setItem(STYLE_KEY, items[0].id);
          } catch {}
          setStyleId(items[0].id);
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Konnte Stile nicht laden");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const current = React.useMemo<StyleItem | null>(
    () => styles.find((s) => s.id === styleId) ?? styles[0] ?? null,
    [styles, styleId],
  );

  const value = React.useMemo(
    () => ({
      styles,
      loading,
      error,
      styleId,
      setStyleId,
      current,
    }),
    [styles, loading, error, styleId, setStyleId, current],
  );

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersonaSelection() {
  return React.useContext(PersonaContext);
}

export type { StyleItem } from "../lib/configLoader";
