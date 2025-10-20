import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface SidepanelState {
  isOpen: boolean;
  isAnimating: boolean;
}

interface SidepanelContextValue {
  isOpen: boolean;
  isAnimating: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

const SidepanelContext = createContext<SidepanelContextValue | null>(null);

interface SidepanelProviderProps {
  children: ReactNode;
}

export function SidepanelProvider({ children }: SidepanelProviderProps) {
  const [state, setState] = useState<SidepanelState>({
    isOpen: false,
    isAnimating: false,
  });
  const animationTimeoutRef = useRef<number | null>(null);

  const clearAnimationTimeout = useCallback(() => {
    if (animationTimeoutRef.current !== null && typeof window !== "undefined") {
      window.clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearAnimationTimeout, [clearAnimationTimeout]);

  const openPanel = useCallback(() => {
    setState({ isOpen: true, isAnimating: true });
    // Animation duration matches CSS transition
    if (typeof window === "undefined") return;
    clearAnimationTimeout();
    animationTimeoutRef.current = window.setTimeout(() => {
      setState((prev) => ({ ...prev, isAnimating: false }));
      animationTimeoutRef.current = null;
    }, 300);
  }, [clearAnimationTimeout]);

  const closePanel = useCallback(() => {
    setState({ isOpen: false, isAnimating: true });
    if (typeof window === "undefined") return;
    clearAnimationTimeout();
    animationTimeoutRef.current = window.setTimeout(() => {
      setState((prev) => ({ ...prev, isAnimating: false }));
      animationTimeoutRef.current = null;
    }, 300);
  }, [clearAnimationTimeout]);

  const togglePanel = useCallback(() => {
    if (state.isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }, [state.isOpen, openPanel, closePanel]);

  const value: SidepanelContextValue = {
    isOpen: state.isOpen,
    isAnimating: state.isAnimating,
    openPanel,
    closePanel,
    togglePanel,
  };

  return <SidepanelContext.Provider value={value}>{children}</SidepanelContext.Provider>;
}

export function useSidepanel(): SidepanelContextValue {
  const context = useContext(SidepanelContext);
  if (!context) {
    throw new Error("useSidepanel must be used within a SidepanelProvider");
  }
  return context;
}
