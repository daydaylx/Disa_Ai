# UI Baseline Findings (2026-02-22)

## Scope
- Live-URL: https://disaai.de
- Viewports: 360x800, 390x844, 412x915, 430x932, 768x1024 (Kontrollpunkt)
- Routen: /chat, /models, /roles, /settings, /themen, /feedback
- Zustände: default, drawer-open, history-open (chat), keyboard-focus (chat), long-history-scrollfab (chat), long-list-scroll (models/roles)

## Datengrundlage
- Quelle: `ui-signals.json`
- Erzeugt am: 2026-02-22T10:06:57.532Z
- Gesamtprobleme: **31**
- Verteilung: S1=23, S2=8, S3=0

## Problemtabelle
| Screenshot | Problemtyp | Betroffene Komponente | Vermutete Ursache | Schwere (S1-S3) |
|---|---|---|---|---|
| chat__default__360x800.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 800 > Nav-Top 708 | S1 |
| chat__default__390x844.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 844 > Nav-Top 752 | S1 |
| chat__default__412x915.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 915 > Nav-Top 823 | S1 |
| chat__default__430x932.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 932 > Nav-Top 840 | S1 |
| chat__default__768x1024.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 1024 > Nav-Top 932 | S1 |
| chat__drawer-open__360x800.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 800 > Nav-Top 708 | S1 |
| chat__drawer-open__390x844.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 844 > Nav-Top 752 | S1 |
| chat__drawer-open__412x915.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 915 > Nav-Top 823 | S1 |
| chat__drawer-open__430x932.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 932 > Nav-Top 840 | S1 |
| chat__drawer-open__768x1024.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 1024 > Nav-Top 932 | S1 |
| chat__history-open__360x800.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 800 > Nav-Top 708 | S1 |
| chat__history-open__390x844.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 844 > Nav-Top 752 | S1 |
| chat__history-open__412x915.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 915 > Nav-Top 823 | S1 |
| chat__history-open__430x932.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 932 > Nav-Top 840 | S1 |
| chat__keyboard-focus__360x800.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 800 > Nav-Top 708 | S1 |
| chat__keyboard-focus__390x844.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 844 > Nav-Top 752 | S1 |
| chat__keyboard-focus__412x915.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 915 > Nav-Top 823 | S1 |
| chat__keyboard-focus__430x932.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 932 > Nav-Top 840 | S1 |
| chat__keyboard-focus__768x1024.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 1024 > Nav-Top 932 | S1 |
| chat__long-history-scrollfab__360x800.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 800 > Nav-Top 708 | S1 |
| chat__long-history-scrollfab__390x844.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 844 > Nav-Top 752 | S1 |
| chat__long-history-scrollfab__412x915.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 915 > Nav-Top 823 | S1 |
| chat__long-history-scrollfab__430x932.png | Overlap | Composer + MobileBottomNav | Composer-Bottom 932 > Nav-Top 840 | S1 |
| chat__long-history-scrollfab__360x800.png | Layering | ScrollToBottom + MobileBottomNav | FAB überlappt Bottom-Navigation | S2 |
| chat__long-history-scrollfab__360x800.png | Layering | ScrollToBottom + Composer | FAB kollidiert mit Composer | S2 |
| chat__long-history-scrollfab__412x915.png | Layering | ScrollToBottom + MobileBottomNav | FAB überlappt Bottom-Navigation | S2 |
| chat__long-history-scrollfab__412x915.png | Layering | ScrollToBottom + Composer | FAB kollidiert mit Composer | S2 |
| chat__long-history-scrollfab__430x932.png | Layering | ScrollToBottom + MobileBottomNav | FAB überlappt Bottom-Navigation | S2 |
| chat__long-history-scrollfab__430x932.png | Layering | ScrollToBottom + Composer | FAB kollidiert mit Composer | S2 |
| feedback__default__360x800.png | Clipping | Feedback textarea + MobileBottomNav | Textarea ragt in BottomNav-Bereich | S2 |
| feedback__drawer-open__360x800.png | Clipping | Feedback textarea + MobileBottomNav | Textarea ragt in BottomNav-Bereich | S2 |

## Top-10 Blocker für saubere Mobile UI
1. **chat__default__360x800.png** — Overlap · Composer + MobileBottomNav · **S1**  
   Ursache: Composer-Bottom 800 > Nav-Top 708
2. **chat__default__390x844.png** — Overlap · Composer + MobileBottomNav · **S1**  
   Ursache: Composer-Bottom 844 > Nav-Top 752
3. **chat__default__412x915.png** — Overlap · Composer + MobileBottomNav · **S1**  
   Ursache: Composer-Bottom 915 > Nav-Top 823
4. **chat__default__430x932.png** — Overlap · Composer + MobileBottomNav · **S1**  
   Ursache: Composer-Bottom 932 > Nav-Top 840
5. **chat__default__768x1024.png** — Overlap · Composer + MobileBottomNav · **S1**  
   Ursache: Composer-Bottom 1024 > Nav-Top 932
6. **chat__drawer-open__360x800.png** — Overlap · Composer + MobileBottomNav · **S1**  
   Ursache: Composer-Bottom 800 > Nav-Top 708
7. **chat__drawer-open__390x844.png** — Overlap · Composer + MobileBottomNav · **S1**  
   Ursache: Composer-Bottom 844 > Nav-Top 752
8. **chat__drawer-open__412x915.png** — Overlap · Composer + MobileBottomNav · **S1**  
   Ursache: Composer-Bottom 915 > Nav-Top 823
9. **chat__drawer-open__430x932.png** — Overlap · Composer + MobileBottomNav · **S1**  
   Ursache: Composer-Bottom 932 > Nav-Top 840
10. **chat__drawer-open__768x1024.png** — Overlap · Composer + MobileBottomNav · **S1**  
   Ursache: Composer-Bottom 1024 > Nav-Top 932

## Kurzfazit (nur Messung)
- Dominantes Problem ist **Composer + MobileBottomNav Overlap (S1)** im Chat über mehrere Viewports und Zustände.
- Zusätzlich treten **Layering-Konflikte des ScrollToBottom-FAB** gegen BottomNav/Composer auf (S2).
- Im Feedback-Flow gibt es **sichtbares Clipping der Textarea** in die BottomNav-Zone (S2).
