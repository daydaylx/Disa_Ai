# GitHub Issues - Erstellungsanleitung

Ich habe 6 Issue-Templates für dich erstellt. Du hast zwei Möglichkeiten, diese Issues zu erstellen:

## Option 1: Manuell über GitHub Web-Interface

Gehe zu: https://github.com/daydaylx/Disa_Ai/issues/new

Für jedes Issue:

1. **Issue 1: Chat-Historie umbenennen**
   - Kopiere Inhalt aus: `.github/ISSUE_TEMPLATES/issue-1-rename-bookmark-labels.md`
   - Labels: `ui`, `ux`, `cleanup`, `good first issue`

2. **Issue 2: OpenRouter Free-Modelle vollständig laden**
   - Kopiere Inhalt aus: `.github/ISSUE_TEMPLATES/issue-2-openrouter-free-models.md`
   - Labels: `bug`, `api`, `enhancement`, `high priority`

3. **Issue 3: Settings aufräumen**
   - Kopiere Inhalt aus: `.github/ISSUE_TEMPLATES/issue-3-settings-separation.md`
   - Labels: `ui`, `ux`, `refactor`

4. **Issue 4: Gedächtnisfunktion Default aktivieren**
   - Kopiere Inhalt aus: `.github/ISSUE_TEMPLATES/issue-4-memory-default-enabled.md`
   - Labels: `enhancement`, `behavior`, `settings`

5. **Issue 5: Rollen Icons individualisieren**
   - Kopiere Inhalt aus: `.github/ISSUE_TEMPLATES/issue-5-unique-role-icons.md`
   - Labels: `ui`, `ux`, `enhancement`

6. **Issue 6 (Bonus): Rollen-Icons farblich gestalten**
   - Kopiere Inhalt aus: `.github/ISSUE_TEMPLATES/issue-6-role-icons-colors.md`
   - Labels: `ui`, `ux`, `polish`, `nice to have`

## Option 2: Mit GitHub CLI (automatisch)

Falls du GitHub CLI installiert hast, führe einfach aus:

```bash
bash .github/create-issues.sh
```

Das Skript erstellt alle 6 Issues automatisch.

### GitHub CLI installieren (falls noch nicht vorhanden)

**Linux (Debian/Ubuntu):**

```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y
```

**macOS:**

```bash
brew install gh
```

**Authentifizierung:**

```bash
gh auth login
```

## Zusammenfassung der Issues

| #   | Titel                                                     | Priorität | Labels                               |
| --- | --------------------------------------------------------- | --------- | ------------------------------------ |
| 1   | Chat-Historie umbenennen: „Lesezeichen/Bookmark" veraltet | Normal    | ui, ux, cleanup, good first issue    |
| 2   | OpenRouter: Nur 6 statt alle Free-Modelle geladen         | Hoch      | bug, api, enhancement, high priority |
| 3   | Settings: „KI-Verhalten" und „Darstellung" trennen        | Normal    | ui, ux, refactor                     |
| 4   | Gedächtnisfunktion standardmäßig aktivieren               | Normal    | enhancement, behavior, settings      |
| 5   | Rollen-Icons: Jede Rolle eigenes Icon                     | Normal    | ui, ux, enhancement                  |
| 6   | Bonus: Rollen-Icons farblich wie Chat-Icons               | Niedrig   | ui, ux, polish, nice to have         |
