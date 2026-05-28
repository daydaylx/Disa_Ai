import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnimatedBrandmark } from "../AnimatedBrandmark";

describe("AnimatedBrandmark", () => {
  it("applies mode and intensity data attributes", () => {
    const { container } = render(
      <AnimatedBrandmark intensity="accent" mode="hero" playIntro={false} />,
    );
    const root = container.querySelector(".brandmark-motion");
    expect(root).toHaveAttribute("data-intensity", "accent");
    expect(root).toHaveAttribute("data-mode", "hero");
    expect(container.querySelector('[data-layer="halo-ring"]')).toBeInTheDocument();
  });

  it("keeps text visible without intro animation when playIntro is false", () => {
    const { container } = render(<AnimatedBrandmark playIntro={false} />);
    const introAnimatedElements = container.querySelectorAll(
      ".animate-word-reveal, .animate-word-reveal-delayed",
    );
    expect(introAnimatedElements.length).toBe(0);
  });

  it("does not gate hero motion behind unreachable responsive breakpoints", () => {
    const { container } = render(<AnimatedBrandmark mode="hero" />);
    const title = container.querySelector("h1");
    const subtitle = container.querySelector("p");
    const root = container.querySelector(".brandmark-motion");

    expect(root?.className).not.toContain("hidden");
    expect(title?.className).toContain("motion-safe:animate-brand-breathe");
    expect(title?.className).not.toContain("sm:motion-safe:animate-brand-breathe");
    expect(subtitle?.className).toContain("animate-wordmark-intro");
  });
});
