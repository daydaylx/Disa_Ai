import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  type CompressedImage,
  compressImage,
  createImagePreview,
  formatFileSize,
  IMAGE_CONFIG,
  validateImageFiles,
  validateImageMagicBytes,
} from "@/lib/feedback/imageUtils";
import {
  Bug,
  Image as ImageIcon,
  MessageSquare,
  MoreHorizontal,
  Palette,
  Send,
  X,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  Badge,
  Button,
  Card,
  InfoBanner,
  Input,
  PageHero,
  PageHeroStat,
  Textarea,
  useToasts,
} from "@/ui";

const FEEDBACK_TYPES = [
  { id: "idea", label: "Idee", icon: MessageSquare, color: "text-accent-settings" },
  { id: "bug", label: "Fehler", icon: Bug, color: "text-status-error" },
  { id: "ui", label: "Design", icon: Palette, color: "text-accent-settings" },
  { id: "other", label: "Sonstiges", icon: MoreHorizontal, color: "text-ink-secondary" },
] as const;

interface AttachmentPreview {
  id: string;
  file: File;
  previewUrl: string;
  originalSize: number;
}

export default function FeedbackPage() {
  const navigate = useNavigate();
  const toasts = useToasts();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<string>("idea");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [attachments, setAttachments] = useState<AttachmentPreview[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitError(null);

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validation = validateImageFiles([...attachments.map((a) => a.file), ...files]);
    if (!validation.valid) {
      toasts.push({
        kind: "error",
        title: "Ungültige Datei",
        message: validation.error || "Bitte überprüfe deine Bilder.",
      });
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsCompressing(true);

    try {
      // Validate magic bytes and compress each file
      const processedAttachments: AttachmentPreview[] = [];

      for (const file of files) {
        // Security check: validate magic bytes
        const isValidImage = await validateImageMagicBytes(file);
        if (!isValidImage) {
          toasts.push({
            kind: "error",
            title: "Ungültiges Bild",
            message: `${file.name} ist kein gültiges Bild.`,
          });
          continue;
        }

        // Compress image
        let compressedResult: CompressedImage;
        try {
          compressedResult = await compressImage(file);
        } catch (error) {
          console.error("Compression failed for", file.name, error);
          toasts.push({
            kind: "error",
            title: "Kompression fehlgeschlagen",
            message: `${file.name} konnte nicht verarbeitet werden.`,
          });
          continue;
        }

        // Create preview
        const previewUrl = createImagePreview(compressedResult.file);
        processedAttachments.push({
          id: `${Date.now()}-${Math.random()}`,
          file: compressedResult.file,
          previewUrl,
          originalSize: compressedResult.originalSize,
        });
      }

      // Add to existing attachments
      setAttachments((prev) => [...prev, ...processedAttachments]);

      // Show success toast if compression saved space
      const totalSaved = processedAttachments.reduce(
        (sum, a) => sum + (a.originalSize - a.file.size),
        0,
      );
      if (totalSaved > 1024 * 100) {
        // Only show if saved > 100 KB
        toasts.push({
          kind: "success",
          title: "Bilder optimiert",
          message: `${formatFileSize(totalSaved)} gespart durch Kompression.`,
        });
      }
    } finally {
      setIsCompressing(false);
      // Reset input to allow selecting same file again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Remove attachment
  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id);
      if (removed) {
        // Revoke object URL to free memory
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  // Submit feedback
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    const trimmedEmail = email.trim();

    if (!trimmedMessage || isSending) return;
    setSubmitError(null);

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
          setSubmitError(`Du kannst in ${remainingSeconds} Sekunden erneut Feedback senden.`);
          return;
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    setIsSending(true);

    // Build FormData for multipart/form-data submission
    const formData = new FormData();
    formData.append("message", trimmedMessage);
    formData.append("type", type);
    if (trimmedEmail) {
      formData.append("email", trimmedEmail);
    }
    formData.append(
      "context",
      typeof window !== "undefined" ? window.location.pathname : "unknown",
    );
    formData.append(
      "userAgent",
      typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    );

    // Add attachments
    attachments.forEach((attachment) => {
      formData.append(`attachments`, attachment.file);
    });

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        body: formData, // No Content-Type header - browser sets it with boundary
      });

      let result: { success?: boolean; error?: string; attachmentCount?: number } = {};
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
        } else if (response.status === 413) {
          errorMessage = "Anhänge zu groß. Bitte reduziere die Anzahl oder Größe der Bilder.";
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

      // Clean up preview URLs
      attachments.forEach((a) => URL.revokeObjectURL(a.previewUrl));

      toasts.push({
        kind: "success",
        title: "Feedback gesendet",
        message:
          attachments.length > 0
            ? `Danke! Dein Feedback inkl. ${attachments.length} Anhang/Anhänge wurde gesendet.`
            : trimmedEmail
              ? "Danke! Wir melden uns bei dir zurück."
              : "Danke für dein anonymes Feedback!",
      });

      setMessage("");
      setEmail("");
      setAttachments([]);
      setSubmitError(null);
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
      setSubmitError(errorMessage);
      setIsSending(false);
    }
  };

  const statusMessage = isSending
    ? "Feedback wird gesendet."
    : isCompressing
      ? "Bilder werden optimiert."
      : null;
  const activeType = FEEDBACK_TYPES.find((item) => item.id === type) ?? FEEDBACK_TYPES[0];
  const attachmentLimitReached = attachments.length >= IMAGE_CONFIG.MAX_FILES;

  return (
    <div className="relative isolate mx-auto flex min-h-full w-full max-w-3xl flex-col gap-4 pb-4xl">
      <div
        className="pointer-events-none absolute left-1/2 top-0 hidden h-56 w-56 -translate-x-1/2 rounded-full blur-3xl sm:block"
        style={{
          background:
            "radial-gradient(circle, rgba(251,191,36,0.16) 0%, rgba(236,72,153,0.08) 55%, transparent 72%)",
          opacity: 0.45,
        }}
        aria-hidden="true"
      />

      <PageHero
        title="Deine Meinung zählt"
        titleAs="h1"
        eyebrow="Feedback"
        description="Sag uns einfach, was gut läuft, wo es hakt oder was dir noch fehlt. Du kannst anonym bleiben und bei Bedarf Screenshots mitsenden."
        countLabel="Direkt an das Team"
        icon={<MessageSquare className="h-5 w-5" />}
        gradientStyle="linear-gradient(135deg, rgba(251,191,36,0.14) 0%, rgba(236,72,153,0.08) 55%, rgba(15,23,42,0.18) 100%)"
        meta={
          <>
            <Badge className="rounded-full border-white/10 bg-white/[0.06] text-ink-primary">
              Anonym möglich
            </Badge>
            <Badge className="rounded-full border-white/10 bg-white/[0.06] text-ink-secondary">
              Screenshots erlaubt
            </Badge>
          </>
        }
      >
        <div className="grid gap-2 sm:grid-cols-3">
          <PageHeroStat
            label="Dauer"
            value="~1 Minute"
            helper="Kurze Hinweise reichen völlig aus."
            icon={<Send className="h-4 w-4" />}
          />
          <PageHeroStat
            label="Antwort"
            value="E-Mail optional"
            helper="Nur angeben, wenn du Rückmeldung möchtest."
            icon={<MessageSquare className="h-4 w-4" />}
          />
          <PageHeroStat
            label="Anhänge"
            value={`${attachments.length}/${IMAGE_CONFIG.MAX_FILES}`}
            helper="Bilder werden automatisch verkleinert und optimiert."
            icon={<ImageIcon className="h-4 w-4" />}
          />
        </div>
      </PageHero>

      {submitError ? (
        <InfoBanner variant="error" title="Senden fehlgeschlagen" className="rounded-[24px]">
          {submitError}
        </InfoBanner>
      ) : null}

      {statusMessage ? (
        <InfoBanner title="Status" className="rounded-[24px]">
          {statusMessage}
        </InfoBanner>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {statusMessage ?? (submitError ? `Fehler: ${submitError}` : "")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="rounded-[28px] border-white/[0.10] bg-surface-1/82 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.76)] ring-1 ring-inset ring-white/[0.04] sm:backdrop-blur-xl">
          <fieldset className="space-y-4">
            <legend className="sr-only">Worum geht es?</legend>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-primary">Worum geht es?</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                  Wähle kurz den Bereich, damit dein Hinweis schneller an der richtigen Stelle
                  landet.
                </p>
              </div>
              <Badge className="rounded-full border-white/10 bg-white/[0.06] px-3 py-1.5 text-ink-primary">
                Typ: {activeType.label}
              </Badge>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {FEEDBACK_TYPES.map((item) => {
                const Icon = item.icon;
                const isSelected = type === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "flex min-h-[88px] items-center gap-3 rounded-[22px] border px-4 py-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
                      isSelected
                        ? "border-accent-primary/45 bg-white/[0.07] shadow-[0_16px_30px_-24px_rgba(251,191,36,0.45)]"
                        : "border-white/[0.08] bg-black/[0.10] hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.06]",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.06] shadow-inner",
                        isSelected && "border-white/[0.12] bg-white/[0.10]",
                      )}
                    >
                      <Icon
                        className={cn("h-5 w-5", isSelected ? item.color : "text-ink-tertiary")}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-primary">{item.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-tertiary">
                        {item.id === "idea"
                          ? "Neue Idee oder Verbesserung"
                          : item.id === "bug"
                            ? "Fehler, Problem oder Defekt"
                            : item.id === "ui"
                              ? "Layout, Lesbarkeit oder Bedienung"
                              : "Alles, was nicht in die anderen Gruppen passt"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </Card>

        <Card className="rounded-[28px] border-white/[0.10] bg-surface-1/82 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.76)] ring-1 ring-inset ring-white/[0.04] sm:backdrop-blur-xl">
          <section className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="feedback-message" className="text-sm font-semibold text-ink-primary">
                Deine Nachricht
              </label>
              <p className="text-sm leading-relaxed text-ink-secondary">
                Beschreibe knapp, was du beobachtet hast oder was du dir wünschst. Ein paar klare
                Sätze reichen.
              </p>
            </div>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Beschreibe deine Idee oder das Problem..."
              className="min-h-[180px] rounded-[22px] border-white/[0.12] bg-black/[0.10] px-4 py-4 text-sm text-ink-primary placeholder:text-ink-tertiary shadow-inner focus-visible:ring-accent-primary/50"
              required
            />
          </section>
        </Card>

        <Card className="rounded-[28px] border-white/[0.10] bg-surface-1/82 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.76)] ring-1 ring-inset ring-white/[0.04] sm:backdrop-blur-xl">
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-primary">Screenshots</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                  Optional, aber oft hilfreich. Bilder werden vor dem Senden automatisch
                  verkleinert.
                </p>
              </div>
              <Badge className="rounded-full border-white/10 bg-white/[0.06] px-3 py-1.5 text-ink-secondary">
                {attachments.length}/{IMAGE_CONFIG.MAX_FILES}
              </Badge>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isCompressing || attachmentLimitReached}
            />

            <Button
              type="button"
              variant="glass"
              size="default"
              onClick={() => fileInputRef.current?.click()}
              disabled={isCompressing || attachmentLimitReached}
              className="w-full justify-center gap-2 rounded-2xl"
            >
              <ImageIcon className="h-4 w-4" />
              {isCompressing
                ? "Bilder werden optimiert..."
                : attachmentLimitReached
                  ? `Maximum erreicht (${IMAGE_CONFIG.MAX_FILES})`
                  : "Screenshot hinzufügen"}
            </Button>

            {attachments.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-white/[0.10] bg-black/[0.08] px-4 py-5 text-sm text-ink-tertiary shadow-inner">
                Noch keine Screenshots hinzugefügt.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="group relative overflow-hidden rounded-[22px] border border-white/[0.10] bg-black/[0.12] shadow-[0_12px_26px_-22px_rgba(0,0,0,0.85)]"
                  >
                    <img
                      src={attachment.previewUrl}
                      alt={attachment.file.name}
                      className="h-28 w-full object-cover"
                    />
                    <div className="space-y-1 px-3 py-3">
                      <p className="truncate text-xs font-medium text-ink-primary">
                        {attachment.file.name}
                      </p>
                      <p className="text-xs text-ink-tertiary">
                        {formatFileSize(attachment.file.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full border border-status-error/30 bg-status-error/85 text-white shadow-md transition-colors hover:bg-status-error"
                      aria-label="Bild entfernen"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs leading-relaxed text-ink-tertiary">
              Max. {IMAGE_CONFIG.MAX_FILES} Bilder, je {IMAGE_CONFIG.MAX_FILE_SIZE_MB} MB. Bilder
              werden automatisch optimiert.
            </p>
          </section>
        </Card>

        <Card className="rounded-[28px] border-white/[0.10] bg-surface-1/82 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.76)] ring-1 ring-inset ring-white/[0.04] sm:backdrop-blur-xl">
          <section className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="feedback-email" className="text-sm font-semibold text-ink-primary">
                E-Mail (optional)
              </label>
              <p className="text-sm leading-relaxed text-ink-secondary">
                Nur eintragen, wenn du eine Rückmeldung möchtest. Ohne E-Mail bleibt dein Feedback
                anonym.
              </p>
            </div>
            <Input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nur wenn du eine Antwort möchtest..."
              className="rounded-[22px] border-white/[0.12] bg-black/[0.10]"
            />

            <div className="rounded-[22px] border border-white/[0.08] bg-black/[0.10] px-4 py-4 shadow-inner">
              <p className="text-xs leading-relaxed text-ink-secondary">
                Technische Details wie Browser und Gerät werden anonymisiert mitgeschickt, damit
                Fehler schneller nachvollzogen werden können. Screenshots werden nur zur Bearbeitung
                deines Feedbacks genutzt.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSending || !message.trim() || isCompressing}
              aria-busy={isSending}
              className="w-full gap-2"
            >
              <Send className="h-4 w-4" />
              {isSending ? "Wird gesendet..." : "Feedback absenden"}
            </Button>
          </section>
        </Card>
      </form>
    </div>
  );
}
