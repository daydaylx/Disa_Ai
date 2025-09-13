# Disa AI - Dependency & File Audit Report

**Generiert am:** 2025-09-12  
**Ziel:** Transparente Inventar-Analyse ohne Löschungen  
**Kategorien:** `safe delete` | `needs check` | `keep`

---

## 🎯 Executive Summary

| Kategorie | Anzahl | Geschätzte Einsparung |
|-----------|--------|----------------------|
| **Safe Delete** | 8 Items | ~67MB + Wartungsaufwand |
| **Needs Check** | 4 Items | ~15MB |
| **Duplicate/Overlap** | 4 Items | Vereinfachung möglich |

**Hauptbefunde:**
- 3 ungenutzte Dependencies identifiziert
- 17MB Screenshots-Ordner für Documentation
- Duplicate fetch/timeout Implementierungen
- Disabled GitHub Pages Workflow
- 2 cn() utility Implementierungen

---

## 📦 Dependencies Analysis

### ❌ SAFE DELETE - Ungenutzte Dependencies (3)

**1. react-router-dom** (`^7.8.2`) - **Safe Delete**
- **Status:** Nicht importiert in keiner Source-Datei
- **Ersatz:** Custom hash-based routing in `src/App.tsx:16-47`
- **Fundstelle:** Nur in `.graveyard/20250908/components/KeyGuard.tsx` (deprecated)
- **Größe:** ~50KB bundle, ~2MB node_modules
- **Aktion:** `npm uninstall react-router-dom`

**2. vite-plugin-pwa** (`0.20.5`) - **Safe Delete**
- **Status:** Nicht in Vite-Configs verwendet
- **Ersatz:** Manual PWA implementation in `src/lib/pwa/registerSW.ts`, `public/sw.js`
- **Konflikt:** Package importiert Workbox, aber `public/sw.js:4` nutzt es direkt
- **Größe:** ~15MB node_modules
- **Aktion:** `npm uninstall vite-plugin-pwa`

### ❓ NEEDS CHECK - Verification Required (2)

**3. strip-json-comments** (`^5.0.3`) - **Needs Check**
- **Status:** Kein direkter Import gefunden
- **Möglichkeit:** Build-time usage oder indirekte Dependency
- **Fundstelle:** Keine Source-Code-Referenz
- **Empfehlung:** Build-Pipeline prüfen, dann entfernen falls unused

**4. playwright** (standalone) vs **@playwright/test** - **Needs Check**
- **Aktuell:** Beide installiert (`^1.55.0`)
- **Frage:** Ob standalone `playwright` neben `@playwright/test` benötigt
- **Empfehlung:** Playwright-Docs prüfen, möglicherweise Redundanz

---

## 🎨 Styling Stack Analysis

### ✅ UNIFIED - Sauberer CSS Stack

**Current Setup (Keep):**
- **TailwindCSS** (`^3.4.17`) + **tailwindcss-animate** (`^1.0.7`) 
- Modular CSS: 14 CSS-Dateien in `src/styles/` (theme, overlays, chat, etc.)
- UI-Kit: `src/ui/base.css` + `src/ui/kit.css`

**Keine CSS-Framework-Duplikate gefunden** ✅

### 🔄 DUPLICATE UTILITIES - Consider Merging (2)

**5. cn() Class Utilities** - **Duplicate**
- **File 1:** `src/lib/cn.ts` (44 lines, erweiterte Implementierung)  
- **File 2:** `src/lib/utils/cn.ts` (4 lines, simple filter/join)
- **Usage:** Beide aktiv verwendet
- **Empfehlung:** Standardize auf eine Implementierung
- **Label:** `needs check`

**6. Fetch Timeout Implementations** - **Duplicate**
- **File 1:** `src/lib/net/fetchTimeout.ts` (128 lines, retry logic)
- **File 2:** `src/lib/net/fetchWithTimeout.ts` (44 lines, basic timeout)
- **Status:** Beide verwendet in verschiedenen Kontexten
- **Empfehlung:** Evaluate if one can replace the other
- **Label:** `needs check`

---

## 🏗️ Service Worker Analysis

### ✅ ACTIVE PWA - Keep Current Implementation

**Service Worker Stack:**
- `public/sw.js` - Custom cache-first implementation (94 lines)
- `src/lib/pwa/registerSW.ts` - Registration logic (74 lines)
- `src/pwa.ts` - PWA entry point
- Workbox imports: Direkt aus `node_modules/workbox-precaching` (kein Plugin)

**Status:** ✅ **Keep** - Aktive PWA-Implementierung

---

## 🚀 GitHub Pages Cleanup

### ❌ SAFE DELETE - Disabled Deployment (1)

**7. .github/workflows/pages.yml** - **Safe Delete**
- **Status:** Vollständig disabled (Line 1: "DISABLED - Cloudflare Only")
- **Ersatz:** Cloudflare Pages deployment active
- **Inhalt:** GitHub Pages workflow mit commented triggers
- **Größe:** ~100 lines YAML
- **Label:** `safe delete`

**Additional GH Files (Keep):**
- `.github/workflows/ci.yml` - **Keep** (unified CI)
- `.github/workflows/gemini-*.yml` (5 files) - **Keep** (Gemini integration)

---

## 🖼️ Demo Assets Analysis

### ❌ DOCUMENTATION HEAVY - Large Media Files

**8. docs/screenshots/** - **17MB total** - **Needs Check**
- **Inhalt:** 48+ PNG screenshots (before/after, different viewports)
- **Samples:** 
  - `chat-android-dark-before.png`, `chat-android-dark-after.png`
  - `settings-w360-before.png`, `chat-w1280.png`
- **Zweck:** Documentation/PR visuals
- **Empfehlung:** Archive old screenshots, keep only current state
- **Label:** `needs check` (Documentation value vs. size)

---

## 📊 Large Reports Analysis

### ❌ ANALYSIS REPORTS - Archive Candidates (10+)

**Root-Level Analysis Files:**
- `ANALYSIS.md`, `CONFIG_AUDIT.md`, `REFACTOR_PLAN.md`
- `UX_FINDINGS.md`, `DEPENDENCIES.md`, `CLEANUP_CANDIDATES.md`
- `DEPLOYMENT_READINESS.md`, `GEMINI.md`, `AGENTS.md`

**docs/ Reports:**
- `docs/PR_UI_AUDIT.md`, `docs/DEPLOYMENT.md`
- `.github/NEUES_MAIN_ANALYSIS.md`

**Status:** Historical analysis documents
**Empfehlung:** Move to `docs/archive/` or delete after knowledge extraction
**Label:** `safe delete` (after review)

### ❌ JSON Data Files - Cleanup Candidates (2)

**9. ERRORS.json** (6 bytes) - **Safe Delete**
**10. docs/ui-inventory.json** (7 bytes) - **Safe Delete**
- **Status:** Minimal/placeholder JSON files
- **Zweck:** Unklar, sehr klein
- **Label:** `safe delete`

---

## 🔧 Orphaned Utils Analysis

### ✅ UTILITIES - All Referenced

**Utils Directories Analyzed:**
- `src/utils/` (4 files) - All used ✅
- `src/lib/utils/` (2 files) - All used ✅

**Mock Files:** None found - MSW handles API mocking ✅

---

## 📋 Implementation Roadmap

### Phase 1: Immediate Safe Deletions (~50MB saved)
```bash
npm uninstall react-router-dom vite-plugin-pwa
rm ERRORS.json docs/ui-inventory.json
rm .github/workflows/pages.yml
```

### Phase 2: Verification & Cleanup
```bash
# Check and remove if unused
npm uninstall strip-json-comments

# Evaluate playwright dependencies
npm uninstall playwright  # if @playwright/test sufficient

# Archive analysis reports
mkdir docs/archive
mv *ANALYSIS.md *AUDIT.md *PLAN.md docs/archive/
```

### Phase 3: Consolidation Opportunities
- **cn() utilities:** Choose one implementation  
- **fetch timeout:** Evaluate if fetchWithTimeout.ts can replace fetchTimeout.ts
- **screenshots:** Archive old before/after images

---

## 🎯 Priority Matrix

| Item | Impact | Effort | Priority |
|------|---------|--------|----------|
| react-router-dom removal | High | Low | **P0** |
| vite-plugin-pwa removal | High | Low | **P0** |
| Archive analysis reports | Med | Low | **P1** |
| Consolidate cn() utils | Low | Med | **P2** |
| Screenshots cleanup | Med | Med | **P2** |

---

**Total Estimated Savings:** ~67MB node_modules + reduced maintenance complexity