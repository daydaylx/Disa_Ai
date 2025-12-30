import { useEffect, useState } from "react";

import type { ChatMessageType } from "../types/chatMessage";

export interface GameState {
  hp: number;
  maxHp: number;
  gold: number;
  location: string;
  inventory: string[];
}

const DEFAULT_STATE: GameState = {
  hp: 100,
  maxHp: 100,
  gold: 0,
  location: "Unbekannt",
  inventory: [],
};

export function useGameState(messages: ChatMessageType[]) {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_STATE);

  useEffect(() => {
    if (messages.length === 0) return;

    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const msg = messages[i];
      if (msg.role === "assistant") {
        const match = msg.content.match(/<game_state>([\s\S]*?)<\/game_state>/);
        if (match?.[1]) {
          try {
            const parsed = JSON.parse(match[1]);
            setGameState((prev) => ({ ...prev, ...parsed }));
            break;
          } catch (error) {
            console.error("Game Parse Error", error);
          }
        }
      }
    }
  }, [messages]);

  return gameState;
}

export function cleanGameContent(content: string): string {
  return content.replace(/<game_state>[\s\S]*?<\/game_state>/g, "").trim();
}
