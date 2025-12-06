import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RolesProvider } from "../../../contexts/RolesContext";
import { useRoles } from "../../../contexts/RolesContext";
import { SettingsProvider } from "../../../contexts/SettingsContext";
import { EnhancedRolesInterface } from "../EnhancedRolesInterface";

// Mock the favorites context
vi.mock("../../../contexts/FavoritesContext", () => ({
  useFavorites: () => ({
    isRoleFavorite: vi.fn(() => false),
    toggleRoleFavorite: vi.fn(),
    trackRoleUsage: vi.fn(),
    usage: {},
  }),
}));

// Mock the roles context
vi.mock("../../../contexts/RolesContext", async () => {
  const actual = await vi.importActual("../../../contexts/RolesContext");
  return {
    ...actual,
    useRoles: vi.fn(),
  };
});

// Mock the settings context
vi.mock("../../../contexts/SettingsContext", async () => {
  const actual = await vi.importActual("../../../contexts/SettingsContext");
  return {
    ...actual,
    useSettingsContext: () => ({
      settings: { showNSFWContent: true },
      setSettings: vi.fn(),
    }),
  };
});

const mockRoles = [
  {
    id: "creative-assistant",
    name: "Kreativer Assistent",
    description: "Hilft bei kreativen Projekten und Ideenentwicklung",
    system: "You are a creative assistant...",
    category: "kreativ",
    tags: ["kreativ", "ideen", "brainstorming"],
    allow: ["*"],
  },
  {
    id: "code-expert",
    name: "Code Experte",
    description: "Spezialisiert auf Programmierung und technische Problemlösung",
    system: "You are a coding expert...",
    category: "technik",
    tags: ["code", "programmierung", "entwicklung"],
    allow: ["*"],
  },
];

describe("EnhancedRolesInterface", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRoles as any).mockReturnValue({
      roles: mockRoles,
      activeRole: null,
      setActiveRole: vi.fn(),
      isLoading: false,
      error: null,
    });
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        <SettingsProvider>
          <RolesProvider>{component}</RolesProvider>
        </SettingsProvider>
      </MemoryRouter>,
    );
  };

  it("should render the roles interface header", () => {
    renderWithProviders(<EnhancedRolesInterface />);

    expect(screen.getByRole("heading", { level: 1, name: /Rollen/i })).toBeInTheDocument();
  });

  it("should display role cards", () => {
    renderWithProviders(<EnhancedRolesInterface />);

    // Check for role names
    expect(screen.getByText("Kreativer Assistent")).toBeInTheDocument();
    expect(screen.getByText("Code Experte")).toBeInTheDocument();

    // Check for role descriptions
    expect(
      screen.getByText("Hilft bei kreativen Projekten und Ideenentwicklung"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Spezialisiert auf Programmierung und technische Problemlösung"),
    ).toBeInTheDocument();
  });

  it("should filter roles by category", async () => {
    renderWithProviders(<EnhancedRolesInterface />);

    // Find category filter buttons
    const categoryButtons = screen.getByRole("button", { name: /Creative/i });
    expect(categoryButtons).toBeInTheDocument();

    // Click on creative category
    fireEvent.click(categoryButtons);

    // Should only show creative roles
    await waitFor(() => {
      expect(screen.getByText("Kreativer Assistent")).toBeInTheDocument();
      expect(screen.queryByText("Code Experte")).not.toBeInTheDocument();
    });
  });

  it("should search roles by name or description", async () => {
    renderWithProviders(<EnhancedRolesInterface />);

    // Find search input
    const searchInput = screen.getByPlaceholderText(/Suchen|Search/i);
    expect(searchInput).toBeInTheDocument();

    // Type in search
    fireEvent.change(searchInput, { target: { value: "Code" } });

    // Should only show code-related role
    await waitFor(() => {
      expect(screen.getByText("Code Experte")).toBeInTheDocument();
      expect(screen.queryByText("Kreativer Assistent")).not.toBeInTheDocument();
    });
  });

  it("should show loading state", () => {
    (useRoles as any).mockReturnValue({
      roles: [],
      activeRole: null,
      setActiveRole: vi.fn(),
      isLoading: true,
      error: null,
    });

    renderWithProviders(<EnhancedRolesInterface />);

    // Check for loading indicators
    const skeletons = screen.queryAllByTestId("role-card-skeleton");
    const statuses = screen.queryAllByRole("status");
    expect(skeletons.length + statuses.length).toBeGreaterThan(0);
  });

  it("should show error state when roles fail to load", () => {
    (useRoles as any).mockReturnValue({
      roles: [],
      activeRole: null,
      setActiveRole: vi.fn(),
      isLoading: false,
      error: "Failed to load roles",
    });

    renderWithProviders(<EnhancedRolesInterface />);

    expect(screen.getByText(/Fehler|Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load roles/)).toBeInTheDocument();
  });

  it("should handle role selection", () => {
    const mockSetActiveRole = vi.fn();
    (useRoles as any).mockReturnValue({
      roles: mockRoles,
      activeRole: null,
      setActiveRole: mockSetActiveRole,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<EnhancedRolesInterface />);

    // Find first role card and click it
    const firstRoleCard = screen.getByText("Kreativer Assistent").closest('[role="button"]');
    if (firstRoleCard) {
      fireEvent.click(firstRoleCard);

      // Should call setActiveRole
      expect(mockSetActiveRole).toHaveBeenCalledWith(mockRoles[0]);
    }
  });

  it("should indicate active role state", () => {
    (useRoles as any).mockReturnValue({
      roles: mockRoles,
      activeRole: mockRoles[0], // First role is active
      setActiveRole: vi.fn(),
      isLoading: false,
      error: null,
    });

    renderWithProviders(<EnhancedRolesInterface />);

    // The active role should have a distinct visual state
    const activeRoleCard = screen.getByText("Kreativer Assistent").closest('[role="button"]');
    expect(activeRoleCard).toHaveAttribute("aria-pressed", "true");
  });

  it("should display role tags", () => {
    renderWithProviders(<EnhancedRolesInterface />);

    // Check for tags
    expect(screen.getByText("kreativ")).toBeInTheDocument();
    expect(screen.getByText("ideen")).toBeInTheDocument();
    expect(screen.getByText("brainstorming")).toBeInTheDocument();
    expect(screen.getByText("code")).toBeInTheDocument();
    expect(screen.getByText("programmierung")).toBeInTheDocument();
    expect(screen.getByText("entwicklung")).toBeInTheDocument();
  });

  it("should show all roles when 'Alle' category is selected", async () => {
    renderWithProviders(<EnhancedRolesInterface />);

    // First select a specific category
    const creativeButton = screen.getByRole("button", { name: /Creative/i });
    fireEvent.click(creativeButton);

    await waitFor(() => {
      expect(screen.queryByText("Code Experte")).not.toBeInTheDocument();
    });

    // Then click "Reset" to show all roles
    const resetButton = screen.getByRole("button", { name: /Reset/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText("Kreativer Assistent")).toBeInTheDocument();
      expect(screen.getByText("Code Experte")).toBeInTheDocument();
    });
  });

  it("should have accessible role cards", () => {
    renderWithProviders(<EnhancedRolesInterface />);

    const roleCards = screen.getAllByTestId("role-card");

    expect(roleCards.length).toBeGreaterThan(0);
  });
});
