import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyButton } from "../../src/components/ui/CopyButton";

const setClipboard = (value: Clipboard | undefined) => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    writable: true,
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

    const user = userEvent.setup();
    setClipboard({ writeText } as unknown as Clipboard);
    render(<CopyButton text="Hallo" />);

    await user.click(screen.getByRole("button", { name: /kopieren/i }));

    expect(writeText).toHaveBeenCalledWith("Hallo");
  });

  it("falls back to document.execCommand when Clipboard API is unavailable", async () => {
    const originalExecCommand = (
      document as Document & {
        execCommand?: (commandId: string) => boolean;
      }
    ).execCommand;
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      writable: true,
      value: execCommand,
    });

    const user = userEvent.setup();
    setClipboard(undefined);
    render(<CopyButton text="Fallback" />);

    await user.click(screen.getByRole("button", { name: /kopieren/i }));

    expect(execCommand).toHaveBeenCalledWith("copy");

    if (originalExecCommand) {
      Object.defineProperty(document, "execCommand", {
        configurable: true,
        writable: true,
        value: originalExecCommand,
      });
    } else {
      delete (document as Document & { execCommand?: unknown }).execCommand;
    }
  });
});
