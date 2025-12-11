import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type CoreStatus, EnergyOrb } from "../EnergyOrb";

// Mock @react-three/fiber and related libraries to avoid WebGL context issues in tests
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas-mock">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
  PerspectiveCamera: () => null,
}));

vi.mock("@react-three/postprocessing", () => ({
  Bloom: () => null,
  EffectComposer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("EnergyOrb", () => {
  const defaultProps = {
    status: "idle" as CoreStatus,
    modelName: "Test Model",
    toneLabel: "Neutral",
    creativityLabel: "Standard",
  };

  it("renders correctly in idle state", () => {
    render(<EnergyOrb {...defaultProps} />);

    // Check main text
    expect(screen.getByText("Was kann ich für dich tun?")).toBeInTheDocument();
    expect(
      screen.getByText("Tippe unten eine Frage ein oder wähle einen der Vorschläge."),
    ).toBeInTheDocument();

    // Check status line
    expect(screen.getByText("Bereit")).toBeInTheDocument();
    expect(screen.getByText("Test Model")).toBeInTheDocument();
  });

  it("renders thinking state", () => {
    render(<EnergyOrb {...defaultProps} status="thinking" />);
    expect(screen.getByText("Denkt nach...")).toBeInTheDocument();
  });

  it("renders streaming state", () => {
    render(<EnergyOrb {...defaultProps} status="streaming" />);
    expect(screen.getByText("Antwortet...")).toBeInTheDocument();
  });

  it("renders error state with error message", () => {
    const errorMessage = "Something went wrong";
    render(<EnergyOrb {...defaultProps} status="error" lastErrorMessage={errorMessage} />);

    expect(screen.getByText("Ein Fehler ist aufgetreten")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Fehler")).toBeInTheDocument();
  });

  it("renders model metadata correctly", () => {
    render(<EnergyOrb {...defaultProps} />);

    expect(screen.getByText("Test Model")).toBeInTheDocument();
    expect(screen.getByText("Neutral")).toBeInTheDocument();
    expect(screen.getByText("Standard")).toBeInTheDocument();
  });

  it("displays different status messages based on state", () => {
    const { rerender } = render(<EnergyOrb {...defaultProps} status="idle" />);
    expect(screen.getByText("Bereit")).toBeInTheDocument();

    rerender(<EnergyOrb {...defaultProps} status="thinking" />);
    expect(screen.getByText("Denkt nach...")).toBeInTheDocument();

    rerender(<EnergyOrb {...defaultProps} status="streaming" />);
    expect(screen.getByText("Antwortet...")).toBeInTheDocument();

    rerender(<EnergyOrb {...defaultProps} status="error" />);
    expect(screen.getByText("Fehler")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const { container } = render(<EnergyOrb {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });
});
