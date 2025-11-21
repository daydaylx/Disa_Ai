import { Link } from "react-router-dom";

import { PremiumCard, QuickStartCard, SectionHeader } from "@/ui";

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
      <SectionHeader title="Einstellungen" />

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

        <div className="grid gap-4 sm:grid-cols-2 max-w-4xl mx-auto">
          {cards.map((cardData) => {
            const Icon = cardData.icon;
            return (
              <Link key={cardData.id} to={cardData.to} className="block">
                <PremiumCard className="group h-full">
                  <div className="flex items-start gap-3">
                    {/* Icon Container mit Brand-Akzent */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand/10 shadow-brandGlow group-hover:shadow-brandGlowLg transition-all duration-fast">
                      <Icon className="h-5 w-5 text-brand" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="text-base font-semibold text-text-primary group-hover:text-brand transition-colors">
                        {cardData.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {cardData.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
                        Details
                        <span className="text-brand-bright">→</span>
                      </span>
                    </div>
                  </div>
                </PremiumCard>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
