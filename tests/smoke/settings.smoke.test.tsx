import { render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ToastsProvider } from "../../src/components/ui/toast/ToastsProvider";
import SettingsView from "../../src/ui2/SettingsView";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ToastsProvider>{ui}</ToastsProvider>);
};

describe("SettingsView Smoke", () => {
  beforeEach(() => {
    const stylesMockResponse = {
      styles: [],
    };
    const modelsMockResponse = {
      data: [],
    };

    vi.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.toString().endsWith("/styles.json")) {
        return Promise.resolve({
          json: () => Promise.resolve(stylesMockResponse),
        } as Response);
      }
      if (url.toString().endsWith("/models")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(modelsMockResponse),
        } as Response);
      }
      return Promise.reject(new Error(`Unhandled fetch: ${url}`));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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
