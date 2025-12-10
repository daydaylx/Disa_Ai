import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type CoreStatus, LivingCore } from "../LivingCore";

describe("LivingCore", () => {
  const defaultProps = {
    status: "idle" as CoreStatus,
    modelName: "test-model",
    toneLabel: "neutral",
    creativityLabel: "balanced",
  };

  it("renders the main greeting text", () => {
    render(<LivingCore {...defaultProps} />);
    expect(screen.getByText("Was kann ich für dich tun?")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<LivingCore {...defaultProps} />);
    expect(
      screen.getByText("Tippe unten eine Frage ein oder wähle einen der Vorschläge."),
    ).toBeInTheDocument();
  });

  it("displays model information", () => {
    render(<LivingCore {...defaultProps} />);
    expect(screen.getByText("test-model")).toBeInTheDocument();
    expect(screen.getByText("neutral")).toBeInTheDocument();
    expect(screen.getByText("balanced")).toBeInTheDocument();
  });

  it("shows ready status when idle", () => {
    render(<LivingCore {...defaultProps} status="idle" />);
    expect(screen.getByText("Bereit")).toBeInTheDocument();
  });

  it("shows thinking status when thinking", () => {
    render(<LivingCore {...defaultProps} status="thinking" />);
    expect(screen.getByText("Denkt nach...")).toBeInTheDocument();
  });

  it("shows streaming status when streaming", () => {
    render(<LivingCore {...defaultProps} status="streaming" />);
    expect(screen.getByText("Antwortet...")).toBeInTheDocument();
  });

  it("shows error message when error", () => {
    const errorMessage = "Test error message";
    render(<LivingCore {...defaultProps} status="error" lastErrorMessage={errorMessage} />);
    expect(screen.getByText("Ein Fehler ist aufgetreten")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Fehler")).toBeInTheDocument();
  });

  it("shows correct status indicators between information", () => {
    render(<LivingCore {...defaultProps} />);
    const statusLine = screen.getByText(/test-model/).parentElement;
    expect(statusLine).toHaveTextContent("Bereit•test-model•neutral•balanced");
  });

  it("has the core container with proper classes", () => {
    render(<LivingCore {...defaultProps} />);
    const coreContainer = document.querySelector(
      '[class*="relative flex items-center justify-center cursor-pointer"]',
    );
    expect(coreContainer).toBeInTheDocument();
  });

  it("has accessibility labels for interaction", () => {
    render(<LivingCore {...defaultProps} />);
    const coreContainer = document.querySelector('[class*="cursor-pointer"]');
    expect(coreContainer).toBeInTheDocument();
  });
});
