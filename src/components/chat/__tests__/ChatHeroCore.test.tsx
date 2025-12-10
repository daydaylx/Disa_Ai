import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChatHeroCore, type CoreStatus } from "../ChatHeroCore";

describe("ChatHeroCore", () => {
  const defaultProps = {
    status: "idle" as CoreStatus,
    modelName: "Test Model",
    toneLabel: "Neutral",
    creativityLabel: "Standard",
  };

  it("renders correctly in idle state", () => {
    render(<ChatHeroCore {...defaultProps} />);

    // Check if main texts are present
    expect(screen.getByText("Was kann ich für dich tun?")).toBeInTheDocument();
    expect(
      screen.getByText("Tippe unten eine Frage ein oder wähle einen der Vorschläge"),
    ).toBeInTheDocument();

    // Check status line
    expect(screen.getByText("Bereit")).toBeInTheDocument();
    expect(screen.getByText("Test Model")).toBeInTheDocument();

    // Check that thinking/streaming elements are NOT present
    // The dashed ring has a specific class or attribute we can look for,
    // or we can check simply that the SVG container for the ring isn't there
    const svgRing = document.querySelector("rect[stroke-dasharray='10 10']");
    expect(svgRing).not.toBeInTheDocument();
  });

  it("renders thinking state with dashed ring", () => {
    render(<ChatHeroCore {...defaultProps} status="thinking" />);

    expect(screen.getByText("Aktiv")).toBeInTheDocument();

    // Check for the dashed ring SVG
    // Note: render creates a container, we query inside document body which works with RTL
    // But to be safe with Vitest/RTL setup, we can use container.querySelector if returned from render
    const { container } = render(<ChatHeroCore {...defaultProps} status="thinking" />);
    // Re-rendering in same test might be confusing, let's rely on the first render or clean up.
    // Actually RTL cleanup is auto. Let's just use a fresh render in a variable.
  });

  it("renders thinking state visual elements", () => {
    const { container } = render(<ChatHeroCore {...defaultProps} status="thinking" />);

    // Look for the dashed rect which represents the thinking ring
    const dashedRect = container.querySelector("rect[stroke-dasharray='10 10']");
    expect(dashedRect).toBeInTheDocument();
  });

  it("renders streaming state with waves", () => {
    const { container } = render(<ChatHeroCore {...defaultProps} status="streaming" />);

    expect(screen.getByText("Aktiv")).toBeInTheDocument();

    // Should have dashed ring AND waves
    const dashedRect = container.querySelector("rect[stroke-dasharray='10 10']");
    expect(dashedRect).toBeInTheDocument();

    // Waves have specific animation class
    const waves = container.querySelectorAll(".animate-core-wave");
    expect(waves.length).toBeGreaterThan(0);
  });

  it("renders error state with error message", () => {
    const errorMessage = "Something went wrong";
    render(<ChatHeroCore {...defaultProps} status="error" lastErrorMessage={errorMessage} />);

    expect(screen.getByText("Ein Fehler ist aufgetreten")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Fehler")).toBeInTheDocument();

    // Error state should generally be red (bg-status-error or bg-red-500/600 in classes)
    // Checking for specific class presence is a bit brittle but verifies the visual intent
    // We can check if the status dot/indicator logic applied correct class
    const { container } = render(<ChatHeroCore {...defaultProps} status="error" />);
    // The glow layer gets bg-red-500 in error state
    const redGlow = container.querySelector(".bg-red-500");
    expect(redGlow).toBeInTheDocument();
  });
});
