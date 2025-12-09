import type { LucideIcon } from "lucide-react";

import { Book, Brain, Sparkles, Zap } from "@/lib/icons";

import type { DiscussionPresetKey } from "../prompts/discussion/presets";

export interface BehaviorPresetConfig {
  creativity: number;
  discussionMaxSentences: number;
  discussionPreset: DiscussionPresetKey;
  discussionStrict: boolean;
}

export type BehaviorPresetId = "precise" | "creative" | "analytical" | "story";

export interface BehaviorPreset {
  id: BehaviorPresetId;
  label: string;
  description: string;
  icon: LucideIcon;
  config: BehaviorPresetConfig;
}

/**
 * Static style mapping for behavior presets
 * All Tailwind classes are defined statically to ensure they're included in the production build
 */
export const BEHAVIOR_PRESET_STYLES: Record<
  BehaviorPresetId,
  {
    text: string;
    bg: string;
  }
> = {
  precise: {
    text: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  creative: {
    text: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  analytical: {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  story: {
    text: "text-amber-500",
    bg: "bg-amber-500/10",
  },
};

export const BEHAVIOR_PRESETS: BehaviorPreset[] = [
  {
    id: "precise",
    label: "Sachlich & Kurz",
    description: "Präzise Fakten, keine Ausschmückung.",
    icon: Zap,
    config: {
      creativity: 10,
      discussionMaxSentences: 5,
      discussionPreset: "nuechtern_pragmatisch",
      discussionStrict: true,
    },
  },
  {
    id: "creative",
    label: "Locker & Kreativ",
    description: "Unterhaltsam, ideenreich, entspannter Ton.",
    icon: Sparkles,
    config: {
      creativity: 85,
      discussionMaxSentences: 10,
      discussionPreset: "locker_neugierig",
      discussionStrict: false,
    },
  },
  {
    id: "analytical",
    label: "Analytisch",
    description: "Tiefgehend, logisch, erklärend.",
    icon: Brain,
    config: {
      creativity: 30,
      discussionMaxSentences: 10,
      discussionPreset: "analytisch_detailliert",
      discussionStrict: false,
    },
  },
  {
    id: "story",
    label: "Story & Rollenspiel",
    description: "Immersiv, ausführlich, atmosphärisch.",
    icon: Book,
    config: {
      creativity: 90,
      discussionMaxSentences: 10,
      discussionPreset: "freundlich_offen",
      discussionStrict: false,
    },
  },
];
