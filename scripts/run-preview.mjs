#!/usr/bin/env node
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import process from "node:process";
import { createGzip } from "node:zlib";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV ?? "production";
const env = loadEnv(mode, process.cwd(), "");

let base = process.env.VITE_PREVIEW_BASE ?? env.VITE_BASE_URL ?? "/";

if (!process.env.VITE_PREVIEW_BASE && !env.VITE_BASE_URL) {
  if (env.CF_PAGES && env.CF_PAGES_URL) {
    base = "/";
  } else if (process.env.GITHUB_ACTIONS && process.env.GITHUB_REPOSITORY) {
    const repo = process.env.GITHUB_REPOSITORY.split("/")[1] ?? "";
    base = repo ? `/${repo}/` : "/";
  }
}

if (!base.endsWith("/")) {
  base = `${base}/`;
}

const host = process.env.VITE_PREVIEW_HOST ?? "0.0.0.0";
const port = Number(process.env.VITE_PREVIEW_PORT ?? "4173");
const distDir = join(process.cwd(), "dist");

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".webmanifest", "application/manifest+json"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".ttf", "font/ttf"],
  [".eot", "application/vnd.ms-fontobject"],
]);

function sendFile(res, filePath) {
  const ext = extname(filePath);
  const mime = mimeTypes.get(ext) ?? "application/octet-stream";
  res.setHeader("Content-Type", mime);
  const stream = createReadStream(filePath);
  stream.on("error", () => {
    res.statusCode = 500;
    res.end("Internal Server Error");
  });
  stream.pipe(res);
}

const compressibleExtensions = new Set([".html", ".js", ".css", ".json", ".webmanifest"]);

function sendFileCompressed(req, res, filePath) {
  const ext = extname(filePath);
  const acceptsGzip = (req.headers["accept-encoding"] ?? "").includes("gzip");
  const shouldCompress = acceptsGzip && compressibleExtensions.has(ext);

  if (process.env.DEBUG_PREVIEW === "1") {
    console.log(
      `[preview] send file ${filePath} ext=${ext} acceptsGzip=${acceptsGzip} shouldCompress=${shouldCompress}`,
    );
  }

  if (!shouldCompress) {
    sendFile(res, filePath);
    return;
  }

  const mime = mimeTypes.get(ext) ?? "application/octet-stream";
  res.setHeader("Content-Type", mime);
  res.setHeader("Content-Encoding", "gzip");
  res.setHeader("Vary", "Accept-Encoding");
  const stream = createReadStream(filePath);
  const gzip = createGzip({ level: 6 });
  stream.on("error", () => {
    res.statusCode = 500;
    res.end("Internal Server Error");
  });
  stream.pipe(gzip).pipe(res);
}

async function tryServe(req, res, filePath, headOnly = false) {
  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      const indexPath = join(filePath, "index.html");
      return await tryServe(req, res, indexPath, headOnly);
    }

    if (headOnly) {
      const ext = extname(filePath);
      const mime = mimeTypes.get(ext) ?? "application/octet-stream";
      res.statusCode = 200;
      res.setHeader("Content-Type", mime);
      if (compressibleExtensions.has(ext)) {
        res.setHeader("Content-Encoding", "gzip");
      }
      res.end();
      return true;
    }

    sendFileCompressed(req, res, filePath);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  try {
    const method = req.method ?? "GET";
    if (method !== "GET" && method !== "HEAD") {
      res.statusCode = 405;
      res.setHeader("Allow", "GET, HEAD");
      res.end("Method Not Allowed");
      return;
    }

    const requestUrl = req.url ? req.url.split("?")[0] : "/";
    let pathname = decodeURIComponent(requestUrl);

    if (!pathname.startsWith("/")) {
      pathname = `/${pathname}`;
    }

    let effectivePath = pathname;

    if (base !== "/" && pathname.startsWith(base)) {
      effectivePath = pathname.slice(base.length - 1);
      if (!effectivePath.startsWith("/")) {
        effectivePath = `/${effectivePath}`;
      }
    }

    let normalizedPath = normalize(effectivePath);
    if (normalizedPath === base && base !== "/") {
      normalizedPath = "/";
    }

    if (normalizedPath === "" || normalizedPath === "." || normalizedPath === "/") {
      normalizedPath = "index.html";
    }

    if (normalizedPath.startsWith("..")) {
      res.statusCode = 403;
      res.end("Forbidden");
      return;
    }

    if (process.env.DEBUG_PREVIEW === "1") {
      console.log(`[preview] request %s -> %s`, pathname, normalizedPath);
    }

    const safePath = normalizedPath.startsWith("/") ? normalizedPath.slice(1) : normalizedPath;
    const filePath = join(distDir, safePath);

    const headOnly = method === "HEAD";

    if (!(await tryServe(req, res, filePath, headOnly))) {
      const fallbackPath = join(distDir, "index.html");
      const ok = await tryServe(req, res, fallbackPath, headOnly);
      if (!ok) {
        res.statusCode = 404;
        res.end("Not Found");
      }
    }
  } catch (error) {
    res.statusCode = 500;
    res.end("Internal Server Error");
    console.error("[preview]", error);
  }
});

server.listen(port, host, () => {
  console.log(
    `[preview] Serving dist on http://${host === "0.0.0.0" ? "127.0.0.1" : host}:${port}${base !== "/" ? base : "/"}`,
  );
});

const onClose = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", onClose);
process.on("SIGTERM", onClose);
