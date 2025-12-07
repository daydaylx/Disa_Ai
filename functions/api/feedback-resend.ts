// Alternative Feedback Function using Resend.com
// Much simpler setup than MailChannels - just needs API key!

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

const DEFAULT_TO = "disaai@justmail.de";
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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return handleCORS();
  }

  if (request.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  // Check if Resend API key is configured
  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return jsonResponse({ success: false, error: "Email service not configured" }, 500);
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
  const userAgent =
    typeof body.userAgent === "string" && body.userAgent.trim() ? body.userAgent.trim() : undefined;

  const toAddress = env.DISA_FEEDBACK_TO || DEFAULT_TO;

  const htmlBody = `
    <h2>Neue Rückmeldung aus der Disa AI PWA</h2>

    <p><strong>Nachricht (${message.length} Zeichen):</strong></p>
    <p>${message.replace(/\n/g, "<br>")}</p>

    <hr>

    <p><strong>Kategorie:</strong> ${feedbackType || "nicht angegeben"}</p>
    <p><strong>Kontext:</strong> ${contextInfo || "n/a"}</p>
    <p><strong>User-Agent:</strong> ${userAgent || "unbekannt"}</p>
    <p><strong>Kontakt-E-Mail:</strong> ${email || "nicht angegeben"}</p>
    <p><strong>Eingang:</strong> ${new Date().toISOString()}</p>
  `;

  const resendPayload = {
    from: "Disa AI Feedback <feedback@disaai.de>",
    to: [toAddress],
    subject: `New feedback from Disa AI (${feedbackType || "general"})`,
    html: htmlBody,
    ...(email && { reply_to: email }),
  };

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendPayload),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error("Resend error", resendResponse.status, errorData);
      return jsonResponse(
        {
          success: false,
          error: "Failed to send email",
          debug: {
            status: resendResponse.status,
            message: JSON.stringify(errorData).substring(0, 200),
          },
        },
        500,
      );
    }

    return jsonResponse({ success: true }, 200);
  } catch (error) {
    console.error("Unexpected /api/feedback-resend error", error);
    return jsonResponse({ success: false, error: "Internal server error" }, 500);
  }
}
