import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import SettingsView from "../../src/views/SettingsView";
import { ToastsProvider } from "../../src/components/ui/toast/ToastsProvider";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ToastsProvider>{ui}</ToastsProvider>);
};

describe("SettingsView Smoke", () => {
  it("renders API key input and model section", () => {
    renderWithProviders(<SettingsView />);
    expect(screen.getByLabelText(/API-Schlüssel/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Modell/i, level: 2 })).toBeInTheDocument();
  });

  it("renders role & style controls", () => {
    renderWithProviders(<SettingsView />);
    expect(screen.getByLabelText(/Rolle auswählen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Stil auswählen/i)).toBeInTheDocument();
  });
});