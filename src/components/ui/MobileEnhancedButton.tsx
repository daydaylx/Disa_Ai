/**
 * Mobile-Enhanced Button Component
 * Adds premium mobile UX features to standard buttons
 */

import { forwardRef, useState } from "react";

import { hapticFeedback } from "../../lib/touch/haptics";
import { cn } from "../../lib/utils";
import { Button, type ButtonProps } from "./button";

export interface MobileEnhancedButtonProps extends ButtonProps {
  /** Enable haptic feedback on press (default: true) */
  hapticFeedback?: boolean;
  /** Haptic pattern to use */
  hapticPattern?: "tap" | "success" | "warning" | "error" | "impact";
  /** Show visual press feedback */
  pressAnimation?: boolean;
  /** Custom press scale factor (default: 0.95) */
  pressScale?: number;
}

export const MobileEnhancedButton = forwardRef<HTMLButtonElement, MobileEnhancedButtonProps>(
  (
    {
      className,
      children,
      hapticFeedback: enableHaptic = true,
      hapticPattern = "tap",
      pressAnimation = true,
      pressScale = 0.95,
      onClick,
      onTouchStart,
      onTouchEnd,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
      if (disabled) return;

      setIsPressed(true);

      // Trigger haptic feedback
      if (enableHaptic) {
        switch (hapticPattern) {
          case "success":
            hapticFeedback.success();
            break;
          case "warning":
          case "error":
            hapticFeedback.warning();
            break;
          case "impact":
            hapticFeedback.impact("light");
            break;
          default:
            hapticFeedback.tap();
        }
      }

      onTouchStart?.(e);
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
      if (disabled) return;

      setIsPressed(false);
      onTouchEnd?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      // Haptic feedback for click (non-touch)
      if (enableHaptic && !("ontouchstart" in window)) {
        switch (hapticPattern) {
          case "success":
            hapticFeedback.success();
            break;
          case "warning":
          case "error":
            hapticFeedback.warning();
            break;
          case "impact":
            hapticFeedback.impact("light");
            break;
          default:
            hapticFeedback.tap();
        }
      }

      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        className={cn(
          // Base mobile enhancements
          "select-none touch-manipulation",
          // Ensure minimum touch target
          "min-h-[44px] min-w-[44px]",
          // Enhanced focus for mobile
          "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          // Press animation
          pressAnimation && "transition-transform duration-75 ease-out",
          pressAnimation && isPressed && "transform",
          className,
        )}
        style={{
          // Dynamic press scale
          ...(pressAnimation &&
            isPressed && {
              transform: `scale(${pressScale})`,
            }),
        }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

MobileEnhancedButton.displayName = "MobileEnhancedButton";

/**
 * Mobile-Enhanced Icon Button
 * Optimized for icon-only buttons with larger touch targets
 */
export interface MobileIconButtonProps extends Omit<MobileEnhancedButtonProps, "size"> {
  icon: React.ReactNode;
  label: string; // For accessibility
  size?: "sm" | "md" | "lg";
}

export const MobileIconButton = forwardRef<HTMLButtonElement, MobileIconButtonProps>(
  ({ icon, label, size = "md", className, hapticPattern = "tap", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-10 w-10 p-2",
      md: "h-12 w-12 p-3",
      lg: "h-14 w-14 p-3.5",
    };

    return (
      <MobileEnhancedButton
        ref={ref}
        className={cn(
          "rounded-full flex items-center justify-center",
          sizeClasses[size],
          "bg-surface/80 hover:bg-surface backdrop-blur-sm",
          "border border-border/50",
          "shadow-sm hover:shadow-md",
          className,
        )}
        hapticPattern={hapticPattern}
        aria-label={label}
        title={label}
        {...props}
      >
        <span className="flex items-center justify-center">{icon}</span>
      </MobileEnhancedButton>
    );
  },
);

MobileIconButton.displayName = "MobileIconButton";

/**
 * Mobile Action Button with enhanced feedback
 * Perfect for primary actions like Send, Save, etc.
 */
export interface MobileActionButtonProps extends MobileEnhancedButtonProps {
  icon?: React.ReactNode;
  loading?: boolean;
  success?: boolean;
}

export const MobileActionButton = forwardRef<HTMLButtonElement, MobileActionButtonProps>(
  ({ icon, loading = false, success = false, children, className, disabled, ...props }, ref) => {
    const getHapticPattern = () => {
      if (success) return "success" as const;
      if (loading) return "impact" as const;
      return "tap" as const;
    };

    return (
      <MobileEnhancedButton
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          "bg-accent hover:bg-accent/90 text-accent-foreground",
          "font-medium",
          "px-6 py-3 rounded-xl",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-200",
          // Success state
          success && "bg-success hover:bg-success/90",
          // Loading state
          loading && "cursor-wait opacity-80",
          className,
        )}
        hapticPattern={getHapticPattern()}
        disabled={disabled || loading}
        {...props}
      >
        <span
          className={cn(
            "flex items-center gap-2 transition-all duration-200",
            loading && "opacity-60",
          )}
        >
          {loading ? (
            <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
          ) : success ? (
            <span className="text-success-foreground">✓</span>
          ) : (
            icon
          )}
          {children}
        </span>

        {/* Success ripple effect */}
        {success && <span className="absolute inset-0 bg-success/20 animate-pulse rounded-xl" />}
      </MobileEnhancedButton>
    );
  },
);

MobileActionButton.displayName = "MobileActionButton";

/**
 * Mobile Card with enhanced touch feedback
 */
export interface MobileTouchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  pressable?: boolean;
  hapticOnPress?: boolean;
}

export const MobileTouchCard = forwardRef<HTMLDivElement, MobileTouchCardProps>(
  (
    {
      className,
      children,
      pressable = true,
      hapticOnPress = true,
      onTouchStart,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      if (!pressable) return;

      setIsPressed(true);

      if (hapticOnPress) {
        hapticFeedback.select();
      }

      onTouchStart?.(e);
    };

    const handleTouchEnd = () => {
      setIsPressed(false);
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!pressable) return;

      // Haptic for desktop clicks
      if (hapticOnPress && !("ontouchstart" in window)) {
        hapticFeedback.select();
      }

      onClick?.(e);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-card/50 backdrop-blur-sm",
          "transition-all duration-150 ease-out",
          pressable && [
            "cursor-pointer touch-manipulation",
            "hover:bg-card/70 hover:shadow-md",
            "active:scale-[0.98]",
            isPressed && "scale-[0.98] bg-card/70",
          ],
          className,
        )}
        onTouchStart={pressable ? handleTouchStart : onTouchStart}
        onTouchEnd={pressable ? handleTouchEnd : undefined}
        onClick={pressable ? handleClick : onClick}
        {...props}
      >
        {children}
      </div>
    );
  },
);

MobileTouchCard.displayName = "MobileTouchCard";

/**
 * Utility hooks and helpers
 */

/**
 * Hook for managing touch feedback across multiple elements
 */
export function useMobileTouchFeedback() {
  return {
    addTouchFeedback: (element: HTMLElement, pattern: "tap" | "select" = "tap") => {
      const handleTouch = () => {
        switch (pattern) {
          case "tap":
            hapticFeedback.tap();
            break;
          case "select":
            hapticFeedback.select();
            break;
        }
      };

      element.addEventListener("touchstart", handleTouch, { passive: true });

      return () => {
        element.removeEventListener("touchstart", handleTouch);
      };
    },
  };
}

/**
 * Enhanced button with success animation
 */
export interface SuccessButtonProps extends MobileEnhancedButtonProps {
  onSuccess?: () => void;
  successDuration?: number;
}

export function useSuccessButton(onSuccess?: () => void, duration = 2000) {
  const [showSuccess, setShowSuccess] = useState(false);

  const triggerSuccess = () => {
    setShowSuccess(true);
    hapticFeedback.success();
    onSuccess?.();

    setTimeout(() => {
      setShowSuccess(false);
    }, duration);
  };

  return {
    showSuccess,
    triggerSuccess,
  };
}
