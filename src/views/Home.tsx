import React from "react"
import StartHero from "../components/StartHero"
import TemplatesGrid from "../components/TemplatesGrid"

export default function Home() {
  return (
    <main className="px-4 pt-4 pb-[calc(64px+env(safe-area-inset-bottom))] max-w-4xl mx-auto">
      <StartHero />
      <TemplatesGrid />
    </main>
  )
}
