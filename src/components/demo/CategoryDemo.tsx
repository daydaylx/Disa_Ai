import { CATEGORY_KEYS, getCategoryData } from "../../utils/category-mapping";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Chip } from "../ui/chip";

/**
 * Demo component to test category color implementation
 * Shows current token usage, badge variants, and chip examples
 */
export function CategoryDemo() {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold mb-2">Kategorie-Farbsystem Demo</h1>
        <p className="text-text-secondary">
          Test der aktuellen Implementierung von Kategorie-Farben, Chips und Badges
        </p>
      </div>

      {/* Current Legacy System Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Legacy System (Aktuelle Implementierung)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORY_KEYS.map((categoryKey) => {
            const categoryData = getCategoryData(categoryKey);
            return (
              <Card
                key={categoryKey}
                data-cat={categoryKey}
                className="category-border category-tint category-focus p-4 space-y-3"
                padding="md"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryData.icon}</span>
                  <h3 className="font-medium">{categoryData.label}</h3>
                </div>

                {/* Category Badge (current implementation) */}
                <div className="space-y-2">
                  <span className="category-badge inline-flex items-center gap-2 rounded-full border border-white/30 font-semibold uppercase tracking-wide px-2 py-0.5 text-[10px]">
                    <span className="category-dot rounded-full h-1.5 w-1.5" />
                    {categoryData.label}
                  </span>
                </div>

                {/* Standard Badge variants for comparison */}
                <div className="flex flex-wrap gap-1">
                  <Badge variant="default" size="xs">
                    {categoryKey}
                  </Badge>
                  <Badge variant="secondary" size="xs">
                    {categoryKey}
                  </Badge>
                  <Badge variant="outline" size="xs">
                    {categoryKey}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* New Chip Component Demo */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Neue Chip-Komponente (Mit Tonal-Skalen)</h2>
        <div className="space-y-6">
          {/* Chip variants for each category */}
          {CATEGORY_KEYS.map((categoryKey) => {
            const categoryData = getCategoryData(categoryKey);
            return (
              <div key={`chip-${categoryKey}`} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryData.icon}</span>
                  <h3 className="font-medium">{categoryData.label}</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Chip variant="subtle" category={categoryKey} showIcon>
                      Subtle
                    </Chip>
                    <Chip variant="outline" category={categoryKey} showDot>
                      Outline
                    </Chip>
                    <Chip variant="filled" category={categoryKey}>
                      Filled
                    </Chip>
                    <Chip variant="soft" category={categoryKey} showDot>
                      Soft
                    </Chip>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Chip variant="subtle" category={categoryKey} size="xs">
                      XS
                    </Chip>
                    <Chip variant="subtle" category={categoryKey} size="sm">
                      SM
                    </Chip>
                    <Chip variant="subtle" category={categoryKey} size="md">
                      MD
                    </Chip>
                    <Chip variant="subtle" category={categoryKey} size="lg">
                      LG
                    </Chip>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Chip
                      variant="outline"
                      category={categoryKey}
                      removable
                      onRemove={() => console.log(`Remove ${categoryKey}`)}
                    >
                      Removable
                    </Chip>
                    <Chip variant="subtle" category={categoryKey} showIcon showDot>
                      Icon + Dot
                    </Chip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* New Tonal Scale System Preview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tonal-Skalen Übersicht</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORY_KEYS.map((categoryKey) => {
            const categoryData = getCategoryData(categoryKey);
            return (
              <div key={`tonal-${categoryKey}`} className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{categoryData.icon}</span>
                  <h3 className="font-medium">{categoryData.label}</h3>
                </div>

                {/* Tonal scale preview */}
                <div className="flex rounded-lg overflow-hidden h-16 border">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((level) => (
                    <div
                      key={level}
                      className="flex-1 flex items-end justify-center text-[8px] font-mono pb-1"
                      style={{
                        backgroundColor: `var(--role-accent-${categoryKey}-${level})`,
                        color:
                          level >= 500
                            ? `var(--role-accent-${categoryKey}-50)`
                            : `var(--role-accent-${categoryKey}-900)`,
                      }}
                    >
                      {level}
                    </div>
                  ))}
                </div>

                {/* Sample chips using tonal tokens */}
                <div className="space-y-2">
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border"
                    style={{
                      backgroundColor: `var(--role-accent-${categoryKey}-chip-bg)`,
                      color: `var(--role-accent-${categoryKey}-chip-text)`,
                      borderColor: `var(--role-accent-${categoryKey}-chip-border)`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: `var(--role-accent-${categoryKey}-500)` }}
                    />
                    {categoryData.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Color Contrast Test Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Kontrast-Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORY_KEYS.slice(0, 4).map((categoryKey) => {
            const categoryData = getCategoryData(categoryKey);
            return (
              <div key={`contrast-${categoryKey}`} className="space-y-2">
                <h4 className="font-medium">{categoryData.label}</h4>
                <div className="space-y-1">
                  {/* Test different combinations */}
                  <div
                    className="p-2 rounded text-sm"
                    style={{
                      backgroundColor: `var(--role-accent-${categoryKey}-100)`,
                      color: `var(--role-accent-${categoryKey}-900)`,
                    }}
                  >
                    Light bg / Dark text (empfohlen für Chips)
                  </div>
                  <div
                    className="p-2 rounded text-sm"
                    style={{
                      backgroundColor: `var(--role-accent-${categoryKey}-500)`,
                      color: `var(--role-accent-${categoryKey}-50)`,
                    }}
                  >
                    Medium bg / Light text
                  </div>
                  <div
                    className="p-2 rounded text-sm"
                    style={{
                      backgroundColor: `var(--role-accent-${categoryKey}-800)`,
                      color: `var(--role-accent-${categoryKey}-100)`,
                    }}
                  >
                    Dark bg / Light text
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Debug Information */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">System Debug</h2>
        <div className="bg-surface-subtle p-4 rounded-lg text-sm font-mono space-y-2">
          <div>
            Theme: <span id="current-theme">Check with DevTools</span>
          </div>
          <div>Verfügbare Token:</div>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Legacy: --cat-{"{category}"}-h/s/l (z.B. --cat-alltag-h)</li>
            <li>
              Tonal: --role-accent-{"{category}"}-{"{50-900}"} (z.B. --role-accent-alltag-500)
            </li>
            <li>Semantic: --role-accent-{"{category}"}-chip-bg/text/border</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default CategoryDemo;
