# Disa AI

<!--
**Hinweis für den Entwickler:** Bitte ersetze `daydaylx/Disa_Ai` in den Badge-URLs, falls das Repository öffentlich wird.
-->

[![Build & Test CI](https://img.shields.io/github/actions/workflow/status/daydaylx/Disa_Ai/ci.yml?branch=main&label=Build%20%26%20Test&style=for-the-badge)](https://github.com/daydaylx/Disa_Ai/actions/workflows/ci.yml)
[![Version](https://img.shields.io/npm/v/disa-ai?label=version&style=for-the-badge)](package.json)
[![License](https://img.shields.io/badge/license-Private-blue?style=for-the-badge)](#-lizenz)

**Disa AI** ist eine professionelle, mobile-first AI-Chat Progressive Web App (PWA). Die Anwendung ist speziell für Smartphones optimiert, setzt auf ein klares Glassmorphism-Dark-Design und legt großen Wert auf Sicherheit, Performance und eine konsistente User Experience.

---

## Inhaltsverzeichnis

- [✨ Features](#-features)
  - [Kernfunktionen](#kernfunktionen)
  - [Mobile-First UX](#mobile-first-ux)
  - [Design & UI](#design--ui)
  - [Sicherheit & Architektur](#sicherheit--architektur)
- [🛠️ Tech Stack](#-tech-stack)
- [🏛️ Projektstruktur & Architektur](#️-projektstruktur--architektur)
- [🚀 Installation & Entwicklung](#-installation--entwicklung)
- [🧪 Qualitätssicherung & Testing](#-qualitätssicherung--testing)
- [☁️ Deployment & Caching](#️-deployment--caching)
- [🤝 Contributing](#-contributing)
- [📜 Lizenz](#-lizenz)

## ✨ Features

### Kernfunktionen

- **Flexible AI-Integration**: OpenRouter-Anbindung mit Streaming (NDJSON) für zahlreiche Sprachmodelle.
- **Modell-Katalog**: Filterbare Ansicht (Preis, Kontextgröße, Provider) zur schnellen Modellauswahl.
- **Rollensystem**: Vordefinierte Rollen (z. B. E-Mail-Profi, Kreativ-Autor) plus extern geladene Templates; NSFW-Rollen lassen sich per Einstellung ein-/ausblenden.
- **Gedächtnis-Funktion (optional)**: Benutzerpräferenzen werden lokal gespeichert und als „system“-Kontext an das Modell übermittelt, ohne den Chatverlauf zu fluten.
- **PWA & Offline-Modus**: Installierbare App mit Service-Worker-Caching und Offline-Fallbacks.

### Mobile-First UX

- **Primärer Viewport 390×844** (iPhone 12/13/14) – Layout reagiert dennoch auf größere Displays.
- **Keyboard-safe Composer**: `VisualViewport` & `100dvh` verhindern, dass Eingabefelder von der Tastatur verdeckt werden.
- **Touch-Optimierung**: Mindestens `48×48px` für alle Touch-Ziele (WCAG 2.1).
- **Safe-Area-Unterstützung**: Korrekte Insets für iOS-Notches und Android-Gesten.

### Design & UI

- **Dark-Mode only**: Gedämpfte Farbpalette, optimiert für OLED-Displays.
- **Glassmorphism**: Konsistente `glass`-/`glass-strong`-Utilities für transparente Paneele.
- **Design Tokens**: TypeScript-basierte Token sorgen für konsistente Farben, Typografie und Abstände.

### Sicherheit & Architektur

- **Client-Schlüsselverwaltung**: API Keys werden ausschließlich in `sessionStorage` gehalten.
- **Strikte Header**: CSP, HSTS, `Permissions-Policy` & Co. minimieren Risiken.
- **System-Kontext außerhalb des Chat-Logs**: Rollen- und Memory-Prompts werden beim Senden injiziert, erscheinen aber nicht in der UI – weniger Rauschen, mehr Übersicht.

## 🛠️ Tech Stack

| Kategorie            | Technologien                                                       |
| -------------------- | ------------------------------------------------------------------ |
| **Framework**        | React 19, TypeScript 5.9, Vite 7                                   |
| **Styling**          | Tailwind CSS, Radix Primitives, Lucide Icons, clsx, tailwind-merge |
| **Routing / Schema** | React Router v6, Zod                                               |
| **PWA / Offline**    | Vite PWA Plugin (Workbox)                                          |
| **Testing**          | Vitest, Happy DOM, MSW, Playwright, @axe-core/playwright           |
| **Codequalität**     | ESLint, Prettier, Husky, lint-staged                               |
| **Deployment**       | Cloudflare Pages                                                   |

## 🏛️ Projektstruktur & Architektur

```
src/
├── api/          # OpenRouter u. ä.
├── app/          # Router, Layouts, Kontext
├── components/   # UI-Komponenten
├── config/       # Modelle, Prompt-Stile, Settings
├── hooks/        # Business-Logik (useChat, useMemory, …)
├── lib/          # Utilities
├── pages/        # Routen / Screens
├── styles/       # Tailwind-Layer, Tokens
└── types/        # Gemeinsame Typdefinitionen
```

**Routen**: `/chat`, `/models`, `/settings`

## 🚀 Installation & Entwicklung

1. Repository klonen & Abhängigkeiten installieren
   ```bash
   git clone https://github.com/daydaylx/Disa_Ai.git
   cd Disa_Ai
   npm ci
   ```
2. Lokalen Dev-Server starten
   ```bash
   npm run dev
   ```
   Server läuft auf `http://localhost:5173`.

## 🧪 Qualitätssicherung & Testing

| Befehl              | Beschreibung                            |
| ------------------- | --------------------------------------- |
| `npm run verify`    | Typecheck + Lint + Unit-Tests           |
| `npm run lint`      | ESLint (`--ext .ts,.tsx`)               |
| `npm run test:unit` | Vitest (headless)                       |
| `npm run test:e2e`  | Playwright End-to-End (mobile Viewport) |
| `npm run build`     | Produktionsbuild (Vite)                 |

## ☁️ Deployment & Caching

- **Cloudflare Pages** deployt automatisch beim Push auf `main`.
- HTML: `no-store`; Assets mit Hash: `max-age=31536000`.
- Service Worker: `network-first` für HTML, `stale-while-revalidate` für Assets.

## 🤝 Contributing

- **Commit-Stil**: Conventional Commits (durch Husky erzwungen).
- **Branches**: Kurzlebige Feature-Branches; Merge nach Review.
- **Templates**: Issue-/PR-Templates in `.github/` verwenden.

## 📜 Lizenz

Dieses Projekt ist privat. Keine Weitergabe oder Modifikation ohne schriftliche Zustimmung.
