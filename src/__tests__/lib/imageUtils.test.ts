import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  compressImage,
  createImagePreview,
  formatFileSize,
  IMAGE_CONFIG,
  validateImageFiles,
  validateImageMagicBytes,
} from "@/lib/feedback/imageUtils";

describe("imageUtils", () => {
  describe("validateImageFiles", () => {
    it("validates empty array as valid", () => {
      const result = validateImageFiles([]);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("rejects too many files", () => {
      const files = Array(IMAGE_CONFIG.MAX_FILES + 1)
        .fill(null)
        .map((_, i) => new File(["test"], `image-${i}.png`, { type: "image/png" }));

      const result = validateImageFiles(files);
      expect(result.valid).toBe(false);
      expect(result.error).toContain(`${IMAGE_CONFIG.MAX_FILES}`);
    });

    it("rejects invalid file types", () => {
      const file = new File(["test"], "test.pdf", { type: "application/pdf" });
      const result = validateImageFiles([file]);

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Ungültiges Bildformat");
    });

    it("rejects oversized individual file", () => {
      const largeSize = IMAGE_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024 + 1;
      const buffer = new ArrayBuffer(largeSize);
      const file = new File([buffer], "large.png", { type: "image/png" });

      const result = validateImageFiles([file]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("zu groß");
    });

    it("rejects oversized total size", () => {
      // Create files that individually pass (< 5 MB) but together fail (> 15 MB)
      const singleSize = 4.5 * 1024 * 1024; // 4.5 MB each (under individual limit)
      const buffer = new ArrayBuffer(singleSize);
      const files = [
        new File([buffer], "1.png", { type: "image/png" }),
        new File([buffer], "2.png", { type: "image/png" }),
        new File([buffer], "3.png", { type: "image/png" }),
        new File([buffer], "4.png", { type: "image/png" }),
      ]; // Total: 4.5 * 4 = 18 MB > 15 MB limit

      const result = validateImageFiles(files);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Gesamtgröße zu groß");
    });

    it("accepts valid files", () => {
      const file = new File(["test"], "valid.png", { type: "image/png" });
      const result = validateImageFiles([file]);

      expect(result.valid).toBe(true);
    });

    it("accepts all supported formats", () => {
      const formats = [
        { name: "test.png", type: "image/png" },
        { name: "test.jpg", type: "image/jpeg" },
        { name: "test.jpeg", type: "image/jpeg" },
        { name: "test.webp", type: "image/webp" },
      ];

      for (const format of formats) {
        const file = new File(["test"], format.name, { type: format.type });
        const result = validateImageFiles([file]);
        expect(result.valid).toBe(true);
      }
    });
  });

  describe("formatFileSize", () => {
    it("formats bytes correctly", () => {
      expect(formatFileSize(0)).toBe("0 B");
      expect(formatFileSize(512)).toBe("512.0 B");
      expect(formatFileSize(1024)).toBe("1.0 KB");
      expect(formatFileSize(1536)).toBe("1.5 KB");
      expect(formatFileSize(1024 * 1024)).toBe("1.0 MB");
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe("2.5 MB");
    });
  });

  describe("validateImageMagicBytes", () => {
    it("validates PNG magic bytes", async () => {
      const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const file = new File([pngHeader], "test.png", { type: "image/png" });

      const result = await validateImageMagicBytes(file);
      expect(result).toBe(true);
    });

    it("validates JPEG magic bytes", async () => {
      const jpegHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      const file = new File([jpegHeader], "test.jpg", { type: "image/jpeg" });

      const result = await validateImageMagicBytes(file);
      expect(result).toBe(true);
    });

    it("validates WebP magic bytes", async () => {
      // WebP: RIFF....WEBP
      const webpHeader = new Uint8Array([
        0x52,
        0x49,
        0x46,
        0x46, // RIFF
        0x00,
        0x00,
        0x00,
        0x00, // size (placeholder)
        0x57,
        0x45,
        0x42,
        0x50, // WEBP
      ]);
      const file = new File([webpHeader], "test.webp", { type: "image/webp" });

      const result = await validateImageMagicBytes(file);
      expect(result).toBe(true);
    });

    it("rejects invalid magic bytes", async () => {
      const invalidHeader = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
      const file = new File([invalidHeader], "fake.png", { type: "image/png" });

      const result = await validateImageMagicBytes(file);
      expect(result).toBe(false);
    });
  });

  describe("createImagePreview", () => {
    beforeEach(() => {
      // Mock URL.createObjectURL
      global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
    });

    it("creates preview URL from file", () => {
      const file = new File(["test"], "test.png", { type: "image/png" });
      const url = createImagePreview(file);

      expect(url).toBe("blob:mock-url");
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    });
  });

  describe("compressImage", () => {
    beforeEach(() => {
      // Mock Canvas API
      const mockCanvas = {
        width: 0,
        height: 0,
        toDataURL: vi.fn(() => "data:image/webp;base64,mockdata"),
        toBlob: vi.fn((callback: BlobCallback) => {
          const blob = new Blob(["compressed"], { type: "image/webp" });
          callback(blob);
        }),
        getContext: vi.fn(() => ({
          drawImage: vi.fn(),
        })),
      };

      global.document.createElement = vi.fn((tagName: string) => {
        if (tagName === "canvas") {
          return mockCanvas as unknown as HTMLCanvasElement;
        }
        return {} as HTMLElement;
      });

      // Mock Image
      global.Image = class MockImage {
        src = "";
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        width = 800;
        height = 600;

        constructor() {
          // Trigger onload after a microtask
          queueMicrotask(() => {
            if (this.onload) this.onload();
          });
        }
      } as unknown as typeof Image;

      // Mock FileReader
      global.FileReader = class MockFileReader {
        result: string | ArrayBuffer | null = null;
        onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
        onerror: (() => void) | null = null;

        readAsDataURL(_blob: Blob) {
          queueMicrotask(() => {
            this.result = "data:image/png;base64,mockdata";
            if (this.onload) {
              this.onload({ target: this } as unknown as ProgressEvent<FileReader>);
            }
          });
        }
      } as unknown as typeof FileReader;
    });

    it("compresses image and returns result", async () => {
      const file = new File(["original"], "test.png", { type: "image/png" });

      const result = await compressImage(file);

      expect(result.file).toBeDefined();
      expect(result.file.type).toBe("image/webp");
      expect(result.originalSize).toBe(file.size);
      expect(result.compressedSize).toBeGreaterThan(0);
    });

    it("handles compression errors gracefully", async () => {
      // Override Image to trigger error
      global.Image = class MockImage {
        src = "";
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;

        constructor() {
          queueMicrotask(() => {
            if (this.onerror) this.onerror();
          });
        }
      } as unknown as typeof Image;

      const file = new File(["test"], "test.png", { type: "image/png" });

      await expect(compressImage(file)).rejects.toThrow();
    });
  });
});
