import { Link } from "react-router-dom";

import { AppHeader, GlassCard, QuickStartCard } from "@/ui";

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

      <div className="space-y-4 sm:space-y-6 px-4 py-3 sm:px-6 sm:py-6">
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

        <div className="space-y-4 bg-surface-inset shadow-inset p-4 rounded-lg">
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((cardData) => {
              const Icon = cardData.icon;
              return (
                <GlassCard
                  key={cardData.id}
                  variant="raised"
                  className="group cursor-pointer transition-all duration-fast hover:shadow-raiseLg animate-card-enter"
                >
                  <Link
                    to={cardData.to}
                    className="block p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-surface-inset shadow-inset">
                        <Icon className="h-5 w-5 text-accent-primary" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="text-base font-semibold text-text-on-raised group-hover:text-accent-primary transition-colors">
                          {cardData.title}
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {cardData.description}
                        </p>
                        <span className="text-xs font-medium text-accent-primary">Details anzeigen →</span>
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
