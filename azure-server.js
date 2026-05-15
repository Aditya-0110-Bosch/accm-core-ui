import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PORT = parseInt(process.env.PORT || "8080", 10);
const CLIENT_DIR = join(__dirname, "dist", "client");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".wasm": "application/wasm",
};

const { default: worker } = await import("./dist/server/index.js");

async function tryServeStaticFile(pathname) {
  const filePath = join(CLIENT_DIR, decodeURIComponent(pathname));
  if (!filePath.startsWith(CLIENT_DIR)) return null;
  try {
    const s = await stat(filePath);
    if (!s.isFile()) return null;
    const content = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    const headers = {
      "content-type": MIME_TYPES[ext] || "application/octet-stream",
    };
    if (pathname.startsWith("/assets/")) {
      headers["cache-control"] = "public, max-age=31536000, immutable";
    }
    return { status: 200, headers, body: content };
  } catch {
    return null;
  }
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const server = createServer(async (nodeReq, nodeRes) => {
  try {
    const url = new URL(
      nodeReq.url || "/",
      `http://${nodeReq.headers.host || `localhost:${PORT}`}`,
    );

    const staticResult = await tryServeStaticFile(url.pathname);
    if (staticResult) {
      nodeRes.writeHead(staticResult.status, staticResult.headers);
      nodeRes.end(staticResult.body);
      return;
    }

    const headers = new Headers();
    for (const [key, val] of Object.entries(nodeReq.headers)) {
      if (val != null)
        headers.set(key, Array.isArray(val) ? val.join(", ") : String(val));
    }

    const init = { method: nodeReq.method || "GET", headers };
    if (init.method !== "GET" && init.method !== "HEAD") {
      init.body = await collectBody(nodeReq);
    }

    const webReq = new Request(url.toString(), init);
    const webRes = await worker.fetch(webReq, {}, {});

    const resHeaders = {};
    webRes.headers.forEach((v, k) => {
      resHeaders[k] = v;
    });
    nodeRes.writeHead(webRes.status, resHeaders);
    nodeRes.end(Buffer.from(await webRes.arrayBuffer()));
  } catch (err) {
    console.error("Unhandled server error:", err);
    nodeRes.writeHead(500, { "content-type": "text/plain" });
    nodeRes.end("Internal Server Error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
