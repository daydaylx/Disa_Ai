/**
 * Vision API Client
 *
 * Handles client-side communication with the /api/vision endpoint.
 * This routes vision requests through our Cloudflare Pages Function
 * to keep the Z.AI API key secure on the server side.
 */

import type { VisionAttachment } from "@/types/chat";
import { mapError } from "@/lib/errors";

/**
 * Vision API request payload
 */
export interface VisionRequest {
  prompt: string;
  imageDataUrl: string;
  mimeType: string;
  filename?: string;
}

/**
 * Vision API response (success)
 */
export interface VisionResponse {
  text: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  model: string;
}

/**
 * Vision API error response
 */
export interface VisionErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

/**
 * Vision API configuration
 */
const VISION_API_ENDPOINT = "/api/vision";
const REQUEST_TIMEOUT_MS = 45000; // 45 seconds timeout

/**
 * Custom error for Vision API failures
 */
export class VisionApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "VisionApiError";
  }
}

/**
 * Sends a vision request to the server-side API
 * @param prompt - The text prompt to accompany the image
 * @param attachment - The image attachment
 * @param signal - Optional AbortSignal for request cancellation
 * @returns Promise resolving to VisionResponse
 * @throws VisionApiError on failure
 */
export async function sendVisionRequest(
  prompt: string,
  attachment: VisionAttachment,
  signal?: AbortSignal,
): Promise<VisionResponse> {
  try {
    // Validate inputs
    if (!prompt || prompt.trim().length === 0) {
      throw new VisionApiError("Prompt darf nicht leer sein", 400, "EMPTY_PROMPT");
    }

    if (!attachment || !attachment.dataUrl) {
      throw new VisionApiError("Kein Bild angehängt", 400, "NO_IMAGE");
    }

    // Build request payload
    const payload: VisionRequest = {
      prompt: prompt.trim(),
      imageDataUrl: attachment.dataUrl,
      mimeType: attachment.mimeType,
      filename: attachment.filename,
    };

    // Create abort controller if not provided
    const controller = new AbortController();
    const effectiveSignal = signal ? signal : controller.signal;

    // Set timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    // Make request
    const response = await fetch(VISION_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: effectiveSignal,
    });

    clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `Vision API Error: ${response.status} ${response.statusText}`;
      let errorCode = `HTTP_${response.status}`;

      try {
        const errorData = (await response.json()) as VisionErrorResponse;
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        }
        if (errorData?.error?.code) {
          errorCode = errorData.error.code;
        }
      } catch {
        // If we can't parse the error, use the status text
      }

      throw new VisionApiError(errorMessage, response.status, errorCode);
    }

    // Parse successful response
    const data = (await response.json()) as VisionResponse;

    // Validate response structure
    if (!data.text || typeof data.text !== "string") {
      throw new VisionApiError(
        "Ungültige Antwort vom Server: Fehlender Text",
        500,
        "INVALID_RESPONSE",
      );
    }

    return data;
  } catch (error) {
    // Re-throw VisionApiError
    if (error instanceof VisionApiError) {
      throw error;
    }

    // Handle abort errors
    if (error instanceof Error && error.name === "AbortError") {
      throw new VisionApiError("Anfrage abgebrochen", 0, "ABORTED");
    }

    // Map other errors
    throw new VisionApiError(
      mapError(error).message || "Ein unerwarteter Fehler ist aufgetreten",
      undefined,
      "UNKNOWN_ERROR",
    );
  }
}

/**
 * Validates a vision request payload before sending
 * @param prompt - The text prompt
 * @param attachment - The image attachment
 * @returns Object with isValid flag and optional error message
 */
export function validateVisionRequest(
  prompt: string,
  attachment?: VisionAttachment,
): { isValid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { isValid: false, error: "Bitte gib einen Text ein" };
  }

  if (!attachment || !attachment.dataUrl) {
    return { isValid: false, error: "Bitte hänge ein Bild an" };
  }

  return { isValid: true };
}