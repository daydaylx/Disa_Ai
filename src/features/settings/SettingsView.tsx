import { Link } from "react-router-dom";

import { AppHeader, GlassCard, QuickStartCard, SectionHeader } from "@/ui";

import { BookOpenCheck, KeyRound, Palette, Shield, Upload } from "../../lib/icons";

export function SettingsView() {
  const cards = [
    {
      id: "api",
      title: "API-Key & Verbindung",
      description: "OpenRouter-Schlüssel verwalten und Proxy-Status prüfen",
      to: "/settings/api",
      icon: KeyRound,
    },
    {
      id: "memory",
      title: "Verlauf & Gedächtnis",
      description: "Lokales Gedächtnis und Datenschutzoptionen steuern",
      to: "/settings/memory",
      icon: BookOpenCheck,
    },
    {
      id: "filters",
      title: "Inhalte & Filter",
      description: "Sicherheitsfilter und Jugendschutz anpassen",
      to: "/settings/filters",
      icon: Shield,
    },
    {
      id: "appearance",
      title: "Darstellung",
      description: "Dunkles Design und Interface-Optionen",
      to: "/settings/appearance",
      icon: Palette,
    },
    {
      id: "data",
      title: "Import & Export",
      description: "Konversationen sichern und verwalten",
      to: "/settings/data",
      icon: Upload,
    },
  ];

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <AppHeader pageTitle="Einstellungen" />

      <div className="space-y-4 sm:space-y-6 px-[var(--spacing-4)] py-3 sm:py-[var(--spacing-6)]">
        <QuickStartCard
          primaryAction={{
            label: "API-Key speichern",
            to: "/settings/api",
          }}
          secondaryAction={{
            label: "Gedächtnis konfigurieren",
            to: "/settings/memory",
          }}
        />

        <div className="space-y-4">
          <SectionHeader
            variant="compact"
            title="Einstellungen"
            subtitle="Verwalte deine Daten, APIs und Darstellung"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((cardData) => {
              const Icon = cardData.icon;
              return (
                <GlassCard
                  key={cardData.id}
                  className="group cursor-pointer transition-transform hover:scale-105"
                >
                  <Link
                    to={cardData.to}
                    className="block p-4 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-2xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_8px_24px_rgba(97,231,255,0.2)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="text-base font-semibold text-text-primary group-hover:text-pink-300 transition-colors">
                          {cardData.title}
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {cardData.description}
                        </p>
                        <span className="text-xs font-medium text-accent">Details anzeigen →</span>
                      </div>
                    </div>
                  </Link>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
