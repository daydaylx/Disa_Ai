import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnimatedCoreBackground } from "../AnimatedCoreBackground";

describe("AnimatedCoreBackground", () => {
  it("renders the idle headline and description", () => {
    render(<AnimatedCoreBackground status="idle" />);

    expect(screen.getByText("Was kann ich für dich tun?")).toBeInTheDocument();
    expect(
      screen.getByText("Tippe unten eine Frage ein oder wähle einen der Vorschläge."),
    ).toBeInTheDocument();
    expect(screen.getByText("Bereit")).toBeInTheDocument();
  });

  it("renders an error message when provided", () => {
    const message = "Etwas ist schiefgelaufen";
    render(<AnimatedCoreBackground status="error" lastErrorMessage={message} />);

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByText("Ein Fehler ist aufgetreten")).toBeInTheDocument();
  });

  it("exposes a test id for the animated core background", () => {
    const { getByTestId } = render(<AnimatedCoreBackground status="thinking" />);

    expect(getByTestId("animated-core")).toBeInTheDocument();
  });
});
