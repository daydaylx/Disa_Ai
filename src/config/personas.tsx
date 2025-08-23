import React from "react";
import { loadStyles, type StyleItem } from "../lib/configLoader";

type PersonaCtx = {
  styles: StyleItem[];
  loading: boolean;
  error: string | null;
  styleId: string | null;
  setStyleId: React.Dispatch<React.SetStateAction<string | null>>;
  current: StyleItem | null;
};

const PersonaContext = React.createContext<PersonaCtx | undefined>(undefined);
const STYLE_KEY = "disa_style_id";

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [styles, setStyles] = React.useState<StyleItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [styleId, setStyleId] = React.useState<string | null>(() => {
    try { return localStorage.getItem(STYLE_KEY); } catch { return null; }
  });

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { styles } = await loadStyles();
        if (!alive) return;
        setStyles(styles);
        if (!styleId && styles[0]) {
          try { localStorage.setItem(STYLE_KEY, styles[0].id); } catch {}
          setStyleId(styles[0].id);
        }
      } catch (e: any) {
        if (!alive) return;
        setError("Stile konnten nicht geladen werden.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []); // initial load

  React.useEffect(() => {
    try {
      if (styleId) localStorage.setItem(STYLE_KEY, styleId);
      else localStorage.removeItem(STYLE_KEY);
    } catch {}
  }, [styleId]);

  const current = React.useMemo<StyleItem | null>(
    () => styles.find(s => s.id === styleId) ?? null,
    [styles, styleId]
  );

  const value: PersonaCtx = { styles, loading, error, styleId, setStyleId, current };
  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersonaSelection() {
  const ctx = React.useContext(PersonaContext);
  if (!ctx) throw new Error("usePersonaSelection must be used within PersonaProvider");
  return ctx;
}
