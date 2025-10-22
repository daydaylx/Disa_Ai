import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { BurgerMenu } from "../components/layout/BurgerMenu";

// Mock document.body.style.overflow
Object.defineProperty(document.body.style, "overflow", {
  writable: true,
  value: "",
});

// Mock focus functionality
const mockFocus = vi.fn();
const originalFocus = HTMLElement.prototype.focus;
HTMLElement.prototype.focus = function () {
  mockFocus();
  originalFocus.call(this);
};

describe("Burger Menu", () => {
  it("renders burger menu button", () => {
    render(
      <BrowserRouter>
        <BurgerMenu />
      </BrowserRouter>,
    );

    const menuButton = screen.getByLabelText(/Menü öffnen/i);
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles menu when clicked", () => {
    render(
      <BrowserRouter>
        <BurgerMenu />
      </BrowserRouter>,
    );

    const menuButton = screen.getByLabelText(/Menü öffnen/i);
    fireEvent.click(menuButton);

    // Check if aria-expanded is updated
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
  });

  it("renders menu items when opened", () => {
    render(
      <BrowserRouter>
        <BurgerMenu />
      </BrowserRouter>,
    );

    const menuButton = screen.getByLabelText(/Menü öffnen/i);
    fireEvent.click(menuButton);

    // Check if menu items are present after opening
    expect(screen.getByText("Impressum")).toBeInTheDocument();
    expect(screen.getByText("Datenschutz")).toBeInTheDocument();
  });
});
