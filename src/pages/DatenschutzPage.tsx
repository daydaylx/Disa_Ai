import { Card } from "@/ui";

export default function DatenschutzPage() {
  return (
    <div className="flex flex-col items-center min-h-full p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl mb-8" padding="lg">
        <div className="space-y-8">
          <div className="text-center pb-4 border-b border-white/5">
            <h1 className="text-2xl font-bold text-ink-primary">Datenschutzerklärung</h1>
            <p className="text-sm text-ink-secondary mt-2">
              Informationen über die Verarbeitung personenbezogener Daten
            </p>
          </div>

          <div className="rounded-xl bg-surface-2 border border-white/5 p-4 text-sm text-ink-secondary">
            <p>
              Diese Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener
              Daten bei Nutzung dieser Anwendung.
            </p>
          </div>

          {/* 1. Verantwortliche Stelle */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-primary">1. Verantwortliche Stelle</h2>
            <div className="text-ink-secondary space-y-2 text-sm">
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

          {/* 2. Allgemeine Hinweise */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-primary">2. Allgemeine Hinweise</h2>
            <div className="text-ink-secondary space-y-2 text-sm">
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
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-ink-primary border-b border-white/5 pb-2">
              3. Verarbeitung durch technische Dienstleister
            </h2>

            {/* INWX */}
            <div className="space-y-2 text-sm">
              <h3 className="font-medium text-ink-primary">
                a) INWX GmbH & Co. KG (Domain-Provider)
              </h3>
              <div className="text-ink-secondary space-y-2">
                <p>
                  Die Domain disaai.de wird über den Anbieter INWX GmbH & Co. KG,
                  Prinzessinnenstraße 30, 10969 Berlin, betrieben. INWX speichert und verarbeitet
                  technische Daten im Rahmen der Domainverwaltung.
                </p>
              </div>
            </div>

            {/* Cloudflare */}
            <div className="space-y-2 text-sm">
              <h3 className="font-medium text-ink-primary">
                b) Cloudflare Inc. (Content Delivery / Sicherheitsdienst)
              </h3>
              <div className="text-ink-secondary space-y-2">
                <p>
                  Zur Bereitstellung, Absicherung und Beschleunigung der Website wird der Dienst
                  Cloudflare Inc., USA, eingesetzt. Cloudflare verarbeitet technische Informationen
                  wie IP-Adresse, Browsertyp, Datum, Uhrzeit und angeforderte Ressourcen.
                </p>
              </div>
            </div>

            {/* OpenRouter */}
            <div className="space-y-2 text-sm">
              <h3 className="font-medium text-ink-primary">c) OpenRouter Inc. (KI-Funktion)</h3>
              <div className="text-ink-secondary space-y-2">
                <p>
                  Für die optionalen KI-Funktionen wird der Dienst OpenRouter Inc. genutzt. Wenn
                  Nutzer Texte oder Fragen eingeben, werden diese an OpenRouter übermittelt, um eine
                  Antwort zu erzeugen.
                </p>
                <p>
                  Ich selbst speichere keine Eingaben oder Antworten dauerhaft auf meinen Servern.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Datensicherheit */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink-primary">Datensicherheit</h2>
            <p className="text-ink-secondary text-sm">
              Die Übertragung dieser Website erfolgt über HTTPS (TLS-Verschlüsselung). Ich treffe
              zumutbare Maßnahmen zum Schutz der übertragenen Daten.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
