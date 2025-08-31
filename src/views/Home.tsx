import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Willkommen bei{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Disa AI
          </span>
        </h1>
        <p className="mt-5 text-zinc-300 max-w-2xl">
          Schneller, sauberer Chat – mit speicherbarem Kontext („Merke dir das“) und wählbaren
          Stilen in den Einstellungen.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            to="/chat"
            className="px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 transition"
          >
            Zum Chat
          </Link>
          <Link
            to="/settings"
            className="px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 transition"
          >
            Einstellungen
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 grid gap-6">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-xl font-semibold">„Merke dir das“</h2>
          <p className="mt-2 text-zinc-400">
            Explizit markierte Notizen landen in deiner lokalen Chat-Memory. Du bestimmst, was
            gespeichert wird – nichts wird hochgeladen.
          </p>
        </div>
      </section>
    </main>
  );
}
