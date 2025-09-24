import { createHashRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import { PersonaProvider } from "./config/personas";
import ChatApp from "./ui/ChatApp";
import SettingsView from "./ui/SettingsView";

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
