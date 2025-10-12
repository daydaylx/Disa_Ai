import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="mx-auto max-w-4xl py-8">
        <h1 className="mb-8 text-3xl font-bold text-white">Glassmorphism Design-System Preview</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Basic Glass Card */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Basic Glass Card</CardTitle>
              <CardDescription className="text-white/80">
                Standard card with glass effect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                This is a basic card using the new glass-card utility.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Action
              </Button>
            </CardFooter>
          </Card>

          {/* Glass Card with Overlay Variants */}
          <Card className="glass-card overlay-soft">
            <CardHeader>
              <CardTitle className="text-white">Overlay Soft</CardTitle>
              <CardDescription className="text-white/80">Card with soft overlay</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                This card uses the overlay-soft variant for better text contrast.
              </p>
            </CardContent>
          </Card>

          {/* Medium Overlay Card */}
          <Card className="glass-card overlay-medium">
            <CardHeader>
              <CardTitle className="text-white">Overlay Medium</CardTitle>
              <CardDescription className="text-white/80">Card with medium overlay</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                This card uses the overlay-medium variant for improved readability.
              </p>
            </CardContent>
          </Card>

          {/* Strong Overlay Card */}
          <Card className="glass-card overlay-strong">
            <CardHeader>
              <CardTitle className="text-white">Overlay Strong</CardTitle>
              <CardDescription className="text-white/80">Card with strong overlay</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                This card uses the overlay-strong variant for maximum contrast.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Example with custom styling */}
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold text-white">Custom Glass Elements</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="glass-card p-6">
              <h3 className="mb-2 text-xl font-semibold text-white">Glass Button</h3>
              <button className="glass-card rounded-lg px-4 py-2 text-white transition hover:scale-105">
                Hover me
              </button>
            </div>

            <div className="glass-card p-6">
              <h3 className="mb-2 text-xl font-semibold text-white">Glass Input</h3>
              <div className="glass-card mt-2 rounded-lg p-2">
                <input
                  type="text"
                  placeholder="Glass input field"
                  className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
