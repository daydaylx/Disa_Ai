import { ChevronLeft, History, Menu, PanelRightClose, PanelRightOpen, X } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useSidepanel } from "../../app/state/SidepanelContext";
import type { Conversation } from "../../lib/conversation-manager";
import { getAllConversations } from "../../lib/conversation-manager";
import { cn } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface NavigationItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationSidepanelProps {
  items: NavigationItem[];
  children?: ReactNode;
  className?: string;
}

type PanelMode = "expanded" | "compact";

const EXPANDED_WIDTH = 248;
const COMPACT_WIDTH = 88;
// Unterstützt Swipe-Gesten + dezente Bedienelemente
const PANEL_MODE_STORAGE_KEY = "disa:ui:sidepanelMode";
const VERTICAL_CANCEL_DISTANCE = 28;
const SWIPE_DISTANCE_THRESHOLD = 56;
const SWIPE_VELOCITY_THRESHOLD = 0.35;

export function NavigationSidepanel({ items, children, className }: NavigationSidepanelProps) {
  const { isOpen, isAnimating, openPanel, closePanel, togglePanel } = useSidepanel();
  const [dragOffset, setDragOffset] = useState(0);
  const [dragType, setDragType] = useState<"open" | "close" | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>(() => {
    if (typeof window === "undefined") return "compact";
    try {
      const stored = localStorage.getItem(PANEL_MODE_STORAGE_KEY) as PanelMode | null;
      return stored === "expanded" ? "expanded" : "compact";
    } catch {
      return "compact";
    }
  });
  const [historyPreviews, setHistoryPreviews] = useState<Conversation[]>(() => {
    if (typeof window === "undefined") return [] as Conversation[];
    try {
      return getAllConversations().slice(0, 3);
    } catch {
      return [] as Conversation[];
    }
  });

  const panelWidth = panelMode === "compact" ? COMPACT_WIDTH : EXPANDED_WIDTH;
  const isCompact = panelMode === "compact";

  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const focusTimeoutRef = useRef<number | null>(null);
  const dragStateRef = useRef({
    active: false,
    type: null as "open" | "close" | null,
    startX: 0,
    startY: 0,
    pointerId: -1,
    startTime: 0,
  });
  const navigate = useNavigate();

  const wrapWithTooltip = (label: string, node: ReactElement) =>
    isCompact ? (
      <Tooltip>
        <TooltipTrigger asChild>{node}</TooltipTrigger>
        <TooltipContent side="left">{label}</TooltipContent>
      </Tooltip>
    ) : (
      node
    );

  const renderNavLink = (item: NavigationItem | undefined, key: string) => {
    if (!item) return null;

    const content = (
      <NavLink to={item.to} onClick={closePanel} aria-label={item.label}>
        {({ isActive }) => {
          const containerClasses = cn(
            "flex items-center gap-2 rounded-md border border-border/40 bg-surface-1/70 px-3 py-2 text-sm font-medium transition-colors duration-150",
            "sidepanel-focus-visible group",
            isCompact && "justify-center px-2",
            isActive
              ? "border-brand/50 bg-brand/12 text-text-strong"
              : "text-text-2 hover:border-border hover:bg-surface-2/60 hover:text-text-strong",
          );
          const labelClasses = cn("truncate", isCompact && "sr-only");
          const iconClasses = cn(
            "h-4 w-4 flex-shrink-0 opacity-80 transition-transform duration-150",
            "group-hover:scale-110",
            isActive && "text-brand",
          );
          return (
            <div className={containerClasses} aria-current={isActive ? "page" : undefined}>
              <item.icon className={iconClasses} aria-hidden="true" />
              <span className={labelClasses}>{item.label}</span>
            </div>
          );
        }}
      </NavLink>
    );

    return <li key={key}>{wrapWithTooltip(item.label, content as ReactElement)}</li>;
  };

  const openHistoryPanel = useCallback(() => {
    void navigate("/chat", { state: { openHistory: true } });
    closePanel();
  }, [navigate, closePanel]);

  const openConversation = useCallback(
    (conversationId: string) => {
      void navigate("/chat", { state: { conversationId } });
      closePanel();
    },
    [navigate, closePanel],
  );

  const renderHistoryPreview = (conversation: Conversation) => {
    const button = (
      <button
        type="button"
        onClick={() => openConversation(conversation.id)}
        className={cn(
          "bg-surface-1/60 flex items-center gap-2 rounded-md border border-border/35 px-3 py-2 text-xs transition-colors duration-150",
          "hover:bg-surface-2/60 text-text-2 hover:border-border hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
          isCompact && "justify-center px-2",
        )}
      >
        <History className="h-4 w-4 flex-shrink-0 text-brand" aria-hidden="true" />
        <span className={cn("truncate text-left", isCompact && "sr-only")}>
          {conversation.title}
        </span>
      </button>
    );
    return <li key={conversation.id}>{wrapWithTooltip(conversation.title, button)}</li>;
  };

  const renderActionButton = (
    key: string,
    label: string,
    description: string,
    onClick: () => void,
  ) => {
    const button = (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "bg-surface-1/60 flex items-center gap-2 rounded-md border border-border/35 px-3 py-2 text-sm font-medium transition-colors duration-150",
          "hover:bg-surface-2/60 text-text-2 hover:border-border hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
          isCompact && "justify-center px-2",
        )}
      >
        <History className="h-4 w-4 flex-shrink-0 text-brand" aria-hidden="true" />
        <span className={cn("truncate", isCompact && "sr-only")}>{label}</span>
      </button>
    );

    return (
      <div key={key} className="space-y-1">
        {wrapWithTooltip(label, button)}
        {!isCompact && description && (
          <p className="text-[11px] leading-5 text-text-subtle">{description}</p>
        )}
      </div>
    );
  };

  const renderNavSection = (
    id: string,
    label: string,
    content: React.ReactNode,
    description?: string,
  ) => (
    <section key={id} aria-labelledby={id} className="space-y-2">
      <div className="flex flex-col gap-1">
        <h3
          id={id}
          className={cn(
            "text-[11px] font-semibold uppercase tracking-[0.18em] text-text-subtle",
            isCompact && "sr-only",
          )}
        >
          {label}
        </h3>
        {!isCompact && description && (
          <p className="text-text-subtle/80 text-xs leading-5">{description}</p>
        )}
      </div>
      <div>{content}</div>
    </section>
  );

  const togglePanelMode = useCallback(() => {
    setPanelMode((prev) => (prev === "compact" ? "expanded" : "compact"));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closePanel();
      }

      if (event.key === "Tab" && isOpen && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closePanel]);

  // Focus management
  useEffect(() => {
    if (focusTimeoutRef.current !== null && typeof window !== "undefined") {
      window.clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = null;
    }

    if (isOpen) {
      if (typeof window !== "undefined") {
        focusTimeoutRef.current = window.setTimeout(() => {
          closeButtonRef.current?.focus();
          focusTimeoutRef.current = null;
        }, 100);
      }
    } else {
      menuButtonRef.current?.focus();
    }

    return () => {
      if (focusTimeoutRef.current !== null && typeof window !== "undefined") {
        window.clearTimeout(focusTimeoutRef.current);
        focusTimeoutRef.current = null;
      }
    };
  }, [isOpen]);

  // Persist panel mode preference
  useEffect(() => {
    try {
      localStorage.setItem(PANEL_MODE_STORAGE_KEY, panelMode);
    } catch {
      /* ignore storage errors */
    }
    // Reset drag offset when switching modes
    setDragOffset(0);
    setDragType(null);
  }, [panelMode]);

  // Refresh history previews once panel opens
  useEffect(() => {
    if (!isOpen) return;
    try {
      setHistoryPreviews(getAllConversations().slice(0, 3));
    } catch {
      setHistoryPreviews([]);
    }
  }, [isOpen]);

  useEffect(() => {
    setDragOffset(0);
    setDragType(null);
  }, [isOpen]);

  useEffect(() => {
    const panelEl = panelRef.current;
    const overlayEl = overlayRef.current;
    const edgeEl = edgeRef.current;

    if (!panelEl || !overlayEl) return;

    const activeState = dragStateRef.current;

    const shouldIgnoreTarget = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return false;
      return Boolean(target.closest("button, a, input, textarea, select, label"));
    };

    const beginDrag = (event: PointerEvent, type: "open" | "close") => {
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      if (type === "open" && isOpen) return;
      if (type === "close" && !isOpen) return;
      if (shouldIgnoreTarget(event)) return;

      activeState.active = true;
      activeState.type = type;
      activeState.startX = event.clientX;
      activeState.startY = event.clientY;
      activeState.pointerId = event.pointerId;
      activeState.startTime = performance.now();
      setDragType(type);
      setDragOffset(0);
    };

    const endDrag = (commit: boolean) => {
      if (!activeState.active || !activeState.type) return;
      const intent = activeState.type;
      activeState.active = false;
      activeState.type = null;
      activeState.pointerId = -1;
      activeState.startTime = 0;
      setDragOffset(0);
      setDragType(null);

      if (!commit) return;

      if (intent === "close") {
        closePanel();
      } else if (intent === "open") {
        openPanel();
      }
    };

    const handlePointerDownPanel = (event: PointerEvent) => beginDrag(event, "close");
    const handlePointerDownOverlay = (event: PointerEvent) => beginDrag(event, "close");
    const handlePointerDownEdge = (event: PointerEvent) => beginDrag(event, "open");

    const handlePointerMove = (event: PointerEvent) => {
      if (!activeState.active || activeState.pointerId !== event.pointerId || !activeState.type) {
        return;
      }

      const deltaX = event.clientX - activeState.startX;
      const deltaY = event.clientY - activeState.startY;

      if (Math.abs(deltaY) > VERTICAL_CANCEL_DISTANCE && Math.abs(deltaY) > Math.abs(deltaX)) {
        activeState.active = false;
        activeState.type = null;
        setDragOffset(0);
        setDragType(null);
        return;
      }

      if (activeState.type === "close") {
        const offset = Math.max(0, deltaX);
        setDragOffset((prev) => (prev === offset ? prev : Math.min(offset, panelWidth)));
      } else if (activeState.type === "open") {
        const offset = Math.min(0, deltaX);
        setDragOffset((prev) => (prev === offset ? prev : Math.max(offset, -panelWidth)));
      }
    };

    const handlePointerEnd = (event: PointerEvent) => {
      if (!activeState.active || activeState.pointerId !== event.pointerId || !activeState.type) {
        return;
      }

      const deltaX = event.clientX - activeState.startX;
      const durationMs = Math.max(1, performance.now() - activeState.startTime);
      const velocity = Math.abs(deltaX) / durationMs;

      if (activeState.type === "close") {
        const distancePassed = Math.max(0, deltaX);
        const shouldCommit =
          distancePassed >= Math.min(panelWidth * 0.4, SWIPE_DISTANCE_THRESHOLD) ||
          velocity > SWIPE_VELOCITY_THRESHOLD;
        endDrag(shouldCommit);
      } else if (activeState.type === "open") {
        const distancePassed = Math.min(0, deltaX);
        const shouldCommit =
          Math.abs(distancePassed) >= Math.min(panelWidth * 0.45, SWIPE_DISTANCE_THRESHOLD) ||
          velocity > SWIPE_VELOCITY_THRESHOLD;
        endDrag(shouldCommit);
      } else {
        endDrag(false);
      }
    };

    panelEl.addEventListener("pointerdown", handlePointerDownPanel, { passive: true });
    overlayEl.addEventListener("pointerdown", handlePointerDownOverlay, { passive: true });
    edgeEl?.addEventListener("pointerdown", handlePointerDownEdge, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerEnd, { passive: true });
    window.addEventListener("pointercancel", handlePointerEnd, { passive: true });

    return () => {
      panelEl.removeEventListener("pointerdown", handlePointerDownPanel);
      overlayEl.removeEventListener("pointerdown", handlePointerDownOverlay);
      edgeEl?.removeEventListener("pointerdown", handlePointerDownEdge);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [isOpen, panelWidth, openPanel, closePanel]);

  // Calculate transform based on state
  const getTransform = () => {
    if (dragType === "close") {
      const offset = Math.min(panelWidth, Math.max(0, dragOffset));
      return `translateX(${offset}px)`;
    }
    if (dragType === "open") {
      const offset = Math.max(0, panelWidth + Math.min(0, dragOffset));
      return `translateX(${offset}px)`;
    }
    return isOpen ? "translateX(0)" : `translateX(${panelWidth}px)`;
  };

  const getOverlayOpacity = () => {
    if (dragType === "close") {
      const progress = Math.min(1, Math.max(0, dragOffset / panelWidth));
      return Math.max(0, 1 - progress);
    }
    if (dragType === "open") {
      const progress = Math.min(1, Math.abs(dragOffset) / panelWidth);
      return progress;
    }
    return isOpen ? 1 : 0;
  };

  return (
    <TooltipProvider>
      <>
        {/* Menu Button - Hidden on mobile, only edge swipe available */}
        <button
          ref={menuButtonRef}
          onClick={togglePanel}
          className={cn(
            "bg-surface-1/80 supports-[backdrop-filter]:bg-surface-1/70 fixed z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-border/60 text-text-2 shadow-sm backdrop-blur-md transition-colors duration-150",
            "hover:border-border hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
            "touch-target sidepanel-focus-visible",
            className,
          )}
          style={{
            top: "calc(env(safe-area-inset-top, 0px) + 0.75rem)",
            right: "calc(env(safe-area-inset-right, 0px) + 0.75rem)",
          }}
          aria-label={isOpen ? "Navigation schließen" : "Navigation öffnen"}
          aria-expanded={isOpen}
          aria-controls="navigation-sidepanel"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Dezenter Handle-Button am rechten Rand (nur wenn Panel geschlossen ist) */}
        {!isOpen && (
          <button
            type="button"
            onClick={openPanel}
            className={cn(
              "glass-chrome fixed right-1 top-1/2 z-40 hidden -translate-y-1/2 items-center justify-center rounded-full",
              "text-text-muted opacity-70 transition-all duration-200 hover:text-text-strong hover:opacity-100",
              "h-24 w-8 md:hidden",
            )}
            aria-label="Navigation öffnen"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        )}

        <div
          ref={edgeRef}
          className={cn(
            "sidepanel-touch-area fixed inset-y-0 right-0 z-30 touch-pan-y md:hidden",
            isOpen ? "hidden" : "block",
          )}
          aria-hidden="true"
        />

        {/* Overlay */}
        <div
          ref={overlayRef}
          className={cn(
            "sidepanel-overlay-transition sidepanel-no-select fixed inset-0 z-40 touch-none",
            isOpen || dragType === "close" ? "pointer-events-auto" : "pointer-events-none",
          )}
          style={{
            opacity: getOverlayOpacity(),
            backgroundColor: "rgba(var(--glass-bg), var(--glass-alpha-overlay))",
            backdropFilter:
              getOverlayOpacity() > 0 ? "blur(var(--glass-blur-sm)) saturate(110%)" : "none",
            WebkitBackdropFilter:
              getOverlayOpacity() > 0 ? "blur(var(--glass-blur-sm)) saturate(110%)" : "none",
          }}
          onClick={closePanel}
          aria-hidden="true"
        />

        {/* Sidepanel */}
        <aside
          ref={panelRef}
          id="navigation-sidepanel"
          className={cn(
            "glass-panel fixed right-0 top-0 z-50 flex h-full touch-pan-y flex-col",
            "sidepanel-container sidepanel-safe-area sidepanel-border",
            "transition-[width] duration-300 ease-out",
            isAnimating && "sidepanel-transition",
            isCompact && "sidepanel-compact",
          )}
          style={{
            width: `${panelWidth}px`,
            transform: getTransform(),
          }}
          aria-label="Hauptnavigation"
          role="navigation"
        >
          {/* Header */}
          <div className="bg-surface-0/60 flex items-center justify-between gap-2 border-b border-border/40 p-3.5">
            <h2
              className={cn(
                "text-sm font-semibold uppercase tracking-[0.16em] text-text-subtle",
                isCompact && "sr-only",
              )}
            >
              Navigation
            </h2>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={togglePanelMode}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border border-transparent",
                      "hover:bg-surface-1/70 text-text-2 hover:border-border hover:text-text-strong",
                      "touch-target transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1",
                    )}
                    aria-label={isCompact ? "Navigation erweitern" : "Navigation kompakt anzeigen"}
                    aria-pressed={isCompact}
                  >
                    {isCompact ? (
                      <PanelRightOpen className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PanelRightClose className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isCompact ? "Ansicht erweitern" : "Komprimierte Ansicht"}
                </TooltipContent>
              </Tooltip>
              <button
                ref={closeButtonRef}
                onClick={closePanel}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border border-transparent",
                  "hover:bg-surface-1/70 text-text-2 hover:border-border hover:text-text-strong",
                  "touch-target transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1",
                )}
                aria-label="Navigation schließen"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="sidepanel-scroll flex-1 space-y-4 overflow-y-auto p-4">
            {renderNavSection(
              "sidepanel-navigation",
              "Bereiche",
              <ul className="space-y-1" role="list">
                {items.map((item) => renderNavLink(item, item.to))}
              </ul>,
              "Hauptfunktionen im schnellen Zugriff.",
            )}

            {renderNavSection(
              "sidepanel-history",
              "Verlauf",
              <div className="space-y-2">
                {renderActionButton(
                  "history-open",
                  "Gespeicherte Unterhaltungen",
                  "Öffnet die Übersicht deiner gespeicherten Gespräche.",
                  openHistoryPanel,
                )}
                {!isCompact && historyPreviews.length > 0 && (
                  <ul className="space-y-1" role="list">
                    {historyPreviews.map((conversation) => renderHistoryPreview(conversation))}
                  </ul>
                )}
                {!isCompact && historyPreviews.length === 0 && (
                  <p className="text-xs leading-5 text-text-subtle">
                    Noch keine Gespräche gespeichert.
                  </p>
                )}
              </div>,
            )}
          </nav>

          {/* Footer content */}
          {children && (
            <div className="border-t border-border/40 p-4 text-xs text-text-subtle">{children}</div>
          )}
        </aside>
      </>
    </TooltipProvider>
  );
}
