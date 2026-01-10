/**
 * Image Processing Utilities
 *
 * Handles image validation, resizing, and compression for vision-enabled chat.
 * Ensures images are optimized before sending to vision APIs.
 */

import { nanoid } from "nanoid";

// Configuration constants
export const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB
export const MAX_DIMENSION = 1280; // Max width or height in pixels
export const JPEG_QUALITY = 0.8; // JPEG compression quality (0.0 - 1.0)

/**
 * Allowed MIME types for image upload
 */
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

/**
 * Validation error types
 */
export class ImageValidationError extends Error {
  constructor(
    message: string,
    public readonly code: "INVALID_TYPE" | "TOO_LARGE" | "INVALID_SIZE" | "PROCESSING_FAILED",
  ) {
    super(message);
    this.name = "ImageValidationError";
  }
}

/**
 * Validates image file against constraints
 * @param file - The file to validate
 * @throws ImageValidationError if validation fails
 */
export function validateImageFile(file: File): void {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
    throw new ImageValidationError(
      `Dateityp "${file.type}" wird nicht unterstützt. Erlaubt: JPEG, PNG, WebP`,
      "INVALID_TYPE",
    );
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new ImageValidationError(
      `Datei zu groß (${sizeMB} MB). Maximum: 4 MB`,
      "TOO_LARGE",
    );
  }

  // Check minimum size (1 byte)
  if (file.size === 0) {
    throw new ImageValidationError(
      "Datei ist leer",
      "INVALID_SIZE",
    );
  }
}

/**
 * Calculates new dimensions maintaining aspect ratio
 * @param width - Original width
 * @param height - Original height
 * @returns New dimensions within MAX_DIMENSION
 */
function calculateDimensions(width: number, height: number): { width: number; height: number } {
  if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
    return { width, height };
  }

  const aspectRatio = width / height;

  if (width > height) {
    return {
      width: MAX_DIMENSION,
      height: Math.round(MAX_DIMENSION / aspectRatio),
    };
  } else {
    return {
      width: Math.round(MAX_DIMENSION * aspectRatio),
      height: MAX_DIMENSION,
    };
  }
}

/**
 * Loads an image from a File object
 * @param file - The image file
 * @returns Promise resolving to HTMLImageElement
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageValidationError("Bild konnte nicht geladen werden", "PROCESSING_FAILED"));
    };

    img.src = url;
  });
}

/**
 * Resizes and compresses an image
 * @param file - The image file to process
 * @returns Promise resolving to processed data URL
 */
export async function processImage(file: File): Promise<{ dataUrl: string; mimeType: string }> {
  try {
    // Validate file first
    validateImageFile(file);

    // Load image
    const img = await loadImage(file);

    // Calculate new dimensions
    const { width, height } = calculateDimensions(img.naturalWidth, img.naturalHeight);

    // Create canvas for resizing
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new ImageValidationError(
        "Canvas-Kontext konnte nicht erstellt werden",
        "PROCESSING_FAILED",
      );
    }

    // Draw resized image
    ctx.drawImage(img, 0, 0, width, height);

    // Convert to JPEG (better compression than PNG)
    // If original was PNG/WebP with transparency, JPEG will flatten it to white background
    // This is acceptable for vision APIs
    const mimeType = "image/jpeg";
    const dataUrl = canvas.toDataURL(mimeType, JPEG_QUALITY);

    return { dataUrl, mimeType };
  } catch (error) {
    if (error instanceof ImageValidationError) {
      throw error;
    }
    throw new ImageValidationError(
      "Bildverarbeitung fehlgeschlagen",
      "PROCESSING_FAILED",
    );
  }
}

/**
 * Creates a VisionAttachment object from a file
 * @param file - The image file
 * @returns Promise resolving to VisionAttachment
 */
export async function createVisionAttachment(file: File): Promise<{
  id: string;
  dataUrl: string;
  mimeType: string;
  filename?: string;
  timestamp: number;
  size?: number;
}> {
  const { dataUrl, mimeType } = await processImage(file);

  return {
    id: nanoid(),
    dataUrl,
    mimeType,
    filename: file.name,
    timestamp: Date.now(),
    size: file.size,
  };
}

/**
 * Estimates size of a base64 data URL in bytes
 * @param dataUrl - The data URL string
 * @returns Estimated size in bytes
 */
export function estimateDataUrlSize(dataUrl: string): number {
  // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
  const base64Data = dataUrl.split(",")[1];
  if (!base64Data) return 0;

  // Base64 encoding increases size by ~33%
  return Math.ceil((base64Data.length * 3) / 4);
}

/**
 * Validates a data URL format
 * @param dataUrl - The data URL to validate
 * @returns True if valid, false otherwise
 */
export function isValidDataUrl(dataUrl: string): boolean {
  const regex = /^data:image\/(jpeg|jpg|png|webp);base64,/i;
  return regex.test(dataUrl);
}