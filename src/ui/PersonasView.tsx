import React from "react";

import { usePersonaSelection } from "../config/personas";
import { cn } from "../lib/cn";

interface PersonaCategory {
  name: string;
  color: string;
  personas: string[];
}

const PERSONA_CATEGORIES: PersonaCategory[] = [
  {
    name: "Allgemein & Produktivität",
    color:
      "from-slate-600 to-slate-700 border-slate-400/40 shadow-slate-400/25 hover:shadow-slate-400/40",
    personas: ["neutral", "email_professional", "productivity_helper"],
  },
  {
    name: "Beratung & Coaching",
    color:
      "from-indigo-600/90 to-indigo-700/90 border-indigo-400/40 shadow-indigo-400/25 hover:shadow-indigo-400/40",
    personas: ["coach_life", "coach_crisis", "career_advisor", "personality_trainer"],
  },
  {
    name: "Gesundheit & Therapie",
    color:
      "from-teal-600/90 to-teal-700/90 border-teal-400/40 shadow-teal-400/25 hover:shadow-teal-400/40",
    personas: ["therapist_expert", "fitness_nutrition_coach", "sexuality_educator"],
  },
  {
    name: "Rechtliches & Finanzen",
    color:
      "from-emerald-600/90 to-emerald-700/90 border-emerald-400/40 shadow-emerald-400/25 hover:shadow-emerald-400/40",
    personas: ["legal_generalist"],
  },
  {
    name: "Bildung & Lernen",
    color:
      "from-amber-600/90 to-amber-700/90 border-amber-400/40 shadow-amber-400/25 hover:shadow-amber-400/40",
    personas: ["language_teacher", "education_guide"],
  },
  {
    name: "Kreativ & Kunst",
    color:
      "from-rose-600/90 to-rose-700/90 border-rose-400/40 shadow-rose-400/25 hover:shadow-rose-400/40",
    personas: ["poet_lyricist", "songwriter", "art_coach", "erotic_creative_author"],
  },
  {
    name: "Unterhaltung & Lifestyle",
    color:
      "from-purple-600/90 to-purple-700/90 border-purple-400/40 shadow-purple-400/25 hover:shadow-purple-400/40",
    personas: ["movie_tv_expert", "chef_foodie"],
  },
  {
    name: "Familie & Alltag",
    color:
      "from-blue-600/90 to-blue-700/90 border-blue-400/40 shadow-blue-400/25 hover:shadow-blue-400/40",
    personas: ["parent_advisor", "senior_advisor", "neighbor_helper"],
  },
  {
    name: "Verkauf & Business",
    color:
      "from-cyan-600/90 to-cyan-700/90 border-cyan-400/40 shadow-cyan-400/25 hover:shadow-cyan-400/40",
    personas: ["ebay_coach"],
  },
  {
    name: "Spezial & Unzensiert",
    color:
      "from-red-600/90 to-red-700/90 border-red-400/40 shadow-red-400/25 hover:shadow-red-400/40",
    personas: ["sarcastic_direct", "uncensored_expert", "nsfw_roleplay"],
  },
];

export default function PersonasView() {
  const { styles, styleId, setStyleId, loading } = usePersonaSelection();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-white">Lade Personas...</div>
      </div>
    );
  }

  const getPersonasByCategory = (categoryPersonas: string[]) => {
    return styles.filter((style) => categoryPersonas.includes(style.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/10 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-white">
                <path
                  fill="currentColor"
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Personas</h1>
              <p className="text-slate-400">
                Wähle den passenden KI-Assistenten für deine Bedürfnisse
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="space-y-8">
          {PERSONA_CATEGORIES.map((category) => {
            const categoryPersonas = getPersonasByCategory(category.personas);
            if (categoryPersonas.length === 0) return null;

            return (
              <div key={category.name} className="space-y-4">
                <h2 className="flex items-center gap-3 text-xl font-semibold text-white">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full bg-gradient-to-r",
                      category.color.split(" ").slice(0, 2).join(" "),
                    )}
                  />
                  {category.name}
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryPersonas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => setStyleId(persona.id)}
                      className={cn(
                        "rounded-xl border p-6 text-left backdrop-blur-sm transition-all duration-300 hover:scale-105",
                        styleId === persona.id
                          ? `bg-gradient-to-r ${category.color} scale-105 text-white shadow-xl`
                          : "border-gray-500/40 bg-gradient-to-r from-gray-600/80 to-gray-700/80 text-gray-200 shadow-lg hover:border-gray-400/50 hover:from-gray-500/80 hover:to-gray-600/80 hover:shadow-xl",
                      )}
                    >
                      <h3 className="mb-2 text-lg font-semibold">{persona.name}</h3>
                      {persona.system && (
                        <p className="line-clamp-3 text-sm leading-relaxed opacity-90">
                          {persona.system.substring(0, 150)}...
                        </p>
                      )}
                      {styleId === persona.id && (
                        <div className="mt-3 inline-block rounded-full bg-white/20 px-2 py-1 text-xs">
                          ✓ Aktiv
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
