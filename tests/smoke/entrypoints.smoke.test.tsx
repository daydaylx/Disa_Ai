import { render, screen } from "@testing-library/react";
import type React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { ToastsProvider } from "../../src/ui/toast";

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
    setRequestOptions: vi.fn(),
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

vi.mock("../../src/app/state/StudioContext", () => ({
  useStudio: () => ({
    roles: [],
    rolesLoading: false,
    roleLoadError: null,
    refreshRoles: vi.fn(),
    activeRole: null,
    setActiveRole: vi.fn(),
    typographyScale: 1,
    setTypographyScale: vi.fn(),
    borderRadius: 0.5,
    setBorderRadius: vi.fn(),
    accentColor: "hsl(0 0% 0%)",
    setAccentColor: vi.fn(),
  }),
}));

vi.mock("../../src/hooks/useSettings", () => ({
  useSettings: () => ({
    settings: {
      preferredModelId: "openai/gpt-4o-mini",
      showNSFWContent: false,
      language: "de",
      discussionPreset: "locker_neugierig",
      discussionStrict: false,
      discussionMaxSentences: 8,
      creativity: 45,
      restoreLastConversation: true,
      fontSize: 16,
      reduceMotion: false,
      hapticFeedback: false,
      theme: "auto",
      enableAnalytics: true,
      enableNotifications: true,
    },
    setPreferredModel: vi.fn(),
    setCreativity: vi.fn(),
    setDiscussionPreset: vi.fn(),
    setDiscussionStrict: vi.fn(),
    setDiscussionMaxSentences: vi.fn(),
    setTheme: vi.fn(),
    setFontSize: vi.fn(),
    setReduceMotion: vi.fn(),
    setHapticFeedback: vi.fn(),
    toggleNSFWContent: vi.fn(),
    saveSettings: vi.fn(),
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

import Chat from "../../src/pages/Chat";
import SettingsOverviewPage from "../../src/pages/SettingsOverviewPage";

function renderWithRouter(pathname: string, element: React.ReactElement) {
  return render(
    <ToastsProvider>
      <MemoryRouter initialEntries={[pathname]}>
        <Routes>
          <Route path={pathname} element={element} />
        </Routes>
      </MemoryRouter>
    </ToastsProvider>,
  );
}

describe("Entry-Point Smoke Tests", () => {
  it("rendert den Chat-Einstieg inklusive Composer", async () => {
    renderWithRouter("/chat", <Chat />);

    await screen.findByRole("heading", {
      name: /Disa AI Chat/i,
    });
    expect(screen.getByTestId("composer-input")).toBeVisible();
  });

  it("zeigt die Einstellungsübersicht", async () => {
    renderWithRouter("/settings", <SettingsOverviewPage />);
    const headings = await screen.findAllByRole("heading", { name: /Einstellungen/i });
    expect(headings.length).toBeGreaterThan(0);
  });
});
