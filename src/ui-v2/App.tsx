import React from "react";
import { RouterProvider } from "react-router-dom";

import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { router } from "./router";
import { ChatProvider } from "./state/chat";
import { SettingsProvider } from "./state/settings";

export const App: React.FC = () => (
  <SettingsProvider>
    <ChatProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </ChatProvider>
  </SettingsProvider>
);

export default App;
