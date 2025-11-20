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

/home/runner/work/Disa_Ai/Disa_Ai/src/main.tsx
  112:11  warning  Unexpected console statement. Only these console methods are allowed: warn, error  no-console
  117:13  warning  Unexpected console statement. Only these console methods are allowed: warn, error  no-console

✖ 2 problems (0 errors, 2 warnings)

Running Prettier...
npm warn config production Use `--omit=dev` instead.
[90m.changeset/config.json[39m 42ms (unchanged)
[90m.changeset/README.md[39m 55ms (unchanged)
[90m.changeset/sparkly-ghosts-wear.md[39m 2ms (unchanged)
[90m.github/dependabot.yml[39m 4ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.md[39m 7ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.yml[39m 20ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.md[39m 4ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.yml[39m 19ms (unchanged)
[90m.github/pull_request_template.md[39m 17ms (unchanged)
[90m.github/REQUIRED_CHECKS.md[39m 8ms (unchanged)
[90m.github/workflows/autopilot.yml[39m 7ms (unchanged)
[90m.github/workflows/bundle-monitor.yml[39m 7ms (unchanged)
[90m.github/workflows/ci.yml[39m 25ms (unchanged)
[90m.github/workflows/code-quality.yml[39m 15ms (unchanged)
[90m.github/workflows/codeql.yml[39m 4ms (unchanged)
[90m.github/workflows/codescan.yml[39m 6ms (unchanged)
[90m.github/workflows/dependency-review.yml[39m 7ms (unchanged)
[90m.github/workflows/gemini-dispatch.yml[39m 18ms (unchanged)
[90m.github/workflows/gemini-invoke.yml[39m 8ms (unchanged)
[90m.github/workflows/gemini-review.yml[39m 7ms (unchanged)
[90m.github/workflows/gemini-scheduled-triage.yml[39m 12ms (unchanged)
[90m.github/workflows/gemini-triage.yml[39m 7ms (unchanged)
[90m.github/workflows/lighthouse.yml[39m 3ms (unchanged)
[90m.github/workflows/release.yml[39m 14ms (unchanged)
[90m.github/workflows/verify-dist.yml[39m 7ms (unchanged)
[90m.grok/settings.json[39m 1ms (unchanged)
[90m.prettierrc.json[39m 2ms (unchanged)
[90m.qwen/PROJECT_SUMMARY.md[39m 11ms (unchanged)
[90m.stylelintrc.json[39m 4ms (unchanged)
[90mAGENTS.md[39m 13ms (unchanged)
[90mDEPENDENCIES_UPDATE_STRATEGY.md[39m 28ms (unchanged)
[90mDEPLOY_CONFIG_GUIDE.md[39m 8ms (unchanged)
[90mdeploy/cloudflare/cloudflare-pages.json[39m 3ms (unchanged)
[90meslint.config.mjs[39m 28ms (unchanged)
[90mfunctions/api/chat.ts[39m 87ms (unchanged)
[90mfunctions/api/feedback.ts[39m 24ms (unchanged)
[90mindex.html[39m 96ms (unchanged)
[90mlighthouse.config.mjs[39m 5ms (unchanged)
[90mMIGRATION_GUIDE.md[39m 34ms (unchanged)
[90mpackage-lock.json[39m 157ms (unchanged)
[90mpackage.json[39m 1ms (unchanged)
[90mplaywright.config.ts[39m 6ms (unchanged)
[90mPRIVACY.md[39m 14ms (unchanged)
[90mpublic/data/roles.json[39m 9ms (unchanged)
[90mpublic/datenschutz.html[39m 20ms (unchanged)
[90mpublic/impressum.html[39m 12ms (unchanged)
[90mpublic/manifest.webmanifest[39m 6ms (unchanged)
[90mpublic/models.json[39m 4ms (unchanged)
[90mpublic/offline.html[39m 35ms (unchanged)
[90mpublic/persona.json[39m 15ms (unchanged)
[90mpublic/privacy-policy.html[39m 10ms (unchanged)
[90mpublic/quickstarts.json[39m 3ms (unchanged)
[90mpublic/styles.json[39m 10ms (unchanged)
[90mpublic/sw.js[39m 20ms (unchanged)
[90mREADME.md[39m 88ms (unchanged)
[90mrenovate.json[39m 4ms (unchanged)
[90mscripts/build-info.js[39m 11ms (unchanged)
[90mscripts/check-dist-integrity.mjs[39m 6ms (unchanged)
[90mscripts/generate-routes.js[39m 3ms (unchanged)
[90mscripts/generate-tokens.mjs[39m 11ms (unchanged)
[90mscripts/run-preview.mjs[39m 20ms (unchanged)
[90mscripts/validate-deploy.js[39m 9ms (unchanged)
[90mscripts/verify-dist.mjs[39m 4ms (unchanged)
[90mshared/openrouter.ts[39m 4ms (unchanged)
[90msrc/__tests__/apiKeyShim.test.ts[39m 10ms (unchanged)
[90msrc/__tests__/branding.test.tsx[39m 5ms (unchanged)
[90msrc/__tests__/colorConverters.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/designTokens.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/humanError.test.ts[39m 8ms (unchanged)
[90msrc/__tests__/memory.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/message-id-synchronization.test.ts[39m 43ms (unchanged)
[90msrc/__tests__/models-fallback.test.ts[39m 31ms (unchanged)
[90msrc/__tests__/models.cache.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/networkBanner.test.tsx[39m 3ms (unchanged)
[90msrc/__tests__/openrouter.abort.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/openrouter.ndjson.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/openrouter.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/sw-cache-management.test.ts[39m 12ms (unchanged)
[90msrc/__tests__/useChat.race-condition.test.ts[39m 17ms (unchanged)
[90msrc/__tests__/viewport-scroll-performance.test.ts[39m 15ms (unchanged)
[90msrc/api/chat.ts[39m 11ms (unchanged)
[90msrc/api/memory.ts[39m 7ms (unchanged)
[90msrc/api/openrouter.ts[39m 25ms (unchanged)
[90msrc/App.tsx[39m 22ms (unchanged)
[90msrc/app/components/BrandWordmark.tsx[39m 2ms (unchanged)
[90msrc/app/components/RouteWrapper.tsx[39m 2ms (unchanged)
[90msrc/app/layouts/AppShell.tsx[39m 7ms (unchanged)
[90msrc/app/router.tsx[39m 8ms (unchanged)
[90msrc/app/state/StudioContext.tsx[39m 10ms (unchanged)
[90msrc/components/BuildInfo.tsx[39m 7ms (unchanged)
[90msrc/components/chat/ChatComposer.tsx[39m 19ms (unchanged)
[90msrc/components/chat/ChatLiveRegion.tsx[39m 3ms (unchanged)
[90msrc/components/chat/ChatMessage.tsx[39m 15ms (unchanged)
[90msrc/components/chat/ChatScreen.tsx[39m 4ms (unchanged)
[90msrc/components/chat/MessageBubble.tsx[39m 2ms (unchanged)
[90msrc/components/chat/MessageBubbleCard.tsx[39m 4ms (unchanged)
[90msrc/components/chat/QuickstartGrid.tsx[39m 8ms (unchanged)
[90msrc/components/chat/VirtualizedMessageList.tsx[39m 18ms (unchanged)
[90msrc/components/dev/FeatureFlagPanel.tsx[39m 17ms (unchanged)
[90msrc/components/ErrorBoundary.tsx[39m 25ms (unchanged)
[90msrc/components/layout/AppMenuDrawer.tsx[39m 16ms (unchanged)
[90msrc/components/models/__tests__/categorizeModelFromTags.test.ts[39m 5ms (unchanged)
[90msrc/components/models/EnhancedModelsInterface.tsx[39m 69ms (unchanged)
[90msrc/components/models/ModelComparisonTable.tsx[39m 5ms (unchanged)
[90msrc/components/NetworkBanner.tsx[39m 2ms (unchanged)
[90msrc/components/pwa/PWADebugInfo.tsx[39m 7ms (unchanged)
[90msrc/components/pwa/PWAInstallPrompt.tsx[39m 7ms (unchanged)
[90msrc/components/roles/EnhancedRolesInterface.tsx[39m 19ms (unchanged)
[90msrc/components/roles/roles-filter.ts[39m 6ms (unchanged)
[90msrc/components/StorageMigration.tsx[39m 22ms (unchanged)
[90msrc/config/env.ts[39m 10ms (unchanged)
[90msrc/config/flags.ts[39m 8ms (unchanged)
[90msrc/config/modelDescriptions.ts[39m 5ms (unchanged)
[90msrc/config/modelPolicy.ts[39m 3ms (unchanged)
[90msrc/config/models.ts[39m 24ms (unchanged)
[90msrc/config/navigation.tsx[39m 3ms (unchanged)
[90msrc/config/promptTemplates.ts[39m 1ms (unchanged)
[90msrc/config/quickstarts.test.ts[39m 15ms (unchanged)
[90msrc/config/quickstarts.ts[39m 11ms (unchanged)
[90msrc/config/roleStore.ts[39m 10ms (unchanged)
[90msrc/config/settings.ts[39m 11ms (unchanged)
[90msrc/contexts/CustomRolesContext.tsx[39m 4ms (unchanged)
[90msrc/contexts/FavoritesContext.tsx[39m 10ms (unchanged)
[90msrc/data/roles.dataset.ts[39m 10ms (unchanged)
[90msrc/data/roles.ts[39m 10ms (unchanged)
[90msrc/features/discussion/__tests__/shape.test.ts[39m 4ms (unchanged)
[90msrc/features/discussion/shape.ts[39m 13ms (unchanged)
[90msrc/features/prompt/composeSystemPrompt.ts[39m 4ms (unchanged)
[90msrc/features/settings/SettingsApiView.tsx[39m 9ms (unchanged)
[90msrc/features/settings/SettingsView.tsx[39m 7ms (unchanged)
[90msrc/hooks/__tests__/useChat.systemPrompt.test.ts[39m 12ms (unchanged)
[90msrc/hooks/enhanced-deferred-fetch.ts[39m 32ms (unchanged)
[90msrc/hooks/use-storage.ts[39m 28ms (unchanged)
[90msrc/hooks/useChat.ts[39m 32ms (unchanged)
[90msrc/hooks/useConversationManager.ts[39m 11ms (unchanged)
[90msrc/hooks/useDeferredFetch.ts[39m 20ms (unchanged)
[90msrc/hooks/useEdgeSwipe.ts[39m 21ms (unchanged)
[90msrc/hooks/useFavoritesManager.ts[39m 32ms (unchanged)
[90msrc/hooks/useFeatureFlags.tsx[39m 8ms (unchanged)
[90msrc/hooks/useFilteredList.ts[39m 2ms (unchanged)
[90msrc/hooks/useMediaQuery.ts[39m 2ms (unchanged)
[90msrc/hooks/useMemory.ts[39m 4ms (unchanged)
[90msrc/hooks/usePWAInstall.ts[39m 3ms (unchanged)
[90msrc/hooks/useRoles.ts[39m 4ms (unchanged)
[90msrc/hooks/useServiceWorker.ts[39m 3ms (unchanged)
[90msrc/hooks/useSettings.ts[39m 5ms (unchanged)
[90msrc/hooks/useStickToBottom.ts[39m 5ms (unchanged)
[90msrc/hooks/useVisualViewport.ts[39m 3ms (unchanged)
[90msrc/index.css[39m 21ms (unchanged)
[90msrc/lib/a11y/touchTargets.ts[39m 27ms (unchanged)
[90msrc/lib/accessibility.ts[39m 16ms (unchanged)
[90msrc/lib/analytics.test.ts[39m 9ms (unchanged)
[90msrc/lib/analytics.ts[39m 15ms (unchanged)
[90msrc/lib/chat/__tests__/validation.test.ts[39m 4ms (unchanged)
[90msrc/lib/chat/validation.ts[39m 4ms (unchanged)
[90msrc/lib/conversation-manager-modern.ts[39m 16ms (unchanged)
[90msrc/lib/conversation-utils.ts[39m 6ms (unchanged)
[90msrc/lib/css-feature-detection.ts[39m 3ms (unchanged)
[90msrc/lib/device-utils.ts[39m 14ms (unchanged)
[90msrc/lib/errors/__tests__/mapper.test.ts[39m 11ms (unchanged)
[90msrc/lib/errors/humanError.ts[39m 5ms (unchanged)
[90msrc/lib/errors/index.ts[39m 1ms (unchanged)
[90msrc/lib/errors/mapper.ts[39m 5ms (unchanged)
[90msrc/lib/errors/types.ts[39m 9ms (unchanged)
[90msrc/lib/font-loader.ts[39m 10ms (unchanged)
[90msrc/lib/formatRelativeTime.ts[39m 5ms (unchanged)
[90msrc/lib/highlighting/lazySyntaxHighlighter.ts[39m 12ms (unchanged)
[90msrc/lib/highlighting/prismTheme.ts[39m 3ms (unchanged)
[90msrc/lib/http.ts[39m 8ms (unchanged)
[90msrc/lib/icons/index.ts[39m 3ms (unchanged)
[90msrc/lib/logging.ts[39m 2ms (unchanged)
[90msrc/lib/memory/memoryService.ts[39m 2ms (unchanged)
[90msrc/lib/mobile-testing-plan.md[39m 36ms (unchanged)
[90msrc/lib/monitoring/README.md[39m 15ms (unchanged)
[90msrc/lib/monitoring/sentry.tsx[39m 7ms (unchanged)
[90msrc/lib/net/concurrency.ts[39m 5ms (unchanged)
[90msrc/lib/net/fetchTimeout.ts[39m 6ms (unchanged)
[90msrc/lib/net/rateLimit.ts[39m 3ms (unchanged)
[90msrc/lib/openrouter/__tests__/key.test.ts[39m 3ms (unchanged)
[90msrc/lib/openrouter/__tests__/keyLifecycle.test.ts[39m 9ms (unchanged)
[90msrc/lib/openrouter/key.ts[39m 4ms (unchanged)
[90msrc/lib/pwa/registerSW.ts[39m 8ms (unchanged)
[90msrc/lib/pwa/SW_VERSIONING_README.md[39m 31ms (unchanged)
[90msrc/lib/pwa/sw-versioning.ts[39m 10ms (unchanged)
[90msrc/lib/recovery/resetApp.ts[39m 4ms (unchanged)
[90msrc/lib/safeStorage.ts[39m 5ms (unchanged)
[90msrc/lib/storage-layer.ts[39m 47ms (unchanged)
[90msrc/lib/storage-migration.ts[39m 20ms (unchanged)
[90msrc/lib/touch/__tests__/gestures.test.ts[39m 27ms (unchanged)
[90msrc/lib/touch/__tests__/haptics.test.ts[39m 29ms (unchanged)
[90msrc/lib/touch/gestures.ts[39m 20ms (unchanged)
[90msrc/lib/touch/haptics.ts[39m 9ms (unchanged)
[90msrc/lib/utils.ts[39m 5ms (unchanged)
[90msrc/lib/utils/loadScript.ts[39m 5ms (unchanged)
[90msrc/lib/utils/loadStylesheet.ts[39m 7ms (unchanged)
[90msrc/lib/utils/production-logger.ts[39m 15ms (unchanged)
[90msrc/lib/utils/reload-manager.ts[39m 1ms (unchanged)
[90msrc/lib/validators/roles.ts[39m 5ms (unchanged)
[90msrc/main.tsx[39m 14ms (unchanged)
[90msrc/pages/Chat.tsx[39m 13ms (unchanged)
[90msrc/pages/DatenschutzPage.tsx[39m 13ms (unchanged)
[90msrc/pages/ImpressumPage.tsx[39m 3ms (unchanged)
[90msrc/pages/MobileModels.tsx[39m 3ms (unchanged)
[90msrc/pages/MobileStudio.tsx[39m 3ms (unchanged)
[90msrc/pages/ModelsPage.tsx[39m 15ms (unchanged)
[90msrc/pages/RolesPage.tsx[39m 18ms (unchanged)
[90msrc/pages/SettingsApi.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsAppearance.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsData.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsFilters.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsMemory.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsOverviewPage.tsx[39m 1ms (unchanged)
[90msrc/pages/StudioHome.tsx[39m 7ms (unchanged)
[90msrc/prompts/discussion/presets.ts[39m 2ms (unchanged)
[90msrc/services/openrouter.ts[39m 6ms (unchanged)
[90msrc/state/chatReducer.ts[39m 6ms (unchanged)
[90msrc/styles/animations.css[39m 66ms (unchanged)
[90msrc/styles/aurora-optimized.css[39m 27ms (unchanged)
[90msrc/styles/base.css[39m 20ms (unchanged)
[90msrc/styles/chat-mobile.css[39m 25ms (unchanged)
[90msrc/styles/components.css[39m 29ms (unchanged)
[90msrc/styles/DESIGN_SYSTEM.md[39m 22ms (unchanged)
src/styles/design-tokens-consolidated.css 19ms
[90msrc/styles/design-tokens.generated.ts[39m 6ms (unchanged)
[90msrc/styles/design-tokens.ts[39m 4ms (unchanged)
[90msrc/styles/grid-system.css[39m 32ms (unchanged)
[90msrc/styles/interactive-states.css[39m 34ms (unchanged)
[90msrc/styles/mobile-enhancements.css[39m 2ms (unchanged)
[90msrc/styles/mobile.css[39m 17ms (unchanged)
[90msrc/styles/page-spacing.css[39m 26ms (unchanged)
[90msrc/styles/README.md[39m 10ms (unchanged)
[90msrc/styles/theme.ts[39m 7ms (unchanged)
[90msrc/styles/tokens/category-colors.ts[39m 5ms (unchanged)
[90msrc/styles/tokens/category-tonal-scales.ts[39m 21ms (unchanged)
[90msrc/styles/tokens/color.ts[39m 21ms (unchanged)
[90msrc/styles/tokens/motion.ts[39m 4ms (unchanged)
[90msrc/styles/tokens/radius.ts[39m 4ms (unchanged)
[90msrc/styles/tokens/shadow.ts[39m 5ms (unchanged)
[90msrc/styles/tokens/spacing.ts[39m 5ms (unchanged)
[90msrc/styles/tokens/typography.ts[39m 7ms (unchanged)
[90msrc/styles/ui-state-animations.css[39m 15ms (unchanged)
[90msrc/styles/vertical-rhythm.css[39m 26ms (unchanged)
[90msrc/styles/white-space.css[39m 73ms (unchanged)
[90msrc/styles/z-index-system.css[39m 6ms (unchanged)
[90msrc/theme/tokens.ts[39m 29ms (unchanged)
[90msrc/types/chat.ts[39m 1ms (unchanged)
[90msrc/types/chatMessage.ts[39m 1ms (unchanged)
[90msrc/types/enhanced-interfaces.ts[39m 18ms (unchanged)
[90msrc/types/index.ts[39m 2ms (unchanged)
[90msrc/types/prism-modules.d.ts[39m 1ms (unchanged)
[90msrc/ui/ActionCard.tsx[39m 4ms (unchanged)
[90msrc/ui/AppHeader.tsx[39m 2ms (unchanged)
[90msrc/ui/Avatar.tsx[39m 3ms (unchanged)
[90msrc/ui/Badge.tsx[39m 2ms (unchanged)
[90msrc/ui/Button.tsx[39m 2ms (unchanged)
[90msrc/ui/Card.tsx[39m 6ms (unchanged)
[90msrc/ui/ChatStartCard.tsx[39m 2ms (unchanged)
[90msrc/ui/Chip.tsx[39m 2ms (unchanged)
[90msrc/ui/CopyButton.tsx[39m 7ms (unchanged)
[90msrc/ui/Dialog.tsx[39m 7ms (unchanged)
[90msrc/ui/DrawerSheet.tsx[39m 14ms (unchanged)
[90msrc/ui/FilterChip.tsx[39m 2ms (unchanged)
[90msrc/ui/GlassCard.tsx[39m 2ms (unchanged)
[90msrc/ui/GlassPanel.tsx[39m 2ms (unchanged)
[90msrc/ui/IconButton.tsx[39m 2ms (unchanged)
[90msrc/ui/index.ts[39m 1ms (unchanged)
[90msrc/ui/Input.tsx[39m 2ms (unchanged)
[90msrc/ui/Label.tsx[39m 2ms (unchanged)
[90msrc/ui/MetricRow.tsx[39m 3ms (unchanged)
[90msrc/ui/ModelCard.tsx[39m 6ms (unchanged)
[90msrc/ui/PrimaryButton.tsx[39m 2ms (unchanged)
[90msrc/ui/QuickStartCard.tsx[39m 2ms (unchanged)
[90msrc/ui/RoleCard.tsx[39m 3ms (unchanged)
[90msrc/ui/SectionHeader.tsx[39m 2ms (unchanged)
[90msrc/ui/Select.tsx[39m 12ms (unchanged)
[90msrc/ui/Skeleton.tsx[39m 1ms (unchanged)
[90msrc/ui/Switch.tsx[39m 2ms (unchanged)
[90msrc/ui/Table.tsx[39m 8ms (unchanged)
[90msrc/ui/Textarea.tsx[39m 2ms (unchanged)
[90msrc/ui/toast/index.tsx[39m 12ms (unchanged)
[90msrc/ui/Tooltip.tsx[39m 3ms (unchanged)
[90msrc/ui/Typography.tsx[39m 7ms (unchanged)
[90msrc/utils/category-mapping.ts[39m 7ms (unchanged)
[90msrc/utils/colorConverters.ts[39m 3ms (unchanged)
[90msrc/utils/pricing.ts[39m 4ms (unchanged)
[90msrc/vitest-env.d.ts[39m 1ms (unchanged)
[90mSTORAGE_MIGRATION_GUIDE.md[39m 68ms (unchanged)
[90mtailwind.config.ts[39m 12ms (unchanged)
[90mtests/e2e/api-mock.ts[39m 8ms (unchanged)
[90mtests/e2e/app-shell.spec.ts[39m 7ms (unchanged)
[90mtests/e2e/chat-flow.spec.ts[39m 21ms (unchanged)
[90mtests/e2e/chat.smoke.spec.ts[39m 4ms (unchanged)
[90mtests/e2e/error-handling.spec.ts[39m 31ms (unchanged)
[90mtests/e2e/helpers/app-helpers.ts[39m 18ms (unchanged)
[90mtests/e2e/models-flow.spec.ts[39m 17ms (unchanged)
[90mtests/e2e/pwa-mobile.spec.ts[39m 30ms (unchanged)
[90mtests/e2e/roles.spec.ts[39m 4ms (unchanged)
[90mtests/e2e/settings-flow.spec.ts[39m 19ms (unchanged)
[90mtests/e2e/smoke.spec.ts[39m 7ms (unchanged)
[90mtests/polyfills.ts[39m 5ms (unchanged)
[90mtests/setup.ts[39m 2ms (unchanged)
[90mtests/setup/fetch.ts[39m 3ms (unchanged)
[90mtests/smoke/entrypoints.smoke.test.tsx[39m 9ms (unchanged)
[90mtests/unit/composeSystemPrompt.test.ts[39m 3ms (unchanged)
[90mtests/unit/copyButton.test.tsx[39m 7ms (unchanged)
[90mtests/unit/ErrorBoundary.test.tsx[39m 5ms (unchanged)
[90mtests/unit/lib/conversation-manager-modern.test.ts[39m 23ms (unchanged)
[90mtests/unit/lib/export-validation.test.ts[39m 2ms (unchanged)
[90mtests/unit/lib/storage-integration.test.ts[39m 7ms (unchanged)
[90mtests/unit/lib/storage-layer-business.test.ts[39m 28ms (unchanged)
[90mtests/unit/lib/storage-layer-simple.test.ts[39m 24ms (unchanged)
[90mtests/unit/lib/storage-layer.test.ts[39m 16ms (unchanged)
[90mtests/unit/lib/storage-migration-integration.test.ts[39m 6ms (unchanged)
[90mtests/unit/lib/storage-migration.test.ts[39m 27ms (unchanged)
[90mtests/unit/lib/storage-performance-simple.test.ts[39m 17ms (unchanged)
[90mtests/unit/lib/storage-performance.test.ts[39m 15ms (unchanged)
[90mtests/unit/rateLimit.test.ts[39m 3ms (unchanged)
[90mtests/unit/useChat.test.tsx[39m 9ms (unchanged)
[90mtools/cf-purge.js[39m 16ms (unchanged)
[90mtools/check-css-hex.mjs[39m 6ms (unchanged)
[90mtsconfig.base.json[39m 1ms (unchanged)
[90mtsconfig.build.json[39m 1ms (unchanged)
[90mtsconfig.json[39m 1ms (unchanged)
[90mtsconfig.node.json[39m 1ms (unchanged)
[90mtsconfig.test.json[39m 1ms (unchanged)
[90mvite-env.d.ts[39m 3ms (unchanged)
[90mvite.config.ts[39m 15ms (unchanged)
[90mvitest.config.ts[39m 3ms (unchanged)
Checking for unused imports...
npm warn config production Use `--omit=dev` instead.
82 modules with unused exports
/home/runner/work/Disa_Ai/Disa_Ai/src/api/chat.ts: ChatRequest
/home/runner/work/Disa_Ai/Disa_Ai/src/api/openrouter.ts: checkApiHealth
/home/runner/work/Disa_Ai/Disa_Ai/src/config/env.ts: EnvConfig, getEnvironmentWarnings
/home/runner/work/Disa_Ai/Disa_Ai/src/config/flags.ts: defaultFeatureFlags, FeatureFlagMeta
/home/runner/work/Disa_Ai/Disa_Ai/src/config/modelPolicy.ts: ModelPolicy
/home/runner/work/Disa_Ai/Disa_Ai/src/config/models.ts: Price, CatalogOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/config/promptTemplates.ts: RoleTemplate, fetchRoleTemplates, getRoleLoadStatus, listRoleTemplates
/home/runner/work/Disa_Ai/Disa_Ai/src/config/quickstarts.ts: QuickstartAction
/home/runner/work/Disa_Ai/Disa_Ai/src/config/roleStore.ts: getRoleTemplates, getRoleState
/home/runner/work/Disa_Ai/Disa_Ai/src/config/settings.ts: getCtxReservedTokens, setCtxReservedTokens, getComposerOffset, setComposerOffset, getFontSize, setFontSize, getReduceMotion, setReduceMotion, getHapticFeedback, setHapticFeedback, getDiscussionPreset, setDiscussionPreset, getDiscussionStrictMode, setDiscussionStrictMode, getDiscussionMaxSentences, setDiscussionMaxSentences
/home/runner/work/Disa_Ai/Disa_Ai/src/data/roles.ts: getRoleById, getRolesByCategory, getCategories
/home/runner/work/Disa_Ai/Disa_Ai/src/features/discussion/shape.ts: DiscussionShapeOptions, DiscussionShapeResult
/home/runner/work/Disa_Ai/Disa_Ai/src/features/prompt/composeSystemPrompt.ts: composeSystemPrompt
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/enhanced-deferred-fetch.ts: useEnhancedDeferredFetch, useEnhancedDeferredLoad, useEnhancedDeferredCachedFetch
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/use-storage.ts: UseConversationsOptions, UseConversationsReturn, useConversations, UseConversationReturn, useConversation, UseConversationStatsReturn, UseStorageMigrationReturn, UseStorageHealthReturn, useBulkOperations
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useChat.ts: UseChatOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useDeferredFetch.ts: useDeferredFetch, useDeferredLoad, getDeferredFetchStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useEdgeSwipe.ts: EdgeSwipeOptions, EdgeSwipeState, useEdgeSwipe, useEdgeSwipeDrawer
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useFavoritesManager.ts: useFavoriteStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useMediaQuery.ts: useMediaQuery, useIsMobile
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/analytics.ts: AnalyticsEvent, AnalyticsSession, AnalyticsStats
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/conversation-manager-modern.ts: ExportData, ImportResult, bulkUpdateConversations, cleanupOldConversations, exportConversations, importConversations, getConversationById, migrateFromLocalStorage, getStoragePerformance
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/conversation-utils.ts: ConversationGroups, groupConversationsByDate
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/device-utils.ts: DeviceType, Orientation, InputMethod, BREAKPOINTS, DeviceUtils, getDeviceType, isMobile, isTablet, isDesktop, getOrientation, hasTouch, getPrimaryInputMethod, supportsHover, isStandalone, getSafeAreaInsets, getAvailableHeight, optimizeViewport, isEmbedded, toggleOverscrollBehavior, updateDeviceTypeClass
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/font-loader.ts: FontConfig, FontLoader
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/formatRelativeTime.ts: formatRelativeTime
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/http.ts: FetchJsonOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/logging.ts: logInfo, logError
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/safeStorage.ts: SafeStorage, safeStorage
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/storage-layer.ts: StorageStats, ModernStorageLayer, setModernStorageInstance, getModernStorageInstance
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/storage-migration.ts: MigrationResult, MigrationProgress, MigrationOptions, StorageMigration
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/utils.ts: objectKeys, objectValues, objectEntries, isDefined, isFunction, deepClone
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/a11y/touchTargets.ts: TOUCH_TARGET_SIZES, A11yViolation, validateTouchTarget, validateAriaAttributes, autoFixA11yViolations, scanDocumentA11y, enforceA11yStandards, createA11yObserver, FocusManager
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/chat/validation.ts: PromptValidationReason, PromptValidationResult
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/errors/humanError.ts: HumanError
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/errors/index.ts: ApiError, HttpError, NotFoundError, ApiClientError, UnknownError
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/highlighting/lazySyntaxHighlighter.ts: highlightCode, preloadHighlighter, getHighlighterStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/highlighting/prismTheme.ts: loadPrismCSS
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/icons/index.ts: AlertCircle, ArrowLeft, Book, ChevronRight, Circle, Code, FileText, Hash, Image, Loader2, Menu, Mic, Moon, MoreHorizontal, Paperclip, Pin, PinOff, Plus, SlidersHorizontal, Smile, Sparkles, SunMedium, Tag, ThumbsDown, ThumbsUp, Trash2, TrendingUp, Waves, XCircle
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/concurrency.ts: ConcurrencyManager
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/fetchTimeout.ts: FetchWithTimeoutOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/rateLimit.ts: TokenBucket
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/pwa/registerSW.ts: RegisterResult
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/pwa/sw-versioning.ts: CACHE_VERSION, CACHE_PREFIX, getVersionedCacheName, isCurrentVersionCache, deleteOldCaches, SW_UPDATE_CHANNEL, ServiceWorkerUpdateMessage, broadcastSWUpdate, listenForSWUpdates, getCacheStats
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/gestures.ts: TouchGestureOptions, SwipeEvent, TapEvent, ensureTouchTarget, debouncedTouch
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/haptics.ts: HapticOptions, HapticPattern, isHapticSupported, prefersReducedMotion, triggerHaptic, withHaptic, addHapticToElement
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/utils/production-logger.ts: devLog, prodError, safeLog, safeDebug
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/validators/roles.ts: SafetyLevel, parseRolesStrict
/home/runner/work/Disa_Ai/Disa_Ai/src/prompts/discussion/presets.ts: discussionPresets, discussionPresetOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/services/openrouter.ts: getApiKey, setApiKey, pingOpenRouter, chatOnce, chatStream
/home/runner/work/Disa_Ai/Disa_Ai/src/state/chatReducer.ts: ChatState, ChatAction
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/design-tokens.ts: DesignTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/theme.ts: ColorMode, ThemePreference, ThemeState
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/category-colors.ts: categoryColorTokens, categoryTokensCSS, CATEGORY_KEYS
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/category-tonal-scales.ts: categoryTonalScales, categoryTonalTokensCSS, CategoryKey, CATEGORY_KEYS, TONAL_LEVELS, TonalLevel
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/color.ts: SurfaceTokens, TextTokens, BorderTokens, BrandTokens, StatusTokenSet, StatusTokens, ActionTokens, ControlTokens, TableTokens, OverlayTokens, ColorScheme, colorCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/motion.ts: DurationTokens, EasingTokens, MotionTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/radius.ts: RadiusTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/shadow.ts: ShadowTokens, shadowCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/spacing.ts: SpacingScale, SemanticSpacing, TouchTargets, FixedSizes, SpacingTokens, spacingCssVars
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/tokens/typography.ts: FontStackTokens, TextStyle, TypographyTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/theme/tokens.ts: COLOR_TOKENS, tailwindColors, spacingScale, spacingSemantic, spacingTouch, spacingFixed, tailwindSpacing, tailwindRadii, tailwindShadows, tailwindFontFamily, tailwindMotion, TextStyle, textStyles, fixedFontSizes
/home/runner/work/Disa_Ai/Disa_Ai/src/types/chat.ts: Role
/home/runner/work/Disa_Ai/Disa_Ai/src/types/chatMessage.ts: ChatMessageRole
/home/runner/work/Disa_Ai/Disa_Ai/src/types/enhanced-interfaces.ts: RoleCategory, PerformanceMetrics, SearchResult, UIState, migrateModel, isEnhancedRole, isEnhancedModel
/home/runner/work/Disa_Ai/Disa_Ai/src/types/index.ts: Role, Message, MessageRole, ChatSession
/home/runner/work/Disa_Ai/Disa_Ai/src/ui/index.ts: ActionCard, Avatar, AvatarFallback, AvatarImage, BadgeProps, badgeVariants, ButtonProps, buttonVariants, CardProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ChatStartCard, Chip, CopyButton, DialogClose, DialogFooter, DialogOverlay, DialogPortal, DialogTrigger, DrawerSheet, GlassPanel, IconButton, InputProps, inputVariants, MetricRow, PrimaryButtonProps, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue, Switch, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, TextareaProps, Textarea, ToastsProvider, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TypographyVariant, TypographyElement
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/category-mapping.ts: CATEGORY_MAP, KEY_TO_LABEL_MAP, CATEGORY_ICONS, normalizeCategoryKey, isValidCategoryKey, getCategoryLabel, getCategoryIcon, getCategoryData, useCategoryData, validateCategory, CATEGORY_KEYS
/home/runner/work/Disa_Ai/Disa_Ai/src/app/router.tsx: appRouter
/home/runner/work/Disa_Ai/Disa_Ai/src/components/NetworkBanner.tsx: default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/StorageMigration.tsx: StorageMigration
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/ChatMessage.tsx: ChatMessageType
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/ChatScreen.tsx: ChatScreen
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/MessageBubble.tsx: MessageBubble
/home/runner/work/Disa_Ai/Disa_Ai/src/components/dev/FeatureFlagPanel.tsx: FeatureFlagIndicator
/home/runner/work/Disa_Ai/Disa_Ai/src/config/navigation.tsx: AppNavItem
/home/runner/work/Disa_Ai/Disa_Ai/src/contexts/CustomRolesContext.tsx: CustomRole, useCustomRoles
/home/runner/work/Disa_Ai/Disa_Ai/src/contexts/FavoritesContext.tsx: useFavoriteActions, useFavoriteLists, useFavoritesAnalytics, withFavorites, FavoritesLoader
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useFeatureFlags.tsx: useFeatureFlag, useFeatureFlags, useAnyFeatureFlags, useAllFeatureFlags, useActiveFeatureFlags, withFeatureFlag
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/monitoring/sentry.tsx: captureError, addBreadcrumb, setUserContext, profileFunction
/home/runner/work/Disa_Ai/Disa_Ai/src/pages/MobileModels.tsx: default
/home/runner/work/Disa_Ai/Disa_Ai/src/pages/MobileStudio.tsx: default
Running local maintenance scripts...
Building project...
Running vite build...
npm warn config production Use `--omit=dev` instead.
⚠️  Missing environment variable: VITE_OPENROUTER_API_KEY in production mode
⚠️  Missing environment variable: OPENROUTER_API_KEY in production mode
[36mvite v7.2.2 [32mbuilding client environment for production...[36m[39m
transforming...
[32m✓[39m 3025 modules transformed.
[33mGenerated an empty chunk: "syntax-vendor".[39m
rendering chunks...
[2mdist/[22m[32mmanifest.webmanifest                        [39m[1m[2m  0.37 kB[22m[1m[22m
[2mdist/[22m[32mindex.html                                  [39m[1m[2m  8.08 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/index-DURE9__c.css               [39m[1m[2m 74.49 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/main-BI1w3_uK.css                [39m[1m[2m 79.50 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/syntax-vendor-l0sNRNKZ.js         [39m[1m[2m  0.05 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/reload-manager-DqJ_LRMs.js        [39m[1m[2m  0.25 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsData-CY5HzGNG.js          [39m[1m[2m  0.39 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsMemory-CY5HzGNG.js        [39m[1m[2m  0.39 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsFilters-CY5HzGNG.js       [39m[1m[2m  0.40 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsAppearance-CY5HzGNG.js    [39m[1m[2m  0.40 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsOverviewPage-z1esWpIV.js  [39m[1m[2m  0.40 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/SectionHeader-DcA3VSl8.js         [39m[1m[2m  0.62 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/key-C3rcisgd.js                   [39m[1m[2m  0.93 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/ImpressumPage-B9mM7hct.js         [39m[1m[2m  1.43 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/useRoles-Dg44vJGP.js              [39m[1m[2m  1.54 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/mapper-BHHyTRFK.js                [39m[1m[2m  2.25 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/roleStore-BdBZsUHC.js             [39m[1m[2m  2.47 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/StudioHome-B7Rd5GDl.js            [39m[1m[2m  2.84 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/index-SQDubH0C.js                 [39m[1m[2m  2.93 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsApi-CmG3pEJm.js           [39m[1m[2m  3.45 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/ModelsPage-AkbMGHSo.js            [39m[1m[2m  4.47 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsView-Bx7rCFni.js          [39m[1m[2m  4.75 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/FeatureFlagPanel-BBGk87PP.js      [39m[1m[2m  4.76 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/RolesPage-CFijFfJu.js             [39m[1m[2m  5.97 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/DatenschutzPage-qV-9t_lX.js       [39m[1m[2m  8.26 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/react-vendor-BSeQcPOp.js          [39m[1m[2m 11.49 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/utils-vendor-B35eaEUR.js          [39m[1m[2m 25.71 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/ui-vendor-DCd7GzZl.js             [39m[1m[2m 66.14 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/router-vendor-DOf7rflG.js         [39m[1m[2m 81.36 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/Chat-8jbeamzh.js                  [39m[1m[2m146.19 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/main-ISwN_Vtb.js                  [39m[1m[2m321.52 kB[22m[1m[22m
[2m[1m30[2m[22m chunks of [2m[1m832.29 KB[2m[22m (gzip: [2m[1m281.24 KB[2m[22m | map: [2m[1m2.95 MB[2m[22m)
[32m✓ built in 6.97s[39m

[36mPWA v1.1.0[39m
mode      [35mgenerateSW[39m
precache  [32m50 entries[39m [2m(1292.01 KiB)[22m
files generated
  [2mdist/sw.js.map[22m
  [2mdist/sw.js[22m
  [2mdist/workbox-239d0d27.js.map[22m
  [2mdist/workbox-239d0d27.js[22m
Build completed. Preview server available on port 4173 with: npm run preview
No autopilot-summary.mjs found, using basic summary
```
