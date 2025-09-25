import { lazy, Suspense } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";

import { PersonaProvider } from "./config/personas";

// V2 Components with improved loading and error handling
const AppV2 = lazy(() => import("./AppV2"));
const ChatAppV2 = lazy(() => import("./ui/ChatAppV2"));
const SettingsViewV2 = lazy(() => import("./ui/SettingsViewV2"));

// Enhanced loading component with glass morphism
function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="glass-backdrop rounded-xl p-8 backdrop-blur-lg">
        <div className="flex items-center space-x-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-glass-border-medium border-t-accent"></div>
          <span className="text-glass-text-medium font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
}

// Enhanced Models page with better UX
function ModelsPageV2() {
  return <ChatAppV2 openModelPicker={true} />;
}

const routerV2 = createHashRouter([
  {
    path: "/",
    element: <AppV2 />,
    errorElement: (
      <div className="flex h-screen items-center justify-center">
        <div className="glass-backdrop rounded-xl p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-glass-text-medium mb-2">Something went wrong</h2>
            <p className="text-glass-text-muted">Please refresh the page</p>
          </div>
        </div>
      </div>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ChatAppV2 />
          </Suspense>
        ),
      },
      {
        path: "/models",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ModelsPageV2 />
          </Suspense>
        ),
      },
      {
        path: "/settings",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsViewV2 />
          </Suspense>
        ),
      },
      // New V2 routes
      {
        path: "/chat/:id?",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ChatAppV2 />
          </Suspense>
        ),
      },
    ],
  },
]);

export function RouterV2() {
  return (
    <PersonaProvider>
      <RouterProvider router={routerV2} />
    </PersonaProvider>
  );
}