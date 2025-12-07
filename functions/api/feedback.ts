/**
 * Cloudflare Pages Function: /api/feedback
 *
 * Accepts feedback from the PWA and sends it via email.
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

interface FeedbackRequestBody {
  message?: unknown;
  email?: unknown;
  context?: unknown;
  userAgent?: unknown;
  type?: unknown;
}

const DEFAULT_TO = "daydayfay05@gmail.com";
const MAX_MESSAGE_LENGTH = 4000;

// Resend free tier uses onboarding@resend.dev, or your verified domain
const DEFAULT_FROM = "Disa AI Feedback <onboarding@resend.dev>";

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

  // Parse request body
  let body: FeedbackRequestBody;
  try {
    body = (await request.json()) as FeedbackRequestBody;
  } catch {
    return jsonResponse({ success: false, error: "Invalid JSON body" }, 400);
  }

  // Validate message
  const rawMessage = typeof body.message === "string" ? body.message : "";
  const message = rawMessage.trim();

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
  const userEmail =
    typeof body.email === "string" && body.email.trim() ? body.email.trim() : undefined;
  if (userEmail && !isValidEmail(userEmail)) {
    return jsonResponse({ success: false, error: "Invalid email address" }, 400);
  }

  // Extract metadata
  const contextInfo = typeof body.context === "string" ? body.context.trim() : undefined;
  const feedbackType = typeof body.type === "string" ? body.type.trim() : "general";
  const userAgent =
    typeof body.userAgent === "string" && body.userAgent.trim()
      ? body.userAgent.trim()
      : request.headers.get("user-agent") || "unknown";

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
    `User-Agent: ${userAgent}`,
    `Zeitstempel: ${timestamp}`,
  ].join("\n");

  // Build Resend API payload
  const resendPayload = {
    from: DEFAULT_FROM,
    to: [toAddress],
    subject: `[Disa AI] ${typeLabel}`,
    html: htmlBody,
    text: textBody,
    ...(userEmail && { reply_to: userEmail }),
  };

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

      // Provide helpful error messages with debug info
      let userMessage = "Failed to send email";
      if (response.status === 401) {
        userMessage = "Invalid API key";
      } else if (response.status === 403) {
        userMessage = `Email sending not authorized: ${JSON.stringify(errorData)}`;
      } else if (response.status === 429) {
        userMessage = "Rate limit exceeded - please try again later";
      } else if (response.status === 422) {
        userMessage = `Validation error: ${JSON.stringify(errorData)}`;
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
    console.log("[Feedback] Email sent successfully:", result.id);

    return jsonResponse({ success: true, id: result.id }, 200);
  } catch (error) {
    console.error("[Feedback] Unexpected error:", error);
    return jsonResponse({ success: false, error: "Internal server error" }, 500);
  }
}
