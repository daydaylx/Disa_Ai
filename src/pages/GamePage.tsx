import { useEffect } from "react";

import { GameProvider } from "../contexts/GameContext";
import { useChatPageLogic } from "../hooks/useChatPageLogic";
import { useSettings } from "../hooks/useSettings";
import { GamePageContent } from "./GamePageContent";

export default function GamePage() {
  const { setPreferredModel } = useSettings();

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
      <GamePageContent chatLogic={chatLogic} />
    </GameProvider>
  );
}
