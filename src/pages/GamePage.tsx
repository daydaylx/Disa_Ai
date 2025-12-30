import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, Download, RotateCcw, Save } from "@/lib/icons";
import { Button } from "@/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/DropdownMenu";

import { ChatStatusBanner } from "../components/chat/ChatStatusBanner";
import { UnifiedInputBar } from "../components/chat/UnifiedInputBar";
import { VirtualizedMessageList } from "../components/chat/VirtualizedMessageList";
import { GameHUD } from "../components/game/GameHUD";
import { PageLayout } from "../components/layout/PageLayout";
import { useRoles } from "../contexts/RolesContext";
import type { UIRole } from "../data/roles";
import { useChatPageLogic } from "../hooks/useChatPageLogic";
import { cleanGameContent, useGameState } from "../hooks/useGameState";
import { useVisualViewport } from "../hooks/useVisualViewport";

const GAME_ROLE_ID = "eternia-dm";

export default function GamePage() {
  const viewport = useVisualViewport();
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const previousRoleRef = useRef<UIRole | null>(null);
  const navigate = useNavigate();
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  const chatLogic = useChatPageLogic({
    onStartWithPreset: () => {},
  });

  const { roles, activeRole, setActiveRole } = useRoles();
  const { gameState, resetGame, loadSave, manualSave } = useGameState(chatLogic.messages);

  const gameRole = useMemo(() => roles.find((role) => role.id === GAME_ROLE_ID), [roles]);
  const isGameRoleActive = activeRole?.id === GAME_ROLE_ID;

  useEffect(() => {
    if (!gameRole) return;
    if (activeRole?.id === GAME_ROLE_ID) return;

    if (!previousRoleRef.current) {
      previousRoleRef.current = activeRole ?? null;
    }

    setActiveRole(gameRole);
  }, [activeRole, gameRole, setActiveRole]);

  useEffect(() => {
    return () => {
      const previousRole = previousRoleRef.current;
      if (!previousRole || previousRole.id === GAME_ROLE_ID) return;
      setActiveRole(previousRole);
    };
  }, [setActiveRole]);

  const displayMessages = useMemo(
    () =>
      chatLogic.messages.map((message) =>
        message.role === "assistant"
          ? { ...message, content: cleanGameContent(message.content) }
          : message,
      ),
    [chatLogic.messages],
  );

  const handleStartGame = useCallback(() => {
    if (chatLogic.isLoading || !isGameRoleActive) return;
    chatLogic.setInput("Starte das Abenteuer.");
    setTimeout(() => chatLogic.handleSend(), 100);
  }, [chatLogic, isGameRoleActive]);

  const handleSave = useCallback(() => {
    manualSave();
    setSaveNotification("Spiel gespeichert!");
    setTimeout(() => setSaveNotification(null), 2000);
  }, [manualSave]);

  const handleLoad = useCallback(() => {
    const success = loadSave();
    if (success) {
      setSaveNotification("Spielstand geladen!");
    } else {
      setSaveNotification("Kein Spielstand gefunden");
    }
    setTimeout(() => setSaveNotification(null), 2000);
  }, [loadSave]);

  const handleReset = useCallback(() => {
    if (
      !confirm("Möchtest du das Spiel wirklich zurücksetzen? Alle Fortschritte gehen verloren!")
    ) {
      return;
    }
    resetGame();
    setSaveNotification("Spiel zurückgesetzt");
    setTimeout(() => setSaveNotification(null), 2000);
  }, [resetGame]);

  return (
    <PageLayout
      title="Eternia Chronicles"
      accentColor="roles"
      showMenu={false}
      headerActions={
        <div className="flex items-center gap-2">
          {saveNotification && (
            <div className="text-xs text-status-success font-medium px-2 py-1 rounded-lg bg-status-success/10 border border-status-success/20 animate-in fade-in slide-in-from-top-2 duration-200">
              {saveNotification}
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Spiel
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSave}>
                <Save className="h-4 w-4" />
                Speichern
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLoad}>
                <Download className="h-4 w-4" />
                Laden
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleReset} className="text-status-error">
                <RotateCcw className="h-4 w-4" />
                Zurücksetzen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void navigate("/chat")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
        </div>
      }
    >
      <h1 className="sr-only">Eternia Chronicles</h1>
      <div
        className="flex flex-col relative w-full"
        style={{
          height: viewport.height ? `${viewport.height - 64}px` : "100%",
          minHeight: viewport.height ? `${viewport.height - 64}px` : "100%",
        }}
      >
        <GameHUD state={gameState} />
        <ChatStatusBanner
          status={chatLogic.apiStatus}
          error={chatLogic.error}
          rateLimitInfo={chatLogic.rateLimitInfo}
        />

        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto min-h-0 pt-2"
          role="log"
          aria-label="Spielverlauf"
        >
          <div className="px-4 max-w-3xl mx-auto w-full min-h-full flex flex-col">
            <div className="flex-1 flex flex-col gap-6 py-4">
              {chatLogic.isEmpty ? (
                <div className="flex-1 flex items-center justify-center pb-12">
                  <Card variant="hero" className="w-full max-w-md text-center space-y-4 p-6">
                    <CardHeader className="space-y-2">
                      <CardTitle>Willkommen in Eternia</CardTitle>
                      <CardDescription>
                        Ein dunkles Abenteuer wartet. Triff Entscheidungen und forme deine
                        Geschichte.
                      </CardDescription>
                    </CardHeader>
                    <Button
                      variant="primary"
                      onClick={handleStartGame}
                      disabled={!isGameRoleActive || chatLogic.isLoading}
                      className="w-full"
                    >
                      {isGameRoleActive ? "Abenteuer starten" : "Erzaehler wird geladen"}
                    </Button>
                    <p className="text-xs text-ink-tertiary">
                      Tipp: Schreibe Aktionen wie &quot;Ich gehe nach Norden&quot;.
                    </p>
                  </Card>
                </div>
              ) : (
                <VirtualizedMessageList
                  messages={displayMessages}
                  conversationKey={chatLogic.activeConversationId ?? "new"}
                  isLoading={chatLogic.isLoading}
                  onEdit={chatLogic.handleEdit}
                  onRetry={chatLogic.handleRetry}
                  className="w-full pb-4"
                  scrollContainerRef={chatScrollRef}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex-none w-full pointer-events-none z-20">
          <div className="max-w-3xl mx-auto px-4 pb-safe-bottom pt-2 pointer-events-auto">
            <UnifiedInputBar
              value={chatLogic.input}
              onChange={chatLogic.setInput}
              onSend={chatLogic.handleSend}
              isLoading={chatLogic.isLoading}
              placeholder='Was moechtest du tun? (z.B. "Ich gehe nach Norden")'
              showContextPills={false}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
