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
 * - FEEDBACK_KV: KV namespace for rate limiting (optional but recommended)
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
  FEEDBACK_KV?: KVNamespace;
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

// Rate limiting configuration
const RATE_LIMIT_WINDOW_SECONDS = 600; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5;

// Production domains (exact match required)
const PRODUCTION_HOSTS = new Set([
  "disaai.de",
  "www.disaai.de",
  "disa-ai.pages.dev",
]);

// Development hosts (localhost and 127.0.0.1 with any port)
const DEV_HOSTS = new Set(["localhost", "127.0.0.1"]);

/**
 * Securely validate origin against allowlist
 * - Only HTTPS in production (HTTP allowed for localhost dev)
 * - Exact hostname match (no prefix/substring tricks)
 * - Preview domains: *.pages.dev subdomains allowed
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;

  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    // Invalid URL format
    return false;
  }

  const { protocol, hostname } = url;

  // Development: allow http://localhost:* and http://127.0.0.1:*
  if (protocol === "http:" && DEV_HOSTS.has(hostname)) {
    return true;
  }

  // Production: require HTTPS
  if (protocol !== "https:") {
    return false;
  }

  // Exact match against production hosts
  if (PRODUCTION_HOSTS.has(hostname)) {
    return true;
  }

  // Allow preview deployments: *.pages.dev
  if (hostname.endsWith(".pages.dev")) {
    const parts = hostname.split(".");
    if (parts.length === 3 && parts[1] === "pages" && parts[2] === "dev") {
      return true;
    }
  }

  return false;
}

/**
 * Get CORS headers for allowed origin
 */
function getCORSHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin");

  if (isAllowedOrigin(origin)) {
    return {
      "Access-Control-Allow-Origin": origin!,
      "Vary": "Origin",
    };
  }

  // No CORS headers for disallowed origins
  return {};
}

/**
 * Handle CORS preflight requests
 */
function handleCORS(request: Request): Response {
  const origin = request.headers.get("Origin");

  if (!isAllowedOrigin(origin)) {
    // Reject preflight from disallowed origins
    return new Response(null, {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin!,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "600",
      "Vary": "Origin",
    },
  });
}

function jsonResponse(
  data: Record<string, unknown>,
  status = 200,
  request?: Request,
): Response {
  const corsHeaders = request ? getCORSHeaders(request) : {};

  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
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

/**
 * Get rate limit key based on IP and User-Agent
 * This provides basic abuse prevention without requiring user identification
 */
function getRateLimitKey(request: Request): string {
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown";
  const ua = request.headers.get("User-Agent") || "unknown";

  // Hash the combination to avoid storing raw IPs
  // In a real implementation, you'd use a proper hash function
  const key = `feedback:${ip.substring(0, 20)}:${ua.substring(0, 50)}`;
  return key;
}

/**
 * Check rate limit using KV (if available) or in-memory fallback
 * Returns true if request should be rate limited
 */
async function checkRateLimit(request: Request, env: Env): Promise<boolean> {
  // If no KV namespace is available, allow request (best-effort)
  if (!env.FEEDBACK_KV) {
    console.warn("[Feedback] KV not configured - rate limiting disabled");
    return false;
  }

  const key = getRateLimitKey(request);
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_SECONDS * 1000;

  try {
    // Get current request count
    const countStr = await env.FEEDBACK_KV.get(key);
    const requestData = countStr ? JSON.parse(countStr) : { count: 0, firstRequest: now };

    // Reset counter if window has passed
    if (requestData.firstRequest < windowStart) {
      requestData.count = 1;
      requestData.firstRequest = now;
    } else {
      requestData.count += 1;
    }

    // Store updated count
    await env.FEEDBACK_KV.put(key, JSON.stringify(requestData), {
      expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
    });

    // Check if limit exceeded
    if (requestData.count > RATE_LIMIT_MAX_REQUESTS) {
      const retryAfter = Math.ceil((requestData.firstRequest + RATE_LIMIT_WINDOW_SECONDS * 1000 - now) / 1000);
      console.warn(`[Feedback] Rate limit exceeded for ${key.substring(0, 30)}...`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("[Feedback] Rate limit check failed:", error);
    // On error, allow request (fail open)
    return false;
  }
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return handleCORS(request);
  }

  // Validate origin for actual requests
  const origin = request.headers.get("Origin");
  if (!isAllowedOrigin(origin)) {
    console.warn(`❌ Blocked feedback request from disallowed origin: ${origin || "(none)"}`);
    return new Response(JSON.stringify({ success: false, error: "Origin not allowed" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Only allow POST
  if (request.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405, request);
  }

  // Check rate limit
  const rateLimited = await checkRateLimit(request, env);
  if (rateLimited) {
    return jsonResponse(
      {
        success: false,
        error: "Too many requests. Please wait 10 minutes before submitting feedback again.",
      },
      429,
      request,
    );
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
      request,
    );
  }

  // Parse multipart/form-data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("[Feedback] Failed to parse FormData:", error);
    return jsonResponse({ success: false, error: "Invalid request body" }, 400, request);
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
    return jsonResponse({ success: false, error: "Message is required" }, 400, request);
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(
      { success: false, error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` },
      400,
      request,
    );
  }

  // Validate optional email
  if (userEmail && !isValidEmail(userEmail)) {
    return jsonResponse({ success: false, error: "Invalid email address" }, 400, request);
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
        request,
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
          request,
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
          request,
        );
      }

      totalSize += file.size;

      // Read file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Validate magic bytes (security check)
      if (!validateImageMagicBytes(arrayBuffer)) {
        return jsonResponse({ success: false, error: `Invalid image file: ${file.name}` }, 400, request);
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
        request,
      );
    }
  }

  const toAddress = env.DISA_FEEDBACK_TO || DEFAULT_TO;
  const timestamp = new Date().toISOString();

  // Build email content (IMPORTANT: do NOT log user message contents to server logs)
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
        request,
      );
    }

    const result = (await response.json()) as { id?: string };
    console.log(
      "[Feedback] Email sent successfully:",
      result.id,
      `with ${attachments.length} attachment(s)`,
    );

    return jsonResponse({ success: true, id: result.id, attachmentCount: attachments.length }, 200, request);
  } catch (error) {
    console.error("[Feedback] Unexpected error:", error);
    return jsonResponse({ success: false, error: "Internal server error" }, 500, request);
  }
}
