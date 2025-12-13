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
Running Prettier...
npm warn config production Use `--omit=dev` instead.
[90m.changeset/config.json[39m 38ms (unchanged)
[90m.changeset/README.md[39m 55ms (unchanged)
[90m.changeset/sparkly-ghosts-wear.md[39m 1ms (unchanged)
[90m.github/dependabot.yml[39m 5ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.md[39m 8ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.yml[39m 26ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.md[39m 5ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.yml[39m 23ms (unchanged)
[90m.github/pull_request_template.md[39m 23ms (unchanged)
[90m.github/REQUIRED_CHECKS.md[39m 11ms (unchanged)
[90m.github/workflows/autopilot.yml[39m 8ms (unchanged)
[90m.github/workflows/bundle-monitor.yml[39m 10ms (unchanged)
[90m.github/workflows/ci.yml[39m 26ms (unchanged)
[90m.github/workflows/code-quality.yml[39m 17ms (unchanged)
[90m.github/workflows/codeql.yml[39m 10ms (unchanged)
[90m.github/workflows/codescan.yml[39m 9ms (unchanged)
[90m.github/workflows/dependency-review.yml[39m 9ms (unchanged)
[90m.github/workflows/e2e-performance.yml[39m 19ms (unchanged)
[90m.github/workflows/gemini-dispatch.yml[39m 20ms (unchanged)
[90m.github/workflows/gemini-invoke.yml[39m 9ms (unchanged)
[90m.github/workflows/gemini-review.yml[39m 11ms (unchanged)
[90m.github/workflows/gemini-scheduled-triage.yml[39m 28ms (unchanged)
[90m.github/workflows/gemini-triage.yml[39m 8ms (unchanged)
[90m.github/workflows/lighthouse.yml[39m 4ms (unchanged)
[90m.github/workflows/release.yml[39m 11ms (unchanged)
[90m.github/workflows/verify-dist.yml[39m 8ms (unchanged)
[90m.prettierrc.json[39m 2ms (unchanged)
[90m.qwen/PROJECT_SUMMARY.md[39m 12ms (unchanged)
[90m.stylelintrc.json[39m 5ms (unchanged)
[90mAGENTS.md[39m 14ms (unchanged)
[90mCACHE_FIX_ANLEITUNG.md[39m 62ms (unchanged)
[90mCLAUDE.md[39m 83ms (unchanged)
[90mdeploy/cloudflare/cloudflare-pages.json[39m 3ms (unchanged)
[90meslint.config.mjs[39m 24ms (unchanged)
[90mfunctions/api/chat.ts[39m 44ms (unchanged)
[90mfunctions/api/feedback.ts[39m 33ms (unchanged)
[90mGEMINI.md[39m 10ms (unchanged)
[90mindex.html[39m 161ms (unchanged)
[90mlighthouse.config.mjs[39m 4ms (unchanged)
[90mlighthouserc.cjs[39m 4ms (unchanged)
[90mpackage-lock.json[39m 177ms (unchanged)
[90mpackage.json[39m 4ms (unchanged)
[90mplaywright.config.ts[39m 16ms (unchanged)
[90mpostcss.config.js[39m 1ms (unchanged)
[90mPRIVACY.md[39m 30ms (unchanged)
public/clear-cache.html 30ms
[90mpublic/data/roles.json[39m 10ms (unchanged)
[90mpublic/datenschutz.html[39m 41ms (unchanged)
[90mpublic/dev-sw.js[39m 11ms (unchanged)
[90mpublic/impressum.html[39m 11ms (unchanged)
[90mpublic/manifest.webmanifest[39m 12ms (unchanged)
[90mpublic/models_metadata.json[39m 2ms (unchanged)
[90mpublic/offline.html[39m 30ms (unchanged)
[90mpublic/persona.json[39m 18ms (unchanged)
[90mpublic/privacy-policy.html[39m 8ms (unchanged)
[90mpublic/quickstarts.json[39m 4ms (unchanged)
[90mpublic/sw.js[39m 16ms (unchanged)
[90mREADME.md[39m 34ms (unchanged)
[90mrenovate.json[39m 5ms (unchanged)
[90mscripts/build-info.js[39m 8ms (unchanged)
[90mscripts/check-dist-integrity.mjs[39m 5ms (unchanged)
[90mscripts/deploy-production.js[39m 11ms (unchanged)
[90mscripts/generate-routes.js[39m 2ms (unchanged)
[90mscripts/generate-tokens.mjs[39m 7ms (unchanged)
[90mscripts/production-ready.js[39m 19ms (unchanged)
[90mscripts/run-preview.mjs[39m 17ms (unchanged)
[90mscripts/test-build.mjs[39m 6ms (unchanged)
[90mscripts/validate-tests.mjs[39m 8ms (unchanged)
[90mscripts/verify-dist.mjs[39m 4ms (unchanged)
[90mshared/openrouter.ts[39m 5ms (unchanged)
[90msrc/__tests__/apiKeyShim.test.ts[39m 7ms (unchanged)
[90msrc/__tests__/AppShellLayout.test.tsx[39m 21ms (unchanged)
[90msrc/__tests__/branding.test.tsx[39m 4ms (unchanged)
[90msrc/__tests__/designTokens.test.ts[39m 3ms (unchanged)
[90msrc/__tests__/humanError.test.ts[39m 7ms (unchanged)
[90msrc/__tests__/memory.test.ts[39m 3ms (unchanged)
[90msrc/__tests__/message-id-synchronization.test.ts[39m 30ms (unchanged)
[90msrc/__tests__/modelDefaults.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/models-fallback.test.ts[39m 9ms (unchanged)
[90msrc/__tests__/models.cache.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/networkBanner.test.tsx[39m 3ms (unchanged)
[90msrc/__tests__/openrouter.abort.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/openrouter.ndjson.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/openrouter.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/proxyFallback.test.ts[39m 16ms (unchanged)
[90msrc/__tests__/roleStore.test.ts[39m 7ms (unchanged)
[90msrc/__tests__/sw-cache-management.test.ts[39m 12ms (unchanged)
[90msrc/__tests__/useChat.race-condition.test.ts[39m 16ms (unchanged)
[90msrc/__tests__/useSettings.test.ts[39m 8ms (unchanged)
[90msrc/__tests__/viewport-scroll-performance.test.ts[39m 18ms (unchanged)
[90msrc/api/memory.ts[39m 5ms (unchanged)
[90msrc/api/openrouter.ts[39m 32ms (unchanged)
[90msrc/api/proxyClient.ts[39m 15ms (unchanged)
[90msrc/App.tsx[39m 16ms (unchanged)
[90msrc/app/components/AnimatedLogo.tsx[39m 6ms (unchanged)
[90msrc/app/components/BrandWordmark.tsx[39m 2ms (unchanged)
[90msrc/app/components/RouteWrapper.tsx[39m 2ms (unchanged)
[90msrc/app/layouts/AppShell.tsx[39m 19ms (unchanged)
[90msrc/app/router.tsx[39m 10ms (unchanged)
[90msrc/components/BuildInfo.tsx[39m 6ms (unchanged)
[90msrc/components/chat/__tests__/AnimatedCoreBackground.test.tsx[39m 3ms (unchanged)
[90msrc/components/chat/__tests__/ChatMessage.test.tsx[39m 32ms (unchanged)
[90msrc/components/chat/__tests__/ChatSettingsDropup.test.tsx[39m 36ms (unchanged)
[90msrc/components/chat/__tests__/UnifiedInputBar.test.tsx[39m 19ms (unchanged)
[90msrc/components/chat/AnimatedCoreBackground.tsx[39m 5ms (unchanged)
[90msrc/components/chat/ChatHeroBackground.tsx[39m 5ms (unchanged)
[90msrc/components/chat/ChatHeroCore3D.tsx[39m 7ms (unchanged)
[90msrc/components/chat/ChatMessage.tsx[39m 19ms (unchanged)
[90msrc/components/chat/ChatSettingsDropup.tsx[39m 21ms (unchanged)
[90msrc/components/chat/ChatStatusBanner.tsx[39m 11ms (unchanged)
[90msrc/components/chat/shaders/EnergyEyeShader.ts[39m 2ms (unchanged)
[90msrc/components/chat/ThemenBottomSheet.tsx[39m 7ms (unchanged)
[90msrc/components/chat/ThreeEnergyEyeScene.tsx[39m 30ms (unchanged)
[90msrc/components/chat/UnifiedInputBar.tsx[39m 16ms (unchanged)
[90msrc/components/chat/VirtualizedMessageList.tsx[39m 13ms (unchanged)
[90msrc/components/dev/FeatureFlagPanel.tsx[39m 13ms (unchanged)
[90msrc/components/ErrorBoundary.tsx[39m 19ms (unchanged)
[90msrc/components/FullPageLoader.tsx[39m 2ms (unchanged)
[90msrc/components/layout/AppMenuDrawer.tsx[39m 27ms (unchanged)
[90msrc/components/layout/BookLayout.tsx[39m 3ms (unchanged)
[90msrc/components/layout/ChatLayout.tsx[39m 4ms (unchanged)
[90msrc/components/models/__tests__/categorizeModelFromTags.test.ts[39m 3ms (unchanged)
[90msrc/components/models/__tests__/ModelsCatalog.test.tsx[39m 15ms (unchanged)
[90msrc/components/models/__tests__/resolveInitialModelId.test.ts[39m 2ms (unchanged)
[90msrc/components/models/EnhancedModelsInterface.tsx[39m 49ms (unchanged)
[90msrc/components/models/ModelComparisonTable.tsx[39m 7ms (unchanged)
[90msrc/components/models/ModelsCatalog.tsx[39m 13ms (unchanged)
[90msrc/components/models/resolveInitialModelId.ts[39m 2ms (unchanged)
[90msrc/components/navigation/AchievementSystem.tsx[39m 19ms (unchanged)
[90msrc/components/navigation/Bookmark.tsx[39m 2ms (unchanged)
[90msrc/components/navigation/BookPageAnimator.tsx[39m 2ms (unchanged)
[90msrc/components/navigation/Breadcrumbs.tsx[39m 13ms (unchanged)
[90msrc/components/navigation/HistorySidePanel.tsx[39m 16ms (unchanged)
[90msrc/components/navigation/index.ts[39m 2ms (unchanged)
[90msrc/components/navigation/MobileBackButton.tsx[39m 14ms (unchanged)
[90msrc/components/navigation/PageTransition.tsx[39m 9ms (unchanged)
[90msrc/components/navigation/PrimaryNavigation.tsx[39m 5ms (unchanged)
[90msrc/components/navigation/ReadingProgress.tsx[39m 13ms (unchanged)
[90msrc/components/navigation/SwipeHandler.tsx[39m 13ms (unchanged)
[90msrc/components/neko/__tests__/NekoLayer.test.tsx[39m 9ms (unchanged)
[90msrc/components/neko/__tests__/NekoSprite.test.tsx[39m 15ms (unchanged)
[90msrc/components/neko/NekoLayer.tsx[39m 5ms (unchanged)
[90msrc/components/neko/NekoSprite.tsx[39m 4ms (unchanged)
[90msrc/components/NetworkBanner.tsx[39m 2ms (unchanged)
[90msrc/components/pwa/PWADebugInfo.tsx[39m 7ms (unchanged)
[90msrc/components/pwa/PWAInstallPrompt.tsx[39m 6ms (unchanged)
[90msrc/components/roles/__tests__/EnhancedRolesInterface.test.tsx[39m 17ms (unchanged)
[90msrc/components/roles/EnhancedRolesInterface.tsx[39m 20ms (unchanged)
[90msrc/components/roles/roles-filter.ts[39m 7ms (unchanged)
[90msrc/components/StorageMigration.tsx[39m 33ms (unchanged)
[90msrc/config/behavior-presets.ts[39m 4ms (unchanged)
[90msrc/config/env.ts[39m 16ms (unchanged)
[90msrc/config/flags.ts[39m 10ms (unchanged)
[90msrc/config/modelDefaults.ts[39m 2ms (unchanged)
[90msrc/config/modelPolicy.ts[39m 4ms (unchanged)
[90msrc/config/modelPresets.ts[39m 7ms (unchanged)
[90msrc/config/models.ts[39m 9ms (unchanged)
[90msrc/config/navigation.tsx[39m 3ms (unchanged)
[90msrc/config/orbPresets.ts[39m 9ms (unchanged)
[90msrc/config/promptTemplates.ts[39m 1ms (unchanged)
[90msrc/config/quickstarts.test.ts[39m 14ms (unchanged)
[90msrc/config/quickstarts.ts[39m 16ms (unchanged)
[90msrc/config/roleStore.ts[39m 10ms (unchanged)
[90msrc/config/settings.ts[39m 13ms (unchanged)
[90msrc/config/storageKeys.ts[39m 2ms (unchanged)
[90msrc/contexts/FavoritesContext.tsx[39m 14ms (unchanged)
[90msrc/contexts/ModelCatalogContext.tsx[39m 5ms (unchanged)
[90msrc/contexts/RolesContext.tsx[39m 7ms (unchanged)
[90msrc/contexts/SettingsContext.tsx[39m 24ms (unchanged)
[90msrc/data/roles.ts[39m 10ms (unchanged)
[90msrc/features/conspiracy/prompts.ts[39m 1ms (unchanged)
[90msrc/features/discussion/__tests__/shape.test.ts[39m 4ms (unchanged)
[90msrc/features/discussion/prompts.ts[39m 1ms (unchanged)
[90msrc/features/discussion/shape.ts[39m 8ms (unchanged)
[90msrc/features/prompt/composeSystemPrompt.ts[39m 5ms (unchanged)
[90msrc/features/settings/components/AdvancedTuningPanel.tsx[39m 7ms (unchanged)
[90msrc/features/settings/components/AppearanceSettingsPanel.tsx[39m 5ms (unchanged)
[90msrc/features/settings/components/MetaPresetCard.tsx[39m 2ms (unchanged)
[90msrc/features/settings/components/SettingsAccordion.tsx[39m 3ms (unchanged)
[90msrc/features/settings/constants.ts[39m 3ms (unchanged)
[90msrc/features/settings/hooks/useBehaviorSettings.ts[39m 6ms (unchanged)
[90msrc/features/settings/SettingsApiDataView.tsx[39m 25ms (unchanged)
[90msrc/features/settings/SettingsAppearanceView.tsx[39m 1ms (unchanged)
[90msrc/features/settings/SettingsBehaviorView.tsx[39m 6ms (unchanged)
[90msrc/features/settings/SettingsExtrasView.tsx[39m 4ms (unchanged)
[90msrc/features/settings/SettingsLayout.tsx[39m 5ms (unchanged)
[90msrc/features/settings/SettingsMemoryView.tsx[39m 9ms (unchanged)
[90msrc/features/settings/SettingsYouthFilterView.tsx[39m 9ms (unchanged)
[90msrc/features/settings/TabbedSettingsView.tsx[39m 5ms (unchanged)
[90msrc/hooks/__tests__/useBookNavigation.test.ts[39m 9ms (unchanged)
[90msrc/hooks/__tests__/useChat.systemPrompt.test.ts[39m 14ms (unchanged)
[90msrc/hooks/__tests__/useConversationHistory.test.ts[39m 18ms (unchanged)
[90msrc/hooks/__tests__/useConversationManager.test.ts[39m 30ms (unchanged)
[90msrc/hooks/__tests__/useNeko.test.ts[39m 17ms (unchanged)
[90msrc/hooks/use-storage.ts[39m 20ms (unchanged)
[90msrc/hooks/useBookNavigation.ts[39m 10ms (unchanged)
[90msrc/hooks/useChat.ts[39m 30ms (unchanged)
[90msrc/hooks/useChatPageLogic.ts[39m 15ms (unchanged)
[90msrc/hooks/useChatQuickstart.ts[39m 5ms (unchanged)
[90msrc/hooks/useConversationHistory.ts[39m 7ms (unchanged)
[90msrc/hooks/useConversationManager.ts[39m 32ms (unchanged)
[90msrc/hooks/useCoreStatus.ts[39m 3ms (unchanged)
[90msrc/hooks/useDeferredFetch.ts[39m 21ms (unchanged)
[90msrc/hooks/useFavoritesManager.ts[39m 33ms (unchanged)
[90msrc/hooks/useFeatureFlags.tsx[39m 7ms (unchanged)
[90msrc/hooks/useFilteredList.ts[39m 2ms (unchanged)
[90msrc/hooks/useMemory.ts[39m 5ms (unchanged)
[90msrc/hooks/useNeko.ts[39m 21ms (unchanged)
[90msrc/hooks/usePWAInstall.ts[39m 6ms (unchanged)
[90msrc/hooks/useServiceWorker.ts[39m 4ms (unchanged)
[90msrc/hooks/useSettings.ts[39m 1ms (unchanged)
[90msrc/hooks/useStickToBottom.ts[39m 6ms (unchanged)
[90msrc/hooks/useVisualViewport.ts[39m 5ms (unchanged)
[90msrc/index.css[39m 10ms (unchanged)
[90msrc/lib/__tests__/creativity.test.ts[39m 3ms (unchanged)
[90msrc/lib/__tests__/deepClone.test.ts[39m 6ms (unchanged)
[90msrc/lib/a11y/touchTargets.ts[39m 26ms (unchanged)
[90msrc/lib/accessibility.ts[39m 28ms (unchanged)
[90msrc/lib/analytics.test.ts[39m 14ms (unchanged)
[90msrc/lib/analytics.ts[39m 22ms (unchanged)
[90msrc/lib/categoryColors.ts[39m 11ms (unchanged)
[90msrc/lib/chat/__tests__/validation.test.ts[39m 3ms (unchanged)
[90msrc/lib/chat/prompt-builder.ts[39m 4ms (unchanged)
[90msrc/lib/chat/validation.ts[39m 3ms (unchanged)
[90msrc/lib/conversation-manager-modern.ts[39m 11ms (unchanged)
[90msrc/lib/creativity.ts[39m 5ms (unchanged)
[90msrc/lib/css-feature-detection.ts[39m 2ms (unchanged)
[90msrc/lib/errors/__tests__/mapper.test.ts[39m 7ms (unchanged)
[90msrc/lib/errors/errorHandler.ts[39m 4ms (unchanged)
[90msrc/lib/errors/humanError.ts[39m 5ms (unchanged)
[90msrc/lib/errors/index.ts[39m 1ms (unchanged)
[90msrc/lib/errors/mapper.ts[39m 5ms (unchanged)
[90msrc/lib/errors/types.ts[39m 7ms (unchanged)
[90msrc/lib/http.ts[39m 5ms (unchanged)
[90msrc/lib/icons/index.ts[39m 2ms (unchanged)
[90msrc/lib/memory/memoryService.test.ts[39m 14ms (unchanged)
[90msrc/lib/memory/memoryService.ts[39m 3ms (unchanged)
[90msrc/lib/modelCapabilities.ts[39m 3ms (unchanged)
[90msrc/lib/monitoring/README.md[39m 20ms (unchanged)
[90msrc/lib/monitoring/sentry.tsx[39m 13ms (unchanged)
[90msrc/lib/net/concurrency.ts[39m 7ms (unchanged)
[90msrc/lib/net/fetchTimeout.ts[39m 7ms (unchanged)
[90msrc/lib/net/rateLimit.ts[39m 3ms (unchanged)
[90msrc/lib/openrouter/__tests__/key.test.ts[39m 4ms (unchanged)
[90msrc/lib/openrouter/__tests__/keyLifecycle.test.ts[39m 8ms (unchanged)
[90msrc/lib/openrouter/key.ts[39m 8ms (unchanged)
[90msrc/lib/pricing.ts[39m 6ms (unchanged)
[90msrc/lib/publicAssets.ts[39m 2ms (unchanged)
[90msrc/lib/pwa/registerSW.ts[39m 14ms (unchanged)
[90msrc/lib/pwa/SW_VERSIONING_README.md[39m 25ms (unchanged)
[90msrc/lib/recovery/resetApp.ts[39m 3ms (unchanged)
[90msrc/lib/safeStorage.test.ts[39m 15ms (unchanged)
[90msrc/lib/safeStorage.ts[39m 4ms (unchanged)
[90msrc/lib/storage-layer.ts[39m 48ms (unchanged)
[90msrc/lib/storage-migration.ts[39m 30ms (unchanged)
[90msrc/lib/touch/__tests__/gestures.test.ts[39m 15ms (unchanged)
[90msrc/lib/touch/__tests__/haptics.test.ts[39m 20ms (unchanged)
[90msrc/lib/touch/gestures.ts[39m 13ms (unchanged)
[90msrc/lib/touch/haptics.ts[39m 8ms (unchanged)
[90msrc/lib/utils.ts[39m 6ms (unchanged)
[90msrc/lib/utils/categoryAccents.ts[39m 5ms (unchanged)
[90msrc/lib/utils/debounce.ts[39m 5ms (unchanged)
[90msrc/lib/utils/production-logger.ts[39m 10ms (unchanged)
[90msrc/lib/utils/reload-manager.ts[39m 1ms (unchanged)
[90msrc/lib/validators/roles.ts[39m 6ms (unchanged)
[90msrc/main.tsx[39m 22ms (unchanged)
[90msrc/pages/Chat.tsx[39m 16ms (unchanged)
[90msrc/pages/ChatHistoryPage.tsx[39m 7ms (unchanged)
[90msrc/pages/DatenschutzPage.tsx[39m 17ms (unchanged)
[90msrc/pages/FeedbackPage.tsx[39m 13ms (unchanged)
[90msrc/pages/ImpressumPage.tsx[39m 5ms (unchanged)
[90msrc/pages/ModelsPage.tsx[39m 1ms (unchanged)
[90msrc/pages/RolesPage.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsApiData.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsAppearance.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsBehavior.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsExtras.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsMemory.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsOverviewPage.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsYouthFilter.tsx[39m 1ms (unchanged)
[90msrc/pages/ThemenPage.tsx[39m 7ms (unchanged)
[90msrc/prompts/discussion/presets.ts[39m 2ms (unchanged)
[90msrc/state/chatReducer.ts[39m 5ms (unchanged)
[90msrc/styles/__tests__/animations.test.ts[39m 9ms (unchanged)
src/styles/animated-core.css 13ms
[90msrc/styles/DESIGN_SYSTEM.md[39m 33ms (unchanged)
[90msrc/styles/design-tokens.ts[39m 4ms (unchanged)
[90msrc/styles/interactive-states.css[39m 28ms (unchanged)
[90msrc/styles/page-spacing.css[39m 33ms (unchanged)
[90msrc/styles/README.md[39m 5ms (unchanged)
[90msrc/styles/theme-variants.ts[39m 5ms (unchanged)
[90msrc/styles/theme.ts[39m 12ms (unchanged)
[90msrc/styles/tokens/category-colors.ts[39m 6ms (unchanged)
[90msrc/styles/tokens/category-tonal-scales.ts[39m 20ms (unchanged)
[90msrc/styles/tokens/color.ts[39m 15ms (unchanged)
[90msrc/styles/tokens/motion.ts[39m 3ms (unchanged)
[90msrc/styles/tokens/radius.ts[39m 3ms (unchanged)
[90msrc/styles/tokens/shadow.ts[39m 4ms (unchanged)
[90msrc/styles/tokens/spacing.ts[39m 4ms (unchanged)
[90msrc/styles/tokens/typography.ts[39m 11ms (unchanged)
[90msrc/styles/ui-state-animations.css[39m 11ms (unchanged)
[90msrc/styles/z-index-system.css[39m 4ms (unchanged)
[90msrc/types/BookNavigation.ts[39m 1ms (unchanged)
[90msrc/types/chat.ts[39m 1ms (unchanged)
[90msrc/types/chatMessage.ts[39m 1ms (unchanged)
[90msrc/types/enhanced-interfaces.ts[39m 19ms (unchanged)
[90msrc/types/index.ts[39m 2ms (unchanged)
[90msrc/types/openrouter.ts[39m 5ms (unchanged)
[90msrc/types/orb.ts[39m 3ms (unchanged)
[90msrc/types/prism-modules.d.ts[39m 1ms (unchanged)
[90msrc/ui/__tests__/Button.test.tsx[39m 3ms (unchanged)
[90msrc/ui/ActionCard.tsx[39m 3ms (unchanged)
[90msrc/ui/Avatar.tsx[39m 3ms (unchanged)
[90msrc/ui/Badge.tsx[39m 3ms (unchanged)
[90msrc/ui/Button.tsx[39m 4ms (unchanged)
[90msrc/ui/Card.tsx[39m 12ms (unchanged)
[90msrc/ui/Chip.tsx[39m 2ms (unchanged)
[90msrc/ui/CopyButton.tsx[39m 6ms (unchanged)
[90msrc/ui/Dialog.tsx[39m 6ms (unchanged)
[90msrc/ui/DrawerSheet.tsx[39m 11ms (unchanged)
[90msrc/ui/FilterChip.tsx[39m 3ms (unchanged)
[90msrc/ui/IconButton.tsx[39m 3ms (unchanged)
[90msrc/ui/index.ts[39m 1ms (unchanged)
[90msrc/ui/Input.tsx[39m 3ms (unchanged)
[90msrc/ui/Label.tsx[39m 2ms (unchanged)
[90msrc/ui/ListItem.tsx[39m 5ms (unchanged)
[90msrc/ui/MaterialCard.tsx[39m 2ms (unchanged)
[90msrc/ui/MaterialPanel.tsx[39m 2ms (unchanged)
[90msrc/ui/MetricRow.tsx[39m 4ms (unchanged)
[90msrc/ui/ModelCard.tsx[39m 6ms (unchanged)
[90msrc/ui/PageComponents.tsx[39m 6ms (unchanged)
[90msrc/ui/PremiumCard.tsx[39m 6ms (unchanged)
[90msrc/ui/PrimaryButton.tsx[39m 4ms (unchanged)
[90msrc/ui/QuickStartCard.tsx[39m 4ms (unchanged)
[90msrc/ui/RoleCard.tsx[39m 5ms (unchanged)
[90msrc/ui/SearchInput.tsx[39m 5ms (unchanged)
[90msrc/ui/SectionHeader.tsx[39m 3ms (unchanged)
[90msrc/ui/Select.tsx[39m 15ms (unchanged)
[90msrc/ui/SettingsRow.tsx[39m 4ms (unchanged)
[90msrc/ui/Skeleton.tsx[39m 1ms (unchanged)
[90msrc/ui/Switch.tsx[39m 2ms (unchanged)
[90msrc/ui/Table.tsx[39m 6ms (unchanged)
[90msrc/ui/Textarea.tsx[39m 2ms (unchanged)
[90msrc/ui/toast/index.tsx[39m 9ms (unchanged)
[90msrc/ui/Tooltip.tsx[39m 2ms (unchanged)
[90msrc/ui/Typography.tsx[39m 4ms (unchanged)
[90msrc/vitest-env.d.ts[39m 1ms (unchanged)
[90mtailwind.config.ts[39m 21ms (unchanged)
[90mtests/e2e/api-mock.ts[39m 4ms (unchanged)
[90mtests/e2e/book-concept.spec.ts[39m 6ms (unchanged)
[90mtests/e2e/chat.smoke.spec.ts[39m 11ms (unchanged)
[90mtests/e2e/cross-browser/firefox.spec.ts[39m 22ms (unchanged)
[90mtests/e2e/global-setup.ts[39m 6ms (unchanged)
[90mtests/e2e/global-teardown.ts[39m 4ms (unchanged)
[90mtests/e2e/helpers/app-helpers.ts[39m 13ms (unchanged)
[90mtests/e2e/live/live-visual.spec.ts[39m 7ms (unchanged)
[90mtests/e2e/live/README.md[39m 3ms (unchanged)
[90mtests/e2e/models-roles.spec.ts[39m 11ms (unchanged)
[90mtests/e2e/performance/lighthouse.spec.ts[39m 24ms (unchanged)
[90mtests/e2e/reporting/dashboard.html[39m 47ms (unchanged)
[90mtests/e2e/reporting/html-reporter.ts[39m 33ms (unchanged)
[90mtests/e2e/unified-layout.spec.ts[39m 17ms (unchanged)
[90mtests/e2e/utils.ts[39m 2ms (unchanged)
[90mtests/e2e/visual/comparator.ts[39m 13ms (unchanged)
[90mtests/e2e/visual/visual-audit.spec.ts[39m 4ms (unchanged)
[90mtests/integration/mobile-animations.test.ts[39m 11ms (unchanged)
[90mtests/MOBILE_ANIMATIONS_TESTS.md[39m 43ms (unchanged)
[90mtests/polyfills.ts[39m 5ms (unchanged)
[90mtests/README_RUN_TESTS.md[39m 28ms (unchanged)
[90mtests/setup.ts[39m 4ms (unchanged)
[90mtests/setup/fetch.ts[39m 3ms (unchanged)
[90mtests/smoke/app.test.tsx[39m 5ms (unchanged)
[90mtests/smoke/entrypoints.smoke.test.tsx[39m 9ms (unchanged)
[90mtests/unit/composeSystemPrompt.test.ts[39m 2ms (unchanged)
[90mtests/unit/copyButton.test.tsx[39m 5ms (unchanged)
[90mtests/unit/ErrorBoundary.test.tsx[39m 5ms (unchanged)
[90mtests/unit/lib/conversation-manager-modern.test.ts[39m 25ms (unchanged)
[90mtests/unit/lib/export-validation.test.ts[39m 2ms (unchanged)
[90mtests/unit/lib/storage-integration.test.ts[39m 5ms (unchanged)
[90mtests/unit/lib/storage-layer-business.test.ts[39m 16ms (unchanged)
[90mtests/unit/lib/storage-layer-simple.test.ts[39m 20ms (unchanged)
[90mtests/unit/lib/storage-layer.test.ts[39m 22ms (unchanged)
[90mtests/unit/lib/storage-migration-integration.test.ts[39m 7ms (unchanged)
[90mtests/unit/lib/storage-migration.test.ts[39m 33ms (unchanged)
[90mtests/unit/lib/storage-performance-simple.test.ts[39m 20ms (unchanged)
[90mtests/unit/lib/storage-performance.test.ts[39m 16ms (unchanged)
[90mtests/unit/rateLimit.test.ts[39m 2ms (unchanged)
[90mtests/unit/useChat.test.tsx[39m 6ms (unchanged)
[90mtools/cf-purge.js[39m 9ms (unchanged)
[90mtools/check-css-hex.mjs[39m 4ms (unchanged)
[90mtools/visual-mcp.ts[39m 12ms (unchanged)
[90mtools/zai-vision-mcp.ts[39m 5ms (unchanged)
[90mtsconfig.base.json[39m 1ms (unchanged)
[90mtsconfig.build.json[39m 1ms (unchanged)
[90mtsconfig.json[39m 1ms (unchanged)
[90mtsconfig.node.json[39m 1ms (unchanged)
[90mtsconfig.test.json[39m 1ms (unchanged)
[90mvite-env.d.ts[39m 4ms (unchanged)
[90mvite.config.ts[39m 17ms (unchanged)
[90mvitest.config.ts[39m 3ms (unchanged)
Checking for unused imports...
npm warn config production Use `--omit=dev` instead.
npm warn exec The following package was not found and will be installed: ts-unused-exports@11.0.1
86 modules with unused exports
/home/runner/work/Disa_Ai/Disa_Ai/src/api/openrouter.ts: checkApiHealth, pingOpenRouter
/home/runner/work/Disa_Ai/Disa_Ai/src/components/navigation/index.ts: AchievementSystem, Bookmark, HistorySidePanel, PageTransition, ReadingProgress, SwipeHandler
/home/runner/work/Disa_Ai/Disa_Ai/src/config/behavior-presets.ts: BehaviorPresetConfig, BehaviorPresetId
/home/runner/work/Disa_Ai/Disa_Ai/src/config/env.ts: EnvConfig, getEnvironmentWarnings
/home/runner/work/Disa_Ai/Disa_Ai/src/config/flags.ts: defaultFeatureFlags, FeatureFlagMeta
/home/runner/work/Disa_Ai/Disa_Ai/src/config/modelPolicy.ts: ModelPolicy
/home/runner/work/Disa_Ai/Disa_Ai/src/config/modelPresets.ts: LegacyModelOption, LEGACY_MODEL_PRESETS, buildLegacyModelOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/config/models.ts: Price, CatalogOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/config/orbPresets.ts: ORB_PRESETS, ORB_SIZE_OPTIONS, ORB_INTENSITY_OPTIONS, BREATHING_SPEED_OPTIONS, PARTICLE_DENSITY_OPTIONS, getPresetById, applyPresetToSettings
/home/runner/work/Disa_Ai/Disa_Ai/src/config/promptTemplates.ts: RoleTemplate, fetchRoleTemplates, getRoleLoadStatus, listRoleTemplates
/home/runner/work/Disa_Ai/Disa_Ai/src/config/roleStore.ts: getRoleTemplates, getRoleState
/home/runner/work/Disa_Ai/Disa_Ai/src/config/settings.ts: getCtxReservedTokens, setCtxReservedTokens, getComposerOffset, setComposerOffset, getFontSize, setFontSize, getReduceMotion, setReduceMotion, getHapticFeedback, setHapticFeedback, getDiscussionPreset, setDiscussionPreset, getDiscussionStrictMode, setDiscussionStrictMode, getDiscussionMaxSentences, setDiscussionMaxSentences
/home/runner/work/Disa_Ai/Disa_Ai/src/config/storageKeys.ts: SESSION_STORAGE_KEYS
/home/runner/work/Disa_Ai/Disa_Ai/src/data/roles.ts: getRoleById, getRolesByCategory, getCategories
/home/runner/work/Disa_Ai/Disa_Ai/src/features/discussion/shape.ts: DiscussionShapeOptions, DiscussionShapeResult
/home/runner/work/Disa_Ai/Disa_Ai/src/features/prompt/composeSystemPrompt.ts: composeSystemPrompt
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/use-storage.ts: UseConversationsOptions, UseConversationsReturn, useConversations, UseConversationReturn, useConversation, UseConversationStatsReturn, UseStorageMigrationReturn, UseStorageHealthReturn, useBulkOperations
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useChat.ts: UseChatOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useCoreStatus.ts: UseCoreStatusOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useDeferredFetch.ts: useDeferredLoad, useDeferredCachedFetch, getDeferredFetchStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useFavoritesManager.ts: useFavoriteStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useNeko.ts: NekoController
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/analytics.ts: AnalyticsEvent, AnalyticsSession, AnalyticsStats
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/categoryColors.ts: CategoryColorTheme
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/conversation-manager-modern.ts: ExportData, ImportResult, bulkUpdateConversations, cleanupOldConversations, exportConversations, importConversations, getConversationById, migrateFromLocalStorage, getStoragePerformance
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/http.ts: FetchJsonOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/pricing.ts: normalizePrice
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/safeStorage.ts: SafeStorage
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/storage-layer.ts: StorageStats, setModernStorageInstance, getModernStorageInstance
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/storage-migration.ts: MigrationResult, MigrationProgress, MigrationOptions, StorageMigration
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/utils.ts: objectKeys, objectValues, objectEntries, isDefined, isFunction
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/a11y/touchTargets.ts: TOUCH_TARGET_SIZES, A11yViolation, validateTouchTarget, validateAriaAttributes, autoFixA11yViolations, scanDocumentA11y, enforceA11yStandards, createA11yObserver, FocusManager
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/chat/prompt-builder.ts: buildSafetyPrompt, buildDiscussionPrompt
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/chat/validation.ts: PromptValidationReason, PromptValidationResult
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/errors/errorHandler.ts: handleError, withErrorHandling
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/errors/humanError.ts: HumanError
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/errors/index.ts: ApiError, HttpError, NotFoundError, ApiClientError, UnknownError
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/icons/index.ts: Activity, AppWindow, Bot, Circle, Code, Code2, FileText, Filter, Hash, Image, Link2, Lock, MessageCircle, Mic, Moon, Paperclip, PenSquare, Pin, PinOff, Plus, Smile, Square, SunMedium, Tag, ThumbsDown, ThumbsUp, Waves, ZapOff
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/concurrency.ts: ConcurrencyManager
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/fetchTimeout.ts: FetchWithTimeoutOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/rateLimit.ts: TokenBucket
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/pwa/registerSW.ts: BUILD_TOKEN, RegisterResult
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/gestures.ts: TouchGestureOptions, SwipeEvent, TapEvent, ensureTouchTarget, debouncedTouch
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/haptics.ts: HapticOptions, HapticPattern, isHapticSupported, prefersReducedMotion, triggerHaptic, withHaptic, addHapticToElement
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/utils/categoryAccents.ts: RoleCategory, AccentName, getRoleCategoryAccent, getCategoryCardClasses, getCategoryAccent
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/utils/debounce.ts: debounce
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/utils/production-logger.ts: devLog, prodError, safeLog, safeDebug
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/validators/roles.ts: SafetyLevel, parseRolesStrict
/home/runner/work/Disa_Ai/Disa_Ai/src/state/chatReducer.ts: ChatState, ChatAction
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/design-tokens.ts: DesignTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/theme-variants.ts: AccentName
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/theme.ts: ColorMode, ThemePreference, ThemeState
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/category-colors.ts: categoryColorTokens, categoryTokensCSS, CategoryKey, CATEGORY_KEYS
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/category-tonal-scales.ts: categoryTonalScales, categoryTonalTokensCSS, CategoryKey, CATEGORY_KEYS, TONAL_LEVELS, TonalLevel
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/color.ts: SurfaceTokens, TextTokens, BorderTokens, BrandTokens, StatusTokenSet, StatusTokens, ActionTokens, ControlTokens, TableTokens, OverlayTokens, ColorScheme, colorCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/motion.ts: DurationTokens, EasingTokens, MotionTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/radius.ts: RadiusTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/shadow.ts: ShadowTokens, shadowCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/spacing.ts: SpacingScale, SemanticSpacing, TouchTargets, FixedSizes, SpacingTokens, spacingCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/typography.ts: FontStackTokens, TextStyle, TypographyTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/types/BookNavigation.ts: SwipeStack
/home/runner/work/Disa_Ai/Disa_Ai/src/types/chat.ts: Role
/home/runner/work/Disa_Ai/Disa_Ai/src/types/chatMessage.ts: ChatMessageRole
/home/runner/work/Disa_Ai/Disa_Ai/src/types/enhanced-interfaces.ts: RoleCategory, PerformanceMetrics, SearchResult, UIState, migrateModel, isEnhancedRole, isEnhancedModel
/home/runner/work/Disa_Ai/Disa_Ai/src/types/index.ts: Role, Message, MessageRole, ChatSession
/home/runner/work/Disa_Ai/Disa_Ai/src/types/openrouter.ts: OpenRouterMessage, OpenRouterError, OpenRouterChoice, OpenRouterUsage, OpenRouterModel, OpenRouterModelsResponse, OpenRouterChatRequest
/home/runner/work/Disa_Ai/Disa_Ai/src/types/orb.ts: OrbSize, OrbIntensity, OrbTheme, BreathingSpeed, ParticleDensity, CustomColors, OrbPreviewProps
/home/runner/work/Disa_Ai/Disa_Ai/src/ui/index.ts: ActionCard, Avatar, AvatarFallback, AvatarImage, BadgeProps, badgeVariants, ButtonProps, buttonVariants, CardProps, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Chip, CopyButton, DialogClose, DialogFooter, DialogOverlay, DialogPortal, DialogTrigger, DrawerSheet, IconButton, InputProps, inputVariants, ListItem, ListGroup, MaterialPanel, MetricRow, ModelCard, PrimaryButtonProps, QuickStartCard, RoleCard, SectionHeader, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue, SettingsRow, SettingsToggleRow, SettingsSection, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, TextareaProps, Textarea, ToastsProvider, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TypographyVariant, TypographyElement, Typography
/home/runner/work/Disa_Ai/Disa_Ai/src/app/router.tsx: appRouter
/home/runner/work/Disa_Ai/Disa_Ai/src/app/components/AnimatedLogo.tsx: AnimatedLogoProps
/home/runner/work/Disa_Ai/Disa_Ai/src/app/components/BrandWordmark.tsx: BrandWordmarkProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/BuildInfo.tsx: BuildInfo
/home/runner/work/Disa_Ai/Disa_Ai/src/components/NetworkBanner.tsx: default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/ChatHeroBackground.tsx: ChatHeroBackground
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/ThemenBottomSheet.tsx: ThemenBottomSheet
/home/runner/work/Disa_Ai/Disa_Ai/src/components/dev/FeatureFlagPanel.tsx: FeatureFlagIndicator
/home/runner/work/Disa_Ai/Disa_Ai/src/components/layout/BookLayout.tsx: BookLayout
/home/runner/work/Disa_Ai/Disa_Ai/src/components/models/EnhancedModelsInterface.tsx: modelEntryToEnhanced, EnhancedModelsInterface, default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/navigation/BookPageAnimator.tsx: BookPageAnimator
/home/runner/work/Disa_Ai/Disa_Ai/src/components/navigation/Breadcrumbs.tsx: useBreadcrumbs, Breadcrumbs, AutoBreadcrumbs
/home/runner/work/Disa_Ai/Disa_Ai/src/components/navigation/MobileBackButton.tsx: useMobileBackNavigation, useSmartBack
/home/runner/work/Disa_Ai/Disa_Ai/src/components/pwa/PWADebugInfo.tsx: PWADebugInfo
/home/runner/work/Disa_Ai/Disa_Ai/src/components/pwa/PWAInstallPrompt.tsx: PWAInstallPrompt
/home/runner/work/Disa_Ai/Disa_Ai/src/contexts/FavoritesContext.tsx: useFavoriteActions, useFavoriteLists, useFavoritesAnalytics, withFavorites, FavoritesLoader
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useFeatureFlags.tsx: useFeatureFlag, useFeatureFlags, useAnyFeatureFlags, useAllFeatureFlags, useActiveFeatureFlags, withFeatureFlag
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/monitoring/sentry.tsx: captureError, addBreadcrumb, setUserContext, profileFunction
Running local maintenance scripts...
Running verify-dist.mjs...
🚫 dist-Verzeichnis fehlt: /home/runner/work/Disa_Ai/Disa_Ai/dist
Building project...
Running vite build...
npm warn config production Use `--omit=dev` instead.
[36mvite v7.2.4 [32mbuilding client environment for production...[36m[39m
transforming...
[33m[vite:css][postcss] @import must precede all other statements (besides @charset or empty @layer)
3  |  @tailwind utilities;
4  |
5  |  @import "./styles/animated-core.css";
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
6  |
7  |  :root {[39m
[33m[vite:css][postcss] @import must precede all other statements (besides @charset or empty @layer)
3  |  @tailwind utilities;
4  |
5  |  @import "./styles/animated-core.css";
   |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
6  |
7  |  :root {[39m
[32m✓[39m 3297 modules transformed.
rendering chunks...
[2mdist/[22m[32mindex.html                                  [39m[1m[2m   26.45 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/index-BW6qCQc0.css               [39m[1m[2m  115.16 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/reload-manager-DqJ_LRMs.js        [39m[1m[2m    0.25 kB[22m[1m[22m[2m │ map:     0.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/rotate-ccw-ClFPnf1e.js            [39m[1m[2m    0.25 kB[22m[1m[22m[2m │ map:     0.95 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/database-DewOR5-K.js              [39m[1m[2m    0.29 kB[22m[1m[22m[2m │ map:     1.09 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/triangle-alert-BPyPg6r1.js        [39m[1m[2m    0.32 kB[22m[1m[22m[2m │ map:     1.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/send-BO9c0_00.js                  [39m[1m[2m    0.33 kB[22m[1m[22m[2m │ map:     1.04 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/trash-2-DLBdKo1W.js               [39m[1m[2m    0.37 kB[22m[1m[22m[2m │ map:     1.25 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/refresh-cw-LyUpxHU4.js            [39m[1m[2m    0.37 kB[22m[1m[22m[2m │ map:     1.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsBehavior-CidnzraW.js      [39m[1m[2m    0.50 kB[22m[1m[22m[2m │ map:     0.42 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/palette-BAjiJAe9.js               [39m[1m[2m    0.56 kB[22m[1m[22m[2m │ map:     1.63 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsAppearance-FYDwLNCk.js    [39m[1m[2m    0.56 kB[22m[1m[22m[2m │ map:     0.78 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SearchInput-BUuXI7Ka.js           [39m[1m[2m    1.19 kB[22m[1m[22m[2m │ map:     3.53 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/useMemory-DZ9Bdap8.js             [39m[1m[2m    1.50 kB[22m[1m[22m[2m │ map:     5.22 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PageComponents-6MKolYLr.js        [39m[1m[2m    1.82 kB[22m[1m[22m[2m │ map:     4.37 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/presets-BDfCUBcS.js               [39m[1m[2m    2.08 kB[22m[1m[22m[2m │ map:     4.65 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsExtras-CEPeLLHN.js        [39m[1m[2m    2.50 kB[22m[1m[22m[2m │ map:     4.93 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/roleStore-ilwj3bic.js             [39m[1m[2m    2.61 kB[22m[1m[22m[2m │ map:    11.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ImpressumPage-ANqFxu2b.js         [39m[1m[2m    2.65 kB[22m[1m[22m[2m │ map:     4.53 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsOverviewPage-XUlfVw0a.js  [39m[1m[2m    2.76 kB[22m[1m[22m[2m │ map:     6.87 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-CT89qRWC.js                 [39m[1m[2m    2.93 kB[22m[1m[22m[2m │ map:     1.47 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsLayout-CkRKxcfJ.js        [39m[1m[2m    3.41 kB[22m[1m[22m[2m │ map:    10.18 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ChatHistoryPage-CC2MqL0b.js       [39m[1m[2m    3.54 kB[22m[1m[22m[2m │ map:     8.49 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsYouthFilter-CX2huznw.js   [39m[1m[2m    3.82 kB[22m[1m[22m[2m │ map:     9.10 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ThemenPage-qQexllVI.js            [39m[1m[2m    3.90 kB[22m[1m[22m[2m │ map:     9.60 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/FeatureFlagPanel-C1rpgfTw.js      [39m[1m[2m    4.39 kB[22m[1m[22m[2m │ map:    15.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ModelsPage-BYVEKvXM.js            [39m[1m[2m    5.86 kB[22m[1m[22m[2m │ map:    17.30 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/FeedbackPage-BpK8hkU4.js          [39m[1m[2m    5.89 kB[22m[1m[22m[2m │ map:    15.78 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsMemory-xSneJcL-.js        [39m[1m[2m    6.58 kB[22m[1m[22m[2m │ map:    17.17 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/use-storage-DVWbp8vs.js           [39m[1m[2m    8.20 kB[22m[1m[22m[2m │ map:    36.19 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/quickstarts-CuX_PYUM.js           [39m[1m[2m    8.76 kB[22m[1m[22m[2m │ map:    17.70 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/RolesPage-Bvfqy7iO.js             [39m[1m[2m    9.85 kB[22m[1m[22m[2m │ map:    43.80 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsBehaviorView-DQADZxAr.js  [39m[1m[2m   11.54 kB[22m[1m[22m[2m │ map:    34.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatenschutzPage-D2UTJW_x.js       [39m[1m[2m   17.31 kB[22m[1m[22m[2m │ map:    28.91 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsApiData-BuNXdSvC.js       [39m[1m[2m   21.16 kB[22m[1m[22m[2m │ map:    61.04 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/utils-vendor-BAeEp5cw.js          [39m[1m[2m   26.37 kB[22m[1m[22m[2m │ map:   144.60 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DBzMPd_a.js             [39m[1m[2m   39.20 kB[22m[1m[22m[2m │ map:   202.53 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Chat-Cx1m3Ojh.js                  [39m[1m[2m   47.65 kB[22m[1m[22m[2m │ map:   167.51 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/router-vendor-DLiaQ_dS.js         [39m[1m[2m   82.80 kB[22m[1m[22m[2m │ map:   522.10 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-B9D_A6Vq.js          [39m[1m[2m  141.18 kB[22m[1m[22m[2m │ map:   344.91 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/main-BO34uzsu.js                  [39m[1m[2m  327.83 kB[22m[1m[22m[2m │ map: 1,259.62 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ChatHeroCore3D-Cv1Okiq8.js        [39m[1m[2m1,068.72 kB[22m[1m[22m[2m │ map: 4,900.53 kB[22m
[2m[1m42[2m[22m chunks of [2m[1m1.90 MB[2m[22m (gzip: [2m[1m631.11 KB[2m[22m | map: [2m[1m7.57 MB[2m[22m)
[32m✓ built in 16.24s[39m

[36mPWA v1.1.0[39m
mode      [35mgenerateSW[39m
precache  [32m65 entries[39m [2m(3258.54 KiB)[22m
files generated
  [2mdist/sw.js.map[22m
  [2mdist/sw.js[22m
  [2mdist/workbox-78ef5c9b.js.map[22m
  [2mdist/workbox-78ef5c9b.js[22m
Build completed. Preview server available on port 4173 with: npm run preview
No autopilot-summary.mjs found, using basic summary
```
