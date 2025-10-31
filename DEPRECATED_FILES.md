# Deprecated Files & Dependencies

**Analyse-Datum:** 2025-10-31
**Tool:** `npx unimported v1.31.0`
**Entry Point:** `src/main.tsx`

## Zusammenfassung

- **Ungenutzte Dependencies:** 4
- **Ungenutzte Dateien:** 159
- **Unresolved Imports:** 0

## Status

Diese Datei dokumentiert Code, der aktuell nicht importiert oder verwendet wird. Dateien in dieser Liste sind potenzielle Kandidaten für die Entfernung, sollten aber vor dem Löschen auf versteckte Abhängigkeiten (z.B. dynamische Imports, Test-Only-Code) geprüft werden.

---

## Ungenutzte Dependencies (4)

Diese Packages sind in `package.json` installiert, werden aber im Code nicht importiert:

1. `@radix-ui/react-separator`
2. `js-yaml`
3. `tailwind-merge` (⚠️ **WARNUNG:** Wird laut Tiefenanalyse für Komponenten-Varianten genutzt - mögliches False Positive)
4. `workbox-precaching`

**Empfehlung:** Prüfen, ob diese Dependencies tatsächlich ungenutzt sind oder ob sie indirekt (z.B. über Plugins, Service Worker) verwendet werden.

---

## Ungenutzte Dateien (159)

### Kategorie: API & Services (3 Dateien)

- `src/api/chat.ts`
- `src/api/memory.ts`
- `src/_safelist.ts`

### Kategorie: Bootstrap & Migrations (1 Datei)

- `src/bootstrap/migrations.ts`

### Kategorie: Components - Chat (11 Dateien)

- `src/components/chat/ChatList.tsx`
- `src/components/chat/ChatMessage.tsx`
- `src/components/chat/ConversationHistorySheet.tsx`
- `src/components/chat/MobileChatInterface.tsx`
- `src/components/chat/QuickstartGrid.tsx`
- `src/components/chat/QuickstartTile.tsx`
- `src/components/chat/RoleSelector.tsx`
- `src/components/chat/StartTiles.tsx`
- `src/components/chat/TokenBadge.tsx`
- `src/components/chat/VirtualizedMessageList.tsx`

### Kategorie: Components - UI Base (19 Dateien)

- `src/components/Glass.tsx` (⚠️ **ZU UMBENENNEN:** in `SoftDepthSurface.tsx` laut Roadmap)
- `src/components/BottomSheet.tsx`
- `src/components/BottomSheetButton.tsx`
- `src/components/Header.tsx`
- `src/components/Tabs.tsx`
- `src/components/index.ts`
- `src/components/ui/bottom-sheet.tsx`
- `src/components/ui/BottomSheet.tsx` (Duplikat?)
- `src/components/ui/CommandPalette.tsx`
- `src/components/ui/CopyButton.tsx`
- `src/components/ui/HeroOrb.tsx`
- `src/components/ui/HolographicOrb.tsx`
- `src/components/ui/Icon.tsx`
- `src/components/ui/LazyImage.tsx`
- `src/components/ui/loading.tsx`
- `src/components/ui/MessageBubble.tsx`
- `src/components/ui/Skeleton.tsx`
- `src/components/ui/Tabs.tsx`
- `src/components/ui/Toast.tsx`

### Kategorie: Components - Layout & Navigation (5 Dateien)

- `src/components/layout/MobileNavigation.tsx`
- `src/components/layout/MobileTopAppBar.tsx`
- `src/components/navigation/ThemeToggle.tsx`
- `src/components/shell/AppShell.tsx`
- `src/components/shell/MainContent.tsx`

### Kategorie: Components - Feedback & Accessibility (5 Dateien)

- `src/components/accessibility/SkipLink.tsx`
- `src/components/feedback/ErrorState.tsx`
- `src/components/feedback/Loader.tsx`
- `src/components/feedback/PageSkeleton.tsx`
- `src/components/status/OrbStatus.tsx`

### Kategorie: Components - Studio & Templates (3 Dateien)

- `src/components/studio/MobileRolesInterface.tsx`
- `src/components/templates/TemplateCard.tsx`
- `src/components/memory/MemoryPanel.tsx`

### Kategorie: Components - Misc (4 Dateien)

- `src/app/components/BrandWordmark.tsx`
- `src/components/demo/CategoryDemo.tsx`
- `src/components/effects/PremiumEffects.tsx`
- `src/components/primitives/Card.tsx`

### Kategorie: Pages (10 Dateien)

- `src/pages/About.tsx`
- `src/pages/ConversationsPage.tsx`
- `src/pages/Debug.tsx`
- `src/pages/Home.tsx`
- `src/pages/MobileChat.tsx`
- `src/pages/MobileModels.tsx`
- `src/pages/MobileStudio.tsx`
- `src/pages/SettingsData.tsx`
- `src/pages/SettingsPage.tsx`
- `src/pages/SettingsSecurity.tsx`

### Kategorie: Hooks (24 Dateien)

- `src/hooks/use-media-query.ts`
- `src/hooks/use-mobile-vh.ts`
- `src/hooks/use-personas.ts`
- `src/hooks/use-safe-area-classes.ts`
- `src/hooks/use-viewport.ts`
- `src/hooks/useActivePersona.ts`
- `src/hooks/useAppearance.ts`
- `src/hooks/useBottomSheet.ts`
- `src/hooks/useChatInput.ts`
- `src/hooks/useConversations.ts`
- `src/hooks/useCopyButton.ts`
- `src/hooks/useDebounce.ts`
- `src/hooks/useErrorBoundary.ts`
- `src/hooks/useKeyboardShortcuts.ts`
- `src/hooks/useLocalStorageState.ts`
- `src/hooks/useMarkdownRenderer.ts`
- `src/hooks/useMobileOptimizations.ts`
- `src/hooks/useMobileSafeHeight.ts`
- `src/hooks/useModels.ts`
- `src/hooks/useNetworkStatus.ts`
- `src/hooks/usePWAUpdatePrompt.ts`
- `src/hooks/useSafeAreaInsets.ts`
- `src/hooks/useScrollBlock.ts`
- `src/hooks/useToast.ts`

### Kategorie: Lib - Chat & Communication (5 Dateien)

- `src/lib/chat/client.ts`
- `src/lib/chat/config.ts`
- `src/lib/chat/index.ts`
- `src/lib/chat/sendMessage.ts`
- `src/lib/chat/slashCommands.ts`

### Kategorie: Lib - Performance & Optimization (10 Dateien)

- `src/lib/accessibility/reducedMotion.ts`
- `src/lib/deployment-optimizations.ts`
- `src/lib/mobile/mobileInit.ts`
- `src/lib/mobile/progressive-enhancement.ts`
- `src/lib/perf/throttle-viewport-events.ts`
- `src/lib/performance-optimizations.ts`
- `src/lib/performance/mobileOptimizer.ts`
- `src/lib/performance/power-manager.ts`
- `src/lib/touch/performance.ts`

### Kategorie: Lib - Storage & Persistence (6 Dateien)

- `src/lib/offline-storage.ts`
- `src/lib/quickstarts/persistence.ts`
- `src/lib/settings/storage.ts`
- `src/lib/storage/index.ts`
- `src/lib/storage/quota-manager.ts`
- `src/lib/storage/validators.ts`

### Kategorie: Lib - PWA & Offline (6 Dateien)

- `src/lib/pwa/index.ts`
- `src/lib/pwa/install.ts`
- `src/lib/pwa/installPrompt.ts`
- `src/lib/pwa/offlineManager.ts`
- `src/lib/pwa-handlers.ts`
- `src/utils/sw-manager.ts`

### Kategorie: Lib - Network & HTTP (5 Dateien)

- `src/lib/http.ts`
- `src/lib/net/index.ts`
- `src/lib/net/online.ts`
- `src/lib/net/rateLimit.ts`
- `src/lib/net/retry.ts`

### Kategorie: Lib - UI & Interaction (11 Dateien)

- `src/lib/clipboard.ts`
- `src/lib/gestures/mobileShortcuts.ts`
- `src/lib/navigation/swipeNavigation.ts`
- `src/lib/nav.ts`
- `src/lib/sound/audio-feedback.ts`
- `src/lib/toast/mobileToast.ts`
- `src/lib/touch/gestures.ts`
- `src/lib/touch/haptics.ts`
- `src/lib/ui/copy-bubble.ts`
- `src/lib/ui/theme.ts`
- `src/ui/viewport.ts`

### Kategorie: Lib - Config & Utilities (11 Dateien)

- `src/lib/ab-testing.ts`
- `src/lib/analytics.ts`
- `src/lib/android/system.ts`
- `src/lib/configLoader.ts`
- `src/lib/errorText.ts`
- `src/lib/errors/humanError.ts`
- `src/lib/logger.ts`
- `src/lib/model-settings.ts`
- `src/lib/openrouter/index.ts`
- `src/lib/publicAsset.ts`
- `src/lib/utils/backoff.ts`
- `src/lib/utils/index.ts`
- `src/lib/utils/reload-manager.ts`

### Kategorie: Lib - Validators (4 Dateien)

- `src/lib/validators/conversations.ts`
- `src/lib/validators/index.ts`
- `src/lib/validators/roles.ts`
- `src/lib/validators/settings.ts`

### Kategorie: Styles & Design Tokens (10 Dateien)

- `src/styles/design-tokens.generated.ts`
- `src/styles/design-tokens.ts`
- `src/styles/tokens/color.ts`
- `src/styles/tokens/motion.ts`
- `src/styles/tokens/radius.ts`
- `src/styles/tokens/shadow.ts`
- `src/styles/tokens/spacing.ts`
- `src/styles/tokens/typography.ts`
- `src/theme/tokens.ts`
- `src/utils/tokens.ts`

### Kategorie: State & Templates (1 Datei)

- `src/state/templates.ts`

### Kategorie: UI Guards & Globals (2 Dateien)

- `src/ui/globals.ts`
- `src/ui/guard.ts`

### Kategorie: Utils (3 Dateien)

- `src/utils/buildMessages.ts`
- `src/utils/colorConverters.ts`
- `src/utils/focusChatInput.ts`
- `src/utils/id.ts`

### Kategorie: Testing (2 Dateien)

- `src/test/setup.ts`
- `src/test/testServer.ts`

---

## Nächste Schritte

1. **Manuelle Prüfung:** Jede ungenutzte Datei auf versteckte Abhängigkeiten prüfen (z.B. dynamische Imports, Test-Only-Code, Build-Skripte)
2. **Dependencies verifizieren:** Vor Deinstallation prüfen, ob sie indirekt verwendet werden
3. **Schrittweise Entfernung:** In separaten Commits entfernen, um Rollbacks zu ermöglichen
4. **Testing:** Nach jeder Entfernung vollständige Test-Suite ausführen

## Hinweise

⚠️ **Vorsicht:**

- Dateien in `src/pages/` könnten über dynamische Routing-Konfiguration geladen werden
- Test-Dateien (`src/test/`) sollten behalten werden
- Design-Token-Dateien könnten über Build-Prozess verwendet werden
- PWA-relevante Dateien könnten vom Service Worker genutzt werden

📝 **Beobachtung:**
Die hohe Anzahl ungenutzter Dateien deutet auf signifikante technische Schuld und mögliche Feature-Entfernungen in der Vergangenheit hin. Dies unterstützt die Roadmap-Strategie zur Codebase-Konsolidierung.
