/** file: docs/migration-step1.md */
# Step 1 – Bestandsaufnahme & Lösch-/Migrationsplan

> Hinweis (24.11.2025): Dokument beschreibt den Abschluss von Schritt 1; weitere Schritte bitte neu planen oder aktualisieren.

## 1. Ziel & Bezug
- Schritt 1 der Master-Prompt-Roadmap (Audit + Löschliste) abgeschlossen.
- Dieses Dokument fasst die relevanten Funde zusammen und definiert konkrete Aktionen für die nächsten Schritte.

## 2. Relevante Codebereiche (Ist-Zustand)
- **Layout/Shell**: `src/app/layouts/AppShell.tsx`, `src/components/layout/{GlobalNav,DesktopSidebar,MobilePageShell,PageLoader}.tsx`.
- **Chat**: `src/pages/Chat.tsx`, `src/components/chat/**`, `src/hooks/useChat.ts`, `src/hooks/useConversationManager.ts`.
- **Models**: `src/pages/MobileModels.tsx`, `src/components/models/EnhancedModelsInterface.tsx`, `FavoritesContext`.
- **Presets/Roles**: `src/pages/MobileStudio.tsx`, `src/components/studio/**`, `src/config/roleStore.ts`.
- **Settings**: `src/pages/Settings*.tsx`, `src/features/settings/**`, `src/components/accessibility/**`.
- **Global Styles/Tokens**: `src/index.css`, `src/styles/**`, `tailwind.config.ts`.
- **Storage/State**: `src/lib/conversation-manager.ts` (localStorage), fehlende Dexie-Layer.

## 3. Lösch- bzw. Archivkandidaten
| Kategorie | Dateien/Ordner | Grund |
| --- | --- | --- |
| Legacy Shell/Navigation | `src/components/layout/DesktopSidebar.tsx`, `GlobalNav.tsx`, `MobilePageShell.tsx`, `PageLoader.tsx`, `src/components/ui/drawer-sheet.tsx` (partiell) | Ersetzt durch neue AppShell/SideDrawer. |
| Chat UI Altbestand | `src/components/chat/{ChatList,ChatMessage,ChatComposer,VirtualizedMessageList,ChatHistorySidebar,MobileChatHistorySidebar,WelcomeScreen}.tsx` + `.backup*` | Wird durch neue `features/chat` Komponenten ersetzt. |
| Styling/Neomorphismus | `src/styles/neomorphic-utilities.css`, `brand-*` Klassen in `index.css`, Button/Card Varianten mit `neo-*` Fokus | Widerspricht neuem Token-System, verursacht WCAG-Probleme. |
| Seiten (Routen) | `src/pages/*.tsx` (Chat, MobileModels, MobileStudio, Settings*) | Neue Routen liegen künftig in `features/*/routes`. |
| Storage Layer | `src/lib/conversation-manager.ts`, zugehörige Helper | Wird durch Dexie-Persistenz ersetzt. |
| Dokumente | `docs/archive/**`, `report/**`, Backups (`*.backup`, `.old`) | Historische Artefakte, optional verschieben in Archiv-Pfad. |

> Hinweis: Löschung erfolgt sukzessive sobald neue Komponenten einsatzbereit sind. Bis dahin parallel halten.

## 4. Zu migrierende Elemente
- **State & Hooks**: `useChat`, `chatReducer`, `useConversationManager`, `useDiscussion`, `useQuickstartFlow` → an neue Context-Slices (`session`, `ui`, `models`, `presets`) anpassen.
- **Config**: `config/models`, `config/settings`, `config/quickstarts`, `contexts/CustomRolesContext` → konsolidieren in Domain-spezifische Services.
- **UI-Primitives**: Buttons, Cards, Inputs, Toasts, Dialoge → in `shared/ui` umziehen, Variants auf neues Token-System reduzieren.
- **Styles**: `index.css` + `styles/**` → auf neues `tokens.css`-Setup vereinfachen, theming via `data-theme`.
- **PWA Assets**: Manifest, SW bleiben, aber Theme-Farben und Start-URL nach neuem Branding justieren.

## 5. Zielstruktur (Ausschnitt)
```
src/
  app/
    router.tsx
  features/
    shell/
      AppShell.tsx
      SideDrawer.tsx
    chat/
      components/
        ChatHeader.tsx
        MessageList.tsx
        MessageBubble.tsx
        Composer.tsx
        QuickChips.tsx
      routes/
        ChatRoute.tsx
      state/
        chatSlice.ts
    sessions/
      routes/SessionsRoute.tsx
    presets/
    models/
      components/ModelSwitcher.tsx
    extras/
    settings/
  shared/
    ui/
    lib/
    state/
  data/
  styles/
    tokens.css
    theme.css
```

## 6. Offene Risiken
- Umfangreiche CSS-Umstellung kann bestehende Komponenten temporär brechen → sukzessives Refactor mit Feature Flags empfohlen.
- Dexie-Einführung erfordert Migrationspfad von localStorage (Conversation-Export/Import).
- i18n-Einzug bedeutet alle Strings lokalisieren → hoher Aufwand, früh beginnen.

## 7. Nächste Schritte (Schritt 2 Vorbereitungen)
1. Design Tokens definieren (`styles/tokens.css`, `tailwind.config.ts`) inkl. Light/Dark Variablen.
2. Neue `shared/ui/theme-provider` (oder Hook) anlegen, `data-theme` Steuermitteln, `prefers-color-scheme` Fallback.
3. Tailwind extend bereinigen, Token-Mapping implementieren, ungenutzte Utilities entfernen.

---
Notes: Dokumentiert vollständige Ergebnisse von Schritt 1 inkl. konkreter Aktionen; keine Laufzeit- oder Build-relevanten Änderungen vorgenommen.
