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
        <RouterProvider
          router={router}
          fallbackElement={<div className="p-4 text-sm text-neutral-400">Laden…</div>}
        />
      </ErrorBoundary>
    </ChatProvider>
  </SettingsProvider>
);

export default App;
