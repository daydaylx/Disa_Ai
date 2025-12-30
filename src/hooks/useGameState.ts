import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";

import type { ChatMessageType } from "../types/chatMessage";

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(["weapon", "armor", "consumable", "quest", "misc"]).default("misc"),
  quantity: z.number().int().positive().default(1),
});

export type Item = z.infer<typeof ItemSchema>;

export const QuestSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  completed: z.boolean().default(false),
  progress: z.number().min(0).max(100).default(0),
});

export type Quest = z.infer<typeof QuestSchema>;

export const CharacterStatsSchema = z.object({
  strength: z.number().int().min(1).max(20).default(10),
  dexterity: z.number().int().min(1).max(20).default(10),
  constitution: z.number().int().min(1).max(20).default(10),
  intelligence: z.number().int().min(1).max(20).default(10),
  wisdom: z.number().int().min(1).max(20).default(10),
  charisma: z.number().int().min(1).max(20).default(10),
});

export type CharacterStats = z.infer<typeof CharacterStatsSchema>;

// Combat System
export const CombatActionSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  actor: z.string(),
  action: z.enum(["attack", "defend", "spell", "item", "flee"]),
  target: z.string().optional(),
  damage: z.number().int().min(0).optional(),
  healing: z.number().int().min(0).optional(),
  effect: z.string().optional(),
  success: z.boolean(),
});

export type CombatAction = z.infer<typeof CombatActionSchema>;

export const EnemySchema = z.object({
  id: z.string(),
  name: z.string(),
  hp: z.number().int().min(0),
  maxHp: z.number().int().positive(),
  level: z.number().int().min(1),
  isBoss: z.boolean().default(false),
});

export type Enemy = z.infer<typeof EnemySchema>;

export const CombatStateSchema = z.object({
  active: z.boolean().default(false),
  turn: z.number().int().min(0).default(0),
  enemies: z.array(EnemySchema).default([]),
  actions: z.array(CombatActionSchema).default([]),
  roundNumber: z.number().int().min(0).default(0),
});

export type CombatState = z.infer<typeof CombatStateSchema>;

// Skill Tree System
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tier: z.number().int().min(1).max(5),
  cost: z.number().int().min(0),
  unlocked: z.boolean().default(false),
  maxLevel: z.number().int().min(1).default(1),
  currentLevel: z.number().int().min(0).default(0),
  requirements: z.array(z.string()).default([]),
  effects: z
    .object({
      statBonus: z
        .object({
          strength: z.number().optional(),
          dexterity: z.number().optional(),
          constitution: z.number().optional(),
          intelligence: z.number().optional(),
          wisdom: z.number().optional(),
          charisma: z.number().optional(),
        })
        .optional(),
      hpBonus: z.number().optional(),
      damageBonus: z.number().optional(),
      specialAbility: z.string().optional(),
    })
    .optional(),
});

export type Skill = z.infer<typeof SkillSchema>;

export const SkillTreeSchema = z.object({
  availablePoints: z.number().int().min(0).default(0),
  skills: z.array(SkillSchema).default([]),
});

export type SkillTree = z.infer<typeof SkillTreeSchema>;

// Trade System
export const TradeOfferSchema = z.object({
  id: z.string(),
  npcName: z.string(),
  npcDialogue: z.string().optional(),
  offeredItems: z.array(ItemSchema),
  requestedItems: z.array(ItemSchema),
  goldOffered: z.number().int().min(0).default(0),
  goldRequested: z.number().int().min(0).default(0),
  expiresAt: z.number().optional(),
  completed: z.boolean().default(false),
});

export type TradeOffer = z.infer<typeof TradeOfferSchema>;

export const TradeHistorySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  npcName: z.string(),
  itemsGained: z.array(ItemSchema),
  itemsLost: z.array(ItemSchema),
  goldChange: z.number().int(),
});

export type TradeHistory = z.infer<typeof TradeHistorySchema>;

export const TradeStateSchema = z.object({
  activeOffers: z.array(TradeOfferSchema).default([]),
  history: z.array(TradeHistorySchema).default([]),
  reputation: z.number().int().min(0).max(100).default(50),
});

export type TradeState = z.infer<typeof TradeStateSchema>;

export const GameStateSchema = z.object({
  hp: z.number().int().min(0),
  maxHp: z.number().int().positive(),
  gold: z.number().int().min(0),
  location: z.string().min(1),
  inventory: z.array(ItemSchema),
  level: z.number().int().min(1).default(1),
  xp: z.number().int().min(0).default(0),
  xpToNextLevel: z.number().int().positive().default(100),
  stats: CharacterStatsSchema,
  quests: z.array(QuestSchema).default([]),
  achievements: z.array(z.string()).default([]),
  combat: CombatStateSchema.default({
    active: false,
    turn: 0,
    enemies: [],
    actions: [],
    roundNumber: 0,
  }),
  skillTree: SkillTreeSchema.default({
    availablePoints: 0,
    skills: [],
  }),
  trade: TradeStateSchema.default({
    activeOffers: [],
    history: [],
    reputation: 50,
  }),
});

export type GameState = z.infer<typeof GameStateSchema>;

const DEFAULT_GAME_STATE: GameState = {
  hp: 100,
  maxHp: 100,
  gold: 0,
  location: "Unbekannt",
  inventory: [],
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  stats: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  quests: [],
  achievements: [],
  combat: {
    active: false,
    turn: 0,
    enemies: [],
    actions: [],
    roundNumber: 0,
  },
  skillTree: {
    availablePoints: 0,
    skills: [],
  },
  trade: {
    activeOffers: [],
    history: [],
    reputation: 50,
  },
};

const STORAGE_KEY = "eternia_game_state";

function parseGameStateUpdate(content: string): Partial<GameState> | null {
  if (!content.includes("<game_state>")) return null;

  const matches = Array.from(content.matchAll(/<game_state>([\s\S]*?)<\/game_state>/g));
  if (matches.length === 0) return null;

  const raw = matches[matches.length - 1]?.[1]?.trim();
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    console.warn("[useGameState] Invalid JSON in <game_state> block.", error);
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;

  const record = parsed as Record<string, unknown>;
  const update: Partial<GameState> = {};

  if (typeof record.hp === "number" && Number.isFinite(record.hp) && record.hp >= 0) {
    update.hp = Math.floor(record.hp);
  }
  if (typeof record.maxHp === "number" && Number.isFinite(record.maxHp) && record.maxHp > 0) {
    update.maxHp = Math.floor(record.maxHp);
  }
  if (typeof record.gold === "number" && Number.isFinite(record.gold) && record.gold >= 0) {
    update.gold = Math.floor(record.gold);
  }
  if (typeof record.location === "string" && record.location.trim().length > 0) {
    update.location = record.location.trim();
  }

  if (Array.isArray(record.inventory)) {
    try {
      const validatedItems = record.inventory
        .map((item) => {
          if (typeof item === "string" && item.trim().length > 0) {
            return {
              id: `legacy_${Date.now()}_${Math.random()}`,
              name: item.trim(),
              type: "misc" as const,
              quantity: 1,
            };
          }
          return ItemSchema.parse(item);
        })
        .filter((item): item is Item => item !== null);
      update.inventory = validatedItems;
    } catch {
      console.warn("[useGameState] Invalid inventory format");
    }
  }

  if (typeof record.level === "number" && Number.isFinite(record.level) && record.level >= 1) {
    update.level = Math.floor(record.level);
  }
  if (typeof record.xp === "number" && Number.isFinite(record.xp) && record.xp >= 0) {
    update.xp = Math.floor(record.xp);
  }
  if (
    typeof record.xpToNextLevel === "number" &&
    Number.isFinite(record.xpToNextLevel) &&
    record.xpToNextLevel > 0
  ) {
    update.xpToNextLevel = Math.floor(record.xpToNextLevel);
  }

  if (record.stats && typeof record.stats === "object") {
    try {
      update.stats = CharacterStatsSchema.parse(record.stats);
    } catch {
      console.warn("[useGameState] Invalid stats format");
    }
  }

  if (Array.isArray(record.quests)) {
    try {
      update.quests = z.array(QuestSchema).parse(record.quests);
    } catch {
      console.warn("[useGameState] Invalid quests format");
    }
  }

  if (Array.isArray(record.achievements)) {
    const validAchievements = record.achievements.filter(
      (a): a is string => typeof a === "string" && a.trim().length > 0,
    );
    if (validAchievements.length > 0) {
      update.achievements = validAchievements;
    }
  }

  // Combat State
  if (record.combat && typeof record.combat === "object") {
    try {
      update.combat = CombatStateSchema.parse(record.combat);
    } catch {
      console.warn("[useGameState] Invalid combat format");
    }
  }

  // Skill Tree
  if (record.skillTree && typeof record.skillTree === "object") {
    try {
      update.skillTree = SkillTreeSchema.parse(record.skillTree);
    } catch {
      console.warn("[useGameState] Invalid skillTree format");
    }
  }

  // Trade State
  if (record.trade && typeof record.trade === "object") {
    try {
      update.trade = TradeStateSchema.parse(record.trade);
    } catch {
      console.warn("[useGameState] Invalid trade format");
    }
  }

  return Object.keys(update).length > 0 ? update : null;
}

function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("[useGameState] Failed to save state:", error);
  }
}

function loadGameState(): GameState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return GameStateSchema.parse(parsed);
  } catch (error) {
    console.warn("[useGameState] Failed to load state:", error);
    return null;
  }
}

function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("[useGameState] Failed to clear state:", error);
  }
}

export function useGameState(messages: ChatMessageType[], autoSave = true) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const loaded = loadGameState();
    return loaded ?? DEFAULT_GAME_STATE;
  });

  const latestUpdate = useMemo(() => {
    if (messages.length === 0) return null;

    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const message = messages[index];
      if (!message || message.role !== "assistant") continue;

      const update = parseGameStateUpdate(message.content);
      if (update) return update;
    }
    return null;
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setGameState(DEFAULT_GAME_STATE);
      return;
    }

    if (latestUpdate) {
      setGameState((prev) => ({ ...prev, ...latestUpdate }));
    }
  }, [messages.length, latestUpdate]);

  useEffect(() => {
    if (autoSave) {
      saveGameState(gameState);
    }
  }, [gameState, autoSave]);

  const resetGame = useCallback(() => {
    setGameState(DEFAULT_GAME_STATE);
    clearGameState();
  }, []);

  const loadSave = useCallback(() => {
    const loaded = loadGameState();
    if (loaded) {
      setGameState(loaded);
      return true;
    }
    return false;
  }, []);

  const manualSave = useCallback(() => {
    saveGameState(gameState);
  }, [gameState]);

  return {
    gameState,
    resetGame,
    loadSave,
    manualSave,
  };
}

export function cleanGameContent(content: string): string {
  const cleaned = content.replace(/<game_state>[\s\S]*?<\/game_state>/g, "").trim();
  return cleaned.replace(/\n{3,}/g, "\n\n");
}
