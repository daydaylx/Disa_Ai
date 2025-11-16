import { lazy } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { ErrorBoundary } from "../components/ErrorBoundary";
import { Button } from "../components/ui/button";
import { RouteWrapper } from "./components/RouteWrapper";
import { AppShell } from "./layouts/AppShell";

// Lazy-loaded Routes für bessere Performance
const ChatPage = lazy(() => import("../pages/Chat"));
const StudioHomePage = lazy(() => import("../pages/StudioHome"));
const ModelsPage = lazy(() => import("../pages/ModelsPage"));
const RolesPage = lazy(() => import("../pages/RolesPage"));
const SettingsOverviewPage = lazy(() => import("../pages/SettingsOverviewPage"));
const SettingsApiPage = lazy(() => import("../pages/SettingsApi"));
const SettingsMemoryPage = lazy(() => import("../pages/SettingsMemory"));
const SettingsFiltersPage = lazy(() => import("../pages/SettingsFilters"));
const SettingsAppearancePage = lazy(() => import("../pages/SettingsAppearance"));
const SettingsDataPage = lazy(() => import("../pages/SettingsData"));
const ImpressumPage = lazy(() => import("../pages/ImpressumPage"));
const DatenschutzPage = lazy(() => import("../pages/DatenschutzPage"));

export const appRouter = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <RouteWrapper>
          <StudioHomePage />
        </RouteWrapper>
      ),
    },
    {
      path: "/roles",
      element: (
        <RouteWrapper>
          <RolesPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/chat",
      element: (
        <RouteWrapper>
          <ChatPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/models",
      element: (
        <RouteWrapper>
          <ModelsPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings",
      element: (
        <RouteWrapper>
          <SettingsOverviewPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/api",
      element: (
        <RouteWrapper>
          <SettingsApiPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/memory",
      element: (
        <RouteWrapper>
          <SettingsMemoryPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/filters",
      element: (
        <RouteWrapper>
          <SettingsFiltersPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/appearance",
      element: (
        <RouteWrapper>
          <SettingsAppearancePage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/data",
      element: (
        <RouteWrapper>
          <SettingsDataPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/impressum",
      element: (
        <RouteWrapper>
          <ImpressumPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/datenschutz",
      element: (
        <RouteWrapper>
          <DatenschutzPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/404",
      element: (
        <AppShell>
          <ErrorBoundary>
            <div className="flex min-h-screen flex-col items-center justify-center p-space-md">
              <div
                className="glass-panel--glow-lila w-full max-w-md text-center rounded-3xl p-8 shadow-glow-lila aurora-bg animate-pulse-glow glow-grid"
                data-testid="not-found-page"
              >
                <div className="mb-8">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-destructive/20 to-destructive/10 shadow-glow-destructive">
                    <span className="text-5xl font-bold text-destructive drop-shadow-glow-destructive">
                      404
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">
                    Seite nicht gefunden
                  </h1>
                  <p className="text-text-secondary text-lg">
                    Die gesuchte Seite existiert nicht oder wurde verschoben.
                  </p>
                </div>
                <div className="flex justify-center mt-8">
                  <Button asChild variant="glass-primary" size="lg" className="shadow-glow-primary">
                    <a href="/chat">Zurück zum Chat</a>
                  </Button>
                </div>
              </div>
            </div>
          </ErrorBoundary>
        </AppShell>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
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
  return <RouterProvider router={appRouter} />;
}
