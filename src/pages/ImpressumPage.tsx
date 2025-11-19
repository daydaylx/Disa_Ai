import { GlassCard, SectionHeader } from "@/ui";

export default function ImpressumPage() {
  return (
    <>
      <SectionHeader title="Impressum" subtitle="Verantwortlich für den Inhalt" />
      <GlassCard className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Intro Notice */}
        <div className="rounded-lg border border-[var(--color-success-200)] bg-[var(--color-success-50)] p-4 text-[var(--color-success-700)]">
          <p className="font-medium">
            Dies ist eine rein private, nicht geschäftsmäßige Webseite ohne Gewinnerzielungsabsicht.
          </p>
        </div>

        {/* Verantwortliche Stelle */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            Verantwortlich für den Inhalt
          </h2>
          <div className="text-[var(--text-secondary)] space-y-2">
            <p>
              David Grunert
              <br />
              E-Mail:{" "}
              <a
                href="mailto:grunert94@hotmail.com"
                className="text-[var(--color-primary-500)] hover:underline"
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
