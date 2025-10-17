import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";

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

  const openPanel = useCallback(() => {
    setState({ isOpen: true, isAnimating: true });
    // Animation duration matches CSS transition
    setTimeout(() => setState((prev) => ({ ...prev, isAnimating: false })), 300);
  }, []);

  const closePanel = useCallback(() => {
    setState({ isOpen: false, isAnimating: true });
    setTimeout(() => setState((prev) => ({ ...prev, isAnimating: false })), 300);
  }, []);

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
