import { lazy } from "react";
import { createBrowserRouter, Navigate, Route, RouterProvider, Routes } from "react-router-dom";

import { ErrorBoundary } from "../components/ErrorBoundary";
import { AppShell } from "./layouts/AppShell";

// Lazy-loaded Routes für bessere Performance
const ChatPage = lazy(() => import("../pages/Chat"));
const ModelsPage = lazy(() => import("../pages/MobileModels"));
const RolesPage = lazy(() => import("../pages/MobileStudio"));
const SettingsOverviewPage = lazy(() => import("../pages/SettingsOverviewPage"));
const SettingsApiPage = lazy(() => import("../pages/SettingsApi"));
const SettingsMemoryPage = lazy(() => import("../pages/SettingsMemory"));
const SettingsFiltersPage = lazy(() => import("../pages/SettingsFilters"));
const SettingsAppearancePage = lazy(() => import("../pages/SettingsAppearance"));
const SettingsDataPage = lazy(() => import("../pages/SettingsData"));

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/chat" replace />,
    },
    {
      path: "/chat",
      element: <ChatPage />,
    },
    {
      path: "/roles",
      element: <RolesPage />,
    },
    {
      path: "/models",
      element: <ModelsPage />,
    },
    {
      path: "/settings/*",
      element: (
        <AppShell>
          <Routes>
            <Route path="/" element={<SettingsOverviewPage />} />
            <Route path="api" element={<SettingsApiPage />} />
            <Route path="memory" element={<SettingsMemoryPage />} />
            <Route path="filters" element={<SettingsFiltersPage />} />
            <Route path="appearance" element={<SettingsAppearancePage />} />
            <Route path="data" element={<SettingsDataPage />} />
          </Routes>
        </AppShell>
      ),
    },
    {
      path: "/impressum",
      element: (
        <AppShell>
          <div className="py-8">
            <h1 className="mb-6 text-2xl font-bold">Impressum</h1>
            <div className="prose max-w-none">
              <div className="mb-6 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                <p className="font-medium text-blue-200">
                  Dies ist eine rein private, nicht geschäftsmäßige Webseite ohne
                  Gewinnerzielungsabsicht.
                </p>
              </div>

              <h2 className="mb-3 text-lg font-semibold">Verantwortlich für den Inhalt</h2>
              <p className="mb-2">
                David Grunert
                <br />
                E-Mail: grunert94@hotmail.com
              </p>
              <p>
                Da diese Seite rein privat und nicht geschäftsmäßig betrieben wird, besteht keine
                Verpflichtung zur Benennung eines Datenschutzbeauftragten.
              </p>
            </div>
          </div>
        </AppShell>
      ),
    },
    {
      path: "/datenschutz",
      element: (
        <AppShell>
          <div className="py-8">
            <h1 className="mb-6 text-2xl font-bold">Datenschutzerklärung</h1>
            <div className="prose max-w-none">
              <div className="mb-6 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                <p className="font-medium text-blue-200">
                  Diese Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener
                  Daten bei Nutzung dieser Anwendung.
                </p>
              </div>

              <section className="mb-6">
                <h2 className="mb-3 text-lg font-semibold">1. Verantwortliche Stelle</h2>
                <p className="mb-2">
                  David Grunert
                  <br />
                  E-Mail:{" "}
                  <a href="mailto:grunert94@hotmail.com" className="text-brand hover:underline">
                    grunert94@hotmail.com
                  </a>
                </p>
                <p>
                  Da diese Seite rein privat und nicht geschäftsmäßig betrieben wird, besteht keine
                  Verpflichtung zur Benennung eines Datenschutzbeauftragten.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="mb-3 text-lg font-semibold">2. Allgemeine Hinweise</h2>
                <p className="mb-2">
                  Die Nutzung dieser Website ist ohne Angabe personenbezogener Daten möglich.
                </p>
                <p className="mb-2">
                  Ich bitte ausdrücklich darum, keine persönlichen oder sensiblen Informationen (z.
                  B. Name, Adresse, Gesundheits-, Finanz- oder Identitätsdaten) in Texteingabefelder
                  oder Chatfunktionen einzutragen.
                </p>
                <p>
                  Ich selbst erfasse oder speichere keine personenbezogenen Daten. Technische Daten
                  können jedoch durch die verwendeten Dienstleister automatisch verarbeitet werden,
                  um die Seite bereitzustellen und den Betrieb sicherzustellen.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="mb-3 text-lg font-semibold">
                  3. Verarbeitung durch technische Dienstleister
                </h2>

                <h3 className="mb-2 font-medium">a) INWX GmbH & Co. KG (Domain-Provider)</h3>
                <p className="mb-2">
                  Die Domain disaai.de wird über den Anbieter INWX GmbH & Co. KG,
                  Prinzessinnenstraße 30, 10969 Berlin, betrieben. INWX speichert und verarbeitet
                  technische Daten im Rahmen der Domainverwaltung, z. B. DNS-Einträge,
                  Serververbindungen und administrative Kontaktinformationen.
                </p>
                <p className="mb-2">
                  <strong>Zweck:</strong> Registrierung, Verwaltung und Bereitstellung der Domain.
                </p>
                <p className="mb-4">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                  Interesse am Betrieb der Domain).
                </p>

                <h3 className="mb-2 font-medium">
                  b) Cloudflare Inc. (Content Delivery / Sicherheitsdienst)
                </h3>
                <p className="mb-2">
                  Zur Bereitstellung, Absicherung und Beschleunigung der Website wird der Dienst
                  Cloudflare Inc., 101 Townsend St, San Francisco, CA 94107, USA, eingesetzt.
                  Cloudflare verarbeitet technische Informationen wie IP-Adresse, Browsertyp, Datum,
                  Uhrzeit und angeforderte Ressourcen.
                </p>
                <p className="mb-2">
                  <strong>Zweck:</strong> Schutz vor Angriffen, DDoS-Abwehr,
                  Performance-Optimierung.
                </p>
                <p className="mb-2">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                  Interesse am sicheren und schnellen Betrieb der Website).
                </p>
                <p className="mb-4">
                  Es kann eine Datenübermittlung in die USA stattfinden; Cloudflare verwendet
                  hierfür Standardvertragsklauseln gemäß Art. 46 DSGVO.
                </p>

                <h3 className="mb-2 font-medium">c) OpenRouter Inc. (KI-Funktion)</h3>
                <p className="mb-2">
                  Für die optionalen KI-Funktionen wird der Dienst OpenRouter Inc. genutzt. Wenn
                  Nutzer Texte oder Fragen eingeben, werden diese an OpenRouter übermittelt, um eine
                  Antwort zu erzeugen. Diese Eingaben können personenbezogene Informationen
                  enthalten, wenn sie freiwillig angegeben werden.
                </p>
                <p className="mb-2">
                  Ich selbst speichere keine Eingaben oder Antworten. OpenRouter kann jedoch
                  Metadaten wie Zeitstempel oder Token-Anzahl erfassen.
                </p>
                <p className="mb-4">
                  <strong>Zweck:</strong> Bereitstellung der KI-Funktion.
                </p>
                <p>
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                  Interesse am Funktionsbetrieb).
                </p>
              </section>

              <section className="mb-6">
                <h2 className="mb-3 text-lg font-semibold">4. Cookies und Tracking</h2>
                <p>
                  Ich selbst verwende keine Cookies und keine Tracking-Dienste. Cloudflare kann
                  technisch notwendige Cookies setzen, um Sicherheits- und Lastverteilungsfunktionen
                  bereitzustellen. Diese speichern keine personenbezogenen Informationen im
                  rechtlichen Sinne.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="mb-3 text-lg font-semibold">5. Speicherdauer</h2>
                <p>
                  Ich speichere keinerlei personenbezogene Daten. Daten, die durch INWX, Cloudflare
                  oder OpenRouter verarbeitet werden, unterliegen deren jeweiligen Speicher- und
                  Löschrichtlinien. Ich habe darauf keinen direkten Einfluss.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="mb-3 text-lg font-semibold">6. Rechte der betroffenen Personen</h2>
                <p className="mb-2">
                  Soweit über die genannten Dienstleister personenbezogene Daten verarbeitet werden,
                  haben betroffene Personen nach DSGVO folgende Rechte:
                </p>
                <ul className="mb-2 list-disc space-y-1 pl-6">
                  <li>Auskunft (Art. 15)</li>
                  <li>Berichtigung (Art. 16)</li>
                  <li>Löschung (Art. 17)</li>
                  <li>Einschränkung (Art. 18)</li>
                  <li>Datenübertragbarkeit (Art. 20)</li>
                  <li>Widerspruch (Art. 21)</li>
                  <li>Widerruf einer Einwilligung (Art. 7 Abs. 3)</li>
                  <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77)</li>
                </ul>
                <p>
                  Zur Ausübung dieser Rechte kann eine Anfrage an{" "}
                  <a href="mailto:grunert94@hotmail.com" className="text-brand hover:underline">
                    grunert94@hotmail.com
                  </a>{" "}
                  gestellt werden.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="mb-3 text-lg font-semibold">7. Datensicherheit</h2>
                <p>
                  Die Übertragung dieser Website erfolgt über HTTPS (TLS-Verschlüsselung). Ich
                  treffe zumutbare Maßnahmen zum Schutz der übertragenen Daten. Eine absolute
                  Sicherheit der Datenübertragung im Internet kann jedoch nicht garantiert werden.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  8. Änderungen dieser Datenschutzerklärung
                </h2>
                <p>
                  Ich behalte mir vor, diese Erklärung zu ändern, falls sich technische Abläufe oder
                  gesetzliche Rahmenbedingungen ändern. Die aktuelle Version ist jederzeit auf{" "}
                  <a href="https://disaai.de" className="text-brand hover:underline">
                    https://disaai.de
                  </a>{" "}
                  abrufbar.
                </p>
              </section>
            </div>
          </div>
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
