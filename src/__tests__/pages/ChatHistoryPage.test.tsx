import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type ConversationMetadata, getAllConversations } from "@/lib/conversation-manager-modern";
import ChatHistoryPage from "@/pages/ChatHistoryPage";
import { ToastsProvider } from "@/ui";

vi.mock("@/components/conversation/ConversationCard", () => ({
  ConversationCard: ({ conversation }: { conversation: { title: string } }) => (
    <div data-testid="conversation-card">{conversation.title}</div>
  ),
}));

vi.mock("@/lib/conversation-manager-modern", () => ({
  getAllConversations: vi.fn(),
  deleteConversation: vi.fn(),
}));

const mockedGetAllConversations = vi.mocked(getAllConversations);
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

function renderChatHistoryPage() {
  return render(
    <MemoryRouter>
      <ToastsProvider>
        <ChatHistoryPage />
      </ToastsProvider>
    </MemoryRouter>,
  );
}

describe("ChatHistoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetAllConversations.mockResolvedValue([]);
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("zeigt den Empty-State ohne Verlauf", async () => {
    renderChatHistoryPage();

    expect(await screen.findByText("Noch keine Unterhaltungen")).toBeInTheDocument();
  });

  it("zeigt den Error-State mit Retry bei Ladefehler", async () => {
    mockedGetAllConversations.mockRejectedValue(new Error("load failed"));

    renderChatHistoryPage();

    expect(await screen.findByText("Verlauf konnte nicht geladen werden")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Erneut versuchen" })).toBeInTheDocument();
  });

  it("zeigt gespeicherte Konversationen im Daten-State", async () => {
    const conversation: ConversationMetadata = {
      id: "conv-1",
      title: "Projektplanung",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      model: "test-model",
      messageCount: 3,
    };
    mockedGetAllConversations.mockResolvedValue([conversation]);

    renderChatHistoryPage();

    expect(await screen.findByText("Projektplanung")).toBeInTheDocument();
    expect(screen.getAllByTestId("conversation-card")).toHaveLength(1);
  });
});
