# Mobile Test Checklist - Schnelltest

**Tester:** _______________  
**Datum:** _______________  
**Device:** _______________  
**Browser:** _______________

---

## 🚀 Sprint 1 - Foundation (10 Min)

### Haptic Feedback
- [ ] Primary Button → Medium Vibration spürbar
- [ ] Destructive Button → Heavy Vibration spürbar
- [ ] Settings Toggle funktioniert (Ein/Aus)

### Swipe Gestures
- [ ] Swipe Right funktioniert (min. 50px)
- [ ] Visual Feedback während Drag
- [ ] Haptic Feedback beim Trigger

### Long-Press
- [ ] 500ms halten → Haptic Feedback
- [ ] Bewegung cancelt Long-Press
- [ ] Context-Menu erscheint

### Pull-to-Refresh
- [ ] Rubber-Band Effekt sichtbar
- [ ] Loading-Spinner erscheint
- [ ] Liste wird aktualisiert

**Sprint 1 Status:** ✅ ❌ ⚠️

---

## 🧭 Sprint 2 - Navigation (15 Min)

### Swipe-Right Navigation
- [ ] Chat → History (Swipe Right)
- [ ] Visual Feedback (translateX)
- [ ] 100px Threshold
- [ ] Smooth Navigation

### Context Menu - Messages
- [ ] Long-Press auf User-Message
- [ ] Actions: Kopieren, Bearbeiten, Löschen
- [ ] Long-Press auf AI-Message
- [ ] Actions: Kopieren, Neu generieren, Löschen
- [ ] Backdrop schließt Menu
- [ ] Escape schließt Menu

### Context Menu - Conversations
- [ ] Long-Press auf Conversation-Card
- [ ] Actions: Umbenennen, Teilen, Löschen
- [ ] Web Share API (falls verfügbar)
- [ ] Teilen funktioniert (iOS/Android)

### Swipe-Down zum Schließen
- [ ] AppMenuDrawer: Swipe-Down schließt
- [ ] HistorySidePanel: Swipe-Down schließt
- [ ] Visual Feedback (translateY + Opacity)
- [ ] 80px Threshold

**Sprint 2 Status:** ✅ ❌ ⚠️

---

## 🎯 Sprint 3 - Input & Touch (10 Min)

### Touch-Targets
- [ ] Alle Buttons ≥ 44px (stichprobenartig messen)
- [ ] Primary Button: 44px
- [ ] Icon Button: 44px
- [ ] Small Button: 44px (gefixt)
- [ ] FAB: 56px (14)

### Character Counter
- [ ] Erscheint ab 3200 Zeichen (80%)
- [ ] Grau bei 80-89%
- [ ] Gelb bei 90-99%
- [ ] Rot ab 100%
- [ ] Smooth Fade-In

### FAB Group (falls implementiert)
- [ ] Plus-Button expandiert
- [ ] Icon rotiert zu X
- [ ] Actions mit Labels sichtbar
- [ ] Staggered Animations
- [ ] Haptic Feedback pro Action
- [ ] Auto-close nach Action

**Sprint 3 Status:** ✅ ❌ ⚠️

---

## 🔥 Critical Path Test (5 Min)

**Kompletter User Flow:**

1. [ ] App öffnen (ChatHistoryPage)
2. [ ] Pull-to-Refresh → Liste aktualisiert
3. [ ] Long-Press auf Conversation → Menu
4. [ ] Menu schließen (Backdrop)
5. [ ] Neuer Chat starten
6. [ ] Nachricht eingeben (>3200 Zeichen)
7. [ ] Character Counter erscheint
8. [ ] Nachricht senden
9. [ ] Long-Press auf eigene Message → Menu
10. [ ] "Bearbeiten" auswählen
11. [ ] Swipe Right → zurück zu History
12. [ ] Hamburger Menu öffnen
13. [ ] Swipe-Down → Menu schließt

**Critical Path:** ✅ ❌ ⚠️

---

## 📊 Zusammenfassung

| Kategorie | Getestet | Erfolgreich | Fehler | Notizen |
|-----------|----------|-------------|--------|---------|
| Sprint 1 | ☐ | ___/4 | ___ | |
| Sprint 2 | ☐ | ___/4 | ___ | |
| Sprint 3 | ☐ | ___/3 | ___ | |
| Critical Path | ☐ | ___/13 | ___ | |
| **Total** | ☐ | ___/24 | ___ | |

**Erfolgsrate:** ____%

---

## 🐛 Gefundene Bugs

### Bug 1
- **Feature:** _________________
- **Schwere:** Critical / High / Medium / Low
- **Beschreibung:** 
- **Screenshot:** ☐ Angehängt

### Bug 2
- **Feature:** _________________
- **Schwere:** Critical / High / Medium / Low
- **Beschreibung:**
- **Screenshot:** ☐ Angehängt

### Bug 3
- **Feature:** _________________
- **Schwere:** Critical / High / Medium / Low
- **Beschreibung:**
- **Screenshot:** ☐ Angehängt

---

## 💡 Verbesserungsvorschläge

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## ✍️ Notizen

_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## ✅ Abnahme

**Tester:** _______________  
**Unterschrift:** _______________  
**Datum:** _______________

**Status:** ✅ Bestanden | ❌ Nicht bestanden | ⚠️ Mit Einschränkungen
