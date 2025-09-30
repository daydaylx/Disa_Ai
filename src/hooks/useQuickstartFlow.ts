import { useCallback } from "react";

import { useStudio } from "../app/state/StudioContext";
import type { QuickstartAction } from "../config/quickstarts";
import { getPersonaById } from "../data/personas";
import { trackQuickstartClicked } from "../lib/analytics";

export interface UseQuickstartFlowOptions {
  onStartFlow: (
    prompt: string,
    autosend: boolean,
    quickstartInfo?: { id: string; flowId: string },
  ) => void;
  currentModel?: string; // For analytics tracking
}

export function useQuickstartFlow({ onStartFlow, currentModel }: UseQuickstartFlowOptions) {
  const { setActivePersona } = useStudio();

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
          const persona = getPersonaById(action.persona);
          if (persona) {
            setActivePersona(persona);
          }
        }

        // 3. Start the flow with the prompt
        onStartFlow(action.prompt, action.autosend, { id: action.id, flowId: action.flowId });

        // 4. Log for debugging
        console.log(`[Quickstart] Flow started: ${action.flowId}`, {
          id: action.id,
          title: action.title,
          autosend: action.autosend,
          model: currentModel,
        });
      } catch (error) {
        console.error("Failed to start quickstart flow:", error);
      }
    },
    [onStartFlow, setActivePersona, currentModel],
  );

  return {
    startQuickstartFlow,
  };
}
