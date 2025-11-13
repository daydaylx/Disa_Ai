import { useNavigate } from "react-router-dom";

import { TileCard } from "../components/ui/TileCard";
import { Brain, MessageSquare, Settings, Users } from "../lib/icons";

export default function StudioHome() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 py-4">
      <header className="space-y-2 pb-4">
        <h1 className="text-2xl font-semibold text-text-primary">Willkommen im Disa AI Studio</h1>
        <p className="max-w-2xl text-sm text-text-secondary">
          Dein ruhiges KI-Studio für klare, produktive Konversationen. Wähle eine Aktion, um zu
          starten.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TileCard
          icon={<MessageSquare className="h-8 w-8" />}
          title="Chat"
          description="Fokussierte Konversationen mit Streaming und Auto-Save."
          onClick={() => navigate("/chat")}
          aspectRatio="auto"
        />
        <TileCard
          icon={<Brain className="h-8 w-8" />}
          title="Modelle"
          description="Vergleiche Kosten, Kontext und Fähigkeiten der verfügbaren Modelle."
          onClick={() => navigate("/models")}
          aspectRatio="auto"
        />
        <TileCard
          icon={<Users className="h-8 w-8" />}
          title="Rollen"
          description="Nutze kuratierte Profile für Research, Schreiben oder Coding."
          onClick={() => navigate("/roles")}
          aspectRatio="auto"
        />
        <TileCard
          icon={<Settings className="h-8 w-8" />}
          title="Einstellungen"
          description="Verwalte API-Keys, Speicher, Filter und deine Daten."
          onClick={() => navigate("/settings")}
          aspectRatio="auto"
        />
      </div>
    </div>
  );
}
