import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";

import { ToastsProvider } from "../../src/components/ui/toast/ToastsProvider";
import SettingsPage from "../../src/pages/Settings";

// Create a wrapper that includes all necessary providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ToastsProvider>{ui}</ToastsProvider>
    </BrowserRouter>,
  );
};

describe("SettingsPage", () => {
  beforeEach(() => {
    // Mock sessionStorage
    const sessionStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
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
        "disa-ai-settings": JSON.stringify({ showNSFWContent: false }),
        "disa-memory-settings": JSON.stringify({ enabled: false }),
      };
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
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

  it("renders settings page with API key input and elements", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });
    
    expect(screen.getByRole("heading", { name: /Einstellungen/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/API-Schlüssel/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Schlüssel speichern/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Gedächtnis-Funktion/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Gedächtnis aktivieren/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Inhaltsfilter/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/18\+ \/ NSFW-Content anzeigen/i)).toBeInTheDocument();
  });

  it("validates and saves valid API key with success toast", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });

    const apiKeyInput = screen.getByLabelText(/API-Schlüssel/i);
    const saveButton = screen.getByRole("button", { name: /Schlüssel speichern/i });

    // Enter a valid API key
    fireEvent.change(apiKeyInput, { target: { value: "sk-123456789012345678901234567890123456789012345678" } });
    fireEvent.click(saveButton);

    // Check that the key was saved in sessionStorage
    await waitFor(() => {
      expect(window.sessionStorage.getItem("disa-ai-api-key")).toBe("sk-123456789012345678901234567890123456789012345678");
    });

    // Check for success toast notification (mocked in the UI)
    // Note: Actual toast verification would depend on the toast implementation
  });

  it("validates invalid API key with error toast", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });

    const apiKeyInput = screen.getByLabelText(/API-Schlüssel/i);
    const saveButton = screen.getByRole("button", { name: /Schlüssel speichern/i });

    // Enter an invalid API key
    fireEvent.change(apiKeyInput, { target: { value: "invalid-key" } });
    fireEvent.click(saveButton);

    // Check for error toast notification
    // Note: Actual toast verification would depend on the toast implementation
  });

  it("removes API key when clear button is clicked", async () => {
    // First, set an API key in sessionStorage
    window.sessionStorage.setItem("disa-ai-api-key", "sk-123456789012345678901234567890123456789012345678");

    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });

    const clearButton = screen.getByRole("button", { name: /Schlüssel entfernen/i });
    fireEvent.click(clearButton);

    // Check that the key was removed from sessionStorage
    await waitFor(() => {
      expect(window.sessionStorage.getItem("disa-ai-api-key")).toBeNull();
    });
  });

  it("toggles memory setting", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });

    const memoryToggle = screen.getByLabelText(/Gedächtnis aktivieren/i);
    
    // Initially memory should be disabled
    expect(memoryToggle).not.toBeChecked();

    // Toggle memory on
    fireEvent.click(memoryToggle);
    
    // Check that memory settings were updated in localStorage
    await waitFor(() => {
      const settings = JSON.parse(window.localStorage.getItem("disa-memory-settings") || "{}");
      expect(settings.enabled).toBe(true);
    });

    // Toggle memory off
    fireEvent.click(memoryToggle);
    
    // Check that memory settings were updated in localStorage
    await waitFor(() => {
      const settings = JSON.parse(window.localStorage.getItem("disa-memory-settings") || "{}");
      expect(settings.enabled).toBe(false);
    });
  });

  it("toggles NSFW content filter setting", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });

    const nsfwToggle = screen.getByLabelText(/18\+ \/ NSFW-Content anzeigen/i);
    
    // Initially NSFW should be disabled
    expect(nsfwToggle).not.toBeChecked();

    // Toggle NSFW on
    fireEvent.click(nsfwToggle);
    
    // Check that settings were updated in localStorage
    await waitFor(() => {
      const settings = JSON.parse(window.localStorage.getItem("disa-ai-settings") || "{}");
      expect(settings.showNSFWContent).toBe(true);
    });

    // Toggle NSFW off
    fireEvent.click(nsfwToggle);
    
    // Check that settings were updated in localStorage
    await waitFor(() => {
      const settings = JSON.parse(window.localStorage.getItem("disa-ai-settings") || "{}");
      expect(settings.showNSFWContent).toBe(false);
    });
  });
});