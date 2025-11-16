import { useNavigate } from "react-router-dom";

import { Button, Card, RoleCard } from "@/ui";

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
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-text-primary">Disa AI</h1>
          <p className="text-sm text-text-secondary">
            Dein ruhiges KI-Studio für klare, produktive Konversationen
          </p>
        </div>

        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full max-w-xs mx-auto text-base font-semibold h-14"
            onClick={() => navigate("/chat")}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Chat starten
          </Button>
        </div>
      </div>

      {/* Horizontal list of roles */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-text-primary">Schnellstart-Rollen</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
          {roles.slice(0, 6).map((role: EnhancedRole) => (
            <div key={role.id} className="min-w-[280px] flex-shrink-0">
              <RoleCard
                role={role}
                isActive={activeRole?.id === role.id}
                onActivate={() => {
                  activateRole(role.id);
                  setTimeout(() => navigate("/chat"), 100); // Delay to allow state update
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Secondary actions */}
      <div className="pt-6">
        <h2 className="text-lg font-medium text-text-primary mb-4">Studio-Funktionen</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card
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
          </Card>

          <Card
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
          </Card>

          <Card
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
          </Card>
        </div>
      </div>
    </div>
  );
}
