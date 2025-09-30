import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import ChatPage from "../pages/ChatV2";
import ModelsPage from "../pages/Models";
import SettingsPage from "../pages/Settings";
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
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
