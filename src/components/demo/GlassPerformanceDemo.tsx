import { useEffect, useRef, useState } from "react";

import { Button } from "../ui/button";
import { Card } from "../ui/card";

/**
 * Glass Performance Demo
 *
 * Demonstriert Unterschiede zwischen Legacy- und Performance-optimierten
 * Glasmorphismus-Effekten mit FPS-Messung
 */
export function GlassPerformanceDemo() {
  const [useLegacy, setUseLegacy] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const lastTime = useRef(Date.now());
  const frameCountRef = useRef(0);
  const rafId = useRef<number | undefined>(undefined);

  // FPS Monitoring
  useEffect(() => {
    const measureFPS = () => {
      frameCountRef.current++;
      const now = Date.now();

      if (now - lastTime.current >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / (now - lastTime.current)));
        setFrameCount(frameCountRef.current);
        frameCountRef.current = 0;
        lastTime.current = now;
      }

      rafId.current = requestAnimationFrame(measureFPS);
    };

    rafId.current = requestAnimationFrame(measureFPS);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Scroll Performance Test
  const handleScroll = () => {
    setIsScrolling(true);
    setTimeout(() => setIsScrolling(false), 100);
  };

  const cardData = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: `Glass Card ${i + 1}`,
    content: `Performance-Test Card mit ${useLegacy ? "Legacy" : "Optimierten"} Glaseffekten`,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      {/* Performance Monitor */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <div
          className={`glass-${useLegacy ? "panel" : "critical"} p-3 text-white text-sm font-mono`}
        >
          <div className="space-y-1">
            <div>
              FPS:{" "}
              <span
                className={
                  fps >= 55 ? "text-green-400" : fps >= 30 ? "text-yellow-400" : "text-red-400"
                }
              >
                {fps}
              </span>
            </div>
            <div>Frames: {frameCount}</div>
            <div>Mode: {useLegacy ? "Legacy" : "Performance"}</div>
            {isScrolling && <div className="text-yellow-400">📊 SCROLLING</div>}
          </div>
        </div>

        <Button
          onClick={() => setUseLegacy(!useLegacy)}
          className={useLegacy ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
        >
          {useLegacy ? "Switch to Performance" : "Switch to Legacy"}
        </Button>
      </div>

      {/* Navigation Header - Critical Path */}
      <header className={useLegacy ? "app-header" : "app-header-performance"}>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-white">Glass Performance Test</h1>
          <div className="text-sm text-white/80">
            Mode: {useLegacy ? "Legacy (blur 20px)" : "Performance (blur 2px)"}
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="pt-20 pb-32">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Performance Comparison */}
          <section className="grid md:grid-cols-2 gap-6 mb-8">
            <Card tone={useLegacy ? "glass-strong" : "glass-performance"} className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {useLegacy ? "Legacy Glass" : "Performance Glass"}
              </h2>
              <div className="space-y-2 text-white/90 text-sm">
                <div>Blur: {useLegacy ? "16-20px" : "2-4px"}</div>
                <div>Layers: {useLegacy ? "Multiple" : "Single"}</div>
                <div>Mobile FPS: {useLegacy ? "20-40fps" : "55-60fps"}</div>
                <div>GPU Memory: {useLegacy ? "High" : "Low"}</div>
              </div>
            </Card>

            <Card tone={useLegacy ? "glass-medium" : "glass-performance-subtle"} className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Alternative Techniques</h2>
              <div className="space-y-2 text-white/90 text-sm">
                <div>✅ Innen-Borders für Tiefe</div>
                <div>✅ Box-Shadows für Elevation</div>
                <div>✅ Gradients für Highlights</div>
                <div>✅ GPU-Layer-Optimierung</div>
              </div>
            </Card>
          </section>

          {/* Scrollable Cards for Performance Testing */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Scroll Performance Test</h2>
            <p className="text-white/80 mb-6">
              Scrolle durch diese Cards um die FPS-Unterschiede zu testen. Legacy-Mode sollte
              deutlich schlechtere Performance zeigen.
            </p>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-4" onScroll={handleScroll}>
              {cardData.map((card) => (
                <Card
                  key={card.id}
                  tone={
                    useLegacy
                      ? card.id % 4 === 0
                        ? "glass-strong"
                        : card.id % 3 === 0
                          ? "glass-medium"
                          : card.id % 2 === 0
                            ? "glass"
                            : "glass-subtle"
                      : card.id % 4 === 0
                        ? "glass-performance-modal"
                        : card.id % 3 === 0
                          ? "glass-performance"
                          : "glass-performance-subtle"
                  }
                  interactive="gentle"
                  className="p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{card.title}</h3>
                      <p className="text-white/80 text-sm mt-1">{card.content}</p>
                    </div>
                    <div className="text-xs text-white/60 ml-4">
                      {useLegacy ? "Legacy" : "Perf"}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Different Glass Techniques Showcase */}
          <section className="grid md:grid-cols-3 gap-4">
            <Card tone="glass-performance" className="p-4">
              <h3 className="font-semibold text-white mb-2">Mobile Optimized</h3>
              <p className="text-white/80 text-sm">4px blur max, border highlights</p>
            </Card>

            <Card tone="glass-performance-subtle" className="p-4">
              <h3 className="font-semibold text-white mb-2">Subtle Depth</h3>
              <p className="text-white/80 text-sm">No backdrop-filter, shadow depth</p>
            </Card>

            <Card tone="glass-performance-critical" className="p-4">
              <h3 className="font-semibold text-white mb-2">Critical Path</h3>
              <p className="text-white/80 text-sm">2px blur, navigation safe</p>
            </Card>
          </section>

          {/* Performance Metrics */}
          <section className={`${useLegacy ? "glass-panel" : "glass-modal"} p-6`}>
            <h2 className="text-lg font-semibold text-white mb-4">Performance Impact</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-2">Legacy Issues:</h4>
                <ul className="text-white/80 text-sm space-y-1">
                  <li>• blur(20px) in navigation kills mobile FPS</li>
                  <li>• Multiple backdrop-filter layers cause overdraw</li>
                  <li>• Chat input blur causes typing lag</li>
                  <li>• High GPU memory usage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Performance Fixes:</h4>
                <ul className="text-white/80 text-sm space-y-1">
                  <li>• blur(2-4px) maintains visual effect</li>
                  <li>• Border highlights replace heavy blur</li>
                  <li>• One backdrop-filter per element max</li>
                  <li>• GPU-layer optimization for smooth scroll</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation - Critical Path */}
      <nav className={useLegacy ? "bottom-navigation" : "bottom-navigation-performance"}>
        <div className="flex items-center justify-around p-4">
          <button className="text-white/80 hover:text-white">
            <div className="text-xs">Home</div>
          </button>
          <button className="text-white/80 hover:text-white">
            <div className="text-xs">Performance</div>
          </button>
          <button className="text-white/80 hover:text-white">
            <div className="text-xs">Settings</div>
          </button>
        </div>
      </nav>

      {/* Performance Warnings */}
      {useLegacy && (
        <div className="fixed bottom-20 left-4 right-4 bg-red-600/90 backdrop-blur-sm border border-red-400/50 rounded-lg p-3 text-white text-sm">
          ⚠️ Legacy Mode: Heavy blur effects may cause performance issues on mobile devices
        </div>
      )}
    </div>
  );
}

export default GlassPerformanceDemo;
