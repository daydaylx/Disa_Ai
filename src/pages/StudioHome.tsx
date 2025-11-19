import { useNavigate } from "react-router-dom";

import { GlassCard, PrimaryButton, RoleCard, SectionHeader } from "@/ui";

import { useRoles } from "../hooks/useRoles";
import { Brain, MessageSquare, Settings, Users } from "../lib/icons";
import type { EnhancedRole } from "../types/enhanced-interfaces";

export default function StudioHome() {
  const navigate = useNavigate();
  const { roles, activeRole, activateRole } = useRoles();

  return (
    <div className="space-y-6 py-4 safe-area-vertical">
      {/* Hero Section with dominant primary action */}
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <SectionHeader
          title="Dein ruhiges KI-Studio"
          subtitle="für klare, produktive Konversationen"
        />

        <div className="pt-4">
          <PrimaryButton
            size="lg"
            className="w-full max-w-xs mx-auto"
            onClick={() => navigate("/chat")}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Neuer Chat
          </PrimaryButton>
        </div>
      </div>

      {/* Horizontal list of roles */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-text-primary">Schnellstart-Rollen</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
          {roles.slice(0, 6).map((role: EnhancedRole) => (
            <div key={role.id} className="min-w-[280px] flex-shrink-0">
              <GlassCard
                onClick={() => {
                  activateRole(role.id);
                  setTimeout(() => navigate("/chat"), 100); // Delay to allow state update
                }}
                className="cursor-pointer"
              >
                <h3 className="font-semibold text-text-primary">{role.name}</h3>
                <p className="text-sm text-text-secondary">{role.description}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary actions */}
      <div className="pt-6">
        <h2 className="text-lg font-medium text-text-primary mb-4">Studio-Funktionen</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <GlassCard
            onClick={() => navigate("/models")}
            className="flex items-center gap-4 p-4 cursor-pointer"
          >
            <Brain className="h-8 w-8 text-accent" />
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary">Modelle</h3>
              <p className="text-sm text-text-secondary">
                Vergleiche Kosten, Kontext und Fähigkeiten
              </p>
            </div>
          </GlassCard>

          <GlassCard
            onClick={() => navigate("/roles")}
            className="flex items-center gap-4 p-4 cursor-pointer"
          >
            <Users className="h-8 w-8 text-accent" />
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary">Rollen</h3>
              <p className="text-sm text-text-secondary">
                Nutze kuratierte Profile für verschiedene Aufgaben
              </p>
            </div>
          </GlassCard>

          <GlassCard
            onClick={() => navigate("/settings")}
            className="flex items-center gap-4 p-4 cursor-pointer"
          >
            <Settings className="h-8 w-8 text-accent" />
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary">Einstellungen</h3>
              <p className="text-sm text-text-secondary">
                Verwalte API-Keys, Speicher und deine Daten
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
