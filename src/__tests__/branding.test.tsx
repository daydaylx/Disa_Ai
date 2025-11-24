import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandWordmark } from "../app/components/BrandWordmark";

describe("BrandWordmark", () => {
  it("renders consistent brand markup without separators", () => {
    const { container } = render(<BrandWordmark />);

    expect(screen.getByText(/Disa/)).toBeInTheDocument();
    expect(container.firstChild).toMatchInlineSnapshot(`
      <span
        class="flex flex-col"
      >
        <span
          class="text-text-strong text-lg font-semibold tracking-tight leading-none"
        >
          Disa
          <span
            class="text-liquid-blue"
          >
            AI
          </span>
        </span>
        <span
          class="text-liquid-turquoise text-xs font-medium tracking-wide leading-none mt-px"
        >
          Liquid Intelligence
        </span>
      </span>
    `);
    expect(container.textContent?.includes("|")).toBe(false);
    expect(container.textContent?.includes("▮")).toBe(false);
  });
});
