/**
 * Cloudflare Pages Function: /api/feedback
 *
 * Accepts feedback from the PWA and sends it via email with optional screenshot attachments.
 * Uses Resend.com API (recommended) - simple and reliable.
 *
 * Environment Variables Required (Cloudflare Secrets):
 * - RESEND_API_KEY: Your Resend.com API key (get it at https://resend.com)
 *
 * Optional Environment Variables:
 * - DISA_FEEDBACK_TO: Recipient email address (default: disaai@justmail.de)
 *
 * Setup Instructions:
 * 1. Create account at https://resend.com (free tier: 100 emails/day)
 * 2. Get API key from Resend dashboard
 * 3. Add RESEND_API_KEY to Cloudflare Pages > Settings > Environment Variables
 * 4. For custom from address: verify domain in Resend dashboard
 *
 * @see https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/
 */

interface Env {
  RESEND_API_KEY?: string;
  DISA_FEEDBACK_TO?: string;
}

interface ResendAttachment {
  filename: string;
  content: string; // base64
}

const DEFAULT_TO = "daydayfay05@gmail.com";
const MAX_MESSAGE_LENGTH = 4000;
const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_SIZE_MB = 5;
const MAX_TOTAL_ATTACHMENT_SIZE_MB = 15;

// Resend free tier uses onboarding@resend.dev, or your verified domain
const DEFAULT_FROM = "Disa AI Feedback <onboarding@resend.dev>";

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

function handleCORS(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "86400",
    },
  });
}

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validate image file based on MIME type and magic bytes
 */
function validateImageMimeType(type: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(type);
}

/**
 * Check magic bytes of image buffer
 */
function validateImageMagicBytes(buffer: ArrayBuffer): boolean {
  const arr = new Uint8Array(buffer);

  // PNG: 89 50 4E 47
  if (arr.length >= 4 && arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4e && arr[3] === 0x47) {
    return true;
  }

  // JPEG: FF D8 FF
  if (arr.length >= 3 && arr[0] === 0xff && arr[1] === 0xd8 && arr[2] === 0xff) {
    return true;
  }

  // WebP: 52 49 46 46 ... 57 45 42 50
  if (
    arr.length >= 12 &&
    arr[0] === 0x52 &&
    arr[1] === 0x49 &&
    arr[2] === 0x46 &&
    arr[3] === 0x46 &&
    arr[8] === 0x57 &&
    arr[9] === 0x45 &&
    arr[10] === 0x42 &&
    arr[11] === 0x50
  ) {
    return true;
  }

  return false;
}

/**
 * Convert ArrayBuffer to base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return handleCORS();
  }

  // Only allow POST
  if (request.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  // Check if Resend API key is configured
  if (!env.RESEND_API_KEY) {
    console.error("[Feedback] RESEND_API_KEY not configured");
    return jsonResponse(
      {
        success: false,
        error: "Email service not configured",
        hint: "Please set RESEND_API_KEY in Cloudflare Pages environment variables",
      },
      500,
    );
  }

  // Parse multipart/form-data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("[Feedback] Failed to parse FormData:", error);
    return jsonResponse({ success: false, error: "Invalid request body" }, 400);
  }

  // Extract fields
  const message = (formData.get("message") as string)?.trim() || "";
  const userEmail = (formData.get("email") as string)?.trim() || "";
  const feedbackType = (formData.get("type") as string)?.trim() || "general";
  const contextInfo = (formData.get("context") as string)?.trim() || "";
  const userAgent =
    (formData.get("userAgent") as string)?.trim() || request.headers.get("user-agent") || "unknown";

  // Validate message
  if (!message) {
    return jsonResponse({ success: false, error: "Message is required" }, 400);
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(
      { success: false, error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` },
      400,
    );
  }

  // Validate optional email
  if (userEmail && !isValidEmail(userEmail)) {
    return jsonResponse({ success: false, error: "Invalid email address" }, 400);
  }

  // Process attachments
  const attachments: ResendAttachment[] = [];
  const attachmentFiles = formData.getAll("attachments") as File[];

  if (attachmentFiles.length > 0) {
    // Validate count
    if (attachmentFiles.length > MAX_ATTACHMENTS) {
      return jsonResponse(
        { success: false, error: `Too many attachments (max ${MAX_ATTACHMENTS})` },
        400,
      );
    }

    let totalSize = 0;

    for (const file of attachmentFiles) {
      // Skip empty files
      if (!file || file.size === 0) continue;

      // Validate MIME type
      if (!validateImageMimeType(file.type)) {
        return jsonResponse(
          { success: false, error: `Invalid file type: ${file.type}. Allowed: PNG, JPEG, WebP` },
          400,
        );
      }

      // Validate individual size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_ATTACHMENT_SIZE_MB) {
        return jsonResponse(
          {
            success: false,
            error: `Attachment too large: ${file.name} (${sizeMB.toFixed(1)} MB). Max: ${MAX_ATTACHMENT_SIZE_MB} MB`,
          },
          400,
        );
      }

      totalSize += file.size;

      // Read file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Validate magic bytes (security check)
      if (!validateImageMagicBytes(arrayBuffer)) {
        return jsonResponse({ success: false, error: `Invalid image file: ${file.name}` }, 400);
      }

      // Convert to base64
      const base64Content = arrayBufferToBase64(arrayBuffer);

      attachments.push({
        filename: file.name,
        content: base64Content,
      });
    }

    // Validate total size
    const totalSizeMB = totalSize / (1024 * 1024);
    if (totalSizeMB > MAX_TOTAL_ATTACHMENT_SIZE_MB) {
      return jsonResponse(
        {
          success: false,
          error: `Total attachments too large (${totalSizeMB.toFixed(1)} MB). Max: ${MAX_TOTAL_ATTACHMENT_SIZE_MB} MB`,
        },
        413,
      );
    }
  }

  const toAddress = env.DISA_FEEDBACK_TO || DEFAULT_TO;
  const timestamp = new Date().toISOString();

  // Build email content
  const typeLabel =
    {
      idea: "💡 Idee",
      bug: "🐛 Fehlermeldung",
      ui: "🎨 Design-Feedback",
      other: "📝 Sonstiges",
    }[feedbackType] || "📝 Feedback";

  const attachmentInfo =
    attachments.length > 0
      ? `<div class="meta-item"><span class="label">Anhänge:</span> ${attachments.length} Screenshot(s)</div>`
      : "";

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; border-top: none; border-radius: 0 0 8px 8px; }
    .message { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; margin: 15px 0; white-space: pre-wrap; }
    .meta { font-size: 13px; color: #6c757d; margin-top: 20px; }
    .meta-item { margin: 5px 0; }
    .label { font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <h2 style="margin: 0;">${typeLabel}</h2>
    <p style="margin: 5px 0 0 0; opacity: 0.9;">Neues Feedback aus Disa AI</p>
  </div>
  <div class="content">
    <div class="message">${escapeHtml(message)}</div>
    <div class="meta">
      <div class="meta-item"><span class="label">Kategorie:</span> ${escapeHtml(feedbackType)}</div>
      <div class="meta-item"><span class="label">Kontext:</span> ${escapeHtml(contextInfo || "n/a")}</div>
      <div class="meta-item"><span class="label">Kontakt:</span> ${userEmail ? escapeHtml(userEmail) : "anonym"}</div>
      ${attachmentInfo}
      <div class="meta-item"><span class="label">User-Agent:</span> ${escapeHtml(userAgent)}</div>
      <div class="meta-item"><span class="label">Zeitstempel:</span> ${timestamp}</div>
    </div>
  </div>
</body>
</html>
  `.trim();

  // Plain text fallback
  const textBody = [
    `${typeLabel} - Neues Feedback aus Disa AI`,
    "",
    `Nachricht (${message.length} Zeichen):`,
    message,
    "",
    `---`,
    `Kategorie: ${feedbackType}`,
    `Kontext: ${contextInfo || "n/a"}`,
    `Kontakt: ${userEmail || "anonym"}`,
    attachments.length > 0 ? `Anhänge: ${attachments.length} Screenshot(s)` : "",
    `User-Agent: ${userAgent}`,
    `Zeitstempel: ${timestamp}`,
  ]
    .filter(Boolean)
    .join("\n");

  // Build Resend API payload
  const resendPayload: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    text: string;
    reply_to?: string;
    attachments?: ResendAttachment[];
  } = {
    from: DEFAULT_FROM,
    to: [toAddress],
    subject: `[Disa AI] ${typeLabel}`,
    html: htmlBody,
    text: textBody,
  };

  if (userEmail) {
    resendPayload.reply_to = userEmail;
  }

  if (attachments.length > 0) {
    resendPayload.attachments = attachments;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendPayload),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      console.error("[Feedback] Resend API error:", response.status, errorData);

      // Provide helpful error messages
      let userMessage = "Failed to send email";
      if (response.status === 401) {
        userMessage = "Invalid API key";
      } else if (response.status === 403) {
        userMessage = "Email sending not authorized";
      } else if (response.status === 413) {
        userMessage = "Attachments too large";
      } else if (response.status === 429) {
        userMessage = "Rate limit exceeded - please try again later";
      } else if (response.status === 422) {
        userMessage = "Validation error";
      }

      return jsonResponse(
        {
          success: false,
          error: userMessage,
        },
        500,
      );
    }

    const result = (await response.json()) as { id?: string };
    console.log(
      "[Feedback] Email sent successfully:",
      result.id,
      `with ${attachments.length} attachment(s)`,
    );

    return jsonResponse({ success: true, id: result.id, attachmentCount: attachments.length }, 200);
  } catch (error) {
    console.error("[Feedback] Unexpected error:", error);
    return jsonResponse({ success: false, error: "Internal server error" }, 500);
  }
}
