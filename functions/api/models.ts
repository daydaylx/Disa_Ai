import type { PagesFunction } from "@cloudflare/workers-types";

const ALLOWED_ORIGIN = "https://disaai.de";

interface Env {
  OPENROUTER_API_KEY: string;
  OPENROUTER_BASE_URL?: string;
}

const createCorsHeaders = (origin: string | null) => {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "content-type, accept");
  headers.set("Access-Control-Max-Age", "86400");
  if (origin === ALLOWED_ORIGIN) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  return headers;
};

// Free-Model-Allowlist - only these models are allowed
export const ALLOWED_FREE_MODELS = [
  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    name: "DeepSeek Chat V3 (0324)",
    description:
      "Sehr starkes Chat-Flaggschiff, gut für lange Diskussionen, weitgehend frei im Ton.",
    price_in: 0,
    price_out: 0,
    context_tokens: 163840,
    quality_score: 85,
    tags: ["chat", "discussion", "long_context", "balanced", "multilingual"],
    notes: "Top Default für Diskussionen.",
  },
  {
    id: "qwen/qwen3-235b-a22b-2507:free",
    name: "Qwen3 235B A22B Instruct (2507)",
    description: "Extrem großer Allround-Chatbot, sehr stabil, stark im Argumentieren.",
    price_in: 0,
    price_out: 0,
    context_tokens: 262144,
    quality_score: 84,
    tags: ["chat", "discussion", "ultra_long_context", "multilingual", "reasoning"],
    notes: "Wenn du richtig lange Threads willst.",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B Instruct",
    description: "Sehr natürliches Dialogmodell, strukturiert, zuverlässig.",
    price_in: 0,
    price_out: 0,
    context_tokens: 131072,
    quality_score: 82,
    tags: ["chat", "discussion", "multilingual", "reliable"],
    notes: "Solider Diskussions-Partner, eher 'standard-safe'.",
  },
  {
    id: "mistralai/mistral-small-3.2-24b-instruct:free",
    name: "Mistral Small 3.2 24B",
    description: "Schnell, klar, gut in Mehrfach-Dialogen ohne nervige Aussetzer.",
    price_in: 0,
    price_out: 0,
    context_tokens: 131072,
    quality_score: 80,
    tags: ["chat", "discussion", "fast", "multilingual"],
    notes: "Guter Mix aus Tempo und Gesprächsqualität.",
  },
  {
    id: "meituan/longcat-flash-chat:free",
    name: "LongCat Flash Chat",
    description: "Sehr schnelles MoE-Chatmodell, überraschend gut bei längeren Diskussionen.",
    price_in: 0,
    price_out: 0,
    context_tokens: 131072,
    quality_score: 77,
    tags: ["chat", "discussion", "fast", "long_context"],
    notes: "Fallback, wenn du Speed willst.",
  },
  {
    id: "meta-llama/llama-3.3-8b-instruct:free",
    name: "Llama 3.3 8B Instruct",
    description: "Kleiner Bruder vom 70B: flott, sauber, aber weniger tief.",
    price_in: 0,
    price_out: 0,
    context_tokens: 128000,
    quality_score: 72,
    tags: ["chat", "discussion", "fast", "lightweight"],
    notes: "Für schnelle kurze Diskussionen.",
  },
  {
    id: "google/gemma-3-27b-it:free",
    name: "Gemma 3 27B IT",
    description: "Freundliches, ordentliches Dialogmodell. Eher vorsichtig bei heiklen Themen.",
    price_in: 0,
    price_out: 0,
    context_tokens: 131072,
    quality_score: 78,
    tags: ["chat", "discussion", "polite", "multilingual"],
    notes: "Sauberer Ton, aber klar mehr Filter.",
  },
  {
    id: "mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B Instruct",
    description: "Kleines, flinkes Modell für kurze Dialoge und leichte Diskussionen.",
    price_in: 0,
    price_out: 0,
    context_tokens: 32768,
    quality_score: 70,
    tags: ["chat", "discussion", "small", "fast"],
    notes: "Kleines, flinkes Modell für kurze Dialoge und leichte Diskussionen.",
  },
  {
    id: "tencent/hunyuan-a13b-instruct:free",
    name: "Hunyuan A13B Instruct",
    description: "Allround-Chat, ruhig im Stil, gute Erklärungen.",
    price_in: 0,
    price_out: 0,
    context_tokens: 32768,
    quality_score: 74,
    tags: ["chat", "discussion", "balanced", "multilingual"],
    notes: "Solider Free-Allrounder.",
  },
  {
    id: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
    name: "Dolphin Mistral 24B Venice (Uncensored)",
    description:
      "Sehr offen/ungefiltert. Gut für kontroverse Diskussionen, aber braucht deine Leitplanken.",
    price_in: 0,
    price_out: 0,
    context_tokens: 32768,
    quality_score: 76,
    tags: ["chat", "discussion", "uncensored", "roleplay"],
    notes: "NoFilter-Slot. Deutlich markieren.",
  },
] as const;

// Extract just the model IDs for validation in chat.ts
export const ALLOWED_FREE_MODEL_IDS = ALLOWED_FREE_MODELS.map((model) => model.id);

export const onRequestOptions: PagesFunction = async ({ request }) => {
  const corsHeaders = createCorsHeaders(request.headers.get("Origin"));
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestGet: PagesFunction<Env> = async ({ request }) => {
  const origin = request.headers.get("Origin");
  const corsHeaders = createCorsHeaders(origin);

  try {
    // Return only free models
    return new Response(JSON.stringify(ALLOWED_FREE_MODELS), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Failed to get models:", error);
    corsHeaders.set("Content-Type", "application/json");
    corsHeaders.set("Cache-Control", "no-store");
    return new Response(JSON.stringify({ error: "Unable to fetch models." }), {
      status: 502,
      headers: corsHeaders,
    });
  }
};
