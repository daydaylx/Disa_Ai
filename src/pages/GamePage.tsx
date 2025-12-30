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
import { GameEffects } from "../components/game/GameEffects";
import { GameHUD } from "../components/game/GameHUD";
import { PageLayout } from "../components/layout/PageLayout";
import { useRoles } from "../contexts/RolesContext";
import type { UIRole } from "../data/roles";
import { useChatPageLogic } from "../hooks/useChatPageLogic";
import { cleanGameContent, type Item, useGameState } from "../hooks/useGameState";
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
  const { gameState, resetGame, loadSave, manualSave, importSave } = useGameState(
    chatLogic.messages,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!isGameRoleActive) return;
    chatLogic.sendPrompt("System: Initialisiere Sequenz. Starte Simulation 'Projekt Neubeginn'.", {
      updateInput: true,
    });
  }, [chatLogic, isGameRoleActive]);

  const handleSave = useCallback(() => {
    manualSave();
    setSaveNotification("Spielstand gesichert");
    setTimeout(() => setSaveNotification(null), 2000);
  }, [manualSave]);

  const handleLoad = useCallback(() => {
    const loadedState = loadSave();
    if (loadedState) {
      setSaveNotification("Spielstand geladen - Synchronisiere...");
      const syncMessage = `[SYSTEM: SPIELSTAND GELADEN. HIER IST DER AKTUELLE STATUS: ${JSON.stringify(loadedState)}. BITTE BESTÄTIGE UND FAHRE MIT DER HANDLUNG FORT.]`;
      chatLogic.sendPrompt(syncMessage, { updateInput: true });
    } else {
      setSaveNotification("Kein Spielstand gefunden");
    }
    setTimeout(() => setSaveNotification(null), 2000);
  }, [loadSave, chatLogic]);

  const handleExport = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gameState));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `ground_zero_save_${new Date().toISOString().slice(0, 10)}.json`,
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setSaveNotification("Datei exportiert");
    setTimeout(() => setSaveNotification(null), 2000);
  }, [gameState]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importSave(content)) {
          setSaveNotification("Datei importiert - Synchronisiere...");
          // Force Sync after import
          const loadedState = JSON.parse(content); // We know it's valid if importSave returned true
          const syncMessage = `[SYSTEM: SPIELSTAND IMPORTIERT. STATUS: ${JSON.stringify(loadedState)}. FORTFAHREN.]`;
          chatLogic.sendPrompt(syncMessage, { updateInput: true });
        } else {
          setSaveNotification("Fehler beim Import");
        }
        setTimeout(() => setSaveNotification(null), 2000);
      };
      reader.readAsText(file);
      // Reset input
      event.target.value = "";
    },
    [importSave, chatLogic],
  );

  const handleReset = useCallback(() => {
    if (!confirm("Warnung: System-Reset löscht alle Daten. Fortfahren?")) {
      return;
    }
    resetGame();
    setSaveNotification("System zurückgesetzt");
    setTimeout(() => setSaveNotification(null), 2000);
  }, [resetGame]);

  // Action Handlers
  const handleAction = useCallback(
    (action: string) => {
      if (!action.trim()) return;
      chatLogic.sendPrompt(action, { updateInput: true });
    },
    [chatLogic],
  );

  const handleUseItem = useCallback(
    (item: Item) => {
      handleAction(`Benutze ${item.name}`);
    },
    [handleAction],
  );

  const handleCombatAction = useCallback(
    (action: string) => {
      handleAction(action);
    },
    [handleAction],
  );

  return (
    <PageLayout
      title="Ground Zero"
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
                System
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
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 rotate-180" />
                Exportieren
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportClick}>
                <Download className="h-4 w-4" />
                Importieren
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleReset} className="text-status-error">
                <RotateCcw className="h-4 w-4" />
                Neustart
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
            Exit
          </Button>
        </div>
      }
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <h1 className="sr-only">Ground Zero</h1>
      <GameEffects state={gameState} />
      <div
        className="flex flex-col relative w-full game-page-content"
        style={{
          height: viewport.height ? `${viewport.height - 64}px` : "100%",
          minHeight: viewport.height ? `${viewport.height - 64}px` : "100%",
        }}
      >
        <GameHUD state={gameState} onUseItem={handleUseItem} onCombatAction={handleCombatAction} />
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
                  <Card
                    variant="hero"
                    className="w-full max-w-md text-center space-y-4 p-6 border-emerald-500/20 bg-surface-2/50 backdrop-blur"
                  >
                    <CardHeader className="space-y-2">
                      <CardTitle className="text-emerald-400 font-mono tracking-wider">
                        Ground Zero
                      </CardTitle>
                      <CardDescription className="font-mono text-xs">
                        Verbindung zum Habitat hergestellt...
                        <br />
                        Warte auf Input.
                      </CardDescription>
                    </CardHeader>
                    <Button
                      variant="primary"
                      onClick={handleStartGame}
                      disabled={!isGameRoleActive || chatLogic.isLoading}
                      className="w-full font-mono"
                    >
                      {isGameRoleActive ? "/// INITIALISIEREN" : "LADE PROTOKOLLE..."}
                    </Button>
                    <p className="text-xs text-ink-tertiary font-mono">
                      &gt; Tippe Aktionen wie "Untersuche Kapsel" oder "Scan Umgebung".
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
          <div className="max-w-3xl mx-auto px-4 pb-safe-bottom pt-2 pointer-events-auto space-y-2">
            {/* Suggested Actions */}
            {gameState.suggested_actions &&
              gameState.suggested_actions.length > 0 &&
              !chatLogic.isLoading && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {gameState.suggested_actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAction(action)}
                      className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer font-mono"
                    >
                      › {action}
                    </button>
                  ))}
                </div>
              )}

            <UnifiedInputBar
              value={chatLogic.input}
              onChange={chatLogic.setInput}
              onSend={chatLogic.handleSend}
              isLoading={chatLogic.isLoading}
              placeholder='Kommando eingeben... (z.B. "Inventar prüfen")'
              showContextPills={false}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
