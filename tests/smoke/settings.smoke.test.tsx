import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { ToastsProvider } from "../../src/components/ui/toast/ToastsProvider";
import SettingsView from "../../src/views/SettingsView";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ToastsProvider>{ui}</ToastsProvider>);
};

describe("SettingsView Smoke", () => {
  it("renders API key input and model section", () => {
    renderWithProviders(<SettingsView />);
    expect(screen.getByTestId("settings-save-key")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Modell-Auswahl/i })).toBeInTheDocument();
  });

  it("renders tabbed navigation structure", async () => {
    renderWithProviders(<SettingsView />);
    expect(await screen.findByRole("heading", { name: /Control Center/i })).toBeInTheDocument();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });
});
