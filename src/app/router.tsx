import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { ErrorBoundary } from "../components/ErrorBoundary";
import { AppShell } from "./layouts/AppShell";

// Lazy-loaded Routes für bessere Performance
const ChatPage = lazy(() => import("../pages/ChatV2"));
const ModelsPage = lazy(() => import("../pages/Models"));
const SettingsPage = lazy(() => import("../pages/Settings"));
const RolesPage = lazy(() => import("../pages/Studio"));

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/chat" replace />,
    },
    {
      path: "/roles",
      element: (
        <AppShell>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div
                  className="h-4 w-24 animate-pulse rounded bg-gray-300"
                  aria-label="Laden..."
                ></div>
              }
            >
              <RolesPage />
            </Suspense>
          </ErrorBoundary>
        </AppShell>
      ),
    },
    {
      path: "/chat",
      element: (
        <AppShell>
          <ErrorBoundary>
            <Suspense
              fallback={
                <div
                  className="h-4 w-24 animate-pulse rounded bg-gray-300"
                  aria-label="Laden..."
                ></div>
              }
            >
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
            <Suspense
              fallback={
                <div
                  className="h-4 w-24 animate-pulse rounded bg-gray-300"
                  aria-label="Laden..."
                ></div>
              }
            >
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
            <Suspense
              fallback={
                <div
                  className="h-4 w-24 animate-pulse rounded bg-gray-300"
                  aria-label="Laden..."
                ></div>
              }
            >
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
