import { useCallback } from "react";

import { useStudio } from "../app/state/StudioContext";
import type { QuickstartAction } from "../config/quickstarts";
import { getRoleById } from "../data/roles";
import { trackQuickstartClicked } from "../lib/analytics/index";

export interface UseQuickstartFlowOptions {
  onStartFlow: (
    prompt: string,
    autosend: boolean,
    quickstartInfo?: { id: string; flowId: string },
  ) => void;
  currentModel?: string; // For analytics tracking
}

export function useQuickstartFlow({ onStartFlow, currentModel }: UseQuickstartFlowOptions) {
  const { setActiveRole } = useStudio();

  const startQuickstartFlow = useCallback(
    (action: QuickstartAction) => {
      try {
        // 1. Track analytics (Issue #71)
        trackQuickstartClicked({
          id: action.id,
          flowId: action.flowId,
          model: currentModel,
          autosend: action.autosend,
        });

        // 2. Set persona if specified
        if (action.persona) {
          const role = getRoleById(action.persona);
          if (role) {
            setActiveRole(role);
          }
        }

        // 3. Start the flow with the prompt
        onStartFlow(action.prompt, action.autosend, { id: action.id, flowId: action.flowId });

        // Flow started successfully
      } catch (error) {
        console.error("Failed to start quickstart flow:", error);
      }
    },
    [onStartFlow, setActiveRole, currentModel],
  );

  return {
    startQuickstartFlow,
  };
}
