import { useNavigate } from "react-router-dom";

import { Button, RoleCard } from "@/ui";

import { useRoles } from "../hooks/useRoles";
import { MessageSquare } from "../lib/icons";
import type { EnhancedRole } from "../types/enhanced-interfaces";

export default function StudioHome() {
  const navigate = useNavigate();
  const { roles, activeRole, activateRole } = useRoles();

  return (
    <div className="space-y-6 py-4 safe-area-vertical">
      {/* Hero Section with dominant primary action */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-text-primary">Disa AI</h1>
          <p className="text-sm text-text-secondary">
            Dein ruhiges KI-Studio für klare, produktive Konversationen
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full max-w-xs mx-auto text-base font-semibold"
            onClick={() => navigate("/chat")}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Chat starten
          </Button>
        </div>
      </div>

      {/* Horizontal list of roles */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium text-text-primary">Schnellstart-Rollen</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
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
    </div>
  );
}
