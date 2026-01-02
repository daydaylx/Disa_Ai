# Image Analysis Feature

Disa AI supports image analysis using the Z.ai GLM-4.6v Vision model. Users can upload images and receive AI-powered descriptions and analysis.

## Architecture Overview

```
┌─────────────┐      ┌──────────────┐      ┌────────────────────┐      ┌─────────────┐
│  Frontend   │      │  Frontend    │      │ Cloudflare         │      │   Z.ai      │
│  (Upload)   │─────▶│  (Base64)    │─────▶│ /api/zai/vision    │─────▶│   GLM-4.6v  │
│  PNG/JPG    │      │  Data-URL    │      │ (API Key here!)    │      │   Vision    │
└─────────────┘      └──────────────┘      └────────────────────┘      └─────────────┘
```

**Key Security Feature:** The Z.ai API key is stored exclusively on the server side (Cloudflare environment variables) and is never exposed to the client.

## Setup

### 1. Configure Z.ai API Key

Add the `ZAI_API_KEY` secret to your Cloudflare Pages project:

**Cloudflare Dashboard:**
1. Go to Workers & Pages → Your Project → Settings → Environment Variables
2. Add a new variable:
   - Variable name: `ZAI_API_KEY`
   - Value: Your Z.ai API key
   - Encrypt: Yes (recommended)

**Local Development:**
Create a `.dev.vars` file in the project root:
```bash
ZAI_API_KEY=your-zai-api-key-here
```

### 2. Obtain a Z.ai API Key

Visit [Z.ai](https://z.ai) to create an account and obtain an API key.

## Usage

1. In the chat interface, click the image attachment button (📷) next to the text input
2. Select an image file (PNG, JPEG, WebP, or GIF)
3. The image preview appears above the input field
4. Optionally add a prompt describing what you want to know about the image
5. Send the message
6. The AI will analyze the image and provide a response

## Technical Specifications

### Supported Formats
- PNG (`image/png`)
- JPEG (`image/jpeg`)
- WebP (`image/webp`)
- GIF (`image/gif`)

### Limits
| Parameter | Limit |
|-----------|-------|
| Max file size | 10 MB |
| Max prompt length | 2,000 characters |
| Request timeout | 60 seconds |

### API Endpoint

**POST** `/api/zai/vision`

**Request Body:**
```json
{
  "prompt": "Describe this image in detail",
  "imageDataUrl": "data:image/png;base64,..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "text": "This image shows...",
  "usage": {
    "prompt_tokens": 1234,
    "completion_tokens": 567,
    "total_tokens": 1801
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Image too large: 15.2 MB (max 10 MB)",
  "code": "IMAGE_TOO_LARGE"
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `MISSING_PROMPT` | Prompt is required |
| `PROMPT_TOO_LONG` | Prompt exceeds 2,000 characters |
| `MISSING_IMAGE` | Image data URL is required |
| `INVALID_IMAGE_FORMAT` | Not a valid base64 data URL |
| `UNSUPPORTED_IMAGE_TYPE` | File type not supported |
| `IMAGE_TOO_LARGE` | File exceeds 10 MB |
| `TIMEOUT` | Request took too long |
| `RATE_LIMITED` | Too many requests |
| `CONFIG_ERROR` | Server API key not configured |
| `ZAI_API_ERROR` | Z.ai API returned an error |

## Components

### Frontend

| File | Description |
|------|-------------|
| `src/components/chat/ImageAttachment.tsx` | Image attachment UI component |
| `src/api/zaiVision.ts` | Z.ai Vision API client |
| `src/hooks/useVisionAnalysis.ts` | Vision analysis hook |

### Backend

| File | Description |
|------|-------------|
| `functions/api/zai/vision.ts` | Cloudflare Pages Function for Z.ai proxy |

## Data Flow

1. **User selects image** → `ImageAttachment` component validates file type and size
2. **File conversion** → `FileReader.readAsDataURL()` converts to base64
3. **User submits** → `useChatPageLogic.handleSend()` detects attached image
4. **API call** → `analyzeImage()` sends request to `/api/zai/vision`
5. **Server proxy** → Cloudflare Function adds API key and forwards to Z.ai
6. **Response** → Analysis text displayed as assistant message in chat

## Security Considerations

- **API Key Protection:** The Z.ai API key never leaves the server. It's stored as a Cloudflare Secret and only used in the backend proxy.
- **CORS:** The `/api/zai/vision` endpoint only accepts requests from allowed origins (disaai.de, localhost).
- **Validation:** Images are validated for:
  - MIME type (content-type header)
  - File size (max 10 MB)
  - Base64 format validity
- **Rate Limiting:** Z.ai's built-in rate limiting applies. The proxy returns user-friendly error messages for 429 responses.

## Troubleshooting

### "Server configuration error: Z.ai API key not configured"
The `ZAI_API_KEY` environment variable is not set in Cloudflare Pages.

### "Image too large"
Reduce the image size or resolution before uploading. Maximum size is 10 MB.

### "Request timeout"
The image analysis took too long. Try with a smaller image or simpler prompt.

### Analysis results are inaccurate
The GLM-4.6v model may have limitations with certain types of images. Try providing more specific prompts.
