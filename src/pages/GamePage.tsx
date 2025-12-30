import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { UnifiedInputBar } from "../components/chat/UnifiedInputBar";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { GameHUD } from "../components/game/GameHUD";
import { useModelCatalog } from "../contexts/ModelCatalogContext";
import { useRoles } from "../contexts/RolesContext";
import { useChat } from "../hooks/useChat";
import { cleanGameContent, useGameState } from "../hooks/useGameState";
import { useSettings } from "../hooks/useSettings";
import { mapCreativityToParams } from "../lib/creativity";
import { ArrowLeft } from "../lib/icons";
import { getSamplingCapabilities } from "../lib/modelCapabilities";

export default function GamePage() {
  const { roles, setActiveRole, activeRole } = useRoles();
  const { models } = useModelCatalog();
  const { settings } = useSettings();

  const { messages, append, isLoading, setCurrentSystemPrompt, setRequestOptions } = useChat();

  const [input, setInput] = useState("");

  const gameState = useGameState(messages);

  const eterniaRole = useMemo(() => roles.find((role) => role.id === "eternia-dm"), [roles]);

  const requestOptions = useMemo(() => {
    const capabilities = getSamplingCapabilities(settings.preferredModelId, models ?? null);
    const params = mapCreativityToParams(settings.creativity ?? 45, settings.preferredModelId);

    return {
      model: settings.preferredModelId,
      temperature: capabilities.temperature ? params.temperature : undefined,
      top_p: capabilities.top_p ? params.top_p : undefined,
      presence_penalty: capabilities.presence_penalty ? params.presence_penalty : undefined,
    };
  }, [models, settings.creativity, settings.preferredModelId]);

  useEffect(() => {
    setRequestOptions(requestOptions);
  }, [requestOptions, setRequestOptions]);

  useEffect(() => {
    if (!eterniaRole) return;

    if (!activeRole || activeRole.id !== eterniaRole.id) {
      setActiveRole(eterniaRole);
    }
    setCurrentSystemPrompt(eterniaRole.systemPrompt);
  }, [activeRole, eterniaRole, setActiveRole, setCurrentSystemPrompt]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    void append({ role: "user", content: trimmed });
    setInput("");
  }, [append, input, isLoading]);

  const displayMessages = useMemo(
    () =>
      messages.map((msg) => ({
        ...msg,
        content: msg.role === "assistant" ? cleanGameContent(msg.content) : msg.content,
      })),
    [messages],
  );

  return (
    <div className="flex flex-col h-screen bg-surface-900 text-text-primary">
      <div className="flex items-center px-4 py-2 bg-surface-800 border-b border-surface-700">
        <Link
          to="/"
          className="p-2 hover:bg-surface-700 rounded-full transition-colors"
          aria-label="Zurück zur Startseite"
        >
          <ArrowLeft className="h-5 w-5 text-gray-400" />
        </Link>
        <span className="ml-3 font-bold text-lg text-gray-200">Eternia Chronicles</span>
      </div>

      <GameHUD state={gameState} />

      <div className="flex-1 overflow-hidden relative bg-surface-100 dark:bg-gray-900">
        <VirtualizedMessageList messages={displayMessages} isLoading={isLoading} />
      </div>

      <div className="p-4 bg-surface-800 border-t border-surface-700">
        <div className="max-w-4xl mx-auto">
          <UnifiedInputBar
            value={input}
            onChange={setInput}
            onSend={handleSend}
            isLoading={isLoading}
            className="shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
