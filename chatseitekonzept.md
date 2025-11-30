1. Was auf der Chat-Seite sein darf
   Nur das hier:
   Chatverlauf (Buchseite)
   Verhaltenssteuerung:
   Rolle / Persona
   Stil
   Kreativität
   Kontextlänge
   Modellwahl
   Chat-Historie:
   als Lesezeichen sichtbar
   History-Overlay / Panel, das sich daraus öffnet
   Eingabefeld + Senden
   Kein Neko, keine Feedback-Formular-Orgie, keine Diskussionskacheln.
2. Gesamtaufbau des Chatfensters (mobil)
   Code kopieren
   Text
   ┌──────────────────────────────┐
   │ Header: Titel + Status │
   ├──────────────────────────────┤
   │ Buchseite: Chat-Verlauf │
   │ (History-Lesezeichen rechts)│
   │ (scrollbar) │
   ├──────────────────────────────┤
   │ Kontextleiste (Verhalten) │
   │ [ Persona ] [ Stil & 🎛 ] [ Modell ▾ ][ ➤ ]
   ├──────────────────────────────┤
   │ Eingabefeld │
   │ [ Schreibe deine Nachricht… ][ ➤ ]
   └──────────────────────────────┘
3. Chat-Historie als Lesezeichen
   3.1 Position & Optik
   Position:
   Am rechten Rand der Buchseite, oberer Bereich, etwa mittig oder leicht oben.
   Über dem Chatverlauf, aber klar an die Seite „angeheftet“.
   Optik:
   Vertikales Lesezeichen, das über den Seitenrand ragt, z. B.:
   schmaler Streifen in Akzentfarbe (dein Tinten-Indigo)
   unten ein dreieckiger Ausschnitt wie bei echten Bookmarks
   kleines Icon, z. B.:
   📄 oder 🔖 oder ein Stapel-Icon
   Hintergrund des Lesezeichens etwas kräftiger als die restliche Seite, damit es auffällt, aber nicht brüllt.
   3.2 Grundverhalten
   Tap auf das Lesezeichen → History-Panel öffnet sich.
   Das Panel fährt von rechts über die Seite (Bottom-Sheet wäre auch möglich, aber Seiten-Panel passt besser zur Buch-Metapher).
   Rückweg: Tap auf Overlay / X-Icon / nach rechts raus wischen → Panel schließt.
4. History-Panel: Inhalt & Aufbau
   Stell dir das wie ein Inhaltsverzeichnis deines Notizbuchs vor.
   4.1 Layout
   Panel von rechts, ca. 80–90 % der Breite auf Mobile:
   Code kopieren
   Text
   ┌──────────────────────────────┐
   │ 🔖 Verläufe [X] │ ← Header
   ├──────────────────────────────┤
   │ Letzte Seiten (Swipe-Stack) │
   │ - Aktueller Chat │
   │ - Vorheriger Chat │
   │ - ... (max. 5) │
   ├──────────────────────────────┤
   │ Alle Chats │
   │ - Titel A (Datum/Zeit) │
   │ - Titel B │
   │ - ... │
   └──────────────────────────────┘
   4.2 Sektion „Letzte Seiten“ (max. 5)
   Das ist dein Swipe-Stack, nur sichtbar:
   Oben eine Liste von max. 5 Chats:
   Aktueller Chat
   davor die letzten 4 anderen
   Jeder Eintrag:
   Titel (z. B. erste User-Nachricht oder manuell vergebener Name)
   Kurze Meta:
   Datum/Zeit der letzten Aktivität
   optional ein kleines Icon für Rolle/Modell (z. B. „Code“, „Beratung“)
   Wenn du per Swipe durch die letzten 5 blätterst, ist diese Liste der visuelle Spiegel davon.
   Tippt man auf einen dieser Einträge:
   activeChatId wird auf diesen Chat gesetzt
   die Chat-Seite aktualisiert sich
   das Panel schließt sich
   4.3 Sektion „Alle Chats“
   Darunter:
   scrollbare Liste aller Chat-Sessions
   Gruppiert z. B. nach Datum („Heute“, „Gestern“, „Letzte 7 Tage“ etc.)
   Jeder Eintrag:
   Titel
   Datum
   ggf. Icon für „Diskussion“ vs normaler Chat
   Tap → springt ebenfalls in den entsprechenden Chat, setzt ihn ggf. in den 5er-Stack.
5. Zusammenspiel mit Swipe-Logik
   Du hattest ja:
   Swipe links → neuer Chat
   Swipe rechts → durch letzte 5 Chats blättern
   Das Lesezeichen-Panel ergänzt das:
   Swipe = schnelles Blättern
   für die letzten 5 Sessions (Seitenstapel)
   Lesezeichen = gezieltes Navigieren
   sowohl in die letzten 5 als auch in die komplette History
   Regeln:
   Immer wenn du per History-Panel zu einem Chat springst:
   dieser Chat landet im 5er-Swipe-Stack (falls noch nicht)
   Wenn du einen sehr alten Chat öffnest:
   er wird an den Anfang des Swipe-Stacks gepackt,
   ggf. fliegt der älteste aus dem 5er-Stack raus.
   So bleiben Swipe & Bookmark konsistent.
6. Kontextleiste bleibt „Verhalten-only“
   Wichtig: Das Lesezeichen ist rein Navigation, keine Option.
   Die Kontextleiste unten behält ihren Fokus:
   Code kopieren
   Text
   [ Persona ] [ Stil: Sachlich | 🎛 ] [ Modell ▾ ][ ➤ ]
   Persona = Rolle / Persona
   Stil = Ton / Art der Antworten
   🎛 Verhalten-Sheet = Kreativität + Kontextlänge
   Modell = Modellwahl
   ➤ = Senden
   History (Lesezeichen) berührt keinen dieser Werte. Kein Memory, kein Neko, kein sonstiger Ballast.
7. Zustände & leere History
   7.1 Wenn es noch keine History gibt
   Beim allerersten Start:
   Lesezeichen ist sichtbar, aber leicht „grau“ oder reduziert.
   Tap → kleines Panel mit Hinweis:
   „Noch keine früheren Chats. Starte eine Unterhaltung, sie erscheint dann hier.“
   Kein leerer Klotz, sondern kurzer Text.
   7.2 Viele alte Chats
   „Alle Chats“-Liste sollte nicht dein Scrollfinger zerbrechen:
   Paginierung / lazy loading
   oder nur die letzten X Tage direkt anzeigen
   Optional: Suchfeld im Panel:
   „Nach Titel / Inhalt suchen“
   (später nice-to-have, muss nicht sofort)
8. Kurzfassung für dein Design-Dokument
   Du kannst das so ins Konzept schreiben:
   Chat-Historie als Lesezeichen
   Die Chat-Seite zeigt am rechten Rand der Buchseite ein vertikales Lesezeichen (🔖) an.
   Tap auf das Lesezeichen öffnet ein seitliches History-Panel:
   Bereich „Letzte Seiten“ (max. 5 Chats, entspricht dem Swipe-Stack).
   Bereich „Alle Chats“ (vollständige History-Liste).
   Auswahl eines Eintrags setzt den aktiven Chat und schließt das Panel. Der gewählte Chat wird in den 5er-Swipe-Stack integriert.
   Die History hat keine eigenen Verhaltensoptionen, sondern dient nur der Navigation. Alle Verhaltens-Einstellungen (Rolle, Stil, Kreativität, Kontextlänge, Modell) bleiben in der Kontextleiste am unteren Rand des Chatfensters.
   So hast du jetzt ein komplettes Bild:
   Chatseite = Buchseite mit Lesezeichen
   Unten: Steuerpult für Verhalten
   Navigation durch Chats = Swipe + Bookmark
