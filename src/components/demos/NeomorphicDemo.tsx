/**
 * Neomorphism Demo Component
 *
 * Showcases the new neomorphic design system components
 * For testing and demonstration purposes
 */

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CrossComponentDemo } from "./CrossComponentDemo";
import { UniversalStateDemo } from "./UniversalStateDemo";

export function NeomorphicDemo() {
  return (
    <div className="p-8 space-y-8 bg-surface-base min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">🎨 Neomorphism (Soft UI) Demo</h1>

        {/* Button Variants Demo */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Button Variants</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Traditional vs Neomorphic */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-text-secondary">Traditional</h3>
              <Button variant="default">Default</Button>
              <Button variant="brand">Brand</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-text-secondary">Neomorphic</h3>
              <Button variant="neumorphic">Neumorphic</Button>
              <Button variant="neumorphic" size="sm">
                Small
              </Button>
              <Button variant="neumorphic" size="lg">
                Large
              </Button>
              <Button variant="neumorphic" disabled>
                Disabled
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-text-secondary">Utility Classes</h3>
              <button className="neo-raised px-4 py-2 rounded-lg">.neo-raised</button>
              <button className="neo-pressed px-4 py-2 rounded-lg">.neo-pressed</button>
              <button className="neo-flat px-4 py-2 rounded-lg">.neo-flat</button>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-text-secondary">Sizes</h3>
              <button className="neo-raised-sm px-3 py-1 rounded-md text-sm">Small</button>
              <button className="neo-raised px-4 py-2 rounded-lg">Medium</button>
              <button className="neo-raised-lg px-6 py-3 rounded-xl text-lg">Large</button>
            </div>
          </div>
        </section>

        {/* Card Examples */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Card Examples</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Traditional Card Tones */}
            <Card tone="default" padding="md">
              <h3 className="font-semibold mb-2">Default Card</h3>
              <p className="text-text-secondary text-sm">
                Traditional card with standard elevation and colors.
              </p>
            </Card>

            <Card tone="muted" padding="md">
              <h3 className="font-semibold mb-2">Muted Card</h3>
              <p className="text-text-secondary text-sm">
                Subtle background for secondary content.
              </p>
            </Card>

            <Card tone="translucent" padding="md">
              <h3 className="font-semibold mb-2">Translucent Card</h3>
              <p className="text-text-secondary text-sm">Glass-like effect with backdrop blur.</p>
            </Card>

            {/* New Neomorphic Card Tones */}
            <Card tone="neumorphic" padding="md" elevation="depth-2">
              <h3 className="font-semibold mb-2">🎨 Neomorphic Card</h3>
              <p className="text-text-secondary text-sm">
                New soft UI card tone with dual-directional shadows.
              </p>
            </Card>

            <Card tone="neumorphic" padding="md" elevation="depth-4" interactive="gentle">
              <h3 className="font-semibold mb-2">🚀 Interactive Neumorphic</h3>
              <p className="text-text-secondary text-sm">
                Hover me! Interactive neomorphic card with gentle animation.
              </p>
            </Card>

            <Card tone="neumorphic" padding="md" elevation="depth-3" interactive="press">
              <h3 className="font-semibold mb-2">👆 Press Effect</h3>
              <p className="text-text-secondary text-sm">
                Click me! Neomorphic card with press interaction.
              </p>
            </Card>
          </div>

          {/* Utility Class Examples */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="neo-card-base">
              <h3 className="font-semibold mb-2">Utility: .neo-card-base</h3>
              <p className="text-text-secondary text-sm">
                Direct utility class approach for simple neomorphic cards.
              </p>
            </div>

            <div className="neo-raised-lg p-6 rounded-2xl">
              <h3 className="font-semibold mb-2">Utility: .neo-raised-lg</h3>
              <p className="text-text-secondary text-sm">
                Large raised effect with pronounced depth.
              </p>
            </div>

            <div className="neo-pressed-subtle p-6 rounded-2xl">
              <h3 className="font-semibold mb-2">Utility: .neo-pressed-subtle</h3>
              <p className="text-text-secondary text-sm">
                Subtle inset effect for input-like appearance.
              </p>
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Form Elements</h2>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Neomorphic Input
              </label>
              <input
                type="text"
                placeholder="Type something..."
                className="neo-input-base w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Pressed Strong Input
              </label>
              <input
                type="text"
                placeholder="Type something..."
                className="neo-pressed-strong w-full p-3 rounded-lg"
              />
            </div>

            <div className="flex gap-4">
              <Button variant="neumorphic">Submit</Button>
              <Button variant="neumorphic" disabled>
                Cancel
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Examples */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Interactive States</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Hover States</h3>
              <p className="text-sm text-text-secondary mb-4">
                Hover over these elements to see the interactive states:
              </p>

              <div className="space-y-3">
                <button className="neo-raised p-4 rounded-xl w-full text-left hover:transform">
                  Hover for lift effect
                </button>
                <button className="neo-pressed p-4 rounded-xl w-full text-left">
                  Hover for release effect
                </button>
                <button className="neo-flat p-4 rounded-xl w-full text-left">
                  Hover for raise effect
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Focus States</h3>
              <p className="text-sm text-text-secondary mb-4">
                Tab to these elements to see focus states:
              </p>

              <div className="space-y-3">
                <button className="neo-raised p-4 rounded-xl w-full text-left focus-visible:outline-none">
                  Focusable button
                </button>
                <input
                  type="text"
                  placeholder="Focus me"
                  className="neo-input-base w-full focus-visible:outline-none"
                />
                <Button variant="neumorphic" className="w-full">
                  Neumorphic Focus
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3: Dialog & Modal Variants */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Dialog & Modal Variants (Phase 3)
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Dialog Variants</h3>
              <div className="space-y-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="neumorphic">Default Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Default Dialog</DialogTitle>
                      <DialogDescription>
                        Standard dialog with regular styling for comparison.
                      </DialogDescription>
                    </DialogHeader>
                    <p className="text-text-secondary">
                      This is the default dialog implementation with standard overlay and content
                      styling.
                    </p>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="neumorphic">Neumorphic Dialog</Button>
                  </DialogTrigger>
                  <DialogContent variant="neumorphic" overlayVariant="neumorphic">
                    <DialogHeader>
                      <DialogTitle>🎨 Neumorphic Dialog</DialogTitle>
                      <DialogDescription>
                        Soft UI dialog with dual-directional shadows and floating effect.
                      </DialogDescription>
                    </DialogHeader>
                    <p className="text-text-secondary">
                      This dialog uses neomorphic styling with soft backdrop blur and elevated
                      content surfaces.
                    </p>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="glass">Glass Dialog</Button>
                  </DialogTrigger>
                  <DialogContent variant="glass" overlayVariant="glass">
                    <DialogHeader>
                      <DialogTitle>✨ Glass Dialog</DialogTitle>
                      <DialogDescription>
                        Glassmorphism effect with backdrop blur and transparency.
                      </DialogDescription>
                    </DialogHeader>
                    <p className="text-text-secondary">
                      Glass-like effect with enhanced backdrop blur and translucent surfaces.
                    </p>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="elevated">Floating Dialog</Button>
                  </DialogTrigger>
                  <DialogContent variant="floating" overlayVariant="soft">
                    <DialogHeader>
                      <DialogTitle>🚀 Floating Dialog</DialogTitle>
                      <DialogDescription>
                        Enhanced elevation with hover effects and depth.
                      </DialogDescription>
                    </DialogHeader>
                    <p className="text-text-secondary">
                      Floating effect with enhanced shadows and subtle hover interactions.
                    </p>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Dialog Features</h3>
              <div className="neo-card-base">
                <h4 className="font-semibold mb-3">🎯 Enhanced Features</h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Soft backdrop blur with neomorphic overlay</li>
                  <li>• Multiple variant support (neumorphic, glass, floating)</li>
                  <li>• Enhanced close button with neomorphic styling</li>
                  <li>• Configurable size and padding options</li>
                  <li>• Smooth animations with depth transitions</li>
                  <li>• Accessibility compliant keyboard navigation</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3: Badge & Chip Variants */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">
            Badge & Chip Variants (Phase 3)
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Standard Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="muted">Muted</Badge>
                <Badge variant="brand">Brand</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Neomorphic Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="neumorphic">Neumorphic</Badge>
                <Badge variant="neumorphic-brand">Brand</Badge>
                <Badge variant="neumorphic-success">Success</Badge>
                <Badge variant="neumorphic-warning">Warning</Badge>
                <Badge variant="neumorphic-error">Error</Badge>
                <Badge variant="neumorphic-pressed">Pressed</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Badge Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="neumorphic" size="xs">
                  Extra Small
                </Badge>
                <Badge variant="neumorphic" size="sm">
                  Small
                </Badge>
                <Badge variant="neumorphic" size="md">
                  Medium
                </Badge>
                <Badge variant="neumorphic" size="lg">
                  Large
                </Badge>
              </div>
            </div>
          </div>

          <div className="neo-card-base">
            <h4 className="font-semibold mb-3">🏷️ Badge Features</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">🎨 Visual Features</h5>
                <ul className="space-y-1 text-text-secondary">
                  <li>• Dual-directional neomorphic shadows</li>
                  <li>• Soft raised and pressed states</li>
                  <li>• Color-coded variants with glow effects</li>
                  <li>• Smooth hover transitions</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">⚡ Interactive Features</h5>
                <ul className="space-y-1 text-text-secondary">
                  <li>• Shadow transitions on hover</li>
                  <li>• Multiple size options (xs, sm, md, lg)</li>
                  <li>• Status-specific glow colors</li>
                  <li>• Consistent with design system</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3: Navigation Examples */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Navigation Variants (Phase 3)</h2>

          <div className="space-y-6">
            <div className="neo-card-base">
              <h4 className="font-semibold mb-3">🧭 Navigation Features</h4>
              <p className="text-text-secondary text-sm mb-4">
                Navigation components now support multiple variants for different visual styles and
                interaction patterns.
              </p>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">🎨 GlobalNav Variants</h5>
                  <ul className="space-y-1 text-text-secondary">
                    <li>
                      • <code>default</code> - Standard header styling
                    </li>
                    <li>
                      • <code>neumorphic</code> - Soft UI with dual shadows
                    </li>
                    <li>
                      • <code>glass</code> - Glassmorphism with backdrop blur
                    </li>
                    <li>
                      • <code>floating</code> - Elevated with hover effects
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">📱 MobileNavigation Variants</h5>
                  <ul className="space-y-1 text-text-secondary">
                    <li>
                      • <code>default</code> - Standard bottom navigation
                    </li>
                    <li>
                      • <code>neumorphic</code> - Soft raised nav items
                    </li>
                    <li>
                      • <code>glass</code> - Translucent with blur effects
                    </li>
                    <li>
                      • <code>floating</code> - Floating active indicators
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-surface-subtle/50 rounded-lg">
                <p className="text-xs text-text-secondary">
                  <strong>Usage:</strong>{" "}
                  <code>{'<GlobalNav variant="neumorphic" onMenuClick={...} />'}</code>
                  <br />
                  <strong>Usage:</strong> <code>{'<MobileNavigation variant="glass" />'}</code>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 4: Universal State System */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">
            🚀 Phase 4: States & Interactions (NEW)
          </h2>

          <div className="neo-card-base">
            <h3 className="font-semibold mb-4">✨ Universal State System</h3>
            <p className="text-text-secondary text-sm mb-4">
              Advanced state management and interaction patterns with enhanced accessibility and
              performance-optimized animations.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">🎭 State Management</h4>
                <ul className="space-y-1 text-text-secondary">
                  <li>• Universal UI state hook</li>
                  <li>• Automatic data attributes</li>
                  <li>• Built-in event handlers</li>
                  <li>• State synchronization</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">🔗 Cross-Component</h4>
                <ul className="space-y-1 text-text-secondary">
                  <li>• Coordinated interactions</li>
                  <li>• Responsive patterns</li>
                  <li>• Event cascading</li>
                  <li>• Group state management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">⚡ Performance</h4>
                <ul className="space-y-1 text-text-secondary">
                  <li>• GPU acceleration</li>
                  <li>• Motion preferences</li>
                  <li>• Animation batching</li>
                  <li>• Performance monitoring</li>
                </ul>
              </div>
            </div>
          </div>

          <UniversalStateDemo />
        </section>

        {/* Phase 4: Cross-Component Interactions */}
        <section className="space-y-6">
          <CrossComponentDemo />
        </section>

        {/* Phase 4: Performance Demo */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Performance Optimizations</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="neo-card-base">
              <h3 className="font-semibold mb-4">🏎️ Animation Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-lg">
                  <span className="text-sm">GPU Acceleration</span>
                  <Badge variant="neumorphic-success" size="sm">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-lg">
                  <span className="text-sm">Motion Preferences</span>
                  <Badge variant="neumorphic" size="sm">
                    Respected
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-lg">
                  <span className="text-sm">Frame Rate</span>
                  <Badge variant="neumorphic-brand" size="sm">
                    60fps
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-lg">
                  <span className="text-sm">DOM Batching</span>
                  <Badge variant="neumorphic-success" size="sm">
                    Enabled
                  </Badge>
                </div>
              </div>
            </div>

            <div className="neo-card-base">
              <h3 className="font-semibold mb-4">♿ Accessibility Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-lg">
                  <span className="text-sm">WCAG AA Compliance</span>
                  <Badge variant="neumorphic-success" size="sm">
                    ✓
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-lg">
                  <span className="text-sm">Keyboard Navigation</span>
                  <Badge variant="neumorphic-success" size="sm">
                    ✓
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-lg">
                  <span className="text-sm">Screen Reader Support</span>
                  <Badge variant="neumorphic-success" size="sm">
                    ✓
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-lg">
                  <span className="text-sm">High Contrast Mode</span>
                  <Badge variant="neumorphic-success" size="sm">
                    ✓
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="neo-card-base">
            <h4 className="font-semibold mb-3">🔧 Technical Implementation</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">Performance Features</h5>
                <ul className="space-y-1 text-text-secondary">
                  <li>
                    • <code>will-change</code> optimization
                  </li>
                  <li>
                    • <code>transform3d</code> GPU layers
                  </li>
                  <li>
                    • <code>requestAnimationFrame</code> batching
                  </li>
                  <li>• Intersection Observer for visibility</li>
                  <li>• Debounced/throttled event handlers</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Accessibility Features</h5>
                <ul className="space-y-1 text-text-secondary">
                  <li>• ARIA attributes automation</li>
                  <li>• Focus management utilities</li>
                  <li>• Motion preference detection</li>
                  <li>• Color contrast validation</li>
                  <li>• Keyboard event handling</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Design System Info */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Design System Evolution</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="neo-card-base">
              <h3 className="font-semibold mb-4">📋 Implementation Phases</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phase 1-2: Foundation & Core</span>
                  <Badge variant="neumorphic-success" size="sm">
                    Complete
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phase 3: Containers & Layout</span>
                  <Badge variant="neumorphic-success" size="sm">
                    Complete
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phase 4: States & Interactions</span>
                  <Badge variant="neumorphic-brand" size="sm">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Performance Optimization</span>
                  <Badge variant="neumorphic-success" size="sm">
                    Complete
                  </Badge>
                </div>
              </div>
            </div>

            <div className="neo-card-base">
              <h3 className="font-semibold mb-4">✨ Neomorphism Features</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">🎨 Visual</h4>
                  <ul className="space-y-1 text-text-secondary">
                    <li>• Dual-directional shadows</li>
                    <li>• Soft, organic surfaces</li>
                    <li>• Ambient light simulation</li>
                    <li>• Color-mix based depths</li>
                    <li>• Micro-interactions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">⚙️ Technical</h4>
                  <ul className="space-y-1 text-text-secondary">
                    <li>• CSS Custom Properties</li>
                    <li>• Tailwind Integration</li>
                    <li>• Dark Mode Support</li>
                    <li>• Universal State System</li>
                    <li>• Performance Optimized</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NeomorphicDemo;
