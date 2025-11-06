## Autopilot Maintenance Summary

### Changes Applied

- ESLint auto-fixes
- Prettier formatting
- Local maintenance scripts
- Build verification

### Logs

```
Starting auto-fixes...
Running ESLint auto-fix...
npm warn config production Use `--omit=dev` instead.

/home/runner/work/Disa_Ai/Disa_Ai/src/app/router.tsx
  255:7  warning  'router' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars

✖ 1 problem (0 errors, 1 warning)

Running Prettier...
npm warn config production Use `--omit=dev` instead.
[90m.changeset/config.json[39m 40ms (unchanged)
[90m.changeset/README.md[39m 56ms (unchanged)
[90m.github/dependabot.yml[39m 5ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.md[39m 8ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.yml[39m 26ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.md[39m 4ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.yml[39m 26ms (unchanged)
[90m.github/NEUES_MAIN_ANALYSIS.md[39m 27ms (unchanged)
[90m.github/pull_request_template.md[39m 20ms (unchanged)
[90m.github/REQUIRED_CHECKS.md[39m 7ms (unchanged)
[90m.github/workflows/autopilot.yml[39m 11ms (unchanged)
[90m.github/workflows/bundle-monitor.yml[39m 12ms (unchanged)
[90m.github/workflows/ci.yml[39m 4ms (unchanged)
[90m.github/workflows/code-quality.yml[39m 17ms (unchanged)
[90m.github/workflows/codeql.yml[39m 11ms (unchanged)
[90m.github/workflows/codescan.yml[39m 12ms (unchanged)
[90m.github/workflows/dependency-review.yml[39m 7ms (unchanged)
[90m.github/workflows/lighthouse.yml[39m 5ms (unchanged)
[90m.github/workflows/release.yml[39m 19ms (unchanged)
[90m.grok/settings.json[39m 1ms (unchanged)
[90m.grok/user-settings.json[39m 1ms (unchanged)
[90m.prettierrc.json[39m 2ms (unchanged)
[90m.qwen/PROJECT_SUMMARY.md[39m 11ms (unchanged)
[90mdeploy/cloudflare/cloudflare-pages.json[39m 3ms (unchanged)
[90meslint.config.mjs[39m 30ms (unchanged)
[90mfunctions/_middleware.ts[39m 50ms (unchanged)
[90mindex.html[39m 53ms (unchanged)
[90mlighthouserc.cjs[39m 11ms (unchanged)
[90mpackage-lock.json[39m 221ms (unchanged)
[90mpackage.json[39m 2ms (unchanged)
[90mplaywright.config.ts[39m 11ms (unchanged)
[90mpostcss.config.cjs[39m 1ms (unchanged)
[90mPRIVACY.md[39m 29ms (unchanged)
[90mpublic/_routes.json[39m 2ms (unchanged)
[90mpublic/datenschutz.html[39m 48ms (unchanged)
[90mpublic/impressum.html[39m 22ms (unchanged)
[90mpublic/manifest.webmanifest[39m 7ms (unchanged)
[90mpublic/models.json[39m 8ms (unchanged)
[90mpublic/offline.html[39m 45ms (unchanged)
[90mpublic/persona.json[39m 21ms (unchanged)
[90mpublic/privacy-policy.html[39m 14ms (unchanged)
[90mpublic/quickstarts.json[39m 4ms (unchanged)
[90mpublic/styles.json[39m 19ms (unchanged)
[90mpublic/sw.js[39m 38ms (unchanged)
[90mREADME.md[39m 101ms (unchanged)
[90mrenovate.json[39m 6ms (unchanged)
[90mreport/html/index.html[39m 53ms (unchanged)
[90mreport/html/js/prism.js[39m 73ms (unchanged)
[90mreport/html/jscpd-report.json[39m 165ms (unchanged)
[90mreport/html/styles/prism.css[39m 11ms (unchanged)
[90mreport/html/styles/tailwind.css[39m 5548ms (unchanged)
[90mscripts/build-info.js[39m 7ms (unchanged)
[90mscripts/generate-routes.js[39m 2ms (unchanged)
[90mscripts/generate-tokens.mjs[39m 21ms (unchanged)
[90mscripts/run-preview.mjs[39m 11ms (unchanged)
[90msrc/__tests__/apiKeyShim.test.ts[39m 11ms (unchanged)
[90msrc/__tests__/branding.test.tsx[39m 6ms (unchanged)
[90msrc/__tests__/colorConverters.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/designTokens.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/humanError.test.ts[39m 6ms (unchanged)
[90msrc/__tests__/memory.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/message-id-synchronization.test.ts[39m 54ms (unchanged)
[90msrc/__tests__/models-fallback.test.ts[39m 29ms (unchanged)
[90msrc/__tests__/models.cache.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/networkBanner.test.tsx[39m 4ms (unchanged)
[90msrc/__tests__/openrouter.abort.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/openrouter.ndjson.test.ts[39m 6ms (unchanged)
[90msrc/__tests__/openrouter.test.ts[39m 7ms (unchanged)
[90msrc/__tests__/sw-cache-management.test.ts[39m 15ms (unchanged)
[90msrc/__tests__/useChat.race-condition.test.ts[39m 19ms (unchanged)
[90msrc/__tests__/viewport-scroll-performance.test.ts[39m 20ms (unchanged)
[90msrc/_safelist.ts[39m 1ms (unchanged)
[90msrc/analytics/discussion.ts[39m 5ms (unchanged)
[90msrc/api/chat.ts[39m 11ms (unchanged)
[90msrc/api/memory.ts[39m 6ms (unchanged)
[90msrc/api/openrouter.ts[39m 26ms (unchanged)
[90msrc/App.tsx[39m 5ms (unchanged)
[90msrc/app/components/BrandWordmark.tsx[39m 3ms (unchanged)
[90msrc/app/components/RouteWrapper.tsx[39m 2ms (unchanged)
[90msrc/app/layouts/AppShell.tsx[39m 13ms (unchanged)
[90msrc/app/router.tsx[39m 33ms (unchanged)
[90msrc/app/state/StudioContext.tsx[39m 13ms (unchanged)
[90msrc/bootstrap/migrations.ts[39m 1ms (unchanged)
[90msrc/components/accessibility/index.ts[39m 1ms (unchanged)
[90msrc/components/accessibility/SkipLink.tsx[39m 3ms (unchanged)
[90msrc/components/BottomSheetButton.tsx[39m 11ms (unchanged)
[90msrc/components/BuildInfo.tsx[39m 7ms (unchanged)
[90msrc/components/chat/ChatComposer.tsx[39m 18ms (unchanged)
[90msrc/components/chat/ChatHistorySidebar.tsx[39m 20ms (unchanged)
[90msrc/components/chat/ChatList.tsx[39m 22ms (unchanged)
[90msrc/components/chat/ChatMessage.tsx[39m 12ms (unchanged)
[90msrc/components/chat/ChatStatusBanner.tsx[39m 3ms (unchanged)
[90msrc/components/chat/ChatView.tsx[39m 5ms (unchanged)
[90msrc/components/chat/ConversationHistorySheet.tsx[39m 7ms (unchanged)
[90msrc/components/chat/DiscussionStarter.tsx[39m 6ms (unchanged)
[90msrc/components/chat/index.ts[39m 3ms (unchanged)
[90msrc/components/chat/MessageBubble.tsx[39m 4ms (unchanged)
[90msrc/components/chat/MessageBubbleCard.tsx[39m 1ms (unchanged)
[90msrc/components/chat/QuickstartGrid.tsx[39m 9ms (unchanged)
[90msrc/components/chat/quickstartHelpers.ts[39m 3ms (unchanged)
[90msrc/components/chat/QuickstartTile.tsx[39m 9ms (unchanged)
[90msrc/components/chat/RoleSelector.tsx[39m 27ms (unchanged)
[90msrc/components/chat/StartTiles.tsx[39m 9ms (unchanged)
[90msrc/components/chat/TokenBadge.tsx[39m 9ms (unchanged)
[90msrc/components/chat/VirtualizedMessageList.tsx[39m 10ms (unchanged)
[90msrc/components/chat/WelcomeScreen.tsx[39m 3ms (unchanged)
[90msrc/components/common/EnhancedListInterface.tsx[39m 35ms (unchanged)
[90msrc/components/common/index.ts[39m 1ms (unchanged)
[90msrc/components/effects/index.ts[39m 1ms (unchanged)
[90msrc/components/effects/PremiumEffects.tsx[39m 27ms (unchanged)
[90msrc/components/ErrorBoundary.tsx[39m 28ms (unchanged)
[90msrc/components/feedback/ErrorState.tsx[39m 6ms (unchanged)
[90msrc/components/feedback/index.ts[39m 1ms (unchanged)
[90msrc/components/feedback/Loader.tsx[39m 3ms (unchanged)
[90msrc/components/feedback/PageSkeleton.tsx[39m 2ms (unchanged)
[90msrc/components/Header.tsx[39m 13ms (unchanged)
[90msrc/components/index.ts[39m 2ms (unchanged)
[90msrc/components/layout/DesktopSidebar.tsx[39m 5ms (unchanged)
[90msrc/components/layout/GlobalBackground.css[39m 2ms (unchanged)
[90msrc/components/layout/GlobalBackground.tsx[39m 1ms (unchanged)
[90msrc/components/layout/GlobalNav.tsx[39m 5ms (unchanged)
[90msrc/components/layout/index.ts[39m 1ms (unchanged)
[90msrc/components/layout/MobileNavigation.tsx[39m 7ms (unchanged)
[90msrc/components/layout/MobileOnlyGate.tsx[39m 8ms (unchanged)
[90msrc/components/layout/MobilePageShell.tsx[39m 2ms (unchanged)
[90msrc/components/layout/MobileTopAppBar.tsx[39m 3ms (unchanged)
[90msrc/components/memory/index.ts[39m 1ms (unchanged)
[90msrc/components/memory/MemoryPanel.tsx[39m 12ms (unchanged)
[90msrc/components/models/__tests__/categorizeModelFromTags.test.ts[39m 4ms (unchanged)
[90msrc/components/models/EnhancedModelsInterface.tsx[39m 60ms (unchanged)
[90msrc/components/models/index.ts[39m 1ms (unchanged)
[90msrc/components/models/ModelComparisonTable.tsx[39m 9ms (unchanged)
[90msrc/components/navigation/index.ts[39m 1ms (unchanged)
[90msrc/components/navigation/SideDrawer.tsx[39m 7ms (unchanged)
[90msrc/components/navigation/ThemeToggle.tsx[39m 1ms (unchanged)
[90msrc/components/NetworkBanner.tsx[39m 2ms (unchanged)
[90msrc/components/primitives/Card.tsx[39m 1ms (unchanged)
[90msrc/components/primitives/index.ts[39m 1ms (unchanged)
[90msrc/components/pwa/index.ts[39m 1ms (unchanged)
[90msrc/components/pwa/PWADebugInfo.tsx[39m 7ms (unchanged)
[90msrc/components/pwa/PWAInstallPrompt.tsx[39m 7ms (unchanged)
[90msrc/components/roles/EnhancedRolesInterface.tsx[39m 49ms (unchanged)
[90msrc/components/roles/index.ts[39m 1ms (unchanged)
[90msrc/components/roles/roles-filter.ts[39m 7ms (unchanged)
[90msrc/components/status/index.ts[39m 1ms (unchanged)
[90msrc/components/status/OrbStatus.tsx[39m 2ms (unchanged)
[90msrc/components/studio/RoleCard.tsx[39m 20ms (unchanged)
[90msrc/components/Tabs.tsx[39m 6ms (unchanged)
[90msrc/components/templates/index.ts[39m 1ms (unchanged)
[90msrc/components/templates/TemplateCard.tsx[39m 13ms (unchanged)
[90msrc/components/ui/Accordion.tsx[39m 13ms (unchanged)
[90msrc/components/ui/avatar.tsx[39m 7ms (unchanged)
[90msrc/components/ui/badge.tsx[39m 5ms (unchanged)
[90msrc/components/ui/BottomSheet.tsx[39m 12ms (unchanged)
[90msrc/components/ui/button.tsx[39m 13ms (unchanged)
[90msrc/components/ui/card-system.md[39m 42ms (unchanged)
[90msrc/components/ui/card-types.ts[39m 13ms (unchanged)
[90msrc/components/ui/card.tsx[39m 39ms (unchanged)
[90msrc/components/ui/chip.tsx[39m 19ms (unchanged)
[90msrc/components/ui/CommandPalette.tsx[39m 30ms (unchanged)
[90msrc/components/ui/CopyButton.tsx[39m 10ms (unchanged)
[90msrc/components/ui/Dialog.tsx[39m 9ms (unchanged)
[90msrc/components/ui/DiscussionTopicCard.tsx[39m 9ms (unchanged)
[90msrc/components/ui/drawer-sheet.tsx[39m 13ms (unchanged)
[90msrc/components/ui/dropdown-menu.tsx[39m 14ms (unchanged)
[90msrc/components/ui/FloatingInput.tsx[39m 2ms (unchanged)
[90msrc/components/ui/HeroOrb.tsx[39m 3ms (unchanged)
[90msrc/components/ui/HolographicOrb.tsx[39m 2ms (unchanged)
[90msrc/components/ui/Icon.tsx[39m 4ms (unchanged)
[90msrc/components/ui/index.ts[39m 3ms (unchanged)
[90msrc/components/ui/input.tsx[39m 4ms (unchanged)
[90msrc/components/ui/label.tsx[39m 2ms (unchanged)
[90msrc/components/ui/LazyImage.tsx[39m 9ms (unchanged)
[90msrc/components/ui/loading.tsx[39m 7ms (unchanged)
[90msrc/components/ui/ModelCard.tsx[39m 12ms (unchanged)
[90msrc/components/ui/ModelSelect.tsx[39m 3ms (unchanged)
[90msrc/components/ui/Ripple.tsx[39m 4ms (unchanged)
[90msrc/components/ui/RoleSelect.tsx[39m 2ms (unchanged)
[90msrc/components/ui/select.tsx[39m 12ms (unchanged)
[90msrc/components/ui/separator.tsx[39m 2ms (unchanged)
[90msrc/components/ui/Skeleton.tsx[39m 10ms (unchanged)
[90msrc/components/ui/StaticSurfaceSection.tsx[39m 2ms (unchanged)
[90msrc/components/ui/StatusCard.tsx[39m 8ms (unchanged)
[90msrc/components/ui/Switch.tsx[39m 5ms (unchanged)
[90msrc/components/ui/table.tsx[39m 9ms (unchanged)
[90msrc/components/ui/tabs.tsx[39m 4ms (unchanged)
[90msrc/components/ui/textarea.tsx[39m 4ms (unchanged)
[90msrc/components/ui/Toast.tsx[39m 1ms (unchanged)
[90msrc/components/ui/toast/index.ts[39m 1ms (unchanged)
[90msrc/components/ui/toast/ToastsProvider.tsx[39m 4ms (unchanged)
[90msrc/components/ui/toast/ToastTypes.ts[39m 1ms (unchanged)
[90msrc/components/ui/tooltip.tsx[39m 3ms (unchanged)
[90msrc/components/ui/VirtualList.tsx[39m 13ms (unchanged)
[90msrc/config/defaults.ts[39m 2ms (unchanged)
[90msrc/config/discussion-topics.ts[39m 2ms (unchanged)
[90msrc/config/env.ts[39m 14ms (unchanged)
[90msrc/config/featureFlags.ts[39m 3ms (unchanged)
[90msrc/config/modelDescriptions.ts[39m 5ms (unchanged)
[90msrc/config/modelPolicy.ts[39m 3ms (unchanged)
[90msrc/config/models.ts[39m 18ms (unchanged)
[90msrc/config/models/discussionProfile.ts[39m 1ms (unchanged)
[90msrc/config/personas.ts[39m 9ms (unchanged)
[90msrc/config/promptStyles.ts[39m 2ms (unchanged)
[90msrc/config/promptTemplates.ts[39m 1ms (unchanged)
[90msrc/config/quickstarts.test.ts[39m 15ms (unchanged)
[90msrc/config/quickstarts.ts[39m 15ms (unchanged)
[90msrc/config/rolePolicy.ts[39m 3ms (unchanged)
[90msrc/config/roleStore.ts[39m 10ms (unchanged)
[90msrc/config/settings.ts[39m 21ms (unchanged)
[90msrc/config/styleModelRules.ts[39m 1ms (unchanged)
[90msrc/config/terminology.ts[39m 8ms (unchanged)
[90msrc/contexts/FavoritesContext.tsx[39m 11ms (unchanged)
[90msrc/data/conversationTemplates.ts[39m 9ms (unchanged)
[90msrc/data/roleIds.ts[39m 2ms (unchanged)
[90msrc/data/roles.dataset.ts[39m 7ms (unchanged)
[90msrc/data/roles.ts[39m 9ms (unchanged)
[90msrc/features/discussion/__tests__/shape.test.ts[39m 3ms (unchanged)
[90msrc/features/discussion/shape.ts[39m 10ms (unchanged)
[90msrc/features/prompt/composeSystemPrompt.ts[39m 7ms (unchanged)
[90msrc/features/prompt/gamePrompts.ts[39m 3ms (unchanged)
[90msrc/features/settings/SettingsOverview.tsx[39m 11ms (unchanged)
[90msrc/features/settings/SettingsView.tsx[39m 24ms (unchanged)
[90msrc/hooks/__tests__/useChat.systemPrompt.test.ts[39m 12ms (unchanged)
[90msrc/hooks/useChat.ts[39m 27ms (unchanged)
[90msrc/hooks/useChatSession.ts[39m 7ms (unchanged)
[90msrc/hooks/useConversationManager.ts[39m 9ms (unchanged)
[90msrc/hooks/useConversations.ts[39m 12ms (unchanged)
[90msrc/hooks/useDiscussion.ts[39m 10ms (unchanged)
[90msrc/hooks/useEdgeSwipe.ts[39m 7ms (unchanged)
[90msrc/hooks/useFavoritesManager.ts[39m 44ms (unchanged)
[90msrc/hooks/useFilteredList.ts[39m 4ms (unchanged)
[90msrc/hooks/useFocusTrap.ts[39m 3ms (unchanged)
[90msrc/hooks/useInteractionGroup.tsx[39m 23ms (unchanged)
[90msrc/hooks/useIsMobile.ts[39m 3ms (unchanged)
[90msrc/hooks/useMediaQuery.ts[39m 4ms (unchanged)
[90msrc/hooks/useMemory.ts[39m 4ms (unchanged)
[90msrc/hooks/usePWAHandlers.ts[39m 15ms (unchanged)
[90msrc/hooks/usePWAInstall.ts[39m 4ms (unchanged)
[90msrc/hooks/useQuickstartFlow.ts[39m 3ms (unchanged)
[90msrc/hooks/useQuickstartManager.ts[39m 12ms (unchanged)
[90msrc/hooks/useServiceWorker.ts[39m 3ms (unchanged)
[90msrc/hooks/useSettings.ts[39m 6ms (unchanged)
[90msrc/hooks/useStickToBottom.ts[39m 6ms (unchanged)
[90msrc/hooks/useSwipe.ts[39m 4ms (unchanged)
[90msrc/hooks/useSwipeablePanel.ts[39m 6ms (unchanged)
[90msrc/hooks/useTheme.ts[39m 2ms (unchanged)
[90msrc/hooks/useTranslation.ts[39m 3ms (unchanged)
[90msrc/hooks/useUIState.tsx[39m 20ms (unchanged)
[90msrc/hooks/useViewportHeight.ts[39m 4ms (unchanged)
[90msrc/hooks/useVisualViewport.ts[39m 6ms (unchanged)
[90msrc/index.css[39m 18ms (unchanged)
[90msrc/lib/a11y/focus.ts[39m 3ms (unchanged)
[90msrc/lib/a11y/skipLink.ts[39m 3ms (unchanged)
[90msrc/lib/a11y/touchTargets.ts[39m 27ms (unchanged)
[90msrc/lib/a11y/useReducedMotion.ts[39m 3ms (unchanged)
[90msrc/lib/ab-testing.ts[39m 14ms (unchanged)
[90msrc/lib/analytics.test.ts[39m 10ms (unchanged)
[90msrc/lib/analytics.ts[39m 24ms (unchanged)
[90msrc/lib/android/system.ts[39m 26ms (unchanged)
[90msrc/lib/chat/client.ts[39m 4ms (unchanged)
[90msrc/lib/chat/config.ts[39m 1ms (unchanged)
[90msrc/lib/chat/index.ts[39m 1ms (unchanged)
[90msrc/lib/chat/sendMessage.ts[39m 7ms (unchanged)
[90msrc/lib/chat/slashCommands.ts[39m 33ms (unchanged)
[90msrc/lib/clipboard.ts[39m 5ms (unchanged)
[90msrc/lib/cn.ts[39m 2ms (unchanged)
[90msrc/lib/configLoader.ts[39m 13ms (unchanged)
[90msrc/lib/conversation-manager.ts[39m 17ms (unchanged)
[90msrc/lib/conversation-utils.ts[39m 6ms (unchanged)
[90msrc/lib/deployment-optimizations.ts[39m 26ms (unchanged)
[90msrc/lib/errors/__tests__/mapper.test.ts[39m 9ms (unchanged)
[90msrc/lib/errors/humanError.ts[39m 4ms (unchanged)
[90msrc/lib/errors/index.ts[39m 1ms (unchanged)
[90msrc/lib/errors/mapper.ts[39m 4ms (unchanged)
[90msrc/lib/errors/types.ts[39m 8ms (unchanged)
[90msrc/lib/formatRelativeTime.ts[39m 6ms (unchanged)
[90msrc/lib/gestures/mobileShortcuts.ts[39m 32ms (unchanged)
[90msrc/lib/http.ts[39m 8ms (unchanged)
[90msrc/lib/i18n/index.ts[39m 8ms (unchanged)
[90msrc/lib/i18n/locales/de.ts[39m 4ms (unchanged)
[90msrc/lib/i18n/locales/en.ts[39m 6ms (unchanged)
[90msrc/lib/logger.ts[39m 9ms (unchanged)
[90msrc/lib/memory/memoryService.ts[39m 3ms (unchanged)
[90msrc/lib/mobile-testing-plan.md[39m 28ms (unchanged)
[90msrc/lib/mobile/mobileInit.ts[39m 18ms (unchanged)
[90msrc/lib/mobile/progressive-enhancement.ts[39m 23ms (unchanged)
[90msrc/lib/model-settings.ts[39m 21ms (unchanged)
[90msrc/lib/nav.ts[39m 2ms (unchanged)
[90msrc/lib/navigation/swipeNavigation.ts[39m 22ms (unchanged)
[90msrc/lib/net/concurrency.ts[39m 8ms (unchanged)
[90msrc/lib/net/fetchTimeout.ts[39m 7ms (unchanged)
[90msrc/lib/net/index.ts[39m 1ms (unchanged)
[90msrc/lib/net/online.ts[39m 2ms (unchanged)
[90msrc/lib/net/rateLimit.ts[39m 3ms (unchanged)
[90msrc/lib/observer.ts[39m 2ms (unchanged)
[90msrc/lib/openrouter/__tests__/key.test.ts[39m 4ms (unchanged)
[90msrc/lib/openrouter/__tests__/keyLifecycle.test.ts[39m 10ms (unchanged)
[90msrc/lib/openrouter/index.ts[39m 1ms (unchanged)
[90msrc/lib/openrouter/key.ts[39m 6ms (unchanged)
[90msrc/lib/perf/throttle-viewport-events.ts[39m 4ms (unchanged)
[90msrc/lib/performance-optimizations.ts[39m 17ms (unchanged)
[90msrc/lib/performance/mobileOptimizer.ts[39m 22ms (unchanged)
[90msrc/lib/performance/power-manager.ts[39m 22ms (unchanged)
[90msrc/lib/publicAsset.ts[39m 2ms (unchanged)
[90msrc/lib/pwa-handlers.ts[39m 16ms (unchanged)
[90msrc/lib/pwa/index.ts[39m 1ms (unchanged)
[90msrc/lib/pwa/install.ts[39m 5ms (unchanged)
[90msrc/lib/pwa/installPrompt.ts[39m 9ms (unchanged)
[90msrc/lib/pwa/offlineManager.ts[39m 24ms (unchanged)
[90msrc/lib/pwa/registerSW.ts[39m 1ms (unchanged)
[90msrc/lib/quickstarts/persistence.ts[39m 7ms (unchanged)
[90msrc/lib/settings/storage.ts[39m 4ms (unchanged)
[90msrc/lib/sound/audio-feedback.ts[39m 13ms (unchanged)
[90msrc/lib/storage/index.ts[39m 1ms (unchanged)
[90msrc/lib/storage/quota-manager.ts[39m 23ms (unchanged)
[90msrc/lib/storage/validators.ts[39m 5ms (unchanged)
[90msrc/lib/toast/mobileToast.ts[39m 17ms (unchanged)
[90msrc/lib/touch/__tests__/gestures.test.ts[39m 16ms (unchanged)
[90msrc/lib/touch/__tests__/haptics.test.ts[39m 21ms (unchanged)
[90msrc/lib/touch/gestures.ts[39m 13ms (unchanged)
[90msrc/lib/touch/haptics.ts[39m 8ms (unchanged)
[90msrc/lib/touch/performance.ts[39m 13ms (unchanged)
[90msrc/lib/ui/copy-bubble.ts[39m 7ms (unchanged)
[90msrc/lib/ui/theme.ts[39m 1ms (unchanged)
[90msrc/lib/utils.ts[39m 1ms (unchanged)
[90msrc/lib/utils/backoff.ts[39m 3ms (unchanged)
[90msrc/lib/utils/index.ts[39m 1ms (unchanged)
[90msrc/lib/utils/production-logger.ts[39m 6ms (unchanged)
[90msrc/lib/utils/reload-manager.ts[39m 1ms (unchanged)
[90msrc/lib/validators/conversations.ts[39m 2ms (unchanged)
[90msrc/lib/validators/index.ts[39m 1ms (unchanged)
[90msrc/lib/validators/roles.ts[39m 3ms (unchanged)
[90msrc/lib/validators/settings.ts[39m 2ms (unchanged)
[90msrc/main.tsx[39m 2ms (unchanged)
[90msrc/pages/Chat.tsx[39m 18ms (unchanged)
[90msrc/pages/MobileModels.tsx[39m 3ms (unchanged)
[90msrc/pages/MobileStudio.tsx[39m 2ms (unchanged)
[90msrc/pages/Settings.tsx[39m 3ms (unchanged)
[90msrc/pages/SettingsApi.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsAppearance.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsData.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsFilters.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsMemory.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsOverviewPage.tsx[39m 1ms (unchanged)
[90msrc/prompts/discussion/base.ts[39m 4ms (unchanged)
[90msrc/prompts/discussion/presets.ts[39m 2ms (unchanged)
[90msrc/services/openrouter.ts[39m 7ms (unchanged)
[90msrc/state/templates.ts[39m 4ms (unchanged)
[90msrc/styles/base.css[39m 19ms (unchanged)
[90msrc/styles/components.css[39m 159ms (unchanged)
[90msrc/styles/design-tokens.generated.ts[39m 7ms (unchanged)
[90msrc/styles/design-tokens.ts[39m 4ms (unchanged)
[90msrc/styles/neomorphic-utilities.css[39m 5ms (unchanged)
[90msrc/styles/theme.ts[39m 6ms (unchanged)
[90msrc/styles/tokens.css[39m 60ms (unchanged)
[90msrc/styles/tokens/category-colors.ts[39m 5ms (unchanged)
[90msrc/styles/tokens/category-tonal-scales.ts[39m 20ms (unchanged)
[90msrc/styles/tokens/color.ts[39m 19ms (unchanged)
[90msrc/styles/tokens/motion.ts[39m 3ms (unchanged)
[90msrc/styles/tokens/radius.ts[39m 4ms (unchanged)
[90msrc/styles/tokens/shadow.ts[39m 6ms (unchanged)
[90msrc/styles/tokens/spacing.ts[39m 7ms (unchanged)
[90msrc/styles/tokens/typography.ts[39m 13ms (unchanged)
[90msrc/styles/ui-state-animations.css[39m 25ms (unchanged)
[90msrc/styles/z-index-system.css[39m 3ms (unchanged)
[90msrc/test/setup.ts[39m 3ms (unchanged)
[90msrc/test/testServer.ts[39m 2ms (unchanged)
[90msrc/types/chat.ts[39m 1ms (unchanged)
[90msrc/types/chatMessage.ts[39m 1ms (unchanged)
[90msrc/types/enhanced-interfaces.ts[39m 13ms (unchanged)
[90msrc/types/index.ts[39m 2ms (unchanged)
[90msrc/ui/globals.ts[39m 2ms (unchanged)
[90msrc/ui/guard.ts[39m 3ms (unchanged)
[90msrc/ui/viewport.ts[39m 2ms (unchanged)
[90msrc/utils/animationPerformance.ts[39m 25ms (unchanged)
[90msrc/utils/buildMessages.ts[39m 4ms (unchanged)
[90msrc/utils/category-mapping.ts[39m 7ms (unchanged)
[90msrc/utils/colorConverters.ts[39m 6ms (unchanged)
[90msrc/utils/focusChatInput.ts[39m 2ms (unchanged)
[90msrc/utils/id.ts[39m 3ms (unchanged)
[90msrc/utils/pricing.ts[39m 6ms (unchanged)
[90msrc/utils/sw-manager.ts[39m 13ms (unchanged)
[90msrc/utils/tokens.ts[39m 2ms (unchanged)
[90msrc/vitest-env.d.ts[39m 1ms (unchanged)
[90mtailwind.config.ts[39m 12ms (unchanged)
[90mtests/browser-setup.ts[39m 7ms (unchanged)
[90mtests/e2e/api-mock.ts[39m 8ms (unchanged)
[90mtests/e2e/helpers/app-helpers.ts[39m 11ms (unchanged)
[90mtests/e2e/roles.spec.ts[39m 4ms (unchanged)
[90mtests/e2e/smoke.spec.ts[39m 4ms (unchanged)
[90mtests/polyfills.ts[39m 4ms (unchanged)
[90mtests/setup.ts[39m 2ms (unchanged)
[90mtests/setup/fetch.ts[39m 3ms (unchanged)
[90mtests/smoke/settings.smoke.test.tsx[39m 6ms (unchanged)
[90mtests/smoke/ui.smoke.test.tsx[39m 2ms (unchanged)
[90mtests/unit/composeSystemPrompt.test.ts[39m 2ms (unchanged)
[90mtests/unit/copyButton.test.tsx[39m 5ms (unchanged)
[90mtests/unit/ErrorBoundary.test.tsx[39m 6ms (unchanged)
[90mtests/unit/rateLimit.test.ts[39m 2ms (unchanged)
[90mtests/unit/useChat.test.tsx[39m 10ms (unchanged)
[90mtmp/shadow-performance-test.html[39m 16ms (unchanged)
[90mtmp/src/ui/base.css[39m 4ms (unchanged)
[90mtools/check-css-hex.mjs[39m 5ms (unchanged)
[90mtsconfig.base.json[39m 2ms (unchanged)
[90mtsconfig.json[39m 1ms (unchanged)
[90mtsconfig.node.json[39m 1ms (unchanged)
[90mtsconfig.test.json[39m 1ms (unchanged)
[90mvite-env.d.ts[39m 3ms (unchanged)
[90mvite.config.ts[39m 16ms (unchanged)
[90mvitest.config.ts[39m 2ms (unchanged)
[90mvitest.shims.d.ts[39m 1ms (unchanged)
Checking for unused imports...
npm warn config production Use `--omit=dev` instead.
npm warn exec The following package was not found and will be installed: ts-unused-exports@11.0.1
128 modules with unused exports
/home/runner/work/Disa_Ai/Disa_Ai/src/_safelist.ts: TAILWIND_SAFELIST
/home/runner/work/Disa_Ai/Disa_Ai/src/analytics/discussion.ts: DiscussionAnalyticsRecord, getDiscussionAnalytics, exportDiscussionAnalytics
/home/runner/work/Disa_Ai/Disa_Ai/src/api/chat.ts: ChatRequest, createChatAPI
/home/runner/work/Disa_Ai/Disa_Ai/src/api/openrouter.ts: checkApiHealth
/home/runner/work/Disa_Ai/Disa_Ai/src/components/index.ts: SkipLink, ChatComposer, ChatHistorySidebar, ChatList, ChatMessage, ChatStatusBanner, ChatView, ConversationHistorySheet, DiscussionStarter, ChatMessageBubble, MessageBubbleCard, QuickstartGrid, QuickstartTile, RoleSelector, StartTiles, TokenBadge, VirtualizedMessageList, WelcomeScreen, * -> /src/components/chat/quickstartHelpers, EnhancedListInterface, CustomCursor, MatrixRain, NeuralNetwork, ParticleSystem, ScrollProgress, useClickExplosion, useScrollReveal, PremiumEffects, ErrorState, FeedbackSkeleton, FeedbackSpinner, PageSkeleton, DesktopSidebar, GlobalNav, NAV_ITEMS, MobileNavigation, MobileTopAppBar, GlobalBackground, MobilePageShell, MobileOnlyGate, MemoryPanel, EnhancedModelsInterface, ModelComparisonTable, SideDrawer, ThemeToggle, Card, PWADebugInfo, PWAInstallPrompt, EnhancedRolesInterface, * -> /src/components/roles/roles-filter, OrbStatus, TemplateCard, * -> /src/components/ui/Accordion, * -> /src/components/ui/avatar, * -> /src/components/ui/badge, * -> /src/components/ui/BottomSheet, * -> /src/components/ui/button, * -> /src/components/ui/chip, * -> /src/components/ui/CommandPalette, * -> /src/components/ui/CopyButton, * -> /src/components/ui/Dialog, * -> /src/components/ui/drawer-sheet, * -> /src/components/ui/dropdown-menu, * -> /src/components/ui/FloatingInput, * -> /src/components/ui/HeroOrb, * -> /src/components/ui/HolographicOrb, * -> /src/components/ui/Icon, * -> /src/components/ui/input, * -> /src/components/ui/LazyImage, UILoadingCard, * -> /src/components/ui/select, * -> /src/components/ui/separator, * -> /src/components/ui/Skeleton, * -> /src/components/ui/StaticSurfaceSection, * -> /src/components/ui/StatusCard, * -> /src/components/ui/Switch, * -> /src/components/ui/table, * -> /src/components/ui/tabs, * -> /src/components/ui/textarea, * -> /src/components/ui/Toast, * -> /src/components/ui/tooltip, * -> /src/components/ui/VirtualList, CardProps, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ModelCardProps, ModelCard, CardVariantProps, * -> /src/components/ui/DiscussionTopicCard, CardUtils, * -> /src/components/ui/toast/ToastsProvider, * -> /src/components/ui/toast/ToastTypes
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/card-types.ts: BaseCardProps, ExtendedCardProps, StatusType, DiscussionCategory, AdvancedInteractiveCardProps, MenuItem, CardGridProps, InteractionType, IntentType, StateType, ToneType, ElevationType, PaddingType, SizeType, CardVariantCombination, CardEventHandler, CardKeyboardEventHandler, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardContentProps, CardFooterProps, ConditionalCardProps, STATUS_TYPES, DISCUSSION_CATEGORIES, INTERACTION_TYPES, INTENT_TYPES, STATE_TYPES
/home/runner/work/Disa_Ai/Disa_Ai/src/config/defaults.ts: STORAGE_KEYS, REQUEST_CONFIG, APP_CONFIG
/home/runner/work/Disa_Ai/Disa_Ai/src/config/env.ts: EnvConfig, getEnvironmentWarnings
/home/runner/work/Disa_Ai/Disa_Ai/src/config/featureFlags.ts: getPreferRolePolicy, setPreferRolePolicy, getVirtualListEnabled, setVirtualListEnabled
/home/runner/work/Disa_Ai/Disa_Ai/src/config/modelPolicy.ts: ModelPolicy
/home/runner/work/Disa_Ai/Disa_Ai/src/config/models.ts: Price, CatalogOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/config/personas.ts: Persona, PersonaCategory, PERSONA_CATEGORIES, getAllPersonas, getPersonaById, getDefaultPersona, getPersonasByCategory
/home/runner/work/Disa_Ai/Disa_Ai/src/config/promptStyles.ts: buildSystemPrompt, StyleKey
/home/runner/work/Disa_Ai/Disa_Ai/src/config/promptTemplates.ts: RoleTemplate, fetchRoleTemplates, getRoleLoadStatus, listRoleTemplates
/home/runner/work/Disa_Ai/Disa_Ai/src/config/rolePolicy.ts: recommendedPolicyForRole
/home/runner/work/Disa_Ai/Disa_Ai/src/config/roleStore.ts: getRoleTemplates, getRoleState
/home/runner/work/Disa_Ai/Disa_Ai/src/config/settings.ts: setSelectedModelId, getUseRoleStyle, setUseRoleStyle, getMemoryEnabled, setMemoryEnabled, getCtxMaxTokens, setCtxMaxTokens, getCtxReservedTokens, setCtxReservedTokens, getComposerOffset, setComposerOffset, getFontSize, setFontSize, getReduceMotion, setReduceMotion, getHapticFeedback, setHapticFeedback, setDiscussionStrictMode, setDiscussionMaxSentences
/home/runner/work/Disa_Ai/Disa_Ai/src/config/terminology.ts: TERMINOLOGY, FEEDBACK_MESSAGES, TOAST_CONFIGS, BUTTON_TEXTS, ARIA_LABELS, getSuccessMessage, getErrorMessage, getWarningMessage, getInfoMessage, getLoadingMessage, getButtonText, getAriaLabel, getTerm, createToast, TerminologyKey, FeedbackMessageKey, ButtonTextKey, AriaLabelKey, ToastType
/home/runner/work/Disa_Ai/Disa_Ai/src/config/models/discussionProfile.ts: DiscussionModelProfile
/home/runner/work/Disa_Ai/Disa_Ai/src/data/conversationTemplates.ts: CONVERSATION_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, getTemplateById, searchTemplates
/home/runner/work/Disa_Ai/Disa_Ai/src/data/roles.ts: getRolesByCategory, getCategories
/home/runner/work/Disa_Ai/Disa_Ai/src/features/discussion/shape.ts: DiscussionShapeOptions, DiscussionShapeResult
/home/runner/work/Disa_Ai/Disa_Ai/src/features/prompt/gamePrompts.ts: GAME_SYSTEM_PROMPTS, GAME_START_PROMPTS, GameType, getGameSystemPrompt, getGameStartPrompt
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useChat.ts: UseChatOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useChatSession.ts: ChatMsg, ChatSession, useChatSession
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useConversations.ts: Role, ChatMessage, ConversationMeta, createConversation, getConversationMeta, getConversationMessages, appendMessage, setConversationTitle, deleteConversation, listConversations, useConversations, UseConversations
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useEdgeSwipe.ts: Edge, UseEdgeSwipeOptions, useEdgeSwipe
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useFavoritesManager.ts: useFavoriteStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useFocusTrap.ts: useFocusTrap
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useIsMobile.ts: useIsMobile
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useMediaQuery.ts: useMediaQuery
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/usePWAHandlers.ts: usePWAHandlers
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useQuickstartFlow.ts: UseQuickstartFlowOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useServiceWorker.ts: useServiceWorker
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useSwipe.ts: useSwipe
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useSwipeablePanel.ts: UseSwipeablePanelOptions, UseSwipeablePanelReturn, useSwipeablePanel
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useTranslation.ts: useTranslation
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useViewportHeight.ts: useViewportHeight
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/ab-testing.ts: UIVersion, ABTestConfig, ABTestMetrics, getABTestConfig, getUIVersion, setUIVersionOverride, logABTestEvent, getABTestMetrics, clearABTestData, getABTestStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/analytics.ts: AnalyticsEvent, AnalyticsSession, AnalyticsStats
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/clipboard.ts: CopyResult, copyToClipboard, showCopyFeedback
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/configLoader.ts: StyleItem, validateStyles, loadStyles
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/deployment-optimizations.ts: DeploymentConfig, getDeploymentConfig, preloadCriticalAssets, ServiceWorkerManager, PerformanceReporter, setupErrorReporting, CacheManager, performanceReporter, serviceWorkerManager
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/http.ts: FetchJsonOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/logger.ts: LogLevel, LogContext, logger
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/model-settings.ts: ModelSettings, ModelSettingsPreset, VALIDATION_RULES, validateModelSettings, getCurrentModelSettings, saveModelSettings, getAllPresets, saveCustomPreset, deleteCustomPreset, applyPreset, resetToDefaults, getPreset, getDefaultPreset, exportSettings, importSettings
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/nav.ts: AppTab, navigate, subscribeNav
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/performance-optimizations.ts: createLazyImport, debounce, throttle, createIntersectionObserver, getOptimizedImageUrl, preloadResource, VirtualScrollConfig, calculateVirtualScrollRange, analyzeBundleSize, createAsyncRoute, PerformanceMonitor
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/publicAsset.ts: publicAsset
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/pwa-handlers.ts: handleFiles, registerProtocolHandler
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/utils/index.ts: BackoffOptions, backoffDelay, sleep, logger, devLog, prodError, safeLog, safeWarn, safeError, safeInfo, safeDebug
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/a11y/focus.ts: focusOnMount
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/a11y/skipLink.ts: installSkipLinkFocus
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/a11y/touchTargets.ts: TOUCH_TARGET_SIZES, A11yViolation, validateTouchTarget, validateAriaAttributes, autoFixA11yViolations, scanDocumentA11y, enforceA11yStandards, createA11yObserver, FocusManager
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/a11y/useReducedMotion.ts: useReducedMotion
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/android/system.ts: AndroidFeatures, detectAndroidFeatures, setupAndroidOptimizations, showAndroidSnackbar, setupAndroidHaptics
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/chat/index.ts: ChatRequest, ChatResponse, chat, AbortError, ApiClientError, ApiError, ApiServerError, AuthenticationError, HttpError, NetworkError, NotFoundError, PermissionError, RateLimitError, TimeoutError, UnknownError, CHAT_ENDPOINT, getApiKey
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/chat/sendMessage.ts: SendOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/chat/slashCommands.ts: CommandResult, SlashCommand, COMMANDS, parseSlashCommand, executeSlashCommand
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/errors/humanError.ts: HumanError
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/gestures/mobileShortcuts.ts: MobileShortcut, GesturePattern, MobileShortcutsManager, useMobileShortcuts, getMobileShortcutsManager
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/i18n/index.ts: TranslationPath, t, de, en, Translations
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/mobile/mobileInit.ts: MobileInitOptions, MobileFeaturesManager, mobileFeatures
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/mobile/progressive-enhancement.ts: enhancementManager, useDeviceCapabilities, useFeature, isMobileDevice, isHighPerformanceDevice, shouldUseReducedMotion, default
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/navigation/swipeNavigation.ts: SwipeNavigationOptions, NavigationAction, SwipeNavigationManager, useSwipeNavigation, chatNavigationActions
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/index.ts: chatConcurrency, ConcurrencyManager, FetchWithTimeoutOptions, fetchWithTimeoutAndRetry, useOnlineStatus, TokenBucket
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/openrouter/index.ts: ChatMessage
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/perf/throttle-viewport-events.ts: installViewportEventThrottles
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/performance/mobileOptimizer.ts: MobilePerformanceMetrics, OptimizationOptions, mobilePerformance
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/performance/power-manager.ts: powerManager, shouldDisableComplexEffects, default
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/pwa/index.ts: setupPwaInstallCapture, canInstall, promptInstall, usePwaInstall, OfflineData, SyncStatus, OfflineManager, useOfflineManager, BUILD_ID, registerSW
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/pwa/installPrompt.ts: initPWAInstallPrompt, canInstallPWA, installPWA
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/quickstarts/persistence.ts: quickstartPersistence
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/settings/storage.ts: Theme, ChatStyle, AppSettings, loadSettings, saveSettings
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/sound/audio-feedback.ts: AudioOptions, SoundPattern, audioFeedback, EnhancedHapticOptions, enhancedHaptics, PremiumFeedbackSystem, premiumFeedback
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/storage/index.ts: quotaManager, useStorageQuota, formatBytes, getStorageHealthStatus, StorageValidator, safeStorageGet, safeStorageSet, safeStorageRemove, validators
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/toast/mobileToast.ts: MobileToastOptions, ToastData, MobileToastManager, useMobileToast
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/gestures.ts: TouchGestureOptions, SwipeEvent, TapEvent, ensureTouchTarget, debouncedTouch
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/haptics.ts: HapticOptions, HapticPattern, isHapticSupported, prefersReducedMotion, triggerHaptic, withHaptic, addHapticToElement
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/performance.ts: TouchPerformanceOptions, throttledRAF, PerformantTouchHandler, usePerformantTouch
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/ui/copy-bubble.ts: enhanceMessageCopy
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/ui/theme.ts: theme
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/validators/index.ts: MessageSchema, ConversationSchema, ConversationListSchema, parseConversations, safetySchema, RoleSchema, RoleListSchema, Role, parseRoles, SettingsSchema, Settings, parseSettings
/home/runner/work/Disa_Ai/Disa_Ai/src/prompts/discussion/base.ts: DiscussionPromptParameters, getDefaultDiscussionPrompt
/home/runner/work/Disa_Ai/Disa_Ai/src/services/openrouter.ts: getApiKey, setApiKey, pingOpenRouter, chatOnce, chatStream
/home/runner/work/Disa_Ai/Disa_Ai/src/state/templates.ts: TemplateCategory, TemplateMeta, TEMPLATES, getTemplateById, setActiveTemplate, getActiveTemplateId, setDefaultTemplate, getDefaultTemplateId, resolveStartTemplate
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/design-tokens.ts: DesignTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/category-colors.ts: categoryColorTokens, categoryTokensCSS, CATEGORY_KEYS
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/category-tonal-scales.ts: categoryTonalScales, categoryTonalTokensCSS, CATEGORY_KEYS, TONAL_LEVELS, TonalLevel
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/color.ts: SurfaceTokens, TextTokens, BorderTokens, BrandTokens, StatusTokenSet, StatusTokens, ActionTokens, ControlTokens, TableTokens, OverlayTokens, ColorScheme, colorCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/motion.ts: DurationTokens, EasingTokens, MotionTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/radius.ts: RadiusTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/shadow.ts: ShadowTokens, shadowCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/spacing.ts: SpacingScale, SemanticSpacing, TouchTargets, FixedSizes, SpacingTokens, spacingCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/typography.ts: FontStackTokens, TextStyle, TypographyTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/types/chat.ts: Role
/home/runner/work/Disa_Ai/Disa_Ai/src/types/chatMessage.ts: ChatMessageRole
/home/runner/work/Disa_Ai/Disa_Ai/src/types/enhanced-interfaces.ts: RoleCategory, PerformanceMetrics, SearchResult, UIState, migrateModel, isEnhancedRole, isEnhancedModel
/home/runner/work/Disa_Ai/Disa_Ai/src/types/index.ts: Role, Message, MessageRole, ChatSession
/home/runner/work/Disa_Ai/Disa_Ai/src/ui/guard.ts: onResize, fixTabbars, bootGuards
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/animationPerformance.ts: AnimationConfig, AnimationMetrics, animationMonitor, prefersReducedMotion, supportsHighRefreshRate, optimizeForAnimation, createOptimizedAnimation, debounceAnimation, throttleAnimation, DOMUpdateBatcher, domBatcher, optimizedClassToggle, isElementVisible, AnimationVisibilityObserver, animationVisibilityObserver, usePerformantAnimation, performanceCSS
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/buildMessages.ts: buildMessages
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/category-mapping.ts: CATEGORY_MAP, KEY_TO_LABEL_MAP, CATEGORY_ICONS, isValidCategoryKey, getCategoryLabel, getCategoryIcon, useCategoryData, validateCategory, CATEGORY_KEYS
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/focusChatInput.ts: CHAT_FOCUS_EVENT, CHAT_NEWSESSION_EVENT, requestChatFocus, requestNewChatSession
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/sw-manager.ts: ServiceWorkerInfo, getServiceWorkerInfo, emergencyUninstallServiceWorker, checkForServiceWorkerUpdate, activateWaitingServiceWorker, debugServiceWorker
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/tokens.ts: estimateTokens, countMessageTokens, totalTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/app/components/RouteWrapper.tsx: RouteWrapper
/home/runner/work/Disa_Ai/Disa_Ai/src/components/BottomSheetButton.tsx: BottomSheetButton
/home/runner/work/Disa_Ai/Disa_Ai/src/components/BuildInfo.tsx: useBuildInfo
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ErrorBoundary.tsx: useErrorReporting
/home/runner/work/Disa_Ai/Disa_Ai/src/components/Header.tsx: Header
/home/runner/work/Disa_Ai/Disa_Ai/src/components/NetworkBanner.tsx: default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/Tabs.tsx: Tabs
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/ChatMessage.tsx: ChatMessageType
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/StartTiles.tsx: StartTileAction
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/TokenBadge.tsx: LiveTokenCounter
/home/runner/work/Disa_Ai/Disa_Ai/src/components/feedback/ErrorState.tsx: ErrorStateProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/feedback/Loader.tsx: SkeletonProps, SpinnerProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/layout/GlobalNav.tsx: ROUTE_TITLES
/home/runner/work/Disa_Ai/Disa_Ai/src/components/studio/RoleCard.tsx: RoleCardProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/card.tsx: CardVariantProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/label.tsx: LabelProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/loading.tsx: Loading, LoadingBubble
/home/runner/work/Disa_Ai/Disa_Ai/src/contexts/FavoritesContext.tsx: useFavoriteActions, useFavoritesAnalytics, withFavorites, FavoritesLoader
/home/runner/work/Disa_Ai/Disa_Ai/src/features/settings/SettingsView.tsx: SettingsSectionKey
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useInteractionGroup.tsx: InteractionEvent, InteractionGroupState, InteractionGroupActions, InteractionGroupContextType, InteractionGroupProvider, useInteractionGroup, useCoordinatedInteraction, useResponsiveInteraction, useStateSynchronization
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useUIState.tsx: UIState, UIStateActions, UIStateDataAttributes, UseUIStateOptions, UseUIStateReturn, useUIState, withUIState, useUIStateHandlers
/home/runner/work/Disa_Ai/Disa_Ai/tests/e2e/api-mock.ts: setupChatApiMock
Running local maintenance scripts...
Building project...
Running vite build...
npm warn config production Use `--omit=dev` instead.
[BUILD] Mode: production
[BUILD] Environment variables: {
  CF_PAGES: undefined,
  CF_PAGES_URL: undefined,
  VITE_BASE_URL: undefined
}
[BUILD] Using default base: /
[BUILD] Final base path: /
[36mvite v7.1.12 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 1824 modules transformed.
[31m✗[39m Build failed in 2.50s
[31merror during build:
[31m[vite-plugin-pwa:build] [plugin vite-plugin-pwa:build] There was an error during the build:
  [vite]: Rollup failed to resolve import "react-useanimations/lib/messageCircle" from "/home/runner/work/Disa_Ai/Disa_Ai/src/components/layout/DesktopSidebar.tsx".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`build.rollupOptions.external`
Additionally, handling the error in the 'buildEnd' hook caused the following error:
  [vite]: Rollup failed to resolve import "react-useanimations/lib/messageCircle" from "/home/runner/work/Disa_Ai/Disa_Ai/src/components/layout/DesktopSidebar.tsx".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`build.rollupOptions.external`[31m
    at getRollupError (file:///home/runner/work/Disa_Ai/Disa_Ai/node_modules/rollup/dist/es/shared/parseAst.js:401:41)
    at file:///home/runner/work/Disa_Ai/Disa_Ai/node_modules/rollup/dist/es/shared/node-entry.js:23322:39
    at async catchUnfinishedHookActions (file:///home/runner/work/Disa_Ai/Disa_Ai/node_modules/rollup/dist/es/shared/node-entry.js:22780:16)
    at async rollupInternal (file:///home/runner/work/Disa_Ai/Disa_Ai/node_modules/rollup/dist/es/shared/node-entry.js:23305:5)
    at async buildEnvironment (file:///home/runner/work/Disa_Ai/Disa_Ai/node_modules/vite/dist/node/chunks/config.js:33771:12)
    at async Object.build (file:///home/runner/work/Disa_Ai/Disa_Ai/node_modules/vite/dist/node/chunks/config.js:34129:19)
    at async Object.buildApp (file:///home/runner/work/Disa_Ai/Disa_Ai/node_modules/vite/dist/node/chunks/config.js:34126:153)
    at async CAC.<anonymous> (file:///home/runner/work/Disa_Ai/Disa_Ai/node_modules/vite/dist/node/cli.js:629:3)[39m
Build completed. Preview server available on port 4173 with: npm run preview
No autopilot-summary.mjs found, using basic summary
```
