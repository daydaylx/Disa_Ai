import React from "react";
import StartHero from "../components/StartHero";
import TemplatesGrid from "../components/TemplatesGrid";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 pb-[calc(64px+env(safe-area-inset-bottom))] pt-4">
      <StartHero />
      <TemplatesGrid />
    </main>
  );
}
