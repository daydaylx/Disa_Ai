# DEAD CODE CLEANUP - QUICK START GUIDE

## Summary for Developers

A comprehensive analysis identified **277+ lines of dead code** that can be safely removed from your CSS after the Neomorphism migration. This quick guide prioritizes the easiest wins first.

---

## 🟢 HIGH PRIORITY - Do This First (SAFE)

### 1. Delete `/src/styles/bottomsheet.css` (82 lines)

**Risk:** MINIMAL | **Time:** 5 minutes | **Savings:** 82 lines

This file is 100% duplicate of code already in `base.css`.

```bash
rm /src/styles/bottomsheet.css
```

**What to test:** Verify bottomsheet component still works

```bash
npm run dev
# Test: Open any bottom sheet - should work perfectly
```

---

### 2. Fix Undefined Variables in `chat-mobile.css` (3 changes)

**Risk:** LOW | **Time:** 10 minutes | **Savings:** Fixes 5 undefined variables

**Changes needed:**

**File:** `/src/styles/chat-mobile.css`

**Line 192:** Change `--color-accent1` to `--color-brand-primary`

```diff
- background: var(--color-accent1);
+ background: var(--color-brand-primary);
```

**Line 196:** Change `--color-accent2` to appropriate status color

```diff
- background: var(--color-accent2);
+ background: var(--color-status-error);  /* or use --color-brand-primary */
```

**Line 220:** Change `--letter-spacing-title-hero` to `--letter-spacing-title`

```diff
- letter-spacing: var(--letter-spacing-title-hero);
+ letter-spacing: var(--letter-spacing-title);
```

**What to test:**

- Chat loading indicator shows colored dots (not transparent)
- Hero title in empty chat state has correct letter spacing

---

## 🟡 MEDIUM PRIORITY - Safe But Requires Verification

### 3. Remove Unused Utility Classes from `base.css` (170 lines)

**Risk:** LOW | **Time:** 15 minutes | **Savings:** 170 lines

Remove these class definitions that are never used:

**File:** `/src/styles/base.css`

**Delete lines 141-192** (safe-area utilities):

```css
.safe-top, .safe-bottom, .safe-left, .safe-right, .safe-x, .safe-y, .safe-all
.safe-mt, .safe-mb, .safe-ml, .safe-mr
.safe-area-top, .safe-area-bottom, .safe-area-left, .safe-area-right
```

**Delete lines 198-222** (viewport helpers):

```css
.min-h-dvh, .h-dvh
.min-h-screen-mobile, .h-screen-mobile
```

**Delete lines 228-249** (scroll helpers):

```css
.no-scroll-x, .scrollable, .smooth-scroll
```

**Delete lines 367-403** (performance helpers):

```css
.gpu-accelerated, .keyboard-adjust, .no-select
.mobile-safe-padding, .mobile-safe-margin
```

**Delete line 442** (bottom sheet border):

```css
.mobile-landscape-fix
```

**What to test:**

- Full page layout still responsive on mobile/tablet/desktop
- No CSS console errors
- All animations and transitions work smoothly
- Safe area padding still respected on notched devices

**Verification command:**

```bash
# Before cleanup
npm run build
du -h dist/style.*.css

# After cleanup
npm run build
du -h dist/style.*.css
# Should see 3-5% reduction in CSS bundle size
```

---

## 🔴 LOWER PRIORITY - Requires More Analysis

### 4. Consolidate Mobile Variables (FUTURE)

**Risk:** MEDIUM | **Time:** 45 minutes | **Savings:** 40+ lines

Variables in `/src/styles/mobile-enhanced.css` should move to `tokens.css`:

- All `--touch-target-*` variables
- All `--space-mobile-*` variables
- All `--card-mobile-*` variables
- All `--input-mobile-*` variables
- All `--btn-mobile-*` variables
- All `--nav-mobile-*` variables

**Status:** DEFER to next sprint after Phase 1-3 complete

---

## 📊 Expected Results

After completing High + Medium priorities:

| Metric                | Before      | After        | Reduction |
| --------------------- | ----------- | ------------ | --------- |
| base.css              | 446 lines   | ~280 lines   | 37%       |
| bottomsheet.css       | 82 lines    | 0 lines      | 100%      |
| Total CSS cleanup     | 5,938 lines | ~5,661 lines | 4.7%      |
| CSS bundle (minified) | 45-50 KB    | 43-47 KB     | ~5%       |
| CSS bundle (gzipped)  | 8-10 KB     | 7.7-9.5 KB   | ~3%       |

---

## ✅ Testing Checklist Before Committing

Run through this after making changes:

```bash
# 1. Start dev server
npm run dev
# ✓ No CSS errors in console
# ✓ Page loads without visual issues

# 2. Test responsive design
# ✓ Mobile (320px) - all layouts work
# ✓ Tablet (768px) - responsive behavior correct
# ✓ Desktop (1024px+) - desktop layout intact

# 3. Test theme switching
# ✓ Light theme works
# ✓ Dark theme works
# ✓ Colors are correct in both themes

# 4. Test components
# ✓ Bottom sheet opens/closes smoothly
# ✓ Chat loading indicator displays colors
# ✓ Form inputs have proper focus states
# ✓ Buttons have hover/active states
# ✓ Navigation is accessible

# 5. Performance test
npm run build
# ✓ CSS bundle size reduced
# ✓ No runtime errors
# ✓ No visual regressions

# 6. Visual regression testing (manual)
# ✓ Screenshot compare key pages
# ✓ Verify no layout shifts
# ✓ Check shadows and elevation correct
```

---

## 📝 Commit Message Template

```
refactor(css): cleanup dead code post-neomorphism migration

- Remove duplicate bottomsheet.css (82 lines)
- Fix undefined CSS variables in chat-mobile.css
- Remove unused utility classes from base.css (170 lines)

Consolidation reduces CSS bundle size by ~5% (~240 lines removed)
No functional changes - styles preserved via consolidation

Fixes: #XXX
```

---

## 🚨 If Something Breaks

**Revert command:**

```bash
git revert HEAD --no-edit
```

**Then check:**

- Which cleanup step caused the issue
- Look for unused class references you might have missed
- Check if variable was used in a commented-out component
- Run full test suite to identify which component broke

---

## 📚 Related Documentation

- Full analysis report: `DEAD_CODE_ANALYSIS.md`
- CSS file structure: `src/styles/README.md` (if exists)
- Token documentation: See tokens.css comments

---

## Timeline Estimate

**Optimistic:** 30 minutes (High priority only)
**Realistic:** 45 minutes (High + Medium priority)
**Thorough:** 2 hours (Full review + testing)

---

**Last Updated:** 2025-11-01  
**Status:** Ready for implementation  
**Approval Required:** Code review before merge
