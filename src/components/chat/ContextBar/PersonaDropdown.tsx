import { useNavigate } from "react-router-dom";

import { useFavorites } from "@/contexts/FavoritesContext";
import type { UIRole } from "@/data/roles";
import { useSettings } from "@/hooks/useSettings";
import { Check, Lock, Search } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

interface PersonaDropdownProps {
  activeRole: UIRole | null;
  roles: UIRole[];
  onSelect: (role: UIRole | null) => void;
  onClose?: () => void;
}

export function PersonaDropdown({ activeRole, roles, onSelect, onClose }: PersonaDropdownProps) {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { favorites } = useFavorites(); // Get favorites directly

  // Use the ids of favorites to filter UIRole[] directly
  const favoriteRoleIds = new Set(favorites.roles?.items || []);
  const favoritesList = roles.filter((role) => favoriteRoleIds.has(role.id));

  // Safety Filter - youth filtering means !showNSFWContent
  const isSafe = (role: UIRole) => {
    if (settings.showNSFWContent) return true; // Not in youth filter mode
    // Simplified check based on existing logic
    const isMature =
      role.category === "erwachsene" ||
      role.tags?.some((t) => ["nsfw", "adult", "18+", "erotic"].includes(t.toLowerCase()));
    return !isMature;
  };

  // Filter roles for display
  const safeFavorites = favoritesList.filter(isSafe).slice(0, 5); // Limit to 5 favorites

  const handleSelect = (role: UIRole | null) => {
    onSelect(role);
    onClose?.();
  };

  return (
    <div className="w-[280px] p-2">
      {/* Section: Current Role */}
      <div className="mb-2 rounded-md bg-surface-2 p-3">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink-primary">
          <span>Aktive Rolle</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-1 text-xl shadow-sm">
            {"🧠"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-primary">
              {activeRole?.name || "Disa Standard"}
            </p>
            <p className="line-clamp-2 text-xs text-ink-secondary">
              {activeRole?.description ||
                "Der vielseitige Standard-Assistent für alltägliche Aufgaben."}
            </p>
          </div>
        </div>
      </div>

      {/* Section: Favorites */}
      {safeFavorites.length > 0 && (
        <div className="mb-2">
          <div className="px-2 py-1.5 text-xs font-medium text-ink-secondary uppercase tracking-wider">
            Favoriten
          </div>
          <div className="space-y-1">
            {safeFavorites.map((role) => (
              <button
                key={role.id}
                onClick={() => handleSelect(role)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                  "hover:bg-surface-2 focus:bg-surface-2 focus:outline-none",
                  activeRole?.id === role.id
                    ? "bg-surface-2 text-ink-primary font-medium"
                    : "text-ink-primary",
                )}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-base">
                  {"•"}
                </span>
                <span className="flex-1 truncate text-left">{role.name}</span>
                {activeRole?.id === role.id && <Check className="h-4 w-4 text-accent-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section: Standard Option if not selected */}
      {activeRole && (
        <button
          onClick={() => handleSelect(null)}
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-ink-primary hover:bg-surface-2"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center text-base">🧠</span>
          <span className="flex-1 text-left">Zurück zum Standard</span>
        </button>
      )}

      {/* Divider */}
      <div className="my-2 h-px bg-border-ink/50" />

      {/* Section: Navigation */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-ink-secondary hover:text-ink-primary"
        onClick={() => {
          void navigate("/roles");
          onClose?.();
        }}
      >
        <Search className="h-4 w-4" />
        Alle Rollen anzeigen…
      </Button>

      {/* Youth Protection Hint */}
      {!settings.showNSFWContent && (
        <div className="mt-2 flex items-center gap-2 px-2 py-1 text-[10px] text-ink-tertiary">
          <Lock className="h-3 w-3" />
          <span>Jugendschutz aktiv: Einige Rollen ausgeblendet.</span>
        </div>
      )}
    </div>
  );
}
