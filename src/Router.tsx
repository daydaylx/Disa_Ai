import { createHashRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import { PersonaProvider } from "./config/personas";
import ChatApp from "./ui/ChatApp";
import SettingsView from "./ui/SettingsView";

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
        element: <ChatApp />,
      },
      {
        path: "/models",
        element: <ModelsPage />,
      },
      {
        path: "/settings",
        element: <SettingsView />,
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
