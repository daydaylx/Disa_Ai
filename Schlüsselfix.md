# Nächste Schritte zur Behebung der TypeScript-Fehler

Durch die Vereinheitlichung und Verschärfung der TypeScript-Konfiguration (`tsconfig.json`) werden nun im gesamten Projekt strikte Typ-Prüfungen angewendet. Das ist eine wichtige Verbesserung für die Code-Qualität, hat aber viele bereits vorhandene, aber bisher ignorierte Typ-Fehler aufgedeckt.

Hier ist eine Anleitung, um die verbleibenden Fehler systematisch zu beheben. Die Fehler folgen meist wiederkehrenden Mustern.

## 1. Ungenutzte `React`-Imports (Fehler `TS6133`)

**Problem:** In vielen `.tsx`-Dateien wird `React` importiert, obwohl es mit der modernen JSX-Transformation nicht mehr benötigt wird.

**Lösung:** Entferne die überflüssige Import-Zeile.

**Beispiel:**

```diff
- import React from "react";
- import React, { useState } from "react";
+ import { useState } from "react";
```

## 2. Type-Only Imports (Fehler `TS1484`)

**Problem:** Die Einstellung `verbatimModuleSyntax` erfordert, dass Typen, die nur zur Typ-Annotation verwendet werden, mit `import type` importiert werden.

**Lösung:** Ändere den Import, um `type` zu verwenden.

**Beispiel:**

```diff
- import { MyType } from "./types";
+ import type { MyType } from "./types";
```

## 3. `null` / `undefined` Fehler (Fehler `TS2532`, `TS18048`, `TS2722`)

**Problem:** An vielen Stellen kann der Compiler nicht garantieren, dass ein Wert nicht `null` oder `undefined` ist, bevor er verwendet wird.

**Lösung:** Füge eine explizite Prüfung hinzu oder, falls du sicher bist, dass der Wert existiert, eine Non-Null-Assertion (`!`).

**Beispiel (sichere Prüfung):**

```diff
- const value = myArray[0].property;
+ const firstItem = myArray[0];
+ const value = firstItem ? firstItem.property : undefined;
```

**Beispiel (Non-Null-Assertion):**

```diff
- const value = myArray[0].focus();
+ // Nur verwenden, wenn sicher ist, dass das Element existiert
+ myArray[0]!.focus();
```

## 4. Fehlender `override`-Modifikator (Fehler `TS4114`)

**Problem:** In Klassen müssen Methoden, die eine Methode aus einer Basisklasse überschreiben (z.B. `render` in React-Klassenkomponenten), mit dem `override`-Keyword markiert werden.

**Lösung:** Füge das `override`-Keyword hinzu.

**Beispiel:**

```diff
- render() {
+ override render() {
    return <div>Hello</div>;
  }
```

## Empfohlenes Vorgehen

1.  **`npm run typecheck` ausführen:** Starte den Type-Checker, um die aktuelle Liste aller Fehler zu erhalten.
2.  **Datei für Datei vorgehen:** Wähle eine Datei aus der Fehlerliste aus.
3.  **Fehler beheben:** Korrigiere alle Fehler in dieser Datei gemäß den oben genannten Mustern.
4.  **Wiederholen:** Fahre mit der nächsten Datei fort, bis alle Fehler behoben sind.

Durch dieses systematische Vorgehen kann die Code-Basis schrittweise stabilisiert werden.
