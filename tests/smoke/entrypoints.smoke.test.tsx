import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { DEFAULT_MODEL_ID } from "../../src/config/modelPresets";
import { ModelCatalogProvider } from "../../src/contexts/ModelCatalogContext";
import { RolesProvider } from "../../src/contexts/RolesContext";
import { ToastsProvider } from "../../src/ui/toast";

vi.mock("../../src/ui/SectionHeader", () => ({
  SectionHeader: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div data-testid="section-header">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  ),
}));

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
  useConversationManager: () => {
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

    return {
      activeConversationId,
      conversations: [],
      newConversation: () => setActiveConversationId("test-conversation"),
    };
  },
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
      preferredModelId: DEFAULT_MODEL_ID,
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
      <RolesProvider>
        <ModelCatalogProvider>
          <MemoryRouter initialEntries={[pathname]}>
            <Routes>
              <Route path={pathname} element={element} />
            </Routes>
          </MemoryRouter>
        </ModelCatalogProvider>
      </RolesProvider>
    </ToastsProvider>,
  );
}

describe("Entry-Point Smoke Tests", () => {
  it("rendert den Chat-Einstieg inklusive Composer", async () => {
    const user = userEvent.setup();
    renderWithRouter("/chat", <Chat />);

    // Das Heading ist jetzt sr-only (screen reader only)
    const heading = await screen.findByRole("heading", {
      name: /Disa AI \u2013 Chat/i,
      hidden: true,
    });
    expect(heading).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Neues Gespräch/i }));

    expect(await screen.findByTestId("composer-input")).toBeVisible();
  });

  it("zeigt die Einstellungsübersicht", async () => {
    renderWithRouter("/settings", <SettingsOverviewPage />);
    const headings = await screen.findAllByRole("heading", { name: /Einstellungen/i });
    expect(headings.length).toBeGreaterThan(0);
  });
});
