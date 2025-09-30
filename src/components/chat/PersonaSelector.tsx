import { Bot, ChevronDown, Search, User } from "lucide-react";
import { useMemo, useState } from "react";

import type { Persona } from "../../data/personas";
import { getCategories, getPersonas, getPersonasByCategory } from "../../data/personas";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
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

  const allPersonas = getPersonas();
  const categories = getCategories();

  const filteredPersonas = useMemo(() => {
    let personas = allPersonas;

    // Filter by category
    if (selectedCategory !== "all") {
      personas = getPersonasByCategory(selectedCategory);
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
  }, [allPersonas, selectedCategory, search]);

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

      {/* Dropdown Panel */}
      {isOpen && (
        <Card className="absolute top-full z-50 mt-2 w-full max-w-md overflow-hidden rounded-2xl border-white/20 bg-black/95 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-0">
            {/* Search Bar - Sticky */}
            <div className="sticky top-0 border-b border-white/10 bg-black/95 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rolle suchen..."
                  className="focus:border-accent-500/50 border-white/20 bg-white/5 pl-10 text-sm text-white placeholder:text-white/40"
                />
              </div>
            </div>

            {/* Category Pills - Horizontal Scroll */}
            <div className="overflow-x-auto border-b border-white/10 bg-black/50 px-4 py-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "tap-target whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                    selectedCategory === "all"
                      ? "shadow-accent-500/25 bg-accent-500 text-white shadow-lg"
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
                      "tap-target whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                      selectedCategory === category
                        ? "shadow-accent-500/25 bg-accent-500 text-white shadow-lg"
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
              <button
                onClick={handleClearPersona}
                className="tap-target flex w-full items-center gap-3 border-b border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <User className="h-5 w-5 text-white/60" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-white">Standard (Keine Rolle)</div>
                  <div className="text-xs text-white/50">Zurücksetzen</div>
                </div>
              </button>
            )}

            {/* Persona List - Scrollable */}
            <div className="max-h-[60vh] overflow-y-auto">
              {filteredPersonas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-2 text-white/40">🔍</div>
                  <div className="text-sm text-white/60">Keine Rollen gefunden</div>
                  <div className="text-xs text-white/40">Versuche einen anderen Filter</div>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredPersonas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => handlePersonaSelect(persona)}
                      className={cn(
                        "tap-target flex w-full items-start gap-3 p-4 text-left transition-colors",
                        selectedPersona?.id === persona.id
                          ? "bg-accent-500/20"
                          : "hover:bg-white/5",
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                          selectedPersona?.id === persona.id ? "bg-accent-500/30" : "bg-white/10",
                        )}
                      >
                        <Bot
                          className={cn(
                            "h-5 w-5",
                            selectedPersona?.id === persona.id
                              ? "text-accent-400"
                              : "text-white/60",
                          )}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-medium text-white">{persona.name}</span>
                          {selectedPersona?.id === persona.id && (
                            <span className="text-accent-400">✓</span>
                          )}
                        </div>
                        <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-white/60">
                          {persona.systemPrompt.slice(0, 100)}
                          {persona.systemPrompt.length > 100 && "..."}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {persona.category && (
                            <Badge
                              variant="secondary"
                              className="border-white/10 bg-white/10 text-[10px] text-white/50"
                            >
                              {persona.category}
                            </Badge>
                          )}
                          {persona.tags?.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-white/10 text-[10px] text-white/40"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
