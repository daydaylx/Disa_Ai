# Legacy-Dokumentation

> **Hinweis:** Dieses Verzeichnis enthält archivierte Dokumentation, die nicht mehr aktuell ist.
>
> Diese Dateien werden zu Referenzzwecken aufbewahrt, sollten aber **nicht als aktuelle Dokumentation** verwendet werden.

---

## Warum gibt es dieses Verzeichnis?

Im Laufe der Entwicklung von Disa AI wurden mehrere Design-Systeme und UI-Konzepte ausprobiert:

1. **Neumorphism** (früh)
2. **Glassmorphism / Aurora Glassmorphism** (Mitte)
3. **"Tinte auf Papier" / Buchkonzept** (experimentell)
4. **Modern Slate Glass** (aktuell)

Die hier archivierten Dokumente beziehen sich auf diese verschiedenen Phasen und können verwirrend sein, wenn man sie als aktuelle Referenz verwendet.

---

## Verzeichnisstruktur

```
docs/legacy/
├── architecture/           # Alte Design-System-Dokumente
├── planning/               # Roadmaps, Pläne, Konzepte
├── reports/                # Abnahmeberichte, Audits
├── mobile-first/           # Mobile-First-Implementierungsdokumente
├── work/                   # Work-in-Progress-Dokumentation
└── ui/                     # UI-Konzepte
```

---

## Aktuelle Dokumentation

Für aktuelle Informationen siehe:

| Dokument | Beschreibung |
|----------|-------------|
| [`../README.md`](../../README.md) | Projektübersicht, Setup |
| [`../OVERVIEW.md`](../OVERVIEW.md) | App-Nutzung |
| [`../ARCHITECTURE.md`](../ARCHITECTURE.md) | Technische Architektur |
| [`../CONFIG.md`](../CONFIG.md) | Konfiguration |
| [`../../src/styles/DESIGN_SYSTEM.md`](../../src/styles/DESIGN_SYSTEM.md) | Aktuelles Design-System |

---

## Archivierte Dokumente (Auswahl)

### Design-Systeme (veraltet)

| Datei | Beschrieb | Status |
|-------|-----------|--------|
| `architecture/DESIGN_SYSTEM.md` | Aurora Glassmorphism 2.0-alpha | Überholt |
| `architecture/design-system.md` | Ältere Design-Tokens | Überholt |
| `planning/buchdesignkonzept.md` | "Tinte auf Papier"-Konzept | Nicht umgesetzt |

### Roadmaps (historisch)

| Datei | Zeitraum | Status |
|-------|----------|--------|
| `planning/strategic_roadmap.md` | Q4 2025 – Q1 2026 | Teilweise erledigt |
| `planning/technical_roadmap.md` | – | Überholt |

### Berichte (historisch)

| Datei | Datum | Inhalt |
|-------|-------|--------|
| `reports/Abnahmebericht.md` | Nov 2025 | UI-Überarbeitung |
| `reports/FINAL_IMPLEMENTATION_STATUS.md` | – | Buchkonzept (obsolet) |
| `reports/beta_stabilization_report_2025-11-23.md` | Nov 2025 | Beta-Stabilisierung |

---

## Löschkandidaten

Folgende Dateien können bei nächster Gelegenheit gelöscht werden, da sie keinen historischen Wert haben:

- `planning/job.md` – Interne Notiz
- `planning/Verschwörungstheorien.md` – Feature-Idee
- `planning/Verschwörungstheorien-Implementierung.md` – Feature-Idee
- `planning/Diskussionsrunden.md` – Feature-Idee
- `planning/liquid-animations-plan.md` – Nicht umgesetzt

---

## Hinweis für Entwickler

Wenn du auf ein Dokument in diesem Verzeichnis verwiesen wirst:

1. **Prüfe das Datum** – Ist es älter als 2 Monate?
2. **Vergleiche mit aktuellem Code** – Stimmt die Beschreibung noch?
3. **Frage im Zweifel** – Lieber einmal mehr nachfragen als falsche Infos nutzen

Bei Unklarheiten gilt: **Der Code ist die Wahrheit.**
