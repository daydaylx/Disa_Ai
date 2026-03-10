import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TabbedSettingsView } from "../TabbedSettingsView";

vi.mock("@/hooks/useMemory", () => ({
  useMemory: () => ({
    isEnabled: true,
  }),
}));

vi.mock("@/hooks/useSettings", () => ({
  useSettings: () => ({
    settings: {
      creativity: 45,
      theme: "auto",
      enableNeko: false,
      enableAnalytics: true,
    },
  }),
}));

function renderTabbedSettingsView(
  options: {
    loadSections?: () => Promise<any[]>;
  } = {},
) {
  return render(
    <MemoryRouter initialEntries={["/settings"]}>
      <TabbedSettingsView loadSections={options.loadSections as never} />
      <LocationProbe />
    </MemoryRouter>,
  );
}

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
}

describe("TabbedSettingsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("zeigt den Daten-State mit Settings-Bereichen", async () => {
    renderTabbedSettingsView();

    expect(await screen.findByText("Gedächtnis")).toBeInTheDocument();
    expect(screen.getAllByText(/Aktueller Stand:/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", {
        name: "Gedächtnis öffnen",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Details zu Gedächtnis",
      }),
    ).toBeInTheDocument();
  });

  it("öffnet einen Bereich direkt über die Primäraktion", async () => {
    const user = userEvent.setup();
    renderTabbedSettingsView();

    await user.click(
      await screen.findByRole("button", {
        name: "Gedächtnis öffnen",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("location-display")).toHaveTextContent("/settings/memory");
    });
  });

  it("zeigt Details getrennt an und öffnet den Bereich erst über den CTA", async () => {
    const user = userEvent.setup();
    renderTabbedSettingsView();

    await user.click(
      await screen.findByRole("button", {
        name: "Details zu Gedächtnis",
      }),
    );

    expect(screen.getByText(/Aktueller Status:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Öffnen" })).toBeInTheDocument();
    expect(screen.getByTestId("location-display")).toHaveTextContent("/settings");

    await user.click(screen.getByRole("button", { name: "Öffnen" }));

    await waitFor(() => {
      expect(screen.getByTestId("location-display")).toHaveTextContent("/settings/memory");
    });
  });

  it("zeigt den Empty-State wenn keine Bereiche verfügbar sind", async () => {
    renderTabbedSettingsView({
      loadSections: () => Promise.resolve([]),
    });

    expect(await screen.findByText("Keine Einstellungsbereiche verfügbar")).toBeInTheDocument();
  });

  it("zeigt den Error-State und kann per Retry neu laden", async () => {
    const user = userEvent.setup();
    const loadSections = vi
      .fn()
      .mockRejectedValueOnce(new Error("load failed"))
      .mockResolvedValueOnce([
        {
          id: "memory",
          label: "Gedächtnis",
          description: "Verlauf & Profil",
          icon: () => null,
          to: "/settings/memory",
        },
      ]);

    vi.spyOn(console, "error").mockImplementation(() => {});
    renderTabbedSettingsView({ loadSections });

    expect(
      await screen.findByText("Einstellungen konnten nicht geladen werden"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Erneut versuchen" }));

    expect(await screen.findByText("Verlauf & Profil")).toBeInTheDocument();
  });
});
