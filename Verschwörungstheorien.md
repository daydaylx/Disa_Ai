Strikter Plan: „Verschwörungstheorien“-Kategorie als kritischer Diskussionsmodus
Phase 0 – Ziel & Leitprinzipien festnageln
Ziel: Nutzer sollen zu ausgewählten Verschwörungstheorien eine echte Diskussion führen können, bei der die KI als kompetentes Gegenüber / Moderator auftritt, ohne Falschinfos zu bestätigen oder durch Wiederholung zu verstärken.
Leitprinzipien (nicht verhandelbar):
Behauptung ≠ Beleg: KI trennt das immer sichtbar. �
UNL Institutional Repository +1
Illusory-Truth vermeiden: keine unnötige Wiederholung der falschen Behauptung, eher paraphrasieren und kurz halten. �
Center for Climate Change Communication +1
Sokratisch statt predigend: KI fragt, testet Logik, hilft beim Selbst-Denken. �
ResearchGate +2
Evidenz-Labeling: gut belegt / unklar / widerlegt / Spekulation. �
Bristol Research Information +1
Keine „Both-Sides-Gleichwertigkeit“: Wenn Evidenz klar ist, sagt die KI das klar, aber erklärt es. �
UNL Institutional Repository +1
Phase 1 – Bestandsaufnahme im Repo
Finde die Datenquelle der Diskussions-Cards
JSON oder TS-Array: wo kommen die aktuellen Diskussionsthemen her?
Welche Felder existieren (id, title, description, category, promptTemplate etc.)?
Finde Rendering-Pfad
Welche Komponente zeigt die Diskussionen in der Chat-UI?
Wie wird ein Thema ausgewählt und an die KI übergeben?
Finde Prompting-Schicht
Gibt es „Mode“/„Role“/„Template“-Systemprompts?
Wo wird die finale Prompt-Payload gebaut?
Output: Mini-Docs (für dich) mit Dateipfaden + Flussdiagramm „Topic → UI → Prompt → KI“.
Phase 2 – Kategorie „Verschwörungstheorien“ hinzufügen
Neue Kategorie anlegen
In derselben Struktur wie deine anderen Kategorien.
UI-Label: „Verschwörungstheorien (kritisch diskutieren)“.
Oben in der Kategorie ein sehr kurzes Disclaimer-Snippet
Ein Satz: „Diese Themen werden kritisch geprüft, nicht bestätigt.“
Kein Roman. User lesen keine Romane.
Phase 3 – Sichere Top-10 Themen definieren (kuratiert)
Themenliste (Beispiel):
Erde ist flach
Reptiloiden
Mondlandung-Fake
Chemtrails
Bermuda-Dreieck
Ancient Aliens / Pyramiden
Area 51 / UFO-Vertuschung
Denver Airport / Geheimanlage
MK-Ultra (historisch, sauber kontextualisieren)
Simulation-Hypothese (philosophisch)
Regel: Kein Thema, das reale Gruppen dämonisiert oder direkte Gewalt/Schaden-Risiken hebt. (Hast du ja gerade richtig entschieden.)
Phase 4 – Diskussions-Template als „Zustandsautomat“
Jede Runde läuft immer durch dieselben Schritte. Dadurch wirkt es wie Diskussion, nicht wie „KI sagt Nein“.
Step A – Rephrase & Verständnischeck
KI paraphrasiert neutral: „Du meinst X, korrekt?“
Kein Urteil.
Step B – Steelman (kurz)
„Die Theorie behauptet …“ (max. 4–5 Sätze)
Warn-Marker vor der Behauptung (“Folgende Behauptung kursiert …”), um Wahrheits-Gefühl durch Wiederholung zu dämpfen. �
The Commons +1
Step C – Warum überzeugt das Menschen?
Psychologie/Soziologie, nicht Faktendumping.
Macht Nutzer nicht dumm, sondern erklärt den Sog.
Step D – Claims sammeln
KI listet typische Behauptungen, ausdrücklich als Behauptungen.
Keine ausgeschmückten Details.
Step E – Evidenz sortieren + Labels
Pro Claim ein Label: gut belegt / unklar / widerlegt / Spekulation.
Ersatz-Erklärung anbieten (Debunking braucht eine Alternative, sonst bleibt ein Loch). �
Bristol Research Information +1
Step F – Sokratischer Stresstest
Fragen zur Falsifizierbarkeit, Widersprüchen, Alternativen.
User soll mitdenken.
Step G – Gemeinsames Fazit
Kein Urteilston, sondern Ergebnis-Zusammenfassung nach Evidenzlage.
Phase 5 – Systemprompt „Verschwörungstheorien-Modus“ implementieren
Kurz & hart, damit die KI nicht halluziniert:
Trenne Behauptung/Beleg
Keine Quellen erfinden
Keine emotionale Dramatisierung
Keine „vielleicht stimmt’s ja doch“-Romantik
Evidenz-Labeling Pflicht
Sokratische Rückfragen Pflicht
Wichtig: Backfire-Effekte sind zwar nicht so häufig wie früher gedacht, aber Wiederholung kann trotzdem Familiarität erhöhen. Deswegen: kurz halten, warnen, nicht ständig wiederholen. �
Center for Climate Change Communication +2
Phase 6 – UI-Feinschliff
Evidenz-Badges sichtbar machen (klein, dezent)
Optionaler Toggle pro Runde
„KI als Moderator“
„KI als Gegenposition“
„KI hilft beim Prüfen“
User wählt das, also kein Zensur-Gefühl.
Follow-up-Buttons in der Runde:
„Gegenargument“
„Alternative Erklärung“
„Was wäre wenn…?“
„Welche Beobachtung würde das entscheiden?“
Das hält den Diskussionsfluss.
Phase 7 – Tests & Missbrauchsszenarien
Funktionstests
Topic auswählen → Prompt korrekt → KI-Antwort mit Labels → Follow-ups funktionieren.
Stresstests
User will Bestätigung erzwingen: KI bleibt ruhig, sokratisch, evidenzbasiert.
Regression
Andere Kategorien/Chats dürfen nicht betroffen sein.
Mobile UX
Kein Layout-Jank, keine Scroll-Konflikte.
Kritische Nachkontrolle: Was sollte man noch anpassen?
Anpassung 1 – „Truth Sandwich“ nutzen, aber nicht übertreiben
Der Truth-Sandwich-Ansatz (Fakt → Warnung/Mythos → Fakt) ist gängige Praxis und oft wirksam, aber der Benefit ist nicht immer riesig und hängt vom Kontext ab. �
Deshalb:
Robert Koch-Institut +2
Struktur übernehmen, aber Mythos-Teil sehr kurz halten.
Fokus auf den zwei Fakten-Ankern.
Anpassung 2 – Keine Abhängigkeit von KI als „Autorität“
Neue Studien zeigen: KI-Dialog kann Misinformation kurzfristig senken, aber Leute könnten sich zu sehr auf die KI verlassen. �
Mitigation:
arXiv
KI stellt Rückfragen, statt alles fertig zu liefern.
Ziel ist Kompetenzaufbau, nicht reines „KI sagt mir was stimmt“.
Anpassung 3 – „Alternative Erklärung“ immer liefern
Ohne alternative Erklärung bleibt beim Nutzer ein Vakuum, in das die Theorie zurückspringt. Das ist Debunking-Standard. �
Also Pflicht in Step E.
