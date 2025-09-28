import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ChatPage from "../pages/Chat";
import ChatPageV2 from "../pages/ChatV2";
import ModelsPage from "../pages/Models";
import SettingsPage from "../pages/Settings";
import Studio from "../pages/Studio";
import { AppShell } from "./layouts/AppShell";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        path: "/chat",
        element: <ChatPageV2 />,
      },
      {
        path: "/models",
        element: <ModelsPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        index: true,
        element: <ChatPageV2 />,
      },
      {
        path: "/studio",
        element: <Studio />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
