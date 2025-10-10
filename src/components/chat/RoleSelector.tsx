import { Bot, ChevronDown, Search, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Role } from "../../data/roles";
import { getRoles, loadRoles } from "../../data/roles";
import { useSettings } from "../../hooks/useSettings";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
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

  // Helper function to check if role contains NSFW content (wrapped in useCallback)
  const isNSFWRole = useCallback((role: Role): boolean => {
    const nsfwCategories = ["erwachsene"];
    const nsfwTags = ["adult", "nsfw"];
    return (
      nsfwCategories.includes(role.category?.toLowerCase() || "") ||
      role.tags?.some((tag) => nsfwTags.includes(tag.toLowerCase())) ||
      false
    );
  }, []);

  // Load roles asynchronously
  useEffect(() => {
    const loadAllRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const roles = await loadRoles();
        setAllRoles(roles);
      } catch (error) {
        console.warn("Failed to load external roles, using defaults:", error);
        // Fallback to default roles if loading fails
        setAllRoles(getRoles());
      } finally {
        setIsLoadingRoles(false);
      }
    };

    void loadAllRoles();
  }, []);

  // Categories are calculated dynamically based on loaded roles
  const categories = useMemo(() => {
    const cats = new Set(allRoles.map((p) => p.category).filter((c): c is string => Boolean(c)));
    return Array.from(cats);
  }, [allRoles]);

  const filteredRoles = useMemo(() => {
    let roles = allRoles;

    // Filter by NSFW content
    if (!showNSFWContent) {
      roles = roles.filter((p) => !isNSFWRole(p));
    }

    // Filter by category
    if (selectedCategory !== "all") {
      roles = roles.filter((p) => p.category === selectedCategory);
    }

    // Filter by search term
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
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "tap-target group flex w-full items-center justify-between rounded-2xl border p-4 transition-all",
          isOpen
            ? "border-accent-500/50 bg-accent-500/10"
            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              selectedRole ? "bg-accent-500/20" : "bg-white/10",
            )}
          >
            {selectedRole ? (
              <Bot className="h-5 w-5 text-accent-400" />
            ) : (
              <User className="h-5 w-5 text-white/60" />
            )}
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="font-semibold text-white">{selectedRole?.name || "Standard"}</span>
            <span className="text-xs text-white/50">
              {selectedRole?.category || "Keine Rolle gewählt"}
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-white/40 transition-transform group-hover:text-white/60",
            isOpen && "rotate-180 text-accent-400",
          )}
        />
      </button>

      {/* Inline Role Selection - Seamlessly integrated */}
      {isOpen && (
        <div className="mt-4 space-y-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          {/* Search Bar */}
          <div className="p-4 pb-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rolle suchen..."
                className="focus:border-accent-500/50 border-white/20 bg-white/5 pl-10 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          {/* Category Pills - Horizontal Scroll */}
          <div className="overflow-x-auto px-4">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "min-h-touch-rec whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
                  selectedCategory === "all"
                    ? "text-corporate-text-onAccent bg-accent-500 shadow-lg"
                    : "border border-white/20 bg-white/5 text-corporate-text-secondary hover:bg-white/10 hover:text-corporate-text-primary",
                )}
              >
                Alle
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "min-h-touch-rec whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
                    selectedCategory === category
                      ? "text-corporate-text-onAccent bg-accent-500 shadow-lg"
                      : "border border-white/20 bg-white/5 text-corporate-text-secondary hover:bg-white/10 hover:text-corporate-text-primary",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Selection Option */}
          {selectedRole && (
            <div className="border-t border-white/10 px-4 pt-4">
              <button
                onClick={handleClearRole}
                className="tap-target flex w-full items-center gap-4 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <User className="h-4 w-4 text-white/60" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-white">Standard (Keine Rolle)</div>
                  <div className="text-xs text-white/50">Zurücksetzen</div>
                </div>
              </button>
            </div>
          )}

          {/* Role List - Compact & Scrollable */}
          <div className="max-h-96 overflow-y-auto px-4 pb-4">
            {isLoadingRoles ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-2 text-lg text-white/40">⏳</div>
                <div className="text-sm text-white/60">Lade Rollen...</div>
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-2 text-lg text-white/40">🔍</div>
                <div className="text-sm text-white/60">Keine Rollen gefunden</div>
                <div className="text-xs text-white/40">Versuche einen anderen Filter</div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    className={cn(
                      "tap-target relative flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all",
                      selectedRole?.id === role.id
                        ? "bg-accent-500/20 ring-accent-500/50 ring-1"
                        : "hover:bg-white/10",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                        selectedRole?.id === role.id ? "bg-accent-500/30" : "bg-white/10",
                      )}
                    >
                      <Bot
                        className={cn(
                          "h-5 w-5",
                          selectedRole?.id === role.id ? "text-accent-400" : "text-white/60",
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-white">{role.name}</span>
                        {selectedRole?.id === role.id && (
                          <span className="text-sm text-accent-400">✓</span>
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
                                : "border-white/10 bg-white/5 text-white/50",
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
