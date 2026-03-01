import { Card } from "@/ui";

export default function ImpressumPage() {
  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-y-auto px-4 py-6 sm:px-6">
      <Card className="w-full border-white/10 bg-surface-card/95" padding="lg">
        <article className="space-y-8 text-sm leading-7 text-ink-secondary">
          <header className="border-b border-white/8 pb-5 text-left sm:text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-ink-primary">Impressum</h1>
            <p className="mt-2 text-sm text-ink-secondary">Verantwortlich für den Inhalt</p>
          </header>

          <div className="rounded-xl border border-white/10 bg-surface-2/70 p-4">
            <p className="leading-relaxed text-ink-primary">
              Dies ist eine rein private, nicht geschäftsmäßige Webseite ohne
              Gewinnerzielungsabsicht.
            </p>
          </div>

          <nav
            className="rounded-lg border border-white/10 bg-surface-2/60 p-4"
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
            <h2 id="impressum-angaben" className="text-xl font-semibold text-ink-primary">
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
            <h2 id="impressum-kontakt" className="text-xl font-semibold text-ink-primary">
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
            <h2 id="impressum-verantwortlich" className="text-xl font-semibold text-ink-primary">
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
