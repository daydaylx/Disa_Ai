import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ChatPage from "../pages/Chat";
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
        element: <ChatPage />,
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
        element: <ChatPage />,
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
