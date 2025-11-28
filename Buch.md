Gesamtziel
Disa AI wird:
Optisch: „Tinte auf Papier“, ruhige Buch-Optik
UX: Chat-First
Besonderheit: Buchseiten-Navigation
Nach links wischen → neuer Chat (neue Seite)
Nach rechts wischen → bis zu 5 vorherige Chats „zurückblättern“
History als „Lesezeichen“ mit Sidepanel
1. Informationsarchitektur & States
1.1 Chat-Einheiten
Eine Chat-Session = eine „Seite“ im Buch
Innerhalb einer Session: ganz normal vertikaler Chatverlauf
State-Objekte (Konzept):
allChats: ChatSession[]
id: string
title: string (automatisch aus erster Usernachricht, später editierbar)
createdAt: Date
updatedAt: Date
messages: Message[]
pinned?: boolean
swipeStack: string[] (Liste von Chat-IDs, max. 5 Einträge)
activeChatId: string
1.2 Regeln für den Swipe-Stack
swipeStack enthält maximal 5 Chats:
Immer inklusive activeChatId
Bei neuem Chat: vorne einfügen
Wenn > 5 → letzten Eintrag (ältester) entfernen (nur aus Stack, nicht aus allChats)
Ältere Chats bleiben voll in allChats, aber sind nicht per Swipe erreichbar, nur über das History-Panel.
2. Gesten & Navigation
2.1 Allowed Swipes
Nur auf der Chat-Seite (/ bzw. /chat):
Horizontaler Swipe wird nur innerhalb eines inneren Containers erkannt, nicht am Browser-Rand:
Damit kollidiert es nicht mit Browser-Back-Gesten.
A) Nach links wischen → „Neue Seite“
Bedingungen:
Aktueller Chat ist nicht leer oder der Nutzer hat mindestens eine Interaktion gehabt
Swipe-Bewegung:
Mindestens ~40–60 px horizontal nach links
Vertikale Abweichung begrenzt (z. B. max. 30 px), damit kein Scroll-Swipe-Mischmasch
Verhalten:
Aktuelle Seite verschiebt sich leicht nach links, wird dabei minimal dunkler (als „zurückgelegt“).
Neue Chat-Session wird erstellt:
in allChats hinzufügen
activeChatId auf neue ID setzen
Neue ID vorne in swipeStack einfügen
Neue Seite gleitet von rechts rein:
weißes/off-white „Papier“
leere Nachrichtenliste
Cursor im Inputfeld fokussiert
Fallback (Reduced Motion):
Kein gleitender Effekt, sondern:
alter Chat fadet minimal aus
neuer Chat fadet ein
B) Nach rechts wischen → „Zurückblättern“
Bedingungen:
swipeStack hat mindestens 2 Einträge
activeChatId ist nicht der letzte in swipeStack (du bist also nicht schon am ältesten im Stapel)
Nutzer befindet sich im oberen Bereich des Chats (z. B. scrollTop < X), um „zufälliges Blättern“ beim Lesen zu minimieren
Verhalten:
Aktueller Chat kippt leicht nach rechts (Paper-Tilt, max. 5–7°) und verschiebt sich ein Stück nach rechts.
Die vorherige Chat-Session (nächster Eintrag im Stack) erscheint von links und übernimmt den Platz.
activeChatId wird auf diese Session gesetzt.
swipeStack bleibt unverändert (Reihenfolge gleich, du „wanderst“ nur darin).
Fallback (Reduced Motion):
Kein Kippeffekt, nur horizontaler Slide oder harter Wechsel mit leichtem Fade.
3. Lesezeichen & History-Sidepanel
3.1 Lesezeichen-Element
Position & Verhalten:
Rechts oben im Chatbereich, an der Kante zur rechten Seite:
Vertikales „Bookmark“-Element, etwa 24–32 px breit, 48–64 px hoch
Optik:
Hintergrund: Akzentfarbe (z. B. dunkles Indigo oder gedämpftes Violett)
Form: oben bündig mit dem Seitenrand, unten kleine „Zunge“ mit Dreiecksspitze wie klassisches Lesezeichen
Icon: kleines Buch- oder Bookmark-Symbol in „Tinten“-Farbe (fast Schwarz)
Interaktion:
Tap / Klick auf Lesezeichen:
Öffnet History-Sidepanel von rechts
Optional: Beim ersten Aufruf der App einmal leicht „wackeln“ (Micro-Animation, 400–600 ms, nur einmal).
3.2 History-Sidepanel (rechte Seite)
Aufbau:
Overlay: halbtransparenter Hintergrund über Hauptseite
Panel: 80–90 % Breite auf Mobile, am rechten Rand, voller Höhe
Sektionen im Panel:
Header:
Titel: „Verläufe“ oder „Deine Seiten“
Optional Icon neben Titel
Close-Button (X) oben rechts im Panel
„Aktive Seiten“ (Swipe-Stack):
Überschrift: „Zuletzt verwendete Seiten“
Liste von max. 5 Einträgen (entspricht swipeStack):
Titel (Chat-Titel)
Kleines Label: „Aktuelle Seite“ bei activeChatId
Kleines Seiten-Icon
„Archiv“ (Rest von allChats):
Überschrift: „Alle Chats“
Scrollbare Liste:
Eintrag: Titel, Datum/Uhrzeit letzte Aktivität, evtl. kurzer Preview (erste Zeile)
Optional Icon für pinned
Interaktion:
Tap auf Eintrag aus „Aktive Seiten“:
Chat wird sofort aktiver Chat
Page-Transition wie bei Swipe nach rechts/links (je nach Richtung definierbar, minimal)
Tap auf Archiv-Eintrag:
Chat wird activeChatId
In swipeStack:
Wenn drin → Position behalten
Wenn nicht drin:
vorn einfügen
falls > 5 Einträge → ältesten rausschmeißen
Swipe/Drag nach rechts auf Panel → Panel schließen
Close-Button oder Tap auf Overlay → Panel schließen
4. Visuelle Gestaltung im „Tinte auf Papier“-Stil
4.1 Grundfarben (konzeptuell)
Light Theme:
bg-app (App-Hintergrund): leicht warmes Off-White
→ z. B. HSL(45, 25%, 96%)
bg-page (Seitenfläche / Chat-Hintergrund): minimal heller/dunkler als bg-app, z. B. HSL(45, 20%, 98%)
ink-primary: „Tinten“-Schwarz-Blau oder sehr dunkles Grau, z. B. HSL(220, 15%, 18%)
accent: gedämpftes Indigo/Violett, z. B. HSL(260, 35%, 45%)
muted: neutrales Grau für Sekundärtexte, z. B. HSL(220, 10%, 50%)
Dark Theme (optional):
bg-app: sehr dunkles Grau, HSL(220, 15%, 10–12%)
bg-page: leicht heller, HSL(220, 15%, 14–16%)
ink-primary: helles Grau, HSL(0, 0%, 95%)
accent: etwas kräftiger Indigo/Violett, aber nicht neon
4.2 Typografie
Base-Font: ruhige Sans Serif (system UI oder leicht humanistisch)
Chat-Text:
Größe: 17–18 px
Line-Height: 1.5–1.6
Sekundärtext:
14–15 px
Höherer Kontrast als bisher (kein graues Grau auf Lila)
Überschriften:
H1 (z. B. Chat-Titel): 22–24 px, fett
H2 (Bereichsüberschrift im Panel): 18–20 px, halbfett
Optional: eine leicht „schriftartige“ Schrift für das Logo und Buch-Titel, aber nicht im Fließtext.
4.3 Komponenten-Stil: „Papier statt Glas“
Cards & Seiten:
Hintergrund: bg-page
Border: 1 px, leicht dunkler Ton von bg-page
Border-Radius: 8–12 px (nicht zu rund, eher „Notizbuch“ als „Bubble-GUI“)
Schatten: sehr schwach:
0 1px 3px rgba(0,0,0,0.08) o. ä.
Chat-Bubbles:
Nutzer:
Hintergrund: leicht getöntes bg-page (Minimal-Kontrast zum Hintergrund)
Border mit ink-primary auf 1 px oder leicht grauer
KI:
Hintergrund: weiß/off-white
Linker Rand: dünner Tintenstreifen (2–3 px) in accent
Text: ink-primary
Buttons:
Primary:
Hintergrund: accent
Text: bg-page oder reines Weiß
Schatten minimal oder gar keiner
Secondary:
Hintergrund: transparent
Border: 1 px accent
Text: accent
Ghost:
Nur Text, dezente Hover-Unterstreichung
Icons:
Ohne Glow, Schatten oder 3D-Effekte.
Tinte-Farbe oder muted je nach Kontext.
5. Animationen & Microinteractions
5.1 Seitenwechsel
Dauer: 150–220 ms
Easing: z. B. ease-out
Kein übertriebener „Page Curl“, eher:
Translation + minimale Rotation (max. 5–7°)
Leichter Schatten während der Bewegung
5.2 Lesezeichen & Panel
Lesezeichen:
Beim ersten App-Start: 1-malige Wackelanimation (Rotation ±3°, 400–600 ms, dann Ruhe)
Panel:
Slide-in von rechts, 180–220 ms, leichtes Fade-in
Slide-out symmetrisch
5.3 Reduced Motion
Wenn System / Setting „Animationen reduzieren“:
Alle Bewegungen auf einfache Fades / harte Wechsel reduzieren
Keine Rotationen, keine Schiebereien
6. UX-Regeln zur Vermeidung von Chaos
Keine Gesten überall
Swipes nur im Chat, nicht in Settings, Rollen, Modelle.
Keine „Nachricht = Seite“
Eine Seite = eine Chat-Session. Punkt.
Swipes sind Extra, nicht Pflicht
History-Lesezeichen + Panel sind immer verfügbar, Swipes sind „Quality of Life“, nicht einzige Navigation.
Fehlerzustände klar anzeigen
Wenn eine Session nicht geladen werden kann → klare Meldung im Chat („Diese Seite konnte nicht geladen werden“), nicht einfach leerer Screen.
Gesten bewusst designen
Keine Swipes auslösen, wenn:
der Nutzer horizontal nur 10 px verrutscht,
gerade Text selektiert wird,
oder ein Input aktiv ist und der Anwender tippt.
7. Umsetzungsphasen (technisch + visuell)
Phase A – Theme & Designsystem
[ ] Neues Theme „Ink“ definieren (Farben, Typo, Spacing, Radius, Schatten)
[ ] Alle bestehenden Komponenten auf Ink-Theme mappen (keine Gradients/Glas)
[ ] Chat-Layout optisch an „Seite“ anpassen (Papierhintergrund, Bubbles, Header)
Phase B – Swipe-Stack & State
[ ] allChats, swipeStack, activeChatId sauber definieren
[ ] Aktionen: startNewChat, navigateToChat, addToSwipeStack, trimSwipeStack
[ ] Auswahl: max. 5 Chats im Stack durchsetzen
Phase C – Gesten & Animation
[ ] Horizontal-Gesten im Chat-Viewport implementieren
[ ] Links-Swipe → neuer Chat (inkl. Transition)
[ ] Rechts-Swipe → vorheriger Chat (inkl. Transition)
[ ] Rückfall auf einfache Wechsel bei „Reduced Motion“
Phase D – Lesezeichen & History-Panel
[ ] Bookmark-Komponente am rechten Seitenrand
[ ] Sidepanel-Komponente mit:
[ ] Sektion „Zuletzt verwendete Seiten“ (Stack)
[ ] Sektion „Alle Chats“ (Archiv)
[ ] Logik: Klick auf Eintragung → Chat aktiv + ggf. in Stack verschieben
Phase E – Finetuning & Tests
[ ] Manuelle Tests auf echtem Handy (Android) für:
Swipes
Panel
Back-Geste vom System
[ ] Playwright-/Vitest-Tests für:
State-Übergänge (neuer Chat, Stack, History)
Darstellung des Panels
Reduced-Motion-Pfade