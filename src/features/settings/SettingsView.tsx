import { Link } from "react-router-dom";

import { PremiumCard, QuickStartCard, SectionHeader } from "@/ui";

import { useSettings } from "../../hooks/useSettings";
import { BookOpenCheck, Database, Shield, SlidersHorizontal } from "../../lib/icons";

export function SettingsView() {
  const { settings, toggleNSFWContent } = useSettings();
  const youthProtectionEnabled = !settings.showNSFWContent;

  const cards = [
    {
      id: "memory",
      title: "Gedächtnis",
      description: "Profil, Verlauf & Reset des lokalen Gedächtnisses",
      to: "/settings/memory",
      icon: BookOpenCheck,
    },
    {
      id: "behavior",
      title: "KI Verhalten",
      description: "Diskussionsstil, Kreativität, Antwortlänge & Darstellung",
      to: "/settings/behavior",
      icon: SlidersHorizontal,
    },
    {
      id: "youth",
      title: "Jugendfilter",
      description: "Jugendschutz / NSFW-Anzeige zentral steuern",
      to: "/settings/youth",
      icon: Shield,
    },
    {
      id: "api-data",
      title: "API & Daten",
      description: "API-Key, Import/Export und Speicherstatistiken",
      to: "/settings/api-data",
      icon: Database,
    },
  ];

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <SectionHeader title="Einstellungen" />

      <div className="space-y-4 sm:space-y-6 px-4 py-3 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between rounded-md border bg-surface-inset px-4 py-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text-primary">Jugendschutz Schnellschalter</p>
            <p className="text-xs text-text-muted">
              Schaltet den Jugendfilter sofort um (wirkt auf alle neuen Antworten).
            </p>
          </div>
          <button
            onClick={toggleNSFWContent}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-fast ${
              youthProtectionEnabled ? "bg-brand shadow-brandGlow" : "bg-surface-inset"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-fast ${
                youthProtectionEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <QuickStartCard
          primaryAction={{
            label: "API-Key speichern",
            to: "/settings/api-data",
          }}
          secondaryAction={{
            label: "Gedächtnis einstellen",
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
