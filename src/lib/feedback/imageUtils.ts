/**
 * Image utilities for feedback screenshot attachments
 * Handles validation, compression, and preview generation
 */

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export interface CompressedImage {
  file: File;
  originalSize: number;
  compressedSize: number;
}

// Configuration constants
export const IMAGE_CONFIG = {
  MAX_FILES: 5,
  MAX_FILE_SIZE_MB: 5,
  MAX_TOTAL_SIZE_MB: 15,
  MAX_DIMENSION: 1280,
  QUALITY: 0.85,
  ACCEPTED_TYPES: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
} as const;

/**
 * Validate image files against size and type constraints
 */
export function validateImageFiles(files: File[]): ImageValidationResult {
  if (files.length === 0) {
    return { valid: true };
  }

  // Check count
  if (files.length > IMAGE_CONFIG.MAX_FILES) {
    return {
      valid: false,
      error: `Maximal ${IMAGE_CONFIG.MAX_FILES} Bilder erlaubt (du hast ${files.length} ausgewählt)`,
    };
  }

  // Check individual file types and sizes
  for (const file of files) {
    // Type validation
    if (!(IMAGE_CONFIG.ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
      return {
        valid: false,
        error: `Ungültiges Bildformat: ${file.name}. Erlaubt: PNG, JPEG, WebP`,
      };
    }

    // Individual size check
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > IMAGE_CONFIG.MAX_FILE_SIZE_MB) {
      return {
        valid: false,
        error: `Bild zu groß: ${file.name} (${sizeMB.toFixed(1)} MB). Maximum: ${IMAGE_CONFIG.MAX_FILE_SIZE_MB} MB`,
      };
    }
  }

  // Check total size
  const totalSizeMB = files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024);
  if (totalSizeMB > IMAGE_CONFIG.MAX_TOTAL_SIZE_MB) {
    return {
      valid: false,
      error: `Gesamtgröße zu groß: ${totalSizeMB.toFixed(1)} MB. Maximum: ${IMAGE_CONFIG.MAX_TOTAL_SIZE_MB} MB`,
    };
  }

  return { valid: true };
}

/**
 * Compress and resize an image file
 * Returns a new File object with optimized size
 */
export async function compressImage(file: File): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    img.onload = () => {
      try {
        // Calculate new dimensions (maintain aspect ratio)
        let { width, height } = img;
        const maxDim = IMAGE_CONFIG.MAX_DIMENSION;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image to canvas (this removes EXIF data)
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first (better compression), fallback to JPEG
        const supportsWebP = canvas.toDataURL("image/webp").startsWith("data:image/webp");
        const outputFormat = supportsWebP ? "image/webp" : "image/jpeg";
        const quality = IMAGE_CONFIG.QUALITY;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            // Create new file from blob
            const extension = outputFormat === "image/webp" ? ".webp" : ".jpg";
            const originalName = file.name.replace(/\.[^.]+$/, "");
            const compressedFile = new File([blob], `${originalName}${extension}`, {
              type: outputFormat,
              lastModified: Date.now(),
            });

            resolve({
              file: compressedFile,
              originalSize: file.size,
              compressedSize: blob.size,
            });
          },
          outputFormat,
          quality,
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Create a preview URL for an image file (for thumbnails)
 * Remember to revoke the URL when done: URL.revokeObjectURL(url)
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Check if a file is likely an image based on magic bytes (security check)
 * This is a basic check - more robust validation should happen server-side
 */
export async function validateImageMagicBytes(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        resolve(false);
        return;
      }

      const arr = new Uint8Array(e.target.result as ArrayBuffer);

      // Check magic bytes for common image formats
      // PNG: 89 50 4E 47
      if (
        arr.length >= 4 &&
        arr[0] === 0x89 &&
        arr[1] === 0x50 &&
        arr[2] === 0x4e &&
        arr[3] === 0x47
      ) {
        resolve(true);
        return;
      }

      // JPEG: FF D8 FF
      if (arr.length >= 3 && arr[0] === 0xff && arr[1] === 0xd8 && arr[2] === 0xff) {
        resolve(true);
        return;
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
        resolve(true);
        return;
      }

      resolve(false);
    };

    reader.onerror = () => resolve(false);

    // Only read first 12 bytes for magic byte check
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
}
