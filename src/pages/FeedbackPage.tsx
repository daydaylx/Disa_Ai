import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, Send } from "@/lib/icons";
import {
  Button,
  Label,
  PremiumCard,
  PrimaryButton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToasts,
} from "@/ui";
import { SectionHeader } from "@/ui/SectionHeader";

export default function FeedbackPage() {
  const navigate = useNavigate();
  const toasts = useToasts();
  const [type, setType] = useState("idea");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Simulation of API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Collect device info
    /* const deviceInfo = {
      userAgent: navigator.userAgent,
      screen: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio,
    };
    console.log("Feedback submitted:", { type, message, deviceInfo }); */

    toasts.push({
      kind: "success",
      title: "Feedback gesendet",
      message: "Danke für deine Rückmeldung!",
    });

    setIsSending(false);
    void navigate("/settings"); // Back to settings
  };

  return (
    <div className="relative flex flex-col text-text-primary h-full bg-bg-base safe-area-top">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Zurück
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <PremiumCard variant="default" className="max-w-xl mx-auto p-6">
          <SectionHeader title="Feedback senden" subtitle="Hilf uns, Disa AI besser zu machen." />

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label>Art der Rückmeldung</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-surface-inset border-surface-2">
                  <SelectValue placeholder="Art der Rückmeldung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">💡 Idee & Vorschlag</SelectItem>
                  <SelectItem value="bug">🐛 Fehler melden</SelectItem>
                  <SelectItem value="ui">🎨 Design / UI-Problem</SelectItem>
                  <SelectItem value="other">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Beschreibung</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Was ist dir aufgefallen? Was wünschst du dir?"
                className="min-h-[150px] bg-surface-inset border-surface-2"
                required
              />
            </div>

            <div className="rounded-md bg-surface-inset shadow-inset p-3 text-xs text-text-secondary">
              <p>
                Wir hängen automatisch technische Details an (Browser, Bildschirmgröße), um Fehler
                schneller zu finden.
              </p>
            </div>

            <PrimaryButton
              type="submit"
              disabled={isSending}
              className="w-full flex items-center justify-center gap-2"
            >
              {isSending ? (
                "Wird gesendet..."
              ) : (
                <>
                  <Send className="h-4 w-4" /> Feedback absenden
                </>
              )}
            </PrimaryButton>
          </form>
        </PremiumCard>
      </div>
    </div>
  );
}
