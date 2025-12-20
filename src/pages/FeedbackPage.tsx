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
import { Button, Card, useToasts } from "@/ui";

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

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="flex flex-col items-center justify-center min-h-full p-4 overflow-y-auto">
      <Card className="w-full max-w-lg" padding="lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-ink-primary">Deine Meinung zählt</h1>
          <p className="text-sm text-ink-secondary mt-2">
            Hilf uns, Disa AI besser zu machen. Was funktioniert gut? Was fehlt dir?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type Selection */}
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

          {/* Message Textarea */}
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

          {/* Screenshot Attachments */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-tertiary">
              Screenshots (optional)
            </label>

            {/* File Input (hidden) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={isCompressing || attachments.length >= IMAGE_CONFIG.MAX_FILES}
            />

            {/* Add Screenshot Button */}
            <Button
              type="button"
              variant="secondary"
              size="default"
              onClick={() => fileInputRef.current?.click()}
              disabled={isCompressing || attachments.length >= IMAGE_CONFIG.MAX_FILES}
              className="w-full"
            >
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                {isCompressing
                  ? "Bilder werden optimiert..."
                  : attachments.length >= IMAGE_CONFIG.MAX_FILES
                    ? `Maximum erreicht (${IMAGE_CONFIG.MAX_FILES})`
                    : "Screenshot hinzufügen"}
              </div>
            </Button>

            {/* Attachment Previews */}
            {attachments.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="relative group bg-surface-2 border border-white/10 rounded-lg overflow-hidden"
                  >
                    {/* Preview Image */}
                    <img
                      src={attachment.previewUrl}
                      alt={attachment.file.name}
                      className="w-full h-24 object-cover"
                    />

                    {/* File Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                      <p className="text-xs text-white truncate">{attachment.file.name}</p>
                      <p className="text-xs text-white/70">
                        {formatFileSize(attachment.file.size)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      className="absolute top-1 right-1 bg-status-error/90 hover:bg-status-error text-white rounded-full p-1 transition-colors"
                      aria-label="Bild entfernen"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Help Text */}
            <p className="text-xs text-ink-tertiary">
              Max. {IMAGE_CONFIG.MAX_FILES} Bilder, je {IMAGE_CONFIG.MAX_FILE_SIZE_MB} MB. Bilder
              werden automatisch optimiert.
            </p>
          </div>

          {/* Email Input */}
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

          {/* Privacy Info */}
          <div className="rounded-lg bg-surface-2/50 p-3 text-xs text-ink-secondary border border-white/5">
            <p>
              Technische Details (Browser, Gerät) werden anonymisiert angehängt, um Fehler schneller
              zu finden. Screenshots werden sicher übertragen und nicht für andere Zwecke verwendet.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSending || !message.trim() || isCompressing}
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
  );
}
