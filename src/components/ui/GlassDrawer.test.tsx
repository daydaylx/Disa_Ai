/**
 * Test Scenario: GlassDrawer Component
 *
 * Target: Android Chrome, Small Viewport (390x844)
 * Tests: Backdrop close, ESC key, accessibility
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ExampleGlassDrawer, GlassDrawer } from "./GlassDrawer";

// Mock for body style changes
const mockBodyStyle = {
  overflow: "",
};

Object.defineProperty(document, "body", {
  value: {
    style: mockBodyStyle,
  },
  writable: true,
});

describe("GlassDrawer", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockBodyStyle.overflow = "";
  });

  afterEach(() => {
    // Reset body style after each test
    document.body.style.overflow = "";
  });

  describe("Basic Functionality", () => {
    it("renders when open", () => {
      render(
        <GlassDrawer open={true} onClose={mockOnClose}>
          <div>Test content</div>
        </GlassDrawer>,
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("does not render when closed", () => {
      render(
        <GlassDrawer open={false} onClose={mockOnClose}>
          <div>Test content</div>
        </GlassDrawer>,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("has correct ARIA attributes", () => {
      render(
        <GlassDrawer open={true} onClose={mockOnClose}>
          <div>Content</div>
        </GlassDrawer>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-label", "Navigation drawer");
    });
  });

  describe("Body Scroll Lock", () => {
    it("locks body scroll when open", () => {
      render(
        <GlassDrawer open={true} onClose={mockOnClose}>
          <div>Content</div>
        </GlassDrawer>,
      );

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("restores body scroll when closed", () => {
      const { rerender } = render(
        <GlassDrawer open={true} onClose={mockOnClose}>
          <div>Content</div>
        </GlassDrawer>,
      );

      expect(document.body.style.overflow).toBe("hidden");

      rerender(
        <GlassDrawer open={false} onClose={mockOnClose}>
          <div>Content</div>
        </GlassDrawer>,
      );

      expect(document.body.style.overflow).toBe("");
    });
  });

  describe("Close Interactions", () => {
    it("closes on backdrop click", () => {
      render(
        <GlassDrawer open={true} onClose={mockOnClose}>
          <div>Content</div>
        </GlassDrawer>,
      );

      const backdrop = screen.getByRole("dialog").querySelector('[aria-hidden="true"]');
      fireEvent.click(backdrop!);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("closes on ESC key press", () => {
      render(
        <GlassDrawer open={true} onClose={mockOnClose}>
          <div>Content</div>
        </GlassDrawer>,
      );

      fireEvent.keyDown(document, { key: "Escape" });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("does not close on content click", () => {
      render(
        <GlassDrawer open={true} onClose={mockOnClose}>
          <div data-testid="content">Content</div>
        </GlassDrawer>,
      );

      fireEvent.click(screen.getByTestId("content"));

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("Styling and Performance", () => {
    it("has correct glass surface classes", () => {
      render(
        <GlassDrawer open={true} onClose={mockOnClose}>
          <div>Content</div>
        </GlassDrawer>,
      );

      const drawer = screen.getByRole("navigation");

      // Check glass surface styling
      expect(drawer).toHaveClass("bg-neutral-900/70");
      expect(drawer).toHaveClass("backdrop-blur-md");
      expect(drawer).toHaveClass("border-white/10");
      expect(drawer).toHaveClass("shadow-xl");
      expect(drawer).toHaveClass("rounded-2xl");
    });

    it("has correct sizing and positioning", () => {
      render(
        <GlassDrawer open={true} onClose={mockOnClose}>
          <div>Content</div>
        </GlassDrawer>,
      );

      const drawer = screen.getByRole("navigation");

      expect(drawer).toHaveClass("w-[88vw]");
      expect(drawer).toHaveClass("max-h-[85dvh]");
      expect(drawer).toHaveClass("fixed", "right-0");
    });

    it("includes motion-reduce preferences", () => {
      render(
        <GlassDrawer open={true} onClose={mockOnClose}>
          <div>Content</div>
        </GlassDrawer>,
      );

      const container = screen.getByRole("dialog");
      const backdrop = container.querySelector('[aria-hidden="true"]');
      const drawer = screen.getByRole("navigation");

      expect(backdrop).toHaveClass("motion-reduce:transition-none");
      expect(drawer).toHaveClass("motion-reduce:backdrop-blur-none");
      expect(drawer).toHaveClass("motion-reduce:transition-none");
    });
  });

  describe("Category Tiles", () => {
    it("renders example drawer with category tiles", () => {
      render(<ExampleGlassDrawer open={true} onClose={mockOnClose} />);

      expect(screen.getByText("Kategorien")).toBeInTheDocument();
      expect(screen.getByText("Technologie")).toBeInTheDocument();
      expect(screen.getByText("Design")).toBeInTheDocument();
      expect(screen.getByText("Business")).toBeInTheDocument();
      expect(screen.getByText("Lifestyle")).toBeInTheDocument();
    });

    it("has close button in header", () => {
      render(<ExampleGlassDrawer open={true} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText("Drawer schließen");
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("category tiles have correct accent classes", () => {
      render(<ExampleGlassDrawer open={true} onClose={mockOnClose} />);

      const techButton = screen.getByText("Technologie").closest("button");
      const designButton = screen.getByText("Design").closest("button");
      const businessButton = screen.getByText("Business").closest("button");
      const lifestyleButton = screen.getByText("Lifestyle").closest("button");

      expect(techButton).toHaveClass("bg-sky-400/10");
      expect(designButton).toHaveClass("bg-violet-400/10");
      expect(businessButton).toHaveClass("bg-emerald-400/10");
      expect(lifestyleButton).toHaveClass("bg-amber-400/10");
    });
  });

  describe("Mobile Accessibility (Android Chrome)", () => {
    it("has proper touch targets", () => {
      render(<ExampleGlassDrawer open={true} onClose={mockOnClose} />);

      const categoryButtons = screen
        .getAllByRole("button")
        .filter(
          (btn) =>
            btn.textContent?.includes("Technologie") ||
            btn.textContent?.includes("Design") ||
            btn.textContent?.includes("Business") ||
            btn.textContent?.includes("Lifestyle"),
        );

      categoryButtons.forEach((button) => {
        expect(button).toHaveClass("p-4"); // Adequate touch target
      });
    });

    it("handles focus management", () => {
      render(<ExampleGlassDrawer open={true} onClose={mockOnClose} />);

      const firstButton = screen.getByText("Technologie").closest("button");
      expect(firstButton).toHaveAttribute("tabIndex", "0");
      expect(firstButton).toHaveClass("focus-visible:outline-none");
      expect(firstButton).toHaveClass("focus-visible:ring-2");
    });

    it("provides adequate text contrast", () => {
      render(<ExampleGlassDrawer open={true} onClose={mockOnClose} />);

      const drawer = screen.getByRole("navigation");
      expect(drawer).toHaveClass("text-neutral-100"); // High contrast on dark background

      const categoryTitle = screen.getByText("Technologie");
      expect(categoryTitle).toHaveClass("text-neutral-100"); // AA compliant
    });
  });
});

// Performance Test Helpers
export const performanceTests = {
  // Test backdrop blur performance
  testBackdropBlur: () => {
    const start = performance.now();
    const element = document.createElement("div");
    element.className = "backdrop-blur-md";
    document.body.appendChild(element);
    const end = performance.now();
    document.body.removeChild(element);
    return end - start;
  },

  // Test animation performance
  testAnimation: () => {
    const start = performance.now();
    const element = document.createElement("div");
    element.className = "transition-transform duration-180 ease-out";
    element.style.transform = "translateX(0)";
    document.body.appendChild(element);

    // Trigger animation
    requestAnimationFrame(() => {
      element.style.transform = "translateX(100px)";
    });

    const end = performance.now();
    document.body.removeChild(element);
    return end - start;
  },
};

/**
 * Manual Test Checklist for Android Chrome:
 *
 * 1. Open drawer on small viewport (390x844)
 * 2. Verify glass surface renders correctly
 * 3. Test backdrop click to close
 * 4. Test ESC key to close
 * 5. Test category tile interactions
 * 6. Verify smooth animations (180ms ease-out)
 * 7. Check text contrast (AA compliance)
 * 8. Test touch targets (min 44px)
 * 9. Verify body scroll lock
 * 10. Test reduced motion preferences
 */
