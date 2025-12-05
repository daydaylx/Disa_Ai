import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, Bug, MessageSquare, MoreHorizontal, Palette, Send } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button, Card, useToasts } from "@/ui";

import { AppMenuDrawer, useMenuDrawer } from "../components/layout/AppMenuDrawer";
import { AppShell } from "../components/layout/AppShell";

const FEEDBACK_TYPES = [
  { id: "idea", label: "Idee", icon: MessageSquare, color: "text-accent-primary" },
  { id: "bug", label: "Fehler", icon: Bug, color: "text-status-error" },
  { id: "ui", label: "Design", icon: Palette, color: "text-accent-secondary" },
  { id: "other", label: "Sonstiges", icon: MoreHorizontal, color: "text-ink-secondary" },
] as const;

export default function FeedbackPage() {
  const navigate = useNavigate();
  const toasts = useToasts();
  const { isOpen, openMenu, closeMenu } = useMenuDrawer();

  const [type, setType] = useState<string>("idea");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    const trimmedEmail = email.trim();

    if (!trimmedMessage || isSending) return;

    // Rate limiting: Check if user sent feedback recently (3 minutes cooldown)
    const RATE_LIMIT_KEY = "feedback_last_sent";
    const COOLDOWN_MS = 3 * 60 * 1000; // 3 minutes

    try {
      const lastSent = localStorage.getItem(RATE_LIMIT_KEY);
      if (lastSent) {
        const timeSinceLastSent = Date.now() - parseInt(lastSent, 10);
        if (timeSinceLastSent < COOLDOWN_MS) {
          const remainingSeconds = Math.ceil((COOLDOWN_MS - timeSinceLastSent) / 1000);
          toasts.push({
            kind: "error",
            title: "Bitte warte kurz",
            message: `Du kannst in ${remainingSeconds} Sekunden erneut Feedback senden.`,
          });
          return;
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    setIsSending(true);

    const payload = {
      message: trimmedMessage,
      type,
      email: trimmedEmail || undefined, // Only include email if provided (anonymous otherwise)
      context: typeof window !== "undefined" ? window.location.pathname : "unknown",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let result: { success?: boolean; error?: string } = {};
      try {
        result = await response.json();
      } catch {
        // If parsing fails, fall back to status handling below
      }

      if (!response.ok || !result?.success) {
        // Provide specific error messages based on status code
        let errorMessage = "Bitte versuche es später erneut.";

        if (response.status === 400) {
          errorMessage = result?.error || "Ungültige Eingabe. Bitte überprüfe deine Nachricht.";
        } else if (response.status === 429) {
          errorMessage = "Zu viele Anfragen. Bitte warte einen Moment.";
        } else if (response.status >= 500) {
          errorMessage = "Serverfehler. Wir arbeiten daran!";
        } else if (!navigator.onLine) {
          errorMessage = "Keine Internetverbindung.";
        }

        throw new Error(errorMessage);
      }

      // Store timestamp for rate limiting
      try {
        localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
      } catch {
        // Ignore localStorage errors
      }

      toasts.push({
        kind: "success",
        title: "Feedback gesendet",
        message: trimmedEmail
          ? "Danke! Wir melden uns bei dir zurück."
          : "Danke für dein anonymes Feedback!",
      });

      setMessage("");
      setEmail("");
      setIsSending(false);
      void navigate("/settings");
    } catch (error) {
      console.error("Feedback senden fehlgeschlagen", error);
      const errorMessage =
        error instanceof Error ? error.message : "Bitte versuche es in ein paar Minuten erneut.";

      toasts.push({
        kind: "error",
        title: "Senden fehlgeschlagen",
        message: errorMessage,
      });
      setIsSending(false);
    }
  };

  return (
    <>
      <AppShell
        title="Feedback"
        onMenuClick={openMenu}
        headerActions={
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Zurück
          </Button>
        }
      >
        <div className="flex flex-col items-center justify-center min-h-full p-4 overflow-y-auto">
          <Card className="w-full max-w-lg" padding="lg">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-ink-primary">Deine Meinung zählt</h1>
              <p className="text-sm text-ink-secondary mt-2">
                Hilf uns, Disa AI besser zu machen. Was funktioniert gut? Was fehlt dir?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary">
                  Worum geht es?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FEEDBACK_TYPES.map((item) => {
                    const Icon = item.icon;
                    const isSelected = type === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setType(item.id)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all",
                          isSelected
                            ? "bg-surface-2 border-accent-primary/50 ring-1 ring-accent-primary/20"
                            : "bg-surface-1 border-white/5 hover:bg-surface-2 hover:border-white/10",
                        )}
                      >
                        <Icon
                          className={cn("h-6 w-6", isSelected ? item.color : "text-ink-tertiary")}
                        />
                        <span
                          className={cn(
                            "text-xs font-medium",
                            isSelected ? "text-ink-primary" : "text-ink-secondary",
                          )}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary">
                  Deine Nachricht
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Beschreibe deine Idee oder das Problem..."
                  className="w-full min-h-[160px] bg-surface-2 border border-white/10 rounded-xl p-4 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-none"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary">
                  E-Mail (optional) 🔒
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nur wenn du eine Antwort möchtest..."
                  className="w-full bg-surface-2 border border-white/10 rounded-xl p-4 text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                />
                <p className="text-xs text-ink-tertiary italic">
                  Ohne E-Mail bleibt dein Feedback komplett anonym.
                </p>
              </div>

              <div className="rounded-lg bg-surface-2/50 p-3 text-xs text-ink-secondary border border-white/5">
                <p>
                  Technische Details (Browser, Gerät) werden anonymisiert angehängt, um Fehler
                  schneller zu finden.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSending || !message.trim()}
                className="w-full"
              >
                {isSending ? (
                  "Wird gesendet..."
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" /> Feedback absenden
                  </div>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </AppShell>

      <AppMenuDrawer isOpen={isOpen} onClose={closeMenu} />
    </>
  );
}
