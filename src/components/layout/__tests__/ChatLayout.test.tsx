import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChatLayout } from "../ChatLayout";

describe("ChatLayout", () => {
  it("applies chat-scoped class to the brand wordmark", () => {
    render(
      <ChatLayout>
        <div>Chat Content</div>
      </ChatLayout>,
    );

    const logo = screen.getByTestId("brand-logo");
    expect(logo).toHaveClass("chat-brandwordmark");
  });

  it("forwards logo state to the presence mark", () => {
    render(
      <ChatLayout logoState="thinking">
        <div>Chat Content</div>
      </ChatLayout>,
    );

    const logo = screen.getByTestId("brand-logo");
    const presenceMark = logo.querySelector(".presence-mark");

    expect(presenceMark).toBeInTheDocument();
    expect(presenceMark).toHaveAttribute("data-state", "thinking");
  });
});
