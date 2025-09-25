import * as React from "react";
import { useMemo, useState } from "react";

import { GlassButton } from "../../components/glass/GlassButton";
import { GlassCard } from "../../components/glass/GlassCard";
import Accordion, { type AccordionItem } from "../../components/ui/Accordion";
import BottomSheet from "../../components/ui/BottomSheet";
import { Card, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { useToasts } from "../../components/ui/Toast";
import { fetchRoleTemplates, getRoleById, listRoleTemplates } from "../../config/roleStore";
import { getTemplateId, setTemplateId } from "../../config/settings";
import { cn } from "../../lib/cn";

export default function SettingsRoles() {
  const [currentRoleId, setCurrentRoleId] = useState<string | null>(() => getTemplateId());
  const [roles, setRoles] = useState(() => listRoleTemplates());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheet, setSheet] = useState<{ title: string; description: string; role?: any } | null>(
    null,
  );
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles;

    return roles.filter((role) =>
      (role.name + " " + (role.system || "") + " " + (role.tags?.join(" ") || ""))
        .toLowerCase()
        .includes(q),
    );
  }, [query, roles]);

  const sections: AccordionItem[] = Object.entries(categorizedRoles)
    .map(([_key, category]) => {
      const filteredCategoryRoles = filtered.filter((role) =>
        category.roles.some((catRole) => catRole.id === role.id),
      );

      return {
        title: `${category.emoji} ${category.title}`,
        meta: `${filteredCategoryRoles.length} Rollen verfügbar`,
        content: (
          <div className="space-y-2">
            {filteredCategoryRoles.map((role) => {
              const isActive = currentRoleId === role.id;
              const truncatedSystem =
                role.system && role.system.length > 120
                  ? role.system.substring(0, 120) + "..."
                  : role.system;

              return (
                <Card
                  key={role.id}
                  className={cn(isActive && "ring-2 ring-primary", "cursor-pointer")}
                  onClick={() => {
                    setSheet({
                      title: role.name,
                      description: role.system || "Keine Beschreibung verfügbar",
                      role: role,
                    });
                    setSheetOpen(true);
                  }}
                >
                  <CardHeader>
                    <CardTitle>{role.name}</CardTitle>
                    <CardDescription>{truncatedSystem || "Keine Beschreibung"}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        ),
        defaultOpen: true,
      };
    })
    .filter((section) => section.content.props.children.length > 0);

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
    <section className="space-y-4">
      {/* Current Role Display */}
      {currentRole && (
        <GlassCard variant="subtle" className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h6 className="flex items-center gap-2 font-medium text-white">
                <span className="text-accent-400">✓</span>
                {currentRole.name}
              </h6>
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
      )}

      {/* Search */}
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rollen suchen…"
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        />
        <GlassButton variant="ghost" size="sm" onClick={reloadRoles} disabled={loading}>
          {loading ? "⟳" : "🔄"}
        </GlassButton>
      </div>

      {/* Role Categories */}
      <Accordion items={sections} single={false} />

      {/* Actions */}
      {currentRole && (
        <div className="flex gap-3">
          <GlassButton variant="ghost" size="sm" onClick={clearRole} className="flex-1">
            Rolle zurücksetzen
          </GlassButton>
        </div>
      )}

      {/* Role Detail Sheet */}
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={sheet?.title ?? "Details"}
      >
        <div className="space-y-4">
          <div className="max-measure whitespace-pre-wrap text-sm">{sheet?.description}</div>
          {sheet?.role && (
            <div className="flex gap-2">
              <GlassButton
                variant={currentRoleId === sheet.role.id ? "accent" : "primary"}
                size="sm"
                onClick={() => {
                  if (currentRoleId === sheet.role.id) {
                    clearRole();
                  } else {
                    handleRoleChange(sheet.role.id);
                  }
                  setSheetOpen(false);
                }}
                className="flex-1"
              >
                {currentRoleId === sheet.role.id ? "Rolle entfernen" : "Rolle aktivieren"}
              </GlassButton>
            </div>
          )}
        </div>
      </BottomSheet>
    </section>
  );
}
