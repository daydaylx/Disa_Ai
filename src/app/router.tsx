import { lazy } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { RouteWrapper } from "./components/RouteWrapper";

// Lazy-loaded Routes für bessere Performance
const ChatPage = lazy(() => import("../pages/Chat"));
const ChatHistoryPage = lazy(() => import("../pages/ChatHistoryPage"));
const ModelsPage = lazy(() => import("../pages/ModelsPage"));
const RolesPage = lazy(() => import("../pages/RolesPage"));
const SettingsOverviewPage = lazy(() => import("../pages/SettingsOverviewPage"));
const ImpressumPage = lazy(() => import("../pages/ImpressumPage"));
const DatenschutzPage = lazy(() => import("../pages/DatenschutzPage"));
const FeedbackPage = lazy(() => import("../pages/FeedbackPage"));

export const appRouter = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <RouteWrapper>
          <ChatPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/studio",
      element: <Navigate to="/" replace />,
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
      path: "/feedback",
      element: (
        <RouteWrapper>
          <FeedbackPage />
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
      path: "/settings/memory",
      element: <Navigate to="/settings?tab=memory" replace />,
    },
    {
      path: "/settings/behavior",
      element: <Navigate to="/settings?tab=behavior" replace />,
    },
    {
      path: "/settings/youth",
      element: <Navigate to="/settings?tab=youth" replace />,
    },
    {
      path: "/settings/api-data",
      element: <Navigate to="/settings?tab=api-data" replace />,
    },
    {
      path: "/settings/filters",
      element: <Navigate to="/settings?tab=youth" replace />,
    },
    {
      path: "/settings/extras",
      element: <Navigate to="/settings?tab=extras" replace />,
    },
    {
      path: "/settings/appearance",
      element: <Navigate to="/settings?tab=appearance" replace />,
    },
    {
      path: "/settings/api",
      element: <Navigate to="/settings?tab=api-data" replace />,
    },
    {
      path: "/settings/data",
      element: <Navigate to="/settings?tab=api-data" replace />,
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
