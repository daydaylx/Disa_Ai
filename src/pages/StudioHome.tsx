import { useNavigate } from "react-router-dom";

import { PremiumCard } from "@/ui";

import { useRoles } from "../hooks/useRoles";
import { Brain, MessageSquare, Settings, Users } from "../lib/icons";
import type { EnhancedRole } from "../types/enhanced-interfaces";

export default function StudioHome() {
  const navigate = useNavigate();
  const { roles, activeRole: _activeRole, activateRole } = useRoles();

  return (
    <div className="space-y-8 py-6 px-4 safe-area-vertical">
      {/* HERO SECTION - Material */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-text-on-raised">Dein ruhiges KI-Studio</h1>
          <p className="text-lg text-text-secondary">für klare, produktive Konversationen</p>
        </div>

        {/* HERO CARD - "Neuer Chat" */}
        <PremiumCard
          variant="hero"
          className="max-w-xs mx-auto cursor-pointer hover:shadow-brandGlowLg transition-all group"
          onClick={() => navigate("/chat")}
        >
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="w-10 h-10 rounded-sm bg-brand shadow-brandGlow flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-text-on-raised">Neuer Chat</span>
          </div>
        </PremiumCard>
      </div>

      {/* SCHNELLSTART-ROLLEN */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-text-secondary px-2">Schnellstart-Rollen</h2>
        {/* INSET CONTAINER for horizontal scroll */}
        <div className="rounded-md bg-surface-inset shadow-inset p-3">
          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {roles.slice(0, 6).map((role: EnhancedRole) => (
              <div key={role.id} className="min-w-[280px] flex-shrink-0">
                <PremiumCard
                  variant="default"
                  onClick={() => {
                    activateRole(role.id);
                    setTimeout(() => navigate("/chat"), 100);
                  }}
                  className="cursor-pointer hover:shadow-raiseLg transition-all h-full"
                >
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-sm bg-surface-inset shadow-inset flex items-center justify-center">
                      <Users className="w-4 h-4 text-text-accent" />
                    </div>
                    <h3 className="font-semibold text-text-on-raised">{role.name}</h3>
                  </div>
                  {/* Description */}
                  <p className="text-sm text-text-secondary line-clamp-2">{role.description}</p>
                </PremiumCard>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STUDIO-FUNKTIONEN */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-text-secondary px-2">Studio-Funktionen</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Modelle */}
          <PremiumCard
            variant="default"
            onClick={() => navigate("/models")}
            className="cursor-pointer hover:shadow-raiseLg transition-all group"
          >
            <div className="flex items-center gap-4">
              {/* Icon Inset */}
              <div className="w-12 h-12 rounded-sm bg-surface-inset shadow-inset flex items-center justify-center group-hover:bg-brand/10 transition-colors">
                <Brain className="w-6 h-6 text-text-accent group-hover:text-brand transition-colors" />
              </div>
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-xl text-text-on-raised mb-1">Modelle</h3>
                <p className="text-sm text-text-secondary">
                  Vergleiche Kosten, Kontext und Fähigkeiten
                </p>
              </div>
            </div>
          </PremiumCard>

          {/* Rollen */}
          <PremiumCard
            variant="default"
            onClick={() => navigate("/roles")}
            className="cursor-pointer hover:shadow-raiseLg transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-sm bg-surface-inset shadow-inset flex items-center justify-center group-hover:bg-brand/10 transition-colors">
                <Users className="w-6 h-6 text-text-accent group-hover:text-brand transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xl text-text-on-raised mb-1">Rollen</h3>
                <p className="text-sm text-text-secondary">
                  Nutze kuratierte Profile für verschiedene Aufgaben
                </p>
              </div>
            </div>
          </PremiumCard>

          {/* Einstellungen */}
          <PremiumCard
            variant="default"
            onClick={() => navigate("/settings")}
            className="cursor-pointer hover:shadow-raiseLg transition-all group sm:col-span-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-sm bg-surface-inset shadow-inset flex items-center justify-center group-hover:bg-brand/10 transition-colors">
                <Settings className="w-6 h-6 text-text-accent group-hover:text-brand transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xl text-text-on-raised mb-1">Einstellungen</h3>
                <p className="text-sm text-text-secondary">
                  Verwalte API-Keys, Speicher und deine Daten
                </p>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}
