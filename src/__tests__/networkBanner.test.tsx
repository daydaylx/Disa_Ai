import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { NetworkBanner } from "../components/NetworkBanner";

describe("NetworkBanner", () => {
  afterEach(() => {
    cleanup();
  });

  it("zeigt Banner wenn offline", () => {
    // Set navigator to offline before rendering
    Object.defineProperty(navigator, "onLine", {
      value: false,
      configurable: true,
      writable: true,
    });

    render(<NetworkBanner />);

    // Banner should be visible when offline
    expect(screen.getByText(/Offline/)).toBeInTheDocument();
  });

  it("hat korrekte Accessibility-Attribute", () => {
    // Test component accessibility attributes
    Object.defineProperty(navigator, "onLine", {
      value: false,
      configurable: true,
      writable: true,
    });

    render(<NetworkBanner />);

    // Test component structure and accessibility
    const banner = screen.getByTestId("offline-banner");
    expect(banner).toHaveAttribute("role", "status");
    expect(banner).toHaveAttribute("aria-live", "polite");
    expect(banner).toHaveAttribute("aria-label", "Offline-Status");

    // Verify text content
    expect(banner).toHaveTextContent("📶 Offline – Eingaben werden lokal gepuffert");
  });
});
