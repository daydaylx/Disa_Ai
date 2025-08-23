import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// Standard-Mocks:
// - Personas (aus public/persona.json)
const handlers = [
  http.get("http://localhost/persona.json", () =>
    HttpResponse.json({
      personas: [
        { id: "neutral", label: "Neutral", prompt: "You are neutral." },
        { id: "de_scharf", label: "Deutsch – Scharf", prompt: "Sei direkt, kritisch, ohne Floskeln." }
      ]
    })
  ),
];

export const server = setupServer(...handlers);
