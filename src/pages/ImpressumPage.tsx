import { GlassCard, SectionHeader } from "@/ui";

export default function ImpressumPage() {
  return (
    <>
      <SectionHeader title="Impressum" subtitle="Verantwortlich für den Inhalt" />
      <GlassCard variant="raised" className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Intro Notice - Material Style */}
        <div className="rounded-sm bg-surface-inset shadow-inset p-4 text-accent-secondary">
          <p className="font-medium">
            Dies ist eine rein private, nicht geschäftsmäßige Webseite ohne Gewinnerzielungsabsicht.
          </p>
        </div>

        {/* Verantwortliche Stelle */}
        <section>
          <h2 className="text-lg font-semibold text-text-on-raised mb-3">
            Verantwortlich für den Inhalt
          </h2>
          <div className="text-text-secondary space-y-2">
            <p>
              David Grunert
              <br />
              E-Mail:{" "}
              <a
                href="mailto:grunert94@hotmail.com"
                className="text-accent-primary hover:underline"
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
      </GlassCard>
    </>
  );
}
