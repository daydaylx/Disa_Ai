import { render, screen } from "@testing-library/react";
import * as router from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "../app/layouts/AppShell";

// Mock dependencies
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
    Link: ({ children }: any) => <div>{children}</div>,
    NavLink: ({ children }: any) => <div>{children}</div>,
  };
});

vi.mock("../components/layout/AppMenuDrawer", () => ({
  AppMenuDrawer: () => <div data-testid="menu-drawer" />,
  MenuIcon: () => <button>Menu</button>,
  useMenuDrawer: () => ({ isOpen: false, openMenu: vi.fn(), closeMenu: vi.fn() }),
}));

vi.mock("../components/navigation/MobileBackButton", () => ({
  MobileBackButton: () => <div />,
}));
vi.mock("../components/navigation/Breadcrumbs", () => ({
  AutoBreadcrumbs: () => <div />,
}));
vi.mock("../components/neko/NekoLayer", () => ({
  NekoLayer: () => <div />,
}));
vi.mock("../components/NetworkBanner", () => ({
  NetworkBanner: () => <div />,
}));
vi.mock("../components/pwa/PWADebugInfo", () => ({
  PWADebugInfo: () => <div />,
}));
vi.mock("../components/pwa/PWAInstallPrompt", () => ({
  PWAInstallPrompt: () => <div />,
}));
vi.mock("../app/components/BrandWordmark", () => ({
  BrandWordmark: () => <div>Disa AI</div>,
}));

describe("AppShell Layout Logic", () => {
  it("renders optimized chat layout on home route (/)", () => {
    vi.mocked(router.useLocation).mockReturnValue({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: "default",
    });

    render(
      <AppShell>
        <div data-testid="child">Content</div>
      </AppShell>,
    );

    const mainWrapper = screen.getByTestId("app-main").firstElementChild;
    expect(mainWrapper).toBeInTheDocument();

    // Should NOT have padding or scroll
    expect(mainWrapper).toHaveClass("p-0");
    expect(mainWrapper).toHaveClass("overflow-hidden");
    expect(mainWrapper).not.toHaveClass("px-6");
    expect(mainWrapper).not.toHaveClass("overflow-y-auto");
  });

  it("renders optimized chat layout on chat route (/chat)", () => {
    vi.mocked(router.useLocation).mockReturnValue({
      pathname: "/chat",
      search: "",
      hash: "",
      state: null,
      key: "default",
    });

    render(
      <AppShell>
        <div data-testid="child">Content</div>
      </AppShell>,
    );

    const mainWrapper = screen.getByTestId("app-main").firstElementChild;
    expect(mainWrapper).toHaveClass("p-0");
  });

  it("renders standard layout on other routes (/settings)", () => {
    vi.mocked(router.useLocation).mockReturnValue({
      pathname: "/settings",
      search: "",
      hash: "",
      state: null,
      key: "default",
    });

    render(
      <AppShell>
        <div data-testid="child">Content</div>
      </AppShell>,
    );

    const mainWrapper = screen.getByTestId("app-main").firstElementChild;

    // Should HAVE padding and scroll (mobile-first: px-4 with sm:px-6)
    expect(mainWrapper).toHaveClass("px-4");
    expect(mainWrapper).toHaveClass("overflow-y-auto");
    expect(mainWrapper).not.toHaveClass("p-0");
  });

  it("renders page header props when provided", () => {
    vi.mocked(router.useLocation).mockReturnValue({
      pathname: "/feedback",
      search: "",
      hash: "",
      state: null,
      key: "default",
    });

    render(
      <AppShell pageHeaderTitle="Feedback" pageHeaderActions={<button>Zurück</button>}>
        <div data-testid="child">Content</div>
      </AppShell>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Feedback" })).toBeInTheDocument();
    expect(screen.getByText("Zurück")).toBeInTheDocument();
  });
});
