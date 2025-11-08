# 🎯 100vh-Problem Fix - Issue #11

## PROBLEM IDENTIFIZIERT
**Static vs. Dynamic Viewport Height:**
- `height: 100vh` → Static viewport height (causes jumping)
- `min-height: 100dvh` → Dynamic viewport height (no jumping)
- Problem: Tastatur-Einblendung verändert viewport, aber 100vh bleibt gleich

## GEFUNDENE 100vh-IMPLEMENTIERUNGEN

### 1. mobile-landscape-fix (base.css:451-452)
```css
.mobile-landscape-fix {
  height: 100vh;
  min-height: 100vh;
}
```
**Fix:** `min-height: 100dvh` + `height: auto`

### 2. neo-main (neomorphic-utilities.css:222)
```css
.neo-main {
  min-height: 100vh;
  contain: layout style;
}
```
**Fix:** `min-height: 100dvh`

## LÖSUNG
**Ersetze alle `100vh` durch `100dvh` (Dynamic Viewport Height)**

### Benefits:
- ✅ Kein Jumping bei Tastatur-Öffnung
- ✅ Bessere mobile Kompatibilität
- ✅ Moderne Browser-Unterstützung (Safari 15.4+, Chrome 108+)
- ✅ Fallback für ältere Browser: `100vh` als Fallback

**STATUS: ANALYSIS COMPLETED - READY FOR IMPLEMENTATION**
