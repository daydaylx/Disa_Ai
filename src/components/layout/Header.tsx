import { useEffect, useState } from "react";

import { Moon, Settings, Sparkles, SunMedium } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { IconButton } from "../ui/IconButton";

interface HeaderProps {
  title: string;
  subtitle?: string;
  modelLabel?: string;
  onOpenDrawer?: () => void;
}

export function Header({ title, subtitle = "Studio", modelLabel, onOpenDrawer }: HeaderProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("aurora-theme") as "dark" | "light" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (nextTheme: "dark" | "light") => {
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("aurora-theme", nextTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <header className="sticky top-0 z-[var(--z-header)] bg-[color-mix(in_srgb,var(--bg0)_92%,transparent)]/95 backdrop-blur-2xl border-b border-[var(--glass-border-soft)] pt-safe-top">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-page-padding-x py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)]/18 text-[var(--accent)] shadow-[0_25px_50px_rgba(97,231,255,0.35)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold leading-tight tracking-tight">{title}</p>
            <p className="text-[11px] uppercase tracking-[0.32em] text-text-muted">{subtitle}</p>
          </div>
        </div>

        {modelLabel && (
          <div className="hidden md:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border-soft)] bg-surface-inline/80 px-4 py-1 text-xs font-medium text-text-primary shadow-[0_10px_25px_rgba(0,0,0,0.45)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
              Modell · {modelLabel}
            </span>
          </div>
        )}

        <div className="flex flex-shrink-0 items-center gap-2">
          <IconButton
            variant="secondary"
            size="md"
            aria-label={`Zum ${theme === "dark" ? "hellen" : "dunklen"} Modus wechseln`}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </IconButton>
          <IconButton
            aria-label="Modelle & Einstellungen öffnen"
            onClick={onOpenDrawer}
            className={cn("shadow-[0_25px_55px_rgba(97,231,255,0.45)]")}
          >
            <Settings className="h-5 w-5" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
