/**
 * Unit-Tests für UnifiedInputBar
 *
 * Diese Tests prüfen die kritische Eingabe-Komponente der Chat-Oberfläche:
 * - Texteingabe und Änderungen werden korrekt weitergeleitet
 * - Senden-Button Zustand (enabled/disabled)
 * - Enter-Taste sendet die Nachricht
 * - Shift+Enter fügt neue Zeile ein
 * - Kontext-Selektoren (Rolle, Stil, Kreativität) sind sichtbar
 */
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UnifiedInputBar, type UnifiedInputBarProps } from "../UnifiedInputBar";

// Mock der Abhängigkeiten
vi.mock("@/contexts/ModelCatalogContext", () => ({
  useModelCatalog: () => ({
    models: [
      { id: "gpt-4o-mini", label: "GPT-4o Mini" },
      { id: "claude-3-haiku", label: "Claude 3 Haiku" },
    ],
    loading: false,
    error: null,
  }),
}));

vi.mock("@/contexts/RolesContext", () => ({
  useRoles: () => ({
    activeRole: null,
    setActiveRole: vi.fn(),
    roles: [
      { id: "standard", name: "Standard" },
      { id: "coder", name: "Coder" },
      { id: "poet", name: "Poet" },
    ],
  }),
}));

vi.mock("@/hooks/useSettings", () => ({
  useSettings: () => ({
    settings: {
      preferredModelId: "gpt-4o-mini",
      creativity: 45,
      discussionPreset: "locker_neugierig",
    },
    setCreativity: vi.fn(),
    setDiscussionPreset: vi.fn(),
    setPreferredModel: vi.fn(),
  }),
}));

vi.mock("@/hooks/useVisualViewport", () => ({
  useVisualViewport: () => ({
    height: 800,
    isKeyboardOpen: false,
  }),
}));

// Default Props für die Tests
const defaultProps: UnifiedInputBarProps = {
  value: "",
  onChange: vi.fn(),
  onSend: vi.fn(),
  isLoading: false,
};

describe("UnifiedInputBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("rendert das Eingabefeld mit korrektem aria-label", () => {
      render(<UnifiedInputBar {...defaultProps} />);

      const input = screen.getByTestId("composer-input");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("aria-label", "Nachricht eingeben");
    });

    it("rendert den Senden-Button mit korrektem aria-label", () => {
      render(<UnifiedInputBar {...defaultProps} />);

      const sendButton = screen.getByRole("button", { name: "Senden" });
      expect(sendButton).toBeInTheDocument();
    });

    it("rendert die Kontext-Selektoren (Rolle, Modell)", () => {
      render(<UnifiedInputBar {...defaultProps} />);

      // Rollen-Auswahl
      expect(screen.getByRole("combobox", { name: "Rolle auswählen" })).toBeInTheDocument();

      // Modell-Auswahl
      expect(screen.getByRole("combobox", { name: "Modell auswählen" })).toBeInTheDocument();

      // Stil- und Kreativitäts-Auswahl wurden aus Input-Bar entfernt
      // und sind über Settings → Behavior erreichbar
    });
  });

  describe("Texteingabe", () => {
    it("ruft onChange bei Texteingabe auf", async () => {
      const onChange = vi.fn();
      render(<UnifiedInputBar {...defaultProps} onChange={onChange} />);

      const input = screen.getByTestId("composer-input");
      await userEvent.type(input, "Hallo Welt");

      // onChange wird bei jedem Tastendruck aufgerufen
      expect(onChange).toHaveBeenCalled();
    });

    it("zeigt den übergebenen Wert im Eingabefeld an", () => {
      render(<UnifiedInputBar {...defaultProps} value="Test Nachricht" />);

      const input = screen.getByTestId("composer-input");
      expect(input).toHaveValue("Test Nachricht");
    });
  });

  describe("Senden-Button Zustand", () => {
    it("deaktiviert Senden-Button bei leerem Input", () => {
      render(<UnifiedInputBar {...defaultProps} value="" />);

      const sendButton = screen.getByRole("button", { name: "Senden" });
      expect(sendButton).toBeDisabled();
    });

    it("deaktiviert Senden-Button bei nur Whitespace", () => {
      render(<UnifiedInputBar {...defaultProps} value="   " />);

      const sendButton = screen.getByRole("button", { name: "Senden" });
      expect(sendButton).toBeDisabled();
    });

    it("aktiviert Senden-Button bei vorhandenem Text", () => {
      render(<UnifiedInputBar {...defaultProps} value="Eine Nachricht" />);

      const sendButton = screen.getByRole("button", { name: "Senden" });
      expect(sendButton).not.toBeDisabled();
    });

    it("deaktiviert Senden-Button während des Ladens", () => {
      render(<UnifiedInputBar {...defaultProps} value="Test" isLoading={true} />);

      const sendButton = screen.getByRole("button", { name: "Senden" });
      expect(sendButton).toBeDisabled();
    });
  });

  describe("Senden-Interaktion", () => {
    it("ruft onSend beim Klick auf Senden-Button auf", async () => {
      const onSend = vi.fn();
      render(<UnifiedInputBar {...defaultProps} value="Nachricht" onSend={onSend} />);

      const sendButton = screen.getByRole("button", { name: "Senden" });
      await userEvent.click(sendButton);

      expect(onSend).toHaveBeenCalledTimes(1);
    });

    it("ruft onSend bei Enter-Taste auf", () => {
      const onSend = vi.fn();
      render(<UnifiedInputBar {...defaultProps} value="Nachricht" onSend={onSend} />);

      const input = screen.getByTestId("composer-input");
      // Simuliere Enter-Taste
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(onSend).toHaveBeenCalledTimes(1);
    });

    it("sendet NICHT bei Shift+Enter (neue Zeile)", () => {
      const onSend = vi.fn();
      render(<UnifiedInputBar {...defaultProps} value="Nachricht" onSend={onSend} />);

      const input = screen.getByTestId("composer-input");
      // Simuliere Shift+Enter
      fireEvent.keyDown(input, { key: "Enter", code: "Enter", shiftKey: true });

      expect(onSend).not.toHaveBeenCalled();
    });

    it("sendet NICHT bei leerem Input trotz Enter", () => {
      const onSend = vi.fn();
      render(<UnifiedInputBar {...defaultProps} value="" onSend={onSend} />);

      const input = screen.getByTestId("composer-input");
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(onSend).not.toHaveBeenCalled();
    });

    it("sendet NICHT während des Ladens trotz Enter", () => {
      const onSend = vi.fn();
      render(<UnifiedInputBar {...defaultProps} value="Test" isLoading={true} onSend={onSend} />);

      const input = screen.getByTestId("composer-input");
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(onSend).not.toHaveBeenCalled();
    });
  });

  describe("Loading-Zustand", () => {
    it("zeigt Loading-Spinner im Button während des Ladens", () => {
      render(<UnifiedInputBar {...defaultProps} value="Test" isLoading={true} />);

      const sendButton = screen.getByRole("button", { name: "Senden" });
      // Der Button enthält einen animierten Spinner (animate-spin Klasse)
      const spinner = sendButton.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("hat korrektes aria-label auf dem Eingabefeld", () => {
      render(<UnifiedInputBar {...defaultProps} />);

      const input = screen.getByTestId("composer-input");
      expect(input).toHaveAttribute("aria-label", "Nachricht eingeben");
    });

    it("hat korrektes aria-label auf dem Senden-Button", () => {
      render(<UnifiedInputBar {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Senden" });
      expect(button).toHaveAttribute("aria-label", "Senden");
    });

    it("hat korrekte aria-labels auf den Selektoren", () => {
      render(<UnifiedInputBar {...defaultProps} />);

      expect(screen.getByRole("combobox", { name: "Rolle auswählen" })).toBeInTheDocument();
      // Style and Creativity selectors have been removed from input area
      // Model selector remains available
      expect(screen.getByRole("combobox", { name: "Modell auswählen" })).toBeInTheDocument();
    });
  });
});
