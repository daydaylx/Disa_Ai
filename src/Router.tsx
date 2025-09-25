import { lazy, Suspense } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import { PersonaProvider } from "./config/personas";

const ChatApp = lazy(() => import("./ui/ChatApp"));
const SettingsView = lazy(() => import("./ui/SettingsView"));

// Simple Models page that redirects to chat with model picker open
function ModelsPage() {
  return <ChatApp />;
}

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}
          >
            <ChatApp />
          </Suspense>
        ),
      },
      {
        path: "/models",
        element: (
          <Suspense
            fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}
          >
            <ModelsPage />
          </Suspense>
        ),
      },
      {
        path: "/settings",
        element: (
          <Suspense
            fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}
          >
            <SettingsView />
          </Suspense>
        ),
      },
    ],
  },
]);

export function Router() {
  return (
    <PersonaProvider>
      <RouterProvider router={router} />
    </PersonaProvider>
  );
}
