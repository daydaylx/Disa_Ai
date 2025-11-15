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
[90m.changeset/config.json[39m 39ms (unchanged)
[90m.changeset/README.md[39m 55ms (unchanged)
[90m.changeset/sparkly-ghosts-wear.md[39m 1ms (unchanged)
[90m.github/dependabot.yml[39m 4ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.md[39m 7ms (unchanged)
[90m.github/ISSUE_TEMPLATE/bug_report.yml[39m 21ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.md[39m 4ms (unchanged)
[90m.github/ISSUE_TEMPLATE/feature_request.yml[39m 20ms (unchanged)
[90m.github/pull_request_template.md[39m 15ms (unchanged)
[90m.github/REQUIRED_CHECKS.md[39m 8ms (unchanged)
[90m.github/workflows/autopilot.yml[39m 7ms (unchanged)
[90m.github/workflows/bundle-monitor.yml[39m 8ms (unchanged)
[90m.github/workflows/ci.yml[39m 24ms (unchanged)
[90m.github/workflows/code-quality.yml[39m 12ms (unchanged)
[90m.github/workflows/codeql.yml[39m 4ms (unchanged)
[90m.github/workflows/codescan.yml[39m 6ms (unchanged)
[90m.github/workflows/dependency-review.yml[39m 5ms (unchanged)
[90m.github/workflows/gemini-dispatch.yml[39m 17ms (unchanged)
[90m.github/workflows/gemini-invoke.yml[39m 8ms (unchanged)
[90m.github/workflows/gemini-review.yml[39m 11ms (unchanged)
[90m.github/workflows/gemini-scheduled-triage.yml[39m 13ms (unchanged)
[90m.github/workflows/gemini-triage.yml[39m 5ms (unchanged)
[90m.github/workflows/lighthouse.yml[39m 3ms (unchanged)
[90m.github/workflows/release.yml[39m 11ms (unchanged)
[90m.github/workflows/verify-dist.yml[39m 7ms (unchanged)
[90m.prettierrc.json[39m 2ms (unchanged)
[90m.qwen/PROJECT_SUMMARY.md[39m 8ms (unchanged)
[90m.stylelintrc.json[39m 6ms (unchanged)
[90mAGENTS.md[39m 15ms (unchanged)
[90mDEPENDENCIES_UPDATE_STRATEGY.md[39m 28ms (unchanged)
[90mdeploy/cloudflare/cloudflare-pages.json[39m 2ms (unchanged)
[90meslint.config.mjs[39m 25ms (unchanged)
[90mfunctions/api/chat.ts[39m 81ms (unchanged)
[90mfunctions/api/feedback.ts[39m 21ms (unchanged)
[90mindex.html[39m 81ms (unchanged)
[90mMIGRATION_GUIDE.md[39m 29ms (unchanged)
[90mpackage-lock.json[39m 191ms (unchanged)
[90mpackage.json[39m 2ms (unchanged)
[90mplaywright.config.ts[39m 7ms (unchanged)
[90mPRIVACY.md[39m 16ms (unchanged)
[90mpublic/datenschutz.html[39m 23ms (unchanged)
[90mpublic/impressum.html[39m 15ms (unchanged)
[90mpublic/manifest.webmanifest[39m 9ms (unchanged)
[90mpublic/models.json[39m 8ms (unchanged)
[90mpublic/offline.html[39m 42ms (unchanged)
[90mpublic/persona.json[39m 21ms (unchanged)
[90mpublic/privacy-policy.html[39m 10ms (unchanged)
[90mpublic/quickstarts.json[39m 2ms (unchanged)
[90mpublic/styles.json[39m 10ms (unchanged)
[90mREADME.md[39m 79ms (unchanged)
[90mrendered.html[39m 108ms (unchanged)
[90mrenovate.json[39m 5ms (unchanged)
[90mscripts/build-info.js[39m 13ms (unchanged)
[90mscripts/check-dist-integrity.mjs[39m 7ms (unchanged)
[90mscripts/generate-routes.js[39m 4ms (unchanged)
[90mscripts/generate-tokens.mjs[39m 8ms (unchanged)
[90mscripts/run-preview.mjs[39m 21ms (unchanged)
[90mscripts/verify-dist.mjs[39m 5ms (unchanged)
[90mshared/openrouter.ts[39m 4ms (unchanged)
[90msrc/__tests__/apiKeyShim.test.ts[39m 10ms (unchanged)
[90msrc/__tests__/branding.test.tsx[39m 5ms (unchanged)
[90msrc/__tests__/colorConverters.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/designTokens.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/humanError.test.ts[39m 8ms (unchanged)
[90msrc/__tests__/memory.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/message-id-synchronization.test.ts[39m 50ms (unchanged)
[90msrc/__tests__/models-fallback.test.ts[39m 28ms (unchanged)
[90msrc/__tests__/models.cache.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/networkBanner.test.tsx[39m 3ms (unchanged)
[90msrc/__tests__/openrouter.abort.test.ts[39m 3ms (unchanged)
[90msrc/__tests__/openrouter.ndjson.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/openrouter.test.ts[39m 4ms (unchanged)
[90msrc/__tests__/sw-cache-management.test.ts[39m 13ms (unchanged)
[90msrc/__tests__/useChat.race-condition.test.ts[39m 22ms (unchanged)
[90msrc/__tests__/viewport-scroll-performance.test.ts[39m 16ms (unchanged)
[90msrc/api/chat.ts[39m 8ms (unchanged)
[90msrc/api/memory.ts[39m 8ms (unchanged)
[90msrc/api/openrouter.ts[39m 30ms (unchanged)
[90msrc/App.tsx[39m 22ms (unchanged)
[90msrc/app/components/BrandWordmark.tsx[39m 2ms (unchanged)
[90msrc/app/components/RouteWrapper.tsx[39m 2ms (unchanged)
[90msrc/app/layouts/AppShell.tsx[39m 9ms (unchanged)
[90msrc/app/router.tsx[39m 32ms (unchanged)
[90msrc/app/state/StudioContext.tsx[39m 6ms (unchanged)
[90msrc/components/BuildInfo.tsx[39m 7ms (unchanged)
[90msrc/components/chat/ChatComposer.tsx[39m 18ms (unchanged)
[90msrc/components/chat/ChatLiveRegion.tsx[39m 3ms (unchanged)
[90msrc/components/chat/ChatMessage.tsx[39m 32ms (unchanged)
[90msrc/components/chat/ChatScreen.tsx[39m 6ms (unchanged)
[90msrc/components/chat/VirtualizedMessageList.tsx[39m 17ms (unchanged)
[90msrc/components/dev/FeatureFlagPanel.tsx[39m 10ms (unchanged)
[90msrc/components/ErrorBoundary.tsx[39m 21ms (unchanged)
[90msrc/components/layout/EnhancedBottomNav.tsx[39m 7ms (unchanged)
[90msrc/components/layout/grid-system.tsx[39m 13ms (unchanged)
[90msrc/components/layout/Header.tsx[39m 9ms (unchanged)
[90msrc/components/layout/MobileBottomNav.tsx[39m 11ms (unchanged)
[90msrc/components/layout/standard-layout.tsx[39m 12ms (unchanged)
[90msrc/components/models/__tests__/categorizeModelFromTags.test.ts[39m 3ms (unchanged)
[90msrc/components/models/EnhancedModelsInterface.tsx[39m 56ms (unchanged)
[90msrc/components/models/ModelComparisonTable.tsx[39m 6ms (unchanged)
[90msrc/components/NetworkBanner.tsx[39m 2ms (unchanged)
[90msrc/components/pwa/PWADebugInfo.tsx[39m 7ms (unchanged)
[90msrc/components/pwa/PWAInstallPrompt.tsx[39m 4ms (unchanged)
[90msrc/components/roles/EnhancedRolesInterface.tsx[39m 19ms (unchanged)
[90msrc/components/roles/roles-filter.ts[39m 7ms (unchanged)
[90msrc/components/shell/SettingsDrawer.tsx[39m 14ms (unchanged)
[90msrc/components/StorageMigration.tsx[39m 27ms (unchanged)
[90msrc/components/ui/__tests__/button.test.tsx[39m 11ms (unchanged)
[90msrc/components/ui/async-states.tsx[39m 12ms (unchanged)
[90msrc/components/ui/aurora-button.tsx[39m 3ms (unchanged)
[90msrc/components/ui/aurora-card.tsx[39m 2ms (unchanged)
[90msrc/components/ui/avatar.tsx[39m 6ms (unchanged)
[90msrc/components/ui/badge.tsx[39m 3ms (unchanged)
[90msrc/components/ui/button.tsx[39m 7ms (unchanged)
[90msrc/components/ui/card-system.md[39m 28ms (unchanged)
[90msrc/components/ui/card-types.ts[39m 8ms (unchanged)
[90msrc/components/ui/card.tsx[39m 23ms (unchanged)
[90msrc/components/ui/chip.tsx[39m 15ms (unchanged)
[90msrc/components/ui/chip/README.md[39m 21ms (unchanged)
[90msrc/components/ui/CopyButton.tsx[39m 9ms (unchanged)
[90msrc/components/ui/Dialog.tsx[39m 10ms (unchanged)
[90msrc/components/ui/DiscussionTopicCard.tsx[39m 12ms (unchanged)
[90msrc/components/ui/drawer-sheet.tsx[39m 14ms (unchanged)
[90msrc/components/ui/dropdown-menu.tsx[39m 13ms (unchanged)
[90msrc/components/ui/FilterChip.tsx[39m 2ms (unchanged)
[90msrc/components/ui/GlassPanel.tsx[39m 2ms (unchanged)
[90msrc/components/ui/IconButton.tsx[39m 2ms (unchanged)
[90msrc/components/ui/index.ts[39m 5ms (unchanged)
[90msrc/components/ui/input.tsx[39m 3ms (unchanged)
[90msrc/components/ui/label.tsx[39m 2ms (unchanged)
[90msrc/components/ui/ModelCard.tsx[39m 20ms (unchanged)
[90msrc/components/ui/README.md[39m 19ms (unchanged)
[90msrc/components/ui/RoleCard.tsx[39m 3ms (unchanged)
[90msrc/components/ui/SectionCard.tsx[39m 5ms (unchanged)
[90msrc/components/ui/select.tsx[39m 17ms (unchanged)
[90msrc/components/ui/SettingsLink.tsx[39m 3ms (unchanged)
[90msrc/components/ui/skeleton-enhanced.tsx[39m 10ms (unchanged)
[90msrc/components/ui/skeleton.tsx[39m 3ms (unchanged)
[90msrc/components/ui/StaticSurfaceSection.tsx[39m 2ms (unchanged)
[90msrc/components/ui/StatusCard.tsx[39m 8ms (unchanged)
[90msrc/components/ui/Switch.tsx[39m 5ms (unchanged)
[90msrc/components/ui/table.tsx[39m 6ms (unchanged)
[90msrc/components/ui/tabs.tsx[39m 3ms (unchanged)
[90msrc/components/ui/textarea.tsx[39m 2ms (unchanged)
[90msrc/components/ui/TileCard.tsx[39m 3ms (unchanged)
[90msrc/components/ui/toast/ToastsProvider.tsx[39m 7ms (unchanged)
[90msrc/components/ui/tooltip.tsx[39m 3ms (unchanged)
[90msrc/config/env.ts[39m 8ms (unchanged)
[90msrc/config/flags.ts[39m 7ms (unchanged)
[90msrc/config/modelDescriptions.ts[39m 4ms (unchanged)
[90msrc/config/modelPolicy.ts[39m 2ms (unchanged)
[90msrc/config/models.ts[39m 28ms (unchanged)
[90msrc/config/promptTemplates.ts[39m 1ms (unchanged)
[90msrc/config/quickstarts.test.ts[39m 18ms (unchanged)
[90msrc/config/quickstarts.ts[39m 16ms (unchanged)
[90msrc/config/roleStore.ts[39m 9ms (unchanged)
[90msrc/config/settings.ts[39m 13ms (unchanged)
[90msrc/contexts/CustomRolesContext.tsx[39m 7ms (unchanged)
[90msrc/contexts/FavoritesContext.tsx[39m 19ms (unchanged)
[90msrc/data/roles.dataset.ts[39m 25ms (unchanged)
[90msrc/data/roles.ts[39m 18ms (unchanged)
[90msrc/features/discussion/__tests__/shape.test.ts[39m 4ms (unchanged)
[90msrc/features/discussion/shape.ts[39m 8ms (unchanged)
[90msrc/features/prompt/composeSystemPrompt.ts[39m 5ms (unchanged)
[90msrc/features/settings/SettingsOverview.tsx[39m 8ms (unchanged)
[90msrc/features/settings/SettingsView.tsx[39m 28ms (unchanged)
[90msrc/hooks/__tests__/useChat.systemPrompt.test.ts[39m 11ms (unchanged)
[90msrc/hooks/enhanced-deferred-fetch.ts[39m 17ms (unchanged)
[90msrc/hooks/use-storage.ts[39m 21ms (unchanged)
[90msrc/hooks/useChat.ts[39m 26ms (unchanged)
[90msrc/hooks/useConversationManager.ts[39m 13ms (unchanged)
[90msrc/hooks/useDeferredFetch.ts[39m 15ms (unchanged)
[90msrc/hooks/useEdgeSwipe.ts[39m 19ms (unchanged)
[90msrc/hooks/useFavoritesManager.ts[39m 26ms (unchanged)
[90msrc/hooks/useFeatureFlags.tsx[39m 6ms (unchanged)
[90msrc/hooks/useFilteredList.ts[39m 3ms (unchanged)
[90msrc/hooks/useMediaQuery.ts[39m 4ms (unchanged)
[90msrc/hooks/useMemory.ts[39m 6ms (unchanged)
[90msrc/hooks/usePWAInstall.ts[39m 6ms (unchanged)
[90msrc/hooks/useServiceWorker.ts[39m 5ms (unchanged)
[90msrc/hooks/useSettings.ts[39m 8ms (unchanged)
[90msrc/hooks/useStickToBottom.ts[39m 6ms (unchanged)
[90msrc/hooks/useVisualViewport.ts[39m 4ms (unchanged)
[90msrc/index.css[39m 34ms (unchanged)
[90msrc/lib/a11y/touchTargets.ts[39m 18ms (unchanged)
[90msrc/lib/accessibility.ts[39m 13ms (unchanged)
[90msrc/lib/analytics.test.ts[39m 9ms (unchanged)
[90msrc/lib/analytics.ts[39m 21ms (unchanged)
[90msrc/lib/chat/__tests__/validation.test.ts[39m 5ms (unchanged)
[90msrc/lib/chat/validation.ts[39m 3ms (unchanged)
[90msrc/lib/conversation-manager-modern.ts[39m 16ms (unchanged)
[90msrc/lib/css-feature-detection.ts[39m 3ms (unchanged)
[90msrc/lib/device-utils.ts[39m 15ms (unchanged)
[90msrc/lib/errors/__tests__/mapper.test.ts[39m 7ms (unchanged)
[90msrc/lib/errors/humanError.ts[39m 3ms (unchanged)
[90msrc/lib/errors/index.ts[39m 0ms (unchanged)
[90msrc/lib/errors/mapper.ts[39m 4ms (unchanged)
[90msrc/lib/errors/types.ts[39m 8ms (unchanged)
[90msrc/lib/font-loader.ts[39m 9ms (unchanged)
[90msrc/lib/highlighting/lazySyntaxHighlighter.ts[39m 8ms (unchanged)
[90msrc/lib/highlighting/prismTheme.ts[39m 2ms (unchanged)
[90msrc/lib/http.ts[39m 7ms (unchanged)
[90msrc/lib/icons/index.ts[39m 1ms (unchanged)
[90msrc/lib/logging.ts[39m 2ms (unchanged)
[90msrc/lib/memory/memoryService.ts[39m 2ms (unchanged)
[90msrc/lib/mobile-testing-plan.md[39m 22ms (unchanged)
[90msrc/lib/monitoring/README.md[39m 13ms (unchanged)
[90msrc/lib/monitoring/sentry.tsx[39m 8ms (unchanged)
[90msrc/lib/net/concurrency.ts[39m 7ms (unchanged)
[90msrc/lib/net/fetchTimeout.ts[39m 7ms (unchanged)
[90msrc/lib/net/rateLimit.ts[39m 3ms (unchanged)
[90msrc/lib/openrouter/__tests__/key.test.ts[39m 3ms (unchanged)
[90msrc/lib/openrouter/__tests__/keyLifecycle.test.ts[39m 13ms (unchanged)
[90msrc/lib/openrouter/key.ts[39m 5ms (unchanged)
[90msrc/lib/pwa/registerSW.ts[39m 8ms (unchanged)
[90msrc/lib/pwa/SW_VERSIONING_README.md[39m 20ms (unchanged)
[90msrc/lib/pwa/sw-versioning.ts[39m 7ms (unchanged)
[90msrc/lib/recovery/resetApp.ts[39m 3ms (unchanged)
[90msrc/lib/safeStorage.ts[39m 3ms (unchanged)
[90msrc/lib/storage-layer.ts[39m 51ms (unchanged)
[90msrc/lib/storage-migration.ts[39m 32ms (unchanged)
[90msrc/lib/touch/__tests__/gestures.test.ts[39m 26ms (unchanged)
[90msrc/lib/touch/__tests__/haptics.test.ts[39m 31ms (unchanged)
[90msrc/lib/touch/gestures.ts[39m 16ms (unchanged)
[90msrc/lib/touch/haptics.ts[39m 9ms (unchanged)
[90msrc/lib/utils.ts[39m 12ms (unchanged)
[90msrc/lib/utils/loadScript.ts[39m 9ms (unchanged)
[90msrc/lib/utils/loadStylesheet.ts[39m 8ms (unchanged)
[90msrc/lib/utils/production-logger.ts[39m 11ms (unchanged)
[90msrc/lib/utils/reload-manager.ts[39m 1ms (unchanged)
[90msrc/lib/validators/roles.ts[39m 7ms (unchanged)
[90msrc/main.tsx[39m 11ms (unchanged)
[90msrc/pages/Chat.tsx[39m 11ms (unchanged)
[90msrc/pages/MobileModels.tsx[39m 2ms (unchanged)
[90msrc/pages/MobileStudio.tsx[39m 2ms (unchanged)
[90msrc/pages/SettingsApi.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsAppearance.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsData.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsFilters.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsMemory.tsx[39m 1ms (unchanged)
[90msrc/pages/SettingsOverviewPage.tsx[39m 1ms (unchanged)
[90msrc/pages/StudioHome.tsx[39m 2ms (unchanged)
[90msrc/prompts/discussion/presets.ts[39m 2ms (unchanged)
[90msrc/services/openrouter.ts[39m 8ms (unchanged)
[90msrc/state/chatReducer.ts[39m 4ms (unchanged)
[90msrc/styles/aurora-optimized.css[39m 17ms (unchanged)
[90msrc/styles/base.css[39m 3ms (unchanged)
[90msrc/styles/components.css[39m 30ms (unchanged)
[90msrc/styles/DESIGN_SYSTEM.md[39m 23ms (unchanged)
src/styles/design-tokens.css 12ms
[90msrc/styles/design-tokens.generated.ts[39m 7ms (unchanged)
[90msrc/styles/design-tokens.ts[39m 6ms (unchanged)
[90msrc/styles/mobile-enhancements.css[39m 2ms (unchanged)
[90msrc/styles/README.md[39m 9ms (unchanged)
[90msrc/styles/theme.css[39m 1ms (unchanged)
[90msrc/styles/theme.ts[39m 7ms (unchanged)
[90msrc/styles/tokens.css[39m 1ms (unchanged)
[90msrc/styles/tokens/category-colors.ts[39m 4ms (unchanged)
[90msrc/styles/tokens/category-tonal-scales.ts[39m 18ms (unchanged)
[90msrc/styles/tokens/color.ts[39m 13ms (unchanged)
[90msrc/styles/tokens/motion.ts[39m 2ms (unchanged)
[90msrc/styles/tokens/radius.ts[39m 2ms (unchanged)
[90msrc/styles/tokens/shadow.ts[39m 3ms (unchanged)
[90msrc/styles/tokens/spacing.ts[39m 3ms (unchanged)
[90msrc/styles/tokens/typography.ts[39m 7ms (unchanged)
[90msrc/styles/ui-state-animations.css[39m 16ms (unchanged)
[90msrc/styles/unified-tokens.css[39m 46ms (unchanged)
[90msrc/styles/z-index-system.css[39m 7ms (unchanged)
[90msrc/types/chat.ts[39m 2ms (unchanged)
[90msrc/types/chatMessage.ts[39m 1ms (unchanged)
[90msrc/types/enhanced-interfaces.ts[39m 23ms (unchanged)
[90msrc/types/index.ts[39m 3ms (unchanged)
[90msrc/types/prism-modules.d.ts[39m 2ms (unchanged)
[90msrc/utils/category-mapping.ts[39m 10ms (unchanged)
[90msrc/utils/colorConverters.ts[39m 4ms (unchanged)
[90msrc/utils/pricing.ts[39m 5ms (unchanged)
[90msrc/vitest-env.d.ts[39m 1ms (unchanged)
[90mSTORAGE_MIGRATION_GUIDE.md[39m 52ms (unchanged)
[90mtailwind.config.ts[39m 4ms (unchanged)
[90mtests/e2e/api-mock.ts[39m 4ms (unchanged)
[90mtests/e2e/chat-flow.spec.ts[39m 13ms (unchanged)
[90mtests/e2e/error-handling.spec.ts[39m 22ms (unchanged)
[90mtests/e2e/get-rendered-html.spec.ts[39m 1ms (unchanged)
[90mtests/e2e/helpers/app-helpers.ts[39m 12ms (unchanged)
[90mtests/e2e/models-flow.spec.ts[39m 20ms (unchanged)
[90mtests/e2e/pwa-mobile.spec.ts[39m 33ms (unchanged)
[90mtests/e2e/roles.spec.ts[39m 6ms (unchanged)
[90mtests/e2e/settings-flow.spec.ts[39m 14ms (unchanged)
[90mtests/e2e/smoke.spec.ts[39m 4ms (unchanged)
[90mtests/e2e/storage-migration.spec.ts[39m 10ms (unchanged)
[90mtests/polyfills.ts[39m 6ms (unchanged)
[90mtests/setup.ts[39m 1ms (unchanged)
[90mtests/setup/fetch.ts[39m 2ms (unchanged)
[90mtests/unit/composeSystemPrompt.test.ts[39m 2ms (unchanged)
[90mtests/unit/copyButton.test.tsx[39m 4ms (unchanged)
[90mtests/unit/ErrorBoundary.test.tsx[39m 4ms (unchanged)
[90mtests/unit/lib/conversation-manager-modern.test.ts[39m 35ms (unchanged)
[90mtests/unit/lib/export-validation.test.ts[39m 2ms (unchanged)
[90mtests/unit/lib/storage-integration.test.ts[39m 6ms (unchanged)
[90mtests/unit/lib/storage-layer-business.test.ts[39m 22ms (unchanged)
[90mtests/unit/lib/storage-layer-simple.test.ts[39m 23ms (unchanged)
[90mtests/unit/lib/storage-layer.test.ts[39m 21ms (unchanged)
[90mtests/unit/lib/storage-migration-integration.test.ts[39m 7ms (unchanged)
[90mtests/unit/lib/storage-migration.test.ts[39m 26ms (unchanged)
[90mtests/unit/lib/storage-performance-simple.test.ts[39m 17ms (unchanged)
[90mtests/unit/lib/storage-performance.test.ts[39m 16ms (unchanged)
[90mtests/unit/rateLimit.test.ts[39m 2ms (unchanged)
[90mtests/unit/useChat.test.tsx[39m 5ms (unchanged)
[90mtools/cf-purge.js[39m 11ms (unchanged)
[90mtools/check-css-hex.mjs[39m 6ms (unchanged)
[90mtsconfig.base.json[39m 1ms (unchanged)
[90mtsconfig.build.json[39m 1ms (unchanged)
[90mtsconfig.json[39m 1ms (unchanged)
[90mtsconfig.node.json[39m 1ms (unchanged)
[90mtsconfig.test.json[39m 1ms (unchanged)
[90mvite-env.d.ts[39m 2ms (unchanged)
[90mvite.config.ts[39m 18ms (unchanged)
[90mvitest.config.ts[39m 2ms (unchanged)
Checking for unused imports...
npm warn config production Use `--omit=dev` instead.
87 modules with unused exports
/home/runner/work/Disa_Ai/Disa_Ai/src/api/chat.ts: ChatRequest
/home/runner/work/Disa_Ai/Disa_Ai/src/api/openrouter.ts: checkApiHealth
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/card-types.ts: BaseCardProps, ExtendedCardProps, StatusType, DiscussionCategory, AdvancedInteractiveCardProps, MenuItem, CardGridProps, InteractionType, IntentType, StateType, ToneType, ElevationType, PaddingType, SizeType, CardVariantCombination, CardEventHandler, CardKeyboardEventHandler, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardContentProps, CardFooterProps, ConditionalCardProps, STATUS_TYPES, DISCUSSION_CATEGORIES, INTERACTION_TYPES, INTENT_TYPES, STATE_TYPES
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/index.ts: CardProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, ModelCardProps, ModelCard, CardVariantProps, CardUtils, Avatar, AvatarFallback, AvatarImage, BadgeProps, badgeVariants, ButtonProps, buttonVariants, ChipProps, Chip, chipVariants, DialogOverlayProps, DialogContentProps, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, GlassPanelProps, GlassPanel, IconButtonVariant, IconButtonProps, IconButton, InputProps, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, StaticSurfaceSection, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, TextareaProps, Textarea, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, DiscussionTopicCard, DiscussionTopicCardSkeleton, DiscussionTopicGridProps, DiscussionTopicGrid, StatusCard, LoadingCard, SuccessCard, ErrorCard, WarningCard, InfoCard
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
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useEdgeSwipe.ts: EdgeSwipeOptions, EdgeSwipeState, useEdgeSwipe
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useFavoritesManager.ts: useFavoriteStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useMediaQuery.ts: useMediaQuery, useIsMobile
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/analytics.ts: AnalyticsEvent, AnalyticsSession, AnalyticsStats
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/conversation-manager-modern.ts: ExportData, ImportResult, bulkUpdateConversations, getConversationById, migrateFromLocalStorage, getStoragePerformance
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/device-utils.ts: DeviceType, Orientation, InputMethod, BREAKPOINTS, DeviceUtils, getDeviceType, isMobile, isTablet, isDesktop, getOrientation, hasTouch, getPrimaryInputMethod, supportsHover, isStandalone, getSafeAreaInsets, getAvailableHeight, optimizeViewport, isEmbedded, toggleOverscrollBehavior, updateDeviceTypeClass
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/font-loader.ts: FontConfig, FontLoader
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
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/highlighting/lazySyntaxHighlighter.ts: preloadHighlighter, getHighlighterStatus
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/icons/index.ts: AlertTriangle, ArrowLeft, Book, Bot, Clock, Code, Filter, Hash, History, Menu, MessageCircle, Pin, PinOff, Plus, SlidersHorizontal, Tag, ThumbsDown, ThumbsUp, Trash2, TrendingUp, User
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
/home/runner/work/Disa_Ai/Disa_Ai/src/components/layout/grid-system.tsx: Grid, CardGrid, FeatureGrid, ListGrid
/home/runner/work/Disa_Ai/Disa_Ai/src/components/layout/standard-layout.tsx: Layout, Section, ContentArea
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/CopyButton.tsx: CopyButton
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/SectionCard.tsx: SectionCardProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/TileCard.tsx: TileCardProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/async-states.tsx: LoadingStateProps, LoadingState, LoadingIndicator, ErrorStateProps, ErrorState, AsyncStateProps, AsyncState, LoadingOverlayProps, LoadingOverlay, SkeletonCardList, SkeletonListItem, SkeletonChatBubble
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/aurora-button.tsx: AuroraButtonProps, AuroraButton
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/aurora-card.tsx: AuroraCardProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/label.tsx: LabelProps
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/skeleton-enhanced.tsx: Skeleton, SkeletonVariants, SkeletonCard, SkeletonList, SkeletonChatMessage
/home/runner/work/Disa_Ai/Disa_Ai/src/components/ui/skeleton.tsx: ListSkeleton, CardSkeleton, BubbleSkeleton
/home/runner/work/Disa_Ai/Disa_Ai/src/contexts/CustomRolesContext.tsx: CustomRole, useCustomRoles
/home/runner/work/Disa_Ai/Disa_Ai/src/contexts/FavoritesContext.tsx: useFavoriteActions, useFavoriteLists, useFavoritesAnalytics, withFavorites, FavoritesLoader
/home/runner/work/Disa_Ai/Disa_Ai/src/features/settings/SettingsView.tsx: SettingsSectionKey
/home/runner/work/Disa_Ai/Disa_Ai/src/hooks/useFeatureFlags.tsx: useFeatureFlags, useAnyFeatureFlags, useAllFeatureFlags, useActiveFeatureFlags, withFeatureFlag
/home/runner/work/Disa_Ai/Disa_Ai/src/lib/monitoring/sentry.tsx: captureError, addBreadcrumb, setUserContext, profileFunction
Running local maintenance scripts...
Building project...
Running vite build...
npm warn config production Use `--omit=dev` instead.
[36mvite v7.2.2 [32mbuilding client environment for production...[36m[39m
transforming...
[32m✓[39m 3040 modules transformed.
rendering chunks...
[2mdist/[22m[32mmanifest.webmanifest                               [39m[1m[2m  0.37 kB[22m[1m[22m
[2mdist/[22m[32mindex.html                                         [39m[1m[2m  5.29 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/index-j4KUppHV.css                      [39m[1m[2m 15.50 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[35mcss/main-DPqOrIeX.css                       [39m[1m[2m 21.01 kB[22m[1m[22m
[2mdist/[22m[2massets/[22m[36mjs/reload-manager-D7i9oj9C.js               [39m[1m[2m  0.26 kB[22m[1m[22m[2m │ map:     0.72 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsApi-Dskg7Ve7.js                  [39m[1m[2m  0.70 kB[22m[1m[22m[2m │ map:     0.84 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsData-DAMiGT-4.js                 [39m[1m[2m  0.70 kB[22m[1m[22m[2m │ map:     0.85 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsMemory-BoeLNtQP.js               [39m[1m[2m  0.70 kB[22m[1m[22m[2m │ map:     0.86 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsFilters-CgI9nGZf.js              [39m[1m[2m  0.70 kB[22m[1m[22m[2m │ map:     0.86 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsAppearance-CTOlyrqW.js           [39m[1m[2m  0.71 kB[22m[1m[22m[2m │ map:     0.88 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/key-CeZiRZHr.js                          [39m[1m[2m  0.93 kB[22m[1m[22m[2m │ map:     4.71 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/MobileStudio-AWw2_zaY.js                 [39m[1m[2m  1.03 kB[22m[1m[22m[2m │ map:     1.39 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/MobileModels-BDzSpOID.js                 [39m[1m[2m  1.14 kB[22m[1m[22m[2m │ map:     1.41 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/textarea-Di8Krw1p.js                     [39m[1m[2m  1.20 kB[22m[1m[22m[2m │ map:     2.25 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/useMemory-CZ1xBvnB.js                    [39m[1m[2m  1.30 kB[22m[1m[22m[2m │ map:     4.90 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/mapper-CtmJ8Y3W.js                       [39m[1m[2m  2.23 kB[22m[1m[22m[2m │ map:    10.26 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/roleStore-D0Vmib6s.js                    [39m[1m[2m  2.28 kB[22m[1m[22m[2m │ map:    11.24 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/StudioHome-CuI8F-s2.js                   [39m[1m[2m  2.58 kB[22m[1m[22m[2m │ map:     7.09 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/index-B8eAFobg.js                        [39m[1m[2m  2.86 kB[22m[1m[22m[2m │ map:     1.56 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/FeatureFlagPanel-CD_kuLga.js             [39m[1m[2m  3.87 kB[22m[1m[22m[2m │ map:     9.30 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/openrouter-CXCvJDZQ.js                   [39m[1m[2m  5.01 kB[22m[1m[22m[2m │ map:    23.59 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/input-3FbF9Ynu.js                        [39m[1m[2m  5.35 kB[22m[1m[22m[2m │ map:     8.47 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsOverviewPage-ChEh7DLY.js         [39m[1m[2m  6.25 kB[22m[1m[22m[2m │ map:    27.31 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedRolesInterface-C0BAyvEh.js       [39m[1m[2m  7.02 kB[22m[1m[22m[2m │ map:    33.34 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/modelDescriptions-CXdOkcBo.js            [39m[1m[2m  9.62 kB[22m[1m[22m[2m │ map:    12.60 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/SettingsView-XyLm0OQl.js                 [39m[1m[2m 10.63 kB[22m[1m[22m[2m │ map:    27.47 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/conversation-manager-modern-B0mpxbMp.js  [39m[1m[2m 10.96 kB[22m[1m[22m[2m │ map:    45.18 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/sentry-vendor-CoTD9ETW.js                [39m[1m[2m 15.35 kB[22m[1m[22m[2m │ map:   153.15 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/EnhancedModelsInterface-DTMD7zm2.js      [39m[1m[2m 20.86 kB[22m[1m[22m[2m │ map:    74.14 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/utils-NKwIet1w.js                        [39m[1m[2m 26.78 kB[22m[1m[22m[2m │ map:   132.97 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/skeleton-Bgjd8qMd.js                     [39m[1m[2m 26.90 kB[22m[1m[22m[2m │ map:    67.68 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/Chat-CY2Gs-EE.js                         [39m[1m[2m 36.59 kB[22m[1m[22m[2m │ map:   116.39 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/radix-ui-BbJgOsFr.js                     [39m[1m[2m 72.70 kB[22m[1m[22m[2m │ map:   356.57 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/main-Bl3KhDVP.js                         [39m[1m[2m112.85 kB[22m[1m[22m[2m │ map:   351.99 kB[22m
[2mdist/[22m[2massets/[22m[36mjs/vendor-Dmh8jsS0.js                       [39m[1m[2m410.52 kB[22m[1m[22m[2m │ map: 1,906.40 kB[22m
[2m[1m34[2m[22m chunks of [2m[1m815.56 KB[2m[22m (gzip: [2m[1m293.00 KB[2m[22m | map: [2m[1m3.24 MB[2m[22m)
[32m✓ built in 11.84s[39m

[36mPWA v1.1.0[39m
mode      [35mgenerateSW[39m
precache  [32m54 entries[39m [2m(1282.42 KiB)[22m
files generated
  [2mdist/sw.js.map[22m
  [2mdist/sw.js[22m
  [2mdist/workbox-239d0d27.js.map[22m
  [2mdist/workbox-239d0d27.js[22m
Build completed. Preview server available on port 4173 with: npm run preview
No autopilot-summary.mjs found, using basic summary
```
