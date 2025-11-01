/**
 * Neomorphism Demo Component
 *
 * Showcases the new neomorphic design system components
 * For testing and demonstration purposes
 */

import { Button } from "../ui/button";
import { Card } from "../ui/card";

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

        {/* Design System Info */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Design System Info</h2>

          <div className="neo-card-base">
            <h3 className="font-semibold mb-4">✨ Neomorphism Features</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">🎨 Visual</h4>
                <ul className="space-y-1 text-text-secondary">
                  <li>• Dual-directional shadows</li>
                  <li>• Soft, organic surfaces</li>
                  <li>• Ambient light simulation</li>
                  <li>• Color-mix based depths</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">⚙️ Technical</h4>
                <ul className="space-y-1 text-text-secondary">
                  <li>• CSS Custom Properties</li>
                  <li>• Tailwind Integration</li>
                  <li>• Dark Mode Support</li>
                  <li>• Accessibility Compliant</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NeomorphicDemo;
