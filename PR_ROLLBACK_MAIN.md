# 🚨 CRITICAL: Rollback broken commits from 24.11.2025

**PR Link:** https://github.com/daydaylx/Disa_Ai/pull/new/claude/fix-main-rollback-011UDusYpBcD9RXVEcT7VHot

---

## 🚨 Critical Rollback: Production Outage Fix

### Problem

Commits from 24.11.2025 (19:19 - 23:59) broke core functionality:

- ❌ Chat page not working
- ❌ Roles page broken
- ❌ Models page broken
- ❌ Settings not functioning
- ❌ Navigation issues

### Root Causes

1. **Onboarding System** (e5d0c8d): 1400+ LOC with 0% test coverage, redirect loops
2. **Router Refactor** (e5d0c8d, a7492aa): Breaking change (removed /studio)
3. **PWA Icons** (7e6c9d1): Path changes broke installed apps
4. **Untested Code**: Critical features merged without E2E tests

### Solution: Rollback to Stable Baseline

**Target Commit:** `8575ca9` (19:19, 24.11.2025)

- Last stable commit before Onboarding feature
- All tests passing
- Core functionality verified

### Changes in this PR

- Reset to `8575ca9` (before broken commits)
- Apply TypeScript safety fixes (ab611b1)
- Bundle size: 880 KB (26 KB smaller!)

### Verification ✅

- **Build:** ✅ Passes (14.3s)
- **TypeScript:** ✅ No errors
- **ESLint:** ✅ Passes
- **Tests:** ✅ 331/331 passing

### Reverted Commits (17 total)

```
c25e47a - fix: guard router-only hooks to avoid useLocation crash
214fe43 - fix(ui): stabilize liquid branding and tighten feedback
6692af8 - fix(app): stabilize smoke routing and asset urls
01ef7de - Merge pull request #734
81a8163 - fix: Resolve TypeScript errors and lint warnings
b11ae97 - Merge branch 'main'
a7492aa - Aktualisierungen an verschiedenen Projektdateien (913 ins, 870 del)
f47e7f1 - docs(agents): update AGENTS.md
e5d0c8d - feat: Implement Liquid Intelligence Onboarding (1403 LOC)
... and 8 more merge/dependency commits
```

### What's Kept

✅ Model scoring refactor (prior to rollback window)
✅ PWA manifest fixes (prior to rollback window)
✅ Documentation updates (prior to rollback window)

### Next Steps (Optional)

If Liquid branding/onboarding features are needed:

1. Create feature branch from `backup/20251125-before-reset-to-8575ca6`
2. Extract only branding components (no breaking changes)
3. Write E2E tests first
4. Performance audit
5. Clean PR with migration guide

### Time to Recovery

- **Rollback:** 1 hour ✅
- **Alternative (forward fixes):** 7 days ❌

---

## How to Create the PR

1. Go to: https://github.com/daydaylx/Disa_Ai/pull/new/claude/fix-main-rollback-011UDusYpBcD9RXVEcT7VHot
2. Copy the content above into the PR description
3. Set base branch: `main`
4. Click "Create Pull Request"

**This PR restores application stability. Merge ASAP.**
