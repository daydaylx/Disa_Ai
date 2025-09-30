import { useCallback } from "react";

import { useStudio } from "../app/state/StudioContext";
import type { QuickstartAction } from "../config/quickstarts";
import { getPersonaById } from "../data/personas";

export interface UseQuickstartFlowOptions {
  onStartFlow: (prompt: string, autosend: boolean) => void;
}

export function useQuickstartFlow({ onStartFlow }: UseQuickstartFlowOptions) {
  const { setActivePersona } = useStudio();

  const startQuickstartFlow = useCallback(
    (action: QuickstartAction) => {
      try {
        // 1. Set persona if specified
        if (action.persona) {
          const persona = getPersonaById(action.persona);
          if (persona) {
            setActivePersona(persona);
          }
        }

        // 2. Start the flow with the prompt
        onStartFlow(action.prompt, action.autosend);

        // 3. Log analytics (future feature)
        console.warn(`Quickstart flow started: ${action.flowId}`, {
          id: action.id,
          title: action.title,
          autosend: action.autosend,
          persona: action.persona,
        });
      } catch (error) {
        console.error("Failed to start quickstart flow:", error);
      }
    },
    [onStartFlow, setActivePersona],
  );

  return {
    startQuickstartFlow,
  };
}
