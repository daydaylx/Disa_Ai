import type { LucideIcon } from "lucide-react";

import { Book, Brain, Sparkles, Zap } from "@/lib/icons";

import type { DiscussionPresetKey } from "../prompts/discussion/presets";

export interface BehaviorPresetConfig {
  creativity: number;
  discussionMaxSentences: number;
  discussionPreset: DiscussionPresetKey;
  discussionStrict: boolean;
}

export interface BehaviorPreset {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  config: BehaviorPresetConfig;
}

export const BEHAVIOR_PRESETS: BehaviorPreset[] = [
  {
    id: "precise",
    label: "Sachlich & Kurz",
    description: "Präzise Fakten, keine Ausschmückung.",
    icon: Zap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
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
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
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
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
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
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    config: {
      creativity: 90,
      discussionMaxSentences: 10,
      discussionPreset: "freundlich_offen",
      discussionStrict: false,
    },
  },
];
