import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
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
    </MemoryRouter>,
  );
}

describe("TabbedSettingsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("zeigt den Daten-State mit Settings-Bereichen", async () => {
    renderTabbedSettingsView();

    expect(await screen.findByText("Gedächtnis")).toBeInTheDocument();
    expect((await screen.findAllByRole("button", { name: "Details" })).length).toBeGreaterThan(0);
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
