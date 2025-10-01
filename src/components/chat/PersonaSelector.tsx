import { Bot, ChevronDown, Search, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Persona } from "../../data/personas";
import { loadPersonas } from "../../data/personas";
import { useSettings } from "../../hooks/useSettings";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

interface PersonaSelectorProps {
  selectedPersona: Persona | null;
  onPersonaChange: (persona: Persona | null) => void;
  className?: string;
}

export function PersonaSelector({
  selectedPersona,
  onPersonaChange,
  className,
}: PersonaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [allPersonas, setAllPersonas] = useState<Persona[]>([]);
  const [isLoadingPersonas, setIsLoadingPersonas] = useState(true);

  const { settings } = useSettings();

  // Helper function to check if persona contains NSFW content (wrapped in useCallback)
  const isNSFWPersona = useCallback((persona: Persona): boolean => {
    const nsfwTags = ["adult", "nsfw", "sexuality"];
    const nsfwCategories = ["Erwachsene"];

    return (
      nsfwCategories.includes(persona.category || "") ||
      persona.tags?.some((tag) => nsfwTags.includes(tag.toLowerCase())) ||
      false
    );
  }, []);

  // Load personas asynchronously
  useEffect(() => {
    const loadAllPersonas = async () => {
      try {
        setIsLoadingPersonas(true);
        const personas = await loadPersonas();
        setAllPersonas(personas);
      } catch (error) {
        console.warn("Failed to load external personas, using defaults:", error);
        // Fallback zu den Standard-Personas wenn das Laden fehlschlägt
        const { getPersonas } = await import("../../data/personas");
        setAllPersonas(getPersonas());
      } finally {
        setIsLoadingPersonas(false);
      }
    };

    void loadAllPersonas();
  }, []);

  // Categories dynamisch basierend auf geladenen Personas berechnen
  const categories = useMemo(() => {
    const categorySet = new Set(
      allPersonas.map((p) => p.category).filter((c): c is string => Boolean(c)),
    );
    return Array.from(categorySet);
  }, [allPersonas]);

  const filteredPersonas = useMemo(() => {
    let personas = allPersonas;

    // Filter NSFW content based on user settings
    if (!settings.showNSFWContent) {
      personas = personas.filter((p) => !isNSFWPersona(p));
    }

    // Filter by category
    if (selectedCategory !== "all") {
      personas = personas.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (search.trim()) {
      const searchTerm = search.toLowerCase();
      personas = personas.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.systemPrompt.toLowerCase().includes(searchTerm) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
          p.category?.toLowerCase().includes(searchTerm),
      );
    }

    return personas;
  }, [allPersonas, selectedCategory, search, settings.showNSFWContent, isNSFWPersona]);

  const handlePersonaSelect = (persona: Persona) => {
    onPersonaChange(persona);
    setIsOpen(false);
    setSearch("");
  };

  const handleClearPersona = () => {
    onPersonaChange(null);
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
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              selectedPersona ? "bg-accent-500/20" : "bg-white/10",
            )}
          >
            {selectedPersona ? (
              <Bot className="text-accent-400 h-5 w-5" />
            ) : (
              <User className="h-5 w-5 text-white/60" />
            )}
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="font-semibold text-white">{selectedPersona?.name || "Standard"}</span>
            <span className="text-xs text-white/50">
              {selectedPersona?.category || "Keine Rolle gewählt"}
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-white/40 transition-transform group-hover:text-white/60",
            isOpen && "text-accent-400 rotate-180",
          )}
        />
      </button>

      {/* Inline Rollen-Auswahl - Nahtlos integriert */}
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
                  "tap-target whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
                  selectedCategory === "all"
                    ? "bg-accent-500 text-white shadow-lg"
                    : "border border-white/20 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
                )}
              >
                Alle
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "tap-target whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
                    selectedCategory === category
                      ? "bg-accent-500 text-white shadow-lg"
                      : "border border-white/20 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Selection Option */}
          {selectedPersona && (
            <div className="border-t border-white/10 px-4 pt-4">
              <button
                onClick={handleClearPersona}
                className="tap-target flex w-full items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
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

          {/* Persona List - Compact & Scrollable */}
          <div className="max-h-96 overflow-y-auto px-4 pb-4">
            {isLoadingPersonas ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-2 text-lg text-white/40">⏳</div>
                <div className="text-sm text-white/60">Lade Rollen...</div>
              </div>
            ) : filteredPersonas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-2 text-lg text-white/40">🔍</div>
                <div className="text-sm text-white/60">Keine Rollen gefunden</div>
                <div className="text-xs text-white/40">Versuche einen anderen Filter</div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPersonas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => handlePersonaSelect(persona)}
                    className={cn(
                      "tap-target relative flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all",
                      selectedPersona?.id === persona.id
                        ? "bg-accent-500/20 ring-accent-500/50 ring-1"
                        : "hover:bg-white/10",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                        selectedPersona?.id === persona.id ? "bg-accent-500/30" : "bg-white/10",
                      )}
                    >
                      <Bot
                        className={cn(
                          "h-5 w-5",
                          selectedPersona?.id === persona.id ? "text-accent-400" : "text-white/60",
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-white">
                          {persona.name}
                        </span>
                        {selectedPersona?.id === persona.id && (
                          <span className="text-accent-400 text-sm">✓</span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {persona.category && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "px-2 py-0.5 text-xs",
                              persona.category === "Erwachsene"
                                ? "border-pink-500/30 bg-pink-500/20 text-pink-200"
                                : "border-white/10 bg-white/5 text-white/50",
                            )}
                          >
                            {persona.category}
                          </Badge>
                        )}
                        {persona.tags?.includes("adult") && (
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
