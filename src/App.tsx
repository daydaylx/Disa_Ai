import React from "react";
import ChatView from "./views/ChatView";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";

const App: React.FC = () => {
  return (
    <ToastsProvider>
      <ChatView />
    </ToastsProvider>
  );
};

export default App;
