import { MobileCard, SectionHeader, Typography } from "@/ui";

export default function ImpressumPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Rechtliches"
        title="Impressum"
        description="Verantwortlich für den Inhalt dieser Anwendung"
      />

      <MobileCard accent="neutral">
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--color-success-200)] bg-[var(--color-success-50)]/80 p-4 text-[var(--color-success-700)]">
            <p className="font-medium">
              Dies ist eine rein private, nicht geschäftsmäßige Webseite ohne
              Gewinnerzielungsabsicht.
            </p>
          </div>

          <section className="space-y-2 text-[var(--text-secondary)]">
            <Typography variant="body" className="font-semibold text-[var(--text-primary)]">
              Verantwortlich für den Inhalt
            </Typography>
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
          </section>
        </div>
      </MobileCard>
    </div>
  );
}
