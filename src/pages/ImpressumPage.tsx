import { Card } from "@/ui";

export default function ImpressumPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl" padding="lg">
        <div className="space-y-8">
          <div className="text-center pb-4 border-b border-white/5">
            <h1 className="text-2xl font-bold text-ink-primary">Impressum</h1>
            <p className="text-sm text-ink-secondary mt-2">Verantwortlich für den Inhalt</p>
          </div>

          <div className="rounded-xl bg-accent-primary/10 border border-accent-primary/20 p-4 text-sm text-ink-primary">
            <p className="leading-relaxed">
              Dies ist eine rein private, nicht geschäftsmäßige Webseite ohne
              Gewinnerzielungsabsicht.
            </p>
          </div>

          <div className="rounded-lg bg-surface-2/60 border border-white/5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">
              Inhalt
            </p>
            <ul className="mt-2 space-y-1 text-sm text-ink-secondary">
              <li>
                <a className="hover:text-ink-primary" href="#impressum-angaben">
                  Angaben gemäß § 5 TMG
                </a>
              </li>
              <li>
                <a className="hover:text-ink-primary" href="#impressum-kontakt">
                  Kontakt
                </a>
              </li>
              <li>
                <a className="hover:text-ink-primary" href="#impressum-verantwortlich">
                  Verantwortlich für den Inhalt
                </a>
              </li>
            </ul>
          </div>

          <section className="space-y-4">
            <h2 id="impressum-angaben" className="text-lg font-semibold text-ink-primary">
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
            <h2 id="impressum-kontakt" className="text-lg font-semibold text-ink-primary">
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
            <h2 id="impressum-verantwortlich" className="text-lg font-semibold text-ink-primary">
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

          <section className="space-y-4 pt-4 border-t border-white/5">
            <p className="text-sm text-ink-tertiary">
              Da diese Seite rein privat und nicht geschäftsmäßig betrieben wird, besteht keine
              Verpflichtung zur Benennung eines Datenschutzbeauftragten.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
