import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CopyButton } from "../../src/components/ui/CopyButton";
import { Icon } from "../../src/components/ui/Icon";

describe("UI Smoke", () => {
  it("renders Icon without crashing", () => {
    const { container } = render(<Icon name="menu" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders CopyButton without crashing", () => {
    const { getByRole } = render(<CopyButton text="test" />);
    const btn = getByRole("button", { name: /kopieren/i });
    expect(btn).toBeInTheDocument();
  });
});
