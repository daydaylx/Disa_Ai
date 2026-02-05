# Mobile Optimierungen - Testplan

**Version:** 1.0  
**Datum:** 05.02.2026  
**Sprints:** 1-3 (Foundation, Navigation, Input & Touch)  
**Tester:** QA Team / Entwickler

---

## 📋 Testübersicht

| Sprint | Features | Unit Tests | E2E Tests | Manuelle Tests | Status |
|--------|----------|------------|-----------|----------------|--------|
| Sprint 1 | Foundation | 4 | 2 | 8 | 🔴 TODO |
| Sprint 2 | Navigation | 3 | 3 | 12 | 🔴 TODO |
| Sprint 3 | Input & Touch | 2 | 1 | 5 | 🔴 TODO |
| **Total** | **13 Features** | **9 Tests** | **6 Tests** | **25 Tests** | **0%** |

---

## 🧪 Sprint 1 - Foundation

### 1.1 Haptic Feedback System

**Komponente:** `src/lib/haptics.ts`

#### Unit Tests

**Test 1.1.1: Haptic Feedback Types**
```typescript
// tests/unit/haptics.test.ts
describe('hapticFeedback', () => {
  it('sollte alle Vibrationsmuster unterstützen', () => {
    const patterns = ['light', 'medium', 'heavy', 'success', 'warning', 'error', 'selection'];
    patterns.forEach(pattern => {
      expect(() => hapticFeedback(pattern)).not.toThrow();
    });
  });

  it('sollte nichts tun wenn Vibration API nicht verfügbar', () => {
    const originalNavigator = global.navigator;
    delete global.navigator.vibrate;
    expect(() => hapticFeedback('medium')).not.toThrow();
    global.navigator = originalNavigator;
  });

  it('sollte korrekte Vibrationsmuster verwenden', () => {
    const spy = jest.spyOn(navigator, 'vibrate');
    hapticFeedback('light');
    expect(spy).toHaveBeenCalledWith(10);
    hapticFeedback('heavy');
    expect(spy).toHaveBeenCalledWith(50);
  });
});
```

**Priorität:** 🔴 HOCH  
**Aufwand:** 30 Minuten

#### Manuelle Tests

**Test 1.1.2: Haptic Feedback auf Buttons**
- **Device:** iPhone 13 Pro / Android Pixel 6
- **Browser:** Safari / Chrome Mobile
- **Schritte:**
  1. Öffne App auf Mobilgerät
  2. Tippe Primary Button → sollte "medium" vibrieren
  3. Tippe Destructive Button → sollte "heavy" vibrieren
  4. Tippe Ghost Button → sollte "medium" vibrieren
- **Erwartung:** Spürbare Vibration passend zur Button-Variante
- **Status:** 🔴 TODO

**Test 1.1.3: Haptic Feedback on/off Toggle**
- **Schritte:**
  1. Gehe zu Einstellungen > Verhalten
  2. Deaktiviere "Haptisches Feedback"
  3. Tippe beliebigen Button → keine Vibration
  4. Aktiviere "Haptisches Feedback"
  5. Tippe beliebigen Button → Vibration
- **Erwartung:** Setting wird respektiert
- **Status:** 🔴 TODO

---

### 1.2 Swipe Gesture Detection

**Komponente:** `src/hooks/useSwipeGesture.ts`

#### Unit Tests

**Test 1.2.1: Swipe Direction Detection**
```typescript
// tests/unit/useSwipeGesture.test.ts
describe('useSwipeGesture', () => {
  it('sollte Swipe-Right erkennen', () => {
    const onSwipeRight = jest.fn();
    const { result } = renderHook(() => 
      useSwipeGesture({ onSwipeRight, threshold: 50 })
    );
    
    // Simulate touch events
    act(() => {
      result.current.handlers.onTouchStart({ touches: [{ clientX: 0, clientY: 0 }] });
      result.current.handlers.onTouchMove({ touches: [{ clientX: 100, clientY: 0 }] });
      result.current.handlers.onTouchEnd();
    });
    
    expect(onSwipeRight).toHaveBeenCalledTimes(1);
  });

  it('sollte Threshold respektieren', () => {
    const onSwipeLeft = jest.fn();
    const { result } = renderHook(() => 
      useSwipeGesture({ onSwipeLeft, threshold: 100 })
    );
    
    // Swipe nur 50px (unter Threshold)
    act(() => {
      result.current.handlers.onTouchStart({ touches: [{ clientX: 100, clientY: 0 }] });
      result.current.handlers.onTouchMove({ touches: [{ clientX: 50, clientY: 0 }] });
      result.current.handlers.onTouchEnd();
    });
    
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });
});
```

**Priorität:** 🟠 MITTEL  
**Aufwand:** 45 Minuten

#### E2E Tests

**Test 1.2.2: Swipe Navigation (Playwright)**
```typescript
// tests/e2e/swipe-navigation.spec.ts
test.describe('Swipe Navigation', () => {
  test('sollte von Chat zur History navigieren', async ({ page }) => {
    await page.goto('/chat');
    
    // Swipe right
    await page.touchscreen.swipe(
      { x: 10, y: 300 },
      { x: 200, y: 300 },
      { steps: 10 }
    );
    
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Gespeicherte Unterhaltungen')).toBeVisible();
  });
});
```

**Priorität:** 🟠 MITTEL  
**Aufwand:** 30 Minuten

---

### 1.3 Long-Press Detection

**Komponente:** `src/hooks/useLongPress.ts`

#### Unit Tests

**Test 1.3.1: Long-Press Delay**
```typescript
// tests/unit/useLongPress.test.ts
describe('useLongPress', () => {
  it('sollte Long-Press nach delay triggern', async () => {
    jest.useFakeTimers();
    const onLongPress = jest.fn();
    const { result } = renderHook(() => 
      useLongPress({ onLongPress, delay: 500 })
    );
    
    act(() => {
      result.current.handlers.onTouchStart({ touches: [{ clientX: 0, clientY: 0 }] });
      jest.advanceTimersByTime(500);
    });
    
    expect(onLongPress).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('sollte bei Bewegung canceln', () => {
    const onLongPress = jest.fn();
    const { result } = renderHook(() => 
      useLongPress({ onLongPress, moveThreshold: 10 })
    );
    
    act(() => {
      result.current.handlers.onTouchStart({ touches: [{ clientX: 0, clientY: 0 }] });
      result.current.handlers.onTouchMove({ touches: [{ clientX: 20, clientY: 0 }] });
      result.current.handlers.onTouchEnd();
    });
    
    expect(onLongPress).not.toHaveBeenCalled();
  });
});
```

**Priorität:** 🟠 MITTEL  
**Aufwand:** 45 Minuten

---

### 1.4 Pull-to-Refresh

**Komponente:** `src/ui/PullToRefresh.tsx`

#### Manuelle Tests

**Test 1.4.1: Pull-to-Refresh auf ChatHistoryPage**
- **Schritte:**
  1. Öffne ChatHistoryPage
  2. Scrolle nach oben (Container muss bereits oben sein)
  3. Ziehe weiter nach unten (Pull-Down)
  4. Lasse los wenn Indikator erscheint
- **Erwartung:** 
  - Rubber-Band Effekt sichtbar
  - Loading-Spinner während Refresh
  - Liste wird neu geladen
- **Status:** 🔴 TODO

**Test 1.4.2: Pull-to-Refresh auf ModelsCatalog**
- **Schritte:** Identisch zu 1.4.1
- **Erwartung:** Model-Liste wird neu geladen
- **Status:** 🔴 TODO

---

## 🧪 Sprint 2 - Navigation

### 2.1 Swipe-Right Navigation (Chat → History)

**Komponente:** `src/pages/Chat.tsx`

#### E2E Tests

**Test 2.1.1: Swipe-Back mit Visual Feedback**
```typescript
// tests/e2e/chat-navigation.spec.ts
test('sollte visuelles Feedback beim Swipe zeigen', async ({ page }) => {
  await page.goto('/chat');
  
  const chatContainer = page.locator('[data-testid="chat-container"]');
  
  // Start swipe (sollte translateX ändern)
  await page.touchscreen.down({ x: 10, y: 300 });
  await page.touchscreen.move({ x: 50, y: 300 });
  
  const transform = await chatContainer.evaluate(el => 
    window.getComputedStyle(el).transform
  );
  expect(transform).not.toBe('none');
  
  // Complete swipe
  await page.touchscreen.up();
  await expect(page).toHaveURL('/');
});
```

**Priorität:** 🔴 HOCH  
**Aufwand:** 30 Minuten

---

### 2.2 Context Menu (Long-Press)

**Komponente:** `src/ui/ContextMenu.tsx`

#### Unit Tests

**Test 2.2.1: ContextMenu Rendering**
```typescript
// tests/unit/ContextMenu.test.ts
describe('ContextMenu', () => {
  it('sollte alle Items rendern', () => {
    const items = [
      { icon: Copy, label: 'Kopieren', onClick: jest.fn() },
      { icon: Trash2, label: 'Löschen', onClick: jest.fn(), danger: true },
    ];
    
    render(<ContextMenu items={items} onClose={jest.fn()} />);
    
    expect(screen.getByText('Kopieren')).toBeInTheDocument();
    expect(screen.getByText('Löschen')).toBeInTheDocument();
  });

  it('sollte onClick Handler aufrufen', () => {
    const onClick = jest.fn();
    const onClose = jest.fn();
    const items = [{ icon: Copy, label: 'Test', onClick }];
    
    render(<ContextMenu items={items} onClose={onClose} />);
    
    fireEvent.click(screen.getByText('Test'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
```

**Priorität:** 🔴 HOCH  
**Aufwand:** 30 Minuten

#### Manuelle Tests

**Test 2.2.2: Long-Press auf Message**
- **Schritte:**
  1. Öffne Chat mit Nachrichten
  2. Halte Finger 500ms auf User-Message
  3. Context-Menu sollte erscheinen
  4. Prüfe Actions: Kopieren, Bearbeiten, Löschen
  5. Wiederhole mit AI-Message
  6. Prüfe Actions: Kopieren, Neu generieren, Löschen
- **Erwartung:** 
  - Haptic Feedback nach 500ms
  - Menu von unten einsliden
  - Backdrop mit Blur
  - Touch-Targets 44px
- **Status:** 🔴 TODO

**Test 2.2.3: Context-Menu Actions (Message)**
- **Schritte:**
  1. Long-Press auf Message
  2. Tippe "Kopieren" → Message in Clipboard
  3. Long-Press, tippe "Bearbeiten" → Edit-Mode
  4. Long-Press, tippe "Löschen" → Message entfernt
- **Erwartung:** Alle Actions funktionieren
- **Status:** 🔴 TODO

---

### 2.3 Long-Press auf Conversations

**Komponente:** `src/components/conversation/ConversationCard.tsx`

#### E2E Tests

**Test 2.3.1: Long-Press Context-Menu (Conversation)**
```typescript
// tests/e2e/conversation-menu.spec.ts
test('sollte Context-Menu bei Long-Press öffnen', async ({ page }) => {
  await page.goto('/');
  
  const firstConversation = page.locator('.conversation-card').first();
  
  // Long-press
  await firstConversation.tap({ duration: 600 });
  
  await expect(page.getByText('Umbenennen')).toBeVisible();
  await expect(page.getByText('Löschen')).toBeVisible();
  
  // Check Web Share API
  const hasShareAPI = await page.evaluate(() => !!navigator.share);
  if (hasShareAPI) {
    await expect(page.getByText('Teilen')).toBeVisible();
  }
});
```

**Priorität:** 🟠 MITTEL  
**Aufwand:** 30 Minuten

#### Manuelle Tests

**Test 2.3.2: Web Share API Integration**
- **Device:** iOS Safari (Share API vorhanden)
- **Schritte:**
  1. Long-Press auf Conversation
  2. Tippe "Teilen"
  3. System Share Sheet öffnet sich
  4. Teile via WhatsApp/Messages/etc.
- **Erwartung:** 
  - Share Sheet erscheint
  - Titel + letzte 3 Messages im Share-Text
- **Status:** 🔴 TODO

---

### 2.4 Swipe-Down zum Schließen

**Komponente:** `src/components/layout/AppMenuDrawer.tsx`, `src/components/navigation/HistorySidePanel.tsx`

#### Manuelle Tests

**Test 2.4.1: Swipe-Down AppMenuDrawer**
- **Schritte:**
  1. Öffne Hamburger-Menu
  2. Swipe von oben nach unten
  3. Drawer schließt sich mit Animation
- **Erwartung:** 
  - Visual Feedback: translateY + Opacity
  - Smooth Transition
  - Haptic Feedback
- **Status:** 🔴 TODO

**Test 2.4.2: Swipe-Down HistorySidePanel**
- **Schritte:** Identisch zu 2.4.1 für History-Panel
- **Erwartung:** Identisch zu 2.4.1
- **Status:** 🔴 TODO

---

## 🧪 Sprint 3 - Input & Touch

### 3.1 Touch-Target Optimierung

**Komponente:** `src/ui/Button.tsx`

#### Unit Tests

**Test 3.1.1: Button Size Classes**
```typescript
// tests/unit/Button.test.ts
describe('Button Touch Targets', () => {
  it('sollte default size 44px haben', () => {
    const { container } = render(<Button>Test</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('h-11'); // 44px
  });

  it('sollte sm size 44px haben', () => {
    const { container } = render(<Button size="sm">Test</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('h-11'); // 44px (gefixt von h-10)
  });

  it('sollte icon-sm size 44px haben', () => {
    const { container } = render(<Button size="icon-sm"><X /></Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('h-11 w-11'); // 44px (gefixt)
  });
});
```

**Priorität:** 🟠 MITTEL  
**Aufwand:** 20 Minuten

#### Manuelle Tests

**Test 3.1.2: Touch-Target Audit**
- **Tool:** Browser DevTools + Measure Tool
- **Schritte:**
  1. Prüfe alle Buttons in der App
  2. Messe mit DevTools: min. 44x44px
  3. Teste auf Touch-Device: einfach treffbar?
- **Komponenten zu prüfen:**
  - ✅ Primary Buttons
  - ✅ Secondary Buttons
  - ✅ Icon Buttons
  - ✅ Select Triggers (Pills)
  - ✅ FAB Buttons
- **Erwartung:** Alle ≥ 44px
- **Status:** 🔴 TODO

---

### 3.2 Character Counter

**Komponente:** `src/components/chat/UnifiedInputBar.tsx`

#### Unit Tests

**Test 3.2.1: Character Counter Display Logic**
```typescript
// tests/unit/UnifiedInputBar.test.ts
describe('Character Counter', () => {
  it('sollte bei <80% nicht anzeigen', () => {
    const { queryByText } = render(
      <UnifiedInputBar value="A".repeat(3000)} onChange={jest.fn()} onSend={jest.fn()} />
    );
    expect(queryByText(/3000/)).not.toBeInTheDocument();
  });

  it('sollte ab 80% anzeigen (tertiary)', () => {
    const { getByText } = render(
      <UnifiedInputBar value={"A".repeat(3200)} onChange={jest.fn()} onSend={jest.fn()} />
    );
    const counter = getByText(/3200/);
    expect(counter).toHaveClass('text-ink-tertiary');
  });

  it('sollte ab 90% warning anzeigen', () => {
    const { getByText } = render(
      <UnifiedInputBar value={"A".repeat(3700)} onChange={jest.fn()} onSend={jest.fn()} />
    );
    const counter = getByText(/3700/);
    expect(counter).toHaveClass('text-status-warning');
  });

  it('sollte ab 100% error anzeigen', () => {
    const { getByText } = render(
      <UnifiedInputBar value={"A".repeat(4100)} onChange={jest.fn()} onSend={jest.fn()} />
    );
    const counter = getByText(/4100/);
    expect(counter).toHaveClass('text-status-error');
  });
});
```

**Priorität:** 🔴 HOCH  
**Aufwand:** 30 Minuten

#### Manuelle Tests

**Test 3.2.2: Character Counter UX**
- **Schritte:**
  1. Öffne Chat
  2. Schreibe 3200 Zeichen → Counter erscheint (grau)
  3. Schreibe 3700 Zeichen → Counter wird gelb
  4. Schreibe 4100 Zeichen → Counter wird rot
- **Erwartung:** 
  - Smooth fade-in
  - Farbwechsel korrekt
- **Status:** 🔴 TODO

---

### 3.3 FAB Group

**Komponente:** `src/ui/FABGroup.tsx`

#### E2E Tests

**Test 3.3.1: FAB Group Expand/Collapse**
```typescript
// tests/e2e/fab-group.spec.ts
test('sollte expandieren und Actions zeigen', async ({ page }) => {
  const fabActions = [
    { icon: MessageSquare, label: 'Neuer Chat', onClick: () => {} },
    { icon: Settings, label: 'Einstellungen', onClick: () => {} },
  ];
  
  // Mount FABGroup (im konkreten Page-Context)
  await page.goto('/chat');
  
  const mainFAB = page.locator('[aria-label="Aktionen öffnen"]');
  await mainFAB.click();
  
  // Actions sollten erscheinen
  await expect(page.getByText('Neuer Chat')).toBeVisible();
  await expect(page.getByText('Einstellungen')).toBeVisible();
  
  // Icon sollte rotiert sein
  const transform = await mainFAB.evaluate(el => 
    window.getComputedStyle(el).transform
  );
  expect(transform).toContain('rotate');
});
```

**Priorität:** 🟠 MITTEL  
**Aufwand:** 30 Minuten

#### Manuelle Tests

**Test 3.3.2: FAB Group Interaktion**
- **Schritte:**
  1. Tippe Haupt-FAB → Actions erscheinen
  2. Plus-Icon rotiert zu X
  3. Tippe Action → Haptic Feedback + Action ausgeführt
  4. Menu schließt sich automatisch
  5. Tippe X-Icon → Menu schließt sich
- **Erwartung:** 
  - Staggered Animations (50ms delay)
  - Labels left-aligned zu Icons
  - Haptic Feedback pro Action
- **Status:** 🔴 TODO

---

## 📊 Test-Metriken

### Code Coverage Ziele

| Komponente | Zeilen | Funktionen | Branches | Status |
|------------|--------|------------|----------|--------|
| haptics.ts | 90% | 100% | 80% | 🔴 0% |
| useSwipeGesture.ts | 85% | 100% | 75% | 🔴 0% |
| useLongPress.ts | 85% | 100% | 75% | 🔴 0% |
| ContextMenu.tsx | 80% | 90% | 70% | 🔴 0% |
| FABGroup.tsx | 80% | 90% | 70% | 🔴 0% |
| ConversationCard.tsx | 75% | 85% | 65% | 🔴 0% |
| **Gesamt** | **≥80%** | **≥90%** | **≥70%** | **🔴 0%** |

### Browser-Kompatibilität Matrix

| Feature | iOS Safari | Chrome Mobile | Firefox Mobile | Samsung Internet |
|---------|-----------|---------------|----------------|------------------|
| Haptic Feedback | ✅ | ✅ | ⚠️ Limited | ✅ |
| Swipe Gestures | ✅ | ✅ | ✅ | ✅ |
| Long-Press | ✅ | ✅ | ✅ | ✅ |
| Context Menu | ✅ | ✅ | ✅ | ✅ |
| Web Share API | ✅ | ✅ | ❌ | ✅ |
| Visual Viewport | ✅ | ✅ | ⚠️ Partial | ✅ |

⚠️ = Feature funktioniert mit Einschränkungen  
❌ = Feature nicht verfügbar (Graceful Degradation implementiert)

---

## 🔧 Test-Setup

### Voraussetzungen

```bash
# Unit Tests (Vitest)
npm run test:unit

# E2E Tests (Playwright)
npm run e2e

# Coverage Report
npm run test:coverage
```

### Device Lab

**Minimale Test-Geräte:**
- 📱 iPhone 13 Pro (iOS 16+) - Safari
- 📱 Samsung Galaxy S22 (Android 13+) - Chrome
- 📱 Google Pixel 6 (Android 13+) - Chrome
- 🖥️ Desktop Chrome (DevTools Mobile Emulation)

### Playwright Configuration

```typescript
// playwright.config.ts (bereits vorhanden)
export default defineConfig({
  projects: [
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        hasTouch: true,
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 13 Pro'],
        hasTouch: true,
      },
    },
  ],
});
```

---

## 📝 Test-Ausführungsplan

### Phase 1: Unit Tests (Woche 1)
- [ ] Sprint 1 Unit Tests (2h)
- [ ] Sprint 2 Unit Tests (1.5h)
- [ ] Sprint 3 Unit Tests (1h)
- **Gesamt:** 4.5 Stunden

### Phase 2: E2E Tests (Woche 1-2)
- [ ] Sprint 1 E2E Tests (1h)
- [ ] Sprint 2 E2E Tests (1.5h)
- [ ] Sprint 3 E2E Tests (1h)
- **Gesamt:** 3.5 Stunden

### Phase 3: Manuelle Tests (Woche 2)
- [ ] Sprint 1 Manuell (2h)
- [ ] Sprint 2 Manuell (3h)
- [ ] Sprint 3 Manuell (1.5h)
- **Gesamt:** 6.5 Stunden

### Phase 4: Bug Fixing & Retest (Woche 2-3)
- [ ] Bug Tracking & Fixes (4h)
- [ ] Regression Tests (2h)
- **Gesamt:** 6 Stunden

**Gesamtaufwand:** ~20 Stunden

---

## 🐛 Bug Tracking Template

```markdown
## Bug #XXX: [Titel]

**Feature:** [z.B. Long-Press Context Menu]
**Komponente:** [z.B. ChatMessage.tsx]
**Schwere:** [Critical / High / Medium / Low]
**Browser:** [z.B. iOS Safari 16.4]
**Device:** [z.B. iPhone 13 Pro]

### Schritte zur Reproduktion
1. ...
2. ...

### Erwartetes Verhalten
...

### Tatsächliches Verhalten
...

### Screenshots/Video
[Anhang]

### Logs/Fehler
```
[Console Logs]
```

### Mögliche Ursache
...
```

---

## ✅ Definition of Done

Ein Feature gilt als **vollständig getestet**, wenn:

- ✅ Alle Unit Tests bestanden (≥80% Coverage)
- ✅ Alle E2E Tests bestanden
- ✅ Manuelle Tests auf ≥2 Devices durchgeführt
- ✅ Keine Critical/High Bugs offen
- ✅ Accessibility geprüft (Screen Reader, Keyboard)
- ✅ Performance akzeptabel (<100ms Latenz)
- ✅ Test-Dokumentation aktualisiert

---

## 📞 Kontakt

**QA Lead:** [Name]  
**Entwickler:** Sprint 1-3 Implementation Team  
**Slack Channel:** #mobile-testing  
**Jira Board:** [Link]

---

**Letzte Aktualisierung:** 05.02.2026  
**Version:** 1.0
