import { useEffect, useRef, useState } from "react";

import { GameState } from "../../hooks/useGameState";

interface GameEffectsProps {
  state: GameState;
}

// Simple keyword mapping for background styles
const getBackgroundStyle = (location: string): string => {
  const loc = location.toLowerCase();

  if (
    loc.includes("labor") ||
    loc.includes("station") ||
    loc.includes("basis") ||
    loc.includes("genesis")
  ) {
    return "bg-gradient-to-b from-blue-900/20 via-slate-900/50 to-black"; // Sci-Fi Tech
  }
  if (
    loc.includes("wald") ||
    loc.includes("wildnis") ||
    loc.includes("dschungel") ||
    loc.includes("wurzel")
  ) {
    return "bg-gradient-to-b from-emerald-900/20 via-slate-900/50 to-black"; // Nature
  }
  if (
    loc.includes("ruine") ||
    loc.includes("stadt") ||
    loc.includes("trümmer") ||
    loc.includes("beton")
  ) {
    return "bg-gradient-to-b from-slate-700/20 via-slate-900/50 to-black"; // Urban Decay
  }
  if (loc.includes("bunker") || loc.includes("tunnel") || loc.includes("höhle")) {
    return "bg-gradient-to-b from-neutral-900 via-black to-black"; // Dark/Underground
  }
  if (loc.includes("wüste") || loc.includes("ödland") || loc.includes("sand")) {
    return "bg-gradient-to-b from-amber-900/10 via-slate-900/50 to-black"; // Wasteland
  }

  return "bg-gradient-to-b from-slate-900/50 to-black"; // Default
};

export function GameEffects({ state }: GameEffectsProps) {
  const [shake, setShake] = useState(false);
  const [flashRed, setFlashRed] = useState(false);
  const prevHp = useRef(state.hp);

  useEffect(() => {
    // Detect Damage
    if (state.hp < prevHp.current) {
      setShake(true);
      setFlashRed(true);
      setTimeout(() => {
        setShake(false);
        setFlashRed(false);
      }, 500);
    }
    prevHp.current = state.hp;
  }, [state.hp]);

  const bgStyle = getBackgroundStyle(state.location);

  return (
    <>
      {/* Dynamic Background Layer */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-1000 ${bgStyle}`}
      />

      {/* Scanlines Effect (Always on for Sci-Fi feel) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
        style={{ backgroundSize: "100% 2px, 3px 100%" }}
      />

      {/* Damage Flash Overlay */}
      <div
        className={`fixed inset-0 pointer-events-none z-50 bg-red-500/20 transition-opacity duration-300 ${flashRed ? "opacity-100" : "opacity-0"}`}
      />

      {/* Global Shake Style Injection */}
      {shake && (
        <style>{`
          @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
          .game-page-content {
            animation: shake 0.5s;
            animation-iteration-count: 1;
          }
        `}</style>
      )}
    </>
  );
}
