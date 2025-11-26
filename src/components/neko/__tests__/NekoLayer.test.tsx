import { render, screen } from "@testing-library/react";
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
    // Cleanup body before each test to avoid portal artifacts
    document.body.innerHTML = "";
  });

  describe("Rendering Conditions", () => {
    it("should NOT render when enableNeko is false", () => {
      mockSettings.enableNeko = false;
      mockNekoStatus.state = "WALKING"; // Even if walking

      render(<NekoLayer />);

      expect(screen.queryByTestId("neko-container")).toBeNull();
    });

    it("should NOT render when state is HIDDEN", () => {
      mockSettings.enableNeko = true;
      mockNekoStatus.state = "HIDDEN";

      render(<NekoLayer />);

      expect(screen.queryByTestId("neko-container")).toBeNull();
    });

    it("should render when enableNeko is true and state is not HIDDEN", () => {
      mockSettings.enableNeko = true;
      mockNekoStatus.state = "WALKING";

      render(<NekoLayer />);

      expect(screen.getByTestId("neko-container")).toBeInTheDocument();
      expect(screen.getByTestId("neko-sprite")).toBeInTheDocument();
    });
  });

  describe("Container Styling", () => {
    it("should have correct container classes for mobile visibility", () => {
      mockNekoStatus.state = "WALKING";

      render(<NekoLayer />);

      const nekoContainer = screen.getByTestId("neko-container");
      expect(nekoContainer).toHaveClass("fixed");
      expect(nekoContainer).toHaveClass("bottom-0");
      expect(nekoContainer).toHaveClass("h-32");
      expect(nekoContainer).toHaveClass("pointer-events-none");
      expect(nekoContainer).toHaveClass("z-toast");
    });

    it("should apply correct transform based on x position", () => {
      mockNekoStatus.state = "WALKING";
      mockNekoStatus.x = 50;

      render(<NekoLayer />);

      // The inner div handles the transform
      // We can find it by looking for the direct child of container that wraps sprite
      // Or querySelector inside container
      const nekoContainer = screen.getByTestId("neko-container");
      const nekoInner = nekoContainer.querySelector(".absolute");
      expect(nekoInner).toHaveStyle({ transform: "translate3d(50vw, 0, 0)" });
    });
  });

  describe("Safe Area Support", () => {
    it("should include safe-area margin bottom", () => {
      mockNekoStatus.state = "WALKING";

      render(<NekoLayer />);

      const safeAreaDiv = screen.getByTestId("neko-container").querySelector(".mb-safe-bottom");
      expect(safeAreaDiv).toBeInTheDocument();
      expect(safeAreaDiv).toHaveClass("pb-2");
    });
  });

  describe("Accessibility", () => {
    it("should have aria-hidden attribute (decorative)", () => {
      mockNekoStatus.state = "WALKING";

      render(<NekoLayer />);

      const nekoContainer = screen.getByTestId("neko-container");
      expect(nekoContainer).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Portal Rendering", () => {
    it("should render into document.body via portal", () => {
      mockNekoStatus.state = "WALKING";

      render(<NekoLayer />);

      const nekoInBody = document.body.querySelector('[data-testid="neko-container"]');
      expect(nekoInBody).toBeInTheDocument();
    });
  });
});
