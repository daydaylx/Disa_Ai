import { Card } from "@/ui";

export default function DatenschutzPage() {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-y-auto px-4 py-6 sm:px-6">
      <Card className="mb-8 w-full border-white/10 bg-surface-card/95" padding="lg">
        <article className="space-y-8 text-sm leading-7 text-ink-secondary">
          <header className="border-b border-white/8 pb-5 text-left sm:text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-ink-primary">
              Datenschutzerklärung
            </h1>
            <p className="mt-2 text-sm text-ink-secondary">Stand: Dezember 2025</p>
          </header>

          <div className="rounded-xl border border-white/10 bg-surface-2/70 p-4">
            <p>
              Diese Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener
              Daten bei Nutzung dieser Anwendung.
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
                <a className="transition-colors hover:text-ink-primary" href="#ds-1">
                  1. Verantwortlicher
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-ink-primary" href="#ds-2">
                  2. Allgemeines zur Datenverarbeitung
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-ink-primary" href="#ds-3">
                  3. Bereitstellung der Website und Server-Logfiles
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-ink-primary" href="#ds-4">
                  4. Nutzung der KI-Funktion
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-ink-primary" href="#ds-5">
                  5. Lokale Speicherung im Browser
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-ink-primary" href="#ds-6">
                  6. Cookies und Tracking
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-ink-primary" href="#ds-7">
                  7. Kontaktaufnahme per E-Mail
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-ink-primary" href="#ds-8">
                  8. Speicherdauer
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-ink-primary" href="#ds-9">
                  9. Rechtsgrundlagen im Überblick
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-ink-primary" href="#ds-10">
                  10. Deine Rechte als betroffene Person
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-ink-primary" href="#ds-11">
                  11. Beschwerderecht bei einer Aufsichtsbehörde
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-ink-primary" href="#ds-12">
                  12. Änderungen dieser Datenschutzerklärung
                </a>
              </li>
            </ul>
          </nav>

          {/* 1. Verantwortlicher */}
          <section className="space-y-3">
            <h2 id="ds-1" className="text-xl font-semibold text-ink-primary">
              1. Verantwortlicher
            </h2>
            <div className="text-ink-secondary space-y-2 text-sm">
              <p>
                Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer
                nationaler Datenschutzgesetze ist:
              </p>
              <p>
                David Grunert
                <br />
                Graßdorfer Straße 9
                <br />
                04425 Taucha
                <br />
                Deutschland
              </p>
              <p>
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

          {/* 2. Allgemeines zur Datenverarbeitung */}
          <section className="space-y-3">
            <h2 id="ds-2" className="text-xl font-semibold text-ink-primary">
              2. Allgemeines zur Datenverarbeitung
            </h2>
            <div className="text-ink-secondary space-y-2 text-sm">
              <p>
                Ich betreibe disaai.de als privates, nicht-kommerzielles Projekt. Personenbezogene
                Daten werden nur verarbeitet, soweit dies zur Bereitstellung der Website, der
                KI-Funktionen oder zur Kommunikation mit Nutzern erforderlich ist.
              </p>
              <p>
                „Personenbezogene Daten" sind alle Informationen, die sich auf eine identifizierte
                oder identifizierbare Person beziehen (z. B. IP-Adresse, E-Mail-Adresse, Inhalte von
                Nachrichten).
              </p>
              <p>Rechtsgrundlagen der Verarbeitung sind insbesondere:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Art. 6 Abs. 1 lit. b DSGVO (Vertrag / Nutzung der angebotenen Funktionen)</li>
                <li>
                  Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse, z. B. sichere und stabile
                  Bereitstellung der Website)
                </li>
                <li>
                  Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), sofern du diese ausdrücklich erteilst
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Bereitstellung der Website und Server-Logfiles */}
          <section className="space-y-3">
            <h2 id="ds-3" className="text-xl font-semibold text-ink-primary">
              3. Bereitstellung der Website und Server-Logfiles
            </h2>
            <div className="text-ink-secondary space-y-2 text-sm">
              <p>
                Beim Aufruf von disaai.de werden automatisch technische Daten durch den von mir
                genutzten Hosting- bzw. CDN-Anbieter verarbeitet. Dazu gehören insbesondere:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>IP-Adresse des anfragenden Endgeräts</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>aufgerufene URL / angefragte Ressourcen</li>
                <li>übertragene Datenmenge</li>
                <li>verwendeter Browser und Betriebssystem (User-Agent)</li>
                <li>Referrer-URL (die zuvor besuchte Seite, sofern übertragen)</li>
              </ul>
              <p>Diese Daten werden in Server-Logfiles verarbeitet, um:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>die Website technisch bereitzustellen</li>
                <li>Stabilität und Sicherheit zu gewährleisten</li>
                <li>Missbrauch / Angriffe zu erkennen und abzuwehren</li>
              </ul>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt in
                einer sicheren und funktionsfähigen Bereitstellung der Website.
              </p>
              <p>
                Die Logdaten werden vom Hoster bzw. CDN-Anbieter in der Regel für einen begrenzten
                Zeitraum gespeichert und danach automatisch gelöscht. Die konkrete Speicherdauer
                bestimmt der jeweilige Anbieter.
              </p>

              <h3 className="text-base font-medium text-ink-primary mt-4">
                Einsatz von Content Delivery Network / Hosting-Anbieter
              </h3>
              <p>
                Für die Auslieferung der Website kann ein Content Delivery Network (z. B.
                Cloudflare) genutzt werden. Dabei werden technische Verbindungsdaten (insbesondere
                IP-Adresse, Protokoll- und Performance-Daten) über die Infrastruktur des Anbieters
                verarbeitet, um die Seite schnell und sicher auszuliefern.
              </p>
              <p>
                Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                Interesse an einer sicheren und effizienten Bereitstellung der Website). Soweit
                dabei Daten in Drittländer (z. B. USA) übertragen werden, erfolgt dies auf Basis der
                vom Anbieter eingesetzten Schutzmechanismen (z. B. Standardvertragsklauseln).
              </p>
            </div>
          </section>

          {/* 4. Nutzung der KI-Funktion */}
          <section className="space-y-3">
            <h2 id="ds-4" className="text-xl font-semibold text-ink-primary">
              4. Nutzung der KI-Funktion („Disa AI")
            </h2>

            <div className="text-ink-secondary space-y-2 text-sm">
              <h3 className="text-base font-medium text-ink-primary">
                4.1 Verarbeitung der Eingaben (Prompts) und Antworten
              </h3>
              <p>
                Wenn du die KI-Funktion der App nutzt, verarbeitest du aktiv Inhalte, indem du Texte
                eingibst („Prompts"). Diese Inhalte werden:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>in deinem Browser verarbeitet (Anzeige im Interface), und</li>
                <li>
                  an die Schnittstelle des Dienstleisters OpenRouter, Inc. übermittelt, um eine
                  KI-Antwort zu erzeugen.
                </li>
              </ul>
              <p>Dabei werden insbesondere folgende Daten verarbeitet:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>von dir eingegebene Texte (Prompts, Verlaufsnachrichten)</li>
                <li>
                  technisch erforderliche Metadaten (z. B. IP-Adresse, Zeitstempel, Modellkennung,
                  Tokenanzahl)
                </li>
                <li>die vom KI-Modell generierte Antwort</li>
              </ul>
              <p>
                Die Verarbeitung ist erforderlich, um dir die Kernfunktion der Website (KI-Chat) zur
                Verfügung zu stellen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Erfüllung
                eines Nutzungsverhältnisses / bereitgestellte Funktion).
              </p>

              <h3 className="text-base font-medium text-ink-primary mt-4">
                4.2 Einsatz von OpenRouter
              </h3>
              <p>
                Zur Anbindung verschiedener KI-Modelle nutze ich den Dienst OpenRouter (OpenRouter,
                Inc.). Bei Nutzung der KI-Funktion werden deine Anfragen per API an OpenRouter
                übermittelt. OpenRouter verarbeitet hierfür Request-Metadaten und leitet deine
                Inhalte an die von dir bzw. von mir konfigurierte(n) Modellanbieter weiter.
              </p>
              <p>Nach aktuellen Angaben von OpenRouter werden:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Prompts und Completions standardmäßig nicht dauerhaft geloggt,</li>
                <li>
                  es werden jedoch Metadaten (z. B. Timestamp, verwendetes Modell, Tokenanzahl) zu
                  Abrechnungs- und Statistikzwecken gespeichert.
                </li>
              </ul>
              <p>
                Jeder über OpenRouter angebundene Modellanbieter hat eigene Datenschutz- und
                Logging-Regeln. OpenRouter stellt Informationen zu den jeweiligen Datenrichtlinien
                bereit und ermöglicht eine Steuerung, welche Anbieter genutzt werden.
              </p>
              <p>
                Die Verarbeitung kann in Drittländern (insbesondere USA und anderen Staaten
                außerhalb der EU/EWR) stattfinden. Dort besteht ggf. kein mit der EU vergleichbares
                Datenschutzniveau. Rechtsgrundlage für diese Übermittlung ist:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Art. 6 Abs. 1 lit. b DSGVO (Nutzung der KI-Funktion auf deinen Wunsch),</li>
                <li>
                  ggf. Art. 49 Abs. 1 lit. a DSGVO, sofern du im Einzelfall ausdrückliche
                  Einwilligungen erteilst.
                </li>
              </ul>
              <p>
                Weitere Informationen findest du in der Datenschutzerklärung von OpenRouter:{" "}
                <a
                  href="https://openrouter.ai/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:underline"
                >
                  https://openrouter.ai/privacy
                </a>
              </p>

              <h3 className="text-base font-medium text-ink-primary mt-4">
                4.3 Sensible und vertrauliche Inhalte
              </h3>
              <p>
                Bitte gib in der KI-Funktion keine besonders sensiblen personenbezogenen Daten ein
                (z. B. Gesundheitsdaten, sehr intime Informationen, Daten Dritter, vollständige
                Klarnamenslisten oder Zahlungsinformationen). Trotz technischer Schutzmaßnahmen
                können Eingaben über externe Dienstleister verarbeitet werden und sind nie
                vollständig risikofrei.
              </p>
            </div>
          </section>

          {/* 5. Lokale Speicherung im Browser */}
          <section className="space-y-3">
            <h2 id="ds-5" className="text-xl font-semibold text-ink-primary">
              5. Lokale Speicherung im Browser (LocalStorage / IndexedDB / PWA)
            </h2>
            <div className="text-ink-secondary space-y-2 text-sm">
              <p>
                Die App speichert bestimmte Informationen lokal auf deinem Endgerät, um die Nutzung
                komfortabler zu machen und Funktionen bereitzustellen, z. B.:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>persönliche Einstellungen (z. B. Theme, Sprache, UI-Optionen)</li>
                <li>ggf. Chatverläufe / Sitzungsdaten</li>
                <li>
                  optional: dein eigener API-Schlüssel für OpenRouter (falls du diese Funktion
                  nutzt)
                </li>
              </ul>
              <p>
                Diese Daten werden nicht an mich als Betreiber übermittelt, sondern verbleiben in
                deinem Browser, solange du sie nicht selbst löschst (z. B. über „Website-Daten
                löschen", „Cache leeren" oder ähnliche Funktionen deines Browsers).
              </p>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung der gewünschten
                Funktionen) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer
                nutzerfreundlichen Anwendung).
              </p>
              <p>Du kannst die lokale Speicherung einschränken, indem du:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>die PWA-Funktion nicht installierst bzw. wieder entfernst,</li>
                <li>
                  deinen Browser so konfigurierst, dass lokale Daten regelmäßig gelöscht werden,
                </li>
                <li>
                  in den App-Einstellungen (soweit vorhanden) Verlaufs- oder Konfigurationsdaten
                  zurücksetzt.
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Cookies und Tracking */}
          <section className="space-y-3">
            <h2 id="ds-6" className="text-xl font-semibold text-ink-primary">
              6. Cookies und Tracking
            </h2>
            <div className="text-ink-secondary space-y-2 text-sm">
              <p>Aktuell werden auf disaai.de:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>keine Tracking- oder Marketing-Cookies gesetzt,</li>
                <li>keine externen Analyse-Tools (wie Google Analytics o. Ä.) verwendet.</li>
              </ul>
              <p>
                Technisch notwendige Cookies oder vergleichbare Technologien können durch den
                Hosting-/CDN-Anbieter eingesetzt werden, um Sicherheits- und Performancefunktionen
                bereitzustellen (z. B. Lastverteilung, Schutz vor Angriffen).
              </p>
              <p>
                Rechtsgrundlage für die Nutzung solcher technisch erforderlichen Technologien ist
                Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der sicheren und effizienten
                Bereitstellung der Website).
              </p>
            </div>
          </section>

          {/* 7. Kontaktaufnahme per E-Mail */}
          <section className="space-y-3">
            <h2 id="ds-7" className="text-xl font-semibold text-ink-primary">
              7. Kontaktaufnahme per E-Mail
            </h2>
            <div className="text-ink-secondary space-y-2 text-sm">
              <p>
                Wenn du mich per E-Mail kontaktierst, werden die von dir mitgeteilten Daten (z. B.
                Name, E-Mail-Adresse, Inhalte deiner Nachricht) gespeichert, um die Anfrage zu
                bearbeiten.
              </p>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Anbahnung oder Durchführung eines
                Nutzungsverhältnisses) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
                der Beantwortung von Anfragen).
              </p>
              <p>
                Die Daten werden gelöscht, sobald sie für die Kommunikation nicht mehr erforderlich
                sind, es sei denn, gesetzliche Aufbewahrungspflichten stehen dem entgegen.
              </p>
            </div>
          </section>

          {/* 8. Speicherdauer */}
          <section className="space-y-3">
            <h2 id="ds-8" className="text-xl font-semibold text-ink-primary">
              8. Speicherdauer
            </h2>
            <div className="text-ink-secondary space-y-2 text-sm">
              <p>
                Soweit in dieser Datenschutzerklärung keine abweichenden Speicherdauern angegeben
                sind, gilt:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  Server-Logfiles werden vom Hoster / CDN-Anbieter nur für einen begrenzten Zeitraum
                  gespeichert und anschließend gelöscht.
                </li>
                <li>
                  Lokale Daten in deinem Browser bleiben dort gespeichert, bis du sie selbst
                  entfernst.
                </li>
                <li>
                  E-Mail-Korrespondenz wird nur so lange gespeichert, wie dies für die Bearbeitung
                  und ggf. zur Einhaltung gesetzlicher Aufbewahrungspflichten erforderlich ist.
                </li>
                <li>
                  Metadaten bei OpenRouter und den Modellanbietern werden entsprechend deren
                  jeweiligen Richtlinien gespeichert.
                </li>
              </ul>
            </div>
          </section>

          {/* 9. Rechtsgrundlagen im Überblick */}
          <section className="space-y-3">
            <h2 id="ds-9" className="text-xl font-semibold text-ink-primary">
              9. Rechtsgrundlagen im Überblick
            </h2>
            <div className="text-ink-secondary space-y-2 text-sm">
              <p>
                Soweit nicht im Einzelfall anders angegeben, stütze ich die Verarbeitung
                personenbezogener Daten auf folgende Rechtsgrundlagen:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Erfüllung eines Vertrags /
                  Bereitstellung der von dir genutzten Funktionen (z. B. KI-Chat)
                </li>
                <li>
                  <strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Wahrung berechtigter Interessen (z.
                  B. sichere, stabile und effiziente Bereitstellung der Website)
                </li>
                <li>
                  <strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung (wenn du diese
                  ausdrücklich erteilst)
                </li>
              </ul>
            </div>
          </section>

          {/* 10. Deine Rechte als betroffene Person */}
          <section className="space-y-3">
            <h2 id="ds-10" className="text-xl font-semibold text-ink-primary">
              10. Deine Rechte als betroffene Person
            </h2>
            <div className="text-ink-secondary space-y-2 text-sm">
              <p>
                Dir stehen hinsichtlich der dich betreffenden personenbezogenen Daten folgende
                Rechte zu (Art. 15 ff. DSGVO):
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Recht auf Auskunft über die verarbeiteten Daten</li>
                <li>Recht auf Berichtigung unrichtiger oder unvollständiger Daten</li>
                <li>
                  Recht auf Löschung („Recht auf Vergessenwerden"), soweit keine gesetzlichen
                  Pflichten entgegenstehen
                </li>
                <li>Recht auf Einschränkung der Verarbeitung</li>
                <li>Recht auf Datenübertragbarkeit, sofern die Voraussetzungen erfüllt sind</li>
                <li>
                  Recht auf Widerspruch gegen die Verarbeitung, soweit diese auf Art. 6 Abs. 1 lit.
                  e oder f DSGVO beruht
                </li>
                <li>Recht auf Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft</li>
              </ul>
              <p>
                Zur Ausübung deiner Rechte kannst du dich jederzeit an die unter Ziffer 1 genannten
                Kontaktdaten wenden.
              </p>
            </div>
          </section>

          {/* 11. Beschwerderecht bei einer Aufsichtsbehörde */}
          <section className="space-y-3">
            <h2 id="ds-11" className="text-xl font-semibold text-ink-primary">
              11. Beschwerderecht bei einer Aufsichtsbehörde
            </h2>
            <div className="text-ink-secondary space-y-2 text-sm">
              <p>
                Wenn du der Ansicht bist, dass die Verarbeitung deiner personenbezogenen Daten gegen
                die DSGVO verstößt, hast du das Recht, Beschwerde bei einer
                Datenschutzaufsichtsbehörde einzulegen, insbesondere in dem Mitgliedstaat deines
                Aufenthaltsorts, deines Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes.
              </p>
            </div>
          </section>

          {/* 12. Änderungen dieser Datenschutzerklärung */}
          <section className="space-y-3">
            <h2 id="ds-12" className="text-xl font-semibold text-ink-primary">
              12. Änderungen dieser Datenschutzerklärung
            </h2>
            <div className="text-ink-secondary space-y-2 text-sm">
              <p>
                Ich behalte mir vor, diese Datenschutzerklärung bei Änderungen der technischen
                Umsetzung, der genutzten Dienstleister oder der Rechtslage anzupassen. Es gilt
                jeweils die auf dieser Website abrufbare aktuelle Version.
              </p>
            </div>
          </section>
        </article>
      </Card>
    </div>
  );
}
