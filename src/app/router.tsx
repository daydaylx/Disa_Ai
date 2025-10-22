import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { ErrorBoundary } from "../components/ErrorBoundary";
import { AppShell } from "./layouts/AppShell";

// Lazy-loaded Routes für bessere Performance
const ChatPage = lazy(() => import("../pages/ChatV2"));
const ModelsPage = lazy(() => import("../pages/Models"));
const RolesPage = lazy(() => import("../pages/Studio"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));

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
      path: "/impressum",
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
              <div className="py-8">
                <h1 className="mb-6 text-2xl font-bold">Impressum</h1>
                <div className="prose max-w-none">
                  <div className="mb-6 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                    <p className="font-medium text-blue-200">
                      Dies ist eine rein private, nicht geschäftsmäßige Webseite ohne
                      Gewinnerzielungsabsicht.
                    </p>
                  </div>

                  <h2>Verantwortlich für den Inhalt</h2>
                  <p>
                    David Grunert
                    <br />
                    E-Mail: grunert94@hotmail.com
                  </p>
                </div>
              </div>
            </Suspense>
          </ErrorBoundary>
        </AppShell>
      ),
    },
    {
      path: "/datenschutz",
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
              <div>
                <PrivacyPolicy />
              </div>
            </Suspense>
          </ErrorBoundary>
        </AppShell>
      ),
    },
    {
      path: "/404",
      element: (
        <AppShell>
          <ErrorBoundary>
            <div className="flex flex-col items-center justify-center py-20">
              <h1 className="text-6xl font-bold">404</h1>
              <h2 className="mt-4 text-2xl font-semibold">Seite nicht gefunden</h2>
              <p className="mt-2 text-center">
                Die gesuchte Seite existiert nicht oder wurde verschoben.
              </p>
              <a
                href="/chat"
                className="mt-6 rounded bg-blue-500 px-4 py-2 text-white no-underline"
              >
                Zurück zum Chat
              </a>
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
  return <RouterProvider router={router} />;
}
