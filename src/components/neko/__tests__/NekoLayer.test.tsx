import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { NekoLayer } from "../NekoLayer";

// Mock dependencies
interface MockNekoStatus {
  state: "HIDDEN" | "SPAWNING" | "WALKING" | "FLEEING";
  x: number;
  direction: "left" | "right";
}

const mockNekoStatus: MockNekoStatus = {
  state: "HIDDEN",
  x: -10,
  direction: "right",
};

vi.mock("@/hooks/useNeko", () => ({
  useNeko: () => mockNekoStatus,
}));

const mockSettings = {
  enableNeko: true,
};

vi.mock("@/hooks/useSettings", () => ({
  useSettings: () => ({
    settings: mockSettings,
  }),
}));

// Mock NekoSprite to avoid SVG complexities
vi.mock("../NekoSprite", () => ({
  NekoSprite: ({ state, direction }: { state: string; direction: string }) => (
    <div data-testid="neko-sprite" data-state={state} data-direction={direction}>
      Neko Cat
    </div>
  ),
}));

describe("NekoLayer Component", () => {
  beforeEach(() => {
    mockSettings.enableNeko = true;
    mockNekoStatus.state = "HIDDEN";
    mockNekoStatus.x = -10;
    mockNekoStatus.direction = "right";
  });

  describe("Rendering Conditions", () => {
    it("should NOT render when enableNeko is false", () => {
      mockSettings.enableNeko = false;

      const { container } = render(<NekoLayer />);

      expect(container.firstChild).toBeNull();
    });

    it("should NOT render when state is HIDDEN", () => {
      mockSettings.enableNeko = true;
      mockNekoStatus.state = "HIDDEN";

      const { container } = render(<NekoLayer />);

      expect(container.firstChild).toBeNull();
    });

    it("should render when enableNeko is true and state is not HIDDEN", () => {
      mockSettings.enableNeko = true;
      mockNekoStatus.state = "WALKING";

      const { getByTestId } = render(<NekoLayer />);

      expect(getByTestId("neko-sprite")).toBeInTheDocument();
    });
  });

  describe("Container Styling", () => {
    it("should have correct container classes for mobile visibility", () => {
      mockNekoStatus.state = "WALKING";

      const { container } = render(<NekoLayer />);

      const nekoContainer = container.querySelector('[aria-hidden="true"]');
      expect(nekoContainer).toHaveClass("fixed");
      expect(nekoContainer).toHaveClass("bottom-0");
      expect(nekoContainer).toHaveClass("left-0");
      expect(nekoContainer).toHaveClass("right-0");
      expect(nekoContainer).toHaveClass("h-40"); // Increased height for mobile
      expect(nekoContainer).toHaveClass("pointer-events-none");
      expect(nekoContainer).toHaveClass("z-toast");
      expect(nekoContainer).toHaveClass("overflow-hidden");
    });

    it("should apply correct transform based on x position", () => {
      mockNekoStatus.state = "WALKING";
      mockNekoStatus.x = 50; // Mid-screen

      const { container } = render(<NekoLayer />);

      const nekoInner = container.querySelector(".absolute");
      expect(nekoInner).toHaveStyle({ transform: "translate3d(50vw, 0, 0)" });
    });

    it("should update transform when x position changes", () => {
      mockNekoStatus.state = "WALKING";
      mockNekoStatus.x = 0;

      const { container, rerender } = render(<NekoLayer />);

      let nekoInner = container.querySelector(".absolute");
      expect(nekoInner).toHaveStyle({ transform: "translate3d(0vw, 0, 0)" });

      // Update position
      mockNekoStatus.x = 100;
      rerender(<NekoLayer />);

      nekoInner = container.querySelector(".absolute");
      expect(nekoInner).toHaveStyle({ transform: "translate3d(100vw, 0, 0)" });
    });
  });

  describe("Safe Area Support", () => {
    it("should include safe-area margin bottom", () => {
      mockNekoStatus.state = "WALKING";

      const { container } = render(<NekoLayer />);

      const safeAreaDiv = container.querySelector(".mb-safe-bottom");
      expect(safeAreaDiv).toBeInTheDocument();
      expect(safeAreaDiv).toHaveClass("pb-2");
    });
  });

  describe("Accessibility", () => {
    it("should have aria-hidden attribute (decorative)", () => {
      mockNekoStatus.state = "WALKING";

      const { container } = render(<NekoLayer />);

      const nekoContainer = container.querySelector('[aria-hidden="true"]');
      expect(nekoContainer).toBeInTheDocument();
    });

    it("should not interfere with pointer events", () => {
      mockNekoStatus.state = "WALKING";

      const { container } = render(<NekoLayer />);

      const nekoContainer = container.querySelector(".pointer-events-none");
      expect(nekoContainer).toBeInTheDocument();
    });
  });

  describe("Portal Rendering", () => {
    it("should render into document.body via portal", () => {
      mockNekoStatus.state = "WALKING";

      render(<NekoLayer />);

      // Check that neko is rendered directly in body (via portal)
      const nekoInBody = document.body.querySelector('[aria-hidden="true"]');
      expect(nekoInBody).toBeInTheDocument();
      expect(nekoInBody).toHaveClass("fixed");
    });
  });

  describe("Different States", () => {
    it("should render with SPAWNING state", () => {
      mockNekoStatus.state = "SPAWNING";

      const { getByTestId } = render(<NekoLayer />);

      const sprite = getByTestId("neko-sprite");
      expect(sprite).toHaveAttribute("data-state", "SPAWNING");
    });

    it("should render with WALKING state", () => {
      mockNekoStatus.state = "WALKING";

      const { getByTestId } = render(<NekoLayer />);

      const sprite = getByTestId("neko-sprite");
      expect(sprite).toHaveAttribute("data-state", "WALKING");
    });

    it("should render with FLEEING state", () => {
      mockNekoStatus.state = "FLEEING";

      const { getByTestId } = render(<NekoLayer />);

      const sprite = getByTestId("neko-sprite");
      expect(sprite).toHaveAttribute("data-state", "FLEEING");
    });
  });

  describe("Direction Handling", () => {
    it("should pass left direction to NekoSprite", () => {
      mockNekoStatus.state = "WALKING";
      mockNekoStatus.direction = "left";

      const { getByTestId } = render(<NekoLayer />);

      const sprite = getByTestId("neko-sprite");
      expect(sprite).toHaveAttribute("data-direction", "left");
    });

    it("should pass right direction to NekoSprite", () => {
      mockNekoStatus.state = "WALKING";
      mockNekoStatus.direction = "right";

      const { getByTestId } = render(<NekoLayer />);

      const sprite = getByTestId("neko-sprite");
      expect(sprite).toHaveAttribute("data-direction", "right");
    });
  });
});
