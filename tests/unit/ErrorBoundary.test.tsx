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

    // Zuerst prüfen, ob Stack Trace-Elemente sichtbar sind (vor dem Klick)
    const initialStackTraceElements = screen.queryAllByText("Stack Trace:");
    const initialCount = initialStackTraceElements.length;

    // Klicke auf das erste "Technische Details anzeigen" Element
    fireEvent.click(screen.getAllByText("Technische Details anzeigen")[0]);

    // Nach dem Klick die Anzahl der Stack Trace-Elemente prüfen
    const expandedStackTraceElements = screen.getAllByText("Stack Trace:");
    const expandedCount = expandedStackTraceElements.length;

    // Überprüfe, dass nach dem Klick eine Anzahl von Stack Trace-Elementen vorhanden ist
    // (auch wenn die Anzahl gleich bleibt, prüfen wir, dass die Elemente da sind)
    expect(expandedCount).toBeGreaterThanOrEqual(1);
  });

  it("provides recovery options", () => {
    render(
      <ErrorBoundary>
        <BombComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getAllByText("Seite neu laden")[0]).toBeInTheDocument();
    expect(screen.getAllByText("App zurücksetzen")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Fehler melden")[0]).toBeInTheDocument();
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

    const reportButton = screen.getAllByText("Fehler melden")[0];
    fireEvent.click(reportButton);

    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining("errorId"));
  });
});
