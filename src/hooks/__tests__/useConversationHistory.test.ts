/**
 * Unit-Tests für useConversationHistory
 *
 * Dieser Hook transformiert Conversation-Daten in ein formatiertes History-Objekt.
 * Tests prüfen:
 * - Korrekte Sortierung nach Datum (neueste zuerst)
 * - Formatierung von Datumsangaben
 * - Trennung in aktive und archivierte Konversationen
 * - Handling von leeren/null-Eingaben
 */
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Conversation } from "../../lib/conversation-manager-modern";
import { useConversationHistory } from "../useConversationHistory";

// Beispiel-Konversationen für Tests (mit allen erforderlichen Feldern)
const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Erste Konversation",
    messages: [],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
    messageCount: 5,
    model: "gpt-4o",
  },
  {
    id: "conv-2",
    title: "Zweite Konversation",
    messages: [],
    createdAt: "2024-01-16T08:00:00Z",
    updatedAt: "2024-01-16T14:00:00Z",
    messageCount: 3,
    model: "claude-3",
  },
  {
    id: "conv-3",
    title: "Dritte Konversation",
    messages: [],
    createdAt: "2024-01-17T09:00:00Z",
    updatedAt: "2024-01-17T09:30:00Z",
    messageCount: 2,
    model: "gpt-4o-mini",
  },
  {
    id: "conv-4",
    title: "Vierte Konversation",
    messages: [],
    createdAt: "2024-01-14T11:00:00Z",
    updatedAt: "2024-01-14T15:00:00Z",
    messageCount: 8,
    model: "gpt-4o",
  },
];

describe("useConversationHistory", () => {
  describe("Grundlegende Funktionalität", () => {
    it("gibt die Konversationsliste zurück", () => {
      const { result } = renderHook(() => useConversationHistory(mockConversations, null));

      expect(result.current.conversationList).toEqual(mockConversations);
      expect(result.current.conversationCount).toBe(4);
    });

    it("findet die aktive Konversation anhand der ID", () => {
      const { result } = renderHook(() => useConversationHistory(mockConversations, "conv-2"));

      expect(result.current.activeConversation).toEqual(mockConversations[1]);
    });

    it("gibt null zurück, wenn keine Konversation aktiv ist", () => {
      const { result } = renderHook(() => useConversationHistory(mockConversations, null));

      expect(result.current.activeConversation).toBeNull();
    });

    it("gibt null zurück, wenn die aktive ID nicht gefunden wird", () => {
      const { result } = renderHook(() =>
        useConversationHistory(mockConversations, "non-existent-id"),
      );

      expect(result.current.activeConversation).toBeNull();
    });
  });

  describe("Sortierung", () => {
    it("sortiert Konversationen nach updatedAt (neueste zuerst)", () => {
      const { result } = renderHook(() => useConversationHistory(mockConversations, null));

      // conv-3 ist am neuesten (17. Jan), dann conv-2 (16. Jan), conv-1 (15. Jan), conv-4 (14. Jan)
      expect(result.current.historyPages[0]?.id).toBe("conv-3");
      expect(result.current.historyPages[1]?.id).toBe("conv-2");
      expect(result.current.historyPages[2]?.id).toBe("conv-1");
      expect(result.current.historyPages[3]?.id).toBe("conv-4");
    });

    it("verwendet createdAt als Fallback, wenn updatedAt fehlt", () => {
      const conversationsWithoutUpdated: Conversation[] = [
        {
          id: "old",
          title: "Alte Konversation",
          messages: [],
          createdAt: "2024-01-01T10:00:00Z",
          updatedAt: "2024-01-01T10:00:00Z", // Same as createdAt
          messageCount: 1,
          model: "gpt-4o",
        },
        {
          id: "new",
          title: "Neue Konversation",
          messages: [],
          createdAt: "2024-01-10T10:00:00Z",
          updatedAt: "2024-01-10T10:00:00Z", // Same as createdAt
          messageCount: 1,
          model: "gpt-4o",
        },
      ];

      const { result } = renderHook(() =>
        useConversationHistory(conversationsWithoutUpdated, null),
      );

      expect(result.current.historyPages[0]?.id).toBe("new");
      expect(result.current.historyPages[1]?.id).toBe("old");
    });
  });

  describe("History Pages Formatierung", () => {
    it("formatiert historyPages korrekt", () => {
      const { result } = renderHook(() => useConversationHistory(mockConversations, null));

      const firstPage = result.current.historyPages[0];
      expect(firstPage).toHaveProperty("id");
      expect(firstPage).toHaveProperty("title");
      expect(firstPage).toHaveProperty("date");
      expect(firstPage?.title).toBe("Dritte Konversation");
    });

    it("formatiert Datumsangaben in deutschem Format", () => {
      const { result } = renderHook(() => useConversationHistory(mockConversations, null));

      // Datum sollte im deutschen Format sein, z.B. "17. Jan."
      // Das Format ist "dd. MMM" (Tag + abgekürzter Monat)
      const datePattern = /^\d{2}\.\s*\w{3}\.?$/; // z.B. "17. Jan."
      const firstPageDate = result.current.historyPages[0]?.date ?? "";
      expect(firstPageDate).toMatch(datePattern);
    });

    it("verwendet 'Unbenannter Chat' als Fallback-Titel", () => {
      const conversationsWithoutTitle: Conversation[] = [
        {
          id: "no-title",
          title: "",
          messages: [],
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z",
          messageCount: 1,
          model: "gpt-4o",
        },
      ];

      const { result } = renderHook(() => useConversationHistory(conversationsWithoutTitle, null));

      expect(result.current.historyPages[0]?.title).toBe("Unbenannter Chat");
    });
  });

  describe("Aktive und archivierte Pages", () => {
    it("trennt die ersten 3 als activeHistoryPages", () => {
      const { result } = renderHook(() => useConversationHistory(mockConversations, null));

      expect(result.current.activeHistoryPages).toHaveLength(3);
      expect(result.current.activeHistoryPages[0]?.id).toBe("conv-3");
      expect(result.current.activeHistoryPages[1]?.id).toBe("conv-2");
      expect(result.current.activeHistoryPages[2]?.id).toBe("conv-1");
    });

    it("setzt den Rest als archivedHistoryPages", () => {
      const { result } = renderHook(() => useConversationHistory(mockConversations, null));

      expect(result.current.archivedHistoryPages).toHaveLength(1);
      expect(result.current.archivedHistoryPages[0]?.id).toBe("conv-4");
    });

    it("behandelt weniger als 3 Konversationen korrekt", () => {
      const fewConversations = mockConversations.slice(0, 2);

      const { result } = renderHook(() => useConversationHistory(fewConversations, null));

      expect(result.current.activeHistoryPages).toHaveLength(2);
      expect(result.current.archivedHistoryPages).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    it("behandelt null als conversations", () => {
      const { result } = renderHook(() => useConversationHistory(null, null));

      expect(result.current.conversationList).toEqual([]);
      expect(result.current.conversationCount).toBe(0);
      expect(result.current.historyPages).toEqual([]);
    });

    it("behandelt undefined als conversations", () => {
      const { result } = renderHook(() => useConversationHistory(undefined, null));

      expect(result.current.conversationList).toEqual([]);
      expect(result.current.conversationCount).toBe(0);
    });

    it("behandelt leeres Array", () => {
      const { result } = renderHook(() => useConversationHistory([], null));

      expect(result.current.conversationList).toEqual([]);
      expect(result.current.conversationCount).toBe(0);
      expect(result.current.activeConversation).toBeNull();
    });

    it("behandelt Konversation ohne Datum", () => {
      // Use type assertion to simulate missing dates
      const noDateConversation = [
        {
          id: "no-date",
          title: "Ohne Datum",
          messages: [],
          messageCount: 1,
          model: "gpt-4o",
          createdAt: undefined,
          updatedAt: undefined,
        },
      ] as unknown as Conversation[];

      const { result } = renderHook(() => useConversationHistory(noDateConversation, null));

      expect(result.current.historyPages[0]?.date).toBe("Unbekannt");
    });
  });

  describe("Memoization", () => {
    it("aktualisiert sich bei Änderung der conversations", () => {
      const { result, rerender } = renderHook(
        ({ conversations, activeId }) => useConversationHistory(conversations, activeId),
        { initialProps: { conversations: mockConversations, activeId: null as string | null } },
      );

      expect(result.current.conversationCount).toBe(4);

      const newConversations: Conversation[] = [
        ...mockConversations,
        {
          id: "conv-5",
          title: "Fünfte Konversation",
          messages: [],
          createdAt: "2024-01-18T10:00:00Z",
          updatedAt: "2024-01-18T10:00:00Z",
          messageCount: 1,
          model: "gpt-4o",
        },
      ];

      rerender({ conversations: newConversations, activeId: null });

      expect(result.current.conversationCount).toBe(5);
    });

    it("aktualisiert sich bei Änderung der activeConversationId", () => {
      const { result, rerender } = renderHook(
        ({ conversations, activeId }) => useConversationHistory(conversations, activeId),
        { initialProps: { conversations: mockConversations, activeId: null as string | null } },
      );

      expect(result.current.activeConversation).toBeNull();

      rerender({ conversations: mockConversations, activeId: "conv-2" });

      expect(result.current.activeConversation?.id).toBe("conv-2");
    });
  });
});
