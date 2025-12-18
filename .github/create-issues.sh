#!/bin/bash

# GitHub Issues automatisch erstellen
# Voraussetzung: GitHub CLI (gh) installiert und authentifiziert

set -e

REPO="daydaylx/Disa_Ai"

echo "🚀 Erstelle GitHub Issues für $REPO..."
echo ""

# Issue 1: Rename Bookmark Labels
echo "📝 Issue 1: Chat-Historie umbenennen..."
gh issue create \
  --repo "$REPO" \
  --title "Chat-Historie umbenennen: „Lesezeichen/Bookmark" ist veraltet" \
  --body-file ".github/ISSUE_TEMPLATES/issue-1-rename-bookmark-labels.md" \
  --label "ui,ux,cleanup,good first issue"

# Issue 2: OpenRouter Free Models
echo "📝 Issue 2: OpenRouter Free-Modelle laden..."
gh issue create \
  --repo "$REPO" \
  --title "OpenRouter Modell-Liste fixen: Free-Modelle vollständig laden statt nur 6" \
  --body-file ".github/ISSUE_TEMPLATES/issue-2-openrouter-free-models.md" \
  --label "bug,api,enhancement,high priority"

# Issue 3: Settings Separation
echo "📝 Issue 3: Settings aufräumen..."
gh issue create \
  --repo "$REPO" \
  --title "Settings aufräumen: „KI-Verhalten" getrennt von „Darstellung"" \
  --body-file ".github/ISSUE_TEMPLATES/issue-3-settings-separation.md" \
  --label "ui,ux,refactor"

# Issue 4: Memory Default Enabled
echo "📝 Issue 4: Gedächtnisfunktion Default..."
gh issue create \
  --repo "$REPO" \
  --title "Gedächtnisfunktion: Default = aktiviert (mit sauberem Fallback)" \
  --body-file ".github/ISSUE_TEMPLATES/issue-4-memory-default-enabled.md" \
  --label "enhancement,behavior,settings"

# Issue 5: Unique Role Icons
echo "📝 Issue 5: Rollen Icons individualisieren..."
gh issue create \
  --repo "$REPO" \
  --title "Rollen Icons diversifizieren: jede Rolle bekommt eigenes Icon" \
  --body-file ".github/ISSUE_TEMPLATES/issue-5-unique-role-icons.md" \
  --label "ui,ux,enhancement"

# Issue 6: Role Icons Colors (Bonus)
echo "📝 Issue 6: Rollen-Icons Farben (Bonus)..."
gh issue create \
  --repo "$REPO" \
  --title "Bonus: Rollen-Icons farblich an Chat-Icon-System anlehnen" \
  --body-file ".github/ISSUE_TEMPLATES/issue-6-role-icons-colors.md" \
  --label "ui,ux,polish,nice to have"

echo ""
echo "✅ Alle Issues erfolgreich erstellt!"
echo ""
echo "🔗 Siehe: https://github.com/$REPO/issues"
