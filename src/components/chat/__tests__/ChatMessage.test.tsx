/**
 * Unit-Tests für ChatMessage
 *
 * Diese Tests prüfen die Nachrichtenanzeige im Chat:
 * - Korrekte Darstellung von User- und Assistant-Nachrichten
 * - Code-Blöcke werden korrekt geparst und dargestellt
 * - Kopieren-Funktion
 * - Bearbeiten-Funktion für User-Nachrichten
 * - Retry-Funktion für Assistant-Nachrichten
 * - Zeitstempel-Anzeige
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ChatMessage, type ChatMessageType } from "../ChatMessage";

// Mock für navigator.clipboard
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};
Object.defineProperty(navigator, "clipboard", {
  value: mockClipboard,
  writable: true,
});

// Beispiel-Nachrichten für Tests
const userMessage: ChatMessageType = {
  id: "msg-user-1",
  role: "user",
  content: "Hallo, wie geht es dir?",
  timestamp: Date.now(),
};

const assistantMessage: ChatMessageType = {
  id: "msg-assistant-1",
  role: "assistant",
  content: "Mir geht es gut, danke der Nachfrage!",
  timestamp: Date.now(),
};

const messageWithCode: ChatMessageType = {
  id: "msg-code-1",
  role: "assistant",
  content: `Hier ist ein Beispiel:

\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\`

Das ist JavaScript Code.`,
  timestamp: Date.now(),
};

const systemMessage: ChatMessageType = {
  id: "msg-system-1",
  role: "system",
  content: "System-Anweisung",
  timestamp: Date.now(),
};

describe("ChatMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering von Nachrichten", () => {
    it("rendert eine User-Nachricht korrekt", () => {
      render(<ChatMessage message={userMessage} />);

      expect(screen.getByText("Hallo, wie geht es dir?")).toBeInTheDocument();
      expect(screen.getByTestId("message.item")).toBeInTheDocument();
    });

    it("rendert eine Assistant-Nachricht korrekt", () => {
      render(<ChatMessage message={assistantMessage} />);

      expect(screen.getByText("Mir geht es gut, danke der Nachfrage!")).toBeInTheDocument();
    });

    it("rendert System-Nachrichten NICHT", () => {
      render(<ChatMessage message={systemMessage} />);

      // System-Nachrichten sollten nicht dargestellt werden
      expect(screen.queryByText("System-Anweisung")).not.toBeInTheDocument();
    });

    it("zeigt den Zeitstempel an", () => {
      render(<ChatMessage message={userMessage} />);

      // Der Zeitstempel wird im Format HH:MM dargestellt
      const time = new Date(userMessage.timestamp).toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      });
      expect(screen.getByText(time)).toBeInTheDocument();
    });
  });

  describe("Code-Blöcke", () => {
    it("parst und rendert Code-Blöcke korrekt", () => {
      render(<ChatMessage message={messageWithCode} />);

      // Text vor dem Code-Block
      expect(screen.getByText(/Hier ist ein Beispiel/)).toBeInTheDocument();

      // Code-Inhalt (check for parts of the code since syntax highlighting splits it)
      expect(screen.getByText("console")).toBeInTheDocument();
      expect(screen.getByText("log")).toBeInTheDocument();
      expect(screen.getByText(/"Hello World"/)).toBeInTheDocument();

      // Text nach dem Code-Block
      expect(screen.getByText("Das ist JavaScript Code.")).toBeInTheDocument();
    });

    it("zeigt die Sprache des Code-Blocks an", () => {
      render(<ChatMessage message={messageWithCode} />);

      // Die Sprache wird als Label angezeigt (uppercase)
      expect(screen.getByText("javascript")).toBeInTheDocument();
    });

    it("hat einen Kopieren-Button für Code-Blöcke", () => {
      render(<ChatMessage message={messageWithCode} />);

      // Code-Block hat einen Kopieren-Button
      const codeBlock = screen.getByText("javascript").closest("div");
      expect(codeBlock).toBeInTheDocument();

      const copyButton = codeBlock?.querySelector("button");
      expect(copyButton).toBeInTheDocument();
    });
  });

  describe("Kopieren-Funktion", () => {
    it("kopiert den Nachrichteninhalt beim Klick auf Kopieren", async () => {
      render(<ChatMessage message={userMessage} onCopy={vi.fn()} />);

      // Finde den Kopieren-Button (title="Kopieren")
      const copyButton = screen.getByTitle("Kopieren");
      await userEvent.click(copyButton);

      expect(mockClipboard.writeText).toHaveBeenCalledWith("Hallo, wie geht es dir?");
    });

    it("ruft onCopy-Callback auf", async () => {
      const onCopy = vi.fn();
      render(<ChatMessage message={userMessage} onCopy={onCopy} />);

      const copyButton = screen.getByTitle("Kopieren");
      await userEvent.click(copyButton);

      expect(onCopy).toHaveBeenCalledWith("Hallo, wie geht es dir?");
    });
  });

  describe("Bearbeiten-Funktion (nur User)", () => {
    it("zeigt Bearbeiten-Button nur für User-Nachrichten", () => {
      const { rerender } = render(<ChatMessage message={userMessage} onEdit={vi.fn()} />);

      expect(screen.getByTitle("Bearbeiten")).toBeInTheDocument();

      // Bei Assistant-Nachrichten sollte der Button nicht vorhanden sein
      rerender(<ChatMessage message={assistantMessage} onEdit={vi.fn()} />);
      expect(screen.queryByTitle("Bearbeiten")).not.toBeInTheDocument();
    });

    it("öffnet den Bearbeitungsmodus beim Klick", async () => {
      render(<ChatMessage message={userMessage} onEdit={vi.fn()} />);

      const editButton = screen.getByTitle("Bearbeiten");
      await userEvent.click(editButton);

      // Textarea sollte sichtbar sein
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByText("Speichern")).toBeInTheDocument();
      expect(screen.getByText("Abbrechen")).toBeInTheDocument();
    });

    it("erlaubt das Abbrechen der Bearbeitung", async () => {
      render(<ChatMessage message={userMessage} onEdit={vi.fn()} />);

      const editButton = screen.getByTitle("Bearbeiten");
      await userEvent.click(editButton);

      const cancelButton = screen.getByText("Abbrechen");
      await userEvent.click(cancelButton);

      // Sollte wieder im Anzeige-Modus sein
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(screen.getByText("Hallo, wie geht es dir?")).toBeInTheDocument();
    });

    it("ruft onEdit beim Speichern auf", async () => {
      const onEdit = vi.fn();
      render(<ChatMessage message={userMessage} onEdit={onEdit} />);

      const editButton = screen.getByTitle("Bearbeiten");
      await userEvent.click(editButton);

      const textarea = screen.getByRole("textbox");
      await userEvent.clear(textarea);
      await userEvent.type(textarea, "Geänderte Nachricht");

      const saveButton = screen.getByText("Speichern");
      await userEvent.click(saveButton);

      expect(onEdit).toHaveBeenCalledWith("msg-user-1", "Geänderte Nachricht");
    });
  });

  describe("Retry-Funktion (nur Assistant, letzte Nachricht)", () => {
    it("zeigt Retry-Button nur für letzte Assistant-Nachricht", () => {
      const { rerender } = render(
        <ChatMessage message={assistantMessage} isLast={true} onRetry={vi.fn()} />,
      );

      expect(screen.getByTitle("Neu generieren")).toBeInTheDocument();

      // Nicht bei isLast=false
      rerender(<ChatMessage message={assistantMessage} isLast={false} onRetry={vi.fn()} />);
      expect(screen.queryByTitle("Neu generieren")).not.toBeInTheDocument();

      // Nicht bei User-Nachrichten
      rerender(<ChatMessage message={userMessage} isLast={true} onRetry={vi.fn()} />);
      expect(screen.queryByTitle("Neu generieren")).not.toBeInTheDocument();
    });

    it("ruft onRetry beim Klick auf", async () => {
      const onRetry = vi.fn();
      render(<ChatMessage message={assistantMessage} isLast={true} onRetry={onRetry} />);

      const retryButton = screen.getByTitle("Neu generieren");
      await userEvent.click(retryButton);

      expect(onRetry).toHaveBeenCalledWith("msg-assistant-1");
    });
  });

  describe("Follow-Up Vorschläge", () => {
    it("zeigt Vorschläge-Button nur für letzte Assistant-Nachricht", () => {
      render(<ChatMessage message={assistantMessage} isLast={true} onFollowUp={vi.fn()} />);

      // Follow-up suggestions are now directly visible, not behind a button
      expect(screen.getByText("Erkläre das genauer")).toBeInTheDocument();
    });

    it("zeigt Follow-Up-Optionen beim Klick", () => {
      render(<ChatMessage message={assistantMessage} isLast={true} onFollowUp={vi.fn()} />);

      // Follow-up suggestions are now directly visible without needing to click
      // Only 3 suggestions are shown to avoid clutter
      expect(screen.getByText("Erkläre das genauer")).toBeInTheDocument();
      expect(screen.getByText("Gib mir Beispiele")).toBeInTheDocument();
      expect(screen.getByText("Fasse zusammen")).toBeInTheDocument();
    });

    it("ruft onFollowUp beim Klick auf einen Vorschlag auf", async () => {
      const onFollowUp = vi.fn();
      render(<ChatMessage message={assistantMessage} isLast={true} onFollowUp={onFollowUp} />);

      // Suggestions are directly visible now
      expect(screen.getByText("Erkläre das genauer")).toBeInTheDocument();

      await userEvent.click(screen.getByText("Erkläre das genauer"));

      expect(onFollowUp).toHaveBeenCalledWith("Erkläre das genauer");
    });
  });

  describe("Visuelle Unterscheidung", () => {
    it("hat unterschiedliche Styles für User und Assistant", () => {
      const { rerender } = render(<ChatMessage message={userMessage} />);

      const userBubble = screen.getByTestId("message-bubble");
      expect(userBubble).toHaveClass("bg-accent-chat-surface/50");
      expect(userBubble).toHaveClass("border-accent-chat/30");

      rerender(<ChatMessage message={assistantMessage} />);

      const assistantBubble = screen.getByTestId("message-bubble");
      expect(assistantBubble).toHaveClass("bg-surface-card/70");
      expect(assistantBubble).toHaveClass("border-white/10");
    });
  });

  describe("Edge Cases", () => {
    it("handhabt leere Nachrichten", () => {
      const emptyMessage: ChatMessageType = {
        id: "msg-empty",
        role: "user",
        content: "",
        timestamp: Date.now(),
      };

      render(<ChatMessage message={emptyMessage} />);

      // Sollte ohne Fehler rendern
      expect(screen.getByTestId("message.item")).toBeInTheDocument();
    });

    it("handhabt Nachrichten mit nur Code", () => {
      const codeOnlyMessage: ChatMessageType = {
        id: "msg-code-only",
        role: "assistant",
        content: "```python\nprint('Hello')\n```",
        timestamp: Date.now(),
      };

      render(<ChatMessage message={codeOnlyMessage} />);

      expect(screen.getByText("python")).toBeInTheDocument();
      // Check for parts of the code since syntax highlighting splits it
      expect(screen.getByText("print")).toBeInTheDocument();
      expect(screen.getByText(/'Hello'/)).toBeInTheDocument();
    });

    it("handhabt mehrere Code-Blöcke", () => {
      const multiCodeMessage: ChatMessageType = {
        id: "msg-multi-code",
        role: "assistant",
        content: `\`\`\`js
const a = 1;
\`\`\`

Und dann:

\`\`\`python
b = 2
\`\`\``,
        timestamp: Date.now(),
      };

      render(<ChatMessage message={multiCodeMessage} />);

      expect(screen.getByText("js")).toBeInTheDocument();
      expect(screen.getByText("python")).toBeInTheDocument();
      // Check for parts of the code since syntax highlighting splits it
      expect(screen.getByText("const")).toBeInTheDocument();
      expect(screen.getAllByText("=").length).toBeGreaterThan(0);
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });
});
