import { useEffect, useRef } from "react";

import {
  shouldDisableParticles,
  shouldReduceMotion,
  usePowerState,
} from "../../lib/performance/power-manager";

// Custom Cursor Component
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const powerState = usePowerState();

  useEffect(() => {
    // Disable cursor effects in power saving modes
    if (!powerState.effectsEnabled || shouldReduceMotion()) {
      return;
    }
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Create trail elements
    const trailElements: HTMLDivElement[] = [];
    for (let i = 0; i < 8; i++) {
      const trail = document.createElement("div");
      trail.className = "cursor-trail";
      trail.style.animationDelay = `${i * 0.05}s`;
      document.body.appendChild(trail);
      trailElements.push(trail);
    }
    trailRefs.current = trailElements;

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX - 10}px`;
      cursor.style.top = `${e.clientY - 10}px`;

      // Update trail
      trailElements.forEach((trail, index) => {
        setTimeout(() => {
          trail.style.left = `${e.clientX - 3}px`;
          trail.style.top = `${e.clientY - 3}px`;
        }, index * 20);
      });
    };

    const handleMouseDown = () => {
      cursor.style.transform = "scale(0.8)";
    };

    const handleMouseUp = () => {
      cursor.style.transform = "scale(1)";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      trailElements.forEach((trail) => trail.remove());
    };
  }, [powerState.effectsEnabled]);

  return <div ref={cursorRef} className="custom-cursor" />;
}

// Matrix Rain Component
export function MatrixRain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const powerState = usePowerState();

  useEffect(() => {
    // Disable matrix rain in power saving modes or if particles disabled
    if (!powerState.matrixRainEnabled || shouldDisableParticles()) {
      return;
    }
    const container = containerRef.current;
    if (!container) return;

    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const columns = Math.floor(window.innerWidth / 20);

    for (let i = 0; i < columns; i++) {
      const column = document.createElement("div");
      column.className = "matrix-column";
      column.style.left = `${i * 20}px`;
      column.style.animationDuration = `${Math.random() * 3 + 2}s`;
      column.style.animationDelay = `${Math.random() * 2}s`;

      // Generate random characters
      let text = "";
      for (let j = 0; j < Math.floor(Math.random() * 20) + 10; j++) {
        text += characters[Math.floor(Math.random() * characters.length)] + "\n";
      }
      column.textContent = text;

      container.appendChild(column);
    }

    return () => {
      container.innerHTML = "";
    };
  }, [powerState.matrixRainEnabled]);

  return <div ref={containerRef} className="matrix-rain" />;
}

// Neural Network Background
export function NeuralNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodeCount = 20;
    const nodes: Array<{ x: number; y: number; element: HTMLDivElement }> = [];

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const node = document.createElement("div");
      node.className = "neural-node";

      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.animationDelay = `${Math.random() * 3}s`;

      container.appendChild(node);
      nodes.push({ x, y, element: node });
    }

    // Create connections
    nodes.forEach((nodeA, i) => {
      nodes.forEach((nodeB, j) => {
        if (i >= j) return;

        const distance = Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));

        if (distance < 200) {
          const connection = document.createElement("div");
          connection.className = "neural-connection";

          const angle = Math.atan2(nodeB.y - nodeA.y, nodeB.x - nodeA.x);
          connection.style.width = `${distance}px`;
          connection.style.left = `${nodeA.x}px`;
          connection.style.top = `${nodeA.y}px`;
          connection.style.transform = `rotate(${angle}rad)`;
          connection.style.animationDelay = `${Math.random() * 4}s`;

          container.appendChild(connection);
        }
      });
    });

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className="neural-bg" />;
}

// Scroll Progress Indicator
export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      progress.style.width = `${Math.min(scrollPercent, 100)}%`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div ref={progressRef} className="scroll-progress" />;
}

// Scroll Reveal Hook
export function useScrollReveal(className = "scroll-reveal") {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [className]);
}

// Particle System
export function ParticleSystem({ count = 50 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;

      container.appendChild(particle);
    }

    return () => {
      container.innerHTML = "";
    };
  }, [count]);

  return <div ref={containerRef} className="particle-system" />;
}

// Click Explosion Effect
export function useClickExplosion() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const explosion = document.createElement("div");
      explosion.style.position = "fixed";
      explosion.style.left = `${e.clientX}px`;
      explosion.style.top = `${e.clientY}px`;
      explosion.style.pointerEvents = "none";
      explosion.style.zIndex = "10000";

      for (let i = 0; i < 12; i++) {
        const particle = document.createElement("div");
        particle.className = "explosion-particle";

        const angle = (i / 12) * Math.PI * 2;
        const distance = Math.random() * 50 + 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.style.left = "0px";
        particle.style.top = "0px";
        particle.style.transform = `translate(${x}px, ${y}px)`;

        explosion.appendChild(particle);
      }

      document.body.appendChild(explosion);

      setTimeout(() => {
        explosion.remove();
      }, 600);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
}

// Combined Premium Effects Component
export default function PremiumEffects() {
  useScrollReveal();
  useClickExplosion();

  // Only show on desktop for performance
  const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;

  if (!isDesktop) return null;

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <MatrixRain />
      <NeuralNetwork />
      <div className="mesh-gradient" />
      <ParticleSystem count={30} />
    </>
  );
}
