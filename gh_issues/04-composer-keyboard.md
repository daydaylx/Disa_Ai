## Beschreibung

Beim Öffnen der Bildschirmtastatur darf der Composer nicht springen oder verdeckt werden. Layout muss sich an VisualViewport/VirtualKeyboard-Insets anpassen.

## Akzeptanzkriterien

- Composer bleibt sichtbar, auch bei geöffnetem Keyboard
- Eingabefeld wächst bis N Zeilen, danach Scroll im Nachrichtenbereich
- Nutzung von VisualViewport-Events und `env(keyboard-inset-*)`
- Placeholder mit Starter-Hinweis + Shortcut-Chips oberhalb der Tastatur

## Tasks

- `window.visualViewport.resize/scroll` abfangen
- CSS mit `env(keyboard-inset-bottom)` berücksichtigen
- Sticky-Footer und Scroll-Containment prüfen
