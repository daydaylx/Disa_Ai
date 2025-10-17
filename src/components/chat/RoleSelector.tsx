import { Bot, ChevronDown, Search, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Role } from "../../data/roles";
import { getRoles, loadRoles } from "../../data/roles";
import { useSettings } from "../../hooks/useSettings";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface RoleSelectorProps {
  selectedRole: Role | null;
  onRoleChange: (role: Role | null) => void;
  className?: string;
}

export function RoleSelector({ selectedRole, onRoleChange, className }: RoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [allRoles, setAllRoles] = useState<Role[]>(() => getRoles());
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const {
    settings: { showNSFWContent },
  } = useSettings();

  const isNSFWRole = useCallback((role: Role): boolean => {
    const nsfwCategories = ["erwachsene"];
    const nsfwTags = ["adult", "nsfw"];
    return (
      nsfwCategories.includes(role.category?.toLowerCase() || "") ||
      role.tags?.some((tag) => nsfwTags.includes(tag.toLowerCase())) ||
      false
    );
  }, []);

  useEffect(() => {
    const loadAllRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const roles = await loadRoles();
        setAllRoles(roles);
      } catch (error) {
        console.warn("Failed to load external roles, using defaults:", error);
        setAllRoles(getRoles());
      } finally {
        setIsLoadingRoles(false);
      }
    };

    void loadAllRoles();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(allRoles.map((p) => p.category).filter((c): c is string => Boolean(c)));
    return Array.from(cats);
  }, [allRoles]);

  const filteredRoles = useMemo(() => {
    let roles = allRoles;

    if (!showNSFWContent) {
      roles = roles.filter((p) => !isNSFWRole(p));
    }

    if (selectedCategory !== "all") {
      roles = roles.filter((p) => p.category === selectedCategory);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      roles = roles.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(term);
        const descriptionMatch = p.description?.toLowerCase().includes(term) ?? false;
        return nameMatch || descriptionMatch;
      });
    }

    return roles;
  }, [allRoles, selectedCategory, search, showNSFWContent, isNSFWRole]);

  const handleRoleSelect = (role: Role) => {
    onRoleChange(role);
    setIsOpen(false);
  };

  const handleClearRole = () => {
    onRoleChange(null);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "border-border bg-surface-1 hover:border-brand group flex w-full items-center justify-between rounded-lg border p-4 text-left transition-all",
          isOpen && "border-brand",
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              selectedRole ? "bg-brand/20" : "bg-surface-2",
            )}
          >
            {selectedRole ? (
              <Bot className="text-brand h-5 w-5" />
            ) : (
              <User className="text-text-1 h-5 w-5" />
            )}
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-text-0 font-semibold">{selectedRole?.name || "Standard"}</span>
            <span className="text-text-1 text-xs">
              {selectedRole?.category || "Keine Rolle gewählt"}
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "text-text-1 group-hover:text-text-0 h-5 w-5 transition-transform",
            isOpen && "text-brand rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="border-border bg-surface-1 mt-4 space-y-4 rounded-lg border">
          <div className="p-4 pb-0">
            <div className="relative">
              <Search className="text-text-1 absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rolle suchen..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto px-4">
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === "all" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                Alle
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {selectedRole && (
            <div className="border-border border-t px-4 pt-4">
              <button
                onClick={handleClearRole}
                className="hover:bg-surface-2 flex w-full items-center gap-4 rounded-lg p-4 text-left transition-colors"
              >
                <div className="bg-surface-2 flex h-8 w-8 items-center justify-center rounded-full">
                  <User className="text-text-1 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-text-0 text-sm font-medium">Standard (Keine Rolle)</div>
                  <div className="text-text-1 text-xs">Zurücksetzen</div>
                </div>
              </button>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto px-4 pb-4">
            {isLoadingRoles ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-2 text-lg">⏳</div>
                <div className="text-text-1 text-sm">Lade Rollen...</div>
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-2 text-lg">🔍</div>
                <div className="text-text-1 text-sm">Keine Rollen gefunden</div>
                <div className="text-text-1/70 text-xs">Versuche einen anderen Filter</div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    className={cn(
                      "relative flex w-full items-center gap-4 rounded-lg p-4 text-left transition-all",
                      selectedRole?.id === role.id
                        ? "bg-brand/20 ring-brand/50 ring-1"
                        : "hover:bg-surface-2",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                        selectedRole?.id === role.id ? "bg-brand/30" : "bg-surface-2",
                      )}
                    >
                      <Bot
                        className={cn(
                          "h-5 w-5",
                          selectedRole?.id === role.id ? "text-brand" : "text-text-1",
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-text-0 truncate text-sm font-medium">
                          {role.name}
                        </span>
                        {selectedRole?.id === role.id && (
                          <span className="text-brand text-sm">✓</span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {role.category && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "px-2 py-0.5 text-xs",
                              role.category === "Erwachsene"
                                ? "border-pink-500/30 bg-pink-500/20 text-pink-200"
                                : "",
                            )}
                          >
                            {role.category}
                          </Badge>
                        )}
                        {role.tags?.includes("adult") && (
                          <Badge
                            variant="outline"
                            className="border-pink-500/50 bg-pink-500/10 px-1.5 py-0.5 text-xs text-pink-300"
                          >
                            18+
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
