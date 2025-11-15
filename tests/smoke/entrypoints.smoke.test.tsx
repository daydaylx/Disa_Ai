import { render, screen } from "@testing-library/react";
import type React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  if (!("CSS" in window)) {
    Object.defineProperty(window, "CSS", { value: {}, writable: true });
  }
  if (typeof window.CSS.supports !== "function") {
    window.CSS.supports = () => true;
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
});

vi.mock("../../src/hooks/useChat", () => ({
  useChat: () => ({
    messages: [],
    append: vi.fn(),
    isLoading: false,
    setMessages: vi.fn(),
    input: "",
    setInput: vi.fn(),
    stop: vi.fn(),
    setCurrentSystemPrompt: vi.fn(),
  }),
}));

vi.mock("../../src/hooks/useConversationManager", () => ({
  useConversationManager: vi.fn(),
}));

vi.mock("../../src/hooks/useRoles", () => ({
  useRoles: () => ({ activeRole: { name: "Smoke Role" } }),
}));

vi.mock("../../src/hooks/useMemory", () => ({
  useMemory: () => ({
    isEnabled: false,
    toggleMemory: vi.fn(),
    clearAllMemory: vi.fn(),
  }),
}));

vi.mock("../../src/hooks/useSettings", () => ({
  useSettings: () => ({
    settings: { preferredModelId: "openai/gpt-4o-mini" },
  }),
}));

vi.mock("../../src/hooks/use-storage", () => ({
  useConversationStats: () => ({
    stats: {
      totalConversations: 0,
      totalMessages: 0,
      averageMessagesPerConversation: 0,
      modelsUsed: [],
      storageSize: 0,
    },
    refresh: vi.fn(),
  }),
}));

vi.mock("../../src/components/ui/toast/ToastsProvider", () => ({
  useToasts: () => ({ push: vi.fn() }),
}));

import Chat from "../../src/pages/Chat";
import SettingsOverviewPage from "../../src/pages/SettingsOverviewPage";

function renderWithRouter(pathname: string, element: React.ReactElement) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path={pathname} element={element} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Entry-Point Smoke Tests", () => {
  it("rendert den Chat-Einstieg inklusive Composer", async () => {
    renderWithRouter("/chat", <Chat />);

    await screen.findByRole("heading", {
      name: /Konzentrierte KI-Arbeit/i,
    });
    expect(screen.getByTestId("composer-input")).toBeVisible();
  });

  it("zeigt die Einstellungsübersicht", async () => {
    renderWithRouter("/settings", <SettingsOverviewPage />);
    const headings = await screen.findAllByRole("heading", { name: /Einstellungen/i });
    expect(headings.length).toBeGreaterThan(0);
  });
});
