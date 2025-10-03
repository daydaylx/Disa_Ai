import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { ErrorBoundary } from "../components/ErrorBoundary";
import { AppShell } from "./layouts/AppShell";

// Lazy-loaded Routes für bessere Performance
const ChatPage = lazy(() => import("../pages/ChatV2"));
const ModelsPage = lazy(() => import("../pages/Models"));
const SettingsPage = lazy(() => import("../pages/Settings"));

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/chat" replace />,
    },
    {
      path: "/chat",
      element: (
        <AppShell>
          <ErrorBoundary>
            <Suspense fallback={null}>
              <ChatPage />
            </Suspense>
          </ErrorBoundary>
        </AppShell>
      ),
    },
    {
      path: "/models",
      element: (
        <AppShell>
          <ErrorBoundary>
            <Suspense fallback={null}>
              <ModelsPage />
            </Suspense>
          </ErrorBoundary>
        </AppShell>
      ),
    },
    {
      path: "/settings",
      element: (
        <AppShell>
          <ErrorBoundary>
            <Suspense fallback={null}>
              <SettingsPage />
            </Suspense>
          </ErrorBoundary>
        </AppShell>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/chat" replace />,
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
