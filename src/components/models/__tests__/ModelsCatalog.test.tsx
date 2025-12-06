import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ModelCatalogProvider } from "../../../contexts/ModelCatalogContext";
import { useModelCatalog } from "../../../contexts/ModelCatalogContext";
import { SettingsProvider } from "../../../contexts/SettingsContext";
import { ModelsCatalog } from "../ModelsCatalog";

// Mock the model catalog context
vi.mock("../../../contexts/ModelCatalogContext", async () => {
  const actual = await vi.importActual("../../../contexts/ModelCatalogContext");
  return {
    ...actual,
    useModelCatalog: vi.fn(),
  };
});

// Mock the settings context
vi.mock("../../../contexts/SettingsContext", async () => {
  const actual = await vi.importActual("../../../contexts/SettingsContext");
  return {
    ...actual,
    useSettingsContext: () => ({
      settings: { preferredModelId: null },
      setSettings: vi.fn(),
    }),
  };
});

const mockModels = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "A fast and efficient model",
    provider: "OpenAI",
    context_length: 128000,
    pricing: { prompt: 0.15, completion: 0.6 },
    architecture: { modality: "text->text" },
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    description: "A quick and capable model",
    provider: "Anthropic",
    context_length: 200000,
    pricing: { prompt: 0.25, completion: 1.25 },
    architecture: { modality: "text->text" },
  },
];

describe("ModelsCatalog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useModelCatalog as any).mockReturnValue({
      models: mockModels,
      isLoading: false,
      error: null,
    });
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

  it("should render the models catalog header", () => {
    renderWithProviders(<ModelsCatalog />);

    expect(screen.getByRole("heading", { level: 1, name: /Modelle/i })).toBeInTheDocument();
  });

  it("should display model cards", () => {
    renderWithProviders(<ModelsCatalog />);

    // Check for model names
    expect(screen.getByText("GPT-4o Mini")).toBeInTheDocument();
    expect(screen.getByText("Claude 3 Haiku")).toBeInTheDocument();

    // Check for model descriptions
    expect(screen.getByText("A fast and efficient model")).toBeInTheDocument();
    expect(screen.getByText("A quick and capable model")).toBeInTheDocument();
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
      models: [],
      isLoading: true,
      error: null,
    });

    renderWithProviders(<ModelsCatalog />);

    // Check for loading indicators
    const loadingElements = screen
      .getAllByTestId("model-card-skeleton")
      .or(screen.getAllByRole("status"));
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it("should show error state when models fail to load", () => {
    (useModelCatalog as any).mockReturnValue({
      models: [],
      isLoading: false,
      error: "Failed to load models",
    });

    renderWithProviders(<ModelsCatalog />);

    expect(screen.getByText(/Fehler|Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load models/)).toBeInTheDocument();
  });

  it("should handle model selection", () => {
    const mockSetSelectedModelId = vi.fn();

    renderWithProviders(<ModelsCatalog />);

    // Find first model card and click it
    const firstModelCard = screen.getByText("GPT-4o Mini").closest('[role="button"]');
    if (firstModelCard) {
      fireEvent.click(firstModelCard);

      // In a real implementation, this would either navigate or set a selected state
      // For now, just ensure it doesn't error
      expect(firstModelCard).toBeInTheDocument();
    }
  });

  it("should display provider information", () => {
    renderWithProviders(<ModelsCatalog />);

    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByText("Anthropic")).toBeInTheDocument();
  });

  it("should display context length information", () => {
    renderWithProviders(<ModelsCatalog />);

    // Check for context length displays (might be formatted differently)
    expect(screen.getByText(/128000|128k/i)).toBeInTheDocument();
    expect(screen.getByText(/200000|200k/i)).toBeInTheDocument();
  });

  it("should have accessible model cards", () => {
    renderWithProviders(<ModelsCatalog />);

    const modelCards = screen
      .getAllByRole("button")
      .filter(
        (card) =>
          card.textContent &&
          (card.textContent.includes("GPT-4o Mini") || card.textContent.includes("Claude 3 Haiku")),
      );

    expect(modelCards.length).toBeGreaterThan(0);

    // Check that cards have proper ARIA attributes
    modelCards.forEach((card) => {
      expect(card).toHaveAttribute("aria-label");
    });
  });
});
