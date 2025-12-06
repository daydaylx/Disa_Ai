// Cloudflare Pages Function: /api/feedback
// Accepts feedback payloads from the PWA and relays them as an email via MailChannels.
// Minimal, no persistence; suitable for CF Pages/Workers runtime.

interface Env {
  DISA_FEEDBACK_TO?: string;
  DISA_FEEDBACK_FROM?: string;
}

interface FeedbackRequestBody {
  message?: unknown;
  email?: unknown;
  context?: unknown;
  userAgent?: unknown;
  type?: unknown;
}

const DEFAULT_TO = "disaai@justmail.de";
const DEFAULT_FROM = "feedback@disaai.de";
const MAX_MESSAGE_LENGTH = 4000;

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
  // Basic RFC 5322-ish check, good enough for validation without being too strict
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeMultiline(input: string): string {
  // Collapse any CR/LF that could break email headers. Body keeps newlines later.
  return input.replace(/[\r\n]+/g, "\n").trim();
}

export async function onRequest(context: {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<unknown>) => void;
}): Promise<Response> {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return handleCORS();
  }

  if (request.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  let body: FeedbackRequestBody;
  try {
    body = (await request.json()) as FeedbackRequestBody;
  } catch {
    return jsonResponse({ success: false, error: "Invalid JSON body" }, 400);
  }

  const rawMessage = typeof body.message === "string" ? body.message : "";
  const message = rawMessage.trim();

  if (!message) {
    return jsonResponse({ success: false, error: "Message is required" }, 400);
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse({ success: false, error: "Message is too long" }, 400);
  }

  const email = typeof body.email === "string" && body.email.trim() ? body.email.trim() : undefined;
  if (email && !isValidEmail(email)) {
    return jsonResponse({ success: false, error: "Invalid email address" }, 400);
  }

  const contextInfo = typeof body.context === "string" ? body.context.trim() : undefined;
  const feedbackType = typeof body.type === "string" ? body.type.trim() : undefined;

  const userAgentHeader = request.headers.get("user-agent") || undefined;
  const userAgent =
    typeof body.userAgent === "string" && body.userAgent.trim()
      ? body.userAgent.trim()
      : userAgentHeader;

  const toAddress = env.DISA_FEEDBACK_TO || DEFAULT_TO;
  const fromAddress = env.DISA_FEEDBACK_FROM || DEFAULT_FROM;

  const textBody = [
    "Neue Rückmeldung aus der Disa AI PWA",
    "",
    `Nachricht (Länge ${message.length}):`,
    message,
    "",
    `Kategorie: ${feedbackType || "nicht angegeben"}`,
    `Kontext: ${contextInfo || "n/a"}`,
    `User-Agent: ${userAgent || "unbekannt"}`,
    `Kontakt-E-Mail: ${email || "nicht angegeben"}`,
    `Eingang: ${new Date().toISOString()}`,
  ].join("\n");

  const mailPayload = {
    personalizations: [
      {
        to: [{ email: toAddress }],
      },
    ],
    from: { email: fromAddress, name: "Disa AI Feedback" },
    reply_to: email
      ? { email, name: "Feedback Absender" }
      : { email: fromAddress, name: "Disa AI" },
    subject: "New feedback from Disa AI",
    content: [
      {
        type: "text/plain",
        value: sanitizeMultiline(textBody),
      },
    ],
  };

  try {
    const mailResponse = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mailPayload),
    });

    if (!mailResponse.ok) {
      const errorText = await mailResponse.text();
      console.error("MailChannels error", mailResponse.status, errorText);
      // Return detailed error for debugging
      return jsonResponse(
        {
          success: false,
          error: "Failed to send email",
          debug: {
            status: mailResponse.status,
            message: errorText.substring(0, 200), // First 200 chars only
          },
        },
        500,
      );
    }

    return jsonResponse({ success: true }, 200);
  } catch (error) {
    console.error("Unexpected /api/feedback error", error);
    return jsonResponse({ success: false, error: "Internal server error" }, 500);
  }
}
