# Eye Orb Layer (Chat Presence)

## Entry Point

- Gerendert in `src/pages/Chat.tsx` als Hintergrund-Layer innerhalb von `ChatLayout`.
- Implementiert in `src/components/eye/EyeOrbLayer.tsx`.

## Phase / State

`Chat.tsx` leitet eine Phase ab und übergibt sie an `EyeOrbLayer`:

- `idle`: kein Loading, kein Error
- `thinking`: `isLoading === true` und letztes Message-Role noch **nicht** `assistant`
- `streaming`: `isLoading === true` und letztes Message-Role ist `assistant`
- `error`: `error != null` oder `apiStatus` ist `error | missing_key | rate_limited`

`error` ist bewusst **nur ein kurzer Blink (≈200ms)** und fällt dann visuell zurück auf `idle`, um die Chat-Lesbarkeit zu schützen.

## Quality Tiers

- **High**: WebGL + Shader + DeviceOrientation (Gyro). iOS zeigt bei Bedarf ein minimales „Motion aktivieren“.
- **Medium**: WebGL + reduzierter Shader, kein Gyro.
- **Low**: CSS-Fallback (statisch), kein WebGL.

Tier-Entscheidung:

- `prefers-reduced-motion: reduce` ⇒ mindestens `medium`/`low` (keine Micro-Motion)
- `navigator.deviceMemory <= 4` ⇒ Downgrade auf `medium`
- WebGL nicht verfügbar ⇒ `low`
- FPS-Heuristik in den ersten ~2 Sekunden kann weiter downgraden

