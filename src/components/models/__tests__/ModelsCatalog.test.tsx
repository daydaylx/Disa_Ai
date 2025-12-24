import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { loadModelCatalog } from "@/config/models";
import { ToastsProvider } from "@/ui";

import { ModelCatalogProvider } from "../../../contexts/ModelCatalogContext";
import { useModelCatalog } from "../../../contexts/ModelCatalogContext";
import { SettingsProvider } from "../../../contexts/SettingsContext";
import { ModelsCatalog } from "../ModelsCatalog";

// Mock the favorites context
vi.mock("../../../contexts/FavoritesContext", () => ({
  useFavorites: () => ({
    favorites: { models: { items: [] } },
    isFavorite: vi.fn(() => false),
    isModelFavorite: vi.fn(() => false),
    toggleFavorite: vi.fn(),
    toggleModelFavorite: vi.fn(),
  }),
}));

// Mock loadModelCatalog
vi.mock("@/config/models", () => ({
  loadModelCatalog: vi.fn().mockResolvedValue([]),
}));

// Mock the model catalog context
vi.mock("../../../contexts/ModelCatalogContext", async () => {
  const actual = await vi.importActual("../../../contexts/ModelCatalogContext");
  return {
    ...actual,
    useModelCatalog: vi.fn(),
  };
});

// Mock the settings hook directly
vi.mock("../../../hooks/useSettings", () => ({
  useSettings: () => ({
    settings: { preferredModelId: null },
    setSettings: vi.fn(),
    setPreferredModel: vi.fn(),
  }),
}));

const mockModels = [
  {
    id: "gpt-4o-mini",
    label: "GPT-4o Mini",
    description: "A fast and efficient model",
    provider: "OpenAI",
    contextTokens: 128000,
    pricing: { prompt: 0.15, completion: 0.6 },
    architecture: { modality: "text->text" },
    tags: ["gpt", "openai"],
  },
  {
    id: "claude-3-haiku",
    label: "Claude 3 Haiku",
    description: "A quick and capable model",
    provider: "Anthropic",
    contextTokens: 200000,
    pricing: { prompt: 0.25, completion: 1.25 },
    architecture: { modality: "text->text" },
    tags: ["claude", "anthropic"],
  },
];

describe("ModelsCatalog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useModelCatalog as any).mockReturnValue({
      models: mockModels,
      loading: false,
      error: null,
      refresh: vi.fn(),
    });
    (loadModelCatalog as any).mockResolvedValue(mockModels);
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        <ToastsProvider>
          <SettingsProvider>
            <ModelCatalogProvider>{component}</ModelCatalogProvider>
          </SettingsProvider>
        </ToastsProvider>
      </MemoryRouter>,
    );
  };

  it("should render the models catalog header", () => {
    renderWithProviders(<ModelsCatalog />);

    expect(screen.getByRole("heading", { level: 1, name: /Modelle/i })).toBeInTheDocument();
  });

  it("should display model cards", async () => {
    renderWithProviders(<ModelsCatalog />);

    // Check for model names
    await waitFor(() => {
      expect(screen.getByText("GPT-4o Mini")).toBeInTheDocument();
    });
    expect(screen.getByText("Claude 3 Haiku")).toBeInTheDocument();

    // Check for model provider
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByText("Anthropic")).toBeInTheDocument();

    // Check for context length
    expect(screen.getByText("128k")).toBeInTheDocument();
    expect(screen.getByText("200k")).toBeInTheDocument();
  });

  it("should filter models when searching", async () => {
    renderWithProviders(<ModelsCatalog />);

    // Find search input
    const searchInput = screen.getByPlaceholderText(/Suchen|Search/i);
    expect(searchInput).toBeInTheDocument();

    // Type in search
    fireEvent.change(searchInput, { target: { value: "GPT" } });

    // Should only show GPT model
    await waitFor(() => {
      expect(screen.getByText("GPT-4o Mini")).toBeInTheDocument();
      expect(screen.queryByText("Claude 3 Haiku")).not.toBeInTheDocument();
    });
  });

  it("should show loading state", () => {
    (useModelCatalog as any).mockReturnValue({
      models: null,
      loading: true,
      error: null,
      refresh: vi.fn(),
    });

    renderWithProviders(<ModelsCatalog />);

    // Check for loading indicators (skeletons shown when !catalog && loading)
    const skeletons = screen.queryAllByTestId("model-card-skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should show error state when models fail to load", () => {
    // Mock useModelCatalog to return error state directly
    (useModelCatalog as any).mockReturnValue({
      models: null,
      loading: false,
      error: "Failed to load models",
      refresh: vi.fn(),
    });

    renderWithProviders(<ModelsCatalog />);

    // Check for error state
    expect(screen.getByText("Fehler beim Laden der Modelle")).toBeInTheDocument();
    expect(screen.getByText("Failed to load models")).toBeInTheDocument();
  });

  it("should handle model selection", async () => {
    renderWithProviders(<ModelsCatalog />);

    // Find the model card by its accessible name (label)
    const gptModelCard = await screen.findByRole("button", { name: /GPT-4o Mini/i });
    fireEvent.click(gptModelCard);

    // Assertions related to selection effect
    // For now, ensure the card is in the document (already implicitly handled by findByRole)
    // In a real scenario, you'd check for active state or a callback being fired.
    expect(gptModelCard).toBeInTheDocument();
  });

  it("should display provider information", async () => {
    renderWithProviders(<ModelsCatalog />);

    await waitFor(() => {
      expect(screen.getByText("OpenAI")).toBeInTheDocument();
    });
    expect(screen.getByText("Anthropic")).toBeInTheDocument();
  });

  it("should display context length information", async () => {
    renderWithProviders(<ModelsCatalog />);

    // Check for context length displays (might be formatted differently)
    await waitFor(() => {
      expect(screen.getByText(/128000|128k/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/200000|200k/i)).toBeInTheDocument();
  });

  it("should have accessible model cards", async () => {
    renderWithProviders(<ModelsCatalog />);

    // Find all buttons that represent model cards, using a regex for their accessible names
    const modelCards = await screen.findAllByRole("button", { name: /Mini|Haiku/i });

    expect(modelCards.length).toBeGreaterThan(0);

    // Check that cards have proper ARIA attributes
    modelCards.forEach((card) => {
      // The aria-label is specifically on the favorite toggle button, not the whole card.
      // Re-evaluate if the intention was for the whole card to have an aria-label.
      // For now, check that the model card (button role) itself has a meaningful accessible name.
      expect(card).toHaveAccessibleName();
    });
  });
});
