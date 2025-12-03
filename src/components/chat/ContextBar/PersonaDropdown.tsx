import type { UIRole } from "@/data/roles";
import { useSettings } from "@/hooks/useSettings";
import { Check } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface PersonaDropdownProps {
  activeRole: UIRole | null;
  roles: UIRole[];
  onSelect: (role: UIRole | null) => void;
  onClose?: () => void;
}

export function PersonaDropdown({ activeRole, roles, onSelect, onClose }: PersonaDropdownProps) {
  const { settings } = useSettings();

  const isSafe = (role: UIRole) => {
    if (settings.showNSFWContent) return true;
    const isMature =
      role.category === "erwachsene" ||
      role.tags?.some((t) => ["nsfw", "adult", "18+", "erotic"].includes(t.toLowerCase()));
    return !isMature;
  };

  const roleOptions = roles.filter(isSafe);

  const handleSelect = (role: UIRole | null) => {
    onSelect(role);
    onClose?.();
  };

  return (
    <div className="w-[240px] p-1">
      <button
        type="button"
        onClick={() => handleSelect(null)}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-ink-primary transition-colors",
          "hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
          !activeRole && "bg-surface-1",
        )}
      >
        <span className="truncate">Standard</span>
        {!activeRole && <Check className="h-4 w-4 text-accent-primary" />}
      </button>

      {roleOptions.map((role) => (
        <button
          type="button"
          key={role.id}
          onClick={() => handleSelect(role)}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-ink-primary transition-colors",
            "hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
            activeRole?.id === role.id && "bg-surface-1",
          )}
        >
          <span className="truncate text-left">{role.name}</span>
          {activeRole?.id === role.id && <Check className="h-4 w-4 text-accent-primary" />}
        </button>
      ))}
    </div>
  );
}
