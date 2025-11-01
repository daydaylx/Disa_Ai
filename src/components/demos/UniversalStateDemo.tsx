/**
 * Universal State System Demo
 *
 * Demonstrates the new Universal State System with enhanced accessibility
 * and neomorphic micro-interactions.
 */

import { AlertCircle, CheckCircle, Loader2, Star } from "lucide-react";
import { useState } from "react";

import { useUIState, useUIStateHandlers } from "../../hooks/useUIState";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function UniversalStateDemo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Universal State System</h2>
        <p className="text-text-secondary mb-6">
          Interactive components using the Universal State System with enhanced accessibility and
          neomorphic micro-interactions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <InteractiveCardDemo />
        <InteractiveButtonDemo />
        <StateControlsDemo />
        <AccessibilityDemo />
      </div>
    </div>
  );
}

/**
 * Interactive Card Demo
 */
function InteractiveCardDemo() {
  const { state, actions, dataAttributes, className } = useUIState({
    variant: "neumorphic",
    size: "md",
    enableAnimations: true,
  });

  const handlers = useUIStateHandlers(actions, {
    disabled: state.isDisabled,
  });

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Card with Universal State System</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...dataAttributes}
          {...handlers}
          className={cn(
            "neo-button-base rounded-lg p-4 cursor-pointer",
            "bg-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-subtle)]",
            "text-text-primary min-h-[80px] flex items-center justify-center",
            "ui-card-interactive",
            className,
          )}
          tabIndex={0}
          role="button"
          aria-label="Interactive neomorphic element"
        >
          <div className="text-center">
            <div className="text-sm font-medium mb-1">
              {state.isHover && "Hovering ✨"}
              {state.isFocus && !state.isHover && "Focused 🎯"}
              {state.isActive && "Pressed 👇"}
              {!state.isHover && !state.isFocus && !state.isActive && "Ready 🎭"}
            </div>
            <div className="text-xs text-text-secondary">State: {dataAttributes["data-state"]}</div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => actions.setLoading(!state.isLoading)}
              className="text-xs px-2 py-1 bg-surface-subtle rounded hover:bg-surface-muted"
            >
              {state.isLoading ? "Stop" : "Start"} Loading
            </button>
            <button
              onClick={() => actions.setDisabled(!state.isDisabled)}
              className="text-xs px-2 py-1 bg-surface-subtle rounded hover:bg-surface-muted"
            >
              {state.isDisabled ? "Enable" : "Disable"}
            </button>
          </div>
          <div className="text-xs text-text-secondary">
            Try hovering, focusing (Tab), and clicking the card above
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Interactive Button Demo
 */
function InteractiveButtonDemo() {
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { state, actions, dataAttributes, className } = useUIState({
    variant: "neumorphic",
    size: "md",
    enableAnimations: true,
    initialState: {
      isLoading: buttonState === "loading",
      isSuccess: buttonState === "success",
      isError: buttonState === "error",
    },
  });

  const handlers = useUIStateHandlers(actions);

  const handleClick = () => {
    setButtonState("loading");
    actions.setLoading(true);

    setTimeout(() => {
      const isSuccess = Math.random() > 0.3;
      setButtonState(isSuccess ? "success" : "error");
      actions.setLoading(false);
      actions.setSuccess(isSuccess);
      actions.setError(!isSuccess);

      setTimeout(() => {
        setButtonState("idle");
        actions.reset();
      }, 2000);
    }, 1500);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Interactive Button</CardTitle>
        <CardDescription>Button with state transitions</CardDescription>
      </CardHeader>
      <CardContent>
        <button
          {...dataAttributes}
          {...handlers}
          onClick={handleClick}
          disabled={state.isLoading}
          className={cn(
            "neo-button-base rounded-lg px-6 py-3 font-medium",
            "bg-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-subtle)]",
            "text-text-primary w-full transition-all",
            className,
          )}
        >
          <div className="flex items-center justify-center gap-2">
            {state.isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {state.isSuccess && <CheckCircle className="h-4 w-4" />}
            {state.isError && <AlertCircle className="h-4 w-4" />}
            <span>
              {state.isLoading && "Processing..."}
              {state.isSuccess && "Success!"}
              {state.isError && "Error occurred"}
              {buttonState === "idle" && "Click to test"}
            </span>
          </div>
        </button>

        <div className="mt-4 space-y-2">
          <div className="text-xs text-text-secondary">
            Current state:{" "}
            <Badge variant="outline" className="ml-1">
              {dataAttributes["data-state"]}
            </Badge>
          </div>
          <div className="text-xs text-text-secondary">
            The button shows loading, success, and error states with smooth transitions
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * State Controls Demo
 */
function StateControlsDemo() {
  const { state, actions, dataAttributes, className } = useUIState({
    variant: "neumorphic",
    enableAnimations: true,
  });

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>State Controls</CardTitle>
        <CardDescription>Manual state management demo</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...dataAttributes}
          className={cn(
            "neo-button-base rounded-lg p-4 mb-4",
            "bg-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-subtle)]",
            "text-text-primary min-h-[60px] flex items-center justify-center",
            className,
          )}
        >
          <div className="text-center">
            <div className="text-sm font-medium">State Preview</div>
            <div className="text-xs text-text-secondary mt-1">{dataAttributes["data-state"]}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <Button
            size="sm"
            variant={state.isLoading ? "default" : "outline"}
            onClick={() => actions.setLoading(!state.isLoading)}
          >
            Loading
          </Button>
          <Button
            size="sm"
            variant={state.isDisabled ? "default" : "outline"}
            onClick={() => actions.setDisabled(!state.isDisabled)}
          >
            Disabled
          </Button>
          <Button
            size="sm"
            variant={state.isSelected ? "default" : "outline"}
            onClick={() => actions.setSelected(!state.isSelected)}
          >
            Selected
          </Button>
          <Button
            size="sm"
            variant={state.isError ? "default" : "outline"}
            onClick={() => actions.setError(!state.isError)}
          >
            Error
          </Button>
          <Button
            size="sm"
            variant={state.isSuccess ? "default" : "outline"}
            onClick={() => actions.setSuccess(!state.isSuccess)}
          >
            Success
          </Button>
          <Button size="sm" variant="outline" onClick={() => actions.reset()}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Accessibility Demo
 */
function AccessibilityDemo() {
  const { state, actions, dataAttributes, className, isInteractive } = useUIState({
    variant: "neumorphic",
    enableAnimations: true,
  });

  const handlers = useUIStateHandlers(actions);

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Accessibility Features</CardTitle>
        <CardDescription>WCAG AA compliant interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...dataAttributes}
          {...handlers}
          className={cn(
            "neo-button-base rounded-lg p-4 cursor-pointer",
            "bg-[var(--surface-neumorphic-raised)] border-[var(--border-neumorphic-subtle)]",
            "text-text-primary min-h-[80px] flex items-center justify-center",
            className,
          )}
          tabIndex={0}
          role="button"
          aria-label="Accessibility demonstration element"
          aria-pressed={state.isSelected}
          aria-disabled={state.isDisabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              actions.setSelected(!state.isSelected);
            }
          }}
        >
          <div className="text-center">
            <Star
              className={cn(
                "h-6 w-6 mx-auto mb-2",
                state.isSelected ? "fill-current text-yellow-500" : "text-text-secondary",
              )}
            />
            <div className="text-sm font-medium">{state.isSelected ? "Favorited" : "Favorite"}</div>
            <div className="text-xs text-text-secondary mt-1">
              Interactive: {isInteractive ? "Yes" : "No"}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="text-xs text-text-secondary">
            ✓ Keyboard accessible (Tab, Enter, Space)
          </div>
          <div className="text-xs text-text-secondary">
            ✓ Screen reader compatible (ARIA attributes)
          </div>
          <div className="text-xs text-text-secondary">✓ Motion-safe animations</div>
          <div className="text-xs text-text-secondary">✓ High contrast support</div>
        </div>
      </CardContent>
    </Card>
  );
}
