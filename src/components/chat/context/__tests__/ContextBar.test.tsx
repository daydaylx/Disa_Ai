import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ContextBar } from "../ContextBar";

// Mock dependencies
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
    activeRole: { id: "coder", name: "Coder", description: "Coding expert" },
    setActiveRole: vi.fn(),
    roles: [
      { id: "standard", name: "Standard" },
      { id: "coder", name: "Coder" },
    ],
  }),
}));

vi.mock("@/hooks/useSettings", () => ({
  useSettings: () => ({
    settings: {
      preferredModelId: "gpt-4o-mini",
      creativity: 45,
      discussionPreset: "locker_neugierig",
      memoryEnabled: false,
      safetyFilter: true,
    },
    setCreativity: vi.fn(),
    setDiscussionPreset: vi.fn(),
    setPreferredModel: vi.fn(),
    setMemoryEnabled: vi.fn(),
    setSafetyFilter: vi.fn(),
  }),
}));

// Mock icons
vi.mock("@/lib/icons", () => ({
  Cpu: () => <span data-testid="icon-cpu" />,
  Palette: () => <span data-testid="icon-palette" />,
  Sparkles: () => <span data-testid="icon-sparkles" />,
  User: () => <span data-testid="icon-user" />,
  MoreHorizontal: () => <span data-testid="icon-more" />,
  Brain: () => <span data-testid="icon-brain" />,
  RotateCcw: () => <span data-testid="icon-rotate" />,
  Shield: () => <span data-testid="icon-shield" />,
  X: () => <span data-testid="icon-x" />,
}));

describe("ContextBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all context chips with correct labels", () => {
      render(<ContextBar />);

      // Role (mocked as "Coder")
      expect(screen.getByText("Coder")).toBeInTheDocument();

      // Preset (mocked as "locker_neugierig" -> "Locker")
      expect(screen.getByText("Locker")).toBeInTheDocument();

      // Creativity (mocked as 45%)
      expect(screen.getByText("45%")).toBeInTheDocument();

      // Model (mocked as GPT-4o Mini)
      expect(screen.getByText("GPT-4o Mini")).toBeInTheDocument();

      // More button (icon)
      expect(screen.getByTestId("icon-more")).toBeInTheDocument();
    });

    it("has correct accessibility attributes", () => {
      render(<ContextBar />);

      const toolbar = screen.getByRole("toolbar", { name: "Kontext Aktionen" });
      expect(toolbar).toBeInTheDocument();

      const roleButton = screen.getByLabelText(/Rolle: Coder/i);
      expect(roleButton).toBeInTheDocument();

      const moreButton = screen.getByLabelText("Mehr Einstellungen");
      expect(moreButton).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("opens the overflow sheet when clicking a chip", () => {
      render(<ContextBar />);

      // Initially, sheet content should not be visible (or not in document if unmounted)
      // Since it's a portal, we look for the dialog role
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // Click Role chip
      fireEvent.click(screen.getByText("Coder"));

      // Sheet should appear
      const dialog = screen.getByRole("dialog", { name: "Kontext Einstellungen" });
      expect(dialog).toBeInTheDocument();

      // Header should be visible
      expect(screen.getByText("Einstellungen")).toBeInTheDocument();
    });

    it("opens the sheet when clicking More button", () => {
      render(<ContextBar />);

      fireEvent.click(screen.getByLabelText("Mehr Einstellungen"));

      expect(screen.getByRole("dialog", { name: "Kontext Einstellungen" })).toBeInTheDocument();
    });
  });
});
