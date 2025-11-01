/**
 * Cross-Component Interaction Demo
 *
 * Demonstrates coordinated interactions, state synchronization, and responsive patterns
 * between multiple components using the Universal State System.
 */

import { ArrowRight, Link, Shuffle, Zap } from "lucide-react";
import React, { useState } from "react";

import {
  InteractionGroupProvider,
  useCoordinatedInteraction,
  useResponsiveInteraction,
  useStateSynchronization,
} from "../../hooks/useInteractionGroup";
import { useUIState } from "../../hooks/useUIState";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function CrossComponentDemo() {
  return (
    <InteractionGroupProvider>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Cross-Component Interactions</h2>
          <p className="text-text-secondary mb-6">
            Demonstrates coordinated behaviors and state synchronization between related components.
          </p>
        </div>

        <div className="grid gap-6">
          <CoordinatedHoverDemo />
          <StateSynchronizationDemo />
          <ResponsivePatternDemo />
          <InteractionHistoryDemo />
        </div>
      </div>
    </InteractionGroupProvider>
  );
}

/**
 * Coordinated Hover Demo
 */
function CoordinatedHoverDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Coordinated Hover Effects
        </CardTitle>
        <CardDescription>
          Hover one card to see ripple effects on related components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CoordinatedCard id="card-1" title="Primary Card" propagateHover />
          <CoordinatedCard id="card-2" title="Secondary Card" />
          <CoordinatedCard id="card-3" title="Tertiary Card" />
        </div>
        <div className="mt-4 text-sm text-text-secondary">
          Hover the primary card to see coordinated hover effects on the other cards
        </div>
      </CardContent>
    </Card>
  );
}

function CoordinatedCard({
  id,
  title,
  propagateHover = false,
}: {
  id: string;
  title: string;
  propagateHover?: boolean;
}) {
  const { actions, dataAttributes, className } = useUIState({
    variant: "neumorphic",
    enableAnimations: true,
  });

  const interaction = useCoordinatedInteraction(id, {
    propagateHover,
    delayMs: 150,
    excludeComponents: [id], // Don't affect self
  });

  // Listen for ripple events
  React.useEffect(() => {
    const handleRipple = (event: any) => {
      if (event.data?.excludeComponents?.includes(id)) return;

      if (event.type === "ripple.hover.start") {
        actions.setHover(true);
      } else if (event.type === "ripple.hover.end") {
        actions.setHover(false);
      }
    };

    const unsubscribe = interaction.subscribe?.(id, handleRipple);
    return unsubscribe;
  }, [id, actions, interaction]);

  return (
    <div
      {...dataAttributes}
      {...interaction.handlers}
      className={cn(
        "neo-button-base rounded-lg p-4 cursor-pointer",
        "bg-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-subtle)]",
        "text-text-primary min-h-[100px] flex items-center justify-center",
        "ui-card-interactive",
        className,
      )}
      tabIndex={0}
    >
      <div className="text-center">
        <div className="text-sm font-medium mb-2">{title}</div>
        <Badge variant="outline" className="text-xs">
          {interaction.isHovered ? "Hovered" : "Ready"}
        </Badge>
        {propagateHover && (
          <div className="text-xs text-text-secondary mt-2 flex items-center justify-center gap-1">
            <Zap className="h-3 w-3" />
            Propagates
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * State Synchronization Demo
 */
function StateSynchronizationDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shuffle className="h-5 w-5" />
          State Synchronization
        </CardTitle>
        <CardDescription>Components that synchronize their state changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SyncedComponent id="sync-master" title="Master Component" isMaster />
          <SyncedComponent id="sync-follower" title="Follower Component" />
        </div>
        <div className="mt-4 text-sm text-text-secondary">
          Hover, focus, or interact with either component to see synchronized states
        </div>
      </CardContent>
    </Card>
  );
}

function SyncedComponent({
  id,
  title,
  isMaster = false,
}: {
  id: string;
  title: string;
  isMaster?: boolean;
}) {
  const { state, actions, dataAttributes, className } = useUIState({
    variant: "neumorphic",
    enableAnimations: true,
  });

  const interaction = useStateSynchronization(id, {
    syncHover: isMaster ? [] : ["sync-master"],
    syncFocus: isMaster ? [] : ["sync-master"],
    syncActive: isMaster ? [] : ["sync-master"],
    bidirectional: true,
  });

  const handleClick = () => {
    actions.setSelected(!state.isSelected);
    interaction.actions.emit("sync.selected", { selected: !state.isSelected });
  };

  return (
    <div
      {...dataAttributes}
      className={cn(
        "neo-button-base rounded-lg p-4 cursor-pointer",
        "bg-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-subtle)]",
        "text-text-primary min-h-[120px] flex items-center justify-center",
        "ui-card-interactive",
        className,
      )}
      tabIndex={0}
      onClick={handleClick}
      onMouseEnter={() => {
        actions.setHover(true);
        interaction.actions.setHovered(true);
      }}
      onMouseLeave={() => {
        actions.setHover(false);
        interaction.actions.setHovered(false);
      }}
      onFocus={() => {
        actions.setFocus(true);
        interaction.actions.setFocused(true);
      }}
      onBlur={() => {
        actions.setFocus(false);
        interaction.actions.setFocused(false);
      }}
    >
      <div className="text-center">
        <div className="text-sm font-medium mb-2">{title}</div>
        <div className="space-y-1">
          <Badge variant={interaction.isHovered ? "default" : "outline"} className="text-xs">
            {interaction.isHovered ? "Hovered" : "Idle"}
          </Badge>
          <div className="text-xs text-text-secondary">State: {dataAttributes["data-state"]}</div>
          {isMaster && (
            <div className="text-xs text-text-secondary flex items-center justify-center gap-1 mt-2">
              <Zap className="h-3 w-3" />
              Master
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Responsive Pattern Demo
 */
function ResponsivePatternDemo() {
  const [pattern, setPattern] = useState<"follow" | "mirror" | "opposite" | "cascade">("follow");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Responsive Patterns
        </CardTitle>
        <CardDescription>
          Components that respond to other components with different patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 flex-wrap">
          {(["follow", "mirror", "opposite", "cascade"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPattern(p)}
              className={cn(
                "px-3 py-1 rounded text-xs",
                pattern === p
                  ? "bg-brand text-text-on-brand"
                  : "bg-surface-subtle text-text-secondary hover:bg-surface-muted",
              )}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResponsiveSource id="source" title="Source Component" />
          <ResponsiveTarget id="target" title="Target Component" pattern={pattern} />
        </div>

        <div className="mt-4 text-sm text-text-secondary">
          Interact with the source component to see how the target responds with the selected
          pattern
        </div>
      </CardContent>
    </Card>
  );
}

function ResponsiveSource({ id, title }: { id: string; title: string }) {
  const { state, dataAttributes, className } = useUIState({
    variant: "neumorphic",
    enableAnimations: true,
  });

  const interaction = useCoordinatedInteraction(id, {
    propagateHover: true,
    propagateFocus: true,
    propagateActive: true,
  });

  return (
    <div
      {...dataAttributes}
      {...interaction.handlers}
      className={cn(
        "neo-button-base rounded-lg p-4 cursor-pointer",
        "bg-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-subtle)]",
        "text-text-primary min-h-[100px] flex items-center justify-center",
        "ui-card-interactive",
        className,
      )}
      tabIndex={0}
    >
      <div className="text-center">
        <div className="text-sm font-medium mb-2">{title}</div>
        <Badge variant="default" className="text-xs">
          {state.isHover && "Hovered"}
          {state.isFocus && !state.isHover && "Focused"}
          {state.isActive && "Active"}
          {!state.isHover && !state.isFocus && !state.isActive && "Ready"}
        </Badge>
        <div className="text-xs text-text-secondary mt-2 flex items-center justify-center gap-1">
          <Zap className="h-3 w-3" />
          Source
        </div>
      </div>
    </div>
  );
}

function ResponsiveTarget({
  id,
  title,
  pattern,
}: {
  id: string;
  title: string;
  pattern: "follow" | "mirror" | "opposite" | "cascade";
}) {
  const { state, actions, dataAttributes, className } = useUIState({
    variant: "neumorphic",
    enableAnimations: true,
  });

  const interaction = useResponsiveInteraction(id, ["source"], pattern);

  // Handle responsive events
  React.useEffect(() => {
    const handleResponsive = (event: any) => {
      switch (pattern) {
        case "follow":
          if (event.type === "responsive.hover.enter") {
            actions.setHover(true);
          }
          break;
        case "mirror":
          if (event.type === "responsive.mirror.hover.enter") {
            actions.setHover(true);
          } else if (event.type === "responsive.mirror.hover.leave") {
            actions.setHover(false);
          }
          break;
        case "opposite":
          if (event.type === "responsive.hover.leave") {
            actions.setHover(true);
          } else if (event.type === "responsive.hover.enter") {
            actions.setHover(false);
          }
          break;
        case "cascade":
          if (event.type === "responsive.cascade.hover.enter") {
            actions.setHover(true);
          } else if (event.type === "responsive.cascade.hover.leave") {
            actions.setHover(false);
          }
          break;
      }
    };

    const unsubscribe = interaction.subscribe?.(id, handleResponsive);
    return unsubscribe;
  }, [id, pattern, actions, interaction]);

  return (
    <div
      {...dataAttributes}
      className={cn(
        "neo-button-base rounded-lg p-4",
        "bg-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-subtle)]",
        "text-text-primary min-h-[100px] flex items-center justify-center",
        "ui-card-interactive",
        className,
      )}
      tabIndex={0}
    >
      <div className="text-center">
        <div className="text-sm font-medium mb-2">{title}</div>
        <Badge variant="outline" className="text-xs">
          {state.isHover ? "Responding" : "Waiting"}
        </Badge>
        <div className="text-xs text-text-secondary mt-2">Pattern: {pattern}</div>
      </div>
    </div>
  );
}

/**
 * Interaction History Demo
 */
function InteractionHistoryDemo() {
  const interaction = useCoordinatedInteraction("history-demo", {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interaction History</CardTitle>
        <CardDescription>
          Real-time view of interaction events across all components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {interaction.recentEvents.length === 0 ? (
            <div className="text-sm text-text-secondary italic">
              No interactions yet. Try hovering or clicking components above.
            </div>
          ) : (
            interaction.recentEvents.slice(-8).map((event, index) => (
              <div
                key={`${event.timestamp}-${index}`}
                className="flex items-center justify-between p-2 bg-surface-subtle rounded text-xs"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {event.source}
                  </Badge>
                  <span className="text-text-secondary">{event.type}</span>
                </div>
                <span className="text-text-tertiary">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
        {interaction.recentEvents.length > 0 && (
          <button
            onClick={() => interaction.actions.emit("history.clear", {})}
            className="mt-4 text-xs px-3 py-1 bg-surface-subtle rounded hover:bg-surface-muted"
          >
            Clear History
          </button>
        )}
      </CardContent>
    </Card>
  );
}
