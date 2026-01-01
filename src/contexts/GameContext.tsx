import React, { createContext, useCallback, useContext, useState } from "react";

import { useGameEngine } from "../hooks/useGameEngine";
import { cleanGameContent, type GameState, type Item, useGameState } from "../hooks/useGameState";
import type { ChatMessageType } from "../types/chatMessage";

interface GameContextType {
  // State
  gameState: GameState;
  isGameActive: boolean;

  // Actions
  startGame: () => void;
  resetGame: () => void;
  loadGame: () => boolean;
  saveGame: () => void;

  // Engine Interactions (Client-Side Immediate)
  performItemAction: (item: Item) => { success: boolean; message: string };
  combatAction: (action: string) => { success: boolean; message: string; damage?: number };

  // Helpers
  cleanContent: (content: string) => string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: React.ReactNode;
  messages: ChatMessageType[]; // Needed to parse AI updates
  onSendSystemMessage: (message: string, updateInput?: boolean) => void; // Bridge to ChatLogic
}

export const GameProvider: React.FC<GameProviderProps> = ({
  children,
  messages,
  onSendSystemMessage,
}) => {
  // 1. Core State Management (using existing hook for now, but wrapped)
  // We pass a validator to ensure AI doesn't break the state
  const {
    gameState,
    resetGame: internalReset,
    loadSave: internalLoad,
    manualSave: internalSave,
    updateSurvival,
    updateInventory,
    updateCombat,
  } = useGameState(messages, true);

  // 2. Engine Logic (Rules & Simulations)
  const gameEngine = useGameEngine({
    onStateChange: updateSurvival,
    isPlaying: true, // TODO: Link to actual game active state
  });

  const [isGameActive, setIsGameActive] = useState(false);

  // Wrapper for Starting Game
  const startGame = useCallback(() => {
    setIsGameActive(true);
    // Additional logic if needed (e.g. initial prompts)
  }, []);

  // Wrapper for Using Items (Client-Side First)
  const performItemAction = useCallback(
    (item: Item) => {
      // 1. Engine Logic
      const result = gameEngine.useConsumable(item);

      if (result.success) {
        // 2. State Update (Immediate)
        updateSurvival(result.stateChanges);

        // Update Inventory
        const newInventory = gameState.inventory
          .map((invItem) => {
            if (invItem.id === item.id) {
              return { ...invItem, quantity: invItem.quantity - 1 };
            }
            return invItem;
          })
          .filter((i) => i.quantity > 0);
        updateInventory(newInventory);

        // 3. Notify AI (so it knows what happened)
        onSendSystemMessage(
          `[SYSTEM: Spieler nutzte ${item.name}. ${result.message}. State lokal aktualisiert.]`,
          false,
        );
      } else {
        // Fallback to AI if engine can't handle it (e.g. specific quest items)
        onSendSystemMessage(`Benutze ${item.name}`, true);
      }

      return { success: result.success, message: result.message };
    },
    [gameEngine, gameState.inventory, updateSurvival, updateInventory, onSendSystemMessage],
  );

  // Wrapper for Combat (Client-Side First)
  const combatAction = useCallback(
    (action: string) => {
      if (!gameState.combat.active) {
        return { success: false, message: "Kein Kampf aktiv." };
      }

      if (action.toLowerCase().includes("angriff")) {
        const damage = gameEngine.calculateDamage(gameState.level);
        const target = gameState.combat.enemies[0];

        if (target) {
          const { updatedEnemies, killedEnemy, combatEnded } = gameEngine.applyEnemyDamage(
            gameState.combat.enemies,
            target.id,
            damage,
          );

          // Immediate Update
          updateCombat({
            enemies: updatedEnemies,
            active: !combatEnded,
          });

          // Notify AI
          const statusMsg = killedEnemy
            ? `[COMBAT: ${killedEnemy.name} besiegt! Siegesszene einleiten.]`
            : `[COMBAT: ${damage} Schaden an ${target.name}. Rest-HP: ${updatedEnemies[0]?.hp}.]`;

          onSendSystemMessage(statusMsg, false);

          return { success: true, message: `Angriff: ${damage} Schaden`, damage };
        }
      }

      // Fallback for non-standard actions (Magic, Flee, etc.)
      onSendSystemMessage(action, true);
      return { success: true, message: "Aktion an KI gesendet." };
    },
    [gameState.combat, gameState.level, gameEngine, updateCombat, onSendSystemMessage],
  );

  const value = {
    gameState,
    isGameActive,
    startGame,
    resetGame: internalReset,
    loadGame: () => !!internalLoad(),
    saveGame: internalSave,
    performItemAction,
    combatAction,
    cleanContent: cleanGameContent,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
