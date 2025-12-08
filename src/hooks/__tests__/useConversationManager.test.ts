/**
 * Unit-Tests für useConversationManager
 *
 * Dieser Hook ist zentral für die Verwaltung von Konversationen:
 * - Auto-Save bei neuen Nachrichten
 * - Konversation laden/löschen/erstellen
 * - localStorage Persistierung der letzten Konversation
 * - Toast-Benachrichtigungen
 */
import { act, renderHook, waitFor } from "@testing-library/react";
import { useLocation, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { useToasts } from "@/ui";

import { STORAGE_KEYS } from "../../config/storageKeys";
import {
  deleteConversation,
  getAllConversations,
  getConversation,
  saveConversation,
  updateConversation,
} from "../../lib/conversation-manager-modern";
import { useConversationManager } from "../useConversationManager";

// Mocks müssen vor dem Hook-Import definiert werden
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

vi.mock("@/ui", () => ({
  useToasts: vi.fn(),
}));

vi.mock("../../lib/conversation-manager-modern", () => ({
  getAllConversations: vi.fn(),
  getConversation: vi.fn(),
  saveConversation: vi.fn(),
  updateConversation: vi.fn(),
  deleteConversation: vi.fn(),
}));

// Test-Daten
const mockConversation = {
  id: "conv-123",
  title: "Test Conversation",
  messages: [
    { id: "msg-1", role: "user", content: "Hallo", timestamp: Date.now() },
    { id: "msg-2", role: "assistant", content: "Hi!", timestamp: Date.now(), model: "gpt-4o" },
  ],
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T12:00:00Z",
  messageCount: 2,
  model: "gpt-4o",
};

const mockConversations = [
  mockConversation,
  {
    id: "conv-456",
    title: "Second Conversation",
    messages: [],
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
    messageCount: 0,
    model: "gpt-4o",
  },
];

describe("useConversationManager", () => {
  // Mock Funktionen
  const mockNavigate = vi.fn();
  const mockPush = vi.fn();
  const mockSetMessages = vi.fn();
  const mockSetCurrentSystemPrompt = vi.fn();
  const mockOnNewConversation = vi.fn();

  const defaultProps = {
    messages: [],
    isLoading: false,
    setMessages: mockSetMessages,
    setCurrentSystemPrompt: mockSetCurrentSystemPrompt,
    onNewConversation: mockOnNewConversation,
    saveEnabled: true,
    restoreEnabled: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Setup Router Mocks
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    (useLocation as Mock).mockReturnValue({ pathname: "/chat", state: null });

    // Setup Toast Mock
    (useToasts as Mock).mockReturnValue({ push: mockPush });

    // Setup Conversation Manager Mocks
    (getAllConversations as Mock).mockResolvedValue(mockConversations);
    (getConversation as Mock).mockResolvedValue(mockConversation);
    (saveConversation as Mock).mockResolvedValue(undefined);
    (updateConversation as Mock).mockResolvedValue(undefined);
    (deleteConversation as Mock).mockResolvedValue(undefined);

    // Mock window.confirm für Delete-Tests
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initialer Zustand", () => {
    it("initialisiert mit geschlossener History und leeren Konversationen", () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      expect(result.current.isHistoryOpen).toBe(false);
      expect(result.current.conversations).toEqual([]);
      expect(result.current.activeConversationId).toBeNull();
    });

    it("gibt alle Management-Funktionen zurück", () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      expect(typeof result.current.openHistory).toBe("function");
      expect(typeof result.current.closeHistory).toBe("function");
      expect(typeof result.current.selectConversation).toBe("function");
      expect(typeof result.current.deleteConversation).toBe("function");
      expect(typeof result.current.newConversation).toBe("function");
      expect(typeof result.current.refreshConversations).toBe("function");
    });
  });

  describe("History öffnen/schließen", () => {
    it("öffnet die History und lädt Konversationen", async () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      act(() => {
        result.current.openHistory();
      });

      expect(result.current.isHistoryOpen).toBe(true);

      await waitFor(() => {
        expect(getAllConversations).toHaveBeenCalled();
      });
    });

    it("schließt die History", () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      act(() => {
        result.current.openHistory();
      });

      expect(result.current.isHistoryOpen).toBe(true);

      act(() => {
        result.current.closeHistory();
      });

      expect(result.current.isHistoryOpen).toBe(false);
    });
  });

  describe("Konversationen laden", () => {
    it("lädt alle Konversationen bei refreshConversations", async () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      await act(async () => {
        await result.current.refreshConversations();
      });

      expect(getAllConversations).toHaveBeenCalled();
      expect(result.current.conversations).toEqual(mockConversations);
    });

    it("zeigt Fehler-Toast wenn Laden fehlschlägt", async () => {
      (getAllConversations as Mock).mockRejectedValueOnce(new Error("DB Error"));

      const { result } = renderHook(() => useConversationManager(defaultProps));

      await act(async () => {
        await result.current.refreshConversations();
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: "error",
          title: "Fehler",
        }),
      );
    });
  });

  describe("Konversation auswählen", () => {
    it("lädt eine Konversation und setzt Nachrichten", async () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      await act(async () => {
        await result.current.selectConversation("conv-123");
      });

      expect(getConversation).toHaveBeenCalledWith("conv-123");
      expect(mockSetMessages).toHaveBeenCalled();
      expect(mockOnNewConversation).toHaveBeenCalled();
    });

    it("zeigt Erfolgs-Toast nach dem Laden", async () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      await act(async () => {
        await result.current.selectConversation("conv-123");
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: "success",
          title: "Konversation geladen",
        }),
      );
    });

    it("zeigt keinen Toast im silent-Modus", async () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      await act(async () => {
        await result.current.selectConversation("conv-123", { silent: true });
      });

      expect(mockPush).not.toHaveBeenCalledWith(
        expect.objectContaining({
          kind: "success",
        }),
      );
    });

    it("zeigt Fehler bei beschädigter Konversation", async () => {
      (getConversation as Mock).mockResolvedValueOnce({ id: "conv-123", messages: null });

      const { result } = renderHook(() => useConversationManager(defaultProps));

      await act(async () => {
        await result.current.selectConversation("conv-123");
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: "error",
          message: expect.stringContaining("beschädigt"),
        }),
      );
    });

    it("zeigt Warnung bei leerer Konversation", async () => {
      (getConversation as Mock).mockResolvedValueOnce({
        id: "conv-123",
        messages: [{ role: "unknown", content: "test" }],
      });

      const { result } = renderHook(() => useConversationManager(defaultProps));

      await act(async () => {
        await result.current.selectConversation("conv-123");
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: "warning",
          title: "Konversation leer",
        }),
      );
    });

    it("setzt System-Prompt wenn vorhanden", async () => {
      const conversationWithSystem = {
        ...mockConversation,
        messages: [
          { id: "sys-1", role: "system", content: "Du bist ein Assistent", timestamp: Date.now() },
          ...mockConversation.messages,
        ],
      };
      (getConversation as Mock).mockResolvedValueOnce(conversationWithSystem);

      const { result } = renderHook(() => useConversationManager(defaultProps));

      await act(async () => {
        await result.current.selectConversation("conv-123");
      });

      expect(mockSetCurrentSystemPrompt).toHaveBeenCalledWith("Du bist ein Assistent");
    });
  });

  describe("Konversation löschen", () => {
    it("löscht Konversation nach Bestätigung", async () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      await act(async () => {
        await result.current.deleteConversation("conv-123");
      });

      expect(window.confirm).toHaveBeenCalled();
      expect(deleteConversation).toHaveBeenCalledWith("conv-123");
    });

    it("zeigt Erfolgs-Toast nach Löschen", async () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      await act(async () => {
        await result.current.deleteConversation("conv-123");
      });

      expect(mockPush).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: "success",
          title: "Gelöscht",
        }),
      );
    });

    it("bricht ab wenn Benutzer nicht bestätigt", async () => {
      vi.spyOn(window, "confirm").mockReturnValueOnce(false);

      const { result } = renderHook(() => useConversationManager(defaultProps));

      await act(async () => {
        await result.current.deleteConversation("conv-123");
      });

      expect(deleteConversation).not.toHaveBeenCalled();
    });

    it("setzt Zustand zurück wenn aktive Konversation gelöscht wird", async () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      // Erst Konversation auswählen
      await act(async () => {
        await result.current.selectConversation("conv-123");
      });

      // Dann löschen
      await act(async () => {
        await result.current.deleteConversation("conv-123");
      });

      expect(mockSetMessages).toHaveBeenCalledWith([]);
      expect(mockSetCurrentSystemPrompt).toHaveBeenCalledWith(undefined);
      expect(mockOnNewConversation).toHaveBeenCalled();
    });
  });

  describe("Neue Konversation", () => {
    it("setzt Zustand zurück und zeigt Info-Toast", () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      act(() => {
        result.current.newConversation();
      });

      expect(mockSetMessages).toHaveBeenCalledWith([]);
      expect(mockOnNewConversation).toHaveBeenCalled();
      expect(mockSetCurrentSystemPrompt).toHaveBeenCalledWith(undefined);
      expect(mockPush).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: "info",
          title: "Neue Unterhaltung",
        }),
      );
    });
  });

  describe("localStorage Persistierung", () => {
    it("speichert letzte Konversations-ID bei Auswahl", async () => {
      const { result } = renderHook(() => useConversationManager(defaultProps));

      await act(async () => {
        await result.current.selectConversation("conv-123");
      });

      expect(localStorage.getItem(STORAGE_KEYS.LAST_CONVERSATION)).toBe("conv-123");
    });

    it("entfernt ID bei neuer Konversation", () => {
      localStorage.setItem(STORAGE_KEYS.LAST_CONVERSATION, "conv-123");

      const { result } = renderHook(() => useConversationManager(defaultProps));

      act(() => {
        result.current.newConversation();
      });

      expect(localStorage.getItem(STORAGE_KEYS.LAST_CONVERSATION)).toBeNull();
    });
  });

  describe("Auto-Restore", () => {
    it("lädt letzte Konversation aus localStorage beim Start", async () => {
      localStorage.setItem(STORAGE_KEYS.LAST_CONVERSATION, "conv-123");

      renderHook(() => useConversationManager(defaultProps));

      await waitFor(() => {
        expect(getConversation).toHaveBeenCalledWith("conv-123");
      });
    });

    it("lädt nicht wenn messages bereits vorhanden sind", async () => {
      localStorage.setItem(STORAGE_KEYS.LAST_CONVERSATION, "conv-123");

      renderHook(() =>
        useConversationManager({
          ...defaultProps,
          messages: [{ id: "msg-1", role: "user", content: "Test", timestamp: Date.now() }],
        }),
      );

      // Kurz warten und prüfen dass nichts geladen wurde
      await new Promise((r) => setTimeout(r, 50));
      expect(getConversation).not.toHaveBeenCalled();
    });

    it("lädt nicht wenn restoreEnabled=false", async () => {
      localStorage.setItem(STORAGE_KEYS.LAST_CONVERSATION, "conv-123");

      renderHook(() =>
        useConversationManager({
          ...defaultProps,
          restoreEnabled: false,
        }),
      );

      await new Promise((r) => setTimeout(r, 50));
      expect(getConversation).not.toHaveBeenCalled();
    });
  });

  describe("URL-basierte Konversation laden", () => {
    it("lädt Konversation aus location.state", async () => {
      (useLocation as Mock).mockReturnValue({
        pathname: "/chat",
        state: { conversationId: "conv-456" },
      });

      renderHook(() => useConversationManager(defaultProps));

      await waitFor(() => {
        expect(getConversation).toHaveBeenCalledWith("conv-456");
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        "/chat",
        expect.objectContaining({ replace: true }),
      );
    });
  });

  describe("Auto-Save", () => {
    it("speichert nicht während isLoading=true", async () => {
      const messagesWithAssistant = [
        { id: "msg-1", role: "user" as const, content: "Frage", timestamp: Date.now() },
        {
          id: "msg-2",
          role: "assistant" as const,
          content: "Antwort...",
          timestamp: Date.now(),
          model: "gpt-4o",
        },
      ];

      renderHook(() =>
        useConversationManager({
          ...defaultProps,
          messages: messagesWithAssistant,
          isLoading: true,
        }),
      );

      await new Promise((r) => setTimeout(r, 50));
      expect(saveConversation).not.toHaveBeenCalled();
      expect(updateConversation).not.toHaveBeenCalled();
    });

    it("speichert nicht wenn saveEnabled=false", async () => {
      const messagesWithAssistant = [
        { id: "msg-1", role: "user" as const, content: "Frage", timestamp: Date.now() },
        {
          id: "msg-2",
          role: "assistant" as const,
          content: "Antwort",
          timestamp: Date.now(),
          model: "gpt-4o",
        },
      ];

      renderHook(() =>
        useConversationManager({
          ...defaultProps,
          messages: messagesWithAssistant,
          saveEnabled: false,
        }),
      );

      await new Promise((r) => setTimeout(r, 50));
      expect(saveConversation).not.toHaveBeenCalled();
    });

    it("erstellt neue Konversation bei erstem Save", async () => {
      vi.spyOn(crypto, "randomUUID").mockReturnValueOnce("12345678-1234-1234-1234-123456789abc");

      const messagesWithAssistant = [
        { id: "msg-1", role: "user" as const, content: "Frage", timestamp: Date.now() },
        {
          id: "msg-2",
          role: "assistant" as const,
          content: "Antwort",
          timestamp: Date.now(),
          model: "gpt-4o",
        },
      ];

      renderHook(() =>
        useConversationManager({
          ...defaultProps,
          messages: messagesWithAssistant,
          isLoading: false,
        }),
      );

      await waitFor(() => {
        expect(saveConversation).toHaveBeenCalledWith(
          expect.objectContaining({
            id: "12345678-1234-1234-1234-123456789abc",
            title: "Frage",
          }),
        );
      });
    });
  });
});
