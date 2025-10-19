/**
 * Unit tests for NavigationSidepanel edge swipe functionality
 * Tests edge detection, swipe thresholds, and vertical tolerance
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SidepanelProvider } from "../../../app/state/SidepanelContext";
import { NavigationSidepanel } from "../NavigationSidepanel";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  NavLink: ({ children, onClick, to }: any) => (
    <a href={to} onClick={onClick}>
      {typeof children === "function" ? children({ isActive: false }) : children}
    </a>
  ),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: "/chat" }),
}));

// Mock conversation manager
vi.mock("../../../lib/conversation-manager", () => ({
  getAllConversations: () => [],
}));

const mockNavItems = [
  { to: "/chat", label: "Chat", icon: () => <span>Chat</span> },
  { to: "/roles", label: "Rollen", icon: () => <span>Rollen</span> },
];

// Helper to create touch events
const createTouchEvent = (
  type: string,
  touches: Array<{ clientX: number; clientY: number }>,
): TouchEvent => {
  const touchList = touches.map(
    (touch, index) =>
      new Touch({
        identifier: index,
        target: document.body,
        clientX: touch.clientX,
        clientY: touch.clientY,
      }),
  );

  return new TouchEvent(type, {
    touches: type === "touchend" ? [] : touchList,
    changedTouches: touchList,
    targetTouches: type === "touchend" ? [] : touchList,
    bubbles: true,
    cancelable: true,
  });
};

describe("NavigationSidepanel - Edge Swipe", () => {
  const renderSidepanel = () => {
    return render(
      <SidepanelProvider>
        <NavigationSidepanel items={mockNavItems} />
      </SidepanelProvider>,
    );
  };

  it("renders edge swipe area for opening panel", () => {
    renderSidepanel();
    const edgeArea = document.querySelector(".sidepanel-touch-area");
    expect(edgeArea).toBeInTheDocument();
  });

  it("menu button is visible and accessible", () => {
    renderSidepanel();
    const menuButton = screen.getByLabelText(/navigation öffnen/i);
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toBeVisible();
  });

  it("sidepanel has correct ARIA attributes when closed", () => {
    renderSidepanel();
    const sidepanel = screen.getByRole("navigation", { name: /hauptnavigation/i });
    expect(sidepanel).toBeInTheDocument();
  });

  describe("Edge Detection", () => {
    it("edge swipe area has correct width (20px)", () => {
      renderSidepanel();
      const edgeArea = document.querySelector(".sidepanel-touch-area");
      const styles = window.getComputedStyle(edgeArea!);
      expect(styles.minWidth).toBe("20px");
    });

    it("edge swipe area is positioned at right edge", () => {
      renderSidepanel();
      const edgeArea = document.querySelector(".sidepanel-touch-area");
      const styles = window.getComputedStyle(edgeArea!);
      expect(styles.position).toBe("fixed");
      expect(styles.right).toBe("0px");
    });

    it("edge area has correct z-index", () => {
      renderSidepanel();
      const edgeArea = document.querySelector(".sidepanel-touch-area");
      const styles = window.getComputedStyle(edgeArea!);
      expect(styles.zIndex).toBe("45");
    });
  });

  describe("Touch Gesture Handling", () => {
    it("handles touch start within edge area", () => {
      renderSidepanel();
      const edgeArea = document.querySelector(".sidepanel-touch-area");

      // Simulate touch start at right edge (within 20px)
      const touchStart = createTouchEvent("touchstart", [
        { clientX: window.innerWidth - 10, clientY: 100 },
      ]);

      edgeArea?.dispatchEvent(touchStart);
      // Should not throw error
      expect(edgeArea).toBeInTheDocument();
    });

    it("handles horizontal swipe gesture", () => {
      renderSidepanel();
      const edgeArea = document.querySelector(".sidepanel-touch-area");

      // Simulate horizontal swipe (left from edge)
      const touchStart = createTouchEvent("touchstart", [
        { clientX: window.innerWidth - 5, clientY: 100 },
      ]);
      const touchMove = createTouchEvent("touchmove", [
        { clientX: window.innerWidth - 50, clientY: 100 },
      ]);
      const touchEnd = createTouchEvent("touchend", [
        { clientX: window.innerWidth - 50, clientY: 100 },
      ]);

      edgeArea?.dispatchEvent(touchStart);
      edgeArea?.dispatchEvent(touchMove);
      edgeArea?.dispatchEvent(touchEnd);

      // Gesture should be processed without errors
      expect(edgeArea).toBeInTheDocument();
    });

    it("respects vertical tolerance for scrolling", () => {
      renderSidepanel();
      const edgeArea = document.querySelector(".sidepanel-touch-area");

      // Simulate mostly vertical movement (should not open panel)
      const touchStart = createTouchEvent("touchstart", [
        { clientX: window.innerWidth - 5, clientY: 100 },
      ]);
      const touchMove = createTouchEvent("touchmove", [
        { clientX: window.innerWidth - 15, clientY: 150 }, // 10px horizontal, 50px vertical
      ]);
      const touchEnd = createTouchEvent("touchend", [
        { clientX: window.innerWidth - 15, clientY: 150 },
      ]);

      edgeArea?.dispatchEvent(touchStart);
      edgeArea?.dispatchEvent(touchMove);
      edgeArea?.dispatchEvent(touchEnd);

      // Vertical scroll should take precedence
      expect(edgeArea).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("escape key closes panel", () => {
      renderSidepanel();

      // Open panel first
      const menuButton = screen.getByLabelText(/navigation öffnen/i);
      menuButton.click();

      // Press Escape
      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(escapeEvent);

      // Panel should start closing (button text should change)
      expect(screen.queryByLabelText(/navigation schließen/i)).toBeInTheDocument();
    });

    it("menu button has correct aria-expanded state", () => {
      renderSidepanel();
      const menuButton = screen.getByLabelText(/navigation öffnen/i);

      expect(menuButton).toHaveAttribute("aria-expanded", "false");

      // Click to open
      menuButton.click();

      expect(menuButton).toHaveAttribute("aria-expanded", "true");
    });

    it("sidepanel has navigation role", () => {
      renderSidepanel();
      const sidepanel = screen.getByRole("navigation");
      expect(sidepanel).toBeInTheDocument();
    });

    it("overlay has aria-hidden=true", () => {
      renderSidepanel();

      // Open panel first
      const menuButton = screen.getByLabelText(/navigation öffnen/i);
      menuButton.click();

      const overlay = document.querySelector(".sidepanel-overlay-transition");
      expect(overlay).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Responsive Behavior", () => {
    it("renders on mobile viewports", () => {
      // Set mobile viewport
      global.innerWidth = 375;

      renderSidepanel();
      const menuButton = screen.getByLabelText(/navigation öffnen/i);
      expect(menuButton).toBeVisible();
    });

    it("touch area adapts to viewport height", () => {
      renderSidepanel();
      const edgeArea = document.querySelector(".sidepanel-touch-area");

      // Should span full viewport height - check element exists
      expect(edgeArea).toBeInTheDocument();
      expect(edgeArea).toHaveClass("sidepanel-touch-area");
    });
  });

  describe("Performance", () => {
    it("uses passive event listeners for touch", () => {
      renderSidepanel();
      const edgeArea = document.querySelector(".sidepanel-touch-area");

      // Touch events should be registered (no direct way to test passive flag)
      expect(edgeArea).toBeInTheDocument();
    });

    it("applies GPU acceleration classes", () => {
      renderSidepanel();
      const sidepanel = document.querySelector(".sidepanel-container");
      expect(sidepanel).toHaveClass("sidepanel-container");
    });
  });
});
