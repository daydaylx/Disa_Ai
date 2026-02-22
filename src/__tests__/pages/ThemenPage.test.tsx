import { render, screen } from "@testing-library/react";
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
    expect(
      screen.getByRole("button", { name: "Details zu Test Diskussion ausklappen" }),
    ).toBeInTheDocument();
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
});
