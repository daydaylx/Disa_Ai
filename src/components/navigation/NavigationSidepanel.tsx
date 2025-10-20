import { History, Menu, PanelRightClose, PanelRightOpen, X } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useSidepanel } from "../../app/state/SidepanelContext";
import type { Conversation } from "../../lib/conversation-manager";
import { getAllConversations } from "../../lib/conversation-manager";
import { TouchGestureHandler } from "../../lib/touch/gestures";
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

const EXPANDED_WIDTH = 280;
const COMPACT_WIDTH = 96;
const SWIPE_THRESHOLD = 40; // ~40px horizontal movement threshold
const VERTICAL_TOLERANCE = 30; // ~30px vertical tolerance
const SWIPE_VELOCITY_THRESHOLD = 0.5;
const EDGE_SWIPE_WIDTH = 20; // 20px edge area (within 16-24px requirement)
const PANEL_MODE_STORAGE_KEY = "disa:ui:sidepanelMode";

export function NavigationSidepanel({ items, children, className }: NavigationSidepanelProps) {
  const { isOpen, isAnimating, openPanel, closePanel, togglePanel } = useSidepanel();
  const [dragOffset, setDragOffset] = useState(0);
  const [panelMode, setPanelMode] = useState<PanelMode>(() => {
    if (typeof window === "undefined") return "expanded";
    try {
      const stored = localStorage.getItem(PANEL_MODE_STORAGE_KEY) as PanelMode | null;
      return stored === "compact" ? "compact" : "expanded";
    } catch {
      return "expanded";
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
  const overlayGestureRef = useRef<TouchGestureHandler | null>(null);
  const edgeGestureRef = useRef<TouchGestureHandler | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const chatItem = useMemo(() => items.find((item) => item.label === "Chat"), [items]);
  const rolesItem = useMemo(() => items.find((item) => item.label === "Rollen"), [items]);
  const modelsItem = useMemo(() => items.find((item) => item.label === "Modelle"), [items]);
  const settingsItem = useMemo(() => items.find((item) => item.label === "Einstellungen"), [items]);

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
            "flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-sm font-medium transition-all duration-200",
            "touch-target no-select sidepanel-focus-visible group",
            isCompact && "justify-center px-2 py-2",
            isActive
              ? "text-brand bg-brand/10 border-brand/30 shadow-sm"
              : "text-text-muted hover:text-text-strong hover:bg-hover-bg hover:border-border-strong/40",
          );
          const labelClasses = cn("truncate", isCompact && "sr-only");
          const iconClasses = cn(
            "h-5 w-5 flex-shrink-0 transition-transform duration-200",
            "group-hover:scale-110",
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
          "flex items-center gap-3 rounded-lg border border-border-subtle px-3 py-2 text-xs transition-all duration-200",
          "text-text-muted hover:border-border-strong/40 hover:bg-hover-bg hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-weak focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
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
          "flex items-center gap-3 rounded-lg border border-border-subtle px-3 py-2 text-sm font-medium transition-all duration-200",
          "text-text-muted hover:border-border-strong/40 hover:bg-hover-bg hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-weak focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0",
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
          <p className="text-xs leading-5 text-text-subtle">{description}</p>
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
    <section key={id} aria-labelledby={id} className="space-y-3">
      <div className="flex flex-col gap-1">
        <h3
          id={id}
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.24em] text-text-muted",
            isCompact && "sr-only",
          )}
        >
          {label}
        </h3>
        {!isCompact && description && (
          <p className="text-xs leading-5 text-text-subtle">{description}</p>
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
    if (isOpen) {
      // Focus the close button when panel opens
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      // Return focus to menu button when panel closes
      menuButtonRef.current?.focus();
    }
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

  // Touch gesture setup (overlay + edge swipe area)
  useEffect(() => {
    const overlayEl = overlayRef.current;
    const edgeEl = edgeRef.current;

    const setupGestureHandler = (element: HTMLElement | null) => {
      if (!element) return null;
      const handler = new TouchGestureHandler(element, {
        swipeThreshold: SWIPE_THRESHOLD, // Use 40px threshold
        preventDefaultSwipe: false,
      });
      handler.onSwipeGesture((swipeEvent) => {
        if (swipeEvent.direction === "left" && isOpen) {
          closePanel();
        } else if (swipeEvent.direction === "right" && !isOpen) {
          openPanel();
        }
      });
      return handler;
    };

    const overlayHandler = setupGestureHandler(overlayEl);
    const edgeHandler = setupGestureHandler(edgeEl);
    overlayGestureRef.current = overlayHandler;
    edgeGestureRef.current = edgeHandler;

    const setupDragHandlers = (element: HTMLElement | null, allowEdgeOpen = false) => {
      if (!element) return () => {};

      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let startTime = 0;

      const handleTouchStart = (event: TouchEvent) => {
        if (event.touches.length !== 1) return;

        startX = event.touches[0]!.clientX;
        startY = event.touches[0]!.clientY;
        currentX = startX;
        startTime = Date.now();
        isDragging = false;

        const screenWidth = window.innerWidth;
        // For edge swipe area, only start if touch is in the rightmost edge
        if (!isOpen && allowEdgeOpen && startX < screenWidth - EDGE_SWIPE_WIDTH) return;

        isDragging = true;
      };

      const handleTouchMove = (event: TouchEvent) => {
        if (!isDragging || event.touches.length !== 1) return;

        currentX = event.touches[0]!.clientX;
        const currentY = event.touches[0]!.clientY;
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        // Check vertical tolerance - if moved too much vertically, cancel gesture
        if (Math.abs(deltaY) > VERTICAL_TOLERANCE && Math.abs(deltaY) > Math.abs(deltaX)) {
          isDragging = false;
          setDragOffset(0);
          return;
        }

        if (isOpen) {
          const offset = Math.min(0, deltaX);
          setDragOffset(offset);
        } else {
          const offset = Math.max(0, deltaX);
          setDragOffset(offset);
        }
      };

      const handleTouchEnd = () => {
        if (!isDragging) return;

        const deltaX = currentX - startX;
        const duration = Date.now() - startTime;
        const velocity = Math.abs(deltaX) / duration;

        const shouldToggle =
          Math.abs(deltaX) > panelWidth / 3 || velocity > SWIPE_VELOCITY_THRESHOLD;

        if (isOpen && deltaX < -SWIPE_THRESHOLD && shouldToggle) {
          closePanel();
        } else if (!isOpen && deltaX > SWIPE_THRESHOLD && shouldToggle) {
          openPanel();
        } else {
          setDragOffset(0);
        }

        isDragging = false;
      };

      element.addEventListener("touchstart", handleTouchStart, { passive: true });
      element.addEventListener("touchmove", handleTouchMove, { passive: true });
      element.addEventListener("touchend", handleTouchEnd, { passive: true });

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchend", handleTouchEnd);
      };
    };

    const cleanupOverlay = setupDragHandlers(overlayEl, false);
    const cleanupEdge = setupDragHandlers(edgeEl, true);

    return () => {
      overlayGestureRef.current?.destroy();
      overlayGestureRef.current = null;
      edgeGestureRef.current?.destroy();
      edgeGestureRef.current = null;
      cleanupOverlay();
      cleanupEdge();
    };
  }, [isOpen, openPanel, closePanel, panelWidth]);

  // Calculate transform based on state
  const getTransform = () => {
    if (isAnimating) {
      return isOpen ? "translateX(0)" : `translateX(${panelWidth}px)`;
    }

    if (isOpen) {
      return `translateX(${dragOffset}px)`;
    } else {
      return `translateX(${panelWidth + Math.min(0, dragOffset)}px)`;
    }
  };

  const getOverlayOpacity = () => {
    if (isAnimating) {
      return isOpen ? 1 : 0;
    }

    if (isOpen) {
      return Math.max(0, 1 + dragOffset / panelWidth);
    } else {
      return Math.max(0, Math.min(1, dragOffset / panelWidth));
    }
  };

  return (
    <TooltipProvider>
      <>
        {/* Menu Button */}
        <button
          ref={menuButtonRef}
          onClick={togglePanel}
          className={cn(
            "fixed z-50 flex h-12 w-12 items-center justify-center rounded-lg",
            "bg-surface-1/85 border border-border-strong/50 backdrop-blur-md transition-all duration-200",
            "hover:bg-surface-1/95 text-text-primary hover:border-brand/60 hover:text-brand",
            "touch-target haptic-feedback sidepanel-focus-visible shadow-lg",
            "opacity-90 hover:opacity-100",
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

        {/* Edge swipe target for opening */}
        <div
          ref={edgeRef}
          className={cn(
            "sidepanel-touch-area",
            isOpen ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-0",
          )}
          aria-hidden="true"
        />

        {/* Overlay */}
        <div
          ref={overlayRef}
          className={cn(
            "sidepanel-overlay-transition sidepanel-no-select fixed inset-0 z-40",
            isOpen || dragOffset > 0 ? "pointer-events-auto" : "pointer-events-none",
          )}
          style={{
            backgroundColor: `rgba(0, 0, 0, ${0.3 * getOverlayOpacity()})`,
            backdropFilter: getOverlayOpacity() > 0 ? "blur(2px)" : "none",
          }}
          onClick={closePanel}
          aria-hidden="true"
        />

        {/* Sidepanel */}
        <aside
          ref={panelRef}
          id="navigation-sidepanel"
          className={cn(
            "fixed right-0 top-0 z-50 flex h-full flex-col",
            "bg-surface-1/95 border-l border-border/40 backdrop-blur-md",
            "sidepanel-container sidepanel-safe-area sidepanel-border",
            "shadow-2xl transition-[width] duration-300 ease-out",
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
          <div className="flex items-center justify-between gap-2 border-b border-border/60 p-4">
            <h2 className={cn("text-base font-semibold text-text-strong", isCompact && "sr-only")}>
              Navigation
            </h2>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={togglePanelMode}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      "text-text-muted hover:bg-hover-bg hover:text-text-strong",
                      "touch-target transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-weak focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1",
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
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  "text-text-muted hover:bg-hover-bg hover:text-text-strong",
                  "touch-target transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-weak focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1",
                )}
                aria-label="Navigation schließen"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="sidepanel-scroll flex-1 space-y-6 overflow-y-auto p-4">
            {renderNavSection(
              "sidepanel-history",
              "Verlauf",
              <div className="space-y-3">
                {renderActionButton(
                  "history-open",
                  "Verlauf öffnen",
                  "Gespeicherte Konversationen im Chat anzeigen.",
                  openHistoryPanel,
                )}
                {chatItem && (
                  <ul className="space-y-1" role="list">
                    {renderNavLink(chatItem, "chat-home")}
                  </ul>
                )}
                {historyPreviews.length > 0 ? (
                  <ul className="space-y-1" role="list">
                    {historyPreviews.map((conversation) => renderHistoryPreview(conversation))}
                  </ul>
                ) : (
                  !isCompact && (
                    <p className="text-xs leading-5 text-text-subtle">
                      Noch keine Gespräche gespeichert.
                    </p>
                  )
                )}
              </div>,
              "Schneller Zugriff auf deine letzten Chats.",
            )}

            {rolesItem &&
              renderNavSection(
                "sidepanel-roles",
                "Rollen",
                <ul className="space-y-1" role="list">
                  {renderNavLink(rolesItem, "roles-link")}
                </ul>,
                "Wechsle zwischen gespeicherten Rollenprofilen.",
              )}

            {modelsItem &&
              renderNavSection(
                "sidepanel-models",
                "Modelle",
                <ul className="space-y-1" role="list">
                  {renderNavLink(modelsItem, "models-link")}
                </ul>,
                "Verwalte deine bevorzugten Sprachmodelle.",
              )}

            {settingsItem &&
              renderNavSection(
                "sidepanel-settings",
                "Einstellungen",
                <ul className="space-y-1" role="list">
                  {renderNavLink(settingsItem, "settings-link")}
                </ul>,
                "Anwendungen und Konto konfigurieren.",
              )}
          </nav>

          {/* Footer content */}
          {children && <div className="border-t border-border/60 p-4">{children}</div>}
        </aside>
      </>
    </TooltipProvider>
  );
}
