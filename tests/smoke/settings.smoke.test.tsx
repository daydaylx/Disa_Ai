import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import SettingsView from "../../src/views/SettingsView";

describe("SettingsView Smoke", () => {
  it("renders API key input and model section", () => {
    render(<SettingsView />);
    expect(screen.getByLabelText(/API-Schlüssel/i)).toBeTruthy();
    expect(screen.getByText(/Modell/i)).toBeTruthy();
  });

  it("renders role & style controls", () => {
    render(<SettingsView />);
    expect(screen.getByLabelText(/Rolle auswählen/i)).toBeTruthy();
    expect(screen.getByLabelText(/Stil auswählen/i)).toBeTruthy();
  });
});
