import { useEffect, useRef } from "react";

import { cn } from "../../lib/utils";

interface LiquidLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export function LiquidLogo({ className, size = 64, animate = true }: LiquidLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas-Größe setzen
    canvas.width = size;
    canvas.height = size;

    // Liquid-Animation initialisieren
    let animationId: number;
    let time = 0;

    const drawLiquidLogo = () => {
      if (!ctx) return;

      // Hintergrund löschen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Flüssige Wellenform berechnen
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.4;

      // Farbverlauf für Liquid-Effekt mit Design-Tokens
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "var(--liquid-blue)"); // Tiefes Blau
      gradient.addColorStop(0.5, "var(--liquid-turquoise)"); // Türkis
      gradient.addColorStop(1, "var(--liquid-purple)"); // Lila

      ctx.beginPath();
      ctx.fillStyle = gradient;

      // Wellenform mit Sinus-Funktion
      for (let i = 0; i <= 360; i += 1) {
        const angle = (i * Math.PI) / 180;
        const waveOffset = Math.sin(angle * 3 + time) * 5;
        const waveOffset2 = Math.cos(angle * 2 + time * 0.7) * 3;

        const x = centerX + Math.cos(angle) * (radius + waveOffset + waveOffset2);
        const y = centerY + Math.sin(angle) * (radius + waveOffset + waveOffset2);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.fill();

      // "AI"-Text in der Mitte
      ctx.fillStyle = "white";
      ctx.font = `bold ${Math.floor(size * 0.3)}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("AI", centerX, centerY);

      // Animation fortsetzen
      if (animate) {
        time += 0.05;
        animationId = requestAnimationFrame(drawLiquidLogo);
      }
    };

    drawLiquidLogo();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [size, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("block", className)}
      width={size}
      height={size}
      aria-label="Disa AI Liquid Intelligence Logo"
    />
  );
}
