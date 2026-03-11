import { Badge, Card } from "@/ui";

export default function ImpressumPage() {
  return (
    <div className="relative isolate mx-auto flex h-full w-full max-w-4xl flex-col overflow-y-auto pb-6">
      <div
        className="pointer-events-none absolute left-1/2 top-0 hidden h-56 w-56 -translate-x-1/2 rounded-full blur-3xl sm:block"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(251,191,36,0.08) 55%, transparent 72%)",
          opacity: 0.4,
        }}
        aria-hidden="true"
      />

      <Card
        className="relative w-full overflow-hidden rounded-[28px] border-white/[0.10] bg-surface-1/86 shadow-[0_18px_42px_-32px_rgba(0,0,0,0.76)] ring-1 ring-inset ring-white/[0.04] sm:backdrop-blur-xl"
        padding="lg"
      >
        <div
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          aria-hidden
        />
        <article className="relative space-y-8 text-sm leading-7 text-ink-secondary">
          <header className="border-b border-white/8 pb-6 text-left sm:text-center">
            <div className="mb-3 flex justify-start sm:justify-center">
              <Badge className="rounded-full border-white/10 bg-white/[0.06] px-3 py-1.5 text-ink-secondary">
                Rechtliches
              </Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink-primary">Impressum</h1>
            <p className="mt-2 text-sm text-ink-secondary">Verantwortlich für den Inhalt</p>
          </header>

          <div className="rounded-[22px] border border-white/[0.08] bg-black/[0.10] p-4 shadow-inner">
            <p className="leading-relaxed text-ink-primary">
              Dies ist eine rein private, nicht geschäftsmäßige Webseite ohne
              Gewinnerzielungsabsicht.
            </p>
          </div>

          <nav
            className="rounded-[22px] border border-white/[0.08] bg-black/[0.10] p-4 shadow-inner"
            aria-label="Inhalt"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">
              Inhalt
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-secondary">
              <li>
                <a
                  className="flex min-h-[44px] items-center rounded-md py-2 transition-colors hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60"
                  href="#impressum-angaben"
                >
                  Angaben gemäß § 5 TMG
                </a>
              </li>
              <li>
                <a
                  className="flex min-h-[44px] items-center rounded-md py-2 transition-colors hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60"
                  href="#impressum-kontakt"
                >
                  Kontakt
                </a>
              </li>
              <li>
                <a
                  className="flex min-h-[44px] items-center rounded-md py-2 transition-colors hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60"
                  href="#impressum-verantwortlich"
                >
                  Verantwortlich für den Inhalt
                </a>
              </li>
            </ul>
          </nav>

          <section className="space-y-4">
            <h2
              id="impressum-angaben"
              className="text-xl font-semibold tracking-tight text-ink-primary"
            >
              Angaben gemäß § 5 TMG
            </h2>
            <div className="text-ink-secondary space-y-2 leading-relaxed text-sm">
              <p className="font-medium text-ink-primary">David Grunert</p>
              <p>
                Graßdorfer Straße 9
                <br />
                04425 Taucha
                <br />
                Deutschland
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2
              id="impressum-kontakt"
              className="text-xl font-semibold tracking-tight text-ink-primary"
            >
              Kontakt
            </h2>
            <div className="text-ink-secondary text-sm">
              <p>
                E-Mail:{" "}
                <a
                  href="mailto:grunert94@hotmail.com"
                  className="text-accent-primary hover:text-accent-primary/80 hover:underline transition-colors"
                >
                  grunert94@hotmail.com
                </a>
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2
              id="impressum-verantwortlich"
              className="text-xl font-semibold tracking-tight text-ink-primary"
            >
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <div className="text-ink-secondary space-y-2 text-sm">
              <p className="font-medium text-ink-primary">David Grunert</p>
              <p>
                Graßdorfer Straße 9
                <br />
                04425 Taucha
                <br />
                Deutschland
              </p>
            </div>
          </section>

          <section className="space-y-4 border-t border-white/8 pt-4">
            <p className="text-sm leading-relaxed text-ink-tertiary">
              Da diese Seite rein privat und nicht geschäftsmäßig betrieben wird, besteht keine
              Verpflichtung zur Benennung eines Datenschutzbeauftragten.
            </p>
          </section>
        </article>
      </Card>
    </div>
  );
}
