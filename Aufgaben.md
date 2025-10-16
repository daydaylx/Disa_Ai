Gut, dann machen wir aus dem Glitzerfriedhof ein sauberes Glassmorphism-System, das nicht die GPU grillt. Hier ist der Plan, kompakt, umsetzbar, ohne Hokuspokus.

Umbauplan Design-System (Glassmorphism, mobil-first) 0) Inventur und Aufräumrunde
Entferne alte Schatten-Zirkusnummern, doppelte Farben, Inline-Styles.

Führe ein einziges Token-Set ein und ersetze harte Werte projektweit.

Fallback definieren: wenn backdrop-filter fehlt, nutze solide Oberflächen mit höherem Kontrast.

1. Design-Tokens (CSS Vars)
   :root{
   /_ Basis _/
   --bg0:#0b0d10; /_ Canvas _/
   --bg1:#101318; /_ Layer 1 _/
   --fg:#e6eaef; /_ Primärtext _/
   --fg-dim:#a8b0bb; /_ Sekundärtext _/

/_ Akzente (kalt/warm) _/
--acc1:#6fd3ff;
--acc2:#ff9f6f;

/_ Glas-Parameter _/
--glass-bg: 18, 22, 28; /_ RGB von bg0 _/
--glass-alpha: 0.14; /_ Grundtransparenz _/
--glass-stroke: rgba(255,255,255,0.09);
--glass-radius: 18px;
--glass-blur-sm: 6px;
--glass-blur-md: 12px;
--glass-blur-lg: 18px;

/_ Schatten & Glow (sparsam) _/
--elev-1: 0 2px 10px rgba(0,0,0,0.35);
--elev-2: 0 6px 26px rgba(0,0,0,0.45);
--neon: 0 0 18px rgba(111,211,255,0.35);

/_ Spacing & Typo _/
--space-1: 8px; --space-2: 12px; --space-3: 16px; --space-4: 24px;
--font-display: 28px; --font-hint: 14px; --font-body: 16px;
} 2) Glas-Stufen definieren
/_ Grundrezept: halbtransparente Fläche mit Frost, feiner Stroke, subtiler Schlagschatten _/
.glass{
background: rgba(var(--glass-bg), var(--glass-alpha));
backdrop-filter: blur(var(--glass-blur-md)) saturate(120%);
-webkit-backdrop-filter: blur(var(--glass-blur-md)) saturate(120%);
border: 1px solid var(--glass-stroke);
border-radius: var(--glass-radius);
box-shadow: var(--elev-1);
}
.glass--subtle{ backdrop-filter: blur(var(--glass-blur-sm)); }
.glass--strong{ backdrop-filter: blur(var(--glass-blur-lg)); box-shadow: var(--elev-2), var(--neon); } 3) Tailwind-Anpassung (falls aktiv)
In tailwind.config.js:

theme.extend.colors für bg0, acc1, acc2.

backdropBlur um sm/md/lg.

borderRadius mit 18.

Plugin für feine 1px Strokes: .stroke-1 { box-shadow: inset 0 0 0 1px rgba(255,255,255,0.09) }.

Utility-Klassen: bg-[rgba(18,22,28,0.14)] backdrop-blur-md saturate-120 border border-white/10 rounded-[18px] shadow-[var(--elev-1)].

4. Layout-Grundlagen
   Hintergrund: dunkler Verlauf mit zwei weichen Lichtflecken, 8-pt-Grid, großzügige Luft im Header.

Max. 2 Akzentfarben pro Screen. Keine 7 leuchtenden Regenbogenränder, wir bauen kein Arcade-Cabinet.

5. Komponentenbibliothek
   5.1 Header
   Wortmarke „Disa AI“ + Tagline im oberen Viertel.

Container: .glass--subtle ohne Neon, damit Textlesbarkeit bleibt.

5.2 ChatBubble
Varianten: assistant, user.

User rechts, Assistant links. Beide glasig, aber User minimal heller.

type BubbleKind = 'assistant'|'user';
export function ChatBubble({kind, children}:{kind:BubbleKind; children:React.ReactNode}) {
const side = kind==='user' ? 'items-end ml-auto' : 'items-start mr-auto';
return (
<div className={`max-w-[78%] ${side} glass px-3 py-2`}>
<p className="text-[var(--fg)]/92 leading-6">{children}</p>
</div>
);
}
5.3 InputBar
Pill-Form, .glass, links +, rechts mic und send.

On focus: Stroke auf border-white/14, leichter Acc-Glow.

5.4 SidePanel (Slide-Over, rechts)
Zustände: closed | peek | open.

Breite: peek=24px (Griff), open=86vw mobil.

Panel: .glass--strong, Fokusfalle aktiv, Wischgesten: swipe-right öffnen, swipe-left schließen.

5.5 Tabs im Panel
Register: „Chathistorie“, „Rollen“, „Modell“, „Einstellungen“.

Aktiver Tab mit feinem Unterstrich in acc1 und minimalem Glow.

6. Interaktionsfluss: „Was passiert nach der Auswahl im Panel?“
   State-Modell (vereinfacht)
   type PanelTab = 'history'|'roles'|'model'|'settings';
   type SidePanelState = 'closed'|'peek'|'open';

interface UIState {
side: SidePanelState;
tab: PanelTab;
draft: string; // Eingabefeld
sessionId: string | null;
modelId: string;
roleId: string | null;
}
6.1 Chathistorie
Item-Tap:

Wenn draft nicht leer: Sheet „Entwurf übernehmen?“ [Verwerfen | Anhängen].

Lade Session, schließe Panel, scrolle ans Ende, zeige Toast „Konversation geladen“.

Statusbar aktualisiert: Modell/Tokenstand etc.

6.2 Rollen
Tap auf Rolle öffnet „Role Preview“ (Sheet):

Inhalt: Kurzbeschreibung, Systemprompt, empfohlene Parameter (Modell, Temperatur, Stil).

Aktionen:

„Neue Session mit Rolle“ → erstellt neue Session, setzt Prompt, optional wählt empfohlenes Modell.

„Auf aktuelle Session anwenden“ → ersetzt nur Systemprompt, behält Verlauf.

Nach Bestätigung: Panel schließt, Quick-Chip „Rolle aktiv“ in der Chat-Toolbar.

6.3 Modell
Tap auf Modell-Karte:

Detailoverlay: Kontextlänge, Preis, Stärken/Schwächen, Kompatibilität.

Aktion „Modell wechseln“:

Wenn laufende Anfrage: blocken bis fertig.

Persistiere Auswahl (Local config), aktualisiere Statusleiste.

Optional: „Als Standard speichern“ Toggle.

Panel bleibt offen, damit man vergleichen kann; Snackbar „Modell aktiv“.

6.4 Einstellungen
Toggles sind „sofort wirksam“.

Destruktive Dinge (Cache leeren, Verlauf löschen): Confirm-Sheet.

Themewechsel live, ohne Flackern: prefers-reduced-transparency respektieren.

7. Navigation & Gesten
   Swipe von rechts: peek → open.

Tap auf Dim-Scrim: open → closed.

Hardware-Back: wenn Panel open, zuerst Panel schließen, dann erst Routenwechsel.

8. Accessibility
   Kontrast mindestens 4.5:1 auf Glas. Wo Glas den Kontrast killt, automatisch dunklen Scrim hinterlegen.

Fokusindikatoren sichtbar, nicht nur Glow.

prefers-reduced-motion: Animationen auf 120–160 ms, keine Parallax-Spielereien.

9. Performance
   Reduziere teuren Blur: nur auf übergeordneten Containern, nicht auf jeder Bubble.

Maximal 1–2 gleichzeitige backdrop-filter Ebenen.

Low-end Fallback: Klasse .no-backdrop schaltet auf „tinted solid cards“ um.

10. Beispiel: Panel-Container (React)
    export function SidePanel({state, tab, onClose}:{state:SidePanelState; tab:PanelTab; onClose:()=>void}) {
    return (
    <aside
    aria-hidden={state==='closed'}
    className={[
    "fixed inset-y-0 right-0 z-40 transition-transform",
    state==='closed' && "translate-x-full",
    state==='peek' && "translate-x-[calc(100%-24px)]",
    state==='open' && "translate-x-0"
    ].join(' ')} >
    <div className="glass glass--strong h-full w-[86vw] p-3">
    {/_ Tabs _/}
    <nav className="flex gap-2 mb-2">
    {(['history','roles','model','settings'] as PanelTab[]).map(t=>(
    <button key={t}
    className={`px-3 py-2 rounded-lg border ${t===tab?'border-[var(--acc1)] shadow-[var(--neon)]':'border-white/10'}`}>
    {t==='history'?'Chathistorie':t==='roles'?'Rollen':t==='model'?'Modell':'Einstellungen'}
    </button>
    ))}
    </nav>
    {/_ Tab-Content: hier jeweils Listen/Sheets nach obigen Flows _/}
    </div>
    {/_ Scrim _/}
    <div onClick={onClose} className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] ${state==='open'?'block':'hidden'}`} />
    </aside>
    );
    }
11. Checkliste Umsetzung
    Tokens einführen und Projekt migrieren.

Glas-Stufen klarmachen und auf Komponenten mappen.

Header, ChatBubble, InputBar als erste Referenz umstellen.

SidePanel + Tabs + Flows implementieren.

Gesten, Fokusfalle, A11y, Fallbacks.

Performance-Pass: Blurlayer minimieren, Repaints prüfen.

Visuelles Finetuning: Neon nur an aktiven Elementen, sonst Ruhe.

12. Copy für Header (die gewünschte, absichtlich unfehlerfreie Variante)
    „Dein künstlicher Freund und Helfer, ein guter Freund, nicht immer ehrlich, aber immer da.“

1. Altlasten-Audit (CSS/Theme)
   Rolle (System): Design-System-Auditor
   Aufgabe (User):
   Analysiere den Code in src/styles/**, src/components/**, tailwind.config.\*. Finde doppelte Farben, harte Pixelwerte, übertriebene Schatten, verwaiste Klassen/Komponenten, Inline-Styles, zu viele backdrop-filter Ebenen.
   Akzeptanzkriterien:

Fundstellen mit Datei, Zeile, kurzer Code-Zitat.

Kategorisierung: entfernen | durch Token ersetzen | prüfen.

Liste „schnelle Wins“ für sofortige Löschung.
Output-Format:
Markdown-Tabelle: Kategorie | Datei | Zeilen | Kurzausschnitt | Empfehlung.

2. Token-Extraktion & Vorschlag
   Rolle (System): Token-Architekt
   Aufgabe (User):
   Extrahiere aus dem Ist-Zustand ein konsistentes Token-Set (Farben, Typo, Radius, Blur, Schatten, Spacing). Schlage Namen und Default-Werte vor.
   Akzeptanzkriterien:

:root{} CSS-Block mit allen Tokens, keine Duplikate.

Mapping-Tabelle „Altwert → Tokenname“.
Output-Format:

Codeblock css mit :root{...}

Tabelle Altwert | Verwendet in | Neuer Token.

3. Tailwind-Konfig-Patch
   Rolle (System): Tailwind-Konfigurator
   Aufgabe (User):
   Erweitere tailwind.config.(js|ts) um: Farben aus Tokens, backdropBlur-Stufen, borderRadius, Utilities für 1-px-Stroke und Neon-Glow. Entferne Alt-Plugins.
   Akzeptanzkriterien:

Diff-Snippet der Konfig.

Beispielklassen pro Utility.
Output-Format:
Codeblock mit minimalem Diff und 3–5 Anwendungsbeispielen.

4. Global Styles (Reset + Hintergrund)
   Rolle (System): UI-Grundraumausstatter
   Aufgabe (User):
   Erstelle/aktualisiere src/styles/global.css: Reset/Normierung, Body-Typo, dunkler Verlauf, zwei weiche Lichtflecken, Basiskontraste.
   Akzeptanzkriterien:

Keine Überschreibung der Komponenten-Typo.

Hintergrund performant, ohne endlose Layer.
Output-Format:
css für global.css plus kurze Einbauanweisung.

5. Glass-Primitives (Utility-CSS)
   Rolle (System): Glassmorphism-Ingenieur
   Aufgabe (User):
   Definiere .glass, .glass--subtle, .glass--strong inkl. Border, Blur, Shadow, optional Neon-Akzent.
   Akzeptanzkriterien:

Nutzt nur die Tokens.

Hinweise, wo nicht anwenden (Performance).
Output-Format:
css Snippet + kurze Do/Don’t-Liste.

6. Komponenten-Migrationsplan
   Rolle (System): Refactor-Planer
   Aufgabe (User):
   Liste alle betroffenen Komponenten und gib Reihenfolge und Aufwand an: Header, ChatBubble, InputBar, SidePanel, Tabs, Sheets/Overlays.
   Akzeptanzkriterien:

Reihenfolge nach Risiko/Impact.

Checkliste je Komponente.
Output-Format:
Markdown-Liste mit Kästchen [ ].

7. Header-Refactor
   Rolle (System): UI-Implementierer
   Aufgabe (User):
   Ersetze den Header durch eine glasige Sektion im oberen Viertel: Wortmarke „Disa AI“ + Tagline. Fokus auf Lesbarkeit.
   Akzeptanzkriterien:

Keine Neon-Effekte im Header.

Responsiv, keine Überläufe.
Output-Format:
tsx Komponente + begleitendes css/Tailwind-Klassen.

8. ChatBubble-Komponente
   Rolle (System): Chat-Komponentist
   Aufgabe (User):
   Implementiere ChatBubble(kind: 'assistant'|'user') mit .glass und leicht differenzierter Opazität. Max-Breite 78%, Zeitstempel klein.
   Akzeptanzkriterien:

Tokens genutzt, keine Hardcodes.

RTL/Mehrsprachigkeit nicht brechen.
Output-Format:
tsx + kurze Props-Doku.

9. InputBar-Komponente
   Rolle (System): Interaction-Schreiner
   Aufgabe (User):
   Pill-Eingabeleiste mit Placeholder „Nachricht schreiben…“, Icons für +, Mic, Senden. Focus-State hebt Stroke minimal.
   Akzeptanzkriterien:

Tastatur-A11y vollständig.

Fokusindikator sichtbar ohne Glow-Overkill.
Output-Format:
tsx + css/Tailwind Klassen.

10. SidePanel-Container (States)
    Rolle (System): State-Maschinist
    Aufgabe (User):
    Baue SidePanel rechts mit States closed | peek | open. peek=24px, open=86vw. Scrim, Fokusfalle, Swipe-Gesten.
    Akzeptanzkriterien:

ARIA korrekt, Esc/Back schließt Panel.

Keine Layout-Sprünge.
Output-Format:
tsx Container + minimaler Hook für State.

11. Tabs im Panel
    Rolle (System): Navigationsbauer
    Aufgabe (User):
    Tabs: „Chathistorie“, „Rollen“, „Modell“, „Einstellungen“. Aktiver Tab mit feinem Unterstrich in acc1.
    Akzeptanzkriterien:

Tabs keyboard-fähig, roving tabindex oder native Buttons.
Output-Format:
tsx Tab-Leiste + kleiner Tab-Switch-Reducer.

12. Flow: Chathistorie-Auswahl
    Rolle (System): UX-Regisseur
    Aufgabe (User):
    Beim Tap auf Eintrag: 1) Draft-Konflikt prüfen, 2) Session laden, 3) Panel schließen, 4) Scroll ans Ende, 5) Toast „Konversation geladen“.
    Akzeptanzkriterien:

Draft-Sheet mit Optionen Verwerfen/Anhängen.

Keine Race-Conditions beim Laden.
Output-Format:
Sequenzdiagramm (Text) + Pseudocode/Reducer-Aktionen.

13. Flow: Rollen-Auswahl
    Rolle (System): Prompt-Kurator
    Aufgabe (User):
    Tap auf Rolle öffnet „Role Preview“: Kurzbeschreibung, Systemprompt, empfohlene Parameter. Aktionen: „Neue Session mit Rolle“ oder „Auf aktuelle Session anwenden“.
    Akzeptanzkriterien:

Zustand sichtbar (Chip „Rolle aktiv“).

Modell-Empfehlung optional übernehmen.
Output-Format:
tsx Sheet-UI + Action-Handler Pseudocode.

14. Flow: Modell-Auswahl
    Rolle (System): Modell-Weichensteller
    Aufgabe (User):
    Modelldetail overlay: Kontextlänge, Preis, Stärken/Schwächen. Aktion „Modell wechseln“ blockt, wenn Anfrage läuft; speichert Auswahl lokal; Snackbar „Modell aktiv“.
    Akzeptanzkriterien:

Concurrency sauber.

Persistenz getestet.
Output-Format:
tsx Overlay + Hook useModelSelection().

15. Einstellungen
    Rolle (System): Hausmeister für Schalter
    Aufgabe (User):
    Toggles wirken sofort. Destruktives mit Confirm-Sheet. Theme-Wechsel respektiert prefers-reduced-transparency und prefers-reduced-motion.
    Akzeptanzkriterien:

Kein Flackern beim Theme-Switch.

Confirm-Sheets barrierefrei.
Output-Format:
tsx Beispiele + kurze A11y-Notizen.

16. A11y-Pass
    Rolle (System): Barrierefreiheits-Prüfer
    Aufgabe (User):
    Prüfe Kontraste auf Glas, Fokusindikatoren, Screenreader-Labels, Panel-Trapping.
    Akzeptanzkriterien:

Mindestens 4.5:1 für Primärtext.

Liste gefundenen Probleme + Fixvorschläge.
Output-Format:
Markdown-Checkliste mit Links auf Code-Stellen.

17. Performance-Pass
    Rolle (System): Render-Diätcoach
    Aufgabe (User):
    Minimiere backdrop-filter Ebenen, verschiebe Blur auf Container, messe Reflow/Repaint. Fallback .no-backdrop für schwache Geräte.
    Akzeptanzkriterien:

Messwerte vorher/nachher.

Liste der reduzierten Ebenen.
Output-Format:
Tabelle „Komponente | Vorher | Nachher | Einsparung“.

18. Visuelle QA & Snapshots
    Rolle (System): Pixel-Sheriff
    Aufgabe (User):
    Erstelle visuelle Regression-Snapshots der Kernscreens (Header, Chat, Panel offen, Sheets). Prüfe Overflow, Lesbarkeit, Tap-Ziele.
    Akzeptanzkriterien:

Mind. 4 Breakpoints/Devicegrößen.

Dokumentiere Abweichungen mit Screenshots.
Output-Format:
Kurzreport + Dateiliste der Snapshots.

19. Cleanup & PR-Checkliste
    Rolle (System): Release-Aufräumer
    Aufgabe (User):
    Räume Branch auf, entferne tote Styles, aktualisiere Doku (Tokens, Utilities, Komponentenguidelines), erstelle PR-Beschreibung.
    Akzeptanzkriterien:

Keine ungenutzten Klassen.

Doku verlinkt auf Komponenten.
Output-Format:
PR-Template-Text + To-Do-Liste.

20. Post-Merge Smoke-Test
    Rolle (System): Endkontrolleur
    Aufgabe (User):
    Schnelltest: Start, neue Session, Rolle anwenden, Modell wechseln, Verlauf laden, Nachricht senden, Panel öffnen/schließen.
    Akzeptanzkriterien:

Keine visiblen Jumps, keine Blocker.

Liste der auffälligen Kleinigkeiten für Patch 1.
Output-Format:
Stichpunkt-Log vom Testlauf.
