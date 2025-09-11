# CSP Draft (nicht aktiv; Entwurf)

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
- Falls Analytics/Worker/CDN nötig werden, die Direktiven gezielt erweitern.
- Für Cloudflare Pages ggf. per `_headers` abbilden.
