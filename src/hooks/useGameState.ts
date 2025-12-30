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

// Survival System
export const SurvivalStateSchema = z.object({
  hunger: z.number().int().min(0).max(100).default(100),
  thirst: z.number().int().min(0).max(100).default(100),
  radiation: z.number().int().min(0).max(100).default(0),
  fatigue: z.number().int().min(0).max(100).default(0),
});

export type SurvivalState = z.infer<typeof SurvivalStateSchema>;

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
  survival: SurvivalStateSchema.default({
    hunger: 100,
    thirst: 100,
    radiation: 0,
    fatigue: 0,
  }),
  suggested_actions: z.array(z.string()).default([]),
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
  survival: {
    hunger: 100,
    thirst: 100,
    radiation: 0,
    fatigue: 0,
  },
  suggested_actions: [],
};

const STORAGE_KEY = "eternia_game_state";

const ITEM_TYPE_ALIASES: Record<string, Item["type"]> = {
  weapon: "weapon",
  waffe: "weapon",
  armor: "armor",
  rustung: "armor",
  ruestung: "armor",
  consumable: "consumable",
  verbrauchsgegenstand: "consumable",
  quest: "quest",
  misc: "misc",
  sonstiges: "misc",
  gegenstand: "misc",
};

const COMBAT_ACTION_ALIASES: Record<string, CombatAction["action"]> = {
  attack: "attack",
  angriff: "attack",
  defend: "defend",
  verteidigen: "defend",
  verteidigung: "defend",
  spell: "spell",
  zauber: "spell",
  magie: "spell",
  item: "item",
  gegenstand: "item",
  flee: "flee",
  flucht: "flee",
  fliehen: "flee",
  fluchtversuch: "flee",
};

function normalizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u00df/g, "ss")
    .replace(/[^a-z0-9]+/g, "");
}

function resolveItemType(value: string): Item["type"] | null {
  const normalized = normalizeToken(value);
  return ITEM_TYPE_ALIASES[normalized] ?? null;
}

function resolveCombatAction(value: string): CombatAction["action"] | null {
  const normalized = normalizeToken(value);
  return COMBAT_ACTION_ALIASES[normalized] ?? null;
}

function normalizeItemRecord(item: unknown): unknown {
  if (!item || typeof item !== "object") return item;
  const record = item as Record<string, unknown>;
  if (typeof record.type !== "string") return item;
  const resolved = resolveItemType(record.type);
  if (!resolved || resolved === record.type) return item;
  return { ...record, type: resolved };
}

function normalizeTradeOffer(offer: unknown): unknown {
  if (!offer || typeof offer !== "object") return offer;
  const record = offer as Record<string, unknown>;
  const normalized: Record<string, unknown> = { ...record };

  if (Array.isArray(record.offeredItems)) {
    normalized.offeredItems = record.offeredItems.map((item) => normalizeItemRecord(item));
  }
  if (Array.isArray(record.requestedItems)) {
    normalized.requestedItems = record.requestedItems.map((item) => normalizeItemRecord(item));
  }

  return normalized;
}

function normalizeTradeHistory(history: unknown): unknown {
  if (!history || typeof history !== "object") return history;
  const record = history as Record<string, unknown>;
  const normalized: Record<string, unknown> = { ...record };

  if (Array.isArray(record.itemsGained)) {
    normalized.itemsGained = record.itemsGained.map((item) => normalizeItemRecord(item));
  }
  if (Array.isArray(record.itemsLost)) {
    normalized.itemsLost = record.itemsLost.map((item) => normalizeItemRecord(item));
  }

  return normalized;
}

function normalizeTradeState(trade: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = { ...trade };

  if (Array.isArray(trade.activeOffers)) {
    normalized.activeOffers = trade.activeOffers.map((offer) => normalizeTradeOffer(offer));
  }
  if (Array.isArray(trade.history)) {
    normalized.history = trade.history.map((entry) => normalizeTradeHistory(entry));
  }

  return normalized;
}

function normalizeCombatActionRecord(action: unknown): unknown {
  if (!action || typeof action !== "object") return action;
  const record = action as Record<string, unknown>;
  if (typeof record.action !== "string") return action;
  const resolved = resolveCombatAction(record.action);
  if (!resolved || resolved === record.action) return action;
  return { ...record, action: resolved };
}

function normalizeCombatState(combat: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = { ...combat };
  if (Array.isArray(combat.actions)) {
    normalized.actions = combat.actions.map((action) => normalizeCombatActionRecord(action));
  }
  return normalized;
}

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
          if (typeof item === "string") {
            const trimmed = item.trim();
            if (!trimmed) return null;
            return {
              id: `legacy_${Date.now()}_${Math.random()}`,
              name: trimmed,
              type: "misc" as const,
              quantity: 1,
            };
          }
          return ItemSchema.parse(normalizeItemRecord(item));
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
    update.achievements = validAchievements;
  }

  // Combat State
  if (record.combat && typeof record.combat === "object") {
    try {
      update.combat = CombatStateSchema.parse(
        normalizeCombatState(record.combat as Record<string, unknown>),
      );
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
      update.trade = TradeStateSchema.parse(
        normalizeTradeState(record.trade as Record<string, unknown>),
      );
    } catch {
      console.warn("[useGameState] Invalid trade format");
    }
  }

  // Survival State
  if (record.survival && typeof record.survival === "object") {
    try {
      update.survival = SurvivalStateSchema.parse(record.survival);
    } catch {
      console.warn("[useGameState] Invalid survival format");
    }
  }

  // Suggested Actions
  if (Array.isArray(record.suggested_actions)) {
    const validActions = record.suggested_actions.filter(
      (a): a is string => typeof a === "string" && a.trim().length > 0,
    );
    // Always update if array exists, even if empty (to clear old suggestions)
    update.suggested_actions = validActions;
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
      return loaded;
    }
    return null;
  }, []);

  const manualSave = useCallback(() => {
    saveGameState(gameState);
  }, [gameState]);

  const importSave = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      const validated = GameStateSchema.parse(parsed);
      setGameState(validated);
      saveGameState(validated);
      return true;
    } catch (error) {
      console.error("[useGameState] Import failed:", error);
      return false;
    }
  }, []);

  return {
    gameState,
    resetGame,
    loadSave,
    manualSave,
    importSave,
  };
}

export function cleanGameContent(content: string): string {
  const cleaned = content.replace(/<game_state>[\s\S]*?<\/game_state>/g, "").trim();
  return cleaned.replace(/\n{3,}/g, "\n\n");
}
