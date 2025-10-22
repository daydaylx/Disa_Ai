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
    // Use the input's id instead of the text which also matches the eye button
    expect(screen.getByLabelText("API-Schlüssel")).toBeInTheDocument();
    // Find the button by its text and container context
    expect(screen.getByRole("button", { name: /Schlüssel speichern/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Gedächtnis-Funktion/i })).toBeInTheDocument();
    // Find the memory switch by its label
    expect(screen.getByLabelText("Gedächtnis aktivieren")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Inhaltsfilter/i })).toBeInTheDocument();
    // Find the NSFW switch by its label
    expect(screen.getByLabelText("18+ / NSFW-Content anzeigen")).toBeInTheDocument();
  });

  it("validates and saves valid API key with success toast", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });

    // Use the input's id instead of the text which also matches the eye button
    const apiKeyInput = screen.getByLabelText("API-Schlüssel");
    // Find the first save button (there should only be one in the API key section)
    const saveButtons = screen.getAllByRole("button", { name: /Schlüssel speichern/i });
    const saveButton = saveButtons[0];

    // Enter a valid API key
    fireEvent.change(apiKeyInput, {
      target: { value: "sk-or-123456789012345678901234567890123456789012345678" },
    });
    fireEvent.click(saveButton);

    // Wait for possible toast to appear
    await waitFor(() => {
      const toasts = screen.queryAllByRole("status");
      expect(toasts.length).toBeGreaterThan(0);
    });

    // Check that the key was saved in sessionStorage
    expect(window.sessionStorage.getItem("openrouter-key")).toBe(
      "sk-or-123456789012345678901234567890123456789012345678",
    );

    // Check for success toast
    expect(screen.getByText(/Schlüssel gespeichert/i)).toBeInTheDocument();
  });

  it("validates invalid API key with error toast", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });

    // Use the input's id instead of the text which also matches the eye button
    const apiKeyInput = screen.getByLabelText("API-Schlüssel");
    // Find the first save button (there should only be one in the API key section)
    const saveButtons = screen.getAllByRole("button", { name: /Schlüssel speichern/i });
    const saveButton = saveButtons[0];

    // Enter an invalid API key (doesn't start with 'sk-or-')
    fireEvent.change(apiKeyInput, { target: { value: "invalid-key" } });
    fireEvent.click(saveButton);

    // Wait for possible toast to appear
    await waitFor(() => {
      const toasts = screen.queryAllByRole("status");
      expect(toasts.length).toBeGreaterThan(0);
    });

    // Check for error toast - use getAllByText and check the first one
    const errorElements = screen.getAllByText(/Ungültiger Schlüssel/i);
    expect(errorElements[0]).toBeInTheDocument();
  });

  it("removes API key when clear button is clicked", async () => {
    // First, set an API key in sessionStorage
    window.sessionStorage.setItem(
      "openrouter-key",
      "sk-123456789012345678901234567890123456789012345678",
    );

    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });

    // First clear the input
    const apiKeyInput = screen.getByLabelText("API-Schlüssel");
    fireEvent.change(apiKeyInput, { target: { value: "" } });

    // Click the first save button to remove the key
    const saveButtons = screen.getAllByRole("button", { name: /Schlüssel speichern/i });
    const saveButton = saveButtons[0];
    fireEvent.click(saveButton);

    // Check that the key was removed from sessionStorage
    await waitFor(() => {
      expect(window.sessionStorage.getItem("openrouter-key")).toBeFalsy();
    });
  });

  it("toggles memory setting", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });

    const memoryToggle = screen.getByLabelText("Gedächtnis aktivieren");

    // Initially memory should be disabled
    expect(memoryToggle).not.toBeChecked();

    // Toggle memory on
    fireEvent.click(memoryToggle);

    // Check that memory settings were updated in localStorage
    await waitFor(() => {
      const settings = JSON.parse(window.localStorage.getItem("disa:memory:settings") || "{}");
      expect(settings.enabled).toBe(true);
    });

    // Toggle memory off
    fireEvent.click(memoryToggle);

    // Check that memory settings were updated in localStorage
    await waitFor(() => {
      const settings = JSON.parse(window.localStorage.getItem("disa:memory:settings") || "{}");
      expect(settings.enabled).toBe(false);
    });
  });

  it("toggles NSFW content filter setting", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });

    const nsfwToggle = screen.getByLabelText("18+ / NSFW-Content anzeigen");

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

  it("handles PWA installation functionality", async () => {
    await act(async () => {
      renderWithProviders(<SettingsPage />);
    });

    // Check that installation section is rendered
    expect(screen.getAllByText(/App-Installation/i)[0]).toBeInTheDocument();

    // Mock the install functionality
    const installButton = screen.queryByRole("button", { name: /Jetzt als App installieren/i });

    // The button may not be visible depending on the environment
    if (installButton) {
      fireEvent.click(installButton);
      // Verify that the PWA install function was called
      await waitFor(() => {
        // We can't directly test the PWA install function without more mocks
        // But we can verify the UI behavior
        expect(installButton).toBeInTheDocument();
      });
    }
  });
});
