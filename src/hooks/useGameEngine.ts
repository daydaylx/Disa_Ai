import { useCallback, useEffect, useMemo, useRef } from "react";

import type { Item } from "./useGameState";

export interface GameEngineConfig {
  autoDecayEnabled: boolean;
  decayInterval: number; // ms between decay ticks
  hungerDecayRate: number; // % per tick
  thirstDecayRate: number; // % per tick
  fatigueGrowthRate: number; // % per tick in active gameplay
}

const DEFAULT_CONFIG: GameEngineConfig = {
  autoDecayEnabled: false, // DISABLED: Simplified to HP-only system
  decayInterval: 60000, // 1 minute
  hungerDecayRate: 2,
  thirstDecayRate: 3,
  fatigueGrowthRate: 1,
};

interface SurvivalState {
  hunger: number;
  thirst: number;
  radiation: number;
  fatigue: number;
}

interface GameEngineActions {
  // Instant client-side item usage
  useConsumable: (item: Item) => {
    success: boolean;
    message: string;
    stateChanges: Partial<SurvivalState>;
  };

  // Client-side combat damage calculation
  calculateDamage: (attackerLevel: number, targetDefense?: number) => number;

  // Apply radiation from environment
  applyRadiation: (amount: number) => void;

  // Rest/Sleep action
  rest: (duration: "short" | "full") => Partial<SurvivalState>;

  // Validate AI state update
  validateStateUpdate: (aiState: any, currentState: any) => { valid: boolean; errors: string[] };

  // Check critical state and apply HP damage
  checkCriticalState: (
    survival: SurvivalState,
    currentHP: number,
  ) => {
    hpDamage: number;
    warnings: string[];
    isDead: boolean;
  };

  // Apply damage to enemy and check for death
  applyEnemyDamage: (
    enemies: Array<{
      id: string;
      name: string;
      hp: number;
      maxHp: number;
      level: number;
      isBoss: boolean;
    }>,
    targetId: string,
    damage: number,
  ) => {
    updatedEnemies: Array<{
      id: string;
      name: string;
      hp: number;
      maxHp: number;
      level: number;
      isBoss: boolean;
    }>;
    killedEnemy: { id: string; name: string } | null;
    combatEnded: boolean;
  };
}

interface UseGameEngineOptions {
  onStateChange: (changes: Partial<SurvivalState>) => void;
  config?: Partial<GameEngineConfig>;
  isPlaying?: boolean; // Only decay when actively playing
}

export function useGameEngine({
  onStateChange,
  config: customConfig,
  isPlaying = true,
}: UseGameEngineOptions): GameEngineActions {
  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...customConfig }), [customConfig]);
  const decayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-Decay Timer
  useEffect(() => {
    if (!config.autoDecayEnabled || !isPlaying) {
      if (decayTimerRef.current) {
        clearInterval(decayTimerRef.current);
        decayTimerRef.current = null;
      }
      return;
    }

    decayTimerRef.current = setInterval(() => {
      onStateChange({
        hunger: -config.hungerDecayRate,
        thirst: -config.thirstDecayRate,
        fatigue: config.fatigueGrowthRate,
      });
    }, config.decayInterval);

    return () => {
      if (decayTimerRef.current) {
        clearInterval(decayTimerRef.current);
        decayTimerRef.current = null;
      }
    };
  }, [config, isPlaying, onStateChange]);

  // Client-side consumable usage
  const useConsumable = useCallback(
    (
      item: Item,
    ): {
      success: boolean;
      message: string;
      stateChanges: Partial<SurvivalState>;
    } => {
      const itemName = item.name.toLowerCase();
      const changes: Partial<SurvivalState> = {};
      let message = "";

      // Food items (hunger restoration)
      if (
        itemName.includes("ration") ||
        itemName.includes("nahrung") ||
        itemName.includes("brot") ||
        itemName.includes("fleisch") ||
        itemName.includes("konserve")
      ) {
        const isRadiated = itemName.includes("verstrahlt") || itemName.includes("kontaminiert");

        if (isRadiated) {
          changes.hunger = 25;
          changes.radiation = 15;
          message = `Du isst ${item.name}. Hunger gestillt, aber du spürst ein Kribbeln... (+25% Hunger, +15% Strahlung)`;
        } else if (itemName.includes("notration")) {
          changes.hunger = 40;
          message = `Du verzehrst ${item.name}. Nahrhaft, aber geschmacklos. (+40% Hunger)`;
        } else {
          changes.hunger = 60;
          message = `Du isst ${item.name}. Köstlich und sättigend! (+60% Hunger)`;
        }
      }
      // Water items (thirst restoration)
      else if (
        itemName.includes("wasser") ||
        itemName.includes("water") ||
        itemName.includes("drink") ||
        itemName.includes("getränk")
      ) {
        const isRadiated = itemName.includes("verstrahlt") || itemName.includes("kontaminiert");
        const isFiltered = itemName.includes("gefiltert") || itemName.includes("gereinigt");

        if (isRadiated) {
          changes.thirst = 25;
          changes.radiation = 10;
          message = `Du trinkst ${item.name}. Durst gelöscht, aber es schmeckt metallisch... (+25% Durst, +10% Strahlung)`;
        } else if (isFiltered) {
          changes.thirst = 50;
          message = `Du trinkst ${item.name}. Sauber und erfrischend. (+50% Durst)`;
        } else {
          changes.thirst = 40;
          message = `Du trinkst ${item.name}. Erfrischend, aber nicht perfekt. (+40% Durst)`;
        }
      }
      // Medical items (radiation/health)
      else if (
        itemName.includes("medkit") ||
        itemName.includes("heilung") ||
        itemName.includes("verband")
      ) {
        message = `Du verwendest ${item.name}. (Sende an KI für HP-Heilung)`;
      } else if (
        itemName.includes("rad-away") ||
        itemName.includes("anti-rad") ||
        itemName.includes("strahlenschutz")
      ) {
        changes.radiation = -30;
        message = `Du nimmst ${item.name}. Die Übelkeit lässt nach. (-30% Strahlung)`;
      }
      // Stimulants (fatigue)
      else if (
        itemName.includes("koffein") ||
        itemName.includes("stimulans") ||
        itemName.includes("energy")
      ) {
        changes.fatigue = -50;
        changes.hunger = -10; // Side effect
        message = `Du nimmst ${item.name}. Plötzliche Wachheit! (-50% Müdigkeit, -10% Hunger)`;
      }
      // Unknown item
      else {
        return {
          success: false,
          message: `${item.name} kann nicht direkt verwendet werden. Sende Aktion an KI für spezielle Effekte.`,
          stateChanges: {},
        };
      }

      return {
        success: true,
        message,
        stateChanges: changes,
      };
    },
    [],
  );

  // Simple damage calculation for client-side combat
  const calculateDamage = useCallback((attackerLevel: number, targetDefense = 10): number => {
    const baseDamage = 5 + attackerLevel * 2;
    const variance = Math.floor(Math.random() * 6) - 3; // -3 to +3
    const damage = Math.max(1, baseDamage + variance - targetDefense);
    return damage;
  }, []);

  // Apply environmental radiation
  const applyRadiation = useCallback(
    (amount: number) => {
      onStateChange({ radiation: amount });
    },
    [onStateChange],
  );

  // Rest/Sleep action
  const rest = useCallback((duration: "short" | "full"): Partial<SurvivalState> => {
    if (duration === "short") {
      // Short rest (10-30 minutes)
      return {
        fatigue: -30,
        hunger: -5,
        thirst: -8,
      };
    } else {
      // Full sleep (6-8 hours)
      return {
        fatigue: -80,
        hunger: -20,
        thirst: -25,
      };
    }
  }, []);

  // Validate AI state updates for plausibility
  const validateStateUpdate = useCallback(
    (aiState: any, currentState: any): { valid: boolean; errors: string[] } => {
      const errors: string[] = [];

      // HP shouldn't jump more than ±50 in one update (unless explicit healing/damage)
      if (Math.abs(aiState.hp - currentState.hp) > 50) {
        errors.push(`HP change too large: ${currentState.hp} → ${aiState.hp}`);
      }

      // Level shouldn't decrease or jump more than 1
      if (aiState.level < currentState.level || aiState.level > currentState.level + 1) {
        errors.push(`Invalid level change: ${currentState.level} → ${aiState.level}`);
      }

      // Gold shouldn't become negative
      if (aiState.gold < 0) {
        errors.push(`Negative gold: ${aiState.gold}`);
      }

      // Survival values must be 0-100
      if (aiState.survival) {
        ["hunger", "thirst", "radiation", "fatigue"].forEach((key) => {
          const value = aiState.survival[key];
          if (value < 0 || value > 100) {
            errors.push(`Invalid survival.${key}: ${value} (must be 0-100)`);
          }
        });
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    },
    [],
  );

  // Check critical survival state and apply HP damage
  const checkCriticalState = useCallback(
    (
      survival: SurvivalState,
      currentHP: number,
    ): { hpDamage: number; warnings: string[]; isDead: boolean } => {
      let hpDamage = 0;
      const warnings: string[] = [];

      // Starvation (Hunger at 0)
      if (survival.hunger === 0) {
        hpDamage += 2;
        warnings.push("⚠️ VERHUNGERN: -2 HP");
      }

      // Dehydration (Thirst at 0)
      if (survival.thirst === 0) {
        hpDamage += 3;
        warnings.push("⚠️ VERDURSTEN: -3 HP");
      }

      // Critical Radiation (>80%)
      if (survival.radiation > 80) {
        hpDamage += 1;
        warnings.push("☢️ STRAHLUNG: -1 HP");
      }

      // Extreme Fatigue (>90%)
      if (survival.fatigue > 90) {
        hpDamage += 1;
        warnings.push("💤 ERSCHÖPFUNG: -1 HP");
      }

      const isDead = currentHP - hpDamage <= 0;

      return {
        hpDamage,
        warnings,
        isDead,
      };
    },
    [],
  );

  // Apply damage to enemy and handle death
  const applyEnemyDamage = useCallback(
    (
      enemies: Array<{
        id: string;
        name: string;
        hp: number;
        maxHp: number;
        level: number;
        isBoss: boolean;
      }>,
      targetId: string,
      damage: number,
    ): {
      updatedEnemies: Array<{
        id: string;
        name: string;
        hp: number;
        maxHp: number;
        level: number;
        isBoss: boolean;
      }>;
      killedEnemy: { id: string; name: string } | null;
      combatEnded: boolean;
    } => {
      let killedEnemy: { id: string; name: string } | null = null;

      const updatedEnemies = enemies
        .map((enemy) => {
          if (enemy.id === targetId) {
            const newHp = Math.max(0, enemy.hp - damage);

            if (newHp === 0 && enemy.hp > 0) {
              killedEnemy = { id: enemy.id, name: enemy.name };
              return null; // Remove dead enemy
            }

            return { ...enemy, hp: newHp };
          }
          return enemy;
        })
        .filter(
          (
            enemy,
          ): enemy is {
            id: string;
            name: string;
            hp: number;
            maxHp: number;
            level: number;
            isBoss: boolean;
          } => enemy !== null,
        );

      const combatEnded = updatedEnemies.length === 0;

      return {
        updatedEnemies,
        killedEnemy,
        combatEnded,
      };
    },
    [],
  );

  return {
    useConsumable,
    calculateDamage,
    applyRadiation,
    rest,
    validateStateUpdate,
    checkCriticalState,
    applyEnemyDamage,
  };
}
