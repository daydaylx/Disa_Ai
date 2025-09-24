import { vi } from "vitest";

const mockFetch = (
  data: any,
  options: { ok?: boolean; status?: number } = { ok: true, status: 200 },
) => {
  const response = new Response(JSON.stringify(data), {
    status: options.status,
    headers: { "Content-Type": "application/json" },
  });
  // The `ok` property is read-only, so we have to define it this way.
  Object.defineProperty(response, "ok", { value: options.ok });

  return vi.spyOn(global, "fetch").mockImplementation(() => Promise.resolve(response));
};

export { mockFetch };
