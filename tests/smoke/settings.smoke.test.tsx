import { act, render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ToastsProvider } from "../../src/components/ui/toast/ToastsProvider";
import SettingsPage from "../../src/pages/Settings";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ToastsProvider>{ui}</ToastsProvider>
    </BrowserRouter>,
  );
};

describe("Settings Page Smoke", () => {
  beforeEach(() => {
    // Mock sessionStorage
    const sessionStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();

    Object.defineProperty(window, "sessionStorage", {
      value: sessionStorageMock,
      writable: true,
    });

    // Mock localStorage for settings
    const localStorageMock = (() => {
      let store: Record<string, string> = {
        "disa-settings": JSON.stringify({ showNSFWContent: false }),
        "memory-enabled": "false",
      };
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();

    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders settings page with API key input", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });
    expect(screen.getByRole("heading", { name: /Einstellungen/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/API-Schlüssel/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Schlüssel speichern/i })).toBeInTheDocument();
  });

  it("renders memory settings section", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });
    expect(screen.getByRole("heading", { name: /Gedächtnis-Funktion/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Gedächtnis aktivieren/i)).toBeInTheDocument();
  });

  it("renders NSFW content filter toggle", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });
    expect(screen.getByRole("heading", { name: /Inhaltsfilter/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/18\+ \/ NSFW-Content anzeigen/i)).toBeInTheDocument();
  });

  it("renders PWA installation section", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });
    expect(screen.getByRole("heading", { name: /App-Installation/i })).toBeInTheDocument();
  });
});
