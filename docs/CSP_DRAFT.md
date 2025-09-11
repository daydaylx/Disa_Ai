# CSP Draft (nicht aktiv, nur Entwurf)

Content-Security-Policy:
default-src 'self';
base-uri 'self';
frame-ancestors 'none';
form-action 'self';
object-src 'none';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
connect-src 'self' https://openrouter.ai\;
font-src 'self' data:;
upgrade-insecure-requests;

Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Content-Type-Options: nosniff

Hinweis:
- Wenn Analytics/Worker/etc. dazu kommen: die jeweiligen Direktiven ergänzen.
- Für Cloudflare Pages kann dies in `_headers` gemappt werden.
