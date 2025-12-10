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
      screen.getByText("Tippe unten eine Frage ein oder wähle einen der Vorschläge."),
    ).toBeInTheDocument();

    // Check status line
    expect(screen.getByText("Bereit")).toBeInTheDocument();
    expect(screen.getByText("Test Model")).toBeInTheDocument();
  });

  it("renders thinking state", () => {
    render(<ChatHeroCore {...defaultProps} status="thinking" />);

    expect(screen.getByText("Denkt nach...")).toBeInTheDocument();
  });

  it("renders streaming state", () => {
    render(<ChatHeroCore {...defaultProps} status="streaming" />);
    expect(screen.getByText("Antwortet...")).toBeInTheDocument();
  });

  it("renders error state with error message", () => {
    const errorMessage = "Something went wrong";
    render(<ChatHeroCore {...defaultProps} status="error" lastErrorMessage={errorMessage} />);

    expect(screen.getByText("Ein Fehler ist aufgetreten")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Fehler")).toBeInTheDocument();
  });
});
