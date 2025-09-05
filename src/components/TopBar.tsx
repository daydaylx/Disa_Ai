import React from "react";
import Icon from "./Icon";
import { applyTheme, getTheme, setTheme, type ThemeMode } from "../config/theme";

type Props = {
  onOpenConversations?: () => void;
};

function useActiveHash() {
  const [hash, setHash] = React.useState<string>(() => window.location.hash || "#/");
  React.useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash;
}

export default function TopBar({ onOpenConversations }: Props) {
  const hash = useActiveHash();
  const items = [
    { label: "Home", href: "#/", match: /^#\/?$/ },
    { label: "Chat", href: "#/chat", match: /^#\/chat/ },
    { label: "Einstellungen", href: "#/settings", match: /^#\/settings/ },
  ];

  const [mode, setMode] = React.useState<ThemeMode>(() => getTheme());
  React.useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  function cycleTheme() {
    setMode((m) => {
      const next: ThemeMode = m === "system" ? "dark" : m === "dark" ? "light" : "system";
      setTheme(next);
      return next;
    });
  }

  const isActive = (m: RegExp) => m.test(hash);

  return (
    <header className="topbar px-3 pt-3">
      <div className="topbar__bar flex items-center gap-2">
        <button
          type="button"
          className="icon-btn"
          aria-label="Gespräche öffnen"
          onClick={() => onOpenConversations?.()}
          title="Gespräche"
        >
          <Icon name="menu" width="16" height="16" />
        </button>

        <div className="ml-1 mr-1 select-none font-semibold">Disa AI</div>

        <nav className="nav">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className={`nav-pill ${isActive(it.match) ? "nav-pill--active" : ""}`}
            >
              {it.label}
            </a>
          ))}
        </nav>

        <div className="nav-spacer" />

        <button
          type="button"
          className="icon-btn"
          aria-label="Theme wechseln (System/Light/Dark)"
          onClick={cycleTheme}
          title={`Theme: ${mode}`}
        >
          {mode === "dark" ? (
            <Icon name="moon" width="16" height="16" />
          ) : mode === "light" ? (
            <Icon name="sun" width="16" height="16" />
          ) : (
            <Icon name="style" width="16" height="16" />
          )}
        </button>

        <a href="#/settings" className="icon-btn" aria-label="Einstellungen" title="Einstellungen">
          <Icon name="settings" width="16" height="16" />
        </a>

        <a className="nav-pill nav-primary" href="#/chat" title="Loslegen">
          Loslegen
        </a>
      </div>
    </header>
  );
}
