# Eye Orb Layer (Chat Presence)

## Entry Point

- Gerendert in `src/pages/Chat.tsx` als Hintergrund-Layer innerhalb von `ChatLayout`.
- Implementiert in `src/components/eye/EyeOrb.tsx` (WebGL) mit kleinem CSS-Glow.

## Phase / State

`Chat.tsx` leitet eine Phase (CoreStatus) ab und übergibt sie an `EyeOrb`:

- `idle`: kein Loading, kein Error
- `thinking`: `isLoading === true` und letztes Message-Role noch **nicht** `assistant`
- `streaming`: `isLoading === true` und letztes Message-Role ist `assistant`
- `error`: `error != null` oder `apiStatus` ist `error | missing_key | rate_limited`

## Layout

- Orb ist kompakt (clamp ~11–22rem) und am rechten oberen Rand verankert (`translate-x`/`-translate-y`), damit Chatkarten, Menü und Verlauf nicht überlagert werden.
- Maskierter radialer Verlauf hält die Ränder weich, ein subtiler Glow (`bg-accent-chat-surface`) sitzt unter dem WebGL-Canvas.
- Wenn Menü oder Verlauf geöffnet sind, blendet `isObscured` den Orb aus, um keine Overlays zu überstrahlen.

## Quality Tiers

- **High**: WebGL + Shader + DeviceOrientation (Gyro). iOS zeigt bei Bedarf ein minimales „Motion aktivieren“.
- **Low**: CSS-Fallback (statisch), kein WebGL. (Medium wird aktuell nicht genutzt, da die Szene klein gehalten ist.)

