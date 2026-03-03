import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BottomSheet } from "../BottomSheet";

describe("BottomSheet", () => {
  it("traps focus and restores previous focus on close", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <div>
        <button type="button">Trigger öffnen</button>
        <BottomSheet open={false} onClose={onClose} title="Details">
          <button type="button">Aktion A</button>
          <button type="button">Aktion B</button>
        </BottomSheet>
      </div>,
    );

    const triggerButton = screen.getByRole("button", { name: "Trigger öffnen" });
    triggerButton.focus();
    expect(triggerButton).toHaveFocus();

    rerender(
      <div>
        <button type="button">Trigger öffnen</button>
        <BottomSheet open onClose={onClose} title="Details">
          <button type="button">Aktion A</button>
          <button type="button">Aktion B</button>
        </BottomSheet>
      </div>,
    );

    const closeButton = screen.getByRole("button", { name: "Schließen" });
    await waitFor(() => expect(closeButton).toHaveFocus());

    await user.tab();
    expect(screen.getByRole("button", { name: "Aktion A" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Aktion B" })).toHaveFocus();
    await user.tab();
    expect(closeButton).toHaveFocus();

    rerender(
      <div>
        <button type="button">Trigger öffnen</button>
        <BottomSheet open={false} onClose={onClose} title="Details">
          <button type="button">Aktion A</button>
          <button type="button">Aktion B</button>
        </BottomSheet>
      </div>,
    );

    await waitFor(() => expect(triggerButton).toHaveFocus());
  });

  it("calls onClose when pressing escape", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <BottomSheet open onClose={onClose} title="Details">
        <button type="button">Aktion</button>
      </BottomSheet>,
    );

    await user.keyboard("{Escape}");
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("does not trigger onClose multiple times during close animation", async () => {
    const onClose = vi.fn();

    render(
      <BottomSheet open onClose={onClose} title="Details">
        <button type="button">Aktion</button>
      </BottomSheet>,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByRole("button", { name: "Detailansicht schließen" }));

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
