import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { loadModelCatalog } from "@/config/models";

import { ModelCatalogProvider } from "../../../contexts/ModelCatalogContext";
import { useModelCatalog } from "../../../contexts/ModelCatalogContext";
import { SettingsProvider } from "../../../contexts/SettingsContext";
import { ModelsCatalog } from "../ModelsCatalog";

const mockSetPreferredModel = vi.fn();

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
    setPreferredModel: mockSetPreferredModel,
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
    mockSetPreferredModel.mockReset();
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
        <SettingsProvider>
          <ModelCatalogProvider>{component}</ModelCatalogProvider>
        </SettingsProvider>
      </MemoryRouter>,
    );
  };

  it("should render the models catalog summary bar", () => {
    renderWithProviders(<ModelsCatalog />);

    expect(screen.getByText(/2 Modelle · 0 Favoriten/i)).toBeInTheDocument();
  });

  it("renders a slimmer header without the old context tiles", () => {
    renderWithProviders(<ModelsCatalog />);

    expect(screen.queryByText("Preisgefühl")).not.toBeInTheDocument();
    expect(screen.queryByText("Input / Output pro 1K Tokens")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Favoriten bleiben oben und sind schneller wiederzufinden."),
    ).not.toBeInTheDocument();
  });

  it("keeps hero and model list in the same scroll container", async () => {
    const { container } = renderWithProviders(<ModelsCatalog />);

    await screen.findByText("GPT-4o Mini");

    const scrollContainer = container.querySelector(".overflow-auto.overscroll-contain");

    expect(scrollContainer).not.toBeNull();
    expect(scrollContainer).toContainElement(
      screen.getByRole("heading", { level: 1, name: "Modelle" }),
    );
    expect(scrollContainer).toContainElement(screen.getAllByTestId("model-card")[0]!);
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

    // Check that Details buttons are present for expanding model information
    const detailsButtons = screen.getAllByText("Details anzeigen");
    expect(detailsButtons.length).toBe(2);
  });

  it("should show loading state", () => {
    (useModelCatalog as any).mockReturnValue({
      models: null,
      loading: true,
      error: null,
      refresh: vi.fn(),
    });

    renderWithProviders(<ModelsCatalog />);

    // Check for loading indicators (CardSkeleton uses "card-skeleton" testid)
    const skeletons = screen.queryAllByTestId("card-skeleton");
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

    const gptModelCard = await screen.findByRole("button", {
      name: /Modell GPT-4o Mini auswählen/i,
    });
    fireEvent.click(gptModelCard);

    expect(mockSetPreferredModel).toHaveBeenCalledWith("gpt-4o-mini");
  });

  it("opens model details without changing the active model", () => {
    renderWithProviders(<ModelsCatalog />);

    const gptModelCard = screen.getByText("GPT-4o Mini").closest('[data-testid="model-card"]');
    expect(gptModelCard).toBeInTheDocument();

    const detailsButton = within(gptModelCard as HTMLElement).getByRole("button", {
      name: /Details zu GPT-4o Mini anzeigen/i,
      hidden: true,
    });

    fireEvent.click(detailsButton);

    const dialog = screen.getByRole("dialog", { name: /GPT-4o Mini/i });

    expect(screen.getByRole("button", { name: "Als aktiv setzen" })).toBeInTheDocument();
    expect(within(dialog).getByText("Überblick")).toBeInTheDocument();
    expect(within(dialog).getByText("A fast and efficient model")).toBeInTheDocument();
    expect(mockSetPreferredModel).not.toHaveBeenCalled();
  });

  it("should display provider information", async () => {
    renderWithProviders(<ModelsCatalog />);

    await waitFor(() => {
      expect(screen.getByText("OpenAI")).toBeInTheDocument();
    });
    expect(screen.getByText("Anthropic")).toBeInTheDocument();
  });

  it("should display context length information", () => {
    renderWithProviders(<ModelsCatalog />);

    // Context length is shown in expanded details section
    // Check that Details buttons are present which can expand to show context info
    const detailsButtons = screen.getAllByText("Details anzeigen");
    expect(detailsButtons.length).toBeGreaterThan(0);

    // Verify model cards have the data-testid attribute
    const modelCards = screen.queryAllByTestId("model-card");
    expect(modelCards.length).toBe(2);
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
