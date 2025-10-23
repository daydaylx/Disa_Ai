/**
 * Neo-Depth Card System Showcase
 * Demonstrates the new card variants, shadows, and glassmorphism effects
 */

import { RoleCard } from "../../components/studio/RoleCard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ModelCard } from "../../components/ui/ModelCard";
import { CATEGORY_KEYS, getCategoryData } from "../../utils/category-mapping";

export default function CardShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-canvas via-surface-base to-surface-subtle p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-text-strong text-4xl font-bold">Neo-Depth Card System</h1>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            Modern card components with enhanced depth, glassmorphism effects, and improved
            interaction states for a premium user experience.
          </p>
        </div>

        {/* Elevation Hierarchy */}
        <section className="space-y-6">
          <h2 className="text-text-strong text-2xl font-semibold">Elevation Hierarchy</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Subtle Cards */}
            <Card elevation="surface-subtle" padding="md">
              <CardHeader>
                <CardTitle className="text-title-base">Subtle Level</CardTitle>
                <CardDescription>
                  Background cards and secondary content with minimal depth.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted">
                  Perfect for grouping related information without competing for attention with
                  primary content.
                </p>
              </CardContent>
            </Card>

            {/* Standard Cards */}
            <Card elevation="raised" padding="md" interactive="gentle">
              <CardHeader>
                <CardTitle className="text-title-base">Standard Level</CardTitle>
                <CardDescription>
                  Default cards for most content with enhanced shadow depth.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted">
                  Interactive cards with gentle hover effects. Hover to see the enhanced 3px lift
                  animation.
                </p>
              </CardContent>
            </Card>

            {/* Prominent Cards */}
            <Card elevation="surface-prominent" padding="md" interactive="dramatic">
              <CardHeader>
                <CardTitle className="text-title-base">Prominent Level</CardTitle>
                <CardDescription>
                  Hero cards and important actions with maximum visual impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted">
                  Dramatic hover effects with 6px lift and scale transformation. Reserved for key
                  interactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Glasmorphism Effects */}
        <section className="space-y-6">
          <h2 className="text-text-strong text-2xl font-semibold">Glasmorphism Variants</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card tone="glass-subtle" elevation="raised" padding="md" interactive="gentle">
              <CardHeader>
                <CardTitle className="text-title-base">Glass Subtle</CardTitle>
                <CardDescription>
                  Light glassmorphism with 85% opacity and subtle blur.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="soft">Modern</Badge>
                  <Badge variant="soft">Accessible</Badge>
                </div>
              </CardContent>
            </Card>

            <Card tone="glass-medium" elevation="raised" padding="md" interactive="gentle">
              <CardHeader>
                <CardTitle className="text-title-base">Glass Medium</CardTitle>
                <CardDescription>
                  Balanced glassmorphism with 70% opacity and medium blur.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="soft">Elegant</Badge>
                  <Badge variant="soft">Balanced</Badge>
                </div>
              </CardContent>
            </Card>

            <Card tone="glass-strong" elevation="raised" padding="md" interactive="gentle">
              <CardHeader>
                <CardTitle className="text-title-base">Glass Strong</CardTitle>
                <CardDescription>
                  Prominent glassmorphism with 60% opacity and strong blur.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="soft">Premium</Badge>
                  <Badge variant="soft">Distinctive</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Enhanced Interactions */}
        <section className="space-y-6">
          <h2 className="text-text-strong text-2xl font-semibold">Enhanced Interaction States</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card elevation="raised" padding="md" interactive="gentle">
              <CardContent className="space-y-2 text-center">
                <div className="text-2xl">🤏</div>
                <h3 className="text-title-sm font-semibold">Gentle</h3>
                <p className="text-xs text-text-muted">3px lift + background</p>
              </CardContent>
            </Card>

            <Card elevation="raised" padding="md" interactive="dramatic">
              <CardContent className="space-y-2 text-center">
                <div className="text-2xl">🚀</div>
                <h3 className="text-title-sm font-semibold">Dramatic</h3>
                <p className="text-xs text-text-muted">6px lift + scale</p>
              </CardContent>
            </Card>

            <Card elevation="raised" padding="md" interactive="press">
              <CardContent className="space-y-2 text-center">
                <div className="text-2xl">👆</div>
                <h3 className="text-title-sm font-semibold">Press</h3>
                <p className="text-xs text-text-muted">Active down state</p>
              </CardContent>
            </Card>

            <Card elevation="raised" padding="md" interactive="glow">
              <CardContent className="space-y-2 text-center">
                <div className="text-2xl">✨</div>
                <h3 className="text-title-sm font-semibold">Glow</h3>
                <p className="text-xs text-text-muted">Brand glow effect</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Intent-based Glow Effects */}
        <section className="space-y-6">
          <h2 className="text-text-strong text-2xl font-semibold">Intent-based Glow Effects</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card elevation="raised" padding="md" interactive="glow" intent="primary">
              <CardContent className="space-y-2 text-center">
                <div className="text-brand text-2xl">🔵</div>
                <h3 className="text-title-sm font-semibold">Brand Glow</h3>
                <p className="text-xs text-text-muted">Primary actions</p>
              </CardContent>
            </Card>

            <Card elevation="raised" padding="md" interactive="glow-success" intent="success">
              <CardContent className="space-y-2 text-center">
                <div className="text-2xl text-status-success">✅</div>
                <h3 className="text-title-sm font-semibold">Success Glow</h3>
                <p className="text-xs text-text-muted">Positive states</p>
              </CardContent>
            </Card>

            <Card elevation="raised" padding="md" interactive="glow-warning" intent="warning">
              <CardContent className="space-y-2 text-center">
                <div className="text-2xl text-status-warning">⚠️</div>
                <h3 className="text-title-sm font-semibold">Warning Glow</h3>
                <p className="text-xs text-text-muted">Caution states</p>
              </CardContent>
            </Card>

            <Card elevation="raised" padding="md" interactive="glow-error" intent="error">
              <CardContent className="space-y-2 text-center">
                <div className="text-status-error text-2xl">❌</div>
                <h3 className="text-title-sm font-semibold">Error Glow</h3>
                <p className="text-xs text-text-muted">Error states</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Real-world Example Cards */}
        <section className="space-y-6">
          <h2 className="text-text-strong text-2xl font-semibold">Real-world Examples</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Enhanced MessageBubble Style */}
            <Card
              tone="glass-subtle"
              elevation="raised"
              padding="md"
              interactive="gentle"
              className="border-l-brand border-l-4"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-brand/20 flex h-6 w-6 items-center justify-center rounded-full">
                    <span className="text-brand text-xs font-semibold">🤖</span>
                  </div>
                  <Badge variant="soft" size="sm">
                    Assistant
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-text-secondary">
                  This is an example of how the enhanced MessageBubbleCard would look with
                  glassmorphism background, colored accent border, and clear role indication.
                </p>
              </CardContent>
            </Card>

            {/* Enhanced ModelCard Style */}
            <Card
              elevation="surface-prominent"
              padding="md"
              interactive="dramatic"
              intent="primary"
              state="selected"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                      <span className="text-sm font-semibold text-white">AI</span>
                    </div>
                    <Badge size="xs" variant="brand" className="absolute -right-1 -top-1">
                      ★
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-title-base text-text-strong font-semibold">
                      Claude 3.5 Sonnet
                    </h3>
                    <p className="text-sm text-text-muted">Anthropic</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed text-text-secondary">
                  High-performance model with enhanced reasoning capabilities and extensive context
                  window.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline" size="sm">
                      200K context
                    </Badge>
                    <Badge variant="soft" size="sm">
                      👁️ Vision
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm text-text-muted">$3/$15</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">
                  Selected
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Category Color System */}
        <section className="space-y-6">
          <h2 className="text-text-strong text-2xl font-semibold">Category Color System</h2>
          <p className="max-w-3xl text-text-secondary">
            Subtle, accessible category colors with low saturation and consistent luminance. Each
            category gets a unique hue with inside borders, surface tints, and color-coded badges.
          </p>

          {/* Category Color Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_KEYS.map((key: string) => {
              const categoryData = getCategoryData(key);
              return (
                <Card
                  key={key}
                  data-cat={key}
                  elevation="raised"
                  padding="md"
                  interactive="gentle"
                  className="category-border category-tint category-focus"
                >
                  <CardContent className="space-y-3 text-center">
                    <div className="text-2xl">{categoryData.icon}</div>
                    <h3 className="text-title-sm font-semibold">{categoryData.label}</h3>
                    <div className="flex items-center justify-center">
                      <span className="category-badge inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium uppercase tracking-wide">
                        <span className="category-dot h-1.5 w-1.5 rounded-full" />
                        {key}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Real Category Examples */}
          <div className="space-y-4">
            <h3 className="text-text-strong text-xl font-semibold">Real-world Examples</h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* RoleCard Examples */}
              <div className="space-y-4">
                <h4 className="text-text-strong font-medium">Role Cards with Categories</h4>
                <div className="space-y-3">
                  <RoleCard
                    title="Content Creator Assistant"
                    description="Hilft beim Erstellen von kreativen Inhalten für Social Media, Blogs und Marketing."
                    category="Kreativ & Unterhaltung"
                    badge="Kreativ"
                  />
                  <RoleCard
                    title="Business Strategy Advisor"
                    description="Unterstützt bei strategischen Geschäftsentscheidungen und Marktanalysen."
                    category="Business & Karriere"
                    badge="Professional"
                  />
                </div>
              </div>

              {/* ModelCard Examples */}
              <div className="space-y-4">
                <h4 className="text-text-strong font-medium">Model Cards with Categories</h4>
                <div className="space-y-3">
                  <ModelCard
                    id="claude-premium"
                    name="Claude 3.5 Sonnet"
                    provider="Anthropic"
                    priceIn={3.0}
                    priceOut={15.0}
                    contextTokens={200000}
                    description="High-performance model with enhanced reasoning capabilities."
                    providerTier="premium"
                    isSelected={false}
                    isOpen={false}
                    onSelect={() => {}}
                    onToggleDetails={() => {}}
                  />
                  <ModelCard
                    id="gpt-basic"
                    name="GPT-4o Mini"
                    provider="OpenAI"
                    priceIn={0.15}
                    priceOut={0.6}
                    contextTokens={128000}
                    description="Affordable model for everyday tasks and quick interactions."
                    providerTier="free"
                    isSelected={false}
                    isOpen={false}
                    onSelect={() => {}}
                    onToggleDetails={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance & Accessibility Notes */}
        <section className="space-y-4">
          <Card tone="muted" padding="lg">
            <CardHeader>
              <CardTitle className="text-title-lg">Implementation Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <h4 className="text-text-strong mb-2 font-semibold">Performance</h4>
                  <ul className="space-y-1 text-sm text-text-secondary">
                    <li>• GPU-accelerated transforms for smooth animations</li>
                    <li>• CSS containment to prevent layout thrashing</li>
                    <li>• Backdrop-filter gracefully degrades on older browsers</li>
                    <li>• Motion-safe prefixes respect user preferences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-text-strong mb-2 font-semibold">Accessibility</h4>
                  <ul className="space-y-1 text-sm text-text-secondary">
                    <li>• WCAG AA contrast ratios maintained on all backgrounds</li>
                    <li>• Touch targets meet 44px minimum requirement</li>
                    <li>• Focus indicators enhanced for better visibility</li>
                    <li>• Reduced motion alternatives available</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-text-strong mb-2 font-semibold">Category System</h4>
                  <ul className="space-y-1 text-sm text-text-secondary">
                    <li>• HSL color variables for dynamic theming</li>
                    <li>• Low saturation (14-22%) for subtlety</li>
                    <li>• 8 distinct category hues, min 40° apart</li>
                    <li>• Alpha compositing for glass morphism integration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
