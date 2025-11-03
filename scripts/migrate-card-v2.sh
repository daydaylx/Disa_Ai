#!/bin/bash

# Card v2.0.0 Migration Script
# Automatische Migration von Card v1.x zu v2.0.0

echo "🚀 Card v2.0.0 Migration Script gestartet..."
echo "============================================"

# Backup erstellen
echo "📦 Erstelle Backup..."
backup_dir="./backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"
cp -r src "$backup_dir/"
echo "✅ Backup erstellt in: $backup_dir"

# Zähler für Änderungen
depth_changes=0
interactive_changes=0
elevation_changes=0

echo ""
echo "🔄 Beginne Migration..."

# 1. Depth Props entfernen und durch elevation ersetzen
echo "  🎯 Migrating depth props..."

# depth="depth-1" → elevation="subtle"
depth_changes=$((depth_changes + $(find src -name "*.tsx" -type f -exec sed -i 's/depth="depth-1"/elevation="subtle"/g' {} + && grep -r 'elevation="subtle"' src --include="*.tsx" | wc -l)))

# depth="depth-2" → elevation="medium"
depth_changes=$((depth_changes + $(find src -name "*.tsx" -type f -exec sed -i 's/depth="depth-2"/elevation="medium"/g' {} + && grep -r 'elevation="medium"' src --include="*.tsx" | wc -l)))

# depth="depth-3" → elevation="raised"
depth_changes=$((depth_changes + $(find src -name "*.tsx" -type f -exec sed -i 's/depth="depth-3"/elevation="raised"/g' {} + && grep -r 'elevation="raised"' src --include="*.tsx" | wc -l)))

# depth="depth-6" → elevation="dramatic"
depth_changes=$((depth_changes + $(find src -name "*.tsx" -type f -exec sed -i 's/depth="depth-6"/elevation="dramatic"/g' {} + && grep -r 'elevation="dramatic"' src --include="*.tsx" | wc -l)))

# Übrige depth props entfernen (ohne replacement)
find src -name "*.tsx" -type f -exec sed -i '/depth="[^"]*"/d' {} +

echo "    ✅ $depth_changes depth props migriert"

# 2. Interactive variants aktualisieren
echo "  🎯 Migrating interactive variants..."

# neo-gentle → gentle
interactive_changes=$((interactive_changes + $(find src -name "*.tsx" -type f -exec sed -i 's/interactive="neo-gentle"/interactive="gentle"/g' {} + && grep -r 'interactive="gentle"' src --include="*.tsx" | wc -l)))

# neo-dramatic → dramatic
interactive_changes=$((interactive_changes + $(find src -name "*.tsx" -type f -exec sed -i 's/interactive="neo-dramatic"/interactive="dramatic"/g' {} + && grep -r 'interactive="dramatic"' src --include="*.tsx" | wc -l)))

echo "    ✅ $interactive_changes interactive variants migriert"

# 3. Elevation variants aktualisieren
echo "  🎯 Migrating elevation variants..."

# surface → medium
elevation_changes=$((elevation_changes + $(find src -name "*.tsx" -type f -exec sed -i 's/elevation="surface"/elevation="medium"/g' {} + && grep -r 'elevation="medium"' src --include="*.tsx" | wc -l)))

# surface-prominent → dramatic
elevation_changes=$((elevation_changes + $(find src -name "*.tsx" -type f -exec sed -i 's/elevation="surface-prominent"/elevation="dramatic"/g' {} + && grep -r 'elevation="dramatic"' src --include="*.tsx" | wc -l)))

echo "    ✅ $elevation_changes elevation variants migriert"

# 4. Tone variants bereinigen (Falls noch alte vorhanden)
echo "  🎯 Cleaning up old tone variants..."

# default → neo-raised
find src -name "*.tsx" -type f -exec sed -i 's/tone="default"/tone="neo-raised"/g' {} +

echo "    ✅ Tone variants bereinigt"

echo ""
echo "🧪 Validierung..."

# TypeScript Check
echo "  🔍 TypeScript Validation..."
if npm run typecheck --silent; then
    echo "    ✅ TypeScript Compilation erfolgreich"
else
    echo "    ⚠️  TypeScript Compilation Fehler - manuelle Nachbearbeitung erforderlich"
fi

# Summary
echo ""
echo "📊 Migration Summary:"
echo "===================="
echo "  • Depth props migriert: $depth_changes"
echo "  • Interactive variants migriert: $interactive_changes"
echo "  • Elevation variants migriert: $elevation_changes"
echo "  • Backup verfügbar in: $backup_dir"

echo ""
echo "🎉 Card v2.0.0 Migration abgeschlossen!"
echo ""
echo "📋 Nächste Schritte:"
echo "  1. npm run typecheck - Prüfe auf verbleibende Fehler"
echo "  2. npm run dev - Teste die Anwendung"
echo "  3. npm run storybook - Visueller Review"
echo "  4. Lösche Backup wenn alles funktioniert: rm -rf $backup_dir"
echo ""
echo "📖 Vollständige Dokumentation: docs/CARD_V2_MIGRATION_GUIDE.md"