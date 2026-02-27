import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandWordmark } from "../app/components/BrandWordmark";

describe("BrandWordmark", () => {
  it("renders consistent brand markup without separators", () => {
    const { container, getByTestId } = render(<BrandWordmark />);

    // Check that the logo contains all letters (may be split into spans for animation)
    expect(container.textContent).toContain("D");
    expect(container.textContent).toContain("i");
    expect(container.textContent).toContain("s");
    expect(container.textContent).toContain("a");
    expect(container.textContent).toContain("A");
    expect(container.textContent).toContain("I");

    // Check for animated logo with presence mark
    expect(getByTestId("animated-logo")).toBeInTheDocument();
    const presenceMark = container.querySelector(".presence-mark");
    expect(presenceMark).toBeInTheDocument();
    expect(presenceMark).toHaveAttribute("data-intensity", "subtle");
    expect(presenceMark).toHaveAttribute("data-mode", "header");
    expect(container.querySelector(".presence-mark__core")).toBeInTheDocument();
    expect(container.querySelector(".presence-mark__halo")).toBeInTheDocument();

    // Ensure no separators are present
    expect(container.textContent?.includes("|")).toBe(false);
    expect(container.textContent?.includes("▮")).toBe(false);
  });

  it("forwards state and motion props to presence mark", () => {
    const { container } = render(
      <BrandWordmark intensity="accent" motionMode="hero" state="thinking" />,
    );
    const presenceMark = container.querySelector(".presence-mark");
    expect(presenceMark).toHaveAttribute("data-intensity", "accent");
    expect(presenceMark).toHaveAttribute("data-mode", "hero");
    expect(presenceMark).toHaveAttribute("data-state", "thinking");
  });
});
