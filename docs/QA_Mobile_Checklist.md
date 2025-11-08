# 📱 Mobile QA Checklist - Disa AI PWA

> **Workflow-Regel #20:** QA-Checkliste für mobile PWA-Tests
> **Viewports:** 360×800, 390×844, 414×896, 768×1024

---

## 🧪 **Core Mobile E2E Flows**

### Flow 1: App Startup & First Message
- [ ] **360×800 (iPhone SE):** App startet in < 3s
- [ ] **390×844 (iPhone 12):** App startet in < 3s
- [ ] **414×896 (iPhone 11 Pro):** App startet in < 3s
- [ ] **768×1024 (iPad Mini):** App startet in < 3s
- [ ] Erste Nachricht eingeben → Antwort in < 3s (Mock)
- [ ] Chat-Interface vollständig sichtbar
- [ ] Keine JavaScript-Fehler in Console

### Flow 2: Model Selection & Persistence
- [ ] **390×844:** Modell wechseln funktioniert
- [ ] **414×896:** Modell wechseln funktioniert
- [ ] Modell-Selection persistiert nach Reload
- [ ] Aktives Modell wird im Header angezeigt
- [ ] Dropdown funktioniert auf Touch-Geräten

### Flow 3: Settings Toggles & Persistence
- [ ] **414×896:** NSFW Filter Toggle funktioniert
- [ ] **390×844:** Memory Toggle funktioniert
- [ ] **768×1024:** Alle Settings Toggles funktionieren
- [ ] Settings persistieren nach Reload
- [ ] Settings-Karten reagieren auf Touch

### Flow 4: Drawer & Edge-Swipe Navigation
- [ ] **768×1024:** Rechter Rand-Swipe öffnet Drawer
- [ ] **390×844:** Rechter Rand-Swipe öffnet Drawer
- [ ] **414×896:** Rechter Rand-Swipe öffnet Drawer
- [ ] Browser-Back-Gesture bleibt funktional
- [ ] Drawer schließt bei Tap außerhalb
- [ ] Edge-Swipe nur auf Touch-Geräten aktiv

---

## 📏 **Responsive Design Checks**

### Breakpoint Tests
- [ ] **360px:** Alles sichtbar, kein horizontaler Scroll
- [ ] **390px:** Layout passt perfekt
- [ ] **414px:** Optimale Nutzung des Platzes
- [ ] **768px:** Tablet-Layout funktional
- [ ] **1024px+:** Desktop-Fallback sauber

### Typography & Touch Targets
- [ ] Tap-Ziele ≥ 44px (iOS guideline)
- [ ] Text lesbar bei allen Größen
- [ ] Buttons haben ausreichend Padding
- [ ] Links nicht zu nah beieinander

---

## 🎨 **Visual & UX Checks**

### Safe Area & Viewport
- [ ] **iPhone X+ (Safe Area):** Kein Content hinter Notch
- [ ] **Bottom Navigation:** Safe-Area-Bottom respektiert
- [ ] **Modals:** Safe-Area-Top respektiert
- [ ] Viewport-meta korrekt: `viewport-fit=cover`

### Orientation & Keyboard
- [ ] **Portrait → Landscape:** Kein Layout-Break
- [ ] **Landscape → Portrait:** Kein Layout-Break
- [ ] **Keyboard eingeklappt:** Chat-Input bleibt sichtbar
- [ ] **Keyboard eingeklappt:** Kein Viewport-Jump
- [ ] **100vh Problem:** Keine Scroll-Container Issues

### Theme & Styling
- [ ] **Light Theme:** Alle Komponenten sauber
- [ ] **Dark Theme:** Alle Komponenten sauber
- [ ] **Theme-Switch:** Funktioniert ohne Reload
- [ ] **Kontrast:** ≥ 4.5:1 überall
- [ ] **Fokus-Ringe:** Sichtbar bei Tastatur-Navigation

---

## ⚡ **Performance & Technical**

### Core Web Vitals (Mobile)
- [ ] **LCP (Largest Contentful Paint):** < 2.5s
- [ ] **FID (First Input Delay):** < 100ms
- [ ] **CLS (Cumulative Layout Shift):** < 0.1
- [ ] **TTI (Time to Interactive):** < 3.5s

### Bundle Size & Loading
- [ ] **Entry Bundle:** ≤ 300 KB (actual: ~33 KB ✅)
- [ ] **Initial Paint:** < 1.5s auf Mid-Range Device
- [ ] **Font Loading:** Kein FOIT (Flash of Invisible Text)
- [ ] **Image Loading:** Lazy-Loading funktioniert

### PWA Features
- [ ] **Service Worker:** Registriert und aktiv
- [ ] **Offline:** Grundfunktionen verfügbar
- [ ] **Add to Home Screen:** Manifest korrekt
- [ ] **App-Like:** Kein Browser-UI im Fullscreen

---

## 🧐 **Accessibility (A11y)**

### Screen Reader Support
- [ ] **VoiceOver (iOS):** Navigation funktional
- [ ] **TalkBack (Android):** Navigation funktional
- [ ] **Semantic HTML:** Richtige Heading-Struktur
- [ ] **ARIA Labels:** Buttons und Inputs beschriftet

### Motor Impairments
- [ ] **Touch Targets:** ≥ 44px Minimum
- [ ] **Hover States:** Funktionieren auf Touch
- [ ] **Focus Management:** Sichtbar und logisch
- [ ] **Double-Tap:** Kein ungewolltes Zooming

### Visual Impairments
- [ ] **Zoom 200%:** Content bleibt nutzbar
- [ ] **High Contrast:** Windows High Contrast Mode
- [ ] **Color Blind:** Nicht nur Farbe für Info
- [ ] **Reduced Motion:** Animation respektiert

---

## 🔄 **Error Handling & Edge Cases**

### Network & API Errors
- [ ] **Offline:** Saubere Fehlermeldung
- [ ] **Slow Network:** Loading-States sichtbar
- [ ] **API Timeout:** Retry-Mechanismus
- [ ] **Stream Errors:** Chat-Stream Error-Handling

### Memory & Storage
- [ ] **Low Memory:** App funktioniert weiter
- [ ] **Storage Full:** Graceful Degradation
- [ ] **Incognito Mode:** LocalStorage Fallbacks
- [ ] **Cache Clear:** App funktioniert nach Reload

### Feature Flags & Fallbacks
- [ ] **Feature Flags AUS:** Fallback-UI funktioniert
- [ ] **JavaScript AUS:** Grundfunktionen da (Progressive Enhancement)
- [ ] **CSS Lade-Fehler:** Unstyled aber nutzbar
- [ ] **Font Lade-Fehler:** System-Font Fallback

---

## 📊 **Automated Test Coverage**

### Playwright E2E Tests
- [ ] Mobile Viewport Tests (360, 390, 414, 768)
- [ ] Touch Simulation funktioniert
- [ ] Screenshot-Vergleiche bei kritischen Flows
- [ ] Performance-Messungen integriert

### Unit Test Coverage
- [ ] Feature-Flag System: ≥ 90% Coverage
- [ ] Mobile Hooks (useIsMobile, useEdgeSwipe): ≥ 90% Coverage
- [ ] Core Components: ≥ 80% Coverage
- [ ] Utility Functions: ≥ 95% Coverage

---

## ✅ **Sign-Off Checklist**

### Developer Sign-Off
- [ ] Alle automatischen Tests grün
- [ ] Manual Testing durchgeführt
- [ ] Performance Budget eingehalten
- [ ] Feature-Flags dokumentiert

### QA Sign-Off
- [ ] Alle 4 Core Flows getestet
- [ ] Responsive Design auf 4 Viewports getestet
- [ ] Accessibility Basics getestet
- [ ] Error Cases getestet

### Product Sign-Off
- [ ] User Experience zufriedenstellend
- [ ] Performance akzeptabel
- [ ] Rollback-Plan verstanden
- [ ] Release-Freigabe erteilt

---

## 🚨 **Rollback Criteria**

Sofortiger Rollback bei:
- [ ] **LCP > 3.5s** auf Mid-Range Mobile
- [ ] **Critical A11y Regression** (Screen Reader broken)
- [ ] **Touch Navigation broken** (Drawer/Navigation unbrauchbar)
- [ ] **Bundle Size > 350 KB** (Hard Limit)
- [ ] **JavaScript Errors** in Core Flows

---

## 📝 **Test Documentation**

- **Test Environment:** Specify test devices/browsers
- **Date:** {{ Date }}
- **Tester:** {{ Name }}
- **Build ID:** {{ Build ID }}
- **Feature Flags:** {{ Active Flags }}

**Issues Found:**
```
1. Issue description
   - Severity: High/Medium/Low
   - Device: iPhone 12 Pro (390×844)
   - Steps to reproduce: ...
   - Screenshot: [attach]

2. ...
```

**Performance Results:**
```
- LCP: X.Xs
- FID: Xms
- CLS: X.X
- Bundle Size: X KB
```

---

> 💡 **Pro Tip:** Teste Feature-Flags mit `?ff=flagname` Query-Parameter für einfache Aktivierung während Tests.