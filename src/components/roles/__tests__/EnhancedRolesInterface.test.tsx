import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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
    description: "Hilft bei kreativen Projekten und Ideenentwicklung.",
    systemPrompt: "You are a creative assistant...",
    allowedModels: ["*"],
    tags: ["kreativ", "ideen", "brainstorming"],
    category: "Creative",
    styleHints: {
      typographyScale: 1.0,
      borderRadius: 0.5,
      accentColor: "var(--acc1)",
    },
  },
  {
    id: "code-expert",
    name: "Code Experte",
    description: "Spezialisiert auf Programmierung und technische Problemlösung.",
    systemPrompt: "You are a coding expert...",
    allowedModels: ["*"],
    tags: ["code", "programmierung", "entwicklung"],
    category: "Technical",
    styleHints: {
      typographyScale: 1.0,
      borderRadius: 0.5,
      accentColor: "var(--acc1)",
    },
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

  it("should display role cards", async () => {
    renderWithProviders(<EnhancedRolesInterface />);

    // Check for role names
    expect(screen.getByText("Kreativer Assistent")).toBeInTheDocument();
    expect(screen.getByText("Code Experte")).toBeInTheDocument();

    // Expand the first role card to see its description
    const creativeAssistantCard = screen
      .getByText("Kreativer Assistent")
      .closest('[data-testid="role-card"]');
    expect(creativeAssistantCard).toBeInTheDocument(); // Ensure card is found

    if (creativeAssistantCard) {
      const detailsButton = await within(creativeAssistantCard as HTMLElement).findByRole(
        "button",
        { name: "Details", hidden: true },
      ); // Use within
      fireEvent.click(detailsButton);
    }
    // Check for role descriptions (now visible)
    expect(
      screen.getByText("Hilft bei kreativen Projekten und Ideenentwicklung."),
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
      rolesLoading: true, // Correctly set rolesLoading to true
      roleLoadError: null,
    });

    renderWithProviders(<EnhancedRolesInterface />);

    // Check for loading indicators
    const skeletons = screen.queryAllByTestId("role-card-skeleton");
    expect(skeletons.length).toBeGreaterThan(0); // Only checking for skeletons
  });

  it("should show error state when roles fail to load", () => {
    (useRoles as any).mockReturnValue({
      roles: [],
      activeRole: null,
      setActiveRole: vi.fn(),
      rolesLoading: false,
      roleLoadError: "Failed to load roles", // Changed to roleLoadError
    });

    renderWithProviders(<EnhancedRolesInterface />);

    expect(screen.getByText("Fehler beim Laden der Rollen")).toBeInTheDocument(); // New error title
    expect(screen.getByText("Failed to load roles")).toBeInTheDocument();
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

  it("should indicate active role state", async () => {
    (useRoles as any).mockReturnValue({
      roles: mockRoles,
      activeRole: mockRoles[0], // First role is active
      setActiveRole: vi.fn(),
      rolesLoading: false,
      roleLoadError: null,
    });

    renderWithProviders(<EnhancedRolesInterface />);

    // The active role should have a distinct visual state
    const activeRoleCard = await screen.findByRole("button", { name: /Kreativer Assistent/i });
    expect(activeRoleCard).toHaveAttribute("aria-pressed", "true");
  });

  it("should display role tags", async () => {
    renderWithProviders(<EnhancedRolesInterface />);

    // Expand the first role card to see its tags
    const creativeAssistantCard = screen
      .getByText("Kreativer Assistent")
      .closest('[data-testid="role-card"]');
    expect(creativeAssistantCard).toBeInTheDocument(); // Ensure card is found

    if (creativeAssistantCard) {
      const detailsButton = await within(creativeAssistantCard as HTMLElement).findByRole(
        "button",
        { name: "Details", hidden: true },
      ); // Use within
      fireEvent.click(detailsButton);
    }

    // Check for tags (now visible)
    await waitFor(() => {
      expect(screen.getByText("kreativ")).toBeInTheDocument();
      expect(screen.getByText("ideen")).toBeInTheDocument();
      expect(screen.getByText("brainstorming")).toBeInTheDocument();
    });
    // Check for other tags - expand Code Experte card first
    const codeExpertCard = screen.getByText("Code Experte").closest('[data-testid="role-card"]');
    expect(codeExpertCard).toBeInTheDocument();

    if (codeExpertCard) {
      const detailsButton = await within(codeExpertCard as HTMLElement).findByRole("button", {
        name: "Details",
        hidden: true,
      });
      fireEvent.click(detailsButton);
    }

    await waitFor(() => {
      expect(screen.getByText("code")).toBeInTheDocument();
      expect(screen.getByText("programmierung")).toBeInTheDocument();
      expect(screen.getByText("entwicklung")).toBeInTheDocument();
    });
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

    // Check that cards have a meaningful accessible name (their role name)
    roleCards.forEach((card) => {
      expect(card).toHaveAccessibleName();
    });
  });
});
