import React, { useEffect, useReducer, useState } from "react";

import { chatAdapter } from "../../data/adapter/chat";
import { Message } from "../chat/types";
import { ErrorBanner } from "../components/ErrorBanner";
import { ModelProvider, useModel } from "../state/modelContext";
import { canAbort, canSendMessage, hasError, initialUIState, uiReducer } from "../state/uiMachine";
import { ChatMain } from "./ChatMain";
import { ComposerDock } from "./ComposerDock";
import { RightDrawer } from "./RightDrawer";
import { SidebarLeft } from "./SidebarLeft";
import { Topbar } from "./Topbar";

function AppShellContent() {
  const { selectedModelId } = useModel();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      role: "assistant",
      createdAt: new Date().toISOString(),
      content: `Willkommen in **Disa Orion**.

\`\`\`ts
function hello(){
  console.log("hi");
}
\`\`\``,
    },
  ]);

  const [uiState, dispatch] = useReducer(uiReducer, initialUIState);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => dispatch({ type: "SET_ONLINE" });
    const handleOffline = () => dispatch({ type: "SET_OFFLINE" });

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  async function send(text: string) {
    if (!canSendMessage(uiState) || !chatAdapter.isConfigured()) {
      return;
    }

    const now = new Date().toISOString();
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: now,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Create assistant message placeholder
    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Create AbortController for this request
    const abortController = new AbortController();

    dispatch({
      type: "START_STREAMING",
      messageId: assistantMessageId,
      abortController,
    });

    try {
      const allMessages = [...messages, userMessage];

      for await (const chunk of chatAdapter.sendMessage({
        messages: allMessages,
        model: selectedModelId,
        signal: abortController.signal,
      })) {
        if (chunk.type === "content" && chunk.content) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + chunk.content }
                : msg,
            ),
          );
        } else if (chunk.type === "error") {
          const errorState =
            chunk.error === "RATE_LIMITED"
              ? "rate_limited"
              : chunk.error === "OFFLINE"
                ? "offline"
                : "error";
          dispatch({
            type: "SET_ERROR",
            error: chunk.error || "Unknown error",
            chatState: errorState,
          });
          return;
        } else if (chunk.type === "done") {
          dispatch({ type: "STOP_STREAMING" });
          return;
        }
      }
    } catch (error) {
      if (abortController.signal.aborted) {
        // Remove the incomplete assistant message
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
        dispatch({ type: "STOP_STREAMING" });
      } else {
        dispatch({
          type: "SET_ERROR",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  }

  function handleAbort() {
    if (canAbort(uiState)) {
      dispatch({ type: "ABORT_STREAMING" });
    }
  }
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background:
          "radial-gradient(120% 120% at 20% 10%, hsl(var(--accent-primary)/.18), transparent 60%), radial-gradient(120% 120% at 80% 70%, hsl(var(--accent-primary)/.12), transparent 55%)",
      }}
    >
      <h1 className="sr-only">Disa AI Chat Assistant</h1>
      <Topbar />
      <main className="flex flex-1" role="main">
        <SidebarLeft />
        <div className="flex flex-1 flex-col">
          {hasError(uiState) && (
            <ErrorBanner uiState={uiState} onDismiss={() => dispatch({ type: "CLEAR_ERROR" })} />
          )}
          <ChatMain messages={messages} />
        </div>
        <RightDrawer />
      </main>
      <ComposerDock
        onSend={send}
        onAbort={handleAbort}
        uiState={uiState}
        tokenCount={messages.reduce((n, m) => n + m.content.length, 0)}
      />
    </div>
  );
}

export function AppShell() {
  return (
    <ModelProvider>
      <AppShellContent />
    </ModelProvider>
  );
}
