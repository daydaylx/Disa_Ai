import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ChatPageV2 from "../pages/ChatV2";
import ModelsPage from "../pages/Models";
import SettingsPage from "../pages/Settings";
import Studio from "../pages/Studio";
import DesignSystemPage from "../pages/test/DesignSystemPage";
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
        path: "/studio",
        element: <Studio />,
      },
      {
        path: "/test/design-system",
        element: <DesignSystemPage />,
      },
      {
        index: true,
        element: <ChatPageV2 />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
