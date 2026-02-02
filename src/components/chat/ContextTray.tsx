import { useCallback, useEffect, useRef, useState } from "react";

import { useModelCatalog } from "@/contexts/ModelCatalogContext";
import { useRoles } from "@/contexts/RolesContext";
import { useSettings } from "@/hooks/useSettings";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { Cpu, RotateCcw, X } from "@/lib/icons";
import { TouchGestureHandler } from "@/lib/touch/gestures";
import { cn } from "@/lib/utils";
import type { DiscussionPresetKey } from "@/prompts/discussion/presets";
import { Button } from "@/ui/Button";

// Define is three snap states for tray
type TrayState = "collapsed" | "peek" | "expanded";

interface ContextTrayProps {
  isOpen?: boolean;
  onStateChange?: (state: TrayState) => void;
  className?: string;
}

export function ContextTray({ isOpen = true, onStateChange, className }: ContextTrayProps) {
  const { activeRole, setActiveRole, roles } = useRoles();
  const { models } = useModelCatalog();
  const { settings, setCreativity, setDiscussionPreset, setPreferredModel } = useSettings();
  const viewport = useVisualViewport();

  const [trayState, setTrayState] = useState<TrayState>("collapsed");
  const [showFirstStartHint, setShowFirstStartHint] = useState(false);
  const trayRef = useRef<HTMLDivElement>(null);
  const gestureHandlerRef = useRef<TouchGestureHandler | null>(null);

  // Check first-start hint
  useEffect(() => {
    const hasSeenHint = localStorage.getItem("contextTrayFirstStartHint");
    if (!hasSeenHint && isOpen) {
      // Show hint after a short delay
      const timer = setTimeout(() => {
        setShowFirstStartHint(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen]);

  // Dismiss first-start hint
  const dismissFirstStartHint = () => {
    setShowFirstStartHint(false);
    localStorage.setItem("contextTrayFirstStartHint", "true");
  };

  // Handle swipe up to cycle through states
  const handleSwipeUp = useCallback(() => {
    const nextState: TrayState =
      trayState === "collapsed" ? "peek" : trayState === "peek" ? "expanded" : "expanded";

    setTrayState(nextState);
    onStateChange?.(nextState);
  }, [trayState, onStateChange]);

  // Handle swipe down to cycle through states backwards
  const handleSwipeDown = useCallback(() => {
    const prevState: TrayState =
      trayState === "expanded" ? "peek" : trayState === "peek" ? "collapsed" : "collapsed";

    setTrayState(prevState);
    onStateChange?.(prevState);
  }, [trayState, onStateChange]);

  // Snap points heights
  const SNAP_POINTS = {
    collapsed: 40, // ~28-40px as specified
    peek: 180, // ~160-220px as specified
    expanded: "75vh", // ~70-85% viewport as specified
  };

  // Current height based on state
  const currentHeight = SNAP_POINTS[trayState];

  // Handle keyboard interaction - close tray when keyboard opens
  useEffect(() => {
    if (viewport.isKeyboardOpen && trayState !== "collapsed") {
      setTrayState("collapsed");
      onStateChange?.("collapsed");
    }
  }, [viewport.isKeyboardOpen, trayState, onStateChange]);

  // Initialize gesture handler
  useEffect(() => {
    if (!trayRef.current) {
      return undefined;
    }

    gestureHandlerRef.current = new TouchGestureHandler(trayRef.current, {
      swipeThreshold: 30,
      preventDefaultSwipe: true,
    })
      .onSwipeGesture((event) => {
        if (event.direction === "up") {
          handleSwipeUp();
        } else if (event.direction === "down") {
          handleSwipeDown();
        }
      })
      .onTapGesture(() => {
        if (trayState === "collapsed") {
          setTrayState("peek");
          onStateChange?.("peek");
        }
      });

    return () => {
      gestureHandlerRef.current?.destroy();
    };
  }, [trayState, onStateChange, handleSwipeUp, handleSwipeDown]);

  // Close tray when clicking outside
  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(event.target as Node)) {
        setTrayState("collapsed");
        onStateChange?.("collapsed");
      }
    },
    [onStateChange],
  );

  // Add click outside listener
  useEffect(() => {
    if (isOpen && trayState !== "collapsed") {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, trayState, handleOutsideClick]);

  // Generate context summary for collapsed state
  const getContextSummary = () => {
    const roleLabel = activeRole?.name || "Standard";
    const creativityOptions = [
      { value: "10", label: "Präzise", short: "Präzise" },
      { value: "30", label: "Klar", short: "Klar" },
      { value: "45", label: "Ausgewogen", short: "Ausgew." },
      { value: "70", label: "Kreativ", short: "Kreativ" },
      { value: "90", label: "Verspielt", short: "Versp." },
    ];
    const creativityOption = creativityOptions.find(
      (option) => option.value === String(settings.creativity),
    );
    const creativityShortLabel = creativityOption?.short || `${settings.creativity}%`;

    const discussionPresetOptions = [
      { key: "locker_neugierig" as DiscussionPresetKey, label: "Locker", short: "Locker" },
      { key: "edgy_provokant" as DiscussionPresetKey, label: "Edgy", short: "Edgy" },
      { key: "nuechtern_pragmatisch" as DiscussionPresetKey, label: "Nüchtern", short: "Nüchtern" },
      { key: "akademisch_formell" as DiscussionPresetKey, label: "Akademisch", short: "Akad." },
      { key: "freundlich_offen" as DiscussionPresetKey, label: "Freundlich", short: "Freundl." },
      { key: "analytisch_detailliert" as DiscussionPresetKey, label: "Analytisch", short: "Anal." },
      { key: "sarkastisch_witzig" as DiscussionPresetKey, label: "Sarkastisch", short: "Sark." },
      { key: "fachlich_tiefgehend" as DiscussionPresetKey, label: "Fachlich", short: "Fachl." },
    ];
    const discussionPreset = discussionPresetOptions.find(
      (preset) => preset.key === settings.discussionPreset,
    );
    const discussionPresetLabel = discussionPreset?.short || "Standard";

    const selectedModel = models?.find((m) => m.id === settings.preferredModelId);
    const modelLabel =
      selectedModel?.label?.split("/").pop() || selectedModel?.id?.split("/").pop() || "Modell";

    return `${roleLabel} · ${discussionPresetLabel} · ${creativityShortLabel} · ${modelLabel}`;
  };

  // Quick controls for peek state
  const QuickControls = () => {
    const creativityOptions = [
      { value: "10", label: "Präzise", short: "Präzise" },
      { value: "30", label: "Klar", short: "Klar" },
      { value: "45", label: "Ausgewogen", short: "Ausgew." },
      { value: "70", label: "Kreativ", short: "Kreativ" },
      { value: "90", label: "Verspielt", short: "Versp." },
    ];
    const creativityOption = creativityOptions.find(
      (option) => option.value === String(settings.creativity),
    );
    const creativityShortLabel = creativityOption?.short || `${settings.creativity}%`;

    const discussionPresetOptions = [
      { key: "locker_neugierig" as DiscussionPresetKey, label: "Locker", short: "Locker" },
      { key: "edgy_provokant" as DiscussionPresetKey, label: "Edgy", short: "Edgy" },
      { key: "nuechtern_pragmatisch" as DiscussionPresetKey, label: "Nüchtern", short: "Nüchtern" },
      { key: "akademisch_formell" as DiscussionPresetKey, label: "Akademisch", short: "Akad." },
      { key: "freundlich_offen" as DiscussionPresetKey, label: "Freundlich", short: "Freundl." },
      { key: "analytisch_detailliert" as DiscussionPresetKey, label: "Analytisch", short: "Anal." },
      { key: "sarkastisch_witzig" as DiscussionPresetKey, label: "Sarkastisch", short: "Sark." },
      { key: "fachlich_tiefgehend" as DiscussionPresetKey, label: "Fachlich", short: "Fachl." },
    ];
    const discussionPreset = discussionPresetOptions.find(
      (preset) => preset.key === settings.discussionPreset,
    );
    const discussionPresetLabel = discussionPreset?.short || "Standard";

    const selectedModel = models?.find((m) => m.id === settings.preferredModelId);
    const modelLabel =
      selectedModel?.label?.split("/").pop()?.slice(0, 8) ||
      selectedModel?.id?.split("/").pop()?.slice(0, 8) ||
      "Modell";

    return (
      <div className="w-full space-y-3">
        {/* Quick Bar - 4 Controls prominent */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTrayState("expanded")}
            className="cursor-pointer"
          >
            {activeRole?.name || "Standard"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTrayState("expanded")}
            className="cursor-pointer"
          >
            {discussionPresetLabel}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTrayState("expanded")}
            className="cursor-pointer"
          >
            {creativityShortLabel}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTrayState("expanded")}
            className="cursor-pointer"
          >
            {modelLabel}
          </Button>
        </div>

        {/* Utility Row */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Reset to defaults
              setActiveRole(null);
              setDiscussionPreset("locker_neugierig");
              setCreativity(45);
              setPreferredModel(models?.[0]?.id || "");
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Expanded view with tabs
  const ExpandedView = () => {
    const [activeTab, setActiveTab] = useState<"role" | "style" | "output" | "model">("role");

    const creativityOptions = [
      { value: "10", label: "Präzise (10%)", short: "Präzise" },
      { value: "30", label: "Klar & fokussiert (30%)", short: "Klar" },
      { value: "45", label: "Ausgewogen (45%)", short: "Ausgewogen" },
      { value: "70", label: "Kreativ (70%)", short: "Kreativ" },
      { value: "90", label: "Verspielt (90%)", short: "Verspielt" },
    ];

    const discussionPresetOptions = [
      {
        key: "locker_neugierig" as DiscussionPresetKey,
        label: "Locker & neugierig",
        short: "Locker",
      },
      { key: "edgy_provokant" as DiscussionPresetKey, label: "Edgy & provokant", short: "Edgy" },
      {
        key: "nuechtern_pragmatisch" as DiscussionPresetKey,
        label: "Nüchtern & pragmatisch",
        short: "Nüchtern",
      },
      {
        key: "akademisch_formell" as DiscussionPresetKey,
        label: "Akademisch & formell",
        short: "Akademisch",
      },
      {
        key: "freundlich_offen" as DiscussionPresetKey,
        label: "Freundlich & offen",
        short: "Freundlich",
      },
      {
        key: "analytisch_detailliert" as DiscussionPresetKey,
        label: "Analytisch & detailliert",
        short: "Analytisch",
      },
      {
        key: "sarkastisch_witzig" as DiscussionPresetKey,
        label: "Sarkastisch & witzig",
        short: "Sarkastisch",
      },
      {
        key: "fachlich_tiefgehend" as DiscussionPresetKey,
        label: "Fachlich & tiefgehend",
        short: "Fachlich",
      },
    ];

    const renderTabContent = () => {
      switch (activeTab) {
        case "role":
          return (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-ink-primary">Rolle</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveRole(null)}
                  className="text-xs"
                >
                  Zurücksetzen
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div
                  className={cn(
                    "p-3 rounded-xl border cursor-pointer transition-all",
                    !activeRole && "border-accent-chat bg-accent-chat/10",
                  )}
                  onClick={() => setActiveRole(null)}
                >
                  <div className="font-medium">Standard</div>
                  <div className="text-sm text-ink-secondary">Keine spezielle Rolle</div>
                </div>
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all",
                      activeRole?.id === role.id && "border-accent-chat bg-accent-chat/10",
                    )}
                    onClick={() => setActiveRole(role)}
                  >
                    <div className="font-medium">{role.name}</div>
                    <div className="text-sm text-ink-secondary line-clamp-2">
                      {role.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case "style":
          return (
            <div className="space-y-3">
              <h3 className="font-medium text-ink-primary">Stil</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {discussionPresetOptions.map((preset) => (
                  <div
                    key={preset.key}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all",
                      settings.discussionPreset === preset.key &&
                        "border-accent-chat bg-accent-chat/10",
                    )}
                    onClick={() => setDiscussionPreset(preset.key)}
                  >
                    <div className="font-medium">{preset.label}</div>
                    <div className="text-sm text-ink-secondary">
                      {preset.key === "locker_neugierig" && "entspannt, humorvoll, neugierig"}
                      {preset.key === "edgy_provokant" && "direkt, herausfordernd, pointiert"}
                      {preset.key === "nuechtern_pragmatisch" && "nüchtern, sachlich, effizient"}
                      {preset.key === "akademisch_formell" && "formell, strukturiert, fundiert"}
                      {preset.key === "freundlich_offen" && "warm, einladend, verständnisvoll"}
                      {preset.key === "analytisch_detailliert" &&
                        "gründlich, strukturiert, präzise"}
                      {preset.key === "sarkastisch_witzig" && "witzig, ironisch, unterhaltsam"}
                      {preset.key === "fachlich_tiefgehend" && "technisch, detailliert, fundiert"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case "output":
          return (
            <div className="space-y-3">
              <h3 className="font-medium text-ink-primary">Kreativität</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {creativityOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all",
                      settings.creativity === Number(option.value) &&
                        "border-accent-chat bg-accent-chat/10",
                    )}
                    onClick={() => setCreativity(Number(option.value))}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-ink-secondary">
                      {Number(option.value) <= 30 && "Sehr präzise, fokussierte Antworten"}
                      {Number(option.value) > 30 &&
                        Number(option.value) <= 60 &&
                        "Ausgewogene Kreativität"}
                      {Number(option.value) > 60 && "Hohe Kreativität, kreative Lösungen"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case "model":
          return (
            <div className="space-y-3">
              <h3 className="font-medium text-ink-primary">KI-Modell</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {models?.map((model) => (
                  <div
                    key={model.id}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all",
                      settings.preferredModelId === model.id &&
                        "border-accent-chat bg-accent-chat/10",
                    )}
                    onClick={() => setPreferredModel(model.id)}
                  >
                    <div className="font-medium">{model.label || model.id}</div>
                    <div className="text-sm text-ink-secondary">
                      {model.description || model.id.split("/").pop()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="w-full h-full flex flex-col">
        {/* Segmented Tabs */}
        <div className="flex border-b border-white/10 mb-4">
          <button
            className={cn(
              "flex-1 py-2 text-sm font-medium px-4",
              activeTab === "role" && "text-accent-chat border-b-2 border-accent-chat",
            )}
            onClick={() => setActiveTab("role")}
          >
            Rolle
          </button>
          <button
            className={cn(
              "flex-1 py-2 text-sm font-medium px-4",
              activeTab === "style" && "text-accent-chat border-b-2 border-accent-chat",
            )}
            onClick={() => setActiveTab("style")}
          >
            Stil
          </button>
          <button
            className={cn(
              "flex-1 py-2 text-sm font-medium px-4",
              activeTab === "output" && "text-accent-chat border-b-2 border-accent-chat",
            )}
            onClick={() => setActiveTab("output")}
          >
            Ausgabe
          </button>
          <button
            className={cn(
              "flex-1 py-2 text-sm font-medium px-4",
              activeTab === "model" && "text-accent-chat border-b-2 border-accent-chat",
            )}
            onClick={() => setActiveTab("model")}
          >
            Modell
          </button>
        </div>

        {/* Content area with search and list */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="p-2">{renderTabContent()}</div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* First-Start Hint Banner */}
      {showFirstStartHint && trayState === "collapsed" && (
        <div
          className={cn(
            "fixed bottom-[calc(40px+max(env(safe-area-inset-bottom,20px),20px)+8px)]",
            "left-4 right-4 z-bottom-sheet-plus-1",
            "animate-slide-up",
          )}
        >
          <div className="bg-surface-1/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="h-8 w-8 rounded-full bg-accent-chat/20 flex items-center justify-center">
                  <Cpu className="h-4 w-4 text-accent-chat" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-ink-primary mb-1">Swipe-Up für Kontext</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Tippe oder swipe nach oben, um Rolle, Stil und Kreativität anzupassen.
                </p>
              </div>
              <button
                onClick={dismissFirstStartHint}
                className="flex-shrink-0 p-1 text-ink-tertiary hover:text-ink-primary transition-colors"
                aria-label="Hinweis schließen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={trayRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-bottom-sheet bg-surface-1 border-t border-white/10",
          "transition-all duration-300 ease-out",
          className,
        )}
        style={{
          height: typeof currentHeight === "number" ? `${currentHeight}px` : currentHeight,
          paddingBottom: `max(env(safe-area-inset-bottom, 20px), 20px)`,
          transform: trayState === "collapsed" ? "translateY(0)" : "translateY(0)",
        }}
      >
        {/* Drag Handle */}
        <div className="w-full py-2 flex justify-center touch-none">
          <div className="h-[4px] w-12 bg-white/30 rounded-full touch-none" />
        </div>

        {/* Content based on state */}
        <div className="px-4 pb-4 h-full">
          {trayState === "collapsed" && (
            <div
              className="py-2 cursor-pointer"
              onClick={() => {
                setTrayState("peek");
                onStateChange?.("peek");
              }}
            >
              <p className="text-sm text-ink-secondary truncate">{getContextSummary()}</p>
            </div>
          )}

          {trayState === "peek" && <QuickControls />}

          {trayState === "expanded" && <ExpandedView />}
        </div>

        {/* Overlay when expanded */}
        {trayState !== "collapsed" && (
          <div
            className="fixed inset-0 bg-black/20 z-modal-backdrop backdrop-blur-sm"
            onClick={() => {
              setTrayState("collapsed");
              onStateChange?.("collapsed");
            }}
          />
        )}
      </div>
    </>
  );
}
