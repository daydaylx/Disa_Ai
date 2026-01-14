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

/home/runner/work/Disa_Ai/Disa_Ai/src/ui/BottomSheet.tsx
  20:3  warning  'snapPoints' is assigned a value but never used. Allowed unused args must match /^_/u   unused-imports/no-unused-vars
  21:3  warning  'initialSnap' is assigned a value but never used. Allowed unused args must match /^_/u  unused-imports/no-unused-vars

✖ 2 problems (0 errors, 2 warnings)

Running Prettier...
npm warn config production Use `--omit=dev` instead.
[90m.changeset/config.json[39m 63ms (unchanged)
[90m.changeset/README.md[39m 57ms (unchanged)
[90m.cursor/mcp.json[39m 4ms (unchanged)
[90m.github/CREATE_ISSUES.md[39m 24ms (unchanged)
[90m.github/dependabot.yml[39m 5ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.md[39m 7ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.yml[39m 30ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.md[39m 5ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.yml[39m 28ms (unchanged)
[90m.github/ISSUE_TEMPLATES/issue-1-rename-bookmark-labels.md[39m 7ms (unchanged)
[90m.github/ISSUE_TEMPLATES/issue-2-openrouter-free-models.md[39m 9ms (unchanged)
[90m.github/ISSUE_TEMPLATES/issue-3-settings-separation.md[39m 8ms (unchanged)
[90m.github/ISSUE_TEMPLATES/issue-4-memory-default-enabled.md[39m 4ms (unchanged)
[90m.github/ISSUE_TEMPLATES/issue-5-unique-role-icons.md[39m 5ms (unchanged)
[90m.github/ISSUE_TEMPLATES/issue-6-role-icons-colors.md[39m 3ms (unchanged)
[90m.github/pull_request_template.md[39m 14ms (unchanged)
[90m.github/REQUIRED_CHECKS.md[39m 12ms (unchanged)
[90m.github/workflows/autopilot.yml[39m 10ms (unchanged)
[90m.github/workflows/bundle-monitor.yml[39m 13ms (unchanged)
[90m.github/workflows/ci.yml[39m 40ms (unchanged)
[90m.github/workflows/code-quality.yml[39m 23ms (unchanged)
[90m.github/workflows/codeql.yml[39m 4ms (unchanged)
[90m.github/workflows/codescan.yml[39m 5ms (unchanged)
[90m.github/workflows/dependency-review.yml[39m 9ms (unchanged)
[90m.github/workflows/e2e-performance.yml[39m 27ms (unchanged)
[90m.github/workflows/gemini-dispatch.yml[39m 25ms (unchanged)
[90m.github/workflows/gemini-invoke.yml[39m 14ms (unchanged)
[90m.github/workflows/gemini-review.yml[39m 12ms (unchanged)
[90m.github/workflows/gemini-scheduled-triage.yml[39m 22ms (unchanged)
[90m.github/workflows/gemini-triage.yml[39m 12ms (unchanged)
[90m.github/workflows/lighthouse.yml[39m 6ms (unchanged)
[90m.github/workflows/release.yml[39m 18ms (unchanged)
[90m.github/workflows/verify-dist.yml[39m 12ms (unchanged)
[90m.kilocode/mcp.json[39m 3ms (unchanged)
[90m.prettierrc.json[39m 1ms (unchanged)
[90m.qwen/PROJECT_SUMMARY.md[39m 11ms (unchanged)
[90m.stylelintrc.json[39m 4ms (unchanged)
[90mAGENTS.md[39m 9ms (unchanged)
[90mCACHE_FIX_ANLEITUNG.md[39m 60ms (unchanged)
[90mCHANGELOG.md[39m 13ms (unchanged)
[90mCHAT_AUDIT_REPORT.md[39m 141ms (unchanged)
[90mCLAUDE.md[39m 63ms (unchanged)
[90mdeploy/cloudflare/cloudflare-pages.json[39m 3ms (unchanged)
[90mDESIGN_SYSTEM_IMPROVEMENTS.md[39m 17ms (unchanged)
[90meslint.config.mjs[39m 22ms (unchanged)
[90mFIX_1_IMPLEMENTATION.md[39m 57ms (unchanged)
[90mfunctions/api/chat.ts[39m 32ms (unchanged)
[90mfunctions/api/diag/zai-test.ts[39m 31ms (unchanged)
[90mfunctions/api/diag/zai.ts[39m 19ms (unchanged)
[90mfunctions/api/feedback.ts[39m 46ms (unchanged)
[90mfunctions/api/vision.ts[39m 32ms (unchanged)
[90mGEMINI.md[39m 10ms (unchanged)
[90mindex.html[39m 168ms (unchanged)
[90mlighthouse.config.mjs[39m 4ms (unchanged)
[90mlighthouserc.cjs[39m 5ms (unchanged)
[90mMOBILE_UI_ON_DESKTOP.md[39m 34ms (unchanged)
[90mpackage-lock.json[39m 171ms (unchanged)
[90mpackage.json[39m 2ms (unchanged)
[90mplaywright.config.ts[39m 15ms (unchanged)
[90mpostcss.config.js[39m 1ms (unchanged)
[90mPR_BODY.md[39m 13ms (unchanged)
[90mPR_DESCRIPTION.md[39m 16ms (unchanged)
[90mpr-body.md[39m 6ms (unchanged)
[90mPRIVACY.md[39m 33ms (unchanged)
[90mpublic/clear-cache.html[39m 28ms (unchanged)
[90mpublic/data/roles.json[39m 10ms (unchanged)
[90mpublic/datenschutz.html[39m 59ms (unchanged)
[90mpublic/dev-sw.js[39m 11ms (unchanged)
[90mpublic/impressum.html[39m 12ms (unchanged)
[90mpublic/manifest.webmanifest[39m 6ms (unchanged)
[90mpublic/models_metadata.json[39m 2ms (unchanged)
[90mpublic/offline.html[39m 30ms (unchanged)
[90mpublic/persona.json[39m 15ms (unchanged)
[90mpublic/privacy-policy.html[39m 8ms (unchanged)
[90mpublic/quickstarts.json[39m 3ms (unchanged)
[90mpublic/sw.js[39m 12ms (unchanged)
[90mREADME.md[39m 59ms (unchanged)
[90mrenovate.json[39m 4ms (unchanged)
[90mscripts/build-info.js[39m 8ms (unchanged)
[90mscripts/check-dist-integrity.mjs[39m 4ms (unchanged)
[90mscripts/deploy-production.js[39m 13ms (unchanged)
[90mscripts/generate-routes.js[39m 2ms (unchanged)
[90mscripts/generate-tokens.mjs[39m 7ms (unchanged)
[90mscripts/production-ready.js[39m 19ms (unchanged)
[90mscripts/run-preview.mjs[39m 11ms (unchanged)
[90mscripts/test-build.mjs[39m 6ms (unchanged)
[90mscripts/validate-tests.mjs[39m 7ms (unchanged)
[90mscripts/verify-dist.mjs[39m 4ms (unchanged)
[90mshared/openrouter.ts[39m 4ms (unchanged)
[90mSpielerweiterung.md[39m 12ms (unchanged)
[90msrc/__tests__/apiKeyShim.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/AppShellLayout.test.tsx[39m 17ms (unchanged)
[90msrc/__tests__/branding.test.tsx[39m 4ms (unchanged)
[90msrc/__tests__/designTokens.test.ts[39m 3ms (unchanged)
[90msrc/__tests__/humanError.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/lib/imageUtils.test.ts[39m 28ms (unchanged)
[90msrc/__tests__/memory.test.ts[39m 3ms (unchanged)
[90msrc/__tests__/message-id-synchronization.test.ts[39m 22ms (unchanged)
[90msrc/__tests__/modelDefaults.test.ts[39m 3ms (unchanged)
[90msrc/__tests__/models-fallback.test.ts[39m 11ms (unchanged)
[90msrc/__tests__/models.cache.test.ts[39m 3ms (unchanged)
[90msrc/__tests__/networkBanner.test.tsx[39m 4ms (unchanged)
[90msrc/__tests__/openrouter.abort.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/openrouter.ndjson.test.ts[39m 3ms (unchanged)
[90msrc/__tests__/openrouter.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/pages/Chat.dedupe.test.ts[39m 20ms (unchanged)
[90msrc/__tests__/proxyFallback.test.ts[39m 12ms (unchanged)
[90msrc/__tests__/roleStore.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/sw-cache-management.test.ts[39m 10ms (unchanged)
[90msrc/__tests__/useChat.race-condition.test.ts[39m 17ms (unchanged)
[90msrc/__tests__/useSettings.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/viewport-scroll-performance.test.ts[39m 16ms (unchanged)
[90msrc/api/__tests__/visionClient.test.ts[39m 30ms (unchanged)
[90msrc/api/memory.ts[39m 8ms (unchanged)
[90msrc/api/openrouter.ts[39m 49ms (unchanged)
[90msrc/api/proxyClient.ts[39m 12ms (unchanged)
[90msrc/api/vision.ts[39m 8ms (unchanged)
[90msrc/App.tsx[39m 17ms (unchanged)
[90msrc/app/components/AnimatedLogo.tsx[39m 3ms (unchanged)
[90msrc/app/components/BrandWordmark.tsx[39m 2ms (unchanged)
[90msrc/app/components/RouteWrapper.tsx[39m 2ms (unchanged)
[90msrc/app/layouts/AppShell.tsx[39m 14ms (unchanged)
[90msrc/app/router.tsx[39m 11ms (unchanged)
[90msrc/components/branding/BrandIcon.tsx[39m 3ms (unchanged)
[90msrc/components/BuildInfo.tsx[39m 8ms (unchanged)
[90msrc/components/chat/__tests__/ChatMessage.test.tsx[39m 31ms (unchanged)
[90msrc/components/chat/__tests__/UnifiedInputBar.test.tsx[39m 24ms (unchanged)
[90msrc/components/chat/ChatMessage.tsx[39m 32ms (unchanged)
[90msrc/components/chat/ChatStatusBanner.tsx[39m 8ms (unchanged)
[90msrc/components/chat/ContextTray.tsx[39m 40ms (unchanged)
[90msrc/components/chat/UnifiedInputBar.tsx[39m 21ms (unchanged)
[90msrc/components/chat/VirtualizedMessageList.tsx[39m 15ms (unchanged)
[90msrc/components/dev/FeatureFlagPanel.tsx[39m 14ms (unchanged)
[90msrc/components/ErrorBoundary.tsx[39m 16ms (unchanged)
[90msrc/components/FullPageLoader.tsx[39m 3ms (unchanged)
[90msrc/components/game/CharacterSheet.tsx[39m 10ms (unchanged)
[90msrc/components/game/CombatTracker.tsx[39m 16ms (unchanged)
[90msrc/components/game/GameEffects.tsx[39m 11ms (unchanged)
[90msrc/components/game/GameHUD.tsx[39m 11ms (unchanged)
[90msrc/components/game/InventoryModal.tsx[39m 9ms (unchanged)
[90msrc/components/game/QuestTracker.tsx[39m 7ms (unchanged)
[90msrc/components/game/SkillTreeModal.tsx[39m 13ms (unchanged)
[90msrc/components/game/SurvivalBars.tsx[39m 10ms (unchanged)
[90msrc/components/game/SurvivalQuickActions.tsx[39m 7ms (unchanged)
[90msrc/components/game/TradeModal.tsx[39m 26ms (unchanged)
[90msrc/components/layout/AppMenuDrawer.tsx[39m 20ms (unchanged)
[90msrc/components/layout/BookLayout.tsx[39m 5ms (unchanged)
[90msrc/components/layout/ChatLayout.tsx[39m 4ms (unchanged)
[90msrc/components/layout/PageLayout.tsx[39m 10ms (unchanged)
[90msrc/components/models/__tests__/categorizeModelFromTags.test.ts[39m 3ms (unchanged)
[90msrc/components/models/__tests__/ModelsCatalog.test.tsx[39m 11ms (unchanged)
[90msrc/components/models/__tests__/resolveInitialModelId.test.ts[39m 2ms (unchanged)
[90msrc/components/models/EnhancedModelsInterface.tsx[39m 49ms (unchanged)
[90msrc/components/models/ModelComparisonTable.tsx[39m 9ms (unchanged)
[90msrc/components/models/ModelsCatalog.tsx[39m 41ms (unchanged)
[90msrc/components/models/resolveInitialModelId.ts[39m 2ms (unchanged)
[90msrc/components/navigation/AchievementSystem.tsx[39m 22ms (unchanged)
[90msrc/components/navigation/Bookmark.tsx[39m 2ms (unchanged)
[90msrc/components/navigation/BookPageAnimator.tsx[39m 1ms (unchanged)
[90msrc/components/navigation/Breadcrumbs.tsx[39m 7ms (unchanged)
[90msrc/components/navigation/HistorySidePanel.tsx[39m 12ms (unchanged)
[90msrc/components/navigation/index.ts[39m 1ms (unchanged)
[90msrc/components/navigation/MobileBackButton.tsx[39m 5ms (unchanged)
[90msrc/components/navigation/PageTransition.tsx[39m 5ms (unchanged)
[90msrc/components/navigation/PrimaryNavigation.tsx[39m 3ms (unchanged)
[90msrc/components/navigation/ReadingProgress.tsx[39m 11ms (unchanged)
[90msrc/components/navigation/SwipeHandler.tsx[39m 15ms (unchanged)
[90msrc/components/neko/__tests__/NekoLayer.test.tsx[39m 11ms (unchanged)
[90msrc/components/neko/__tests__/NekoSprite.test.tsx[39m 19ms (unchanged)
[90msrc/components/neko/NekoLayer.tsx[39m 7ms (unchanged)
[90msrc/components/neko/NekoSprite.tsx[39m 4ms (unchanged)
[90msrc/components/NetworkBanner.tsx[39m 3ms (unchanged)
[90msrc/components/pwa/PWADebugInfo.tsx[39m 10ms (unchanged)
[90msrc/components/pwa/PWAInstallPrompt.tsx[39m 6ms (unchanged)
[90msrc/components/roles/__tests__/EnhancedRolesInterface.test.tsx[39m 19ms (unchanged)
[90msrc/components/roles/EnhancedRolesInterface.tsx[39m 25ms (unchanged)
[90msrc/components/roles/roles-filter.ts[39m 9ms (unchanged)
[90msrc/components/StorageMigration.tsx[39m 22ms (unchanged)
[90msrc/config/behavior-presets.ts[39m 3ms (unchanged)
[90msrc/config/env.ts[39m 14ms (unchanged)
[90msrc/config/flags.ts[39m 11ms (unchanged)
[90msrc/config/modelDefaults.ts[39m 2ms (unchanged)
[90msrc/config/modelPolicy.ts[39m 4ms (unchanged)
[90msrc/config/modelPresets.ts[39m 8ms (unchanged)
[90msrc/config/models_metadata.json[39m 2ms (unchanged)
[90msrc/config/models.ts[39m 15ms (unchanged)
[90msrc/config/navigation.tsx[39m 4ms (unchanged)
[90msrc/config/promptTemplates.ts[39m 1ms (unchanged)
[90msrc/config/quickstarts.test.ts[39m 15ms (unchanged)
[90msrc/config/quickstarts.ts[39m 21ms (unchanged)
[90msrc/config/roleStore.ts[39m 14ms (unchanged)
[90msrc/config/settings.ts[39m 9ms (unchanged)
[90msrc/config/storageKeys.ts[39m 4ms (unchanged)
[90msrc/contexts/FavoritesContext.tsx[39m 15ms (unchanged)
[90msrc/contexts/GameContext.tsx[39m 8ms (unchanged)
[90msrc/contexts/ModelCatalogContext.tsx[39m 5ms (unchanged)
[90msrc/contexts/RolesContext.tsx[39m 6ms (unchanged)
[90msrc/contexts/SettingsContext.tsx[39m 21ms (unchanged)
[90msrc/data/roles.ts[39m 10ms (unchanged)
[90msrc/features/conspiracy/prompts.ts[39m 1ms (unchanged)
[90msrc/features/discussion/__tests__/shape.test.ts[39m 5ms (unchanged)
[90msrc/features/discussion/prompts.ts[39m 1ms (unchanged)
[90msrc/features/discussion/shape.ts[39m 8ms (unchanged)
[90msrc/features/prompt/composeSystemPrompt.ts[39m 4ms (unchanged)
[90msrc/features/registry/index.ts[39m 2ms (unchanged)
[90msrc/features/settings/components/AdvancedTuningPanel.tsx[39m 8ms (unchanged)
[90msrc/features/settings/components/AppearanceSettingsPanel.tsx[39m 4ms (unchanged)
[90msrc/features/settings/components/MetaPresetCard.tsx[39m 2ms (unchanged)
[90msrc/features/settings/components/SettingsAccordion.tsx[39m 2ms (unchanged)
[90msrc/features/settings/constants.ts[39m 3ms (unchanged)
[90msrc/features/settings/hooks/useBehaviorSettings.ts[39m 5ms (unchanged)
[90msrc/features/settings/SettingsApiDataView.tsx[39m 25ms (unchanged)
[90msrc/features/settings/SettingsAppearanceView.tsx[39m 5ms (unchanged)
[90msrc/features/settings/SettingsBehaviorView.tsx[39m 4ms (unchanged)
[90msrc/features/settings/SettingsExtrasView.tsx[39m 5ms (unchanged)
[90msrc/features/settings/SettingsLayout.tsx[39m 5ms (unchanged)
[90msrc/features/settings/SettingsMemoryView.tsx[39m 10ms (unchanged)
[90msrc/features/settings/SettingsYouthFilterView.tsx[39m 8ms (unchanged)
[90msrc/features/settings/TabbedSettingsView.tsx[39m 5ms (unchanged)
[90msrc/hooks/__tests__/useBookNavigation.test.ts[39m 8ms (unchanged)
[90msrc/hooks/__tests__/useChat.systemPrompt.test.ts[39m 10ms (unchanged)
[90msrc/hooks/__tests__/useConversationHistory.test.ts[39m 24ms (unchanged)
[90msrc/hooks/__tests__/useConversationManager.test.ts[39m 25ms (unchanged)
[90msrc/hooks/__tests__/useGameState.test.ts[39m 18ms (unchanged)
[90msrc/hooks/__tests__/useNeko.test.ts[39m 12ms (unchanged)
[90msrc/hooks/use-storage.ts[39m 16ms (unchanged)
[90msrc/hooks/useBookNavigation.ts[39m 12ms (unchanged)
[90msrc/hooks/useChat.ts[39m 32ms (unchanged)
[90msrc/hooks/useChatPageLogic.ts[39m 22ms (unchanged)
[90msrc/hooks/useChatQuickstart.ts[39m 3ms (unchanged)
[90msrc/hooks/useConversationHistory.ts[39m 4ms (unchanged)
[90msrc/hooks/useConversationManager.ts[39m 27ms (unchanged)
[90msrc/hooks/useDeferredFetch.ts[39m 24ms (unchanged)
[90msrc/hooks/useFavoritesManager.ts[39m 36ms (unchanged)
[90msrc/hooks/useFeatureFlags.tsx[39m 11ms (unchanged)
[90msrc/hooks/useFilteredList.ts[39m 2ms (unchanged)
[90msrc/hooks/useGameEngine.ts[39m 21ms (unchanged)
[90msrc/hooks/useGameState.ts[39m 84ms (unchanged)
[90msrc/hooks/useImageAttachment.ts[39m 8ms (unchanged)
[90msrc/hooks/useIntersectionObserver.ts[39m 3ms (unchanged)
[90msrc/hooks/useMemory.ts[39m 4ms (unchanged)
[90msrc/hooks/useNeko.ts[39m 16ms (unchanged)
[90msrc/hooks/usePWAInstall.ts[39m 4ms (unchanged)
[90msrc/hooks/useReducedMotion.ts[39m 2ms (unchanged)
[90msrc/hooks/useServiceWorker.ts[39m 4ms (unchanged)
[90msrc/hooks/useSettings.ts[39m 1ms (unchanged)
[90msrc/hooks/useStickToBottom.ts[39m 7ms (unchanged)
[90msrc/hooks/useVisualViewport.ts[39m 4ms (unchanged)
[90msrc/index.css[39m 64ms (unchanged)
[90msrc/lib/__tests__/creativity.test.ts[39m 4ms (unchanged)
[90msrc/lib/__tests__/deepClone.test.ts[39m 8ms (unchanged)
[90msrc/lib/__tests__/imageProcessor.test.ts[39m 17ms (unchanged)
[90msrc/lib/a11y/touchTargets.ts[39m 19ms (unchanged)
[90msrc/lib/accessibility.ts[39m 17ms (unchanged)
[90msrc/lib/analytics.test.ts[39m 10ms (unchanged)
[90msrc/lib/analytics.ts[39m 19ms (unchanged)
[90msrc/lib/categoryColors.ts[39m 12ms (unchanged)
[90msrc/lib/chat/__tests__/validation.test.ts[39m 4ms (unchanged)
[90msrc/lib/chat/prompt-builder.ts[39m 3ms (unchanged)
[90msrc/lib/chat/validation.ts[39m 3ms (unchanged)
[90msrc/lib/conversation-manager-modern.ts[39m 10ms (unchanged)
[90msrc/lib/creativity.ts[39m 5ms (unchanged)
[90msrc/lib/css-feature-detection.ts[39m 2ms (unchanged)
[90msrc/lib/device-safe-area.ts[39m 7ms (unchanged)
[90msrc/lib/errors/__tests__/mapper.test.ts[39m 7ms (unchanged)
[90msrc/lib/errors/errorHandler.ts[39m 4ms (unchanged)
[90msrc/lib/errors/humanError.ts[39m 5ms (unchanged)
[90msrc/lib/errors/index.ts[39m 1ms (unchanged)
[90msrc/lib/errors/mapper.ts[39m 4ms (unchanged)
[90msrc/lib/errors/types.ts[39m 5ms (unchanged)
[90msrc/lib/feedback/imageUtils.ts[39m 13ms (unchanged)
[90msrc/lib/http.ts[39m 8ms (unchanged)
[90msrc/lib/icons/disa.tsx[39m 3ms (unchanged)
[90msrc/lib/icons/index.ts[39m 4ms (unchanged)
[90msrc/lib/imageProcessor.ts[39m 12ms (unchanged)
[90msrc/lib/memory/memoryService.test.ts[39m 25ms (unchanged)
[90msrc/lib/memory/memoryService.ts[39m 3ms (unchanged)
[90msrc/lib/modelCapabilities.ts[39m 2ms (unchanged)
[90msrc/lib/monitoring/README.md[39m 17ms (unchanged)
[90msrc/lib/monitoring/sentry.tsx[39m 13ms (unchanged)
[90msrc/lib/net/concurrency.ts[39m 5ms (unchanged)
[90msrc/lib/net/fetchTimeout.ts[39m 7ms (unchanged)
[90msrc/lib/net/rateLimit.ts[39m 3ms (unchanged)
[90msrc/lib/openrouter/__tests__/key.test.ts[39m 3ms (unchanged)
[90msrc/lib/openrouter/__tests__/keyLifecycle.test.ts[39m 11ms (unchanged)
[90msrc/lib/openrouter/key.ts[39m 5ms (unchanged)
[90msrc/lib/pricing.ts[39m 4ms (unchanged)
[90msrc/lib/publicAssets.ts[39m 2ms (unchanged)
[90msrc/lib/pwa/registerSW.ts[39m 13ms (unchanged)
[90msrc/lib/pwa/SW_VERSIONING_README.md[39m 33ms (unchanged)
[90msrc/lib/recovery/resetApp.ts[39m 3ms (unchanged)
[90msrc/lib/safeStorage.test.ts[39m 11ms (unchanged)
[90msrc/lib/safeStorage.ts[39m 4ms (unchanged)
[90msrc/lib/storage-layer.ts[39m 44ms (unchanged)
[90msrc/lib/storage-migration.ts[39m 23ms (unchanged)
[90msrc/lib/touch/__tests__/gestures.test.ts[39m 17ms (unchanged)
[90msrc/lib/touch/__tests__/haptics.test.ts[39m 22ms (unchanged)
[90msrc/lib/touch/gestures.ts[39m 11ms (unchanged)
[90msrc/lib/touch/haptics.ts[39m 7ms (unchanged)
[90msrc/lib/utils.ts[39m 5ms (unchanged)
[90msrc/lib/utils/categoryAccents.ts[39m 6ms (unchanged)
[90msrc/lib/utils/debounce.ts[39m 3ms (unchanged)
[90msrc/lib/utils/production-logger.ts[39m 10ms (unchanged)
[90msrc/lib/utils/reload-manager.ts[39m 1ms (unchanged)
[90msrc/lib/validators/roles.ts[39m 6ms (unchanged)
[90msrc/main.tsx[39m 26ms (unchanged)
[90msrc/pages/Chat.tsx[39m 19ms (unchanged)
[90msrc/pages/ChatHistoryPage.tsx[39m 7ms (unchanged)
[90msrc/pages/DatenschutzPage.tsx[39m 21ms (unchanged)
[90msrc/pages/FeedbackPage.tsx[39m 24ms (unchanged)
[90msrc/pages/GamePage.tsx[39m 2ms (unchanged)
[90msrc/pages/GamePageContent.tsx[39m 14ms (unchanged)
[90msrc/pages/ImpressumPage.tsx[39m 3ms (unchanged)
[90msrc/pages/ModelsPage.tsx[39m 1ms (unchanged)
[90msrc/pages/RolesPage.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsApiData.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsAppearance.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsBehavior.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsExtras.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsMemory.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsOverviewPage.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsYouthFilter.tsx[39m 1ms (unchanged)
[90msrc/pages/ThemenPage.tsx[39m 11ms (unchanged)
[90msrc/prompts/discussion/presets.ts[39m 2ms (unchanged)
[90msrc/state/chatReducer.ts[39m 4ms (unchanged)
[90msrc/styles/__tests__/animations.test.ts[39m 9ms (unchanged)
[90msrc/styles/DESIGN_SYSTEM.md[39m 47ms (unchanged)
[90msrc/styles/design-system-tokens.css[39m 12ms (unchanged)
[90msrc/styles/design-tokens.ts[39m 5ms (unchanged)
[90msrc/styles/interactive-states.css[39m 32ms (unchanged)
[90msrc/styles/page-spacing.css[39m 33ms (unchanged)
[90msrc/styles/README.md[39m 5ms (unchanged)
[90msrc/styles/theme-variants.ts[39m 5ms (unchanged)
[90msrc/styles/theme.ts[39m 8ms (unchanged)
[90msrc/styles/tokens/card.ts[39m 4ms (unchanged)
[90msrc/styles/tokens/category-colors.ts[39m 5ms (unchanged)
[90msrc/styles/tokens/category-tonal-scales.ts[39m 19ms (unchanged)
[90msrc/styles/tokens/color.ts[39m 20ms (unchanged)
[90msrc/styles/tokens/frame.ts[39m 4ms (unchanged)
[90msrc/styles/tokens/motion.ts[39m 2ms (unchanged)
[90msrc/styles/tokens/radius.ts[39m 5ms (unchanged)
[90msrc/styles/tokens/shadow.ts[39m 7ms (unchanged)
[90msrc/styles/tokens/spacing.ts[39m 8ms (unchanged)
[90msrc/styles/tokens/typography.ts[39m 11ms (unchanged)
[90msrc/styles/ui-state-animations.css[39m 63ms (unchanged)
[90msrc/styles/z-index-system.css[39m 4ms (unchanged)
[90msrc/types/BookNavigation.ts[39m 1ms (unchanged)
[90msrc/types/chat.ts[39m 1ms (unchanged)
[90msrc/types/chatMessage.ts[39m 1ms (unchanged)
[90msrc/types/enhanced-interfaces.ts[39m 19ms (unchanged)
[90msrc/types/index.ts[39m 2ms (unchanged)
[90msrc/types/openrouter.ts[39m 4ms (unchanged)
[90msrc/types/prism-modules.d.ts[39m 1ms (unchanged)
[90msrc/ui/__tests__/Button.test.tsx[39m 3ms (unchanged)
[90msrc/ui/ActionCard.tsx[39m 4ms (unchanged)
[90msrc/ui/AnimatedBrandmark.tsx[39m 3ms (unchanged)
[90msrc/ui/Avatar.tsx[39m 3ms (unchanged)
src/ui/Badge.tsx 2ms
[90msrc/ui/BottomSheet.tsx[39m 5ms (unchanged)
src/ui/BrandCard.tsx 6ms
src/ui/Button.tsx 4ms
src/ui/Card.tsx 19ms
[90msrc/ui/Chip.tsx[39m 4ms (unchanged)
src/ui/CopyButton.tsx 10ms
[90msrc/ui/Dialog.tsx[39m 10ms (unchanged)
[90msrc/ui/DropdownMenu.tsx[39m 6ms (unchanged)
[90msrc/ui/FilterChip.tsx[39m 4ms (unchanged)
[90msrc/ui/IconButton.tsx[39m 4ms (unchanged)
[90msrc/ui/index.ts[39m 2ms (unchanged)
src/ui/Input.tsx 2ms
[90msrc/ui/Label.tsx[39m 3ms (unchanged)
[90msrc/ui/ListItem.tsx[39m 5ms (unchanged)
[90msrc/ui/MaterialCard.tsx[39m 2ms (unchanged)
[90msrc/ui/MaterialPanel.tsx[39m 2ms (unchanged)
[90msrc/ui/MetricRow.tsx[39m 4ms (unchanged)
[90msrc/ui/ModelCard.tsx[39m 6ms (unchanged)
src/ui/NotchFrame.tsx 5ms
[90msrc/ui/PageComponents.tsx[39m 7ms (unchanged)
[90msrc/ui/PremiumCard.tsx[39m 6ms (unchanged)
src/ui/PrimaryButton.tsx 2ms
[90msrc/ui/Progress.tsx[39m 2ms (unchanged)
[90msrc/ui/QuickStartCard.tsx[39m 3ms (unchanged)
[90msrc/ui/RoleCard.tsx[39m 3ms (unchanged)
[90msrc/ui/SearchInput.tsx[39m 3ms (unchanged)
[90msrc/ui/SectionHeader.tsx[39m 2ms (unchanged)
[90msrc/ui/Select.tsx[39m 8ms (unchanged)
[90msrc/ui/SettingsRow.tsx[39m 3ms (unchanged)
[90msrc/ui/Skeleton.tsx[39m 1ms (unchanged)
[90msrc/ui/Switch.tsx[39m 2ms (unchanged)
[90msrc/ui/Table.tsx[39m 5ms (unchanged)
[90msrc/ui/Textarea.tsx[39m 2ms (unchanged)
[90msrc/ui/toast/index.tsx[39m 9ms (unchanged)
[90msrc/ui/Tooltip.tsx[39m 2ms (unchanged)
[90msrc/ui/Typography.tsx[39m 4ms (unchanged)
[90msrc/vitest-env.d.ts[39m 1ms (unchanged)
[90mtailwind.config.ts[39m 16ms (unchanged)
[90mtest-vision-api.js[39m 7ms (unchanged)
[90mtests/e2e/api-mock.ts[39m 4ms (unchanged)
[90mtests/e2e/book-concept.spec.ts[39m 7ms (unchanged)
[90mtests/e2e/chat.smoke.spec.ts[39m 8ms (unchanged)
[90mtests/e2e/cross-browser/firefox.spec.ts[39m 15ms (unchanged)
[90mtests/e2e/global-setup.ts[39m 5ms (unchanged)
[90mtests/e2e/global-teardown.ts[39m 5ms (unchanged)
[90mtests/e2e/helpers/app-helpers.ts[39m 11ms (unchanged)
[90mtests/e2e/live/live-visual.spec.ts[39m 8ms (unchanged)
[90mtests/e2e/live/README.md[39m 4ms (unchanged)
[90mtests/e2e/models-roles.spec.ts[39m 11ms (unchanged)
[90mtests/e2e/performance/lighthouse.spec.ts[39m 18ms (unchanged)
[90mtests/e2e/phone-frame.spec.ts[39m 10ms (unchanged)
[90mtests/e2e/reporting/dashboard.html[39m 46ms (unchanged)
[90mtests/e2e/reporting/html-reporter.ts[39m 32ms (unchanged)
[90mtests/e2e/unified-layout.spec.ts[39m 15ms (unchanged)
[90mtests/e2e/utils.ts[39m 3ms (unchanged)
[90mtests/e2e/visual/comparator.ts[39m 14ms (unchanged)
[90mtests/e2e/visual/visual-audit.spec.ts[39m 5ms (unchanged)
[90mtests/integration/mobile-animations.test.ts[39m 13ms (unchanged)
[90mtests/MOBILE_ANIMATIONS_TESTS.md[39m 34ms (unchanged)
[90mtests/polyfills.ts[39m 4ms (unchanged)
[90mtests/README_RUN_TESTS.md[39m 28ms (unchanged)
[90mtests/setup.ts[39m 10ms (unchanged)
[90mtests/setup/fetch.ts[39m 2ms (unchanged)
[90mtests/smoke/app.test.tsx[39m 5ms (unchanged)
[90mtests/smoke/entrypoints.smoke.test.tsx[39m 11ms (unchanged)
[90mtests/unit/composeSystemPrompt.test.ts[39m 2ms (unchanged)
[90mtests/unit/copyButton.test.tsx[39m 7ms (unchanged)
[90mtests/unit/ErrorBoundary.test.tsx[39m 6ms (unchanged)
[90mtests/unit/lib/conversation-manager-modern.test.ts[39m 24ms (unchanged)
[90mtests/unit/lib/export-validation.test.ts[39m 3ms (unchanged)
[90mtests/unit/lib/storage-integration.test.ts[39m 9ms (unchanged)
[90mtests/unit/lib/storage-layer-business.test.ts[39m 26ms (unchanged)
[90mtests/unit/lib/storage-layer-simple.test.ts[39m 27ms (unchanged)
[90mtests/unit/lib/storage-layer.test.ts[39m 26ms (unchanged)
[90mtests/unit/lib/storage-migration-integration.test.ts[39m 8ms (unchanged)
[90mtests/unit/lib/storage-migration.test.ts[39m 35ms (unchanged)
[90mtests/unit/lib/storage-performance-simple.test.ts[39m 23ms (unchanged)
[90mtests/unit/lib/storage-performance.test.ts[39m 20ms (unchanged)
[90mtests/unit/rateLimit.test.ts[39m 2ms (unchanged)
[90mtests/unit/useChat.test.tsx[39m 6ms (unchanged)
[90mtools/cf-purge.js[39m 11ms (unchanged)
[90mtools/check-css-hex.mjs[39m 4ms (unchanged)
[90mtools/mcp/mcp.config.template.json[39m 1ms (unchanged)
[90mtools/mcp/README.md[39m 6ms (unchanged)
[90mtools/visual-mcp.ts[39m 10ms (unchanged)
[90mtools/zai-vision-mcp.ts[39m 6ms (unchanged)
[90mtsconfig.base.json[39m 1ms (unchanged)
[90mtsconfig.build.json[39m 1ms (unchanged)
[90mtsconfig.json[39m 1ms (unchanged)
[90mtsconfig.node.json[39m 1ms (unchanged)
[90mtsconfig.test.json[39m 1ms (unchanged)
[90mVISION_ANALYSIS_REPORT.md[39m 59ms (unchanged)
[90mvite-env.d.ts[39m 3ms (unchanged)
[90mvite.config.ts[39m 14ms (unchanged)
[90mvitest.config.ts[39m 3ms (unchanged)
Checking for unused imports...
npm warn config production Use `--omit=dev` instead.
npm warn exec The following package was not found and will be installed: ts-unused-exports@11.0.1
100 modules with unused exports
/home/runner/work/Disa_Ai/Disa_Ai/src/api/openrouter.ts: checkApiHealth, pingOpenRouter
/home/runner/work/Disa_Ai/Disa_Ai/src/api/vision.ts: VisionRequest, VisionErrorResponse
/home/runner/work/Disa_Ai/Disa_Ai/src/components/navigation/index.ts: AchievementSystem, Bookmark, HistorySidePanel, PageTransition, ReadingProgress, SwipeHandler
/home/runner/work/Disa_Ai/Disa_Ai/src/config/behavior-presets.ts: BehaviorPresetConfig, BehaviorPresetId
/home/runner/work/Disa_Ai/Disa_Ai/src/config/env.ts: EnvConfig, getEnvironmentWarnings
/home/runner/work/Disa_Ai/Disa_Ai/src/config/flags.ts: defaultFeatureFlags, FeatureFlagMeta
/home/runner/work/Disa_Ai/Disa_Ai/src/config/modelPolicy.ts: ModelPolicy
/home/runner/work/Disa_Ai/Disa_Ai/src/config/modelPresets.ts: LegacyModelOption, LEGACY_MODEL_PRESETS, buildLegacyModelOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/config/models.ts: Price, CatalogOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/config/promptTemplates.ts: RoleTemplate, fetchRoleTemplates, getRoleLoadStatus, listRoleTemplates
/home/runner/work/Disa_Ai/Disa_Ai/src/config/roleStore.ts: getRoleTemplates, getRoleState
/home/runner/work/Disa_Ai/Disa_Ai/src/config/settings.ts: getCtxReservedTokens, setCtxReservedTokens, getComposerOffset, setComposerOffset, getFontSize, setFontSize, getReduceMotion, setReduceMotion, getHapticFeedback, setHapticFeedback, getDiscussionPreset, setDiscussionPreset, getDiscussionStrictMode, setDiscussionStrictMode, getDiscussionMaxSentences, setDiscussionMaxSentences
/home/runner/work/Disa_Ai/Disa_Ai/src/config/storageKeys.ts: SESSION_STORAGE_KEYS
/home/runner/work/Disa_Ai/Disa_Ai/src/data/roles.ts: getRoleById, getRolesByCategory, getCategories
/home/runner/work/Disa_Ai/Disa_Ai/src/features/discussion/shape.ts: DiscussionShapeOptions, DiscussionShapeResult
/home/runner/work/Disa_Ai/Disa_Ai/src/features/prompt/composeSystemPrompt.ts: composeSystemPrompt
/home/runner/work/Disa_Ai/Disa_Ai/src/features/registry/index.ts: GameScenario
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/use-storage.ts: UseConversationsOptions, UseConversationsReturn, useConversations, UseConversationReturn, useConversation, UseConversationStatsReturn, UseStorageMigrationReturn, UseStorageHealthReturn, useBulkOperations
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useChat.ts: UseChatOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useDeferredFetch.ts: useDeferredLoad, useDeferredCachedFetch, getDeferredFetchStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useFavoritesManager.ts: useFavoriteStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useGameEngine.ts: GameEngineConfig
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useGameState.ts: ItemSchema, QuestSchema, CharacterStatsSchema, CharacterStats, CombatActionSchema, EnemySchema, CombatStateSchema, CombatState, SkillSchema, SkillTreeSchema, SkillTree, TradeOfferSchema, TradeHistorySchema, TradeStateSchema, TradeState, SurvivalStateSchema, GameStateSchema, DEFAULT_GAME_STATE
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useImageAttachment.ts: UseImageAttachmentOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useNeko.ts: NekoController
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useReducedMotion.ts: useReducedMotion
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/analytics.ts: AnalyticsEvent, AnalyticsSession, AnalyticsStats
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/categoryColors.ts: CategoryColorTheme, getCycleColor
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/conversation-manager-modern.ts: ExportData, ImportResult, bulkUpdateConversations, cleanupOldConversations, exportConversations, importConversations, getConversationById, migrateFromLocalStorage, getStoragePerformance
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/http.ts: FetchJsonOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/imageProcessor.ts: MAX_DIMENSION, JPEG_QUALITY
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
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/feedback/imageUtils.ts: ImageValidationResult
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/icons/index.ts: AppWindow, Code, FileText, Filter, Hash, Link2, Loader2, MessageCircle, Mic, Paperclip, PenSquare, Pin, PinOff, Plus, Square, SunMedium, ThumbsDown, ThumbsUp, ZapOff
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/concurrency.ts: ConcurrencyManager
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/fetchTimeout.ts: FetchWithTimeoutOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/rateLimit.ts: TokenBucket
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/pwa/registerSW.ts: BUILD_TOKEN, RegisterResult
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/gestures.ts: TouchGestureOptions, SwipeEvent, TapEvent, ensureTouchTarget, debouncedTouch
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/haptics.ts: HapticOptions, HapticPattern, isHapticSupported, prefersReducedMotion, triggerHaptic, withHaptic, addHapticToElement
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/utils/categoryAccents.ts: RoleCategory, AccentName, getRoleCategoryAccent, getThemeCategoryAccent, getCategoryCardClasses, getCategoryAccent, getAccentVariants
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/utils/debounce.ts: debounce
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/utils/production-logger.ts: devLog, prodError, safeLog, safeDebug
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/validators/roles.ts: SafetyLevel, parseRolesStrict
/home/runner/work/Disa_Ai/Disa_Ai/src/state/chatReducer.ts: ChatState, ChatAction
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/design-tokens.ts: DesignTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/theme-variants.ts: AccentName
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/theme.ts: ColorMode, ThemeState
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/card.ts: CardTokens, cardCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/category-colors.ts: categoryColorTokens, categoryTokensCSS, CategoryKey, CATEGORY_KEYS
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/category-tonal-scales.ts: categoryTonalScales, categoryTonalTokensCSS, CategoryKey, CATEGORY_KEYS, TONAL_LEVELS, TonalLevel
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/color.ts: SurfaceTokens, CardBrandingTokens, TextTokens, BorderTokens, BrandTokens, StatusTokenSet, StatusTokens, ActionTokens, ControlTokens, TableTokens, OverlayTokens, ColorScheme, colorCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/frame.ts: FrameTokens, frameCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/motion.ts: DurationTokens, EasingTokens, MotionTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/radius.ts: RadiusTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/shadow.ts: ShadowTokens, shadowCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/spacing.ts: SpacingScale, SemanticSpacing, TouchTargets, FixedSizes, SpacingTokens, spacingCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/typography.ts: FontStackTokens, TextStyle, TypographyTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/types/BookNavigation.ts: SwipeStack
/home/runner/work/Disa_Ai/Disa_Ai/src/types/chat.ts: Role
/home/runner/work/Disa_Ai/Disa_Ai/src/types/chatMessage.ts: MessageAttachment, ChatMessageRole
/home/runner/work/Disa_Ai/Disa_Ai/src/types/enhanced-interfaces.ts: RoleCategory, PerformanceMetrics, SearchResult, UIState, migrateModel, isEnhancedRole, isEnhancedModel
/home/runner/work/Disa_Ai/Disa_Ai/src/types/index.ts: Role, Message, MessageRole, ChatSession
/home/runner/work/Disa_Ai/Disa_Ai/src/types/openrouter.ts: OpenRouterMessage, OpenRouterError, OpenRouterChoice, OpenRouterUsage, OpenRouterModel, OpenRouterModelsResponse, OpenRouterChatRequest
/home/runner/work/Disa_Ai/Disa_Ai/src/ui/index.ts: ActionCard, Avatar, AvatarFallback, AvatarImage, BadgeProps, badgeVariants, BrandCardProps, BrandCard, ButtonProps, buttonVariants, CardProps, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Chip, CopyButton, DialogClose, DialogFooter, DialogOverlay, DialogPortal, DialogTrigger, IconButton, InputProps, inputVariants, ListItem, ListGroup, MaterialPanel, MetricRow, ModelCard, PrimaryButtonProps, QuickStartCard, RoleCard, SectionHeader, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue, SettingsRow, SettingsToggleRow, SettingsSection, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, TextareaProps, Textarea, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TypographyVariant, TypographyElement, Typography
/home/runner/work/Disa_Ai/Disa_Ai/src/app/router.tsx: appRouter
/home/runner/work/Disa_Ai/Disa_Ai/src/app/components/AnimatedLogo.tsx: AnimatedLogoProps
/home/runner/work/Disa_Ai/Disa_Ai/src/app/components/BrandWordmark.tsx: BrandWordmarkProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/BuildInfo.tsx: BuildInfo
/home/runner/work/Disa_Ai/Disa_Ai/src/components/NetworkBanner.tsx: default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/branding/BrandIcon.tsx: BrandIcon
/home/runner/work/Disa_Ai/Disa_Ai/src/components/dev/FeatureFlagPanel.tsx: FeatureFlagIndicator
/home/runner/work/Disa_Ai/Disa_Ai/src/components/game/CharacterSheet.tsx: CharacterSheet
/home/runner/work/Disa_Ai/Disa_Ai/src/components/game/SkillTreeModal.tsx: SkillTreeModal
/home/runner/work/Disa_Ai/Disa_Ai/src/components/game/SurvivalBars.tsx: SurvivalBars
/home/runner/work/Disa_Ai/Disa_Ai/src/components/game/SurvivalQuickActions.tsx: SurvivalQuickActions
/home/runner/work/Disa_Ai/Disa_Ai/src/components/game/TradeModal.tsx: TradeModal
/home/runner/work/Disa_Ai/Disa_Ai/src/components/layout/BookLayout.tsx: BookLayout
/home/runner/work/Disa_Ai/Disa_Ai/src/components/layout/ChatLayout.tsx: ChatLayout
/home/runner/work/Disa_Ai/Disa_Ai/src/components/layout/PageLayout.tsx: PageLayoutProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/models/EnhancedModelsInterface.tsx: modelEntryToEnhanced, EnhancedModelsInterface, default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/navigation/BookPageAnimator.tsx: BookPageAnimator
/home/runner/work/Disa_Ai/Disa_Ai/src/components/navigation/Breadcrumbs.tsx: useBreadcrumbs, Breadcrumbs, AutoBreadcrumbs
/home/runner/work/Disa_Ai/Disa_Ai/src/components/navigation/MobileBackButton.tsx: useMobileBackNavigation, useSmartBack
/home/runner/work/Disa_Ai/Disa_Ai/src/components/pwa/PWADebugInfo.tsx: PWADebugInfo
/home/runner/work/Disa_Ai/Disa_Ai/src/components/pwa/PWAInstallPrompt.tsx: PWAInstallPrompt
/home/runner/work/Disa_Ai/Disa_Ai/src/contexts/FavoritesContext.tsx: useFavoriteActions, useFavoriteLists, useFavoritesAnalytics, withFavorites, FavoritesLoader
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useFeatureFlags.tsx: useFeatureFlag, useFeatureFlags, useAnyFeatureFlags, useAllFeatureFlags, useActiveFeatureFlags, withFeatureFlag
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/monitoring/sentry.tsx: captureError, addBreadcrumb, setUserContext, profileFunction
/home/runner/work/Disa_Ai/Disa_Ai/src/ui/NotchFrame.tsx: NotchFrameProps, NotchFrame, notchFrameClasses, notchFrameVariants
Running local maintenance scripts...
Running verify-dist.mjs...
🚫 dist-Verzeichnis fehlt: /home/runner/work/Disa_Ai/Disa_Ai/dist
Building project...
Running vite build...
npm warn config production Use `--omit=dev` instead.
[36mvite v7.2.4 [32mbuilding client environment for production...[36m[39m
transforming...

[1m[33mwarn[39m[22m - The class `duration-[var(--frame-transition-duration)]` is ambiguous and matches multiple utilities.
[1m[33mwarn[39m[22m - If this is content and not a class, replace it with `duration-&lsqb;var(--frame-transition-duration)&rsqb;` to silence this warning.

[1m[33mwarn[39m[22m - The class `ease-[var(--frame-transition-easing)]` is ambiguous and matches multiple utilities.
[1m[33mwarn[39m[22m - If this is content and not a class, replace it with `ease-&lsqb;var(--frame-transition-easing)&rsqb;` to silence this warning.

[1m[33mwarn[39m[22m - The class `duration-[var(--frame-transition-duration)]` is ambiguous and matches multiple utilities.
[1m[33mwarn[39m[22m - If this is content and not a class, replace it with `duration-&lsqb;var(--frame-transition-duration)&rsqb;` to silence this warning.

[1m[33mwarn[39m[22m - The class `ease-[var(--frame-transition-easing)]` is ambiguous and matches multiple utilities.
[1m[33mwarn[39m[22m - If this is content and not a class, replace it with `ease-&lsqb;var(--frame-transition-easing)&rsqb;` to silence this warning.
[32m✓[39m 2379 modules transformed.
rendering chunks...
[2mdist/[22m[32mindex.html                                    [39m[1m[2m 26.43 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/index-DNlokG3E.css                 [39m[1m[2m127.14 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/main-BWkV7lEF.css                  [39m[1m[2m140.16 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/reload-manager-DqJ_LRMs.js          [39m[1m[2m  0.25 kB[22m[1m[22m[2m │ map:     0.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/briefcase-DCqq2crF.js               [39m[1m[2m  0.26 kB[22m[1m[22m[2m │ map:     1.02 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/download-DrQ8UWc_.js                [39m[1m[2m  0.28 kB[22m[1m[22m[2m │ map:     1.04 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/zap-lyEcuNPu.js                     [39m[1m[2m  0.30 kB[22m[1m[22m[2m │ map:     0.94 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/refresh-cw-DkhBrpK9.js              [39m[1m[2m  0.36 kB[22m[1m[22m[2m │ map:     1.20 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/trash-2-DJAcRuF_.js                 [39m[1m[2m  0.37 kB[22m[1m[22m[2m │ map:     1.25 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/book-open-check-Db2EEYy6.js         [39m[1m[2m  0.39 kB[22m[1m[22m[2m │ map:     1.21 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/constants-DQ6Hw9N3.js               [39m[1m[2m  0.42 kB[22m[1m[22m[2m │ map:     1.91 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/trending-up-MR8wCgDm.js             [39m[1m[2m  0.43 kB[22m[1m[22m[2m │ map:     1.73 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-BGZ8t_bg.js                   [39m[1m[2m  1.33 kB[22m[1m[22m[2m │ map:     3.06 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SearchInput-BGKXyrxV.js             [39m[1m[2m  1.64 kB[22m[1m[22m[2m │ map:     5.58 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsExtras-URnZ_hCB.js          [39m[1m[2m  2.51 kB[22m[1m[22m[2m │ map:     4.93 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/roleStore-AdHrkesH.js               [39m[1m[2m  2.61 kB[22m[1m[22m[2m │ map:    11.52 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ImpressumPage-DS11Now1.js           [39m[1m[2m  2.65 kB[22m[1m[22m[2m │ map:     4.53 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsOverviewPage-CYk8FfuC.js    [39m[1m[2m  2.71 kB[22m[1m[22m[2m │ map:     6.93 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/PageComponents-DMJT_Snj.js          [39m[1m[2m  2.88 kB[22m[1m[22m[2m │ map:     8.48 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-DNHJJznl.js                   [39m[1m[2m  2.93 kB[22m[1m[22m[2m │ map:     1.47 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsLayout-BOkPTbQu.js          [39m[1m[2m  3.01 kB[22m[1m[22m[2m │ map:     8.54 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsAppearance-Ja6Qa3Rz.js      [39m[1m[2m  3.09 kB[22m[1m[22m[2m │ map:     8.06 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ChatHistoryPage-Dq_HqeSP.js         [39m[1m[2m  3.42 kB[22m[1m[22m[2m │ map:     8.55 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsYouthFilter-ooF26obs.js     [39m[1m[2m  3.82 kB[22m[1m[22m[2m │ map:     9.10 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/FeatureFlagPanel-Cexnv_sq.js        [39m[1m[2m  4.39 kB[22m[1m[22m[2m │ map:    15.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ThemenPage-0qk5v1zA.js              [39m[1m[2m  5.02 kB[22m[1m[22m[2m │ map:    12.08 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsMemory-CkxNV4R-.js          [39m[1m[2m  6.55 kB[22m[1m[22m[2m │ map:    17.17 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/use-storage-Bqf16zOa.js             [39m[1m[2m  8.30 kB[22m[1m[22m[2m │ map:    36.59 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsBehavior-Bdb_Yp_F.js        [39m[1m[2m  8.72 kB[22m[1m[22m[2m │ map:    24.91 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/FeedbackPage-WzB5uyAm.js            [39m[1m[2m 11.73 kB[22m[1m[22m[2m │ map:    38.60 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ModelsPage-BAEWfu9n.js              [39m[1m[2m 12.59 kB[22m[1m[22m[2m │ map:    43.37 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/RolesPage-DeCXedM8.js               [39m[1m[2m 14.39 kB[22m[1m[22m[2m │ map:    62.78 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/DatenschutzPage-082eifqK.js         [39m[1m[2m 17.31 kB[22m[1m[22m[2m │ map:    28.91 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsApiData--nk0VSZb.js         [39m[1m[2m 21.13 kB[22m[1m[22m[2m │ map:    61.01 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/utils-vendor-BAeEp5cw.js            [39m[1m[2m 26.37 kB[22m[1m[22m[2m │ map:   144.60 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/VirtualizedMessageList-Che4M1j6.js  [39m[1m[2m 30.50 kB[22m[1m[22m[2m │ map:   105.81 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DHL3LX0P.js               [39m[1m[2m 39.64 kB[22m[1m[22m[2m │ map:   203.23 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/router-vendor-CHigJQI9.js           [39m[1m[2m 86.50 kB[22m[1m[22m[2m │ map:   534.77 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/GamePage-Cz2vr4uf.js                [39m[1m[2m130.58 kB[22m[1m[22m[2m │ map:   620.65 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-B9D_A6Vq.js            [39m[1m[2m141.18 kB[22m[1m[22m[2m │ map:   344.91 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/main-BzBDCDYA.js                    [39m[1m[2m408.63 kB[22m[1m[22m[2m │ map: 1,531.90 kB[22m
[2m[1m41[2m[22m chunks of [2m[1m1.23 MB[2m[22m (gzip: [2m[1m415.43 KB[2m[22m | map: [2m[1m3.75 MB[2m[22m)
[32m✓ built in 10.35s[39m

[36mPWA v1.1.0[39m
mode      [35mgenerateSW[39m
precache  [32m66 entries[39m [2m(2658.28 KiB)[22m
files generated
  [2mdist/sw.js.map[22m
  [2mdist/sw.js[22m
  [2mdist/workbox-78ef5c9b.js.map[22m
  [2mdist/workbox-78ef5c9b.js[22m
Build completed. Preview server available on port 4173 with: npm run preview
No autopilot-summary.mjs found, using basic summary
```
