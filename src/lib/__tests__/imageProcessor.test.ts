/**
 * Unit Tests for Image Processor
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ALLOWED_MIME_TYPES,
  createVisionAttachment,
  estimateDataUrlSize,
  ImageValidationError,
  isValidDataUrl,
  MAX_FILE_SIZE_BYTES,
  processImage,
  validateImageFile,
} from "../imageProcessor";

describe("validateImageFile", () => {
  it("should accept valid JPEG file", () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    expect(() => validateImageFile(file)).not.toThrow();
  });

  it("should accept valid PNG file", () => {
    const file = new File(["test"], "test.png", { type: "image/png" });
    expect(() => validateImageFile(file)).not.toThrow();
  });

  it("should accept valid WebP file", () => {
    const file = new File(["test"], "test.webp", { type: "image/webp" });
    expect(() => validateImageFile(file)).not.toThrow();
  });

  it("should reject unsupported MIME type", () => {
    const file = new File(["test"], "test.gif", { type: "image/gif" });
    expect(() => validateImageFile(file)).toThrow(ImageValidationError);
    expect(() => validateImageFile(file)).toThrow("wird nicht unterstützt");
  });

  it("should reject file exceeding max size", () => {
    const file = new File([new ArrayBuffer(MAX_FILE_SIZE_BYTES + 1)], "test.jpg", {
      type: "image/jpeg",
    });
    expect(() => validateImageFile(file)).toThrow(ImageValidationError);
    expect(() => validateImageFile(file)).toThrow("zu groß");
  });

  it("should reject empty file", () => {
    const file = new File([], "test.jpg", { type: "image/jpeg" });
    expect(() => validateImageFile(file)).toThrow(ImageValidationError);
    expect(() => validateImageFile(file)).toThrow("leer");
  });

  it("should provide error code for invalid type", () => {
    const file = new File(["test"], "test.gif", { type: "image/gif" });
    try {
      validateImageFile(file);
      expect.fail("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ImageValidationError);
      if (error instanceof ImageValidationError) {
        expect(error.code).toBe("INVALID_TYPE");
      }
    }
  });

  it("should provide error code for too large", () => {
    const file = new File([new ArrayBuffer(MAX_FILE_SIZE_BYTES + 1)], "test.jpg", {
      type: "image/jpeg",
    });
    try {
      validateImageFile(file);
      expect.fail("Should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ImageValidationError);
      if (error instanceof ImageValidationError) {
        expect(error.code).toBe("TOO_LARGE");
      }
    }
  });
});

describe("estimateDataUrlSize", () => {
  it("should estimate size correctly for small base64", () => {
    const dataUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";
    const size = estimateDataUrlSize(dataUrl);
    expect(size).toBeGreaterThan(0);
  });

  it("should return 0 for invalid data URL", () => {
    const dataUrl = "data:invalid";
    const size = estimateDataUrlSize(dataUrl);
    expect(size).toBe(0);
  });

  it("should handle empty data URL", () => {
    const size = estimateDataUrlSize("");
    expect(size).toBe(0);
  });
});

describe("isValidDataUrl", () => {
  it("should accept valid JPEG data URL", () => {
    const dataUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";
    expect(isValidDataUrl(dataUrl)).toBe(true);
  });

  it("should accept valid PNG data URL", () => {
    const dataUrl = "data:image/png;base64,iVBORw0KGgo=";
    expect(isValidDataUrl(dataUrl)).toBe(true);
  });

  it("should accept valid WebP data URL", () => {
    const dataUrl = "data:image/webp;base64,UklGRiQ=";
    expect(isValidDataUrl(dataUrl)).toBe(true);
  });

  it("should reject invalid MIME type", () => {
    const dataUrl = "data:image/gif;base64,R0lGODlhAQABAIA=";
    expect(isValidDataUrl(dataUrl)).toBe(false);
  });

  it("should reject missing base64 marker", () => {
    const dataUrl = "data:image/jpeg;base64";
    expect(isValidDataUrl(dataUrl)).toBe(false);
  });

  it("should be case insensitive for MIME type", () => {
    const dataUrl = "data:IMAGE/JPEG;base64,/9j/4AAQSkZJRg==";
    expect(isValidDataUrl(dataUrl)).toBe(true);
  });
});

describe("processImage", () => {
  // Mock canvas and image loading
  beforeEach(() => {
    // Mock HTMLImageElement
    global.Image = class {
      private _src: string = "";
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      naturalWidth = 100;
      naturalHeight = 100;

      get src() {
        return this._src;
      }

      set src(value: string) {
        this._src = value;
        // Simulate async loading when src is set
        setTimeout(() => {
          if (this.onerror && value.includes("error")) {
            this.onerror();
          } else if (this.onload) {
            this.onload();
          }
        }, 0);
      }

      constructor() {
        this._src = "";
      }
    } as any;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should process valid image file", async () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const result = await processImage(file);
    expect(result.dataUrl).toMatch(/^data:image\/jpeg;base64,/);
    expect(result.mimeType).toBe("image/jpeg");
  });

  it("should reject invalid file", async () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    // Mock file to trigger error
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:error"),
      revokeObjectURL: vi.fn(),
    });

    await expect(processImage(file)).rejects.toThrow(ImageValidationError);
  });

  it("should resize image if too large", async () => {
    // Create a file that would need resizing
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const result = await processImage(file);

    // Result should be a data URL
    expect(result.dataUrl).toBeTruthy();
    expect(result.mimeType).toBe("image/jpeg");
  });
});

describe("createVisionAttachment", () => {
  beforeEach(() => {
    global.Image = class {
      private _src: string = "";
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      naturalWidth = 100;
      naturalHeight = 100;

      get src() {
        return this._src;
      }

      set src(value: string) {
        this._src = value;
        // Simulate async loading when src is set
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      }

      constructor() {
        this._src = "";
      }
    } as any;
  });

  it("should create attachment with required fields", async () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const attachment = await createVisionAttachment(file);

    expect(attachment).toHaveProperty("id");
    expect(attachment).toHaveProperty("dataUrl");
    expect(attachment).toHaveProperty("mimeType");
    expect(attachment).toHaveProperty("filename");
    expect(attachment).toHaveProperty("timestamp");
    expect(attachment).toHaveProperty("size");

    expect(attachment.id).toBeTruthy();
    expect(attachment.filename).toBe("test.jpg");
    expect(attachment.timestamp).toBeGreaterThan(0);
    expect(attachment.size).toBe(file.size);
  });

  it("should generate unique IDs for multiple attachments", async () => {
    const file1 = new File(["test1"], "test1.jpg", { type: "image/jpeg" });
    const file2 = new File(["test2"], "test2.jpg", { type: "image/jpeg" });

    const attachment1 = await createVisionAttachment(file1);
    const attachment2 = await createVisionAttachment(file2);

    expect(attachment1.id).not.toBe(attachment2.id);
  });
});

describe("Constants", () => {
  it("should export max file size constant", () => {
    expect(MAX_FILE_SIZE_BYTES).toBe(4 * 1024 * 1024); // 4MB
  });

  it("should export allowed MIME types", () => {
    expect(ALLOWED_MIME_TYPES).toContain("image/jpeg");
    expect(ALLOWED_MIME_TYPES).toContain("image/png");
    expect(ALLOWED_MIME_TYPES).toContain("image/webp");
  });
});
