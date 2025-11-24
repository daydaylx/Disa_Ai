1. Executive Summary (Update 24.11.2025)

- ✅ Route `/chat/history` existiert und wird verlinkt; Verlauf ist erreichbar.
- ✅ Retry im Chat ist implementiert (VirtualizedMessageList → erneutes Senden der letzten User-Nachricht).
- ⚠️ Rollen/Settings/Memory: weiterhin unklar, ob `activeRole`, NSFW/Analytics und Memory-Flag in die Prompt-Pipeline einfließen (Codeprüfung noch ausstehend).
- ⚠️ Modelle-Favoriten: Persistenz/Global-Context nicht verifiziert; UI nutzt ggf. lokalen State.
- ⚠️ CustomRolesContext bleibt ungenutzt; Feature scheint weiterhin tot.
- ⚠️ Storage-Migration-UI ist im Settings-Flow eingebunden, aber tatsächliche Nutzung/Status unbekannt.

2. Feature-Matrix
   | Bereich/Seite | Erwartete Funktion | Status (OK/Teil/Missing/Bug) | Fundstelle (Datei:Zeile) | Problemursache | Fix-Vorschlag |
   | --- | --- | --- | --- | --- | --- |
   | Chat Start | Verlauf öffnen | Bug | src/ui/ChatStartCard.tsx:49-52; src/app/router.tsx | Link zeigt auf /chat/history, Route fehlt → Redirect auf Home | Route & View für History ergänzen und useConversationManager nutzen oder Link entfernen, bis Feature fertig |
   | Chat | Nachricht erneut senden | Missing | src/pages/Chat.tsx:151-153 | onRetry nur console.warn, keine Logik | Handler implementieren: letzte User-Nachricht re-append/replay mit useChat, Fehler anzeigen |
   | Chat | Rolle/Settings/Memory anwenden | Missing | src/pages/Chat.tsx:22-25 | activeRole, settings, memory werden zwar geladen, aber nicht genutzt; auto-save läuft immer | System-Prompt aus aktiver Rolle setzen, Memory-Disable als Schalter für ConversationManager speichern, Settings (NSFW/Analytics/Notifications) ins Messaging/Telemetry leiten |
   | Rollen | Aktivierte Rolle steuert Chat | Missing | src/components/roles/EnhancedRolesInterface.tsx:122-167; src/hooks/useRoles.ts:22-90; src/pages/Chat.tsx:22 | RolesPage setzt StudioContext, Chat liest separaten useRoles-State ⇒ Entkoppelung | Chat auf StudioContext umstellen oder eine gemeinsame Role-Selection-Source bereitstellen |
   | Modelle | Favoriten + Persistenz | Teil | src/pages/ModelsPage.tsx:95-157 | Favoriten-Filter arbeitet nur auf lokalem state, kein FavoritesContext/Storage | useFavorites verwenden (toggleModelFavorite/isModelFavorite), Persistenz aktivieren, Filter an globalen State binden |
   | Models (Mobile/Expanded) | EnhancedModelsInterface erreichbar | Missing | src/pages/MobileModels.tsx:3-25; src/app/router.tsx | Seite implementiert, aber nicht geroutet | Route /models/mobile o.ä. hinzufügen oder Seite entfernen, um dead code zu vermeiden |
   | Storage | Migration/Backup UI | Missing | src/components/StorageMigration.tsx:20-223 | Komponente existiert, wird nie gerendert | In Settings „Daten“ integrieren (CTA, Dialog), Statusanzeige aus useStorageMigration anzeigen |
   | Settings | NSFW/Analytics/Notifications/Model greifen | Missing | src/hooks/useSettings.ts:4-88 | Flags werden nur gespeichert, nirgends ausgelesen | Konsum in Chat/Analytics-Layer/Notifications einbauen; preferredModel ans Request-Routing übergeben |
   | Custom Roles | Eigene Rollen speichern | Missing | src/contexts/CustomRolesContext.tsx:1-86 | Context nie verwendet, keine UI/Store-Anbindung | UI/Hooks anbinden oder Kontext entfernen, um klaren Funktionsumfang zu haben |

3. Liste offener Funktionen (priorisiert)

- P0: Chat-Settings (Rolle, Memory, NSFW/Analytics) werden vermutlich nicht angewandt; Prompt-Pipeline prüfen und schließen.
- P1: Rollen-Auswahl könnte weiterhin am falschen Context hängen; Verifikation erforderlich.
- P1: Modelle-Favoriten: Persistenz und geteilter Context sicherstellen.
- P2: CustomRolesContext anbinden oder entfernen.
- P2: StorageMigration: tatsächliche Migration/Health-Checks validieren.

4. Konkrete Fix-Roadmap

1) Chat-History reparieren: Route + View für Verlauf hinzufügen und useConversationManager.openHistory/selectConversation verwenden; Link in ChatStartCard darauf verweisen.
2) Settings wirksam machen: Chat auf StudioContext (aktive Rolle) umstellen, Memory-Flag in useConversationManager respektieren (Autosave nur bei enabled), NSFW/Analytics/Notifications aus useSettings in API/Telemetry layer weiterreichen, preferredModel ans Chat-Request-Model binden.
3) Retry implementieren: onRetry in Chat → letzte User-Message erneut senden (oder Call-ID erneut triggern) und Fehlerhandling anzeigen.
4) Models Favoriten anbinden: ModelsPage auf FavoritesContext umbauen (toggleModelFavorite/isModelFavorite/trackModelUsage) und Persistenz sicherstellen; optional Filter-CTA für „nur Favoriten“ beibehalten.
5) Rollenfluss konsolidieren: useRoles auf StudioContext/RoleStore vereinheitlichen, aktive Rolle in Chat verwenden, Aktivieren in RolesPage/StudioHome auf denselben State schreiben.
6) Dead Code aufräumen oder aktivieren: MobileModels/EnhancedModelsInterface routen oder entfernen; StorageMigration-Komponente in Settings/Data einhängen; CustomRolesContext entweder anbinden (UI + Persistenz) oder löschen.
7) Regression-Checks: npm run verify & e2e (settings/models/roles) nach jedem Schritt, zusätzlich manuelles QA: Verlauf öffnen, Retry, Favoriten-Persistenz, Settings-Wirkung.
