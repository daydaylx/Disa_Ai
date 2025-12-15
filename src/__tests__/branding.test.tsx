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
    expect(container.querySelector(".presence-mark")).toBeInTheDocument();

    // Ensure no separators are present
    expect(container.textContent?.includes("|")).toBe(false);
    expect(container.textContent?.includes("▮")).toBe(false);
  });
});
