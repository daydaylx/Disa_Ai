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
    expect(screen.getByLabelText(/API-Schlüssel/i, { selector: "input" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Modell/i, level: 2 })).toBeInTheDocument();
  });

  it("renders role & style controls", async () => {
    renderWithProviders(<SettingsView />);
    expect(await screen.findByLabelText(/Rolle auswählen/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Stil auswählen/i)).toBeInTheDocument();
  });
});
