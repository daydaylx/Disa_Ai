// Importiere die Matcher von @testing-library/jest-dom
import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import App from "../../src/App";

// Mock the useServiceWorker hook to avoid side effects
vi.mock("../../src/hooks/useServiceWorker", () => ({
  useServiceWorker: vi.fn(),
}));

// Mock Sentry to avoid init calls
vi.mock("@sentry/react", () => ({
  init: vi.fn(),
  // Mock ErrorBoundary to just render children
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the entire App component to avoid router hooks
vi.mock("../../src/App", () => ({
  default: () => <div data-testid="mock-app">Mock App</div>,
}));

// Setup browser mocks
beforeAll(() => {
  // matchMedia mock
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // ResizeObserver mock
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // IntersectionObserver mock
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe("App Entry Point Smoke Test", () => {
  it("renders <App /> without crashing and mounts Router", async () => {
    render(<App />);

    // Check if the mocked router is present
    expect(await screen.findByTestId("mock-router")).toBeInTheDocument();
  });
});
