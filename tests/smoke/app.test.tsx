import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import App from "../../src/App";

// Mock the Router component to avoid full routing setup/side-effects
vi.mock("../../src/app/router", () => ({
  Router: () => <div data-testid="mock-router">Router Content</div>,
}));

// Mock hooks that interact with browser APIs or side effects
vi.mock("../../src/hooks/useServiceWorker", () => ({
  useServiceWorker: vi.fn(),
}));

// Mock Sentry to avoid init calls
vi.mock("@sentry/react", () => ({
  init: vi.fn(),
  // Mock ErrorBoundary to just render children
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock environment config if needed (App calls initEnvironment via main.tsx, but App itself imports things)
// App.tsx doesn't call initEnvironment, main.tsx does. So App should be safe.

// Mock Context Providers if they do heavy lifting or API calls?
// StudioContext, FavoritesContext, ToastContext seem to be purely local state or simple checks.
// However, to be safe and isolate App structure:
// We can let them run. If they fail, we know there is a dependency issue.

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

    // Verify that basic layout elements (from providers or App structure) do not throw.
    // Since App wraps Router, checking Router presence is the main verify.
  });
});
