/**
 * Cross-Component Interaction Patterns
 *
 * Provides utilities for creating interaction patterns between related components.
 * Enables state synchronization, event cascading, and coordinated animations.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface InteractionEvent {
  type: string;
  source: string;
  data?: any;
  timestamp: number;
}

export interface InteractionGroupState {
  activeComponent: string | null;
  hoveredComponent: string | null;
  focusedComponent: string | null;
  events: InteractionEvent[];
}

export interface InteractionGroupActions {
  setActive: (componentId: string | null) => void;
  setHovered: (componentId: string | null) => void;
  setFocused: (componentId: string | null) => void;
  emit: (event: Omit<InteractionEvent, "timestamp">) => void;
  clear: () => void;
}

export interface InteractionGroupContextType {
  state: InteractionGroupState;
  actions: InteractionGroupActions;
  subscribe: (componentId: string, listener: (event: InteractionEvent) => void) => () => void;
}

const InteractionGroupContext = createContext<InteractionGroupContextType | null>(null);

/**
 * Provider for interaction group context
 */
export function InteractionGroupProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InteractionGroupState>({
    activeComponent: null,
    hoveredComponent: null,
    focusedComponent: null,
    events: [],
  });

  const listenersRef = useRef<Map<string, (event: InteractionEvent) => void>>(new Map());

  const actions = useMemo<InteractionGroupActions>(
    () => ({
      setActive: (componentId) => setState((prev) => ({ ...prev, activeComponent: componentId })),
      setHovered: (componentId) => setState((prev) => ({ ...prev, hoveredComponent: componentId })),
      setFocused: (componentId) => setState((prev) => ({ ...prev, focusedComponent: componentId })),
      emit: (eventData) => {
        const event: InteractionEvent = {
          ...eventData,
          timestamp: Date.now(),
        };
        setState((prev) => ({
          ...prev,
          events: [...prev.events.slice(-9), event], // Keep last 10 events
        }));
        // Notify all listeners
        listenersRef.current.forEach((listener) => listener(event));
      },
      clear: () =>
        setState({
          activeComponent: null,
          hoveredComponent: null,
          focusedComponent: null,
          events: [],
        }),
    }),
    [],
  );

  const subscribe = useCallback(
    (componentId: string, listener: (event: InteractionEvent) => void) => {
      listenersRef.current.set(componentId, listener);
      return () => {
        listenersRef.current.delete(componentId);
      };
    },
    [],
  );

  const contextValue = useMemo(() => ({ state, actions, subscribe }), [state, actions, subscribe]);

  return (
    <InteractionGroupContext.Provider value={contextValue}>
      {children}
    </InteractionGroupContext.Provider>
  );
}

/**
 * Hook for components to participate in cross-component interactions
 */
export function useInteractionGroup(componentId: string) {
  const context = useContext(InteractionGroupContext);

  if (!context) {
    throw new Error("useInteractionGroup must be used within an InteractionGroupProvider");
  }

  const { state, actions, subscribe } = context;
  const [localEvents, setLocalEvents] = useState<InteractionEvent[]>([]);

  // Subscribe to events
  useEffect(() => {
    return subscribe(componentId, (event) => {
      setLocalEvents((prev) => [...prev.slice(-4), event]); // Keep last 5 events
    });
  }, [componentId, subscribe]);

  // Computed properties for this component
  const isActive = state.activeComponent === componentId;
  const isHovered = state.hoveredComponent === componentId;
  const isFocused = state.focusedComponent === componentId;

  // Enhanced actions that include event emission
  const enhancedActions = useMemo(
    () => ({
      setActive: (active: boolean) => {
        actions.setActive(active ? componentId : null);
        actions.emit({
          type: active ? "component.activate" : "component.deactivate",
          source: componentId,
          data: { active },
        });
      },
      setHovered: (hovered: boolean) => {
        actions.setHovered(hovered ? componentId : null);
        actions.emit({
          type: hovered ? "component.hover.enter" : "component.hover.leave",
          source: componentId,
          data: { hovered },
        });
      },
      setFocused: (focused: boolean) => {
        actions.setFocused(focused ? componentId : null);
        actions.emit({
          type: focused ? "component.focus.enter" : "component.focus.leave",
          source: componentId,
          data: { focused },
        });
      },
      emit: (type: string, data?: any) => {
        actions.emit({ type, source: componentId, data });
      },
    }),
    [componentId, actions],
  );

  return {
    // Component state
    isActive,
    isHovered,
    isFocused,
    // Group state
    groupState: state,
    // Actions
    actions: enhancedActions,
    // Events
    events: localEvents,
    recentEvents: state.events,
    // Subscribe function
    subscribe,
  };
}

/**
 * Hook for creating coordinated interactions between components
 */
export function useCoordinatedInteraction(
  componentId: string,
  options: {
    propagateHover?: boolean;
    propagateFocus?: boolean;
    propagateActive?: boolean;
    delayMs?: number;
    excludeComponents?: string[];
  } = {},
) {
  const {
    propagateHover = false,
    propagateFocus = false,
    propagateActive = false,
    delayMs = 100,
    excludeComponents = [],
  } = options;

  const interactionGroup = useInteractionGroup(componentId);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Create coordinated handlers
  const coordinatedHandlers = useMemo(
    () => ({
      onMouseEnter: () => {
        interactionGroup.actions.setHovered(true);
        if (propagateHover) {
          // Clear any pending timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          // Emit ripple effect
          interactionGroup.actions.emit("ripple.hover.start", {
            excludeComponents,
          });
        }
      },
      onMouseLeave: () => {
        interactionGroup.actions.setHovered(false);
        if (propagateHover) {
          timeoutRef.current = setTimeout(() => {
            interactionGroup.actions.emit("ripple.hover.end", {
              excludeComponents,
            });
          }, delayMs);
        }
      },
      onFocus: () => {
        interactionGroup.actions.setFocused(true);
        if (propagateFocus) {
          interactionGroup.actions.emit("ripple.focus.start", {
            excludeComponents,
          });
        }
      },
      onBlur: () => {
        interactionGroup.actions.setFocused(false);
        if (propagateFocus) {
          interactionGroup.actions.emit("ripple.focus.end", {
            excludeComponents,
          });
        }
      },
      onMouseDown: () => {
        interactionGroup.actions.setActive(true);
        if (propagateActive) {
          interactionGroup.actions.emit("ripple.active.start", {
            excludeComponents,
          });
        }
      },
      onMouseUp: () => {
        interactionGroup.actions.setActive(false);
        if (propagateActive) {
          interactionGroup.actions.emit("ripple.active.end", {
            excludeComponents,
          });
        }
      },
    }),
    [
      interactionGroup.actions,
      propagateHover,
      propagateFocus,
      propagateActive,
      delayMs,
      excludeComponents,
    ],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...interactionGroup,
    handlers: coordinatedHandlers,
  };
}

/**
 * Hook for creating responsive interaction patterns
 */
export function useResponsiveInteraction(
  componentId: string,
  targetComponents: string[],
  pattern: "follow" | "mirror" | "opposite" | "cascade" = "follow",
) {
  const interactionGroup = useInteractionGroup(componentId);

  // Listen for events from target components
  useEffect(() => {
    const handleEvent = (event: InteractionEvent) => {
      if (!targetComponents.includes(event.source)) return;

      switch (pattern) {
        case "follow":
          // Follow the same state as target
          if (event.type === "component.hover.enter") {
            interactionGroup.actions.emit("responsive.hover.enter", {
              followingComponent: event.source,
            });
          }
          break;

        case "mirror":
          // Mirror all state changes
          if (event.type.startsWith("component.")) {
            const newType = event.type.replace("component.", "responsive.mirror.");
            interactionGroup.actions.emit(newType, {
              mirroringComponent: event.source,
              originalData: event.data,
            });
          }
          break;

        case "opposite":
          // Do the opposite of target
          if (event.type === "component.hover.enter") {
            interactionGroup.actions.emit("responsive.hover.leave", {
              oppositeOf: event.source,
            });
          } else if (event.type === "component.hover.leave") {
            interactionGroup.actions.emit("responsive.hover.enter", {
              oppositeOf: event.source,
            });
          }
          break;

        case "cascade":
          // Cascade with delay
          if (event.type.startsWith("component.")) {
            setTimeout(() => {
              const newType = event.type.replace("component.", "responsive.cascade.");
              interactionGroup.actions.emit(newType, {
                cascadeFrom: event.source,
                delay: 150,
              });
            }, 150);
          }
          break;
      }
    };

    return interactionGroup.subscribe?.(componentId, handleEvent) || (() => {});
  }, [componentId, targetComponents, pattern, interactionGroup]);

  return interactionGroup;
}

/**
 * Hook for creating state synchronization between components
 */
export function useStateSynchronization(
  componentId: string,
  syncOptions: {
    syncHover?: string[];
    syncFocus?: string[];
    syncActive?: string[];
    bidirectional?: boolean;
  },
) {
  const { syncHover = [], syncFocus = [], syncActive = [], bidirectional = true } = syncOptions;
  const interactionGroup = useInteractionGroup(componentId);

  // Sync state changes
  useEffect(() => {
    const handleEvent = (event: InteractionEvent) => {
      if (!bidirectional && event.source === componentId) return;

      // Hover synchronization
      if (syncHover.includes(event.source) || syncHover.includes("*")) {
        if (event.type === "component.hover.enter") {
          interactionGroup.actions.setHovered(true);
        } else if (event.type === "component.hover.leave") {
          interactionGroup.actions.setHovered(false);
        }
      }

      // Focus synchronization
      if (syncFocus.includes(event.source) || syncFocus.includes("*")) {
        if (event.type === "component.focus.enter") {
          interactionGroup.actions.setFocused(true);
        } else if (event.type === "component.focus.leave") {
          interactionGroup.actions.setFocused(false);
        }
      }

      // Active synchronization
      if (syncActive.includes(event.source) || syncActive.includes("*")) {
        if (event.type === "component.activate") {
          interactionGroup.actions.setActive(true);
        } else if (event.type === "component.deactivate") {
          interactionGroup.actions.setActive(false);
        }
      }
    };

    return interactionGroup.subscribe?.(componentId, handleEvent) || (() => {});
  }, [componentId, syncHover, syncFocus, syncActive, bidirectional, interactionGroup]);

  return interactionGroup;
}
