import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-3xl text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Willkommen bei <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Disa AI</span>
        </h1>
        <p className="text-zinc-400">
          Schneller, sauberer Chat – mit speicherbarem Kontext („Merke dir das“)
          und Stil-Vorlagen aus deiner <code>persona.json</code>.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/chat"
            className="rounded-xl bg-violet-600 px-4 py-2 font-medium text-white shadow hover:bg-violet-500"
          >
            Zum Chat
          </Link>
          <Link
            to="/settings"
            className="rounded-xl bg-white/10 px-4 py-2 font-medium text-zinc-100 ring-1 ring-white/10 hover:bg-white/15"
          >
            Einstellungen
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-medium">Stile (Systemprompts)</h3>
          <p className="mt-2 text-sm text-zinc-400">
            Schnellzugriff auf deine Templates aus <code>public/persona.json</code>.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-medium">„Merke dir das“</h3>
          <p className="mt-2 text-sm text-zinc-400">
            Explizit markierte Notizen gehen in die Chat-Memory (lokal gespeichert).
          </p>
        </div>
      </div>
    </section>
  );
}
