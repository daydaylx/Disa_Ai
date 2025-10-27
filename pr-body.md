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

/home/runner/work/Disa_Ai/Disa_Ai/src/components/demo/CategoryDemo.tsx
  114:39  warning  Unexpected console statement. Only these console methods are allowed: warn, error  no-console

✖ 1 problem (0 errors, 1 warning)

Running Prettier...
npm warn config production Use `--omit=dev` instead.
[90m.changeset/config.json[39m 43ms (unchanged)
[90m.changeset/README.md[39m 56ms (unchanged)
[90m.github/dependabot.yml[39m 4ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.md[39m 8ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.yml[39m 22ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.md[39m 5ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.yml[39m 23ms (unchanged)
[90m.github/NEUES_MAIN_ANALYSIS.md[39m 23ms (unchanged)
[90m.github/pull_request_template.md[39m 16ms (unchanged)
[90m.github/REQUIRED_CHECKS.md[39m 5ms (unchanged)
[90m.github/workflows/autopilot.yml[39m 9ms (unchanged)
[90m.github/workflows/bundle-monitor.yml[39m 11ms (unchanged)
[90m.github/workflows/ci.yml[39m 4ms (unchanged)
[90m.github/workflows/code-quality.yml[39m 18ms (unchanged)
[90m.github/workflows/codeql.yml[39m 8ms (unchanged)
[90m.github/workflows/codescan.yml[39m 11ms (unchanged)
[90m.github/workflows/dependency-review.yml[39m 7ms (unchanged)
[90m.github/workflows/lighthouse.yml[39m 5ms (unchanged)
[90m.github/workflows/release.yml[39m 17ms (unchanged)
[90m.grok/settings.json[39m 1ms (unchanged)
[90m.prettierrc.json[39m 2ms (unchanged)
[90m.qwen/PROJECT_SUMMARY.md[39m 20ms (unchanged)
[90m.qwen/settings.json[39m 5ms (unchanged)
[90mAUDIT_IMPACT_SUMMARY.md[39m 39ms (unchanged)
[90maudit-report.md[39m 87ms (unchanged)
[90mCATEGORY_SYSTEM.md[39m 83ms (unchanged)
[90mcloudflare-pages.json[39m 4ms (unchanged)
[90mCRITICAL_ISSUES_SUMMARY.md[39m 13ms (unchanged)
[90mDEVELOPMENT_ROADMAP.md[39m 17ms (unchanged)
[90meslint.config.mjs[39m 17ms (unchanged)
[90mEXECUTIVE_SUMMARY.md[39m 16ms (unchanged)
[90mfunctions/_middleware.ts[39m 11ms (unchanged)
[90mGLASS_PERFORMANCE_OPTIMIZATION.md[39m 49ms (unchanged)
[90mindex.html[39m 45ms (unchanged)
[90mlighthouse-report.json[39m 418ms (unchanged)
[90mlighthouse.config.cjs[39m 6ms (unchanged)
[90mlighthouserc.cjs[39m 7ms (unchanged)
[90mpackage-lock.json[39m 88ms (unchanged)
[90mpackage.json[39m 2ms (unchanged)
[90mplaywright.config.ts[39m 9ms (unchanged)
postcss.config.cjs 1ms
[90mPRIVACY.md[39m 12ms (unchanged)
[90mpublic/_routes.json[39m 1ms (unchanged)
[90mpublic/datenschutz.html[39m 26ms (unchanged)
[90mpublic/impressum.html[39m 13ms (unchanged)
[90mpublic/manifest.webmanifest[39m 6ms (unchanged)
[90mpublic/models.json[39m 8ms (unchanged)
[90mpublic/offline.html[39m 35ms (unchanged)
[90mpublic/persona.json[39m 13ms (unchanged)
[90mpublic/privacy-policy.html[39m 9ms (unchanged)
[90mpublic/quickstarts.json[39m 3ms (unchanged)
[90mpublic/styles.json[39m 11ms (unchanged)
[90mpublic/sw.js[39m 36ms (unchanged)
[90mREADME.md[39m 65ms (unchanged)
[90mrenovate.json[39m 5ms (unchanged)
[90mscripts/build-info.js[39m 8ms (unchanged)
[90mscripts/generate-routes.js[39m 2ms (unchanged)
[90mscripts/run-preview.mjs[39m 13ms (unchanged)
[90msrc/__tests__/apiKeyShim.test.ts[39m 11ms (unchanged)
[90msrc/__tests__/branding.test.tsx[39m 4ms (unchanged)
[90msrc/__tests__/colorConverters.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/designTokens.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/fetchTimeout.test.ts[39m 3ms (unchanged)
[90msrc/__tests__/humanError.test.ts[39m 7ms (unchanged)
[90msrc/__tests__/memory.test.ts[39m 8ms (unchanged)
[90msrc/__tests__/message-id-synchronization.test.ts[39m 45ms (unchanged)
[90msrc/__tests__/models-fallback.test.ts[39m 26ms (unchanged)
[90msrc/__tests__/models.cache.test.ts[39m 3ms (unchanged)
[90msrc/__tests__/networkBanner.test.tsx[39m 4ms (unchanged)
[90msrc/__tests__/openrouter.abort.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/openrouter.ndjson.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/openrouter.test.ts[39m 6ms (unchanged)
[90msrc/__tests__/sw-cache-management.test.ts[39m 16ms (unchanged)
[90msrc/__tests__/useChat.race-condition.test.ts[39m 24ms (unchanged)
[90msrc/__tests__/viewport-scroll-performance.test.ts[39m 16ms (unchanged)
[90msrc/_safelist.ts[39m 1ms (unchanged)
[90msrc/analytics/discussion.ts[39m 5ms (unchanged)
[90msrc/api/chat.ts[39m 10ms (unchanged)
[90msrc/api/memory.ts[39m 6ms (unchanged)
[90msrc/api/openrouter.ts[39m 25ms (unchanged)
[90msrc/App.tsx[39m 6ms (unchanged)
[90msrc/app/components/BrandWordmark.tsx[39m 3ms (unchanged)
[90msrc/app/layouts/MobileAppShell.tsx[39m 9ms (unchanged)
[90msrc/app/router.tsx[39m 29ms (unchanged)
[90msrc/app/state/StudioContext.tsx[39m 5ms (unchanged)
[90msrc/bootstrap/migrations.ts[39m 1ms (unchanged)
[90msrc/components/accessibility/SkipLink.tsx[39m 2ms (unchanged)
[90msrc/components/BottomSheet.tsx[39m 9ms (unchanged)
[90msrc/components/BottomSheetButton.tsx[39m 5ms (unchanged)
[90msrc/components/BottomSheetSettings.tsx[39m 49ms (unchanged)
[90msrc/components/BuildInfo.tsx[39m 8ms (unchanged)
[90msrc/components/chat/ChatComposer.tsx[39m 13ms (unchanged)
[90msrc/components/chat/ChatHistorySidebar.tsx[39m 25ms (unchanged)
[90msrc/components/chat/ChatList.tsx[39m 21ms (unchanged)
[90msrc/components/chat/ChatMessage.tsx[39m 16ms (unchanged)
[90msrc/components/chat/ConversationHistorySheet.tsx[39m 13ms (unchanged)
[90msrc/components/chat/MessageBubbleCard.tsx[39m 10ms (unchanged)
[90msrc/components/chat/MobileChatHistorySidebar.tsx[39m 21ms (unchanged)
[90msrc/components/chat/MobileChatInterface.tsx[39m 51ms (unchanged)
[90msrc/components/chat/QuickstartGrid.tsx[39m 9ms (unchanged)
[90msrc/components/chat/QuickstartTile.tsx[39m 7ms (unchanged)
[90msrc/components/chat/RoleSelector.tsx[39m 17ms (unchanged)
[90msrc/components/chat/StartTiles.tsx[39m 5ms (unchanged)
[90msrc/components/chat/TokenBadge.tsx[39m 7ms (unchanged)
[90msrc/components/chat/VirtualizedMessageList.tsx[39m 11ms (unchanged)
[90msrc/components/ChatArea.tsx[39m 3ms (unchanged)
[90msrc/components/ChatBubble.tsx[39m 3ms (unchanged)
[90msrc/components/CodeBlock.tsx[39m 5ms (unchanged)
[90msrc/components/Composer.tsx[39m 4ms (unchanged)
[90msrc/components/demo/CategoryDemo.tsx[39m 14ms (unchanged)
[90msrc/components/demo/GlassPerformanceDemo.tsx[39m 17ms (unchanged)
[90msrc/components/effects/PremiumEffects.tsx[39m 19ms (unchanged)
[90msrc/components/ErrorBoundary.tsx[39m 22ms (unchanged)
[90msrc/components/feedback/ErrorState.tsx[39m 4ms (unchanged)
[90msrc/components/feedback/Loader.tsx[39m 4ms (unchanged)
[90msrc/components/feedback/PageSkeleton.tsx[39m 2ms (unchanged)
[90msrc/components/Glass.tsx[39m 5ms (unchanged)
[90msrc/components/Header.tsx[39m 7ms (unchanged)
[90msrc/components/index.ts[39m 2ms (unchanged)
[90msrc/components/InputBar.tsx[39m 10ms (unchanged)
[90msrc/components/layout/BurgerMenu.tsx[39m 59ms (unchanged)
[90msrc/components/layout/MobileBottomNavigation.tsx[39m 4ms (unchanged)
[90msrc/components/layout/MobileHeader.tsx[39m 3ms (unchanged)
[90msrc/components/layout/MobileNavigation.tsx[39m 2ms (unchanged)
[90msrc/components/layout/MobileOnlyGate.tsx[39m 11ms (unchanged)
[90msrc/components/layout/MobileTopAppBar.tsx[39m 3ms (unchanged)
[90msrc/components/layout/ScrollToVoid.tsx[39m 4ms (unchanged)
[90msrc/components/memory/MemoryPanel.tsx[39m 13ms (unchanged)
[90msrc/components/ModelPicker.tsx[39m 67ms (unchanged)
[90msrc/components/models/MobileModelsInterface.tsx[39m 32ms (unchanged)
[90msrc/components/nav/AdvancedSettingsModal.tsx[39m 53ms (unchanged)
[90msrc/components/nav/SettingsFAB.tsx[39m 2ms (unchanged)
[90msrc/components/nav/TopMenuButton.tsx[39m 2ms (unchanged)
[90msrc/components/nav/TopMenuDropdown.tsx[39m 23ms (unchanged)
[90msrc/components/navigation/ThemeToggle.tsx[39m 3ms (unchanged)
[90msrc/components/NetworkBanner.tsx[39m 3ms (unchanged)
[90msrc/components/primitives/Card.tsx[39m 1ms (unchanged)
[90msrc/components/pwa/PWADebugInfo.tsx[39m 8ms (unchanged)
[90msrc/components/pwa/PWAInstallPrompt.tsx[39m 4ms (unchanged)
[90msrc/components/PWAIntegration.tsx[39m 5ms (unchanged)
[90msrc/components/RouteLoadingFallback.tsx[39m 1ms (unchanged)
[90msrc/components/Settings.tsx[39m 6ms (unchanged)
[90msrc/components/shell/AppShell.tsx[39m 2ms (unchanged)
[90msrc/components/shell/MainContent.tsx[39m 1ms (unchanged)
[90msrc/components/SidePanel.tsx[39m 7ms (unchanged)
[90msrc/components/status/OrbStatus.tsx[39m 2ms (unchanged)
[90msrc/components/studio/MobileRolesInterface.tsx[39m 23ms (unchanged)
[90msrc/components/studio/RoleCard.tsx[39m 11ms (unchanged)
[90msrc/components/Tabs.tsx[39m 4ms (unchanged)
[90msrc/components/templates/TemplateCard.tsx[39m 7ms (unchanged)
[90msrc/components/toast/ToastProvider.tsx[39m 3ms (unchanged)
[90msrc/components/TypingIndicator.tsx[39m 2ms (unchanged)
[90msrc/components/ui/Accordion.tsx[39m 9ms (unchanged)
[90msrc/components/ui/avatar.tsx[39m 7ms (unchanged)
[90msrc/components/ui/badge.tsx[39m 3ms (unchanged)
[90msrc/components/ui/bottom-sheet.tsx[39m 6ms (unchanged)
[90msrc/components/ui/BottomSheet.tsx[39m 6ms (unchanged)
[90msrc/components/ui/button.tsx[39m 3ms (unchanged)
[90msrc/components/ui/card-system.md[39m 35ms (unchanged)
[90msrc/components/ui/card-types.ts[39m 14ms (unchanged)
[90msrc/components/ui/card.tsx[39m 18ms (unchanged)
[90msrc/components/ui/chip.tsx[39m 16ms (unchanged)
[90msrc/components/ui/chip/README.md[39m 36ms (unchanged)
[90msrc/components/ui/CommandPalette.tsx[39m 19ms (unchanged)
[90msrc/components/ui/CopyButton.tsx[39m 9ms (unchanged)
[90msrc/components/ui/dialog.tsx[39m 6ms (unchanged)
[90msrc/components/ui/DiscussionTopicCard.tsx[39m 12ms (unchanged)
[90msrc/components/ui/drawer/Drawer.css[39m 7ms (unchanged)
[90msrc/components/ui/drawer/Drawer.tsx[39m 11ms (unchanged)
[90msrc/components/ui/drawer/index.ts[39m 1ms (unchanged)
[90msrc/components/ui/dropdown-menu.tsx[39m 12ms (unchanged)
[90msrc/components/ui/HeroOrb.tsx[39m 2ms (unchanged)
[90msrc/components/ui/HolographicOrb.tsx[39m 2ms (unchanged)
[90msrc/components/ui/Icon.tsx[39m 4ms (unchanged)
[90msrc/components/ui/index.ts[39m 3ms (unchanged)
[90msrc/components/ui/input.tsx[39m 2ms (unchanged)
[90msrc/components/ui/InteractiveCard.tsx[39m 15ms (unchanged)
[90msrc/components/ui/label.tsx[39m 2ms (unchanged)
[90msrc/components/ui/LazyImage.tsx[39m 11ms (unchanged)
[90msrc/components/ui/loading.tsx[39m 7ms (unchanged)
[90msrc/components/ui/MessageBubble.tsx[39m 2ms (unchanged)
[90msrc/components/ui/modal/index.ts[39m 1ms (unchanged)
[90msrc/components/ui/modal/Modal.css[39m 4ms (unchanged)
[90msrc/components/ui/modal/Modal.tsx[39m 5ms (unchanged)
[90msrc/components/ui/modal/ModalContext.tsx[39m 5ms (unchanged)
[90msrc/components/ui/modal/TestModal.tsx[39m 2ms (unchanged)
src/components/ui/ModelCard.tsx 13ms
[90msrc/components/ui/select.tsx[39m 10ms (unchanged)
[90msrc/components/ui/separator.tsx[39m 2ms (unchanged)
[90msrc/components/ui/Skeleton.tsx[39m 8ms (unchanged)
[90msrc/components/ui/StaticSurfaceSection.tsx[39m 2ms (unchanged)
[90msrc/components/ui/StatusCard.tsx[39m 8ms (unchanged)
[90msrc/components/ui/Switch.tsx[39m 4ms (unchanged)
[90msrc/components/ui/table.tsx[39m 7ms (unchanged)
[90msrc/components/ui/tabs.tsx[39m 3ms (unchanged)
[90msrc/components/ui/textarea.tsx[39m 2ms (unchanged)
[90msrc/components/ui/Toast.tsx[39m 1ms (unchanged)
[90msrc/components/ui/toast/ToastsProvider.tsx[39m 4ms (unchanged)
[90msrc/components/ui/toast/ToastTypes.ts[39m 1ms (unchanged)
[90msrc/components/ui/tooltip.tsx[39m 2ms (unchanged)
[90msrc/components/ui/VirtualList.tsx[39m 11ms (unchanged)
[90msrc/config/defaults.ts[39m 4ms (unchanged)
[90msrc/config/env.ts[39m 10ms (unchanged)
[90msrc/config/featureFlags.ts[39m 3ms (unchanged)
[90msrc/config/features.ts[39m 2ms (unchanged)
[90msrc/config/models.ts[39m 24ms (unchanged)
[90msrc/config/models/discussionProfile.ts[39m 1ms (unchanged)
[90msrc/config/personas.ts[39m 9ms (unchanged)
[90msrc/config/promptStyles.ts[39m 2ms (unchanged)
[90msrc/config/promptTemplates.ts[39m 1ms (unchanged)
[90msrc/config/quickstarts.test.ts[39m 17ms (unchanged)
[90msrc/config/quickstarts.ts[39m 9ms (unchanged)
[90msrc/config/rolePolicy.ts[39m 2ms (unchanged)
[90msrc/config/roleStore.ts[39m 14ms (unchanged)
[90msrc/config/settings.ts[39m 17ms (unchanged)
[90msrc/config/styleEngine.ts[39m 2ms (unchanged)
[90msrc/config/styleModelRules.ts[39m 1ms (unchanged)
[90msrc/config/terminology.ts[39m 7ms (unchanged)
[90msrc/data/conversationTemplates.ts[39m 7ms (unchanged)
[90msrc/data/models.ts[39m 9ms (unchanged)
[90msrc/data/roleIds.ts[39m 2ms (unchanged)
[90msrc/data/roles.ts[39m 21ms (unchanged)
[90msrc/data/threads.ts[39m 16ms (unchanged)
[90msrc/features/discussion/__tests__/shape.test.ts[39m 4ms (unchanged)
[90msrc/features/discussion/shape.ts[39m 11ms (unchanged)
[90msrc/features/prompt/composeSystemPrompt.ts[39m 4ms (unchanged)
[90msrc/features/prompt/gamePrompts.ts[39m 3ms (unchanged)
[90msrc/hooks/__tests__/useChat.systemPrompt.test.ts[39m 10ms (unchanged)
[90msrc/hooks/useChat.ts[39m 27ms (unchanged)
[90msrc/hooks/useChatSession.ts[39m 11ms (unchanged)
[90msrc/hooks/useConversationManager.ts[39m 9ms (unchanged)
[90msrc/hooks/useConversations.ts[39m 13ms (unchanged)
[90msrc/hooks/useDiscussion.ts[39m 17ms (unchanged)
[90msrc/hooks/useEdgeSwipe.ts[39m 14ms (unchanged)
[90msrc/hooks/useFocusTrap.ts[39m 3ms (unchanged)
[90msrc/hooks/useIsMobile.ts[39m 2ms (unchanged)
[90msrc/hooks/useMediaQuery.ts[39m 3ms (unchanged)
[90msrc/hooks/useMemory.ts[39m 6ms (unchanged)
[90msrc/hooks/useOfflineMode.ts[39m 10ms (unchanged)
[90msrc/hooks/usePWAHandlers.ts[39m 16ms (unchanged)
[90msrc/hooks/usePWAInstall.ts[39m 4ms (unchanged)
[90msrc/hooks/useQuickstartFlow.ts[39m 3ms (unchanged)
[90msrc/hooks/useQuickstartManager.ts[39m 8ms (unchanged)
[90msrc/hooks/useServiceWorker.ts[39m 3ms (unchanged)
[90msrc/hooks/useSettings.ts[39m 4ms (unchanged)
[90msrc/hooks/useStickToBottom.ts[39m 7ms (unchanged)
[90msrc/hooks/useSwipe.ts[39m 6ms (unchanged)
[90msrc/hooks/useSwipeablePanel.ts[39m 10ms (unchanged)
[90msrc/hooks/useTheme.ts[39m 2ms (unchanged)
[90msrc/hooks/useThreads.ts[39m 7ms (unchanged)
[90msrc/hooks/useTranslation.ts[39m 5ms (unchanged)
[90msrc/hooks/useViewportHeight.ts[39m 4ms (unchanged)
[90msrc/hooks/useVisualViewport.ts[39m 4ms (unchanged)
[90msrc/index.css[39m 56ms (unchanged)
[90msrc/lib/a11y/focus.ts[39m 3ms (unchanged)
[90msrc/lib/a11y/skipLink.ts[39m 4ms (unchanged)
[90msrc/lib/a11y/touchTargets.ts[39m 22ms (unchanged)
[90msrc/lib/a11y/useReducedMotion.ts[39m 2ms (unchanged)
[90msrc/lib/ab-testing.ts[39m 14ms (unchanged)
[90msrc/lib/analytics.ts[39m 19ms (unchanged)
[90msrc/lib/analytics/analytics.test.ts[39m 19ms (unchanged)
[90msrc/lib/analytics/index.ts[39m 13ms (unchanged)
[90msrc/lib/android/system.ts[39m 22ms (unchanged)
[90msrc/lib/chat/client.ts[39m 3ms (unchanged)
[90msrc/lib/chat/config.ts[39m 1ms (unchanged)
[90msrc/lib/chat/index.ts[39m 1ms (unchanged)
[90msrc/lib/chat/sendMessage.ts[39m 6ms (unchanged)
[90msrc/lib/chat/slashCommands.ts[39m 23ms (unchanged)
[90msrc/lib/clipboard.ts[39m 3ms (unchanged)
[90msrc/lib/cn.ts[39m 1ms (unchanged)
[90msrc/lib/configLoader.ts[39m 8ms (unchanged)
[90msrc/lib/conversation-manager.ts[39m 4ms (unchanged)
[90msrc/lib/conversation-utils.ts[39m 8ms (unchanged)
[90msrc/lib/deployment-optimizations.ts[39m 26ms (unchanged)
[90msrc/lib/errors/__tests__/mapper.test.ts[39m 12ms (unchanged)
[90msrc/lib/errors/humanError.ts[39m 5ms (unchanged)
[90msrc/lib/errors/index.ts[39m 1ms (unchanged)
[90msrc/lib/errors/mapper.ts[39m 6ms (unchanged)
[90msrc/lib/errors/types.ts[39m 11ms (unchanged)
[90msrc/lib/errorText.ts[39m 2ms (unchanged)
[90msrc/lib/formatRelativeTime.ts[39m 4ms (unchanged)
[90msrc/lib/gestures/mobileShortcuts.ts[39m 23ms (unchanged)
[90msrc/lib/http.ts[39m 11ms (unchanged)
[90msrc/lib/i18n/index.ts[39m 9ms (unchanged)
[90msrc/lib/i18n/locales/de.ts[39m 6ms (unchanged)
[90msrc/lib/i18n/locales/en.ts[39m 4ms (unchanged)
[90msrc/lib/logger.ts[39m 10ms (unchanged)
[90msrc/lib/memory/memoryService.ts[39m 3ms (unchanged)
[90msrc/lib/mobile-testing-plan.md[39m 35ms (unchanged)
[90msrc/lib/mobile/mobileInit.ts[39m 20ms (unchanged)
[90msrc/lib/mobile/progressive-enhancement.ts[39m 23ms (unchanged)
[90msrc/lib/model-settings.ts[39m 20ms (unchanged)
[90msrc/lib/nav.ts[39m 2ms (unchanged)
[90msrc/lib/navigation/swipeNavigation.ts[39m 22ms (unchanged)
[90msrc/lib/net/concurrency.ts[39m 5ms (unchanged)
[90msrc/lib/net/fetchTimeout.ts[39m 8ms (unchanged)
[90msrc/lib/net/index.ts[39m 1ms (unchanged)
[90msrc/lib/net/online.ts[39m 2ms (unchanged)
[90msrc/lib/net/rateLimit.ts[39m 3ms (unchanged)
[90msrc/lib/net/retry.ts[39m 9ms (unchanged)
[90msrc/lib/offline-storage.ts[39m 24ms (unchanged)
[90msrc/lib/openrouter/__tests__/key.test.ts[39m 4ms (unchanged)
[90msrc/lib/openrouter/__tests__/keyLifecycle.test.ts[39m 12ms (unchanged)
[90msrc/lib/openrouter/index.ts[39m 1ms (unchanged)
[90msrc/lib/openrouter/key.ts[39m 7ms (unchanged)
[90msrc/lib/perf/throttle-viewport-events.ts[39m 4ms (unchanged)
[90msrc/lib/performance-optimizations.ts[39m 12ms (unchanged)
[90msrc/lib/performance/mobileOptimizer.ts[39m 22ms (unchanged)
[90msrc/lib/performance/power-manager.ts[39m 15ms (unchanged)
[90msrc/lib/publicAsset.ts[39m 3ms (unchanged)
[90msrc/lib/pwa-handlers.ts[39m 16ms (unchanged)
[90msrc/lib/pwa/index.ts[39m 1ms (unchanged)
[90msrc/lib/pwa/install.ts[39m 5ms (unchanged)
[90msrc/lib/pwa/installPrompt.ts[39m 5ms (unchanged)
[90msrc/lib/pwa/offlineManager.ts[39m 30ms (unchanged)
[90msrc/lib/pwa/registerSW.ts[39m 1ms (unchanged)
[90msrc/lib/quickstarts/persistence.ts[39m 6ms (unchanged)
[90msrc/lib/settings/storage.ts[39m 4ms (unchanged)
[90msrc/lib/sound/audio-feedback.ts[39m 18ms (unchanged)
[90msrc/lib/storage/index.ts[39m 1ms (unchanged)
[90msrc/lib/storage/quota-manager.ts[39m 19ms (unchanged)
[90msrc/lib/storage/validators.ts[39m 5ms (unchanged)
[90msrc/lib/toast/mobileToast.ts[39m 15ms (unchanged)
[90msrc/lib/touch/__tests__/gestures.test.ts[39m 19ms (unchanged)
[90msrc/lib/touch/__tests__/haptics.test.ts[39m 17ms (unchanged)
[90msrc/lib/touch/gestures.ts[39m 16ms (unchanged)
[90msrc/lib/touch/haptics.ts[39m 12ms (unchanged)
[90msrc/lib/touch/performance.ts[39m 19ms (unchanged)
[90msrc/lib/ui/copy-bubble.ts[39m 8ms (unchanged)
[90msrc/lib/ui/theme.ts[39m 1ms (unchanged)
[90msrc/lib/utils.ts[39m 1ms (unchanged)
[90msrc/lib/utils/backoff.ts[39m 3ms (unchanged)
[90msrc/lib/utils/index.ts[39m 1ms (unchanged)
[90msrc/lib/utils/production-logger.ts[39m 8ms (unchanged)
[90msrc/lib/utils/reload-manager.ts[39m 1ms (unchanged)
[90msrc/lib/validators/conversations.ts[39m 2ms (unchanged)
[90msrc/lib/validators/index.ts[39m 1ms (unchanged)
[90msrc/lib/validators/roles.ts[39m 2ms (unchanged)
[90msrc/lib/validators/settings.ts[39m 2ms (unchanged)
[90msrc/main.tsx[39m 3ms (unchanged)
[90msrc/pages/Chat.tsx[39m 23ms (unchanged)
[90msrc/pages/MobileModels.tsx[39m 1ms (unchanged)
[90msrc/pages/MobileStudio.tsx[39m 22ms (unchanged)
[90msrc/prompts/discussion/base.ts[39m 3ms (unchanged)
[90msrc/prompts/discussion/presets.ts[39m 2ms (unchanged)
[90msrc/services/openrouter.ts[39m 7ms (unchanged)
[90msrc/state/templates.ts[39m 4ms (unchanged)
[90msrc/styles/a11y-improvements.css[39m 7ms (unchanged)
[90msrc/styles/bottomsheet.css[39m 4ms (unchanged)
[90msrc/styles/category-tonal-scales.css[39m 46ms (unchanged)
[90msrc/styles/chat-mobile.css[39m 21ms (unchanged)
[90msrc/styles/design-tokens.css[39m 72ms (unchanged)
[90msrc/styles/design-tokens.ts[39m 4ms (unchanged)
[90msrc/styles/layers.css[39m 1ms (unchanged)
[90msrc/styles/mobile-design-tokens.css[39m 62ms (unchanged)
[90msrc/styles/mobile-enhanced.css[39m 23ms (unchanged)
[90msrc/styles/mobile-fixes.css[39m 50ms (unchanged)
[90msrc/styles/mobile-layout.css[39m 61ms (unchanged)
[90msrc/styles/mobile-navigation-performance.css[39m 11ms (unchanged)
[90msrc/styles/overlay-tokens.css[39m 4ms (unchanged)
[90msrc/styles/performance-glass-system.css[39m 9ms (unchanged)
[90msrc/styles/responsive-layout.css[39m 14ms (unchanged)
[90msrc/styles/theme.ts[39m 7ms (unchanged)
[90msrc/styles/tokens/category-colors.ts[39m 8ms (unchanged)
[90msrc/styles/tokens/category-tonal-scales.ts[39m 27ms (unchanged)
[90msrc/styles/tokens/color.ts[39m 17ms (unchanged)
[90msrc/styles/tokens/motion.ts[39m 3ms (unchanged)
[90msrc/styles/tokens/radius.ts[39m 4ms (unchanged)
[90msrc/styles/tokens/shadow.ts[39m 5ms (unchanged)
[90msrc/styles/tokens/spacing.ts[39m 7ms (unchanged)
[90msrc/styles/tokens/typography.ts[39m 14ms (unchanged)
[90msrc/styles/typography.css[39m 5ms (unchanged)
[90msrc/test/setup.ts[39m 2ms (unchanged)
[90msrc/test/testServer.ts[39m 1ms (unchanged)
[90msrc/types/chat.ts[39m 1ms (unchanged)
[90msrc/types/chatMessage.ts[39m 1ms (unchanged)
[90msrc/types/index.ts[39m 2ms (unchanged)
[90msrc/ui/AppShell/ChatMain.tsx[39m 2ms (unchanged)
[90msrc/ui/AppShell/SidebarLeft.tsx[39m 1ms (unchanged)
[90msrc/ui/base.css[39m 4ms (unchanged)
[90msrc/ui/chat/CodeBlock.tsx[39m 2ms (unchanged)
[90msrc/ui/chat/MessageActions.tsx[39m 4ms (unchanged)
[90msrc/ui/chat/messageHandlers.ts[39m 1ms (unchanged)
[90msrc/ui/chat/MessageItem.tsx[39m 10ms (unchanged)
[90msrc/ui/chat/types.ts[39m 1ms (unchanged)
[90msrc/ui/chat/TypingIndicator.tsx[39m 1ms (unchanged)
[90msrc/ui/components/ModelPicker.tsx[39m 11ms (unchanged)
[90msrc/ui/globals.ts[39m 4ms (unchanged)
[90msrc/ui/guard.ts[39m 3ms (unchanged)
[90msrc/ui/types.ts[39m 1ms (unchanged)
[90msrc/ui/viewport.ts[39m 2ms (unchanged)
[90msrc/utils/buildMessages.ts[39m 3ms (unchanged)
[90msrc/utils/category-mapping.ts[39m 6ms (unchanged)
[90msrc/utils/colorConverters.ts[39m 4ms (unchanged)
[90msrc/utils/focusChatInput.ts[39m 1ms (unchanged)
[90msrc/utils/id.ts[39m 2ms (unchanged)
[90msrc/utils/sw-manager.ts[39m 13ms (unchanged)
[90msrc/utils/tokens.ts[39m 2ms (unchanged)
[90msrc/vitest-env.d.ts[39m 1ms (unchanged)
[90mtailwind.config.ts[39m 8ms (unchanged)
[90mtests/browser-setup.ts[39m 6ms (unchanged)
[90mtests/e2e/api-mock.ts[39m 5ms (unchanged)
[90mtests/e2e/helpers/app-helpers.ts[39m 13ms (unchanged)
[90mtests/e2e/roles.spec.ts[39m 4ms (unchanged)
[90mtests/e2e/smoke.spec.ts[39m 5ms (unchanged)
[90mtests/navigation/burgerMenu.test.tsx[39m 3ms (unchanged)
[90mtests/polyfills.ts[39m 5ms (unchanged)
[90mtests/setup.ts[39m 3ms (unchanged)
[90mtests/setup/fetch.ts[39m 3ms (unchanged)
[90mtests/smoke/settings.smoke.test.tsx[39m 8ms (unchanged)
[90mtests/smoke/ui.smoke.test.tsx[39m 3ms (unchanged)
[90mtests/unit/composeSystemPrompt.test.ts[39m 2ms (unchanged)
[90mtests/unit/copyButton.test.tsx[39m 5ms (unchanged)
[90mtests/unit/ErrorBoundary.test.tsx[39m 8ms (unchanged)
[90mtests/unit/rateLimit.test.ts[39m 2ms (unchanged)
[90mtests/unit/retry.test.ts[39m 5ms (unchanged)
[90mtests/unit/useChat.test.tsx[39m 6ms (unchanged)
[90mtiefenanalyse.md[39m 42ms (unchanged)
[90mtools/check-css-hex.mjs[39m 7ms (unchanged)
[90mtsconfig.base.json[39m 2ms (unchanged)
[90mtsconfig.build.json[39m 1ms (unchanged)
[90mtsconfig.json[39m 1ms (unchanged)
[90mtsconfig.node.json[39m 1ms (unchanged)
[90mtsconfig.test.json[39m 1ms (unchanged)
[90mvite-env.d.ts[39m 2ms (unchanged)
[90mvite.config.ts[39m 9ms (unchanged)
[90mvitest.config.ts[39m 2ms (unchanged)
[90mvitest.shims.d.ts[39m 0ms (unchanged)
Checking for unused imports...
npm warn config production Use `--omit=dev` instead.
npm warn exec The following package was not found and will be installed: ts-unused-exports@11.0.1
166 modules with unused exports
/home/runner/work/Disa_Ai/Disa_Ai/src/_safelist.ts: TAILWIND_SAFELIST
/home/runner/work/Disa_Ai/Disa_Ai/src/analytics/discussion.ts: DiscussionAnalyticsRecord, getDiscussionAnalytics, exportDiscussionAnalytics
/home/runner/work/Disa_Ai/Disa_Ai/src/api/chat.ts: ChatRequest, createChatAPI
/home/runner/work/Disa_Ai/Disa_Ai/src/components/index.ts: Button, Input, Textarea, Badge, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Tabs, TabsContent, TabsList, TabsTrigger, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/card-types.ts: BaseCardProps, ExtendedCardProps, StatusType, StatusCardProps, DiscussionCategory, DiscussionTopicCardProps, AdvancedInteractiveCardProps, MenuItem, CardGridProps, InteractionType, IntentType, StateType, ToneType, ElevationType, PaddingType, SizeType, CardVariantCombination, CardEventHandler, CardKeyboardEventHandler, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardContentProps, CardFooterProps, ConditionalCardProps, STATUS_TYPES, DISCUSSION_CATEGORIES, INTERACTION_TYPES, INTENT_TYPES, STATE_TYPES
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/index.ts: CardProps, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ModelCardProps, ModelCard, CardVariantProps, ConversationCardProps, ModelCardTypeProps, CardUtils, Avatar, AvatarFallback, AvatarImage, BadgeProps, Badge, badgeVariants, ButtonProps, ChipProps, Chip, chipVariants, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, InputProps, Input, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, StaticSurfaceSection, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, TextareaProps, Textarea, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, DiscussionTopicCard, DiscussionTopicCardSkeleton, DiscussionTopicGridProps, DiscussionTopicGrid, InteractiveCard, ConversationCard, StatusCard, LoadingCard, SuccessCard, ErrorCard, WarningCard, InfoCard
/home/runner/work/Disa_Ai/Disa_Ai/src/config/defaults.ts: API_CONFIG, STORAGE_KEYS, REQUEST_CONFIG, APP_CONFIG, getAllowedApiKeyNames, getPrimaryApiKeyName
/home/runner/work/Disa_Ai/Disa_Ai/src/config/env.ts: EnvConfig, getEnvironmentWarnings
/home/runner/work/Disa_Ai/Disa_Ai/src/config/featureFlags.ts: getPreferRolePolicy, setPreferRolePolicy, getVirtualListEnabled, setVirtualListEnabled
/home/runner/work/Disa_Ai/Disa_Ai/src/config/features.ts: features
/home/runner/work/Disa_Ai/Disa_Ai/src/config/models.ts: ModelSafety, Price, CatalogOptions, chooseDefaultModel, labelForModel
/home/runner/work/Disa_Ai/Disa_Ai/src/config/personas.ts: Persona, PersonaCategory, PERSONA_CATEGORIES, getAllPersonas, getPersonaById, getDefaultPersona, getPersonasByCategory
/home/runner/work/Disa_Ai/Disa_Ai/src/config/promptStyles.ts: buildSystemPrompt, StyleKey
/home/runner/work/Disa_Ai/Disa_Ai/src/config/promptTemplates.ts: RoleTemplate, fetchRoleTemplates, getRoleLoadStatus, listRoleTemplates
/home/runner/work/Disa_Ai/Disa_Ai/src/config/rolePolicy.ts: recommendedPolicyForRole
/home/runner/work/Disa_Ai/Disa_Ai/src/config/roleStore.ts: getRoleTemplates, getRoleState
/home/runner/work/Disa_Ai/Disa_Ai/src/config/settings.ts: setSelectedModelId, getUseRoleStyle, setUseRoleStyle, getMemoryEnabled, setMemoryEnabled, getCtxMaxTokens, setCtxMaxTokens, getCtxReservedTokens, setCtxReservedTokens, getComposerOffset, setComposerOffset, getFontSize, setFontSize, getReduceMotion, setReduceMotion, getHapticFeedback, setHapticFeedback, setDiscussionStrictMode, setDiscussionMaxSentences
/home/runner/work/Disa_Ai/Disa_Ai/src/config/styleEngine.ts: generateRoleStyleText
/home/runner/work/Disa_Ai/Disa_Ai/src/config/terminology.ts: TERMINOLOGY, FEEDBACK_MESSAGES, TOAST_CONFIGS, BUTTON_TEXTS, ARIA_LABELS, getSuccessMessage, getErrorMessage, getWarningMessage, getInfoMessage, getLoadingMessage, getButtonText, getAriaLabel, getTerm, createToast, TerminologyKey, FeedbackMessageKey, ButtonTextKey, AriaLabelKey, ToastType
/home/runner/work/Disa_Ai/Disa_Ai/src/config/models/discussionProfile.ts: DiscussionModelProfile
/home/runner/work/Disa_Ai/Disa_Ai/src/data/conversationTemplates.ts: CONVERSATION_TEMPLATES, TEMPLATE_CATEGORIES, getTemplatesByCategory, getTemplateById, searchTemplates
/home/runner/work/Disa_Ai/Disa_Ai/src/data/models.ts: getModelsByTag, getRecommendedModels, getBudgetModels, getPremiumModels, calculateCost
/home/runner/work/Disa_Ai/Disa_Ai/src/data/roles.ts: defaultRoles, getRolesByCategory, getCategories
/home/runner/work/Disa_Ai/Disa_Ai/src/features/discussion/shape.ts: DiscussionShapeOptions, DiscussionShapeResult
/home/runner/work/Disa_Ai/Disa_Ai/src/features/prompt/composeSystemPrompt.ts: composeSystemPrompt
/home/runner/work/Disa_Ai/Disa_Ai/src/features/prompt/gamePrompts.ts: GAME_START_PROMPTS
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useChat.ts: UseChatOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useChatSession.ts: ChatMsg, ChatSession, useChatSession
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useConversations.ts: Role, ChatMessage, ConversationMeta, createConversation, getConversationMeta, getConversationMessages, appendMessage, setConversationTitle, deleteConversation, listConversations, useConversations, UseConversations
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useEdgeSwipe.ts: Edge, UseEdgeSwipeOptions, useEdgeSwipe
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useMediaQuery.ts: useMediaQuery
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useOfflineMode.ts: useOfflineMode
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useQuickstartFlow.ts: UseQuickstartFlowOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useQuickstartManager.ts: useQuickstartManager
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useServiceWorker.ts: useServiceWorker
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useSwipeablePanel.ts: UseSwipeablePanelOptions, UseSwipeablePanelReturn
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useThreads.ts: useThreads
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useViewportHeight.ts: useViewportHeight
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/ab-testing.ts: UIVersion, ABTestConfig, ABTestMetrics, getABTestConfig, getUIVersion, setUIVersionOverride, logABTestEvent, getABTestMetrics, clearABTestData, getABTestStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/analytics/index.ts: QuickstartClickedEvent, QuickstartCompletedEvent, SupportedEvent
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/clipboard.ts: CopyResult
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/configLoader.ts: StyleItem, validateStyles, loadStyles
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/deployment-optimizations.ts: DeploymentConfig, getDeploymentConfig, preloadCriticalAssets, ServiceWorkerManager, PerformanceReporter, setupErrorReporting, CacheManager, performanceReporter, serviceWorkerManager
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/errorText.ts: humanError
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/http.ts: HttpError, FetchJsonOptions, fetchJson
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/logger.ts: LogLevel, LogContext, logger
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/model-settings.ts: ModelSettings, ModelSettingsPreset, VALIDATION_RULES, validateModelSettings, getCurrentModelSettings, saveModelSettings, getAllPresets, saveCustomPreset, deleteCustomPreset, applyPreset, resetToDefaults, getPreset, getDefaultPreset, exportSettings, importSettings
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/nav.ts: AppTab, navigate, subscribeNav
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/offline-storage.ts: OfflineMessage, OfflineQueue, getOfflineMessages, saveDraft, getOfflineQueue, clearOfflineData, exportOfflineData, importOfflineData, cleanupAutoSaveTimers
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
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/index.ts: chatConcurrency, ConcurrencyManager, FetchWithTimeoutOptions, fetchWithTimeout, fetchWithTimeoutAndRetry, useOnlineStatus, TokenBucket, RetryOptions, fetchWithRetry
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/openrouter/index.ts: ChatMessage
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/perf/throttle-viewport-events.ts: installViewportEventThrottles
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/performance/mobileOptimizer.ts: MobilePerformanceMetrics, OptimizationOptions, mobilePerformance
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/performance/power-manager.ts: powerManager, shouldDisableComplexEffects, default
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/pwa/index.ts: setupPwaInstallCapture, canInstall, promptInstall, usePwaInstall, OfflineData, SyncStatus, OfflineManager, useOfflineManager, BUILD_ID, registerSW
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/pwa/installPrompt.ts: initPWAInstallPrompt, canInstallPWA, installPWA
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/settings/storage.ts: Theme, ChatStyle, AppSettings, loadSettings, saveSettings
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/sound/audio-feedback.ts: AudioOptions, SoundPattern, audioFeedback, EnhancedHapticOptions, enhancedHaptics, PremiumFeedbackSystem, premiumFeedback
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/storage/index.ts: quotaManager, useStorageQuota, formatBytes, getStorageHealthStatus, StorageValidator, safeStorageGet, safeStorageSet, safeStorageRemove, validators
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/toast/mobileToast.ts: MobileToastOptions, ToastData, MobileToastManager, useMobileToast
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/gestures.ts: TouchGestureOptions, SwipeEvent, TapEvent, ensureTouchTarget, debouncedTouch
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/haptics.ts: HapticOptions, HapticPattern, isHapticSupported, prefersReducedMotion, triggerHaptic, withHaptic, addHapticToElement
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/performance.ts: TouchPerformanceOptions, throttledRAF, PerformantTouchHandler, usePerformantTouch
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/ui/copy-bubble.ts: enhanceMessageCopy
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/ui/theme.ts: theme
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/validators/index.ts: MessageSchema, ConversationSchema, ConversationListSchema, parseConversations, RoleSchema, RoleListSchema, Role, parseRoles, SettingsSchema, Settings, parseSettings
/home/runner/work/Disa_Ai/Disa_Ai/src/prompts/discussion/base.ts: DiscussionPromptParameters, getDefaultDiscussionPrompt
/home/runner/work/Disa_Ai/Disa_Ai/src/services/openrouter.ts: setApiKey, pingOpenRouter, chatOnce, chatStream
/home/runner/work/Disa_Ai/Disa_Ai/src/state/templates.ts: TemplateCategory, TemplateMeta, TEMPLATES, getTemplateById, setActiveTemplate, getActiveTemplateId, setDefaultTemplate, getDefaultTemplateId, resolveStartTemplate
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/design-tokens.ts: DesignTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/category-colors.ts: categoryColorTokens, categoryTokensCSS, CATEGORY_KEYS
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/category-tonal-scales.ts: categoryTonalScales, categoryTonalTokensCSS, CATEGORY_KEYS, TONAL_LEVELS, TonalLevel
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/color.ts: SurfaceTokens, TextTokens, BorderTokens, BrandTokens, StatusTokenSet, StatusTokens, ActionTokens, ControlTokens, TableTokens, OverlayTokens, ColorScheme, ColorTokens, additionalColorTokens, additionalColorCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/motion.ts: DurationTokens, EasingTokens, MotionTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/radius.ts: RadiusTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/shadow.ts: ShadowTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/spacing.ts: SpacingScale, SemanticSpacing, TouchTargets, FixedSizes, SpacingTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/typography.ts: FontStackTokens, TextStyle, TypographyTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/types/chat.ts: Role
/home/runner/work/Disa_Ai/Disa_Ai/src/types/chatMessage.ts: ChatMessageRole
/home/runner/work/Disa_Ai/Disa_Ai/src/types/index.ts: Role, Message, MessageRole, ChatSession
/home/runner/work/Disa_Ai/Disa_Ai/src/ui/guard.ts: onResize, fixTabbars, bootGuards
/home/runner/work/Disa_Ai/Disa_Ai/src/ui/types.ts: Role, Model
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/buildMessages.ts: buildMessages
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/category-mapping.ts: CATEGORY_MAP, KEY_TO_LABEL_MAP, CATEGORY_ICONS, isValidCategoryKey, getCategoryLabel, getCategoryIcon, useCategoryData, validateCategory
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/focusChatInput.ts: CHAT_FOCUS_EVENT, CHAT_NEWSESSION_EVENT, requestChatFocus, requestNewChatSession
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/sw-manager.ts: ServiceWorkerInfo, getServiceWorkerInfo, emergencyUninstallServiceWorker, checkForServiceWorkerUpdate, activateWaitingServiceWorker, debugServiceWorker
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/tokens.ts: estimateTokens, countMessageTokens, totalTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/components/BuildInfo.tsx: useBuildInfo
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ChatArea.tsx: ChatArea
/home/runner/work/Disa_Ai/Disa_Ai/src/components/CodeBlock.tsx: CodeBlockProps, default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/Composer.tsx: Composer
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ErrorBoundary.tsx: useErrorReporting
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ModelPicker.tsx: default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/NetworkBanner.tsx: default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/PWAIntegration.tsx: PWAIntegration
/home/runner/work/Disa_Ai/Disa_Ai/src/components/RouteLoadingFallback.tsx: RouteLoadingFallback
/home/runner/work/Disa_Ai/Disa_Ai/src/components/Settings.tsx: Settings
/home/runner/work/Disa_Ai/Disa_Ai/src/components/SidePanel.tsx: SidePanel
/home/runner/work/Disa_Ai/Disa_Ai/src/components/Tabs.tsx: Tabs
/home/runner/work/Disa_Ai/Disa_Ai/src/components/TypingIndicator.tsx: TypingIndicator
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/ChatList.tsx: ChatList
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/ChatMessage.tsx: ChatMessageType
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/ConversationHistorySheet.tsx: ConversationHistorySheet
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/MobileChatInterface.tsx: MobileChatInterface
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/QuickstartGrid.tsx: QuickstartGrid
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/RoleSelector.tsx: RoleSelector
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/StartTiles.tsx: StartTileAction, StartTiles
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/TokenBadge.tsx: TokenBadge, LiveTokenCounter
/home/runner/work/Disa_Ai/Disa_Ai/src/components/demo/CategoryDemo.tsx: CategoryDemo, default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/demo/GlassPerformanceDemo.tsx: GlassPerformanceDemo, default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/effects/PremiumEffects.tsx: CustomCursor, MatrixRain, NeuralNetwork, ScrollProgress, useScrollReveal, ParticleSystem, useClickExplosion, default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/feedback/ErrorState.tsx: ErrorStateProps, ErrorState
/home/runner/work/Disa_Ai/Disa_Ai/src/components/feedback/Loader.tsx: SkeletonProps, SpinnerProps, Spinner
/home/runner/work/Disa_Ai/Disa_Ai/src/components/layout/MobileNavigation.tsx: MobileNavigation
/home/runner/work/Disa_Ai/Disa_Ai/src/components/layout/MobileTopAppBar.tsx: MobileTopAppBar
/home/runner/work/Disa_Ai/Disa_Ai/src/components/memory/MemoryPanel.tsx: MemoryPanel
/home/runner/work/Disa_Ai/Disa_Ai/src/components/nav/AdvancedSettingsModal.tsx: default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/nav/TopMenuButton.tsx: default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/primitives/Card.tsx: Card
/home/runner/work/Disa_Ai/Disa_Ai/src/components/shell/AppShell.tsx: AppShell
/home/runner/work/Disa_Ai/Disa_Ai/src/components/shell/MainContent.tsx: MainContent
/home/runner/work/Disa_Ai/Disa_Ai/src/components/status/OrbStatus.tsx: default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/studio/MobileRolesInterface.tsx: MobileRolesInterface
/home/runner/work/Disa_Ai/Disa_Ai/src/components/studio/RoleCard.tsx: RoleCardProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/templates/TemplateCard.tsx: TemplateCard
/home/runner/work/Disa_Ai/Disa_Ai/src/components/toast/ToastProvider.tsx: ToastKind, ToastItem, useToast, ToastProvider
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/Accordion.tsx: AccordionItem
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/BottomSheet.tsx: default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/CommandPalette.tsx: Command, CommandPalette, useCommandPalette, useDefaultCommands
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/HeroOrb.tsx: HeroOrbProps, HeroOrb
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/HolographicOrb.tsx: HolographicOrb
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/Icon.tsx: IconName, IconProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/LazyImage.tsx: LazyImage, LazyAvatar
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/MessageBubble.tsx: MessageBubbleProps, MessageBubble
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/Skeleton.tsx: Skeleton, MessageSkeleton, HeaderSkeleton, ChatListSkeleton, ComposerSkeleton, LoadingDots, TypingIndicator, SettingsSkeleton, SoftDepthSpinner, SavePulse, skeletonStyles
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/Toast.tsx: ToastItem, ToastKind
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/VirtualList.tsx: VirtualList, useVirtualList
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/card.tsx: CardVariantProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/label.tsx: LabelProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/loading.tsx: Loading, LoadingBubble, LoadingCard
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/separator.tsx: Separator
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/modal/TestModal.tsx: TestModal
/home/runner/work/Disa_Ai/Disa_Ai/src/ui/AppShell/ChatMain.tsx: ChatMain
/home/runner/work/Disa_Ai/Disa_Ai/src/ui/AppShell/SidebarLeft.tsx: SidebarLeft
/home/runner/work/Disa_Ai/Disa_Ai/src/ui/chat/MessageActions.tsx: ActionsProps
/home/runner/work/Disa_Ai/Disa_Ai/src/ui/chat/TypingIndicator.tsx: TypingIndicator
/home/runner/work/Disa_Ai/Disa_Ai/src/ui/components/ModelPicker.tsx: ModelPicker
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
[36mvite v7.1.9 [32mbuilding for production...[36m[39m
transforming...
[33m[vite:css][postcss] Unable to find uri in '@import \"./styles/typography.css\"'
1  |  /* Import typography system */
2  |  @import \"./styles/typography.css\";
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
3  |  @import \"./styles/mobile-fixes.css\";
4  |  @import \"./styles/mobile-enhanced.css\";[39m
[33m[vite:css][postcss] Unable to find uri in '@import \"./styles/mobile-fixes.css\"'
1  |  /* Import typography system */
2  |  @import \"./styles/typography.css\";
3  |  @import \"./styles/mobile-fixes.css\";
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
4  |  @import \"./styles/mobile-enhanced.css\";
5  |  @import \"./styles/mobile-design-tokens.css\";[39m
[33m[vite:css][postcss] Unable to find uri in '@import \"./styles/mobile-enhanced.css\"'
2  |  @import \"./styles/typography.css\";
3  |  @import \"./styles/mobile-fixes.css\";
4  |  @import \"./styles/mobile-enhanced.css\";
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
5  |  @import \"./styles/mobile-design-tokens.css\";
6  |  @import \"./styles/mobile-layout.css\";[39m
[33m[vite:css][postcss] Unable to find uri in '@import \"./styles/mobile-design-tokens.css\"'
3  |  @import \"./styles/mobile-fixes.css\";
4  |  @import \"./styles/mobile-enhanced.css\";
5  |  @import \"./styles/mobile-design-tokens.css\";
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
6  |  @import \"./styles/mobile-layout.css\";
7  |  @import \"./styles/category-tonal-scales.css\";[39m
[33m[vite:css][postcss] Unable to find uri in '@import \"./styles/mobile-layout.css\"'
4  |  @import \"./styles/mobile-enhanced.css\";
5  |  @import \"./styles/mobile-design-tokens.css\";
6  |  @import \"./styles/mobile-layout.css\";
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
7  |  @import \"./styles/category-tonal-scales.css\";
8  |  @import \"./styles/performance-glass-system.css\";[39m
[33m[vite:css][postcss] Unable to find uri in '@import \"./styles/category-tonal-scales.css\"'
5  |  @import \"./styles/mobile-design-tokens.css\";
6  |  @import \"./styles/mobile-layout.css\";
7  |  @import \"./styles/category-tonal-scales.css\";
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
8  |  @import \"./styles/performance-glass-system.css\";
9  |  @import \"./styles/mobile-navigation-performance.css\";[39m
[33m[vite:css][postcss] Unable to find uri in '@import \"./styles/performance-glass-system.css\"'
6  |  @import \"./styles/mobile-layout.css\";
7  |  @import \"./styles/category-tonal-scales.css\";
8  |  @import \"./styles/performance-glass-system.css\";
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
9  |  @import \"./styles/mobile-navigation-performance.css\";
10 |  [39m
[33m[vite:css][postcss] Unable to find uri in '@import \"./styles/mobile-navigation-performance.css\"'
7  |  @import \"./styles/category-tonal-scales.css\";
8  |  @import \"./styles/performance-glass-system.css\";
9  |  @import \"./styles/mobile-navigation-performance.css\";
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
10 |
11 |  @tailwind base;[39m
[32m✓[39m 1941 modules transformed.
rendering chunks...
[2mdist/[22m[32mindex.html                            [39m[1m[2m  5.35 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/ModalContext-la9NXzQ1.css  [39m[1m[2m  2.54 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/index-CN7b1S0r.css         [39m[1m[2m181.72 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/reload-manager-DqJ_LRMs.js  [39m[1m[2m  0.25 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/search-C4qLXrfI.js          [39m[1m[2m  0.70 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/badge-BJ5y-5EC.js           [39m[1m[2m  1.26 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/roleStore-Ddfx9ppU.js       [39m[1m[2m  1.74 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/mapper-BMoP2MSd.js          [39m[1m[2m  3.81 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/MobileStudio-CeweI3XB.js    [39m[1m[2m 16.85 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/MobileModels-BzUvbDe0.js    [39m[1m[2m 19.48 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/ModalContext-CMoKfwxD.js    [39m[1m[2m 50.32 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/select-DcBSyNF9.js          [39m[1m[2m 50.64 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/Chat-CCUtvQxX.js            [39m[1m[2m 53.40 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/index-BesOPuyN.js           [39m[1m[2m456.29 kB[22m[1m[22m
[2m[1m14[2m[22m chunks of [2m[1m819.95 KB[2m[22m (gzip: [2m[1m265.69 KB[2m[22m | map: [2m[1m2.78 MB[2m[22m)
[32m✓ built in 6.57s[39m

[36mPWA v1.0.3[39m
Building [35mpublic/sw.js[39m service worker ("[35mes[39m" format)...
[36mvite v7.1.9 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 53 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[36msw.mjs  [39m[1m[2m18.91 kB[22m[1m[22m[2m │ gzip: 6.38 kB[22m[2m │ map: 153.59 kB[22m
[32m✓ built in 513ms[39m

[36mPWA v1.0.3[39m
mode      [35minjectManifest[39m
format:   [35mes[39m
precache  [32m21 entries[39m [2m(1856.19 KiB)[22m
files generated
  [2mdist/sw.js[22m
  [2mdist/sw.js.map[22m
Build completed. Preview server available on port 4173 with: npm run preview
No autopilot-summary.mjs found, using basic summary
```
