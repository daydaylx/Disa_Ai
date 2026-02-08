# Architecture Decision Records (ADR)

Dieses Verzeichnis enthält Architektur-Entscheidungen im ADR-Format.

## Was ist ein ADR?

Ein Architecture Decision Record (ADR) beschreibt eine bedeutende Architekturentscheidung,
deren Kontext und Konsequenzen. ADRs helfen, die Evolution der Codebasis nachvollziehbar zu machen.

## Format

```
docs/decisions/
├── 0001-record-architecture-decisions.md
├── 0002-mobile-first-design.md
├── 0003-dexie-for-storage.md
└── ...
```

## Namenskonvention

- **Nummerierung**: Vierstellig, aufsteigend (0001, 0002, ...)
- **Titel**: Kurz und beschreibend, kebab-case
- **Erweiterung**: `.md`

## Vorlage

```markdown
# NNNN - Titel der Entscheidung

## Status

Akzeptiert / Vorgeschlagen / Veraltet / Ersetzt durch NNNN

## Kontext

Warum musste diese Entscheidung getroffen werden?

## Entscheidung

Was wurde entschieden?

## Konsequenzen

- Positiv: ...
- Negativ: ...
- Risiken: ...
```

## Bestehende Entscheidungen

Aktuell keine ADRs vorhanden. Zukünftige Architekturentscheidungen sollten hier dokumentiert werden.

## Weiterführende Links

- [ADR GitHub](https://adr.github.io/)
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
