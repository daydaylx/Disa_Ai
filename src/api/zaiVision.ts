/**
 * Z.ai Vision API Client
 *
 * Handles image analysis requests via the server-side proxy at /api/zai/vision.
 * The Z.ai API key is never exposed to the client.
 */

import { mapError } from "../lib/errors";

// Configuration
const VISION_API_ENDPOINT = "/api/zai/vision";
const REQUEST_TIMEOUT_MS = 65000; // Slightly longer than server timeout

// Limits (should match server-side)
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const MAX_PROMPT_LENGTH = 2000;
export const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

/**
 * Response from Z.ai Vision API
 */
export interface VisionResponse {
  success: boolean;
  text?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
  code?: string;
}

/**
 * Error codes returned by the API
 */
export type VisionErrorCode =
  | "METHOD_NOT_ALLOWED"
  | "CONFIG_ERROR"
  | "INVALID_JSON"
  | "MISSING_PROMPT"
  | "PROMPT_TOO_LONG"
  | "MISSING_IMAGE"
  | "INVALID_IMAGE_FORMAT"
  | "UNSUPPORTED_IMAGE_TYPE"
  | "IMAGE_TOO_LARGE"
  | "TIMEOUT"
  | "AUTH_ERROR"
  | "RATE_LIMITED"
  | "PAYLOAD_TOO_LARGE"
  | "PARSE_ERROR"
  | "EMPTY_RESPONSE"
  | "ZAI_API_ERROR"
  | "INTERNAL_ERROR"
  | "NETWORK_ERROR";

/**
 * Custom error class for Vision API errors
 */
export class VisionApiError extends Error {
  public readonly code: VisionErrorCode;
  public readonly statusCode?: number;

  constructor(message: string, code: VisionErrorCode, statusCode?: number) {
    super(message);
    this.name = "VisionApiError";
    this.code = code;
    this.statusCode = statusCode;
  }

  /**
   * Get user-friendly error message in German
   */
  getUserMessage(): string {
    switch (this.code) {
      case "NETWORK_ERROR":
        return "Netzwerkfehler: Bitte überprüfe deine Internetverbindung.";
      case "TIMEOUT":
        return "Zeitüberschreitung: Die Bildanalyse dauert zu lange. Bitte versuche es erneut.";
      case "RATE_LIMITED":
        return "Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut.";
      case "IMAGE_TOO_LARGE":
        return `Das Bild ist zu groß. Maximale Größe: ${MAX_IMAGE_SIZE_MB} MB.`;
      case "UNSUPPORTED_IMAGE_TYPE":
        return "Nicht unterstütztes Bildformat. Erlaubt: PNG, JPEG, WebP, GIF.";
      case "CONFIG_ERROR":
        return "Serverfehler: Der Bildanalyse-Dienst ist nicht konfiguriert.";
      case "AUTH_ERROR":
        return "Authentifizierungsfehler beim Bildanalyse-Dienst.";
      default:
        return this.message || "Fehler bei der Bildanalyse. Bitte versuche es erneut.";
    }
  }
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { valid: true } | { valid: false; error: string } {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Nicht unterstütztes Format: ${file.type || "unbekannt"}. Erlaubt: PNG, JPEG, WebP, GIF.`,
    };
  }

  // Check file size
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Bild zu groß: ${sizeMB} MB. Maximale Größe: ${MAX_IMAGE_SIZE_MB} MB.`,
    };
  }

  return { valid: true };
}

/**
 * Convert File to base64 data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as data URL"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Analyze image using Z.ai GLM-4.6v Vision model
 *
 * @param imageDataUrl - Base64 data URL of the image (data:image/...;base64,...)
 * @param prompt - Text prompt describing what to analyze
 * @param options - Optional settings (abort signal)
 * @returns Analysis result text
 * @throws VisionApiError on failure
 */
export async function analyzeImage(
  imageDataUrl: string,
  prompt: string,
  options?: {
    signal?: AbortSignal;
  },
): Promise<{ text: string; usage?: VisionResponse["usage"] }> {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // Combine with external signal if provided
  if (options?.signal) {
    options.signal.addEventListener("abort", () => controller.abort());
  }

  try {
    const response = await fetch(VISION_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        prompt,
        imageDataUrl,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    let data: VisionResponse;
    try {
      data = await response.json();
    } catch {
      throw new VisionApiError("Ungültige Serverantwort", "PARSE_ERROR", response.status);
    }

    // Handle error response
    if (!response.ok || !data.success) {
      const code = (data.code as VisionErrorCode) || "ZAI_API_ERROR";
      throw new VisionApiError(data.error || `Fehler ${response.status}`, code, response.status);
    }

    // Ensure we have text
    if (!data.text) {
      throw new VisionApiError("Keine Analyseergebnisse erhalten", "EMPTY_RESPONSE");
    }

    return {
      text: data.text,
      usage: data.usage,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    // Already a VisionApiError, rethrow
    if (error instanceof VisionApiError) {
      throw error;
    }

    // Handle abort
    if (error instanceof Error && error.name === "AbortError") {
      throw new VisionApiError("Anfrage abgebrochen", "TIMEOUT");
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new VisionApiError("Netzwerkfehler", "NETWORK_ERROR");
    }

    // Map other errors
    throw mapError(error);
  }
}

/**
 * Convenience function: Analyze image file directly
 *
 * @param file - Image file from input or drag-drop
 * @param prompt - Text prompt describing what to analyze
 * @param options - Optional settings
 * @returns Analysis result text
 * @throws VisionApiError on failure
 */
export async function analyzeImageFile(
  file: File,
  prompt: string,
  options?: {
    signal?: AbortSignal;
    onProgress?: (stage: "validating" | "converting" | "analyzing") => void;
  },
): Promise<{ text: string; usage?: VisionResponse["usage"] }> {
  // Validate file
  options?.onProgress?.("validating");
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new VisionApiError(validation.error, "UNSUPPORTED_IMAGE_TYPE");
  }

  // Convert to data URL
  options?.onProgress?.("converting");
  const dataUrl = await fileToDataUrl(file);

  // Analyze
  options?.onProgress?.("analyzing");
  return analyzeImage(dataUrl, prompt, { signal: options?.signal });
}
