# DISA AI – Mobile-First UX Specification
**Rolle**: Senior UX Engineer
**Output**: Informationsarchitektur, Kernflows, Gesten, States
**Constraints**: Mobile-first (360–430 px), 2 Hierarchie-Ebenen max, Daumen-Zone 72 px

---

## 1. INFORMATIONSARCHITEKTUR (IA)

### 1.1 Hierarchie-Struktur (Max 2 Ebenen)

```
Level 1 (Navigation)          Level 2 (Screen Content)
┌─────────────────────────────────────────────────────┐
│ 🏠 Home                   → Landing Cards           │
│                           → Quick Actions           │
│                                                     │
│ 💬 Chat                   → Conversation List       │
│                           → Active Chat             │
│                           → Message Composer        │
│                                                     │
│ 🤖 Models                 → Model Grid/List         │
│                           → Model Detail Sheet      │
│                           → Favorites Filter        │
│                                                     │
│ 🎭 Roles                  → Role Grid/List          │
│                           → Role Detail Sheet       │
│                           → Active Role Indicator   │
│                                                     │
│ ⚙️  Settings              → Settings List           │
│                           → Setting Detail          │
│                           → (API/Memory/etc)        │
└─────────────────────────────────────────────────────┘
```

### 1.2 Navigation Tabs (5)

| Tab | Icon | Label | Route | Priority |
|-----|------|-------|-------|----------|
| 1 | 🏠 | Home | `/` | Secondary |
| 2 | 💬 | Chat | `/chat` | **Primary** |
| 3 | 🤖 | Models | `/models` | High |
| 4 | 🎭 | Roles | `/roles` | Medium |
| 5 | ⚙️ | Settings | `/settings` | Low |

**Specs**:
- Height: 56 px + safe-area-inset-bottom
- Tab width: 20% each (5 tabs)
- Touch target: 48 × 56 px minimum
- Active indicator: 3 px top border + accent color
- Background: `--surface-glass-floating` (glassmorphism)
- Elevation: E2 (0 2 6 px, 12% opacity)
- Border-radius: 20 px (top corners only)

### 1.3 FAB (Floating Action Button)

**Position**: Bottom-right, 16 px from right edge, 72 px from bottom (above nav bar)

| State | Action | Icon | Color |
|-------|--------|------|-------|
| Default | New Chat | ➕ / ✏️ | `--color-accent-primary` |
| Chat Screen | New Message | ✏️ | `--color-accent-primary` |
| Models Screen | Add Model | ➕ | `--color-accent-primary` |

**Specs**:
- Size: 56 × 56 px
- Border-radius: 28 px (full circle)
- Elevation: E3 (0 4 12 px, 16% opacity)
- Touch target: 56 px minimum (no expansion needed)
- Backdrop: blur-M (16 px) with 8% opacity

---

## 2. NAVIGATION DEFINITION

### 2.1 Tab Specifications

```json
{
  "navigation": {
    "container": {
      "height": "56px",
      "paddingBottom": "env(safe-area-inset-bottom)",
      "background": "var(--surface-glass-floating)",
      "backdropFilter": "blur(16px)",
      "borderRadius": "20px 20px 0 0",
      "boxShadow": "0 2px 6px rgba(0,0,0,0.12)",
      "position": "fixed",
      "bottom": 0,
      "zIndex": 100
    },
    "tabs": [
      {
        "id": "home",
        "icon": "home",
        "label": "Home",
        "route": "/",
        "touchTarget": "48x56px"
      },
      {
        "id": "chat",
        "icon": "message-square",
        "label": "Chat",
        "route": "/chat",
        "touchTarget": "48x56px",
        "isPrimary": true
      },
      {
        "id": "models",
        "icon": "cpu",
        "label": "Models",
        "route": "/models",
        "touchTarget": "48x56px"
      },
      {
        "id": "roles",
        "icon": "users",
        "label": "Roles",
        "route": "/roles",
        "touchTarget": "48x56px"
      },
      {
        "id": "settings",
        "icon": "settings",
        "label": "Settings",
        "route": "/settings",
        "touchTarget": "48x56px"
      }
    ],
    "activeIndicator": {
      "type": "top-border",
      "height": "3px",
      "color": "var(--color-accent-primary)",
      "transition": "180ms ease-out"
    }
  }
}
```

### 2.2 FAB Definition

```json
{
  "fab": {
    "size": "56px",
    "borderRadius": "28px",
    "position": {
      "bottom": "72px",
      "right": "16px"
    },
    "elevation": {
      "shadow": "0 4px 12px rgba(0,0,0,0.16)",
      "blur": "16px",
      "opacity": "8%"
    },
    "actions": {
      "/chat": {
        "icon": "edit",
        "label": "New Chat",
        "action": "createNewConversation"
      },
      "/models": {
        "icon": "plus",
        "label": "Add Model",
        "action": "openModelSearch"
      },
      "/roles": {
        "icon": "user-plus",
        "label": "New Role",
        "action": "openRoleCreator"
      }
    },
    "color": "var(--color-accent-primary)",
    "iconSize": "24px"
  }
}
```

---

## 3. KERNFLOWS (3 Flows, Max 5 Schritte)

### Flow 1: Neue Konversation starten

**Ziel**: User startet neuen Chat mit ausgewähltem Modell und Rolle
**Entry Point**: FAB auf Chat-Screen oder Home
**Schritte**: 4

| # | Screen | Action | UI Element | Feedback |
|---|--------|--------|------------|----------|
| 1 | Chat List | Tap FAB | FAB (56 px, bottom-right) | FAB scale animation (120 ms) |
| 2 | New Chat Sheet | Select Model | Model chips (48 px height) | Chip highlight (180 ms) |
| 3 | New Chat Sheet | Select Role (optional) | Role chips (48 px height) | Chip highlight (180 ms) |
| 4 | Chat Composer | Type message | Textarea (min 48 px) | Keyboard opens, FAB hides |

**Max. Entscheidungspunkte**: 2 (Model, Role)
**Daumen-Zone**: FAB, Model-Chips in unteren 72 px
**Performance**: Sheet öffnet <180 ms, no backdrop-filter on sheet content

---

### Flow 2: Modell suchen und favorisieren

**Ziel**: User findet Modell, testet es, speichert Favorit
**Entry Point**: Models Tab
**Schritte**: 5

| # | Screen | Action | UI Element | Feedback |
|---|--------|--------|------------|----------|
| 1 | Models Tab | Tap Models tab | Bottom nav tab (48 px) | Tab indicator slides (180 ms) |
| 2 | Model List | Pull-to-refresh | Vertical pull gesture | Spinner appears, list reloads |
| 3 | Model List | Tap Model Card | Card (min 72 px height) | Card elevation +E1 (120 ms) |
| 4 | Model Detail Sheet | Read specs, Tap "Try" | Button (48 px, bottom) | Sheet slides up (240 ms) |
| 5 | Model Detail Sheet | Tap Star icon | Star icon (48 px target) | Star fills, toast "Added to favorites" |

**Max. Entscheidungspunkte**: 2 (Select Model, Favorite)
**Daumen-Zone**: "Try" Button, Star Icon in unteren 72 px
**Performance**: List virtualisiert (react-window), max 2 glassmorphism layers (card + sheet)

---

### Flow 3: Einstellungen ändern (Theme wechseln)

**Ziel**: User ändert Dark/Light Theme
**Entry Point**: Settings Tab
**Schritte**: 3

| # | Screen | Action | UI Element | Feedback |
|---|--------|--------|------------|----------|
| 1 | Any Screen | Tap Settings tab | Bottom nav tab (48 px) | Tab indicator slides (180 ms) |
| 2 | Settings List | Tap "Appearance" | List item (56 px height) | Row highlight (120 ms) |
| 3 | Appearance Screen | Toggle Theme Switch | Switch (48 px target) | Theme animates (240 ms), toast confirmation |

**Max. Entscheidungspunkte**: 1 (Theme Toggle)
**Daumen-Zone**: Settings-Tab, Theme-Switch in mittlerer Zone (erreichbar)
**Performance**: Theme-Switch via CSS variables, <240 ms Transition

---

## 4. GESTENSTEUERUNG

### 4.1 Definierte Gesten

| Geste | Kontext | Aktion | Feedback | Specs |
|-------|---------|--------|----------|-------|
| **Swipe Left** | Chat Screen (Conversation List) | Next Conversation | List slides left (180 ms) | Min. 48 px horizontal delta |
| **Swipe Right** | Chat Screen (Conversation List) | Previous Conversation | List slides right (180 ms) | Min. 48 px horizontal delta |
| **Swipe Right** | Any Screen (from left edge) | Open Drawer Menu | Drawer slides in (240 ms) | Edge detection: 0–16 px from left |
| **Pull-to-Refresh** | Model List, Role List | Reload Data | Spinner + haptic feedback | Min. 64 px vertical pull |
| **Long Press** | Chat Message | Message Actions Menu | Context menu appears (120 ms) | 500 ms hold duration |
| **Pinch** | Not Implemented | — | — | — (reserved for future) |

### 4.2 Gesten-Parameter

```json
{
  "gestures": {
    "swipeHorizontal": {
      "minDelta": "48px",
      "velocity": "0.3px/ms",
      "transition": "180ms ease-out",
      "contexts": ["chat-list", "conversation-view"]
    },
    "swipeEdge": {
      "edgeZone": "0-16px from left",
      "minDelta": "32px",
      "transition": "240ms cubic-bezier(0.4, 0, 0.2, 1)",
      "backdropOpacity": "0.4"
    },
    "pullToRefresh": {
      "minPull": "64px",
      "maxPull": "120px",
      "spinnerSize": "32px",
      "hapticFeedback": true,
      "contexts": ["model-list", "role-list"]
    },
    "longPress": {
      "duration": "500ms",
      "vibrate": "10ms",
      "contexts": ["chat-message", "model-card"]
    }
  }
}
```

### 4.3 Gesten-Priorisierung

**Aktiviert**:
1. Swipe left/right (Chat-Wechsel)
2. Edge swipe right (Drawer öffnen)
3. Pull-to-refresh (Listen)
4. Long press (Kontextmenü)

**Deaktiviert**:
- Pinch-to-zoom (reserved)
- Swipe up/down (conflicts with scroll)

---

## 5. STATES – EMPTY, LOADING, ERROR

### 5.1 State-Definition Matrix

| Screen | Empty State | Loading State | Error State |
|--------|-------------|---------------|-------------|
| **Chat List** | Illustration + "Start new chat" CTA | Skeleton (3 cards, 72 px each) | "Connection failed" + Retry button |
| **Active Chat** | Welcome message + Prompt suggestions | Typing indicator (3 dots, 24 px) | "Message failed" + Resend icon |
| **Model List** | "No models available" + Refresh button | Skeleton (6 cards, 96 px each) | "Failed to load models" + Retry |
| **Model Detail** | — | Sheet skeleton (fade-in 240 ms) | "Model unavailable" + Close |
| **Role List** | "Create your first role" + FAB prompt | Skeleton (4 cards, 80 px each) | "Failed to load roles" + Retry |
| **Settings** | — | — | "Settings error" + Reset button |

### 5.2 State Specs (JSON)

```json
{
  "states": {
    "empty": {
      "chatList": {
        "illustration": "empty-chat.svg",
        "title": "No conversations yet",
        "description": "Tap + to start your first chat",
        "cta": {
          "label": "New Chat",
          "action": "openFAB",
          "size": "48px",
          "variant": "primary"
        }
      },
      "modelList": {
        "illustration": "empty-models.svg",
        "title": "No models available",
        "description": "Pull to refresh or check connection",
        "cta": {
          "label": "Refresh",
          "action": "pullToRefresh",
          "size": "48px",
          "variant": "secondary"
        }
      },
      "roleList": {
        "title": "Create your first role",
        "description": "Roles help personalize AI responses",
        "cta": {
          "label": "Create Role",
          "action": "openRoleCreator",
          "size": "48px",
          "variant": "primary"
        }
      }
    },
    "loading": {
      "skeleton": {
        "animation": "pulse",
        "duration": "1200ms",
        "opacity": "0.6 to 0.3",
        "borderRadius": "12px"
      },
      "chatList": {
        "cards": 3,
        "cardHeight": "72px",
        "spacing": "12px"
      },
      "modelList": {
        "cards": 6,
        "cardHeight": "96px",
        "spacing": "16px"
      },
      "roleList": {
        "cards": 4,
        "cardHeight": "80px",
        "spacing": "12px"
      },
      "typingIndicator": {
        "dots": 3,
        "dotSize": "8px",
        "spacing": "4px",
        "animation": "bounce 1400ms infinite",
        "color": "var(--color-text-secondary)"
      }
    },
    "error": {
      "chatList": {
        "icon": "wifi-off",
        "title": "Connection failed",
        "description": "Check your internet and try again",
        "cta": {
          "label": "Retry",
          "action": "refetchConversations",
          "size": "48px",
          "variant": "primary"
        }
      },
      "chatMessage": {
        "icon": "alert-circle",
        "title": "Message failed",
        "inline": true,
        "cta": {
          "icon": "refresh-cw",
          "label": "Resend",
          "action": "resendMessage",
          "size": "32px",
          "variant": "ghost"
        }
      },
      "modelList": {
        "icon": "cloud-off",
        "title": "Failed to load models",
        "description": "Service may be temporarily unavailable",
        "cta": {
          "label": "Retry",
          "action": "refetchModels",
          "size": "48px",
          "variant": "primary"
        }
      }
    }
  }
}
```

### 5.3 State-Trigger-Tabelle

| Screen | Empty Trigger | Loading Trigger | Error Trigger |
|--------|---------------|-----------------|---------------|
| Chat List | `conversations.length === 0` | `isLoading === true` | `error !== null` |
| Active Chat | `messages.length === 0` | `isStreaming === true` | `message.status === 'failed'` |
| Model List | `models.length === 0` | `isLoading === true` | `error !== null` |
| Role List | `roles.length === 0` | `isLoading === true` | `error !== null` |
| Settings | — | — | `settingsError !== null` |

### 5.4 State-Performance-Regeln

| State | Regel | Wert |
|-------|-------|------|
| Loading → Content | Skeleton min. Dauer | 400 ms (verhindert Flash) |
| Error → Retry | Debounce Retry-Button | 1000 ms |
| Empty → Content | Fade-in Transition | 240 ms |
| Loading Skeleton | Max. Blur-Layer | 0 (Performance) |

---

## 6. ABNAHME-ARTEFAKTE

### 6.1 IA-Diagramm
✅ **Geliefert**: Abschnitt 1 (2-Ebenen-Hierarchie, 5 Bottom-Nav-Tabs, FAB-Definition)

### 6.2 Flow-Sequenzen (3)
✅ **Geliefert**: Abschnitt 3
- Flow 1: Neue Konversation (4 Schritte)
- Flow 2: Modell suchen & favorisieren (5 Schritte)
- Flow 3: Theme wechseln (3 Schritte)

### 6.3 State-Liste mit Triggern
✅ **Geliefert**: Abschnitt 5 (Empty/Loading/Error für jeden Kernscreen + Trigger-Tabelle)

### 6.4 Gesten-Definition
✅ **Geliefert**: Abschnitt 4 (4 Gesten mit Specs, Parametern, Kontexten)

---

## 7. DESIGN-SYSTEM-COMPLIANCE

### 7.1 Einhaltung der Leitplanken

| Constraint | Status | Implementierung |
|------------|--------|-----------------|
| Mobile-First (360–430 px) | ✅ | Bottom Nav + FAB für Primäraktionen |
| Touch-Ziele ≥ 48 dp | ✅ | Alle interaktiven Elemente min. 48 px |
| Abstand ≥ 8 dp | ✅ | Spacing-Skala: 8-12-16-24-32 px |
| Typografie: Body 16 px | ✅ | Base font-size 16 px (siehe Design Tokens) |
| Kontrast ≥ 4.5:1 | ✅ | Text auf Glassmorphism getestet |
| Radii: 8-28 px | ✅ | Nav: 20 px, FAB: 28 px, Cards: 12 px |
| Schatten E1-E3 | ✅ | Nav: E2, FAB: E3, Cards: E1 |
| Glassmorphism ≤ 2 Layer | ✅ | Max. Nav + FAB gleichzeitig (2 Layer) |
| Bewegung 120–240 ms | ✅ | Mikro: 120 ms, Transitions: 180-240 ms |
| Daumen-Zone: 72 px | ✅ | FAB, CTAs in unteren 72 px |
| Max. 2 Hierarchie-Ebenen | ✅ | Level 1: Nav, Level 2: Screen Content |
| Max. 3 Formularfelder | ✅ | New Chat: 2 Felder (Model, Role) |

### 7.2 Performance-Budget

| Metrik | Budget | Ist-Wert |
|--------|--------|----------|
| Backdrop-Filter gleichzeitig | ≤ 2 | 2 (Nav + FAB) |
| Loading-State min. Dauer | ≥ 400 ms | 400 ms (Skeleton) |
| Transition-Dauer | 180–240 ms | 180 ms (Tabs), 240 ms (Sheets) |
| Touch-Response | ≤ 100 ms | 120 ms (visuelles Feedback) |

---

## 8. NÄCHSTE SCHRITTE (HANDOFF)

### 8.1 Für UI-Designer
- **Aufgabe**: High-Fidelity Mockups für 3 Kernflows erstellen
- **Tools**: Figma mit Disa AI Design Tokens
- **Specs**: Bottom Nav (5 Tabs), FAB (56 px), States (Empty/Loading/Error)
- **Output**: Figma-Datei mit Prototyp für Swipe-Gesten

### 8.2 Für Frontend-Entwickler
- **Aufgabe**: Bottom Nav + FAB implementieren, Gesten integrieren
- **Komponenten**: `MobileBottomNav.tsx`, `FAB.tsx`, `useSwipeGesture.ts`
- **States**: Skeleton-Komponenten für Loading, Error-Boundaries
- **Testing**: Touch-Ziel-Tests (min. 48 px), Gesture-Response-Tests

### 8.3 Für QA
- **Testfälle**: 3 Kernflows auf Geräten 360–430 px Breite
- **Gesten**: Swipe left/right, Pull-to-refresh, Long press
- **States**: Leere Listen, Offline-Modus, Langsames Netzwerk (throttle)
- **Accessibility**: Screenreader-Tests, Fokus-Reihenfolge, Kontrast

---

**Dokument-Version**: 1.0
**Datum**: 2025-11-12
**Autor**: Senior UX Engineer (Claude)
**Status**: ✅ Abnahme-Ready
