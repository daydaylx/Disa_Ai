import {
  AppMenuDrawer,
  defaultMenuSections,
  MenuIcon,
  useMenuDrawer,
} from "../components/layout/AppMenuDrawer";
import { LegalPageShell } from "../components/layout/PageShell";
import { Card } from "../components/ui/card";

export default function DatenschutzPage() {
  const { isOpen, openMenu, closeMenu } = useMenuDrawer();

  return (
    <LegalPageShell
      title="Datenschutzerklärung"
      subtitle="Informationen über die Verarbeitung personenbezogener Daten"
      actions={<MenuIcon onClick={openMenu} />}
    >
      <Card className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Intro Notice */}
        <div className="rounded-lg border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] p-4 text-[var(--color-primary-700)]">
          <p className="font-medium">
            Diese Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener Daten
            bei Nutzung dieser Anwendung.
          </p>
        </div>

        {/* 1. Verantwortliche Stelle */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            1. Verantwortliche Stelle
          </h2>
          <div className="text-[var(--text-secondary)] space-y-3">
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

        {/* 2. Allgemeine Hinweise */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            2. Allgemeine Hinweise
          </h2>
          <div className="text-[var(--text-secondary)] space-y-3">
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
          </div>
        </section>

        {/* 3. Verarbeitung durch technische Dienstleister */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            3. Verarbeitung durch technische Dienstleister
          </h2>

          {/* INWX */}
          <div className="mb-6">
            <h3 className="font-medium text-[var(--text-primary)] mb-2">
              a) INWX GmbH & Co. KG (Domain-Provider)
            </h3>
            <div className="text-[var(--text-secondary)] space-y-2">
              <p>
                Die Domain disaai.de wird über den Anbieter INWX GmbH & Co. KG, Prinzessinnenstraße
                30, 10969 Berlin, betrieben. INWX speichert und verarbeitet technische Daten im
                Rahmen der Domainverwaltung, z. B. DNS-Einträge, Serververbindungen und
                administrative Kontaktinformationen.
              </p>
              <p>
                <strong>Zweck:</strong> Registrierung, Verwaltung und Bereitstellung der Domain.
              </p>
              <p>
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
                am Betrieb der Domain).
              </p>
            </div>
          </div>

          {/* Cloudflare */}
          <div className="mb-6">
            <h3 className="font-medium text-[var(--text-primary)] mb-2">
              b) Cloudflare Inc. (Content Delivery / Sicherheitsdienst)
            </h3>
            <div className="text-[var(--text-secondary)] space-y-2">
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
          </div>

          {/* OpenRouter */}
          <div>
            <h3 className="font-medium text-[var(--text-primary)] mb-2">
              c) OpenRouter Inc. (KI-Funktion)
            </h3>
            <div className="text-[var(--text-secondary)] space-y-2">
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
          </div>
        </section>

        {/* 4. Cookies und Tracking */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            4. Cookies und Tracking
          </h2>
          <p className="text-[var(--text-secondary)]">
            Ich selbst verwende keine Cookies und keine Tracking-Dienste. Cloudflare kann technisch
            notwendige Cookies setzen, um Sicherheits- und Lastverteilungsfunktionen
            bereitzustellen. Diese speichern keine personenbezogenen Informationen im rechtlichen
            Sinne.
          </p>
        </section>

        {/* 5. Speicherdauer */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            5. Speicherdauer
          </h2>
          <p className="text-[var(--text-secondary)]">
            Ich speichere keinerlei personenbezogene Daten. Daten, die durch INWX, Cloudflare oder
            OpenRouter verarbeitet werden, unterliegen deren jeweiligen Speicher- und
            Löschrichtlinien. Ich habe darauf keinen direkten Einfluss.
          </p>
        </section>

        {/* 6. Rechte der betroffenen Personen */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            6. Rechte der betroffenen Personen
          </h2>
          <div className="text-[var(--text-secondary)] space-y-3">
            <p>
              Soweit über die genannten Dienstleister personenbezogene Daten verarbeitet werden,
              haben betroffene Personen nach DSGVO folgende Rechte:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
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
          </div>
        </section>

        {/* 7. Datensicherheit */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            7. Datensicherheit
          </h2>
          <p className="text-[var(--text-secondary)]">
            Die Übertragung dieser Website erfolgt über HTTPS (TLS-Verschlüsselung). Ich treffe
            zumutbare Maßnahmen zum Schutz der übertragenen Daten. Eine absolute Sicherheit der
            Datenübertragung im Internet kann jedoch nicht garantiert werden.
          </p>
        </section>

        {/* 8. Änderungen dieser Datenschutzerklärung */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            8. Änderungen dieser Datenschutzerklärung
          </h2>
          <p className="text-[var(--text-secondary)]">
            Ich behalte mir vor, diese Erklärung zu ändern, falls sich technische Abläufe oder
            gesetzliche Rahmenbedingungen ändern. Die aktuelle Version ist jederzeit auf{" "}
            <a href="https://disaai.de" className="text-[var(--color-primary-500)] hover:underline">
              https://disaai.de
            </a>{" "}
            abrufbar.
          </p>
        </section>
      </Card>

      {/* Menu Drawer */}
      <AppMenuDrawer isOpen={isOpen} onClose={closeMenu} sections={defaultMenuSections} />
    </LegalPageShell>
  );
}
