import { GlassCard, GlassGrid } from "./components/Glass";

export default function Home() {
  return (
    <main className="min-h-dvh text-white">
      <GlassGrid>
        {Array.from({length: 8}).map((_, i) => (
          <GlassCard key={i}>
            <h3 className="text-white/95 font-semibold">Karte {i+1}</h3>
            <p className="text-white/80">Inhalt, der nicht verwaschen ist.</p>
          </GlassCard>
        ))}
      </GlassGrid>
    </main>
  );
}