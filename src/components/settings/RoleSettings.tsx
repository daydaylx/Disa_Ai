import * as React from "react";

import { fetchRoleTemplates, getRoleById, listRoleTemplates } from "../../config/roleStore";
import { getTemplateId, setTemplateId } from "../../config/settings";
import { GlassButton } from "../glass/GlassButton";
import { GlassCard } from "../glass/GlassCard";
import { useToasts } from "../ui/Toast";

export function RoleSettings() {
  const [currentRoleId, setCurrentRoleId] = React.useState<string | null>(() => getTemplateId());
  const [roles, setRoles] = React.useState(() => listRoleTemplates());
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const toasts = useToasts();

  // Load roles on mount
  React.useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedRoles = await fetchRoleTemplates(false);
        setRoles(loadedRoles);
      } catch (err) {
        setError("Rollen konnten nicht geladen werden");
        console.error("Failed to load roles:", err);
      } finally {
        setLoading(false);
      }
    };

    if (roles.length === 0) {
      void loadRoles();
    }
  }, [roles.length]);

  const currentRole = React.useMemo(() => {
    return currentRoleId ? getRoleById(currentRoleId) : null;
  }, [currentRoleId]);

  const handleRoleChange = (roleId: string | null) => {
    setCurrentRoleId(roleId);
    setTemplateId(roleId);

    const roleName = roleId ? getRoleById(roleId)?.name || roleId : "Standard";
    toasts.push({
      kind: "success",
      title: "Rolle geändert",
      message: `Rolle auf "${roleName}" gesetzt.`,
    });
  };

  const clearRole = () => {
    handleRoleChange(null);
  };

  const reloadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedRoles = await fetchRoleTemplates(true); // force reload
      setRoles(loadedRoles);
      toasts.push({
        kind: "success",
        title: "Rollen aktualisiert",
        message: "Rollenliste erfolgreich neu geladen.",
      });
    } catch {
      setError("Fehler beim Neuladen der Rollen");
      toasts.push({
        kind: "error",
        title: "Fehler",
        message: "Rollen konnten nicht neu geladen werden.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Group roles by category based on their characteristics
  const getRoleCategory = (role: any) => {
    const name = role.name.toLowerCase();
    const id = role.id.toLowerCase();

    if (
      name.includes("nsfw") ||
      name.includes("roleplay") ||
      name.includes("erotik") ||
      name.includes("unzensiert") ||
      id.includes("nsfw") ||
      id.includes("uncensored")
    ) {
      return "adult";
    }
    if (
      name.includes("therapist") ||
      name.includes("coach") ||
      name.includes("fitness") ||
      name.includes("nutrition") ||
      id.includes("therapist") ||
      id.includes("coach")
    ) {
      return "health";
    }
    if (
      name.includes("jurist") ||
      name.includes("legal") ||
      name.includes("anwalt") ||
      id.includes("legal")
    ) {
      return "professional";
    }
    if (
      name.includes("teacher") ||
      name.includes("lehrer") ||
      name.includes("autor") ||
      name.includes("creative") ||
      id.includes("teacher") ||
      id.includes("creative")
    ) {
      return "creative";
    }
    return "general";
  };

  const categorizedRoles = React.useMemo(() => {
    const categories = {
      general: { title: "Allgemein", emoji: "👤", roles: [] as any[] },
      professional: { title: "Beruflich", emoji: "💼", roles: [] as any[] },
      creative: { title: "Kreativ & Bildung", emoji: "🎓", roles: [] as any[] },
      health: { title: "Gesundheit & Coaching", emoji: "🏥", roles: [] as any[] },
      adult: { title: "Erwachsene Inhalte", emoji: "🔞", roles: [] as any[] },
    };

    roles.forEach((role) => {
      const category = getRoleCategory(role);
      categories[category as keyof typeof categories]?.roles.push(role);
    });

    return categories;
  }, [roles]);

  const renderRoleCard = (role: any) => {
    const isActive = currentRoleId === role.id;
    const truncatedSystem =
      role.system?.length > 120 ? role.system.substring(0, 120) + "..." : role.system;

    return (
      <GlassButton
        key={role.id}
        variant={isActive ? "accent" : "secondary"}
        size="lg"
        onClick={() => handleRoleChange(role.id)}
        className="relative flex h-auto w-full flex-col items-start gap-3 p-5 text-left transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="flex w-full items-start justify-between">
          <div className="min-w-0 flex-1">
            <h6 className="mb-1 text-base font-semibold text-white">{role.name}</h6>
            {isActive && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-accent-500">✓</span>
                <span className="text-xs font-medium text-accent-400">Aktiv</span>
              </div>
            )}
          </div>
          <div className="ml-2 flex-shrink-0">
            {isActive && (
              <div className="rounded-full border border-accent-500/40 bg-accent-500/20 p-1">
                <span className="text-lg text-accent-400">👤</span>
              </div>
            )}
          </div>
        </div>

        {truncatedSystem && (
          <p className="line-clamp-3 text-sm leading-relaxed text-gray-300">{truncatedSystem}</p>
        )}

        {role.tags && role.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {role.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="rounded-lg bg-white/15 px-3 py-1 text-xs font-medium text-gray-200"
              >
                {tag}
              </span>
            ))}
            {role.tags.length > 3 && (
              <span className="text-xs text-gray-400">+{role.tags.length - 3} mehr</span>
            )}
          </div>
        )}
      </GlassButton>
    );
  };

  const renderCategory = (categoryKey: string, category: any) => {
    if (category.roles.length === 0) return null;

    return (
      <div key={categoryKey} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/10 p-2">
            <span className="text-2xl">{category.emoji}</span>
          </div>
          <div className="flex-1">
            <h5 className="text-lg font-semibold text-white">{category.title}</h5>
            <p className="text-sm text-gray-400">{category.roles.length} Rollen verfügbar</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">{category.roles.map(renderRoleCard)}</div>
      </div>
    );
  };

  // Skeleton loading component
  const SkeletonRoleCard = () => (
    <div className="space-y-3">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-700"></div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg bg-gray-800/50 p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-600"></div>
            <div className="h-3 w-full animate-pulse rounded bg-gray-700"></div>
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-700"></div>
            <div className="mt-2 flex gap-2">
              <div className="h-5 w-12 animate-pulse rounded-full bg-gray-600"></div>
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-600"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading && roles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">KI-Rollen</h4>
              <div className="mt-1 h-4 w-32 animate-pulse rounded bg-gray-700"></div>
            </div>
            <div className="h-8 w-8 animate-pulse rounded bg-gray-700"></div>
          </div>
          <div className="h-16 animate-pulse rounded-lg bg-gray-800/30"></div>
        </div>
        <SkeletonRoleCard />
        <SkeletonRoleCard />
      </div>
    );
  }

  if (error && roles.length === 0) {
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-white">KI-Rollen</h4>
        <GlassCard variant="subtle" className="p-6 text-center">
          <p className="mb-3 text-sm text-red-400">{error}</p>
          <GlassButton variant="secondary" onClick={reloadRoles} disabled={loading}>
            Erneut versuchen
          </GlassButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Role Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white">KI-Rollen</h4>
            <p className="text-sm text-gray-400">
              {currentRole ? `Aktiv: ${currentRole.name}` : "Keine Rolle aktiv"}
            </p>
          </div>
          <div className="flex gap-2">
            <GlassButton variant="ghost" size="sm" onClick={reloadRoles} disabled={loading}>
              {loading ? "⟳" : "🔄"}
            </GlassButton>
          </div>
        </div>

        {currentRole ? (
          <GlassCard variant="subtle" className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h6 className="font-medium text-white">{currentRole.name}</h6>
                <GlassButton variant="ghost" size="sm" onClick={clearRole}>
                  Entfernen
                </GlassButton>
              </div>
              {currentRole.system && (
                <p className="line-clamp-3 text-sm text-gray-400">{currentRole.system}</p>
              )}
              {currentRole.tags && currentRole.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {currentRole.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-cyan-400/20 px-2 py-1 text-xs text-cyan-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        ) : (
          <GlassCard variant="subtle" className="p-4 text-center">
            <p className="text-sm text-gray-400">Keine Rolle ausgewählt - Standard KI-Verhalten</p>
          </GlassCard>
        )}
      </div>

      {/* Role Categories */}
      <div className="space-y-6">
        {Object.entries(categorizedRoles).map(([key, category]) => renderCategory(key, category))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white">Aktionen</h4>
        </div>

        <div className="flex gap-3">
          {currentRole && (
            <GlassButton variant="ghost" size="sm" onClick={clearRole} className="flex-1">
              Rolle zurücksetzen
            </GlassButton>
          )}
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={reloadRoles}
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Lädt..." : "Neu laden"}
          </GlassButton>
        </div>

        {/* Live Role Info */}
        <GlassCard variant="subtle" className="p-3">
          <div className="space-y-1 text-xs text-gray-400">
            <div>
              Aktive Rolle: <span className="text-cyan-400">{currentRole?.name || "Keine"}</span>
            </div>
            <div>
              Verfügbare Rollen: <span className="text-cyan-400">{roles.length}</span>
            </div>
            <div>
              Status: <span className="text-cyan-400">{loading ? "Lädt" : "Bereit"}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
