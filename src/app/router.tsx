import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { RouteLoadingFallback } from "../components/RouteLoadingFallback";
import ChatPage from "../pages/ChatV2";
import { AppShell } from "./layouts/AppShell";

// Lazy-loaded Routes für bessere Performance
const ModelsPage = lazy(() => import("../pages/Models"));
const SettingsPage = lazy(() => import("../pages/Settings"));

const router = createBrowserRouter(
  [
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
          element: (
            <Suspense fallback={<RouteLoadingFallback message="Lädt Modellkatalog..." />}>
              <ModelsPage />
            </Suspense>
          ),
        },
        {
          path: "/settings",
          element: (
            <Suspense fallback={<RouteLoadingFallback message="Lädt Einstellungen..." />}>
              <SettingsPage />
            </Suspense>
          ),
        },
        {
          index: true,
          element: <ChatPage />,
        },
        {
          path: "*",
          element: <Navigate to="/chat" replace />,
        },
      ],
    },
  ],
  {
    future: {
      v7_skipActionErrorRevalidation: true,
      v7_normalizeFormMethod: true,
    },
  },
);

export function Router() {
  return <RouterProvider router={router} />;
}
