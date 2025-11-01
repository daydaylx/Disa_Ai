/**
 * Universal UI State Hook
 *
 * Provides consistent state management and data attributes for all UI components.
 * Supports neomorphic design system with automatic state transitions and animations.
 */

import React, { useCallback, useMemo, useState } from "react";

export interface UIState {
  isLoading: boolean;
  isDisabled: boolean;
  isHover: boolean;
  isFocus: boolean;
  isActive: boolean;
  isSelected: boolean;
  isError: boolean;
  isSuccess: boolean;
  variant?: string;
  size?: string;
}

export interface UIStateActions {
  setLoading: (loading: boolean) => void;
  setDisabled: (disabled: boolean) => void;
  setHover: (hover: boolean) => void;
  setFocus: (focus: boolean) => void;
  setActive: (active: boolean) => void;
  setSelected: (selected: boolean) => void;
  setError: (error: boolean) => void;
  setSuccess: (success: boolean) => void;
  setVariant: (variant: string) => void;
  setSize: (size: string) => void;
  reset: () => void;
}

export interface UIStateDataAttributes {
  "data-loading": boolean | undefined;
  "data-disabled": boolean | undefined;
  "data-hover": boolean | undefined;
  "data-focus": boolean | undefined;
  "data-active": boolean | undefined;
  "data-selected": boolean | undefined;
  "data-error": boolean | undefined;
  "data-success": boolean | undefined;
  "data-variant": string | undefined;
  "data-size": string | undefined;
  "data-state": string;
}

export interface UseUIStateOptions {
  initialState?: Partial<UIState>;
  variant?: string;
  size?: string;
  disabled?: boolean;
  enableAnimations?: boolean;
}

export interface UseUIStateReturn {
  state: UIState;
  actions: UIStateActions;
  dataAttributes: UIStateDataAttributes;
  className: string;
  isInteractive: boolean;
  hasState: boolean;
}

const defaultState: UIState = {
  isLoading: false,
  isDisabled: false,
  isHover: false,
  isFocus: false,
  isActive: false,
  isSelected: false,
  isError: false,
  isSuccess: false,
};

/**
 * Universal UI State Hook
 *
 * @param options Configuration options for the state hook
 * @returns State, actions, data attributes, and helper properties
 *
 * @example
 * ```tsx
 * function Button({ children, variant = "default" }) {
 *   const { state, actions, dataAttributes, className } = useUIState({
 *     variant,
 *     enableAnimations: true
 *   });
 *
 *   return (
 *     <button
 *       {...dataAttributes}
 *       className={cn("btn", className)}
 *       onMouseEnter={() => actions.setHover(true)}
 *       onMouseLeave={() => actions.setHover(false)}
 *       onFocus={() => actions.setFocus(true)}
 *       onBlur={() => actions.setFocus(false)}
 *     >
 *       {children}
 *     </button>
 *   );
 * }
 * ```
 */
export function useUIState(options: UseUIStateOptions = {}): UseUIStateReturn {
  const { initialState = {}, variant, size, disabled = false, enableAnimations = true } = options;

  const [state, setState] = useState<UIState>({
    ...defaultState,
    ...initialState,
    isDisabled: disabled,
    variant,
    size,
  });

  // Actions for updating state
  const actions = useMemo<UIStateActions>(
    () => ({
      setLoading: (loading: boolean) => setState((prev) => ({ ...prev, isLoading: loading })),
      setDisabled: (disabled: boolean) => setState((prev) => ({ ...prev, isDisabled: disabled })),
      setHover: (hover: boolean) => setState((prev) => ({ ...prev, isHover: hover })),
      setFocus: (focus: boolean) => setState((prev) => ({ ...prev, isFocus: focus })),
      setActive: (active: boolean) => setState((prev) => ({ ...prev, isActive: active })),
      setSelected: (selected: boolean) => setState((prev) => ({ ...prev, isSelected: selected })),
      setError: (error: boolean) => setState((prev) => ({ ...prev, isError: error })),
      setSuccess: (success: boolean) => setState((prev) => ({ ...prev, isSuccess: success })),
      setVariant: (variant: string) => setState((prev) => ({ ...prev, variant })),
      setSize: (size: string) => setState((prev) => ({ ...prev, size })),
      reset: () =>
        setState({
          ...defaultState,
          variant: state.variant,
          size: state.size,
        }),
    }),
    [state.variant, state.size],
  );

  // Generate data attributes for CSS targeting
  const dataAttributes = useMemo<UIStateDataAttributes>(() => {
    const stateFlags: string[] = [];

    if (state.isLoading) stateFlags.push("loading");
    if (state.isDisabled) stateFlags.push("disabled");
    if (state.isHover) stateFlags.push("hover");
    if (state.isFocus) stateFlags.push("focus");
    if (state.isActive) stateFlags.push("active");
    if (state.isSelected) stateFlags.push("selected");
    if (state.isError) stateFlags.push("error");
    if (state.isSuccess) stateFlags.push("success");

    return {
      "data-loading": state.isLoading || undefined,
      "data-disabled": state.isDisabled || undefined,
      "data-hover": state.isHover || undefined,
      "data-focus": state.isFocus || undefined,
      "data-active": state.isActive || undefined,
      "data-selected": state.isSelected || undefined,
      "data-error": state.isError || undefined,
      "data-success": state.isSuccess || undefined,
      "data-variant": state.variant || undefined,
      "data-size": state.size || undefined,
      "data-state": stateFlags.join(" ") || "default",
    };
  }, [state]);

  // Generate className for state-based styling
  const className = useMemo(() => {
    const classes: string[] = [];

    if (enableAnimations) {
      classes.push("ui-state-animated");
    }

    if (state.isLoading) classes.push("ui-loading");
    if (state.isDisabled) classes.push("ui-disabled");
    if (state.isHover) classes.push("ui-hover");
    if (state.isFocus) classes.push("ui-focus");
    if (state.isActive) classes.push("ui-active");
    if (state.isSelected) classes.push("ui-selected");
    if (state.isError) classes.push("ui-error");
    if (state.isSuccess) classes.push("ui-success");

    if (state.variant) classes.push(`ui-variant-${state.variant}`);
    if (state.size) classes.push(`ui-size-${state.size}`);

    return classes.join(" ");
  }, [state, enableAnimations]);

  // Helper properties
  const isInteractive = useMemo(
    () => !state.isLoading && !state.isDisabled,
    [state.isLoading, state.isDisabled],
  );

  const hasState = useMemo(
    () =>
      state.isLoading ||
      state.isDisabled ||
      state.isHover ||
      state.isFocus ||
      state.isActive ||
      state.isSelected ||
      state.isError ||
      state.isSuccess,
    [state],
  );

  return {
    state,
    actions,
    dataAttributes,
    className,
    isInteractive,
    hasState,
  };
}

/**
 * Higher-order component for automatic UI state management
 *
 * @param Component The component to wrap
 * @param options Default options for the UI state
 * @returns Enhanced component with UI state management
 */
export function withUIState<P extends object>(
  Component: React.ComponentType<P>,
  options: UseUIStateOptions = {},
) {
  return function EnhancedComponent(props: P) {
    const uiState = useUIState(options);

    return <Component {...props} uiState={uiState} />;
  };
}

/**
 * Hook for creating standardized event handlers with UI state integration
 *
 * @param actions UI state actions from useUIState
 * @param options Configuration for event handlers
 * @returns Object with standardized event handlers
 */
export function useUIStateHandlers(
  actions: UIStateActions,
  options: {
    disabled?: boolean;
    onHover?: (hover: boolean) => void;
    onFocus?: (focus: boolean) => void;
    onActive?: (active: boolean) => void;
  } = {},
) {
  const { disabled = false, onHover, onFocus, onActive } = options;

  const onMouseEnter = useCallback(() => {
    if (!disabled) {
      actions.setHover(true);
      onHover?.(true);
    }
  }, [disabled, actions, onHover]);

  const onMouseLeave = useCallback(() => {
    if (!disabled) {
      actions.setHover(false);
      onHover?.(false);
    }
  }, [disabled, actions, onHover]);

  const onFocusHandler = useCallback(() => {
    if (!disabled) {
      actions.setFocus(true);
      onFocus?.(true);
    }
  }, [disabled, actions, onFocus]);

  const onBlur = useCallback(() => {
    if (!disabled) {
      actions.setFocus(false);
      onFocus?.(false);
    }
  }, [disabled, actions, onFocus]);

  const onMouseDown = useCallback(() => {
    if (!disabled) {
      actions.setActive(true);
      onActive?.(true);
    }
  }, [disabled, actions, onActive]);

  const onMouseUp = useCallback(() => {
    if (!disabled) {
      actions.setActive(false);
      onActive?.(false);
    }
  }, [disabled, actions, onActive]);

  const onTouchStart = useCallback(() => {
    if (!disabled) {
      actions.setActive(true);
      onActive?.(true);
    }
  }, [disabled, actions, onActive]);

  const onTouchEnd = useCallback(() => {
    if (!disabled) {
      actions.setActive(false);
      onActive?.(false);
    }
  }, [disabled, actions, onActive]);

  return useMemo(
    () => ({
      onMouseEnter,
      onMouseLeave,
      onFocus: onFocusHandler,
      onBlur,
      onMouseDown,
      onMouseUp,
      onTouchStart,
      onTouchEnd,
    }),
    [
      onMouseEnter,
      onMouseLeave,
      onFocusHandler,
      onBlur,
      onMouseDown,
      onMouseUp,
      onTouchStart,
      onTouchEnd,
    ],
  );
}
