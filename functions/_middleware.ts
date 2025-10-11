/**
 * Cloudflare Pages SPA routing middleware
 * Handles client-side routing fallback for React Router
 */
export async function onRequest(context: EventContext<any, any, any>): Promise<Response> {
  const { request, next } = context;
  const url = new URL(request.url);

  // Only rewrite HTML navigation requests
  const isHtmlRequest = request.headers.get("accept")?.includes("text/html");

  if (isHtmlRequest && !url.pathname.includes(".")) {
    // Rewrite to the index page
    const newRequest = new Request(new URL("/", request.url), request);
    return await next(newRequest);
  }

  // Let all other requests (assets, API, etc.) pass through
  return await next();
}
