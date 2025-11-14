import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { Header } from "../../components/layout/Header";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { SettingsDrawer } from "../../components/shell/SettingsDrawer";
import { useSettings } from "../../hooks/useSettings";
import { cn } from "../../lib/utils";

interface AppShellProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { path: "/", label: "Studio" },
  { path: "/chat", label: "Chat" },
  { path: "/models", label: "Modelle" },
  { path: "/roles", label: "Rollen" },
  { path: "/settings", label: "Einstellungen" },
];

const MODEL_LABELS: Record<string, string> = {
  "openai/gpt-4o-mini": "GPT‑4o mini",
  "anthropic/claude-3.5-sonnet": "Claude 3.5 Sonnet",
  "meta-llama/llama-3.1-405b": "Llama 3.1 405B",
};

interface AppShellLayoutProps {
  children: ReactNode;
  location: ReturnType<typeof useLocation>;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  return <AppShellLayout location={location}>{children}</AppShellLayout>;
}

function AppShellLayout({ children, location }: AppShellLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { settings, toggleAnalytics, toggleNSFWContent, toggleNotifications, setPreferredModel } =
    useSettings();

  const { activePath, pageTitle } = useMemo(() => {
    const activeItem = NAV_ITEMS.find((item) =>
      item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path),
    );
    return {
      activePath: activeItem?.path ?? "/",
      pageTitle: activeItem?.label ?? "Studio",
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!isDrawerOpen) return undefined;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isDrawerOpen]);

  const modelLabel =
    MODEL_LABELS[settings.preferredModelId] ?? settings.preferredModelId ?? "Automatisch";

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[var(--bg0)] text-text-primary"
      style={{ backgroundImage: "var(--bg-gradient)" }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-skip-link focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-white focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accent"
      >
        Zum Hauptinhalt springen
      </a>

      <Header
        onOpenDrawer={() => setIsDrawerOpen(true)}
        title="Disa AI"
        subtitle={pageTitle}
        modelLabel={modelLabel}
      />

      <div className="border-b border-[var(--glass-border-soft)] bg-surface-base/40 backdrop-blur-xl">
        <nav
          aria-label="Primäre Navigation"
          className="mx-auto flex w-full max-w-5xl gap-2 overflow-x-auto px-page-padding-x py-2"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={`chip-${item.path}`}
              to={item.path}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
                activePath === item.path
                  ? "border-[var(--accent-border)] bg-[var(--accent-soft)] text-text-primary shadow-[0_12px_30px_rgba(97,231,255,0.3)]"
                  : "border-[var(--glass-border-soft)] text-text-muted hover:border-[var(--glass-border-strong)] hover:text-text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <main
        id="main"
        role="main"
        key={location.pathname}
        className="relative flex flex-1 flex-col overflow-hidden"
      >
        <div className="mx-auto flex h-full w-full max-w-5xl flex-1 flex-col overflow-y-auto px-page-padding-x py-page-padding-y">
          <div className="page-stack flex flex-1 flex-col">{children}</div>

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--glass-border-soft)] pt-4 text-[11px] text-text-muted">
            <span>Disa AI · Build</span>
            <BuildInfo />
          </footer>
        </div>
      </main>

      <NetworkBanner />
      <PWAInstallPrompt />
      {process.env.NODE_ENV === "development" && <PWADebugInfo />}

      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        navItems={NAV_ITEMS}
        activePath={activePath}
        selectedModelId={settings.preferredModelId}
        onSelectModel={(modelId) => {
          setPreferredModel(modelId);
          setIsDrawerOpen(false);
        }}
        toggles={{
          nsfw: { value: settings.showNSFWContent, onToggle: toggleNSFWContent },
          analytics: { value: settings.enableAnalytics, onToggle: toggleAnalytics },
          notifications: { value: settings.enableNotifications, onToggle: toggleNotifications },
        }}
      />
    </div>
  );
}
