import { useEffect, useState } from "react";

import { GameProvider } from "../contexts/GameContext";
import { useChatPageLogic } from "../hooks/useChatPageLogic";
import { useSettings } from "../hooks/useSettings";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { GamePageContent } from "./GamePageContent";

const GAME_WARNING_DISMISSED_KEY = "game-warning-dismissed";

export default function GamePage() {
  const { setPreferredModel } = useSettings();
  const [showWarning, setShowWarning] = useState(() => {
    // Show warning only if not previously dismissed in this session
    return sessionStorage.getItem(GAME_WARNING_DISMISSED_KEY) !== "true";
  });

  const handleDismissWarning = () => {
    sessionStorage.setItem(GAME_WARNING_DISMISSED_KEY, "true");
    setShowWarning(false);
  };

  const chatLogic = useChatPageLogic({
    onStartWithPreset: () => {},
  });

  // Set optimal model when game page is loaded
  useEffect(() => {
    if (chatLogic.messages.length > 0) {
      setPreferredModel("qwen/qwen-2.5-72b-instruct:free");
    }
  }, [chatLogic.messages.length, setPreferredModel]);

  return (
    <GameProvider
      messages={chatLogic.messages}
      onSendSystemMessage={(msg, updateInput) => chatLogic.sendPrompt(msg, { updateInput })}
    >
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hinweis zur Spielfunktion</DialogTitle>
            <DialogDescription>
              Diese Funktion befindet sich noch in der Entwicklung und kann fehlerhaft sein. Bitte
              habe Verständnis für eventuelle Probleme oder unerwartetes Verhalten.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDismissWarning}>Verstanden</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <GamePageContent chatLogic={chatLogic} />
    </GameProvider>
  );
}
