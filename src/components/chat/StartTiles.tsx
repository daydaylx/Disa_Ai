import { Book, Code, MessageSquare } from "lucide-react";
import type { ReactNode } from "react";

import { createGlassGradientVariants, DEFAULT_GLASS_VARIANTS } from "../../lib/theme/glass";
import { colors } from "../../styles/design-tokens";
import { GlassTile } from "../ui/GlassTile";

export type StartTileAction = { type: "new-chat" } | { type: "set-role"; roleId: string };

const startTiles: Array<{
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  action: StartTileAction;
}> = [
  {
    id: "new-chat",
    title: "Neuer Chat",
    subtitle: "Starte ein neues Gespräch",
    icon: <MessageSquare />,
    action: { type: "new-chat" },
  },
  {
    id: "developer-role",
    title: "Entwickler-Rolle",
    subtitle: "Starte einen Chat als Entwickler",
    icon: <Code />,
    action: { type: "set-role", roleId: "productivity_helper" },
  },
  {
    id: "creative-role",
    title: "Kreativ-Rolle",
    subtitle: "Starte einen Chat als kreativer Autor",
    icon: <Book />,
    action: { type: "set-role", roleId: "creative_writer" },
  },
];

interface StartTilesProps {
  onTileClick: (action: StartTileAction) => void;
}

export function StartTiles({ onTileClick }: StartTilesProps) {
  // Generate gradient strings for GlassTile (which expects string, not GlassTint)
  const getTileGradient = (index: number): string => {
    const gradientStrings = createGlassGradientVariants(colors.semantic.purple);
    return gradientStrings[index % gradientStrings.length] ?? DEFAULT_GLASS_VARIANTS[0]!;
  };

  const badgeTones: Array<"warm" | "cool" | "fresh"> = ["warm", "cool", "fresh"];

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {startTiles.map((tile, index) => (
        <GlassTile
          key={tile.id}
          title={tile.title}
          subtitle={tile.subtitle}
          icon={tile.icon}
          gradient={getTileGradient(index)}
          badgeTone={badgeTones[index % badgeTones.length]}
          onPress={() => onTileClick(tile.action)}
        />
      ))}
    </div>
  );
}
