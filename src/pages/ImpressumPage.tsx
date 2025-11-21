import { PremiumCard, SectionHeader } from "@/ui";

export default function ImpressumPage() {
  return (
    <>
      <SectionHeader title="Impressum" subtitle="Verantwortlich für den Inhalt" />
      <PremiumCard variant="default" className="max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Intro Notice - Material Style */}
          <div className="rounded-md bg-surface-inset shadow-inset p-4 text-accent-secondary">
            <p className="font-medium leading-relaxed">
              Dies ist eine rein private, nicht geschäftsmäßige Webseite ohne
              Gewinnerzielungsabsicht.
            </p>
          </div>

          {/* Verantwortliche Stelle */}
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              Verantwortlich für den Inhalt
            </h2>
            <div className="text-text-secondary space-y-3 leading-relaxed">
              <p>
                David Grunert
                <br />
                E-Mail:{" "}
                <a
                  href="mailto:grunert94@hotmail.com"
                  className="text-brand hover:text-brand-bright hover:underline transition-colors"
                >
                  grunert94@hotmail.com
                </a>
              </p>
              <p>
                Da diese Seite rein privat und nicht geschäftsmäßig betrieben wird, besteht keine
                Verpflichtung zur Benennung eines Datenschutzbeauftragten.
              </p>
            </div>
          </section>
        </div>
      </PremiumCard>
    </>
  );
}
