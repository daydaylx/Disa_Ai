import { useEffect, useState } from "react";

import { useRoles } from "../../contexts/RolesContext";
import { User, X } from "../../lib/icons";

export function RoleActiveBanner() {
  const { activeRole } = useRoles();
  const [visible, setVisible] = useState(false);
  const [lastRoleId, setLastRoleId] = useState<string | null>(null);

  useEffect(() => {
    if (activeRole?.id && activeRole.id !== lastRoleId) {
      setVisible(true);
      setLastRoleId(activeRole.id);

      // Auto-hide after 6s
      const timer = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [activeRole, lastRoleId]);

  if (!visible || !activeRole) return null;

  return (
    <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-notification w-[90%] max-w-sm animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="bg-surface-2/98 backdrop-blur-sm border border-accent-primary/20 shadow-md rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
        <div className="bg-brand/10 p-2 rounded-lg text-brand shrink-0">
          <User className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text-primary">{activeRole.name} aktiv</p>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            Du sprichst jetzt mit dieser Rolle. Du kannst sie jederzeit über das Menü oben ändern.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-ink-secondary hover:text-text-primary p-1 -mr-1"
          aria-label="Schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
