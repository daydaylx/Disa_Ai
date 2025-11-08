import { History, Plus } from "../../lib/icons";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface WelcomeScreenProps {
  newConversation: () => void;
  openHistory: () => void;
}

export function WelcomeScreen({ newConversation, openHistory }: WelcomeScreenProps) {
  return (
    <>
      <header className="mobile-chat-header space-y-stack-gap">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-text-tertiary">
            Chat-Start
          </p>
          <h1 className="text-token-h1 text-text-strong text-balance font-semibold">
            Disa&nbsp;AI Chat
          </h1>
          <p className="text-sm leading-6 text-text-secondary">
            Starte eine Unterhaltung oder nutze die Schnellstarts für wiederkehrende Aufgaben.
          </p>
        </div>
        <div
          className="flex flex-wrap items-center justify-center gap-2"
          role="toolbar"
          aria-label="Chat-Aktionen"
        >
          <Button onClick={newConversation} variant="brand" size="lg" dramatic>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Neuer Chat</span>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={openHistory}
                variant="outline"
                size="icon"
                aria-label="Chat-Verlauf öffnen"
              >
                <History className="h-5 w-5" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Verlauf öffnen</TooltipContent>
          </Tooltip>
        </div>
      </header>
    </>
  );
}
