import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MobileChatComposer } from "../MobileChatComposer";

// Mock icons
vi.mock("@/lib/icons", () => ({
  Mic: () => <span data-testid="icon-mic" />,
  Paperclip: () => <span data-testid="icon-paperclip" />,
  Send: () => <span data-testid="icon-send" />,
  Smile: () => <span data-testid="icon-smile" />,
}));

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("MobileChatComposer", () => {
  it("renders emoji button", () => {
    render(<MobileChatComposer onSend={vi.fn()} />);
    expect(screen.getByTitle("Emoji auswählen")).toBeInTheDocument();
  });

  it("opens emoji picker on click", async () => {
    render(<MobileChatComposer onSend={vi.fn()} />);
    const emojiBtn = screen.getByTitle("Emoji auswählen");

    // Initially not visible
    expect(screen.queryByRole("button", { name: "😊" })).not.toBeInTheDocument();

    await userEvent.click(emojiBtn);

    // Now visible
    expect(screen.getByRole("button", { name: "😊" })).toBeInTheDocument();
  });

  it("inserts emoji on click", async () => {
    render(<MobileChatComposer onSend={vi.fn()} />);
    await userEvent.click(screen.getByTitle("Emoji auswählen"));
    await userEvent.click(screen.getByRole("button", { name: "😊" }));

    const textarea = screen.getByPlaceholderText("Nachricht schreiben...");
    expect(textarea).toHaveValue("😊");
  });

  it("closes picker on send", async () => {
    const onSend = vi.fn();
    render(<MobileChatComposer onSend={onSend} />);

    // Open picker and insert emoji
    await userEvent.click(screen.getByTitle("Emoji auswählen"));
    await userEvent.click(screen.getByRole("button", { name: "😊" }));

    // Verify picker is open
    expect(screen.getByRole("button", { name: "😊" })).toBeInTheDocument();

    // Send
    await userEvent.click(screen.getByTitle("Senden (Enter)"));

    expect(onSend).toHaveBeenCalledWith("😊");

    // Verify picker is closed
    expect(screen.queryByRole("button", { name: "😊" })).not.toBeInTheDocument();
  });
});
