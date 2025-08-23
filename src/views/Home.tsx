import React from "react";
import { Shell } from "../components/Shell";
import { Card, CardHeader } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useNavigate } from "react-router-dom";
import { features } from "../config/features";

export default function Home() {
  const nav = useNavigate();
  return (
    <Shell>
      <section className="grid md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary to-indigo-500 opacity-20 blur-3xl" />
          <CardHeader
            title="Was kann ich für dich tun?"
            subtitle="Disa AI – dein privater Assistent"
            right={<Button onClick={() => nav("/chat")}>Zum Chat</Button>}
          />
          <div className="space-y-3">
            <Input placeholder="Frag mich etwas … (öffnet Chat)" onFocus={() => nav("/chat")} />
            {!features.quickActions ? null : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* deaktiviert, bis echte Funktionen vorhanden sind */}
              </div>
            )}
          </div>
        </Card>

        {features.quickStartPanel ? (
          <Card>
            <CardHeader title="Schnellstart" subtitle="Beliebte Aufgaben" />
            <div className="text-zinc-400 text-sm">Wird eingeblendet, sobald echte Tasks existieren.</div>
          </Card>
        ) : (
          <Card>
            <CardHeader title="Hinweis" subtitle="Aktuell verfügbar" />
            <ul className="text-zinc-300 text-sm list-disc pl-5 space-y-1">
              <li>Chat</li>
              <li>Einstellungen (API-Key speichern)</li>
            </ul>
          </Card>
        )}
      </section>
    </Shell>
  );
}
