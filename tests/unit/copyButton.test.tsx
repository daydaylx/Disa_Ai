import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyButton } from "../../src/components/ui/CopyButton";

const setClipboard = (value: Clipboard | undefined) => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value,
  });
};

describe("CopyButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    setClipboard(undefined);
  });

  it("uses the Clipboard API when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText } as unknown as Clipboard);

    const user = userEvent.setup();
    render(<CopyButton text="Hallo" />);

    await user.click(screen.getByRole("button", { name: /kopieren/i }));

    expect(writeText).toHaveBeenCalledWith("Hallo");
  });

  it("falls back to document.execCommand when Clipboard API is unavailable", async () => {
    setClipboard(undefined);
    const execCommand = vi.spyOn(document, "execCommand").mockReturnValue(true);

    const user = userEvent.setup();
    render(<CopyButton text="Fallback" />);

    await user.click(screen.getByRole("button", { name: /kopieren/i }));

    expect(execCommand).toHaveBeenCalledWith("copy");
  });
});
