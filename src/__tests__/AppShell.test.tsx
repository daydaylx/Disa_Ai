import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppShell } from "../app/layouts/AppShell";

describe("AppShell Layout", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders app shell with main content area", () => {
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <AppShell pageHeaderTitle="Test Title">
          <div data-testid="test-content">Test Content</div>
        </AppShell>
      </MemoryRouter>,
    );

    const appMain = screen.getByTestId("app-main");
    expect(appMain).toBeInTheDocument();
    expect(appMain).toHaveClass("relative", "flex", "flex-1", "flex-col", "min-h-0");
  });

  it("renders page header title on non-chat routes", () => {
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <AppShell pageHeaderTitle="Settings">
          <div>Settings Content</div>
        </AppShell>
      </MemoryRouter>,
    );

    const title = screen.getByText("Settings");
    expect(title).toBeInTheDocument();
  });

  it("hides header on chat routes", () => {
    render(
      <MemoryRouter initialEntries={["/chat"]}>
        <AppShell>
          <div>Chat Content</div>
        </AppShell>
      </MemoryRouter>,
    );

    const header = screen.queryByText("Disa AI");
    expect(header).not.toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <MemoryRouter initialEntries={["/settings"]}>
        <AppShell pageHeaderTitle="Test">
          <div data-testid="test-children">Child Content</div>
        </AppShell>
      </MemoryRouter>,
    );

    const children = screen.getByTestId("test-children");
    expect(children).toBeInTheDocument();
    expect(children).toHaveTextContent("Child Content");
  });

  it("does not render mobile bottom navigation", () => {
    render(
      <MemoryRouter initialEntries={["/models"]}>
        <AppShell>
          <div>Models Content</div>
        </AppShell>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("mobile-bottom-nav")).not.toBeInTheDocument();
  });
});
