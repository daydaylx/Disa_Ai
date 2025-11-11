import { Link } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function StudioHome() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-surface-bg text-text-primary">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(120%_100%_at_50%_0%,hsl(var(--brand-1)/0.12)_0%,transparent_70%)]" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6">
        <section className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent/80">
            Disa AI Studio
          </p>
          <h1 className="text-2xl font-semibold text-text-primary sm:text-3xl">
            Dein ruhiges KI-Studio fr klare, produktive Konversationen.
          </h1>
          <p className="max-w-2xl text-sm text-text-secondary">
            Starte einen Chat, whle ein Modell oder eine Rolle und verwalte alles zentral  optimiert
            fr mobile Android-Gerte und PWA.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="sm" asChild>
              <Link to="/chat">Neue Konversation starten</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/settings">API-Key & Einstellungen</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="border-line-subtle bg-surface-base/95 shadow-neo-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  🗨️
                </span>
                Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-text-secondary">
              <p>Fhre fokussierte Konversationen mit stabiler Streaming-Engine und Auto-Save.</p>
              <Button size="xs" asChild>
                <Link to="/chat">Chat fnen</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-line-subtle bg-surface-base/95 shadow-neo-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  🧠
                </span>
                Modelle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-text-secondary">
              <p>
                Vergleiche Modelle, Kosten und Kontextlngen. Whle, was zu deinem Use-Case passt.
              </p>
              <Button size="xs" variant="ghost" asChild>
                <Link to="/models">Modelle entdecken</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-line-subtle bg-surface-base/95 shadow-neo-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  🎭
                </span>
                Rollen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-text-secondary">
              <p>Nutze kuratierte Rollenprofile fr Research, Schreiben, Coding und Support.</p>
              <Button size="xs" variant="ghost" asChild>
                <Link to="/roles">Rollen auswhlen</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-line-subtle bg-surface-base/95 shadow-neo-xs">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  ⚙️
                </span>
                Einstellungen & Daten
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-text-secondary">
              <p>
                Verwalte API-Keys, Speicher, Filter und Exporte  transparent und lokal
                kontrollierbar.
              </p>
              <Button size="xs" variant="ghost" asChild>
                <Link to="/settings">Studio konfigurieren</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
