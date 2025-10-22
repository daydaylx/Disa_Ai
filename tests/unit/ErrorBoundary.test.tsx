import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ErrorBoundary } from "../../src/components/ErrorBoundary";

// Test component that throws an error
const BombComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>Normal content</div>;
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    // Suppress console.error during tests since we're testing error scenarios
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Normal content")).toBeInTheDocument();
  });

  it("catches an error and displays fallback UI", () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Anwendungsfehler")).toBeInTheDocument();
    expect(
      screen.getByText("Die Anwendung ist auf einen unerwarteten Fehler gestoßen"),
    ).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("shows error details when technical details are expanded", () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.queryByText("Stack Trace:")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Technische Details anzeigen"));

    expect(screen.getByText("Stack Trace:")).toBeInTheDocument();
  });

  it("provides recovery options", () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Seite neu laden")).toBeInTheDocument();
    expect(screen.getByText("App zurücksetzen")).toBeInTheDocument();
    expect(screen.getByText("Fehler melden")).toBeInTheDocument();
  });

  it('copies error report to clipboard when "Fehler melden" is clicked', async () => {
    const mockWriteText = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    const reportButton = screen.getByText("Fehler melden");
    fireEvent.click(reportButton);

    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining("errorId"));
  });
});
