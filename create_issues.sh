#!/usr/bin/env bash
set -euo pipefail

REPO="daydaylx/Disa_Ai"

need() { command -v "$1" >/dev/null 2>&1 || { echo "Fehlt: $1"; exit 1; }; }

need gh

# Prüfen, ob gh eingeloggt ist
if ! gh auth status >/dev/null 2>&1; then
  echo "Nicht eingeloggt. Bitte einmal:"
  echo "  gh auth login"
  echo "Dann dieses Skript erneut ausführen."
  exit 1
fi

# Repo-Check
if ! gh repo view "$REPO" >/dev/null 2>&1; then
  echo "Repo $REPO nicht auffindbar oder keine Berechtigung."
  exit 1
fi

echo "Repo: $REPO"
mkdir -p gh_issues

# Labels absichern (falls vorhanden, Fehler ignorieren)
ensure_label () {
  local name="$1" color="$2" desc="$3"
  gh label create "$name" -R "$REPO" -c "$color" -d "$desc" >/dev/null 2>&1 || true
}

echo "Labels anlegen/prüfen..."
ensure_label "ux"          "0366d6" "User Experience"
ensure_label "ui"          "a2eeef" "User Interface"
ensure_label "navigation"  "0e8a16" "Navigation"
ensure_label "mobile"      "fbca04" "Mobile"
ensure_label "roles"       "0052cc" "Rollen/Personas"
ensure_label "settings"    "d4c5f9" "Einstellungen"
ensure_label "bug"         "d73a4a" "Fehler"
ensure_label "stability"   "bfdadc" "Stabilität"
ensure_label "perf"        "1d76db" "Performance (gefühlte)"
ensure_label "performance" "1d76db" "Performance (technisch)"
ensure_label "chat"        "c2e0c6" "Chat"
ensure_label "shortcuts"   "5319e7" "Shortcuts/Kacheln"
ensure_label "lists"       "5319e7" "Listen/Grids"
ensure_label "accessibility" "7057ff" "A11y"
ensure_label "pwa"         "0e8a16" "PWA/Service Worker"
ensure_label "ci"          "2cbe4e" "CI"
ensure_label "qa"          "c5def5" "QA/Tests"
ensure_label "copy"        "f9d0c4" "Mikrocopy"
ensure_label "consistency" "b60205" "Kohärenz"
ensure_label "feature"     "84b6eb" "Feature"
ensure_label "improvement" "5319e7" "Verbesserung"
ensure_label "chore"       "eeeeee" "Chore"
ensure_label "fix"         "fef2c0" "Fix"

# Issue-Bodies schreiben
cat > gh_issues/01-bottom-nav.md <<'MD'
## Beschreibung
Die drei Top-Bereiche sind aktuell nicht als ständig sichtbare Hauptnavigation abgebildet. Für mobile UIs ist eine persistente Bottom-Navigation mit 3 Zielen Standard und reduziert Fehlbedienungen.

## Akzeptanzkriterien
- Unterer Navigationsbalken mit exakt 3 Zielen: „Chat“, „Rollen“, „Einstellungen“
- Icon + Label, klarer Active-State; erneuter Tap scrollt Liste nach oben
- Pro Tab wird Scroll-Position und UI-State erhalten (Tab-Restoration)
- Keine Überlappungen mit Composer oder Systemleisten (Safe-Area-Insets)

## Tasks
- `BottomNav`-Komponente implementieren
- Routing auf Tabs umstellen, Deep-Linking prüfen
- Safe-Area-Insets (Viewport-Fit) berücksichtigen
MD

cat > gh_issues/02-roles-flow.md <<'MD'
## Beschreibung
Die Rollenauswahl wirkt visuell entkoppelt. Auslagerung in eigenen Flow: dedizierte Seite oder Bottom-Sheet mit Suche, Kategorien/Filter, Live-Preview und explizitem 18+/NSFW-Toggle.

## Akzeptanzkriterien
- Eigene Route oder Sheet `roles/` mit Suchfeld, Kategorie-Filtern, Toggle „18+ anzeigen“
- Einträge als Liste mit Avatar, Kurzbeschreibung, „Übernehmen“-Button
- Preview/Detail bei Tap, Rücksprung behält Scroll-Position
- Empty-State mit Anleitung, wenn keine Rollen vorhanden

## Tasks
- Neue View + State-Management
- NSFW-Flag aus Datenquelle berücksichtigen
- Empty-States gestalten
MD

cat > gh_issues/03-loading-error-states.md <<'MD'
## Beschreibung
Zeitweise „weiße Seite“/Hänger. Pro Route fehlen belastbare Fehlergrenzen, visuelle Lade-Indikatoren und ein klarer Wiederholungs-Flow.

## Akzeptanzkriterien
- Error-Boundary pro Haupt-Route mit freundlicher Meldung und „Erneut versuchen“
- Sichtbare Skeleton-Loader für Listen/Detailflächen
- Netzwerkfehler zeigen Toast + Retry an
- Offline-Banner mit Hinweis auf zwischengespeicherte Eingaben

## Tasks
- Error-Boundary-Komponenten einführen
- Skeleton-Placeholders integrieren
- Offline-Erkennung + Banner
MD

cat > gh_issues/04-composer-keyboard.md <<'MD'
## Beschreibung
Beim Öffnen der Bildschirmtastatur darf der Composer nicht springen oder verdeckt werden. Layout muss sich an VisualViewport/VirtualKeyboard-Insets anpassen.

## Akzeptanzkriterien
- Composer bleibt sichtbar, auch bei geöffnetem Keyboard
- Eingabefeld wächst bis N Zeilen, danach Scroll im Nachrichtenbereich
- Nutzung von VisualViewport-Events und `env(keyboard-inset-*)`
- Placeholder mit Starter-Hinweis + Shortcut-Chips oberhalb der Tastatur

## Tasks
- `window.visualViewport.resize/scroll` abfangen
- CSS mit `env(keyboard-inset-bottom)` berücksichtigen
- Sticky-Footer und Scroll-Containment prüfen
MD

cat > gh_issues/05-start-tiles.md <<'MD'
## Beschreibung
Startkacheln ohne Funktion frustrieren. Kacheln starten definierte Aktionen (z. B. neuer Chat mit gewählter Rolle). Long-Press öffnet Bearbeiten/Umordnen/Löschen. Reihenfolge priorisiert „Zuletzt genutzt“.

## Akzeptanzkriterien
- Tap löst definierte Aktion aus
- Long-Press: Edit-Dialog (Name, Icon, Zielaktion), Reorder via Drag
- „Zuletzt genutzt“ oben, optional Pin-Favoriten

## Tasks
- Datenmodell für Kachel-Konfiguration
- Long-Press-Gesten + Reorder
- Persistenz (Local DB/Storage)
MD

cat > gh_issues/06-lists-performance.md <<'MD'
## Beschreibung
Lange Rollen/Modell-Listen brauchen Windowing/Virtualisierung. Bilder werden per IntersectionObserver nachgeladen. Einheitliches 4-/8-pt-Raster, konsistente Gutters, definierte max-Breiten.

## Akzeptanzkriterien
- Flüssiges Scrollen bei 200+ Einträgen
- Kein Layout-Shift beim Bildnachladen (Platzhalter)
- Einheitliches Spacing-System dokumentiert

## Tasks
- Virtualized-List einführen
- Image-Lazy-Load + Platzhalter
- Design-Tokens für Spacing definieren
MD

cat > gh_issues/07-a11y-touch-targets.md <<'MD'
## Beschreibung
Trefferflächen sind uneinheitlich und teils zu klein. Mindestgrößen und Fokus-Sichtbarkeit müssen konsistent eingehalten werden, speziell im Dark-Theme.

## Akzeptanzkriterien
- Alle interaktiven Ziele mind. 24×24 CSS-px; Zielgefühl: 44×44 pt
- Sichtbarer Fokus-Ring und ausreichender Non-Text-Kontrast
- Interaktive States: hover/active/focus/disabled klar erkennbar

## Tasks
- Audit aller Buttons/Chips/Icons
- Globale Größen-Tokens & Utility-Klassen
- Kontrast-Check (CI oder manuell) ergänzen
MD

cat > gh_issues/08-sw-update-strategy.md <<'MD'
## Beschreibung
Veraltete gecachte Bundles können zu weißen Screens führen. Es braucht eine deterministische Cache-/Update-Strategie, Versionierung und nutzerfreundliche Update-Hinweise.

## Akzeptanzkriterien
- Precache nur versionierte, unveränderliche Assets
- Laufzeit-Caching mit klarer Strategie pro Ressourcentyp
- SW-Update signalisiert dem Nutzer (Broadcast-Update/Reload-Hinweis)
- Kein „Cache-Only“ für HTML-Navigationsanfragen

## Tasks
- Workbox-Strategien je Route/Asset prüfen
- Versioning + Cache-Bust erzwingen
- Update-Toast implementieren
MD

cat > gh_issues/09-lighthouse-ci-budgets.md <<'MD'
## Beschreibung
Performance- und A11y-Regressionsschutz per Lighthouse-CI. PRs scheitern, wenn Budgets gerissen werden.

## Akzeptanzkriterien
- GitHub Action mit Lighthouse-CI
- Mobile Scores: Performance ≥ 85, Accessibility ≥ 90
- Budgets für Skript-/Bildgrößen definiert
- Berichte pro PR verlinkt

## Tasks
- `lighthouse-ci` konfigurieren
- Budgets (`.lighthouserc.js`) definieren
- GitHub Action einbinden
MD

cat > gh_issues/10-terminology-toasts.md <<'MD'
## Beschreibung
Uneinheitliche Bezeichner (Rollen/Personas/Modelle) und fehlendes unmittelbares Feedback erschweren die Bedienung.

## Akzeptanzkriterien
- Einheitliche Terminologie in UI/Code: „Rollen“ überall, „Personas“ nur intern
- Handlungsorientierte Buttons („Rolle übernehmen“, „Als Standard setzen“)
- Toasts für Speichern/Fehler mit Auto-Dismiss und „Rückgängig“

## Tasks
- UI-Copy-Audit
- Toaster-Komponente einführen
- Glossar im Repo dokumentieren
MD

# Titel, Dateien und Labels listen
titles=(
"Navigation konsolidieren: persistente Bottom-Navigation (Chat, Rollen, Einstellungen)"
"Rollen/Persona als eigener Flow inkl. NSFW-Toggle"
"Lade- und Fehlerzustände stabilisieren: Error-Boundary, Retry, Skeletons"
"Composer & Keyboard-Handling (VisualViewport/VirtualKeyboard) fixen"
"Startkacheln funktional machen: Aktion bei Tap, Long-Press zum Bearbeiten"
"Listen & Performance: Virtualisierung, Lazy-Bilder, Grid-Raster"
"A11y & Touch-Ziele hart durchsetzen"
"Service-Worker & Update-Strategie: keine „stale bundles“ mehr"
"Messen statt raten: Lighthouse-Budgets in CI"
"Terminologie & System-Feedback (Toasts) vereinheitlichen"
)

files=(
"01-bottom-nav.md"
"02-roles-flow.md"
"03-loading-error-states.md"
"04-composer-keyboard.md"
"05-start-tiles.md"
"06-lists-performance.md"
"07-a11y-touch-targets.md"
"08-sw-update-strategy.md"
"09-lighthouse-ci-budgets.md"
"10-terminology-toasts.md"
)

labels=(
"ux,ui,navigation,mobile,feature"
"ux,ui,roles,settings,feature"
"bug,stability,perf,ux,fix"
"mobile,ux,bug,chat,fix"
"ux,feature,shortcuts"
"performance,ui,lists,improvement"
"accessibility,ux,ui,fix"
"pwa,stability,performance,fix"
"ci,performance,qa,chore"
"ux,copy,consistency,improvement"
)

echo "Issues werden erstellt..."
for i in "${!titles[@]}"; do
  T="${titles[$i]}"
  F="gh_issues/${files[$i]}"
  L="${labels[$i]}"
  echo "➤ $T"
  gh issue create -R "$REPO" -t "$T" -F "$F" -l "$L"
done

echo "Fertig. Viel Spaß beim Abarbeiten."
