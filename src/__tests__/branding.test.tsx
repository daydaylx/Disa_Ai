import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandWordmark } from "../app/components/BrandWordmark";

describe("BrandWordmark", () => {
  it("renders consistent brand markup without separators", () => {
    const { container } = render(<BrandWordmark />);

    // Check that the logo contains all letters (may be split into spans for animation)
    expect(container.textContent).toContain("D");
    expect(container.textContent).toContain("i");
    expect(container.textContent).toContain("s");
    expect(container.textContent).toContain("a");
    expect(container.textContent).toContain("A");
    expect(container.textContent).toContain("I");

    // Check for logo animation classes
    expect(container.querySelector(".logo-animated")).toBeInTheDocument();
    expect(container.querySelector(".logo-ai-part")).toBeInTheDocument();

    // Ensure no separators are present
    expect(container.textContent?.includes("|")).toBe(false);
    expect(container.textContent?.includes("▮")).toBe(false);
  });
});
