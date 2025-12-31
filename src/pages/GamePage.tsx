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
import { useGameEngine } from "../hooks/useGameEngine";
import { cleanGameContent, type Item, useGameState } from "../hooks/useGameState";
import { useSettings } from "../hooks/useSettings";
import { useVisualViewport } from "../hooks/useVisualViewport";

const GAME_ROLE_ID = "eternia-dm";

export default function GamePage() {
  const viewport = useVisualViewport();
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const previousRoleRef = useRef<UIRole | null>(null);
  const navigate = useNavigate();
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const chatLogic = useChatPageLogic({
    onStartWithPreset: () => {},
  });

  const { roles, activeRole, setActiveRole } = useRoles();
  const { setPreferredModel } = useSettings();

  // Initialize Game Engine first (needed for validation)
  const gameEngineRef = useRef<ReturnType<typeof useGameEngine> | null>(null);

  const {
    gameState,
    resetGame,
    loadSave,
    manualSave,
    importSave,
    updateSurvival,
    updateInventory,
    updateCombat,
  } = useGameState(
    chatLogic.messages,
    true, // autoSave
    gameEngineRef.current?.validateStateUpdate, // Validator from engine
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Game Engine
  const gameEngine = useGameEngine({
    onStateChange: updateSurvival,
    isPlaying: gameStarted, // Only decay after explicit game start
  });

  // Store engine ref for validator
  gameEngineRef.current = gameEngine;

  // Safe notification helper with automatic cleanup (defined BEFORE usage)
  const showNotification = useCallback((message: string, duration = 2000) => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setSaveNotification(message);
    notificationTimeoutRef.current = setTimeout(() => {
      setSaveNotification(null);
      notificationTimeoutRef.current = null;
    }, duration);
  }, []);

  // Monitor critical HP state (simplified - no survival bars)
  useEffect(() => {
    if (chatLogic.messages.length === 0) return; // Don't check before game starts

    if (gameState.hp <= 0) {
      showNotification("💀 GAME OVER - Du bist gestorben");
      chatLogic.sendPrompt(
        "[SYSTEM: SPIELER GESTORBEN. HP erreichte 0. Erzähle dramatische Game Over Szene.]",
        { updateInput: false },
      );
    }
  }, [gameState.hp, chatLogic, showNotification]);

  const gameRole = useMemo(() => roles.find((role) => role.id === GAME_ROLE_ID), [roles]);
  const isGameRoleActive = activeRole?.id === GAME_ROLE_ID;

  // Cleanup notification timeout on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!gameRole) return;
    if (activeRole?.id === GAME_ROLE_ID) return;

    if (!previousRoleRef.current) {
      previousRoleRef.current = activeRole ?? null;
    }

    setActiveRole(gameRole);
  }, [activeRole, gameRole, setActiveRole]);

  // Set optimal model when game page is loaded with existing messages
  useEffect(() => {
    if (chatLogic.messages.length > 0) {
      setPreferredModel("qwen/qwen-2.5-72b-instruct:free");
    }
  }, [chatLogic.messages.length, setPreferredModel]);

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

    // Set optimal model for Ground Zero (best free model for storytelling)
    setPreferredModel("qwen/qwen-2.5-72b-instruct:free");

    setGameStarted(true);
    chatLogic.sendPrompt(
      "System: Initialisiere Sequenz. Vorhut der Orbitalkolonie Aegis landet in einer apokalyptischen Welt; Spieler ist Teil der Vorhut. Starte Simulation 'Projekt Neubeginn'.",
      {
        updateInput: true,
      },
    );
  }, [chatLogic, isGameRoleActive, setPreferredModel]);

  const handleSave = useCallback(() => {
    manualSave();
    showNotification("Spielstand gesichert");
  }, [manualSave, showNotification]);

  const handleLoad = useCallback(() => {
    const loadedState = loadSave();
    if (loadedState) {
      // Set optimal model for Ground Zero
      setPreferredModel("qwen/qwen-2.5-72b-instruct:free");

      setGameStarted(true); // Start decay timer after loading
      showNotification("Spielstand geladen - Synchronisiere...");
      const syncMessage = `[SYSTEM: SPIELSTAND GELADEN. HIER IST DER AKTUELLE STATUS: ${JSON.stringify(loadedState)}. BITTE BESTÄTIGE UND FAHRE MIT DER HANDLUNG FORT.]`;
      chatLogic.sendPrompt(syncMessage, { updateInput: true });
    } else {
      showNotification("Kein Spielstand gefunden");
    }
  }, [loadSave, chatLogic, showNotification, setPreferredModel]);

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
    showNotification("Datei exportiert");
  }, [gameState, showNotification]);

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
          // Set optimal model for Ground Zero
          setPreferredModel("qwen/qwen-2.5-72b-instruct:free");

          showNotification("Datei importiert - Synchronisiere...");
          // Force Sync after import
          const loadedState = JSON.parse(content); // We know it's valid if importSave returned true
          const syncMessage = `[SYSTEM: SPIELSTAND IMPORTIERT. STATUS: ${JSON.stringify(loadedState)}. FORTFAHREN.]`;
          chatLogic.sendPrompt(syncMessage, { updateInput: true });
        } else {
          showNotification("Fehler beim Import");
        }
      };
      reader.readAsText(file);
      // Reset input
      event.target.value = "";
    },
    [importSave, chatLogic, showNotification, setPreferredModel],
  );

  const handleReset = useCallback(() => {
    if (!confirm("Warnung: System-Reset löscht alle Daten. Fortfahren?")) {
      return;
    }
    resetGame();
    showNotification("System zurückgesetzt");
  }, [resetGame, showNotification]);

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
      try {
        // Validate item exists
        if (!item || !item.name) {
          showNotification("❌ Ungültiges Item");
          return;
        }

        // CLIENT-SIDE: Instant item usage with Game Engine
        const result = gameEngine.useConsumable(item);

        if (result.success) {
          // Update survival state INSTANTLY
          updateSurvival(result.stateChanges);

          // Update inventory (reduce quantity or remove)
          const newInventory = gameState.inventory
            .map((invItem) => {
              if (invItem.id === item.id) {
                const newQuantity = invItem.quantity - 1;
                return newQuantity > 0 ? { ...invItem, quantity: newQuantity } : null;
              }
              return invItem;
            })
            .filter((item): item is Item => item !== null);

          updateInventory(newInventory);

          // THEN send to AI for narrative
          const aiMessage = `[SYSTEM ACTION: Spieler benutzte ${item.name}. ${result.message}. State bereits aktualisiert. Erzähle die Geschichte weiter.]`;
          chatLogic.sendPrompt(aiMessage, { updateInput: false });
        } else {
          // Item requires AI processing (weapons, armor, special items)
          handleAction(`Benutze ${item.name}`);
        }
      } catch (error) {
        console.error("[GamePage] handleUseItem error:", error);
        showNotification("❌ Fehler beim Benutzen des Items");
      }
    },
    [
      gameEngine,
      updateSurvival,
      updateInventory,
      gameState.inventory,
      chatLogic,
      handleAction,
      showNotification,
    ],
  );

  const handleCombatAction = useCallback(
    (action: string) => {
      // CLIENT-SIDE: Calculate damage instantly for attacks
      if (
        action.toLowerCase().includes("angriff") &&
        gameState.combat.active &&
        gameState.combat.enemies.length > 0
      ) {
        const damage = gameEngine.calculateDamage(gameState.level, 10);
        const targetEnemy = gameState.combat.enemies[0]; // First alive enemy

        if (!targetEnemy) {
          handleAction(action);
          return;
        }

        // Apply damage client-side
        const combatResult = gameEngine.applyEnemyDamage(
          gameState.combat.enemies,
          targetEnemy.id,
          damage,
        );

        // Update combat state instantly
        updateCombat({
          enemies: combatResult.updatedEnemies,
          active: !combatResult.combatEnded,
        });

        // Show instant feedback
        if (combatResult.killedEnemy) {
          showNotification(`💀 ${combatResult.killedEnemy.name} besiegt!`);

          // Combat ended?
          if (combatResult.combatEnded) {
            const victoryMessage = `[COMBAT: Alle Gegner besiegt! Erzähle Siegesszene.]`;
            chatLogic.sendPrompt(victoryMessage, { updateInput: false });
          } else {
            const killMessage = `[COMBAT: ${combatResult.killedEnemy.name} wurde besiegt. ${damage} Schaden. Fahre mit Kampf fort.]`;
            chatLogic.sendPrompt(killMessage, { updateInput: false });
          }
        } else {
          showNotification(`⚔️ ${damage} Schaden an ${targetEnemy.name}`, 1500);

          const combatMessage = `[COMBAT: ${damage} Schaden an ${targetEnemy.name}. ${targetEnemy.name} HP: ${combatResult.updatedEnemies[0]?.hp}/${targetEnemy.maxHp}. Erzähle Kampfgeschehen.]`;
          chatLogic.sendPrompt(combatMessage, { updateInput: false });
        }
      } else {
        handleAction(action);
      }
    },
    [
      handleAction,
      gameEngine,
      gameState.level,
      gameState.combat,
      chatLogic,
      updateCombat,
      showNotification,
    ],
  );

  // DISABLED: Quick actions no longer needed with HP-only system
  // const handleQuickAction = useCallback(
  //   (action: "eat" | "drink" | "rest") => {
  //     // Simplified system - removed
  //   },
  //   [],
  // );

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
            {/* Survival Quick Actions - DISABLED (simplified to HP-only system) */}
            {/* {chatLogic.messages.length > 0 && (
              <SurvivalQuickActions
                state={gameState}
                onQuickAction={handleQuickAction}
                isLoading={chatLogic.isLoading}
              />
            )} */}

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
