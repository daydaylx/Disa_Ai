import { MobileCard, SectionHeader, Typography } from "@/ui";

export default function DatenschutzPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Rechtliches"
        title="Datenschutzerklärung"
        description="Informationen über die Verarbeitung personenbezogener Daten"
      />

      <MobileCard accent="neutral">
        <div className="space-y-8 text-[var(--text-secondary)]">
          <div className="rounded-2xl border border-[var(--color-primary-200)] bg-[var(--color-primary-50)]/80 p-4 text-[var(--color-primary-700)]">
            <p className="font-medium">
              Diese Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener
              Daten bei Nutzung dieser Anwendung.
            </p>
          </div>

          <section className="space-y-3">
            <Typography variant="body" className="font-semibold text-[var(--text-primary)]">
              1. Verantwortliche Stelle
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

          <section className="space-y-3">
            <Typography variant="body" className="font-semibold text-[var(--text-primary)]">
              2. Allgemeine Hinweise
            </Typography>
            <p>Die Nutzung dieser Website ist ohne Angabe personenbezogener Daten möglich.</p>
            <p>
              Ich bitte ausdrücklich darum, keine persönlichen oder sensiblen Informationen (z. B.
              Name, Adresse, Gesundheits-, Finanz- oder Identitätsdaten) in Texteingabefelder oder
              Chatfunktionen einzutragen.
            </p>
            <p>
              Ich selbst erfasse oder speichere keine personenbezogenen Daten. Technische Daten
              können jedoch durch die verwendeten Dienstleister automatisch verarbeitet werden, um
              die Seite bereitzustellen und den Betrieb sicherzustellen.
            </p>
          </section>

          <section className="space-y-4">
            <Typography variant="body" className="font-semibold text-[var(--text-primary)]">
              3. Verarbeitung durch technische Dienstleister
            </Typography>
            <div className="space-y-2">
              <Typography variant="body-sm" className="font-medium text-[var(--text-primary)]">
                a) INWX GmbH &amp; Co. KG (Domain-Provider)
              </Typography>
              <p>
                Die Domain disaai.de wird über den Anbieter INWX GmbH &amp; Co. KG,
                Prinzessinnenstraße 30, 10969 Berlin, betrieben. INWX speichert und verarbeitet
                technische Daten im Rahmen der Domainverwaltung, z. B. DNS-Einträge,
                Serververbindungen und administrative Kontaktinformationen.
              </p>
              <p>
                <strong>Zweck:</strong> Registrierung, Verwaltung und Bereitstellung der Domain.
              </p>
              <p>
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
                am Betrieb der Domain).
              </p>
            </div>
            <div className="space-y-2">
              <Typography variant="body-sm" className="font-medium text-[var(--text-primary)]">
                b) Cloudflare Inc. (Content Delivery / Sicherheitsdienst)
              </Typography>
              <p>
                Zur Bereitstellung, Absicherung und Beschleunigung der Website wird der Dienst
                Cloudflare Inc., 101 Townsend St, San Francisco, CA 94107, USA, eingesetzt.
                Cloudflare verarbeitet technische Informationen wie IP-Adresse, Browsertyp, Datum,
                Uhrzeit und angeforderte Ressourcen.
              </p>
              <p>
                <strong>Zweck:</strong> Schutz vor Angriffen, DDoS-Abwehr, Performance-Optimierung.
              </p>
              <p>
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
                am sicheren und schnellen Betrieb der Website).
              </p>
              <p>
                Es kann eine Datenübermittlung in die USA stattfinden; Cloudflare verwendet hierfür
                Standardvertragsklauseln gemäß Art. 46 DSGVO.
              </p>
            </div>
            <div className="space-y-2">
              <Typography variant="body-sm" className="font-medium text-[var(--text-primary)]">
                c) OpenRouter Inc. (KI-Funktion)
              </Typography>
              <p>
                Für die optionalen KI-Funktionen wird der Dienst OpenRouter Inc. genutzt. Wenn
                Nutzer Texte oder Fragen eingeben, werden diese an OpenRouter übermittelt, um eine
                Antwort zu erzeugen. Diese Eingaben können personenbezogene Informationen enthalten,
                wenn sie freiwillig angegeben werden.
              </p>
              <p>
                Ich selbst speichere keine Eingaben oder Antworten. OpenRouter kann jedoch Metadaten
                wie Zeitstempel oder Token-Anzahl erfassen.
              </p>
              <p>
                <strong>Zweck:</strong> Bereitstellung der KI-Funktion.
              </p>
              <p>
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
                am Funktionsbetrieb).
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <Typography variant="body" className="font-semibold text-[var(--text-primary)]">
              4. Cookies und Tracking
            </Typography>
            <p>
              Ich selbst verwende keine Cookies und keine Tracking-Dienste. Cloudflare kann
              technisch notwendige Cookies setzen, um Sicherheits- und Lastverteilungsfunktionen
              bereitzustellen. Diese speichern keine personenbezogenen Informationen im rechtlichen
              Sinne.
            </p>
          </section>

          <section className="space-y-2">
            <Typography variant="body" className="font-semibold text-[var(--text-primary)]">
              5. Speicherdauer
            </Typography>
            <p>
              Ich speichere keinerlei personenbezogene Daten. Daten, die durch INWX, Cloudflare oder
              OpenRouter verarbeitet werden, unterliegen deren jeweiligen Speicher- und
              Löschrichtlinien. Ich habe darauf keinen direkten Einfluss.
            </p>
          </section>

          <section className="space-y-3">
            <Typography variant="body" className="font-semibold text-[var(--text-primary)]">
              6. Rechte der betroffenen Personen
            </Typography>
            <p>
              Soweit über die genannten Dienstleister personenbezogene Daten verarbeitet werden,
              haben betroffene Personen nach DSGVO folgende Rechte:
            </p>
            <ul className="ml-4 list-disc space-y-1">
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
              <a
                href="mailto:grunert94@hotmail.com"
                className="text-[var(--color-primary-500)] hover:underline"
              >
                grunert94@hotmail.com
              </a>{" "}
              gestellt werden.
            </p>
          </section>

          <section className="space-y-2">
            <Typography variant="body" className="font-semibold text-[var(--text-primary)]">
              7. Datensicherheit
            </Typography>
            <p>
              Die Übertragung dieser Website erfolgt über HTTPS (TLS-Verschlüsselung). Ich treffe
              zumutbare Maßnahmen zum Schutz der übertragenen Daten. Eine absolute Sicherheit der
              Datenübertragung im Internet kann jedoch nicht garantiert werden.
            </p>
          </section>

          <section className="space-y-2">
            <Typography variant="body" className="font-semibold text-[var(--text-primary)]">
              8. Änderungen dieser Datenschutzerklärung
            </Typography>
            <p>
              Ich behalte mir vor, diese Erklärung zu ändern, falls sich technische Abläufe oder
              gesetzliche Rahmenbedingungen ändern. Die aktuelle Version ist jederzeit auf{" "}
              <a
                href="https://disaai.de"
                className="text-[var(--color-primary-500)] hover:underline"
              >
                https://disaai.de
              </a>{" "}
              abrufbar.
            </p>
          </section>
        </div>
      </MobileCard>
    </div>
  );
}
