import * as React from "react";

interface AuroraBackgroundProps {
  particleCount?: number;
}

export function AuroraBackground({ particleCount = 20 }: AuroraBackgroundProps) {
  const particles = React.useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10,
    }));
  }, [particleCount]);

  return (
    <div className="aurora-background">
      {/* Main aurora layers */}
      <div className="aurora-layer aurora-layer--primary" />
      <div className="aurora-layer aurora-layer--secondary" />
      <div className="aurora-layer aurora-layer--tertiary" />

      {/* Mesh gradient overlay */}
      <div className="aurora-mesh" />

      {/* Floating particles */}
      <div className="aurora-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="aurora-particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
