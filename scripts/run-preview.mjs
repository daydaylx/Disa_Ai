#!/usr/bin/env node
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import process from "node:process";
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

async function tryServe(filePath, res) {
  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      const indexPath = join(filePath, "index.html");
      await stat(indexPath);
      sendFile(res, indexPath);
      return true;
    }
    sendFile(res, filePath);
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

    if (!(await tryServe(filePath, res))) {
      const ok = await tryServe(join(distDir, "index.html"), res);
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
  console.log(`[preview] Serving dist on http://${host === "0.0.0.0" ? "127.0.0.1" : host}:${port}${base !== "/" ? base : "/"}`);
});

const onClose = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", onClose);
process.on("SIGTERM", onClose);
