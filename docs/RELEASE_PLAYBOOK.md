# 🚨 Rollback Playbook - Disa AI PWA

> **Workflow-Regel #10:** 60-Sekunden-Rollback-Verfahren
> **Ziel:** Produktionsausfälle innerhalb 1 Minute beheben

---

## ⚡ **60-Sekunden Emergency Rollback**

### 🔴 **Sofortmaßnahmen (0-20 Sekunden)**

#### Option A: Cloudflare Pages Rollback
```bash
# 1. Cloudflare Dashboard öffnen
open "https://dash.cloudflare.com/"

# 2. Disa AI Project → Pages → Deployments
# 3. Vorherigen stabilen Build markieren → "Promote to production"
# ✅ Rollback in 10-15 Sekunden aktiv
```

#### Option B: Feature-Flag Emergency Disable
```bash
# 1. Problematisches Feature identifizieren
# 2. Feature-Flag sofort deaktivieren:
git checkout main
echo "export const featureFlags = { newFeature: false, ... }" > src/config/flags.ts
git add src/config/flags.ts
git commit -m "🚨 EMERGENCY: Disable feature XYZ"
git push
# ✅ Auto-Deploy in 30-45 Sekunden
```

### 🟡 **Validation & Communication (20-40 Sekunden)**

```bash
# 1. Funktionalität testen
curl -I https://disaai.de/
# HTTP/1.1 200 OK

# 2. Core Feature testen
# → Chat funktioniert?
# → Navigation funktioniert?
# → Keine JavaScript-Errors?

# 3. Team benachrichtigen
# Slack/Discord: "🚨 Rollback durchgeführt - Issue XYZ"
```

### 🟢 **Follow-up (40-60 Sekunden)**

```bash
# 1. Monitoring prüfen
# → Error Rate < 1%?
# → Performance Metrics normal?

# 2. Feature-Flag Status dokumentieren
echo "$(date): Rollback completed for feature XYZ" >> rollback.log

# 3. Issue tracking
# → GitHub Issue erstellen
# → Root Cause Analysis planen
```

---

## 🎯 **Rollback-Strategien nach Szenario**

### 📦 **Bundle Size Explosion (>350 KB)**

**Symptome:**
- Langsame Ladezeiten
- Mobile Nutzer beschweren sich
- Lighthouse Scores sinken

**Rollback:**
```bash
# 1. Feature-Flag für Bundle-schwere Features deaktivieren
# 2. Oder: Kompletter Cloudflare Pages Rollback
# 3. Validierung: Bundle-Größe prüfen

# Script zur Bundle-Größe-Prüfung:
npm run build
ls -lah dist/assets/js/index-*.js | awk '{print $5}' # Sollte <300KB sein
```

### 🐛 **JavaScript Runtime Errors**

**Symptome:**
- Console voller Errors
- Core Features funktionieren nicht
- User reports "weiße Seite"

**Rollback:**
```bash
# 1. SOFORTIGER Cloudflare Pages Rollback
# 2. Feature-Flag für neue Features deaktivieren
# 3. Error Tracking prüfen (Sentry/Console)

# Debugging:
# - Welche Browser betroffen?
# - Specific Feature oder Global?
# - TypeScript Fehler im Build?
```

### 📱 **Mobile UX Regression**

**Symptome:**
- Touch-Navigation funktioniert nicht
- Layout broken auf Mobile
- Safe-Area-Probleme
- Viewport-Sprünge

**Rollback:**
```bash
# 1. Mobile-spezifische Feature-Flags deaktivieren:
#    - edgeSwipeNavigation: false
#    - newDrawer: false
# 2. Cloudflare Rollback wenn CSS-Probleme
# 3. Test auf echtem Mobile Device

# Quick Mobile Test:
# iPhone: Safari Dev Tools → Responsive Design
# Android: Chrome DevTools → Device Emulation
```

### ⚡ **Performance Regression (LCP >3s)**

**Symptome:**
- Lighthouse LCP > 2.5s
- Nutzer berichten langsame App
- Time to Interactive hoch

**Rollback:**
```bash
# 1. Performance-Feature-Flags deaktivieren:
#    - lazyHighlighter: false
#    - deferredDataFetch: false
# 2. Heavy Components lazy loaden
# 3. Bundle-Splitting prüfen

# Performance Check:
npm run lh  # Lighthouse CI
# Target: LCP < 2.5s
```

### 🔐 **API/Security Issues**

**Symptome:**
- API calls fehlschlagen
- CORS Errors
- Authentication broken
- Secrets exposed

**Rollback:**
```bash
# 1. SOFORT Feature-Flags für API-Features deaktivieren
# 2. Secrets rotieren wenn exposed
# 3. Cloudflare Pages Rollback
# 4. Security Review einleiten

# Security Check:
# - Keine API Keys im Bundle?
# - CORS Headers korrekt?
# - Authentication Flow funktional?
```

---

## 🛠️ **Hotfix Deployment**

### Hotfix Branch erstellen
```bash
# 1. Hotfix Branch von letztem stabilen Release
git checkout main
git pull origin main
git checkout -b hotfix/emergency-fix-$(date +%Y%m%d%H%M)

# 2. Minimale Änderung durchführen
# - NUR das Problem beheben
# - KEINE neuen Features
# - KEINE Refactoring

# 3. Test & Deploy
npm run verify  # Lint + TypeCheck + Tests + Build
git add .
git commit -m "hotfix: emergency fix for XYZ"
git push -u origin hotfix/emergency-fix-$(date +%Y%m%d%H%M)

# 4. Auto-Deploy via Cloudflare Pages
# ✅ Hotfix live in 2-3 Minuten
```

### Hotfix Validation
```bash
# 1. Regression Tests
npm run e2e  # Core Mobile Flows

# 2. Performance Check
npm run build
npm run lh

# 3. Bundle Size Check
ENTRY_SIZE=$(ls -la dist/assets/js/index-*.js | awk '{print $5}')
echo "Entry Bundle: $((ENTRY_SIZE / 1024)) KB"  # Sollte <300KB
```

---

## 📊 **Monitoring & Alerting**

### Real User Monitoring (RUM)
- **Error Rate:** >1% → Alarm
- **LCP Mobile:** >2.5s → Warning, >3.5s → Alarm
- **JavaScript Errors:** >10/min → Alarm
- **Bundle Size:** >300KB → Warning, >350KB → Alarm

### Health Check Endpoints
```bash
# 1. Basic Health Check
curl https://disaai.de/
# Expected: HTTP 200

# 2. Feature Flag Status
curl https://disaai.de/?ff=debugMode
# Expected: Debug Panel sichtbar

# 3. API Connectivity
# Test Chat API endpoints if available
```

### Automated Rollback Triggers
```yaml
# GitHub Actions Integration
- name: Auto-Rollback on Performance Regression
  if: lighthouse.lcp > 3500  # 3.5s
  run: |
    # Revert to previous commit
    # Trigger immediate deployment
```

---

## 📋 **Rollback Checklist**

### Pre-Rollback
- [ ] Problem scope identifiziert (Global vs. Feature-specific)
- [ ] Rollback-Methode gewählt (Cloudflare vs. Feature-Flag vs. Hotfix)
- [ ] Team benachrichtigt über geplanten Rollback

### During Rollback
- [ ] Rollback-Commands ausgeführt (siehe oben)
- [ ] Deployment Status überwacht
- [ ] Basic Functionality getestet
- [ ] Error Rates überwacht

### Post-Rollback
- [ ] Vollständige Regression Tests durchgeführt
- [ ] Performance Metrics validiert
- [ ] User Communications (wenn nötig)
- [ ] Post-Mortem Issue erstellt
- [ ] Root Cause Analysis geplant

---

## 📝 **Communication Templates**

### Internal Team Alert
```
🚨 ROLLBACK INITIATED
Time: {{ timestamp }}
Issue: {{ description }}
Action: {{ rollback_method }}
ETA: 60 seconds
Status: In Progress
```

### User Communication (wenn nötig)
```
We're experiencing technical difficulties and are working on a fix.
Service should be restored within 2-3 minutes.
We apologize for any inconvenience.
```

### Post-Rollback Update
```
✅ ROLLBACK COMPLETED
Issue: {{ description }}
Resolution: {{ action_taken }}
Status: Service restored
Next: Root cause analysis scheduled
```

---

## 🔄 **Prevention Strategies**

### Feature Flag Hygiene
- Alle neuen Features hinter Feature-Flags
- Stufenweise Rollouts (5% → 25% → 50% → 100%)
- Monitoring vor Full-Rollout

### Testing Gates
- Bundle Size CI Gates (<300KB hard limit)
- Performance CI Gates (LCP <2.5s)
- Mobile Regression Tests mandatory

### Deployment Safety
- Blue-Green Deployments via Cloudflare Pages
- Canary Releases für kritische Features
- Automated Health Checks post-deployment

---

## 🚨 **Emergency Contacts**

| Role | Contact | Availability |
|------|---------|-------------|
| Lead Developer | {{ contact }} | 24/7 |
| DevOps | {{ contact }} | Business Hours |
| Product Owner | {{ contact }} | Business Hours |
| Cloudflare Support | Enterprise Support | 24/7 |

---

## 📚 **Additional Resources**

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Feature Flag Best Practices](./workflow_rules.md#feature-flags)
- [Mobile QA Checklist](./QA_Mobile_Checklist.md)
- [Performance Budget Guidelines](./workflow_rules.md#performance-budget)

---

> ⚡ **Remember:** In einem echten Emergency ist Geschwindigkeit wichtiger als Perfektion.
> Rollback first, analyze later!