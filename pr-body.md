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

/home/runner/work/Disa_Ai/Disa_Ai/src/features/settings/SettingsView.tsx
  485:17  warning  'Icon' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars

/home/runner/work/Disa_Ai/Disa_Ai/src/pages/Chat.tsx
  34:11  warning  'activeConversationId' is assigned a value but never used. Allowed unused vars must match /^_/u     unused-imports/no-unused-vars
  34:33  warning  'setActiveConversationId' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars
  34:58  warning  'refreshConversations' is assigned a value but never used. Allowed unused vars must match /^_/u     unused-imports/no-unused-vars

✖ 4 problems (0 errors, 4 warnings)

Running Prettier...
npm warn config production Use `--omit=dev` instead.
[90m.changeset/config.json[39m 40ms (unchanged)
[90m.changeset/README.md[39m 56ms (unchanged)
[90m.changeset/sparkly-ghosts-wear.md[39m 1ms (unchanged)
[90m.github/dependabot.yml[39m 4ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.md[39m 6ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.yml[39m 16ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.md[39m 3ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.yml[39m 23ms (unchanged)
[90m.github/NEUES_MAIN_ANALYSIS.md[39m 19ms (unchanged)
[90m.github/pull_request_template.md[39m 19ms (unchanged)
[90m.github/REQUIRED_CHECKS.md[39m 5ms (unchanged)
[90m.github/workflows/autopilot.yml[39m 7ms (unchanged)
[90m.github/workflows/bundle-monitor.yml[39m 8ms (unchanged)
[90m.github/workflows/ci.yml[39m 20ms (unchanged)
[90m.github/workflows/code-quality.yml[39m 11ms (unchanged)
[90m.github/workflows/codeql.yml[39m 7ms (unchanged)
[90m.github/workflows/codescan.yml[39m 4ms (unchanged)
[90m.github/workflows/dependency-review.yml[39m 4ms (unchanged)
[90m.github/workflows/lighthouse.yml[39m 4ms (unchanged)
[90m.github/workflows/release.yml[39m 20ms (unchanged)
.github/workflows/verify-dist.yml 9ms
[90m.grok/settings.json[39m 2ms (unchanged)
[90m.grok/user-settings.json[39m 2ms (unchanged)
[90m.prettierrc.json[39m 2ms (unchanged)
[90m.qwen/PROJECT_SUMMARY.md[39m 10ms (unchanged)
[90m.stylelintrc.json[39m 4ms (unchanged)
[90mDEPENDENCIES_UPDATE_STRATEGY.md[39m 27ms (unchanged)
[90mdeploy/cloudflare/cloudflare-pages.json[39m 3ms (unchanged)
[90meslint.config.mjs[39m 28ms (unchanged)
[90mfehlerbericht.md[39m 27ms (unchanged)
[90mfunctions/api/chat.ts[39m 77ms (unchanged)
[90mfunctions/api/feedback.ts[39m 21ms (unchanged)
[90mindex.html[39m 43ms (unchanged)
[90mpackage-lock.json[39m 180ms (unchanged)
[90mpackage.json[39m 2ms (unchanged)
[90mplaywright.config.ts[39m 8ms (unchanged)
[90mPRIVACY.md[39m 16ms (unchanged)
[90mpublic/datenschutz.html[39m 42ms (unchanged)
[90mpublic/impressum.html[39m 12ms (unchanged)
[90mpublic/manifest.webmanifest[39m 6ms (unchanged)
[90mpublic/models.json[39m 5ms (unchanged)
[90mpublic/offline.html[39m 44ms (unchanged)
[90mpublic/persona.json[39m 14ms (unchanged)
[90mpublic/privacy-policy.html[39m 12ms (unchanged)
[90mpublic/quickstarts.json[39m 2ms (unchanged)
[90mpublic/styles.json[39m 7ms (unchanged)
[90mREADME.md[39m 91ms (unchanged)
[90mrenovate.json[39m 4ms (unchanged)
[90mscripts/build-info.js[39m 12ms (unchanged)
scripts/check-dist-integrity.mjs 6ms
[90mscripts/generate-routes.js[39m 3ms (unchanged)
[90mscripts/generate-tokens.mjs[39m 10ms (unchanged)
[90mscripts/run-preview.mjs[39m 21ms (unchanged)
[90mscripts/verify-dist.mjs[39m 5ms (unchanged)
[90msrc/__tests__/apiKeyShim.test.ts[39m 8ms (unchanged)
[90msrc/__tests__/branding.test.tsx[39m 7ms (unchanged)
[90msrc/__tests__/colorConverters.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/designTokens.test.ts[39m 6ms (unchanged)
[90msrc/__tests__/humanError.test.ts[39m 9ms (unchanged)
[90msrc/__tests__/memory.test.ts[39m 7ms (unchanged)
[90msrc/__tests__/message-id-synchronization.test.ts[39m 45ms (unchanged)
[90msrc/__tests__/models-fallback.test.ts[39m 24ms (unchanged)
[90msrc/__tests__/models.cache.test.ts[39m 3ms (unchanged)
[90msrc/__tests__/networkBanner.test.tsx[39m 3ms (unchanged)
[90msrc/__tests__/openrouter.abort.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/openrouter.ndjson.test.ts[39m 5ms (unchanged)
[90msrc/__tests__/openrouter.test.ts[39m 7ms (unchanged)
[90msrc/__tests__/sw-cache-management.test.ts[39m 16ms (unchanged)
[90msrc/__tests__/useChat.race-condition.test.ts[39m 18ms (unchanged)
[90msrc/__tests__/viewport-scroll-performance.test.ts[39m 16ms (unchanged)
[90msrc/api/chat.ts[39m 13ms (unchanged)
[90msrc/api/memory.ts[39m 8ms (unchanged)
[90msrc/api/openrouter.ts[39m 25ms (unchanged)
[90msrc/App.tsx[39m 23ms (unchanged)
[90msrc/app/components/BrandWordmark.tsx[39m 2ms (unchanged)
[90msrc/app/components/RouteWrapper.tsx[39m 2ms (unchanged)
[90msrc/app/layouts/AppShell.tsx[39m 12ms (unchanged)
[90msrc/app/router.tsx[39m 31ms (unchanged)
[90msrc/app/state/StudioContext.tsx[39m 10ms (unchanged)
[90msrc/components/BuildInfo.tsx[39m 10ms (unchanged)
[90msrc/components/chat/ChatComposer.tsx[39m 20ms (unchanged)
[90msrc/components/chat/ChatLiveRegion.tsx[39m 2ms (unchanged)
src/components/chat/ChatMessage.tsx 30ms
[90msrc/components/chat/ChatScreen.tsx[39m 6ms (unchanged)
[90msrc/components/chat/VirtualizedMessageList.tsx[39m 17ms (unchanged)
[90msrc/components/dev/FeatureFlagPanel.tsx[39m 19ms (unchanged)
[90msrc/components/ErrorBoundary.tsx[39m 26ms (unchanged)
[90msrc/components/layout/Header.tsx[39m 8ms (unchanged)
[90msrc/components/layout/MobileBottomNav.tsx[39m 6ms (unchanged)
[90msrc/components/models/__tests__/categorizeModelFromTags.test.ts[39m 5ms (unchanged)
[90msrc/components/models/EnhancedModelsInterface.tsx[39m 75ms (unchanged)
[90msrc/components/models/ModelComparisonTable.tsx[39m 12ms (unchanged)
[90msrc/components/NetworkBanner.tsx[39m 4ms (unchanged)
[90msrc/components/pwa/PWADebugInfo.tsx[39m 10ms (unchanged)
[90msrc/components/pwa/PWAInstallPrompt.tsx[39m 8ms (unchanged)
[90msrc/components/roles/EnhancedRolesInterface.tsx[39m 39ms (unchanged)
[90msrc/components/roles/roles-filter.ts[39m 5ms (unchanged)
[90msrc/components/StorageMigration.tsx[39m 23ms (unchanged)
[90msrc/components/ui/__tests__/button.test.tsx[39m 10ms (unchanged)
[90msrc/components/ui/aurora-button.tsx[39m 3ms (unchanged)
[90msrc/components/ui/aurora-card.tsx[39m 3ms (unchanged)
[90msrc/components/ui/avatar.tsx[39m 4ms (unchanged)
[90msrc/components/ui/badge.tsx[39m 5ms (unchanged)
[90msrc/components/ui/button.tsx[39m 7ms (unchanged)
[90msrc/components/ui/card-system.md[39m 33ms (unchanged)
[90msrc/components/ui/card-types.ts[39m 12ms (unchanged)
[90msrc/components/ui/card.tsx[39m 27ms (unchanged)
[90msrc/components/ui/chip.tsx[39m 9ms (unchanged)
[90msrc/components/ui/chip/README.md[39m 25ms (unchanged)
[90msrc/components/ui/CopyButton.tsx[39m 7ms (unchanged)
[90msrc/components/ui/Dialog.tsx[39m 11ms (unchanged)
[90msrc/components/ui/DiscussionTopicCard.tsx[39m 10ms (unchanged)
[90msrc/components/ui/drawer-sheet.tsx[39m 13ms (unchanged)
[90msrc/components/ui/dropdown-menu.tsx[39m 16ms (unchanged)
[90msrc/components/ui/index.ts[39m 4ms (unchanged)
[90msrc/components/ui/input.tsx[39m 4ms (unchanged)
[90msrc/components/ui/label.tsx[39m 2ms (unchanged)
[90msrc/components/ui/ModelCard.tsx[39m 19ms (unchanged)
[90msrc/components/ui/README.md[39m 13ms (unchanged)
src/components/ui/SectionCard.tsx 7ms
[90msrc/components/ui/select.tsx[39m 18ms (unchanged)
[90msrc/components/ui/StaticSurfaceSection.tsx[39m 2ms (unchanged)
[90msrc/components/ui/StatusCard.tsx[39m 12ms (unchanged)
[90msrc/components/ui/Switch.tsx[39m 5ms (unchanged)
[90msrc/components/ui/table.tsx[39m 12ms (unchanged)
[90msrc/components/ui/tabs.tsx[39m 4ms (unchanged)
[90msrc/components/ui/textarea.tsx[39m 2ms (unchanged)
src/components/ui/TileCard.tsx 4ms
[90msrc/components/ui/toast/ToastsProvider.tsx[39m 8ms (unchanged)
[90msrc/components/ui/tooltip.tsx[39m 2ms (unchanged)
[90msrc/config/env.ts[39m 11ms (unchanged)
[90msrc/config/flags.ts[39m 8ms (unchanged)
[90msrc/config/modelDescriptions.ts[39m 5ms (unchanged)
[90msrc/config/modelPolicy.ts[39m 3ms (unchanged)
[90msrc/config/models.ts[39m 22ms (unchanged)
[90msrc/config/promptTemplates.ts[39m 1ms (unchanged)
[90msrc/config/quickstarts.test.ts[39m 14ms (unchanged)
[90msrc/config/quickstarts.ts[39m 11ms (unchanged)
[90msrc/config/roleStore.ts[39m 15ms (unchanged)
[90msrc/config/settings.ts[39m 11ms (unchanged)
[90msrc/contexts/CustomRolesContext.tsx[39m 7ms (unchanged)
[90msrc/contexts/FavoritesContext.tsx[39m 9ms (unchanged)
[90msrc/data/roles.dataset.ts[39m 12ms (unchanged)
[90msrc/data/roles.ts[39m 10ms (unchanged)
[90msrc/features/discussion/__tests__/shape.test.ts[39m 4ms (unchanged)
[90msrc/features/discussion/shape.ts[39m 8ms (unchanged)
[90msrc/features/prompt/composeSystemPrompt.ts[39m 6ms (unchanged)
[90msrc/features/settings/SettingsOverview.tsx[39m 10ms (unchanged)
[90msrc/features/settings/SettingsView.tsx[39m 33ms (unchanged)
[90msrc/hooks/__tests__/useChat.systemPrompt.test.ts[39m 10ms (unchanged)
[90msrc/hooks/use-storage.ts[39m 18ms (unchanged)
[90msrc/hooks/useChat.ts[39m 17ms (unchanged)
[90msrc/hooks/useConversationManager.ts[39m 12ms (unchanged)
[90msrc/hooks/useDeferredFetch.ts[39m 19ms (unchanged)
[90msrc/hooks/useEdgeSwipe.ts[39m 18ms (unchanged)
[90msrc/hooks/useFavoritesManager.ts[39m 29ms (unchanged)
[90msrc/hooks/useFeatureFlags.tsx[39m 7ms (unchanged)
[90msrc/hooks/useFilteredList.ts[39m 2ms (unchanged)
[90msrc/hooks/useMediaQuery.ts[39m 3ms (unchanged)
[90msrc/hooks/useMemory.ts[39m 4ms (unchanged)
[90msrc/hooks/usePWAInstall.ts[39m 4ms (unchanged)
[90msrc/hooks/useServiceWorker.ts[39m 3ms (unchanged)
[90msrc/hooks/useSettings.ts[39m 4ms (unchanged)
[90msrc/hooks/useStickToBottom.ts[39m 9ms (unchanged)
[90msrc/hooks/useVisualViewport.ts[39m 5ms (unchanged)
[90msrc/index.css[39m 3ms (unchanged)
[90msrc/lib/a11y/touchTargets.ts[39m 19ms (unchanged)
[90msrc/lib/analytics.test.ts[39m 15ms (unchanged)
[90msrc/lib/analytics.ts[39m 18ms (unchanged)
[90msrc/lib/conversation-manager-modern.ts[39m 13ms (unchanged)
[90msrc/lib/errors/__tests__/mapper.test.ts[39m 7ms (unchanged)
[90msrc/lib/errors/humanError.ts[39m 4ms (unchanged)
[90msrc/lib/errors/index.ts[39m 1ms (unchanged)
[90msrc/lib/errors/mapper.ts[39m 5ms (unchanged)
[90msrc/lib/errors/types.ts[39m 10ms (unchanged)
[90msrc/lib/highlighting/lazySyntaxHighlighter.ts[39m 6ms (unchanged)
[90msrc/lib/highlighting/prismTheme.ts[39m 2ms (unchanged)
[90msrc/lib/http.ts[39m 5ms (unchanged)
[90msrc/lib/icons/index.ts[39m 1ms (unchanged)
[90msrc/lib/logging.ts[39m 2ms (unchanged)
[90msrc/lib/memory/memoryService.ts[39m 2ms (unchanged)
[90msrc/lib/mobile-testing-plan.md[39m 27ms (unchanged)
[90msrc/lib/monitoring/README.md[39m 12ms (unchanged)
[90msrc/lib/monitoring/sentry.tsx[39m 8ms (unchanged)
[90msrc/lib/net/concurrency.ts[39m 7ms (unchanged)
[90msrc/lib/net/fetchTimeout.ts[39m 8ms (unchanged)
[90msrc/lib/net/rateLimit.ts[39m 3ms (unchanged)
[90msrc/lib/openrouter/__tests__/key.test.ts[39m 3ms (unchanged)
[90msrc/lib/openrouter/__tests__/keyLifecycle.test.ts[39m 7ms (unchanged)
[90msrc/lib/openrouter/key.ts[39m 5ms (unchanged)
[90msrc/lib/pwa/registerSW.ts[39m 12ms (unchanged)
src/lib/pwa/SW_VERSIONING_README.md 27ms
[90msrc/lib/pwa/sw-versioning.ts[39m 10ms (unchanged)
[90msrc/lib/recovery/resetApp.ts[39m 4ms (unchanged)
[90msrc/lib/safeStorage.ts[39m 5ms (unchanged)
[90msrc/lib/storage-layer.ts[39m 50ms (unchanged)
[90msrc/lib/storage-migration.ts[39m 18ms (unchanged)
[90msrc/lib/touch/__tests__/gestures.test.ts[39m 20ms (unchanged)
[90msrc/lib/touch/__tests__/haptics.test.ts[39m 28ms (unchanged)
[90msrc/lib/touch/gestures.ts[39m 26ms (unchanged)
[90msrc/lib/touch/haptics.ts[39m 7ms (unchanged)
[90msrc/lib/utils.ts[39m 1ms (unchanged)
[90msrc/lib/utils/production-logger.ts[39m 7ms (unchanged)
[90msrc/lib/utils/reload-manager.ts[39m 1ms (unchanged)
[90msrc/lib/validators/roles.ts[39m 3ms (unchanged)
[90msrc/main.tsx[39m 11ms (unchanged)
[90msrc/pages/Chat.tsx[39m 14ms (unchanged)
[90msrc/pages/MobileModels.tsx[39m 3ms (unchanged)
[90msrc/pages/MobileStudio.tsx[39m 3ms (unchanged)
[90msrc/pages/SettingsApi.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsAppearance.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsData.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsFilters.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsMemory.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsOverviewPage.tsx[39m 1ms (unchanged)
[90msrc/pages/StudioHome.tsx[39m 7ms (unchanged)
[90msrc/prompts/discussion/presets.ts[39m 4ms (unchanged)
[90msrc/services/openrouter.ts[39m 10ms (unchanged)
[90msrc/state/chatReducer.ts[39m 5ms (unchanged)
[90msrc/styles/base.css[39m 3ms (unchanged)
[90msrc/styles/components.css[39m 42ms (unchanged)
[90msrc/styles/design-tokens.generated.ts[39m 11ms (unchanged)
[90msrc/styles/design-tokens.ts[39m 4ms (unchanged)
[90msrc/styles/mobile-enhancements.css[39m 2ms (unchanged)
[90msrc/styles/README.md[39m 10ms (unchanged)
[90msrc/styles/theme.css[39m 61ms (unchanged)
[90msrc/styles/theme.ts[39m 9ms (unchanged)
[90msrc/styles/tokens.css[39m 11ms (unchanged)
[90msrc/styles/tokens/category-colors.ts[39m 6ms (unchanged)
[90msrc/styles/tokens/category-tonal-scales.ts[39m 22ms (unchanged)
[90msrc/styles/tokens/color.ts[39m 15ms (unchanged)
[90msrc/styles/tokens/motion.ts[39m 2ms (unchanged)
[90msrc/styles/tokens/radius.ts[39m 2ms (unchanged)
[90msrc/styles/tokens/shadow.ts[39m 3ms (unchanged)
[90msrc/styles/tokens/spacing.ts[39m 6ms (unchanged)
[90msrc/styles/tokens/typography.ts[39m 7ms (unchanged)
[90msrc/styles/ui-state-animations.css[39m 11ms (unchanged)
[90msrc/styles/z-index-system.css[39m 4ms (unchanged)
[90msrc/types/chat.ts[39m 1ms (unchanged)
[90msrc/types/chatMessage.ts[39m 1ms (unchanged)
[90msrc/types/enhanced-interfaces.ts[39m 18ms (unchanged)
[90msrc/types/index.ts[39m 2ms (unchanged)
[90msrc/types/prism-modules.d.ts[39m 1ms (unchanged)
[90msrc/utils/category-mapping.ts[39m 7ms (unchanged)
[90msrc/utils/colorConverters.ts[39m 3ms (unchanged)
[90msrc/utils/pricing.ts[39m 3ms (unchanged)
[90msrc/vitest-env.d.ts[39m 1ms (unchanged)
[90mSTORAGE_MIGRATION_GUIDE.md[39m 42ms (unchanged)
[90mtailwind.config.ts[39m 9ms (unchanged)
[90mtests/e2e/api-mock.ts[39m 8ms (unchanged)
[90mtests/e2e/chat-flow.spec.ts[39m 17ms (unchanged)
[90mtests/e2e/error-handling.spec.ts[39m 37ms (unchanged)
[90mtests/e2e/helpers/app-helpers.ts[39m 20ms (unchanged)
[90mtests/e2e/models-flow.spec.ts[39m 35ms (unchanged)
[90mtests/e2e/pwa-mobile.spec.ts[39m 40ms (unchanged)
[90mtests/e2e/roles.spec.ts[39m 7ms (unchanged)
[90mtests/e2e/settings-flow.spec.ts[39m 23ms (unchanged)
[90mtests/e2e/smoke.spec.ts[39m 8ms (unchanged)
[90mtests/e2e/storage-migration.spec.ts[39m 8ms (unchanged)
[90mtests/polyfills.ts[39m 7ms (unchanged)
[90mtests/setup.ts[39m 2ms (unchanged)
[90mtests/setup/fetch.ts[39m 2ms (unchanged)
[90mtests/unit/composeSystemPrompt.test.ts[39m 2ms (unchanged)
[90mtests/unit/copyButton.test.tsx[39m 5ms (unchanged)
[90mtests/unit/ErrorBoundary.test.tsx[39m 5ms (unchanged)
[90mtests/unit/lib/conversation-manager-modern.test.ts[39m 22ms (unchanged)
[90mtests/unit/lib/export-validation.test.ts[39m 2ms (unchanged)
[90mtests/unit/lib/storage-integration.test.ts[39m 5ms (unchanged)
[90mtests/unit/lib/storage-layer-business.test.ts[39m 24ms (unchanged)
[90mtests/unit/lib/storage-layer-simple.test.ts[39m 23ms (unchanged)
[90mtests/unit/lib/storage-layer.test.ts[39m 18ms (unchanged)
[90mtests/unit/lib/storage-migration-integration.test.ts[39m 6ms (unchanged)
[90mtests/unit/lib/storage-migration.test.ts[39m 37ms (unchanged)
[90mtests/unit/lib/storage-performance-simple.test.ts[39m 18ms (unchanged)
[90mtests/unit/lib/storage-performance.test.ts[39m 16ms (unchanged)
[90mtests/unit/rateLimit.test.ts[39m 3ms (unchanged)
[90mtests/unit/useChat.test.tsx[39m 6ms (unchanged)
tools/cf-purge.js 18ms
[90mtools/check-css-hex.mjs[39m 5ms (unchanged)
[90mtsconfig.base.json[39m 1ms (unchanged)
[90mtsconfig.build.json[39m 1ms (unchanged)
[90mtsconfig.json[39m 1ms (unchanged)
[90mtsconfig.node.json[39m 1ms (unchanged)
[90mtsconfig.test.json[39m 1ms (unchanged)
[90mvite-env.d.ts[39m 4ms (unchanged)
[90mvite.config.ts[39m 11ms (unchanged)
[90mvitest.config.ts[39m 2ms (unchanged)
Checking for unused imports...
npm warn config production Use `--omit=dev` instead.
77 modules with unused exports
/home/runner/work/Disa_Ai/Disa_Ai/src/api/chat.ts: ChatRequest
/home/runner/work/Disa_Ai/Disa_Ai/src/api/openrouter.ts: checkApiHealth
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/card-types.ts: BaseCardProps, ExtendedCardProps, StatusType, DiscussionCategory, AdvancedInteractiveCardProps, MenuItem, CardGridProps, InteractionType, IntentType, StateType, ToneType, ElevationType, PaddingType, SizeType, CardVariantCombination, CardEventHandler, CardKeyboardEventHandler, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardContentProps, CardFooterProps, ConditionalCardProps, STATUS_TYPES, DISCUSSION_CATEGORIES, INTERACTION_TYPES, INTENT_TYPES, STATE_TYPES
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/index.ts: CardProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ModelCardProps, ModelCard, CardVariantProps, CardUtils, Avatar, AvatarFallback, AvatarImage, BadgeProps, badgeVariants, ButtonProps, buttonVariants, ChipProps, Chip, chipVariants, DialogOverlayProps, DialogContentProps, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, InputProps, inputVariants, SelectGroup, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, StaticSurfaceSection, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, TextareaProps, Textarea, textareaVariants, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, DiscussionTopicCard, DiscussionTopicCardSkeleton, DiscussionTopicGridProps, DiscussionTopicGrid, StatusCard, LoadingCard, SuccessCard, ErrorCard, WarningCard, InfoCard
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
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/use-storage.ts: UseConversationsOptions, UseConversationsReturn, useConversations, UseConversationReturn, useConversation, UseConversationStatsReturn, UseStorageMigrationReturn, UseStorageHealthReturn, useBulkOperations
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useChat.ts: UseChatOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useDeferredFetch.ts: useDeferredFetch, useDeferredLoad, getDeferredFetchStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useEdgeSwipe.ts: EdgeSwipeOptions, EdgeSwipeState, useEdgeSwipe
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useFavoritesManager.ts: useFavoriteStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useMediaQuery.ts: useMediaQuery
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/analytics.ts: AnalyticsEvent, AnalyticsSession, AnalyticsStats
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/conversation-manager-modern.ts: ExportData, ImportResult, bulkUpdateConversations, getConversationById, migrateFromLocalStorage, getStoragePerformance
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/http.ts: FetchJsonOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/logging.ts: logInfo, logError
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/safeStorage.ts: SafeStorage, safeStorage
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/storage-layer.ts: StorageStats, ModernStorageLayer, setModernStorageInstance, getModernStorageInstance
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/storage-migration.ts: MigrationResult, MigrationOptions, StorageMigration
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/a11y/touchTargets.ts: TOUCH_TARGET_SIZES, A11yViolation, validateTouchTarget, validateAriaAttributes, autoFixA11yViolations, scanDocumentA11y, enforceA11yStandards, createA11yObserver, FocusManager
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/errors/humanError.ts: HumanError
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/errors/index.ts: ApiError, HttpError, NotFoundError, ApiClientError, UnknownError
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/highlighting/lazySyntaxHighlighter.ts: preloadHighlighter, getHighlighterStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/icons/index.ts: AlertTriangle, ArrowLeft, Book, Clock, Code, History, Menu, MessageCircle, Pin, PinOff, Plus, Tag, ThumbsDown, ThumbsUp, Trash2
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/concurrency.ts: ConcurrencyManager
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/fetchTimeout.ts: FetchWithTimeoutOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/net/rateLimit.ts: TokenBucket
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/pwa/registerSW.ts: RegisterResult
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/pwa/sw-versioning.ts: CACHE_VERSION, CACHE_PREFIX, getVersionedCacheName, isCurrentVersionCache, deleteOldCaches, SW_UPDATE_CHANNEL, ServiceWorkerUpdateMessage, broadcastSWUpdate, listenForSWUpdates, getCacheStats
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/gestures.ts: TouchGestureOptions, SwipeEvent, TapEvent, ensureTouchTarget, debouncedTouch
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/touch/haptics.ts: HapticOptions, HapticPattern, isHapticSupported, prefersReducedMotion, triggerHaptic, withHaptic, addHapticToElement
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/utils/production-logger.ts: devLog, prodError, safeLog, safeInfo, safeDebug
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/validators/roles.ts: safetySchema, RoleSchema, parseRoles
/home/runner/work/Disa_Ai/Disa_Ai/src/prompts/discussion/presets.ts: discussionPresets, discussionPresetOptions
/home/runner/work/Disa_Ai/Disa_Ai/src/services/openrouter.ts: getApiKey, setApiKey, pingOpenRouter, chatOnce, chatStream
/home/runner/work/Disa_Ai/Disa_Ai/src/state/chatReducer.ts: ChatState, ChatAction
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/design-tokens.ts: DesignTokens
/home/runner/work/Disa_Ai/Disa_Ai/src/styles/theme.ts: ColorMode, ThemePreference, ThemeState
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
/home/runner/work/Disa_Ai/Disa_Ai/src/utils/category-mapping.ts: CATEGORY_MAP, KEY_TO_LABEL_MAP, CATEGORY_ICONS, isValidCategoryKey, getCategoryLabel, getCategoryIcon, useCategoryData, validateCategory, CATEGORY_KEYS
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ErrorBoundary.tsx: useErrorReporting, StartupDiagnostics
/home/runner/work/Disa_Ai/Disa_Ai/src/components/NetworkBanner.tsx: default
/home/runner/work/Disa_Ai/Disa_Ai/src/components/StorageMigration.tsx: StorageMigration
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/ChatMessage.tsx: ChatMessageType
/home/runner/work/Disa_Ai/Disa_Ai/src/components/chat/ChatScreen.tsx: ChatScreen
/home/runner/work/Disa_Ai/Disa_Ai/src/components/dev/FeatureFlagPanel.tsx: FeatureFlagIndicator
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/CopyButton.tsx: CopyButton
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/SectionCard.tsx: SectionCardProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/TileCard.tsx: TileCardProps, TileCard
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/aurora-button.tsx: AuroraButtonProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/aurora-card.tsx: AuroraCardProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/label.tsx: LabelProps
/home/runner/work/Disa_Ai/Disa_Ai/src/contexts/CustomRolesContext.tsx: CustomRole, useCustomRoles
/home/runner/work/Disa_Ai/Disa_Ai/src/contexts/FavoritesContext.tsx: useFavoriteActions, useFavoritesAnalytics, withFavorites, FavoritesLoader
/home/runner/work/Disa_Ai/Disa_Ai/src/features/settings/SettingsView.tsx: SettingsSectionKey
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useFeatureFlags.tsx: useFeatureFlags, useAnyFeatureFlags, useAllFeatureFlags, useActiveFeatureFlags, withFeatureFlag
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/monitoring/sentry.tsx: captureError, addBreadcrumb, setUserContext, profileFunction
Running local maintenance scripts...
Building project...
Running vite build...
npm warn config production Use `--omit=dev` instead.
[36mvite v7.2.2 [32mbuilding client environment for production...[36m[39m
transforming...
[32m✓[39m 3288 modules transformed.
rendering chunks...
[2mdist/[22m[32mmanifest.webmanifest                                   [39m[1m[2m  0.37 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Size3-Regular-CTq5MqoE.woff         [39m[1m[2m  4.42 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Size4-Regular-Dl5lxZxV.woff2        [39m[1m[2m  4.93 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Size2-Regular-Dy4dx90m.woff2        [39m[1m[2m  5.21 kB[22m[1m[22m
[2mdist/[22m[32mindex.html                                             [39m[1m[2m  5.24 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Size1-Regular-mCD8mA8B.woff2        [39m[1m[2m  5.47 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Size4-Regular-BF-4gkZK.woff         [39m[1m[2m  5.98 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Size2-Regular-oD1tc_U0.woff         [39m[1m[2m  6.19 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Size1-Regular-C195tn64.woff         [39m[1m[2m  6.50 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Caligraphic-Regular-Di6jR-x-.woff2  [39m[1m[2m  6.91 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Caligraphic-Bold-Dq_IR9rO.woff2     [39m[1m[2m  6.91 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Size3-Regular-DgpXs0kz.ttf          [39m[1m[2m  7.59 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Caligraphic-Regular-CTRA-rTL.woff   [39m[1m[2m  7.66 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Caligraphic-Bold-BEiXGLvX.woff      [39m[1m[2m  7.72 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Script-Regular-D3wIWfF6.woff2       [39m[1m[2m  9.64 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_SansSerif-Regular-DDBCnlJ7.woff2    [39m[1m[2m 10.34 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Size4-Regular-DWFBv043.ttf          [39m[1m[2m 10.36 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Script-Regular-D5yQViql.woff        [39m[1m[2m 10.59 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Fraktur-Regular-CTYiF6lA.woff2      [39m[1m[2m 11.32 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Fraktur-Bold-CL6g_b3V.woff2         [39m[1m[2m 11.35 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Size2-Regular-B7gKUWhC.ttf          [39m[1m[2m 11.51 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_SansSerif-Italic-C3H0VqGB.woff2     [39m[1m[2m 12.03 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_SansSerif-Bold-D1sUS0GD.woff2       [39m[1m[2m 12.22 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Size1-Regular-Dbsnue_I.ttf          [39m[1m[2m 12.23 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_SansSerif-Regular-CS6fqUqJ.woff     [39m[1m[2m 12.32 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Caligraphic-Regular-wX97UBjC.ttf    [39m[1m[2m 12.34 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Caligraphic-Bold-ATXxdsX0.ttf       [39m[1m[2m 12.37 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Fraktur-Regular-Dxdc4cR9.woff       [39m[1m[2m 13.21 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Fraktur-Bold-BsDP51OF.woff          [39m[1m[2m 13.30 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Typewriter-Regular-CO6r4hn1.woff2   [39m[1m[2m 13.57 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_SansSerif-Italic-DN2j7dab.woff      [39m[1m[2m 14.11 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_SansSerif-Bold-DbIhKOiC.woff        [39m[1m[2m 14.41 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Typewriter-Regular-C0xS9mPB.woff    [39m[1m[2m 16.03 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Math-BoldItalic-CZnvNsCZ.woff2      [39m[1m[2m 16.40 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Math-Italic-t53AETM-.woff2          [39m[1m[2m 16.44 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Script-Regular-C5JkGWo-.ttf         [39m[1m[2m 16.65 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Main-BoldItalic-DxDJ3AOS.woff2      [39m[1m[2m 16.78 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Main-Italic-NWA7e6Wa.woff2          [39m[1m[2m 16.99 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Math-BoldItalic-iY-2wyZ7.woff       [39m[1m[2m 18.67 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Math-Italic-DA0__PXp.woff           [39m[1m[2m 18.75 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Main-BoldItalic-SpSLRI95.woff       [39m[1m[2m 19.41 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_SansSerif-Regular-BNo7hRIc.ttf      [39m[1m[2m 19.44 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Fraktur-Regular-CB_wures.ttf        [39m[1m[2m 19.57 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Fraktur-Bold-BdnERNNW.ttf           [39m[1m[2m 19.58 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Main-Italic-BMLOBm91.woff           [39m[1m[2m 19.68 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_SansSerif-Italic-YYjJ1zSn.ttf       [39m[1m[2m 22.36 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_SansSerif-Bold-CFMepnvq.ttf         [39m[1m[2m 24.50 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Main-Bold-Cx986IdX.woff2            [39m[1m[2m 25.32 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Main-Regular-B22Nviop.woff2         [39m[1m[2m 26.27 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Typewriter-Regular-D3Ib7_Hf.ttf     [39m[1m[2m 27.56 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_AMS-Regular-BQhdFMY1.woff2          [39m[1m[2m 28.08 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Main-Bold-Jm3AIy58.woff             [39m[1m[2m 29.91 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Main-Regular-Dr94JaBh.woff          [39m[1m[2m 30.77 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Math-BoldItalic-B3XSjfu4.ttf        [39m[1m[2m 31.20 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Math-Italic-flOr_0UB.ttf            [39m[1m[2m 31.31 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Main-BoldItalic-DzxPMmG6.ttf        [39m[1m[2m 32.97 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_AMS-Regular-DMm9YOAa.woff           [39m[1m[2m 33.52 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Main-Italic-3WenGoN9.ttf            [39m[1m[2m 33.58 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Main-Bold-waoOVXN0.ttf              [39m[1m[2m 51.34 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_Main-Regular-ypZvNtVU.ttf           [39m[1m[2m 53.58 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[32mfonts/KaTeX_AMS-Regular-DRggAlZN.ttf            [39m[1m[2m 63.63 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/prism-Cg1sXqY3.css                          [39m[1m[2m  1.31 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/index-Br4WKVpv.css                          [39m[1m[2m 14.01 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/index-CIlWet1I.css                          [39m[1m[2m 22.45 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/katex-BfKSBGtd.css                          [39m[1m[2m 29.55 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/reload-manager-DqJ_LRMs.js                   [39m[1m[2m  0.25 kB[22m[1m[22m[2m │ map:     0.69 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsApi-DHuP_a6B.js                      [39m[1m[2m  0.69 kB[22m[1m[22m[2m │ map:     0.89 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsData-DKwAFNIV.js                     [39m[1m[2m  0.69 kB[22m[1m[22m[2m │ map:     0.90 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsMemory-IZ_1j6Ke.js                   [39m[1m[2m  0.70 kB[22m[1m[22m[2m │ map:     0.91 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsFilters-BEF-IqNL.js                  [39m[1m[2m  0.70 kB[22m[1m[22m[2m │ map:     0.91 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsAppearance-hZ9elI8C.js               [39m[1m[2m  0.71 kB[22m[1m[22m[2m │ map:     0.93 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/useFeatureFlags-NpfRH-2c.js                  [39m[1m[2m  0.84 kB[22m[1m[22m[2m │ map:     6.34 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/key-C3rcisgd.js                              [39m[1m[2m  0.93 kB[22m[1m[22m[2m │ map:     4.71 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/MobileStudio-w0s4yVqk.js                     [39m[1m[2m  1.15 kB[22m[1m[22m[2m │ map:     1.33 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/MobileModels-D3eCH00T.js                     [39m[1m[2m  1.22 kB[22m[1m[22m[2m │ map:     1.34 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/input-B1S8bwEX.js                            [39m[1m[2m  1.47 kB[22m[1m[22m[2m │ map:     2.80 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/avatar-ZdpHHapr.js                           [39m[1m[2m  1.52 kB[22m[1m[22m[2m │ map:     4.74 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/roleStore-CRSkV1TG.js                        [39m[1m[2m  1.74 kB[22m[1m[22m[2m │ map:     8.58 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/mapper-C_sHhEd2.js                           [39m[1m[2m  2.15 kB[22m[1m[22m[2m │ map:     9.79 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/useSettings-qr7DkdeY.js                      [39m[1m[2m  3.43 kB[22m[1m[22m[2m │ map:    12.95 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/badge-Dceb4KaT.js                            [39m[1m[2m  3.74 kB[22m[1m[22m[2m │ map:     5.61 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/FeatureFlagPanel-CqudM_Uq.js                 [39m[1m[2m  3.83 kB[22m[1m[22m[2m │ map:     9.89 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/StudioHome-CZecV-QB.js                       [39m[1m[2m  4.04 kB[22m[1m[22m[2m │ map:     7.95 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsOverviewPage-D0JaeXZQ.js             [39m[1m[2m  5.65 kB[22m[1m[22m[2m │ map:    24.50 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/modelDescriptions-DYsQFogR.js                [39m[1m[2m  9.62 kB[22m[1m[22m[2m │ map:    12.60 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/conversation-manager-modern-DoULKHL0.js      [39m[1m[2m 12.15 kB[22m[1m[22m[2m │ map:    46.53 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsView-D6Tgv4a7.js                     [39m[1m[2m 14.26 kB[22m[1m[22m[2m │ map:    36.38 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedRolesInterface-BdAvyMsf.js           [39m[1m[2m 15.61 kB[22m[1m[22m[2m │ map:    52.38 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedModelsInterface-BojlQ3RP.js          [39m[1m[2m 24.21 kB[22m[1m[22m[2m │ map:    79.00 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/StatusCard-DlqxzDW1.js                       [39m[1m[2m 25.09 kB[22m[1m[22m[2m │ map:    65.16 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Chat-C97zUHjT.js                             [39m[1m[2m 39.39 kB[22m[1m[22m[2m │ map:   125.74 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/prism-6szAjCP6.js                            [39m[1m[2m 58.95 kB[22m[1m[22m[2m │ map:   172.23 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/utils-Cko2a-Fc.js                            [39m[1m[2m 72.22 kB[22m[1m[22m[2m │ map:   425.81 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/radix-ui-GTR3n2e9.js                         [39m[1m[2m 75.20 kB[22m[1m[22m[2m │ map:   369.13 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-BLcpInED.js                            [39m[1m[2m 98.32 kB[22m[1m[22m[2m │ map:   294.85 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/vendor-Bb3Hu5kB.js                           [39m[1m[2m556.04 kB[22m[1m[22m[2m │ map: 2,813.43 kB[22m
[2m[1m95[2m[22m chunks of [2m[1m2.07 MB[2m[22m (gzip: [2m[1m1.22 MB[2m[22m | map: [2m[1m4.40 MB[2m[22m)
[32m✓ built in 10.64s[39m

[36mPWA v1.1.0[39m
mode      [35mgenerateSW[39m
precache  [32m56 entries[39m [2m(1604.90 KiB)[22m
files generated
  [2mdist/sw.js.map[22m
  [2mdist/sw.js[22m
  [2mdist/workbox-239d0d27.js.map[22m
  [2mdist/workbox-239d0d27.js[22m
Build completed. Preview server available on port 4173 with: npm run preview
No autopilot-summary.mjs found, using basic summary
```
