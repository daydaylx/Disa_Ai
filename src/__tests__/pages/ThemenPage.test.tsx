import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getQuickstartsWithFallback, type Quickstart } from "@/config/quickstarts";
import ThemenPage from "@/pages/ThemenPage";

vi.mock("@/config/quickstarts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/config/quickstarts")>();
  return {
    ...actual,
    getQuickstartsWithFallback: vi.fn(),
  };
});

const mockedGetQuickstartsWithFallback = vi.mocked(getQuickstartsWithFallback);

const SAMPLE_QUICKSTART: Quickstart = {
  id: "discussion-test",
  title: "Test Diskussion",
  description: "Ein Testthema",
  icon: null,
  system: "system prompt",
  user: "user prompt",
  category: "wissenschaft",
};

const CONTROVERSIAL_QUICKSTART: Quickstart = {
  id: "discussion-controversial",
  title: "Kontroverses Thema",
  description: "Ein kontroverses Testthema",
  icon: null,
  system: "system prompt",
  user: "user prompt",
  category: "verschwörungstheorien",
};

function renderThemenPage() {
  return render(
    <MemoryRouter>
      <ThemenPage />
    </MemoryRouter>,
  );
}

describe("ThemenPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetQuickstartsWithFallback.mockResolvedValue([SAMPLE_QUICKSTART]);
  });

  it("zeigt den Daten-State mit Themenliste", async () => {
    renderThemenPage();

    expect(await screen.findByText("Test Diskussion")).toBeInTheDocument();
    expect(screen.getByText("1 Themen · 0 Kontrovers")).toBeInTheDocument();

    // Both the ListRow overlay and the trailing button share the same aria-label;
    // click the first match (the row overlay) to open the BottomSheet.
    const [detailsButton] = screen.getAllByRole("button", {
      name: "Details zu Test Diskussion anzeigen",
    });

    fireEvent.click(detailsButton!);

    expect(screen.getByText("Ein Testthema")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Diskussion starten" })).toBeInTheDocument();
    // BottomSheet has both an icon X-button (aria-label) and a text "Schließen" button
    expect(screen.getAllByRole("button", { name: "Schließen" }).length).toBeGreaterThan(0);
  });

  it("zeigt den Empty-State ohne Themen", async () => {
    mockedGetQuickstartsWithFallback.mockResolvedValue([]);

    renderThemenPage();

    expect(await screen.findByText("Keine Themen verfügbar")).toBeInTheDocument();
  });

  it("zeigt den Error-State bei Ladefehler", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockedGetQuickstartsWithFallback.mockRejectedValue(new Error("load failed"));

    renderThemenPage();

    expect(await screen.findByText("Themen konnten nicht geladen werden")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Erneut versuchen" })).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("zeigt den Fallback-Hinweis bei externer Lade-Störung", async () => {
    mockedGetQuickstartsWithFallback.mockImplementation((options) => {
      options?.onFallback?.({ reason: "error", error: new Error("fetch failed") });
      return Promise.resolve([SAMPLE_QUICKSTART]);
    });

    renderThemenPage();

    expect(
      await screen.findByText(
        "Externe Themen konnten nicht geladen werden. Standardthemen werden angezeigt.",
      ),
    ).toBeInTheDocument();
  });

  it("zeigt die Header-Summary mit Kontrovers-Zähler", async () => {
    mockedGetQuickstartsWithFallback.mockResolvedValue([
      SAMPLE_QUICKSTART,
      CONTROVERSIAL_QUICKSTART,
    ]);

    renderThemenPage();

    expect(await screen.findByText("2 Themen · 1 Kontrovers")).toBeInTheDocument();
    expect(screen.getByText("Kontroverses Thema")).toBeInTheDocument();
  });
});
