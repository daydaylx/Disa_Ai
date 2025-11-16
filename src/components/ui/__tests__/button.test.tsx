import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../button";

describe("Button", () => {
  it("renders the button with default variant and size", () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole("button", { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[var(--surface-neumorphic-raised)]"); // hybrid neumorphic default
    expect(button).toHaveClass("h-10 px-4 py-2 text-sm"); // hybrid default size
  });

  it("renders the button with a specific variant", () => {
    render(<Button variant="brand">Brand Button</Button>);
    const button = screen.getByRole("button", { name: /brand button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[var(--color-brand-primary)]");
  });

  it("renders the button with a specific size", () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole("button", { name: /large button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("h-12 px-6 py-3 text-base");
  });

  it("renders the button with dramatic effect", () => {
    render(<Button dramatic>Dramatic Button</Button>);
    const button = screen.getByRole("button", { name: /dramatic button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("hover:-translate-y-[3px]"); // glass-primary default with dramatic
  });

  it("renders as a child element when asChild is true", () => {
    render(
      <Button asChild>
        <span>Custom Button</span>
      </Button>,
    );
    const customButton = screen.getByText("Custom Button");
    expect(customButton).toBeInTheDocument();
    expect(customButton.tagName.toLowerCase()).toBe("span"); // Verifies asChild behavior
  });

  it("renders a disabled button", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom Class Button</Button>);
    const button = screen.getByRole("button", { name: /custom class button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("custom-class");
  });

  it("renders with deprecated 'default' variant and maps to 'glass-primary'", () => {
    render(<Button variant="default">Deprecated Default</Button>);
    const button = screen.getByRole("button", { name: /deprecated default/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[var(--surface-neumorphic-raised)]"); // hybrid neumorphic
  });

  it("renders with deprecated 'secondary' variant and maps to 'glass-subtle'", () => {
    render(<Button variant="secondary">Deprecated Secondary</Button>);
    const button = screen.getByRole("button", { name: /deprecated secondary/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[var(--surface-neumorphic-raised)]"); // hybrid neumorphic alias
  });

  it("renders with deprecated 'neumorphic' variant and maps to 'glass-primary'", () => {
    render(<Button variant="neumorphic">Deprecated Neumorphic</Button>);
    const button = screen.getByRole("button", { name: /deprecated neumorphic/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[var(--surface-neumorphic-raised)]"); // hybrid neumorphic
  });
});
