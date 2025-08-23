import React from "react";
import { Shell } from "../components/Shell";
import { Card, CardHeader } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export default function Home() {
  return (
    <Shell>
      <section className="grid md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary to-indigo-500 opacity-20 blur-3xl" />
          <CardHeader title="Was kann ich für dich tun?" subtitle="Disa AI – dein privater Assistent" right={<Button>Chat starten</Button>} />
          <div className="space-y-3">
            <Input placeholder="Frag mich etwas …" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Button variant="ghost">Übersetzen</Button>
              <Button variant="ghost">Code</Button>
              <Button variant="ghost">Kreativ</Button>
              <Button variant="ghost">Analyse</Button>
              <Button variant="ghost">Refactor</Button>
              <Button variant="ghost">Zusammenfassen</Button>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Schnellstart" subtitle="Beliebte Aufgaben" />
          <div className="grid grid-cols-2 gap-3">
            <Button className="justify-start">Projekt-Readme erzeugen</Button>
            <Button className="justify-start">Bugreport analysieren</Button>
            <Button className="justify-start">Prompt optimieren</Button>
            <Button className="justify-start">PR-Text generieren</Button>
          </div>
        </Card>
      </section>
    </Shell>
  );
}
