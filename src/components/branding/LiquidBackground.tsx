import { useEffect, useRef } from "react";

import { cn } from "../../lib/utils";

interface LiquidBackgroundProps {
  className?: string;
  animate?: boolean;
}

export function LiquidBackground({ className, animate = true }: LiquidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas-Größe anpassen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Liquid-Animation initialisieren
    let animationId: number;
    let time = 0;

    const drawLiquidBackground = () => {
      if (!ctx) return;

      // Hintergrund mit leichter Transparenz für Motion Blur-Effekt
      ctx.fillStyle = "rgba(15, 23, 42, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Flüssige Wellenformen berechnen
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius =
        Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) * 0.8;

      // Mehrere Wellen mit unterschiedlichen Farben und Phasen
      for (let i = 0; i < 3; i++) {
        const phase = time * (0.5 + i * 0.2);
        const amplitude = 20 + i * 10;
        const frequency = 5 + i * 2;

        ctx.beginPath();
        ctx.strokeStyle = `hsla(${220 + i * 20}, 70%, 60%, 0.1)`;
        ctx.lineWidth = 2 + i * 1;

        for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
          const waveOffset = Math.sin(angle * frequency + phase) * amplitude;
          const radius = maxRadius * (0.5 + i * 0.1) + waveOffset;

          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius * 0.7 + Math.sin(angle * 2 + phase) * 20;

          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();
        ctx.stroke();
      }

      // Subtile Partikel für "Liquid Intelligence"-Effekt
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2 + 0.5;
        const opacity = Math.random() * 0.1;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${220 + Math.random() * 30}, 70%, 60%, ${opacity})`;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Animation fortsetzen
      if (animate) {
        time += 0.02;
        animationId = requestAnimationFrame(drawLiquidBackground);
      }
    };

    drawLiquidBackground();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      aria-hidden="true"
    />
  );
}
