import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { MobileBottomNavigation } from "../../../src/components/layout/MobileBottomNavigation";

// Mock the window.location for testing
const mockLocation = {
  pathname: "/chat",
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => mockLocation,
  };
});

describe("Mobile Bottom Navigation", () => {
  it("renders navigation items correctly", () => {
    render(
      <BrowserRouter>
        <MobileBottomNavigation />
      </BrowserRouter>,
    );

    // Check if all nav items are present
    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Modelle")).toBeInTheDocument();
    expect(screen.getByText("Rollen")).toBeInTheDocument();
  });

  it("renders with correct styling", () => {
    const { container } = render(
      <BrowserRouter>
        <MobileBottomNavigation />
      </BrowserRouter>,
    );

    const navElement = container.querySelector("nav.bottom-navigation");
    expect(navElement).toBeInTheDocument();
    expect(navElement).toHaveClass("fixed");
    expect(navElement).toHaveClass("bottom-0");
  });
});
