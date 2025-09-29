import { Bot, ChevronDown, Search, User } from "lucide-react";
import { useMemo, useState } from "react";

import type { Persona } from "../../data/personas";
import { getCategories, getPersonas, getPersonasByCategory } from "../../data/personas";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
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
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-auto w-full justify-between border border-white/10 bg-white/10 p-3 text-left hover:bg-white/20",
          isOpen && "border-accent-500/50 bg-white/20",
        )}
      >
        <div className="flex items-center gap-3">
          {selectedPersona ? (
            <Bot className="text-accent-400 h-5 w-5" />
          ) : (
            <User className="h-5 w-5 text-white/60" />
          )}
          <div className="flex flex-col items-start">
            <span className="font-medium text-white">
              {selectedPersona?.name || "Keine Rolle gewählt"}
            </span>
            {selectedPersona && (
              <span className="text-xs text-white/60">{selectedPersona.category}</span>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 text-white/60 transition-transform", isOpen && "rotate-180")}
        />
      </Button>

      {/* Dropdown Panel */}
      {isOpen && (
        <Card className="absolute top-full z-50 mt-2 w-full border-white/20 bg-black/90 backdrop-blur-xl">
          <CardContent className="p-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rolle suchen..."
                className="border-white/10 bg-white/10 pl-10 text-white placeholder:text-white/50"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition",
                  selectedCategory === "all"
                    ? "bg-accent-500 text-white"
                    : "border border-white/20 bg-white/10 text-white/70 hover:bg-white/20",
                )}
              >
                Alle
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition",
                    selectedCategory === category
                      ? "bg-accent-500 text-white"
                      : "border border-white/20 bg-white/10 text-white/70 hover:bg-white/20",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Clear Selection */}
            {selectedPersona && (
              <Button
                variant="ghost"
                onClick={handleClearPersona}
                className="mb-2 w-full justify-start border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              >
                <User className="mr-2 h-4 w-4" />
                Keine Rolle (Standard)
              </Button>
            )}

            {/* Persona List */}
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {filteredPersonas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => handlePersonaSelect(persona)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition",
                    selectedPersona?.id === persona.id
                      ? "bg-accent-500/20 border-accent-500"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{persona.name}</span>
                      <div className="flex items-center gap-2">
                        {persona.category && (
                          <Badge variant="secondary" className="text-[10px] text-white/60">
                            {persona.category}
                          </Badge>
                        )}
                        <Bot className="text-accent-400 h-4 w-4" />
                      </div>
                    </div>

                    <p
                      className="overflow-hidden text-ellipsis text-xs text-white/70"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {persona.systemPrompt.slice(0, 120)}...
                    </p>

                    {persona.tags && (
                      <div className="flex flex-wrap gap-1">
                        {persona.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="border-white/20 text-[10px] text-white/60"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {filteredPersonas.length === 0 && (
              <div className="py-8 text-center text-sm text-white/60">Keine Rollen gefunden.</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
