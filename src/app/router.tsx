import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { ErrorBoundary } from "../components/ErrorBoundary";
import { AppShell } from "./layouts/AppShell";

// Lazy-loaded Routes für bessere Performance
const ChatPage = lazy(() => import("../pages/ChatV2"));
const ModelsPage = lazy(() => import("../pages/Models"));
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
                  <h2>Angaben gemäß § 5 TMG</h2>
                  <p>
                    Mustermann GmbH
                    <br />
                    Musterstraße 111
                    <br />
                    99999 Musterstadt
                  </p>
                  <h2>Vertreten durch</h2>
                  <p>Geschäftsführer: Max Mustermann</p>
                  <h2>Kontakt</h2>
                  <p>
                    Telefon: +49 (0) 123 45678
                    <br />
                    E-Mail: muster@firma.de
                  </p>
                  <h2>Umsatzsteuer-ID</h2>
                  <p>
                    Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
                    <br />
                    DE999999999
                  </p>
                  <h2>Redaktionell verantwortlich</h2>
                  <p>
                    Max Mustermann
                    <br />
                    Musterstraße 111
                    <br />
                    99999 Musterstadt
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
              <div className="py-8">
                <h1 className="mb-6 text-2xl font-bold">Datenschutzerklärung</h1>
                <div className="prose max-w-none">
                  <h2>1. Datenschutz auf einen Blick</h2>
                  <h3>Allgemeine Hinweise</h3>
                  <p>
                    Die folgenden Informationen geben einen einfachen Überblick darüber, was mit
                    Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                  </p>
                  <p>
                    Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
                    werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie
                    unserer unter diesem Text aufgeführten Datenschutzerklärung.
                  </p>

                  <h2>2. Hosting und Content Delivery Network (CDN)</h2>
                  <h3>Datenverarbeitung</h3>
                  <p>
                    Diese Website wird über GitHub Pages gehostet. Anbieter ist die GitHub Inc., 88
                    Colin P Kelly Jr St, San Francisco, CA 94107, USA.
                  </p>

                  <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
                  <h3>Datenschutz</h3>
                  <p>
                    Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr
                    ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend
                    der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                  </p>

                  <h2>4. Datenerfassung auf dieser Website</h2>
                  <h3>Wie erfassen wir Ihre Daten?</h3>
                  <p>
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen.
                    Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme
                    erfasst.
                  </p>

                  <h2>5. Plugins und Tools</h2>
                  <h3>OpenRouter.ai</h3>
                  <p>
                    Diese App verwendet die OpenRouter.ai API zur Verarbeitung Ihrer Anfragen.
                    Weitere Informationen zum Datenschutz bei OpenRouter finden Sie unter:
                    https://openrouter.ai/privacy
                  </p>

                  <p className="mt-4 text-sm text-gray-500">Stand: Oktober 2025</p>
                </div>
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
