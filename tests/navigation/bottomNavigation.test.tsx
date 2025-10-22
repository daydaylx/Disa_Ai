import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { BottomNavigation, LegalBottomNavigation } from "../components/layout/BottomNavigation";

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

describe("Bottom Navigation", () => {
  it("renders navigation items correctly", () => {
    render(
      <BrowserRouter>
        <BottomNavigation />
      </BrowserRouter>,
    );

    // Check if all nav items are present
    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Modelle")).toBeInTheDocument();
    expect(screen.getByText("Rollen")).toBeInTheDocument();
    expect(screen.getByText("Einstellungen")).toBeInTheDocument();
  });

  it("renders with correct styling", () => {
    render(
      <BrowserRouter>
        <BottomNavigation />
      </BrowserRouter>,
    );

    const navElement = screen.getByRole("navigation", { name: /Mobile Hauptnavigation/i });
    expect(navElement).toBeInTheDocument();
    expect(navElement).toHaveClass("sm:hidden"); // Should be hidden on larger screens
  });
});

describe("Legal Bottom Navigation", () => {
  it("renders legal items correctly", () => {
    render(
      <BrowserRouter>
        <LegalBottomNavigation />
      </BrowserRouter>,
    );

    // Check if legal items are present
    expect(screen.getByText("Impressum")).toBeInTheDocument();
    expect(screen.getByText("Datenschutz")).toBeInTheDocument();
  });

  it("renders with correct styling", () => {
    render(
      <BrowserRouter>
        <LegalBottomNavigation />
      </BrowserRouter>,
    );

    const navElement = screen.getByRole("navigation", { name: /Mobile Rechtsnavigation/i });
    expect(navElement).toBeInTheDocument();
    expect(navElement).toHaveClass("sm:hidden"); // Should be hidden on larger screens
  });
});
