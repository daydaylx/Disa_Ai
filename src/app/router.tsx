import { lazy } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { RouteWrapper } from "./components/RouteWrapper";

// Lazy-loaded Routes für bessere Performance
const ChatPage = lazy(() => import("../pages/Chat"));
const ChatHistoryPage = lazy(() => import("../pages/ChatHistoryPage"));
const StudioHomePage = lazy(() => import("../pages/StudioHome"));
const ModelsPage = lazy(() => import("../pages/ModelsPage"));
const MobileModelsPage = lazy(() => import("../pages/MobileModels"));
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
      path: "/chat/history",
      element: (
        <RouteWrapper>
          <ChatHistoryPage />
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
      path: "/models/mobile",
      element: (
        <RouteWrapper>
          <MobileModelsPage />
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
      path: "*",
      element: <Navigate to="/" replace />,
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
