import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NekoSprite } from "../NekoSprite";

describe("NekoSprite Component", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="right" />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should contain SVG element", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="right" />);

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("viewBox", "0 0 32 32");
    });
  });

  describe("Responsive Sizing", () => {
    it("should have responsive width and height classes", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="right" />);

      const spriteDiv = container.firstChild as HTMLElement;
      expect(spriteDiv).toHaveClass("w-12"); // Mobile: 48px
      expect(spriteDiv).toHaveClass("h-12");
      expect(spriteDiv).toHaveClass("md:w-16"); // Tablet/Desktop: 64px
      expect(spriteDiv).toHaveClass("md:h-16");
    });

    it("should have transition classes for smooth animations", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="right" />);

      const spriteDiv = container.firstChild as HTMLElement;
      expect(spriteDiv).toHaveClass("transition-transform");
      expect(spriteDiv).toHaveClass("duration-100");
      expect(spriteDiv).toHaveClass("relative");
    });
  });

  describe("Direction Handling", () => {
    it("should NOT mirror when direction is right", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="right" />);

      const spriteDiv = container.firstChild as HTMLElement;
      expect(spriteDiv).not.toHaveClass("scale-x-[-1]");
    });

    it("should mirror (scale-x) when direction is left", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="left" />);

      const spriteDiv = container.firstChild as HTMLElement;
      expect(spriteDiv).toHaveClass("scale-x-[-1]");
    });
  });

  describe("Animation States", () => {
    it("should apply walk animation when state is WALKING", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="right" />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("animate-neko-walk");
      expect(svg).not.toHaveClass("animate-neko-run");
    });

    it("should apply run animation when state is FLEEING", () => {
      const { container } = render(<NekoSprite state="FLEEING" direction="right" />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("animate-neko-run");
      expect(svg).not.toHaveClass("animate-neko-walk");
    });

    it("should NOT apply animations when state is IDLE", () => {
      const { container } = render(<NekoSprite state="IDLE" direction="right" />);

      const svg = container.querySelector("svg");
      expect(svg).not.toHaveClass("animate-neko-walk");
      expect(svg).not.toHaveClass("animate-neko-run");
    });

    it("should NOT apply animations when state is HIDDEN", () => {
      const { container } = render(<NekoSprite state="HIDDEN" direction="right" />);

      const svg = container.querySelector("svg");
      expect(svg).not.toHaveClass("animate-neko-walk");
      expect(svg).not.toHaveClass("animate-neko-run");
    });

    it("should NOT apply animations when state is SPAWNING", () => {
      const { container } = render(<NekoSprite state="SPAWNING" direction="right" />);

      const svg = container.querySelector("svg");
      expect(svg).not.toHaveClass("animate-neko-walk");
      expect(svg).not.toHaveClass("animate-neko-run");
    });
  });

  describe("SVG Styling", () => {
    it("should have pixelated image rendering", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="right" />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveStyle({ imageRendering: "pixelated" });
    });

    it("should have drop-shadow effect", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="right" />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("drop-shadow-md");
    });

    it("should fill full container size", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="right" />);

      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("w-full");
      expect(svg).toHaveClass("h-full");
    });
  });

  describe("SVG Elements", () => {
    it("should contain cat body parts (paths)", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="right" />);

      const paths = container.querySelectorAll("path");
      // Body, Head, Ears, Tail = multiple paths
      expect(paths.length).toBeGreaterThan(0);
    });

    it("should contain eyes (rects with amber color)", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="right" />);

      const eyes = container.querySelectorAll("rect.fill-amber-400");
      expect(eyes.length).toBe(2); // Two eyes
    });

    it("should have dark/light mode support (fill-neutral-900 dark:fill-neutral-100)", () => {
      const { container } = render(<NekoSprite state="WALKING" direction="right" />);

      const bodyParts = container.querySelectorAll(".fill-neutral-900");
      expect(bodyParts.length).toBeGreaterThan(0);
    });
  });

  describe("State Transitions", () => {
    it("should update animation class when state changes from WALKING to FLEEING", () => {
      const { container, rerender } = render(<NekoSprite state="WALKING" direction="right" />);

      let svg = container.querySelector("svg");
      expect(svg).toHaveClass("animate-neko-walk");

      rerender(<NekoSprite state="FLEEING" direction="right" />);

      svg = container.querySelector("svg");
      expect(svg).toHaveClass("animate-neko-run");
      expect(svg).not.toHaveClass("animate-neko-walk");
    });

    it("should update direction mirror when direction changes", () => {
      const { container, rerender } = render(<NekoSprite state="WALKING" direction="right" />);

      let spriteDiv = container.firstChild as HTMLElement;
      expect(spriteDiv).not.toHaveClass("scale-x-[-1]");

      rerender(<NekoSprite state="WALKING" direction="left" />);

      spriteDiv = container.firstChild as HTMLElement;
      expect(spriteDiv).toHaveClass("scale-x-[-1]");
    });
  });
});
