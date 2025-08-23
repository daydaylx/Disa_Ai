import Header from "./Header";
import type { ReactNode } from "react";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-zinc-100 antialiased">
      {/* Soft Glow Background */}
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(600px 300px at 50% -20%, rgba(168,85,247,.25), transparent 60%)",
        }}
      />
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
