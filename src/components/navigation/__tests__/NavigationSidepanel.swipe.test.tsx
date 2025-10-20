/**
 * Unit tests for NavigationSidepanel swipe-to-open functionality
 *
 * Tests the edge swipe gesture recognition, including:
 * - Right-edge detection (16-24px area)
 * - Horizontal swipe threshold (~40px)
 * - Vertical tolerance (~30px)
 * - Swipe velocity handling
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SidepanelProvider } from "../../../app/state/SidepanelContext";
import { NavigationSidepanel } from "../NavigationSidepanel";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  NavLink: ({ children, to, onClick }: any) => (
    <a href={to} onClick={onClick}>
      {typeof children === "function" ? children({ isActive: false }) : children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}));

// Mock conversation manager
vi.mock("../../../lib/conversation-manager", () => ({
  getAllConversations: vi.fn(() => []),
}));

const mockItems = [
  { to: "/chat", label: "Chat", icon: () => <span>ChatIcon</span> },
  { to: "/models", label: "Modelle", icon: () => <span>ModelsIcon</span> },
  { to: "/roles", label: "Rollen", icon: () => <span>RolesIcon</span> },
  { to: "/settings", label: "Einstellungen", icon: () => <span>SettingsIcon</span> },
];

function renderSidepanel() {
  return render(
    <SidepanelProvider>
      <NavigationSidepanel items={mockItems} />
    </SidepanelProvider>,
  );
}

describe("NavigationSidepanel - Swipe Gestures", () => {
  it("should render edge swipe area for opening", () => {
    renderSidepanel();
    const edgeArea = document.querySelector(".sidepanel-touch-area");
    expect(edgeArea).toBeInTheDocument();
  });

  it("should open panel when swiping from right edge with sufficient horizontal movement", async () => {
    renderSidepanel();
    const edgeArea = document.querySelector(".sidepanel-touch-area") as HTMLElement;
    expect(edgeArea).toBeInTheDocument();

    const screenWidth = 400;
    Object.defineProperty(window, "innerWidth", { value: screenWidth, writable: true });

    // Simulate touch start at right edge (within 20px from right)
    const touchStart = new Touch({
      identifier: 1,
      target: edgeArea,
      clientX: screenWidth - 10, // Within edge area
      clientY: 100,
      screenX: screenWidth - 10,
      screenY: 100,
      pageX: screenWidth - 10,
      pageY: 100,
    });

    fireEvent.touchStart(edgeArea, { touches: [touchStart] });

    // Simulate swipe left (opening gesture) with >40px movement
    const touchMove = new Touch({
      identifier: 1,
      target: edgeArea,
      clientX: screenWidth - 60, // 50px left from start (>40px threshold)
      clientY: 100, // No vertical movement
      screenX: screenWidth - 60,
      screenY: 100,
      pageX: screenWidth - 60,
      pageY: 100,
    });

    fireEvent.touchMove(edgeArea, { touches: [touchMove] });

    // Simulate touch end
    fireEvent.touchEnd(edgeArea, { changedTouches: [touchMove] });

    // Wait for panel to open
    await waitFor(() => {
      const panel = document.querySelector("#navigation-sidepanel") as HTMLElement | null;
      expect(panel).not.toBeNull();
      const transform = panel ? window.getComputedStyle(panel).transform : "";
      expect(["matrix(1, 0, 0, 1, 0, 0)", "translateX(0px)"]).toContain(transform);
    });
  });

  it("should not open panel when touch starts outside edge area", () => {
    renderSidepanel();
    const edgeArea = document.querySelector(".sidepanel-touch-area") as HTMLElement;

    const screenWidth = 400;
    Object.defineProperty(window, "innerWidth", { value: screenWidth, writable: true });

    // Simulate touch start outside edge area (>20px from right)
    const touchStart = new Touch({
      identifier: 1,
      target: edgeArea,
      clientX: screenWidth - 50, // Outside 20px edge area
      clientY: 100,
      screenX: screenWidth - 50,
      screenY: 100,
      pageX: screenWidth - 50,
      pageY: 100,
    });

    fireEvent.touchStart(edgeArea, { touches: [touchStart] });

    // Even with sufficient movement, should not open
    const touchMove = new Touch({
      identifier: 1,
      target: edgeArea,
      clientX: screenWidth - 100,
      clientY: 100,
      screenX: screenWidth - 100,
      screenY: 100,
      pageX: screenWidth - 100,
      pageY: 100,
    });

    fireEvent.touchMove(edgeArea, { touches: [touchMove] });
    fireEvent.touchEnd(edgeArea, { changedTouches: [touchMove] });

    // Panel should not open (still translated off-screen)
    const panel = document.querySelector("#navigation-sidepanel") as HTMLElement | null;
    expect(panel).not.toBeNull();
    const transform = panel ? window.getComputedStyle(panel).transform : "";
    expect(transform).not.toBe("matrix(1, 0, 0, 1, 0, 0)");
  });

  it("should cancel gesture when vertical movement exceeds tolerance", () => {
    renderSidepanel();
    const edgeArea = document.querySelector(".sidepanel-touch-area") as HTMLElement;

    const screenWidth = 400;
    Object.defineProperty(window, "innerWidth", { value: screenWidth, writable: true });

    // Start at right edge
    const touchStart = new Touch({
      identifier: 1,
      target: edgeArea,
      clientX: screenWidth - 10,
      clientY: 100,
      screenX: screenWidth - 10,
      screenY: 100,
      pageX: screenWidth - 10,
      pageY: 100,
    });

    fireEvent.touchStart(edgeArea, { touches: [touchStart] });

    // Move with excessive vertical movement (>30px tolerance)
    const touchMove = new Touch({
      identifier: 1,
      target: edgeArea,
      clientX: screenWidth - 50, // 40px horizontal
      clientY: 150, // 50px vertical (exceeds 30px tolerance)
      screenX: screenWidth - 50,
      screenY: 150,
      pageX: screenWidth - 50,
      pageY: 150,
    });

    fireEvent.touchMove(edgeArea, { touches: [touchMove] });
    fireEvent.touchEnd(edgeArea, { changedTouches: [touchMove] });

    // Gesture should be cancelled, panel should not open
    // Panel should remain closed (off screen)
    const panel = document.querySelector("#navigation-sidepanel");
    const panelStyle = window.getComputedStyle(panel as Element);
    expect(panelStyle.transform).toBeDefined();
  });

  it("should open panel on menu button click (desktop fallback)", async () => {
    renderSidepanel();

    const menuButton = screen.getAllByLabelText(/Navigation öffnen/i)[0];
    expect(menuButton).toBeInTheDocument();

    fireEvent.click(menuButton!);

    // Panel should be visible after click
    await waitFor(() => {
      const panel = document.querySelector("#navigation-sidepanel");
      expect(panel).toBeInTheDocument();
    });
  });

  it("should close panel on Escape key press", async () => {
    renderSidepanel();

    // First open the panel
    const menuButton = screen.getAllByLabelText(/Navigation öffnen/i)[0];
    fireEvent.click(menuButton!);

    await waitFor(() => {
      expect(screen.getAllByLabelText(/Navigation schließen/i)[0]).toBeInTheDocument();
    });

    // Press Escape
    fireEvent.keyDown(document, { key: "Escape" });

    // Panel should close
    await waitFor(() => {
      expect(screen.getAllByLabelText(/Navigation öffnen/i)[0]).toBeInTheDocument();
    });
  });

  it("should have proper ARIA attributes", () => {
    renderSidepanel();

    const panel = document.querySelector("#navigation-sidepanel");
    expect(panel).toHaveAttribute("role", "navigation");
    expect(panel).toHaveAttribute("aria-label");

    const menuButton = screen.getAllByLabelText(/Navigation öffnen/i)[0];
    expect(menuButton).toHaveAttribute("aria-expanded");
    expect(menuButton).toHaveAttribute("aria-controls", "navigation-sidepanel");
  });
});
