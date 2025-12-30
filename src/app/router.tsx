import { lazy } from "react";
import { createBrowserRouter, Navigate, RouterProvider, useNavigate } from "react-router-dom";

import { Button } from "@/ui";

import { ArrowLeft } from "../lib/icons";
import ChatPage from "../pages/Chat";
import GamePage from "../pages/GamePage";
import { RouteWrapper } from "./components/RouteWrapper";

// Lazy-loaded Routes für bessere Performance
const ChatHistoryPage = lazy(() => import("../pages/ChatHistoryPage"));
const ModelsPage = lazy(() => import("../pages/ModelsPage"));
const RolesPage = lazy(() => import("../pages/RolesPage"));
const SettingsOverviewPage = lazy(() => import("../pages/SettingsOverviewPage"));
const SettingsMemoryPage = lazy(() => import("../pages/SettingsMemory"));
const SettingsBehaviorPage = lazy(() => import("../pages/SettingsBehavior"));
const SettingsYouthFilterPage = lazy(() => import("../pages/SettingsYouthFilter"));
const SettingsApiDataPage = lazy(() => import("../pages/SettingsApiData"));
const SettingsExtrasPage = lazy(() => import("../pages/SettingsExtras")); // New Page
const SettingsAppearancePage = lazy(() => import("../pages/SettingsAppearance"));
const ImpressumPage = lazy(() => import("../pages/ImpressumPage"));
const DatenschutzPage = lazy(() => import("../pages/DatenschutzPage"));
const FeedbackPage = lazy(() => import("../pages/FeedbackPage"));
const ThemenPage = lazy(() => import("../pages/ThemenPage"));
const GamePage = lazy(() => import("../pages/GamePage"));

function HeaderBackAction({ fallbackTo }: { fallbackTo: string }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      void navigate(-1);
      return;
    }

    void navigate(fallbackTo);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2 hidden sm:flex">
      <ArrowLeft className="h-4 w-4" />
      Zurück
    </Button>
  );
}

export const appRouter = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <RouteWrapper layout="page">
          <ChatPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/chat",
      element: (
        <RouteWrapper layout="page">
          <ChatPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/game",
      element: (
        <RouteWrapper layout="page">
          <GamePage />
        </RouteWrapper>
      ),
    },
    {
      path: "/studio",
      element: <Navigate to="/chat" replace />,
    },
    {
      path: "/roles",
      element: (
        <RouteWrapper layout="page">
          <RolesPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/chat/history",
      element: (
        <RouteWrapper layout="page">
          <ChatHistoryPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/themen",
      element: (
        <RouteWrapper layout="page">
          <ThemenPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/models",
      element: (
        <RouteWrapper layout="page">
          <ModelsPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/feedback",
      element: (
        <RouteWrapper
          pageHeaderTitle="Feedback"
          pageHeaderActions={<HeaderBackAction fallbackTo="/settings" />}
        >
          <FeedbackPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings",
      element: (
        <RouteWrapper pageHeaderTitle="Einstellungen">
          <SettingsOverviewPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/memory",
      element: (
        <RouteWrapper pageHeaderTitle="Einstellungen">
          <SettingsMemoryPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/behavior",
      element: (
        <RouteWrapper pageHeaderTitle="Einstellungen">
          <SettingsBehaviorPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/youth",
      element: (
        <RouteWrapper pageHeaderTitle="Einstellungen">
          <SettingsYouthFilterPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/api-data",
      element: (
        <RouteWrapper pageHeaderTitle="Einstellungen">
          <SettingsApiDataPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/filters",
      element: <Navigate to="/settings/youth" replace />,
    },
    {
      path: "/settings/extras",
      element: (
        <RouteWrapper pageHeaderTitle="Einstellungen">
          <SettingsExtrasPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/appearance",
      element: (
        <RouteWrapper pageHeaderTitle="Einstellungen">
          <SettingsAppearancePage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/api",
      element: (
        <RouteWrapper>
          <SettingsApiDataPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/settings/data",
      element: <Navigate to="/settings/api-data" replace />,
    },
    {
      path: "/impressum",
      element: (
        <RouteWrapper
          pageHeaderTitle="Impressum"
          pageHeaderActions={<HeaderBackAction fallbackTo="/" />}
        >
          <ImpressumPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/datenschutz",
      element: (
        <RouteWrapper
          pageHeaderTitle="Datenschutz"
          pageHeaderActions={<HeaderBackAction fallbackTo="/" />}
        >
          <DatenschutzPage />
        </RouteWrapper>
      ),
    },
    {
      path: "/quickstarts",
      element: <Navigate to="/themen" replace />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL ?? "/",
    future: {
      v7_skipActionErrorRevalidation: true,
      v7_normalizeFormMethod: true,
    },
  },
);

export function Router() {
  return <RouterProvider router={appRouter} />;
}
