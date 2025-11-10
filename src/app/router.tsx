import { lazy } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import { ErrorBoundary } from "../components/ErrorBoundary";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { RouteWrapper } from "./components/RouteWrapper";
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
          <div className="flex min-h-screen flex-col items-center justify-center p-space-md">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Impressum</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none text-text-secondary">
                <div className="mb-space-md rounded-lg border border-info-soft bg-info-soft p-space-md text-info">
                  <p className="font-medium">
                    Dies ist eine rein private, nicht geschäftsmäßige Webseite ohne
                    Gewinnerzielungsabsicht.
                  </p>
                </div>

                <h2 className="mb-space-sm text-lg font-semibold text-text-primary">
                  Verantwortlich für den Inhalt
                </h2>
                <p className="mb-space-sm">
                  David Grunert
                  <br />
                  E-Mail: grunert94@hotmail.com
                </p>
                <p>
                  Da diese Seite rein privat und nicht geschäftsmäßig betrieben wird, besteht keine
                  Verpflichtung zur Benennung eines Datenschutzbeauftragten.
                </p>
              </CardContent>
            </Card>
          </div>
        </RouteWrapper>
      ),
    },
    {
      path: "/datenschutz",
      element: (
        <RouteWrapper>
          <div className="flex min-h-screen flex-col items-center justify-center p-space-md">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Datenschutzerklärung</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none text-text-secondary">
                <div className="mb-space-md rounded-lg border border-info-soft bg-info-soft p-space-md text-info">
                  <p className="font-medium">
                    Diese Datenschutzerklärung informiert Sie über die Verarbeitung
                    personenbezogener Daten bei Nutzung dieser Anwendung.
                  </p>
                </div>

                <section className="mb-space-lg">
                  <h2 className="mb-space-sm text-lg font-semibold text-text-primary">
                    1. Verantwortliche Stelle
                  </h2>
                  <p className="mb-space-sm">
                    David Grunert
                    <br />
                    E-Mail:{" "}
                    <a href="mailto:grunert94@hotmail.com" className="text-accent hover:underline">
                      grunert94@hotmail.com
                    </a>
                  </p>
                  <p>
                    Da diese Seite rein privat und nicht geschäftsmäßig betrieben wird, besteht
                    keine Verpflichtung zur Benennung eines Datenschutzbeauftragten.
                  </p>
                </section>

                <section className="mb-space-lg">
                  <h2 className="mb-space-sm text-lg font-semibold text-text-primary">
                    2. Allgemeine Hinweise
                  </h2>
                  <p className="mb-space-sm">
                    Die Nutzung dieser Website ist ohne Angabe personenbezogener Daten möglich.
                  </p>
                  <p className="mb-space-sm">
                    Ich bitte ausdrücklich darum, keine persönlichen oder sensiblen Informationen
                    (z. B. Name, Adresse, Gesundheits-, Finanz- oder Identitätsdaten) in
                    Texteingabefelder oder Chatfunktionen einzutragen.
                  </p>
                  <p>
                    Ich selbst erfasse oder speichere keine personenbezogenen Daten. Technische
                    Daten können jedoch durch die verwendeten Dienstleister automatisch verarbeitet
                    werden, um die Seite bereitzustellen und den Betrieb sicherzustellen.
                  </p>
                </section>

                <section className="mb-space-lg">
                  <h2 className="mb-space-sm text-lg font-semibold text-text-primary">
                    3. Verarbeitung durch technische Dienstleister
                  </h2>

                  <h3 className="mb-space-sm font-medium text-text-primary">
                    a) INWX GmbH & Co. KG (Domain-Provider)
                  </h3>
                  <p className="mb-space-sm">
                    Die Domain disaai.de wird über den Anbieter INWX GmbH & Co. KG,
                    Prinzessinnenstraße 30, 10969 Berlin, betrieben. INWX speichert und verarbeitet
                    technische Daten im Rahmen der Domainverwaltung, z. B. DNS-Einträge,
                    Serververbindungen und administrative Kontaktinformationen.
                  </p>
                  <p className="mb-space-sm">
                    <strong>Zweck:</strong> Registrierung, Verwaltung und Bereitstellung der Domain.
                  </p>
                  <p className="mb-space-md">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                    Interesse am Betrieb der Domain).
                  </p>

                  <h3 className="mb-space-sm font-medium text-text-primary">
                    b) Cloudflare Inc. (Content Delivery / Sicherheitsdienst)
                  </h3>
                  <p className="mb-space-sm">
                    Zur Bereitstellung, Absicherung und Beschleunigung der Website wird der Dienst
                    Cloudflare Inc., 101 Townsend St, San Francisco, CA 94107, USA, eingesetzt.
                    Cloudflare verarbeitet technische Informationen wie IP-Adresse, Browsertyp,
                    Datum, Uhrzeit und angeforderte Ressourcen.
                  </p>
                  <p className="mb-space-sm">
                    <strong>Zweck:</strong> Schutz vor Angriffen, DDoS-Abwehr,
                    Performance-Optimierung.
                  </p>
                  <p className="mb-space-sm">
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                    Interesse am sicheren und schnellen Betrieb der Website).
                  </p>
                  <p className="mb-space-md">
                    Es kann eine Datenübermittlung in die USA stattfinden; Cloudflare verwendet
                    hierfür Standardvertragsklauseln gemäß Art. 46 DSGVO.
                  </p>

                  <h3 className="mb-space-sm font-medium text-text-primary">
                    c) OpenRouter Inc. (KI-Funktion)
                  </h3>
                  <p className="mb-space-sm">
                    Für die optionalen KI-Funktionen wird der Dienst OpenRouter Inc. genutzt. Wenn
                    Nutzer Texte oder Fragen eingeben, werden diese an OpenRouter übermittelt, um
                    eine Antwort zu erzeugen. Diese Eingaben können personenbezogene Informationen
                    enthalten, wenn sie freiwillig angegeben werden.
                  </p>
                  <p className="mb-space-sm">
                    Ich selbst speichere keine Eingaben oder Antworten. OpenRouter kann jedoch
                    Metadaten wie Zeitstempel oder Token-Anzahl erfassen.
                  </p>
                  <p className="mb-space-md">
                    <strong>Zweck:</strong> Bereitstellung der KI-Funktion.
                  </p>
                  <p>
                    <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                    Interesse am Funktionsbetrieb).
                  </p>
                </section>

                <section className="mb-space-lg">
                  <h2 className="mb-space-sm text-lg font-semibold text-text-primary">
                    4. Cookies und Tracking
                  </h2>
                  <p>
                    Ich selbst verwende keine Cookies und keine Tracking-Dienste. Cloudflare kann
                    technisch notwendige Cookies setzen, um Sicherheits- und
                    Lastverteilungsfunktionen bereitzustellen. Diese speichern keine
                    personenbezogenen Informationen im rechtlichen Sinne.
                  </p>
                </section>

                <section className="mb-space-lg">
                  <h2 className="mb-space-sm text-lg font-semibold text-text-primary">
                    5. Speicherdauer
                  </h2>
                  <p>
                    Ich speichere keinerlei personenbezogene Daten. Daten, die durch INWX,
                    Cloudflare oder OpenRouter verarbeitet werden, unterliegen deren jeweiligen
                    Speicher- und Löschrichtlinien. Ich habe darauf keinen direkten Einfluss.
                  </p>
                </section>

                <section className="mb-space-lg">
                  <h2 className="mb-space-sm text-lg font-semibold text-text-primary">
                    6. Rechte der betroffenen Personen
                  </h2>
                  <p className="mb-space-sm">
                    Soweit über die genannten Dienstleister personenbezogene Daten verarbeitet
                    werden, haben betroffene Personen nach DSGVO folgende Rechte:
                  </p>
                  <ul className="mb-space-sm list-disc space-y-space-xs pl-space-lg">
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
                    <a href="mailto:grunert94@hotmail.com" className="text-accent hover:underline">
                      grunert94@hotmail.com
                    </a>{" "}
                    gestellt werden.
                  </p>
                </section>

                <section className="mb-space-lg">
                  <h2 className="mb-space-sm text-lg font-semibold text-text-primary">
                    7. Datensicherheit
                  </h2>
                  <p>
                    Die Übertragung dieser Website erfolgt über HTTPS (TLS-Verschlüsselung). Ich
                    treffe zumutbare Maßnahmen zum Schutz der übertragenen Daten. Eine absolute
                    Sicherheit der Datenübertragung im Internet kann jedoch nicht garantiert werden.
                  </p>
                </section>

                <section>
                  <h2 className="mb-space-sm text-lg font-semibold text-text-primary">
                    8. Änderungen dieser Datenschutzerklärung
                  </h2>
                  <p>
                    Ich behalte mir vor, diese Erklärung zu ändern, falls sich technische Abläufe
                    oder gesetzliche Rahmenbedingungen ändern. Die aktuelle Version ist jederzeit
                    auf{" "}
                    <a href="https://disaai.de" className="text-accent hover:underline">
                      https://disaai.de
                    </a>{" "}
                    abrufbar.
                  </p>
                </section>
              </CardContent>
            </Card>
          </div>
        </RouteWrapper>
      ),
    },
    {
      path: "/404",
      element: (
        <AppShell>
          <ErrorBoundary>
            <div className="flex min-h-screen flex-col items-center justify-center p-space-md">
              <Card className="w-full max-w-md text-center">
                <CardHeader>
                  <CardTitle className="text-5xl font-bold text-text-primary">404</CardTitle>
                  <CardDescription className="mt-2 text-lg text-text-secondary">
                    Seite nicht gefunden
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary">
                    Die gesuchte Seite existiert nicht oder wurde verschoben.
                  </p>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button asChild variant="default">
                    <a href="/chat">Zurück zum Chat</a>
                  </Button>
                </CardFooter>
              </Card>
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
