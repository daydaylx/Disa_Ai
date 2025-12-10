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

    // Idle state should render the two cubes but no orbit or waves
    expect(screen.getByTestId("cube-a")).toBeInTheDocument();
    expect(screen.getByTestId("cube-b")).toBeInTheDocument();
    expect(screen.queryByTestId("cube-orbit")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cube-wave")).not.toBeInTheDocument();
  });

  it("renders thinking state with orbit", () => {
    render(<ChatHeroCore {...defaultProps} status="thinking" />);

    expect(screen.getByText("Aktiv")).toBeInTheDocument();
    expect(screen.getByTestId("cube-orbit")).toBeInTheDocument();
    expect(screen.queryByTestId("cube-wave")).not.toBeInTheDocument();
  });

  it("renders streaming state with waves", () => {
    render(<ChatHeroCore {...defaultProps} status="streaming" />);
    expect(screen.getByText("Aktiv")).toBeInTheDocument();

    expect(screen.getByTestId("cube-orbit")).toBeInTheDocument();
    const waves = screen.getAllByTestId("cube-wave");
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
    const redStroke = container.querySelectorAll(".text-status-error");
    expect(redStroke.length).toBeGreaterThan(0);
    expect(screen.queryByTestId("cube-orbit")).not.toBeInTheDocument();
    expect(screen.queryByTestId("cube-wave")).not.toBeInTheDocument();
  });
});
