import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RolesProvider } from "../../../contexts/RolesContext";
import { useRoles } from "../../../contexts/RolesContext";
import { SettingsProvider } from "../../../contexts/SettingsContext";
import { EnhancedRolesInterface } from "../EnhancedRolesInterface";

const mockSetActiveRole = vi.fn();
const mockToggleRoleFavorite = vi.fn();
const mockTrackRoleUsage = vi.fn();
const mockRefreshRoles = vi.fn();

// Mock the favorites context
vi.mock("../../../contexts/FavoritesContext", () => ({
  useFavorites: () => ({
    isRoleFavorite: vi.fn(() => false),
    toggleRoleFavorite: mockToggleRoleFavorite,
    trackRoleUsage: mockTrackRoleUsage,
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
      settings: {},
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

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location-display">{`${location.pathname}${location.search}`}</div>;
}

describe("EnhancedRolesInterface", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSetActiveRole.mockReset();
    mockToggleRoleFavorite.mockReset();
    mockTrackRoleUsage.mockReset();
    mockRefreshRoles.mockReset();
    (useRoles as any).mockReturnValue({
      roles: mockRoles,
      activeRole: null,
      setActiveRole: mockSetActiveRole,
      rolesLoading: false,
      roleLoadError: null,
      refreshRoles: mockRefreshRoles,
    });
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <MemoryRouter initialEntries={["/roles"]}>
        <SettingsProvider>
          <RolesProvider>
            {component}
            <LocationProbe />
          </RolesProvider>
        </SettingsProvider>
      </MemoryRouter>,
    );
  };

  it("should display the roles header summary", () => {
    renderWithProviders(<EnhancedRolesInterface />);

    expect(screen.getByText(/2 von 2 Rollen verfügbar/i)).toBeInTheDocument();
  });

  it("renders a slimmer header without the old context tiles", () => {
    renderWithProviders(<EnhancedRolesInterface />);

    expect(screen.queryByText("Fokus")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Filter helfen dir, schneller den passenden Stil zu finden."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Merke dir starke Personas für spätere Gespräche."),
    ).not.toBeInTheDocument();
  });

  it("keeps hero and role list in the same scroll container", async () => {
    const { container } = renderWithProviders(<EnhancedRolesInterface />);

    await screen.findByText("Kreativer Assistent");

    const scrollContainer = container.querySelector(".overflow-auto.overscroll-contain");

    expect(scrollContainer).not.toBeNull();
    expect(scrollContainer).toContainElement(
      screen.getByRole("heading", { level: 1, name: "Rollen & Personas" }),
    );
    expect(scrollContainer).toContainElement(screen.getAllByTestId("role-card")[0]!);
  });

  it("should display role cards", () => {
    renderWithProviders(<EnhancedRolesInterface />);

    // Check for role names
    expect(screen.getByText("Kreativer Assistent")).toBeInTheDocument();
    expect(screen.getByText("Code Experte")).toBeInTheDocument();

    const creativeAssistantCard = screen
      .getByText("Kreativer Assistent")
      .closest('[data-testid="role-card"]');
    expect(creativeAssistantCard).toBeInTheDocument();
    expect(
      within(creativeAssistantCard as HTMLElement).getByText(
        "Hilft bei kreativen Projekten und Ideenentwicklung.",
      ),
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

  it("should show loading state", () => {
    (useRoles as any).mockReturnValue({
      roles: [],
      activeRole: null,
      setActiveRole: vi.fn(),
      rolesLoading: true, // Correctly set rolesLoading to true
      roleLoadError: null,
    });

    renderWithProviders(<EnhancedRolesInterface />);

    // Check for loading indicators (CardSkeleton uses "card-skeleton" testid)
    const skeletons = screen.queryAllByTestId("card-skeleton");
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

  it("should handle role selection", async () => {
    renderWithProviders(<EnhancedRolesInterface />);

    const firstRoleCard = await screen.findByRole("button", {
      name: /Rolle Kreativer Assistent auswählen/i,
    });
    fireEvent.click(firstRoleCard);

    expect(mockSetActiveRole).toHaveBeenCalledWith(mockRoles[0]);
    expect(mockTrackRoleUsage).toHaveBeenCalledWith("creative-assistant");
    await waitFor(() => {
      expect(screen.getByTestId("location-display")).toHaveTextContent("/chat");
    });
  });

  it("opens role details without navigating away", async () => {
    renderWithProviders(<EnhancedRolesInterface />);

    const creativeAssistantCard = screen
      .getByText("Kreativer Assistent")
      .closest('[data-testid="role-card"]');
    expect(creativeAssistantCard).toBeInTheDocument();

    if (creativeAssistantCard) {
      const detailsButton = await within(creativeAssistantCard as HTMLElement).findByRole(
        "button",
        { name: /Details zu Kreativer Assistent anzeigen/i, hidden: true },
      );
      fireEvent.click(detailsButton);
    }

    expect(screen.getByRole("button", { name: "Aktivieren" })).toBeInTheDocument();
    expect(screen.getByText("System Prompt")).toBeInTheDocument();
    expect(screen.getByText("You are a creative assistant...")).toBeInTheDocument();
    expect(screen.getByTestId("location-display")).toHaveTextContent("/roles");
    expect(mockSetActiveRole).not.toHaveBeenCalled();
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
    const activeRoleCard = await screen.findByRole("button", {
      name: /Rolle Kreativer Assistent auswählen/i,
    });
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
        { name: /Details zu Kreativer Assistent anzeigen/i, hidden: true },
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
        name: /Details zu Code Experte anzeigen/i,
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
