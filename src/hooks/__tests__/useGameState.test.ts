import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { ChatMessageType } from "../../types/chatMessage";
import { cleanGameContent, useGameState } from "../useGameState";

const baseMessage = (overrides: Partial<ChatMessageType>): ChatMessageType => ({
  id: "msg-" + Math.random().toString(36).slice(2),
  role: "user",
  content: "",
  timestamp: Date.now(),
  ...overrides,
});

describe("useGameState", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("returns defaults when no messages are provided", () => {
    const { result } = renderHook(() => useGameState([], false));

    expect(result.current.gameState).toEqual({
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
      suggested_actions: [],
    });
  });

  it("parses the latest valid game_state block with extended fields", async () => {
    const messages: ChatMessageType[] = [
      baseMessage({ role: "user", content: "Start" }),
      baseMessage({
        role: "assistant",
        content: `Story\n<game_state>\n{
          "hp":72,
          "maxHp":120,
          "gold":12,
          "location":"Ruins",
          "inventory":[{"id":"torch1","name":"Torch","type":"misc","quantity":1}],
          "level":2,
          "xp":150,
          "xpToNextLevel":200,
          "stats":{"strength":12,"dexterity":10,"constitution":11,"intelligence":10,"wisdom":10,"charisma":10},
          "suggested_actions":["Untersuche Wrack","Scan Umgebung"]
        }\n</game_state>`,
      }),
    ];

    const { result } = renderHook(() => useGameState(messages, false));

    await waitFor(() => {
      expect(result.current.gameState.hp).toBe(72);
      expect(result.current.gameState.maxHp).toBe(120);
      expect(result.current.gameState.gold).toBe(12);
      expect(result.current.gameState.location).toBe("Ruins");
      expect(result.current.gameState.level).toBe(2);
      expect(result.current.gameState.xp).toBe(150);
      expect(result.current.gameState.inventory).toHaveLength(1);
      expect(result.current.gameState.inventory[0]?.name).toBe("Torch");
      expect(result.current.gameState.suggested_actions).toEqual([
        "Untersuche Wrack",
        "Scan Umgebung",
      ]);
    });
  });

  it("converts legacy string inventory to new format", async () => {
    const messages: ChatMessageType[] = [
      baseMessage({
        role: "assistant",
        content: `<game_state>{"inventory":["Sword","Shield"]}</game_state>`,
      }),
    ];

    const { result } = renderHook(() => useGameState(messages, false));

    await waitFor(() => {
      expect(result.current.gameState.inventory).toHaveLength(2);
      expect(result.current.gameState.inventory[0]?.name).toBe("Sword");
      expect(result.current.gameState.inventory[1]?.name).toBe("Shield");
      expect(result.current.gameState.inventory[0]?.type).toBe("misc");
    });
  });

  it("skips invalid blocks and falls back to earlier state", async () => {
    const messages: ChatMessageType[] = [
      baseMessage({
        role: "assistant",
        content: `Earlier\n<game_state>{"hp":80,"gold":5,"location":"Camp"}</game_state>`,
      }),
      baseMessage({
        role: "assistant",
        content: "Broken\n<game_state>{not-json}</game_state>",
      }),
    ];

    const { result } = renderHook(() => useGameState(messages, false));

    await waitFor(() => {
      expect(result.current.gameState.hp).toBe(80);
      expect(result.current.gameState.gold).toBe(5);
      expect(result.current.gameState.location).toBe("Camp");
    });
  });

  it("provides save/load/reset functions", () => {
    const { result } = renderHook(() => useGameState([], false));

    expect(result.current.resetGame).toBeDefined();
    expect(result.current.loadSave).toBeDefined();
    expect(result.current.manualSave).toBeDefined();
  });

  it("parses quests and achievements", async () => {
    const messages: ChatMessageType[] = [
      baseMessage({
        role: "assistant",
        content: `<game_state>{
          "quests":[{"id":"q1","title":"Find the Sword","description":"Locate the legendary sword","completed":false,"progress":50}],
          "achievements":["First Steps","Brave Explorer"]
        }</game_state>`,
      }),
    ];

    const { result } = renderHook(() => useGameState(messages, false));

    await waitFor(() => {
      expect(result.current.gameState.quests).toHaveLength(1);
      expect(result.current.gameState.quests[0]?.title).toBe("Find the Sword");
      expect(result.current.gameState.achievements).toEqual(["First Steps", "Brave Explorer"]);
    });
  });

  it("clears achievements when an empty array is provided", async () => {
    const initialMessages: ChatMessageType[] = [
      baseMessage({
        role: "assistant",
        content: `<game_state>{"achievements":["First Steps"]}</game_state>`,
      }),
    ];

    const { result, rerender } = renderHook(({ messages }) => useGameState(messages, false), {
      initialProps: { messages: initialMessages },
    });

    await waitFor(() => {
      expect(result.current.gameState.achievements).toEqual(["First Steps"]);
    });

    const nextMessages: ChatMessageType[] = [
      ...initialMessages,
      baseMessage({
        role: "assistant",
        content: `<game_state>{"achievements":[]}</game_state>`,
      }),
    ];

    rerender({ messages: nextMessages });

    await waitFor(() => {
      expect(result.current.gameState.achievements).toEqual([]);
    });
  });

  it("parses combat state", async () => {
    const messages: ChatMessageType[] = [
      baseMessage({
        role: "assistant",
        content: `<game_state>{
          "combat":{
            "active":true,
            "turn":2,
            "roundNumber":3,
            "enemies":[{"id":"e1","name":"Goblin","hp":30,"maxHp":50,"level":3,"isBoss":false}],
            "actions":[{"id":"a1","timestamp":${Date.now()},"actor":"Player","action":"Angriff","target":"Goblin","damage":15,"success":true}]
          }
        }</game_state>`,
      }),
    ];

    const { result } = renderHook(() => useGameState(messages, false));

    await waitFor(() => {
      expect(result.current.gameState.combat.active).toBe(true);
      expect(result.current.gameState.combat.roundNumber).toBe(3);
      expect(result.current.gameState.combat.enemies).toHaveLength(1);
      expect(result.current.gameState.combat.enemies[0]?.name).toBe("Goblin");
      expect(result.current.gameState.combat.actions).toHaveLength(1);
      expect(result.current.gameState.combat.actions[0]?.action).toBe("attack");
    });
  });

  it("parses skill tree", async () => {
    const messages: ChatMessageType[] = [
      baseMessage({
        role: "assistant",
        content: `<game_state>{
          "skillTree":{
            "availablePoints":3,
            "skills":[{
              "id":"s1",
              "name":"Power Strike",
              "description":"Deal extra damage",
              "tier":1,
              "cost":1,
              "unlocked":true,
              "maxLevel":3,
              "currentLevel":2,
              "requirements":[],
              "effects":{"damageBonus":10}
            }]
          }
        }</game_state>`,
      }),
    ];

    const { result } = renderHook(() => useGameState(messages, false));

    await waitFor(() => {
      expect(result.current.gameState.skillTree.availablePoints).toBe(3);
      expect(result.current.gameState.skillTree.skills).toHaveLength(1);
      expect(result.current.gameState.skillTree.skills[0]?.name).toBe("Power Strike");
      expect(result.current.gameState.skillTree.skills[0]?.unlocked).toBe(true);
    });
  });

  it("parses trade state", async () => {
    const messages: ChatMessageType[] = [
      baseMessage({
        role: "assistant",
        content: `<game_state>{
          "trade":{
            "reputation":75,
            "activeOffers":[{
              "id":"t1",
              "npcName":"Merchant Bob",
              "npcDialogue":"Looking to trade?",
              "offeredItems":[{"id":"i1","name":"Health Potion","type":"Ruestung","quantity":3}],
              "requestedItems":[],
              "goldOffered":0,
              "goldRequested":30,
              "completed":false
            }],
            "history":[]
          }
        }</game_state>`,
      }),
    ];

    const { result } = renderHook(() => useGameState(messages, false));

    await waitFor(() => {
      expect(result.current.gameState.trade.reputation).toBe(75);
      expect(result.current.gameState.trade.activeOffers).toHaveLength(1);
      expect(result.current.gameState.trade.activeOffers[0]?.npcName).toBe("Merchant Bob");
      expect(result.current.gameState.trade.activeOffers[0]?.offeredItems[0]?.type).toBe("armor");
    });
  });

  it("removes game_state blocks from display content", () => {
    const content = 'Intro text\n<game_state>{"hp":10}</game_state>\nMore story';
    expect(cleanGameContent(content)).toBe("Intro text\n\nMore story");
  });
});
