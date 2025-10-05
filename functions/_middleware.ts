/**
 * Cloudflare Pages SPA routing middleware
 * Handles client-side routing fallback for React Router
 */
export async function onRequest(context: EventContext<any, any, any>): Promise<Response> {
  const { request, next } = context;
  const url = new URL(request.url);

  // Let static assets and API routes through
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.includes(".") ||
    url.pathname === "/favicon.ico" ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/sw.js" ||
    url.pathname.startsWith("/icons/")
  ) {
    return next();
  }

  // For SPA routes, rewrite to index.html but keep the original URL
  const indexRequest = new Request(url.origin + "/index.html", {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  const response = await next(indexRequest);

  // Return response with original URL preserved
  return new Response(response.body, {
    status: 200,
    statusText: "OK",
    headers: response.headers,
  });
}
