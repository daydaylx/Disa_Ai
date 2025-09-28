import { lazy, Suspense } from "react";
import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";

import { Card } from "./components/primitives/Card";
import { AppShell } from "./components/shell/AppShell";
import { MainContent } from "./components/shell/MainContent";
import { NavBar } from "./components/shell/NavBar";
import { PersonaProvider } from "./config/personas";

// Lazy-loaded page components
const ChatApp = lazy(() => import("./ui/ChatAppV2"));
const SettingsView = lazy(() => import("./ui/SettingsViewV2"));

function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="border-border border-t-primary h-6 w-6 animate-spin rounded-full border-2"></div>
          <span className="text-text-secondary font-medium">Loading...</span>
        </div>
      </Card>
    </div>
  );
}

function ModelsPage() {
  return <ChatApp openModelPicker={true} />;
}

function AppLayout() {
  return (
    <AppShell>
      <MainContent>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </MainContent>
      <NavBar />
    </AppShell>
  );
}

const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: (
      <div className="flex h-screen items-center justify-center">
        <Card className="p-8">
          <div className="text-center">
            <h2 className="text-foreground mb-2 text-xl font-semibold">Something went wrong</h2>
            <p className="text-text-secondary">Please refresh the page</p>
          </div>
        </Card>
      </div>
    ),
    children: [
      {
        index: true,
        element: <ChatApp />,
      },
      {
        path: "/models",
        element: <ModelsPage />,
      },
      {
        path: "/settings",
        element: <SettingsView />,
      },
      {
        path: "/chat/:id?",
        element: <ChatApp />,
      },
    ],
  },
]);

export function Router() {
  return (
    <PersonaProvider>
      <RouterProvider router={router} />
    </PersonaProvider>
  );
}
