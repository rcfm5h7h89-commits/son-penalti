import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resourceUri = "ui://son-penalti/game.html";
const app = express();
app.use(express.json());

async function gameHtml() {
  const [html, css, js] = await Promise.all(["index.html", "style.css", "game.js"].map(f => fs.readFile(path.join(root, f), "utf8")));
  // Keep the actual existing game code and controls, rather than embedding an external site.
  return html.replace(/<link rel="stylesheet"[^>]*>/, "")
    .replace(/<script defer src="game\.js[^"]*"><\/script>/, "")
    .replace("</head>", "<style>" + css + "\n/* ChatGPT embedded layout */\n.page{max-width:100%;padding:10px}\n</style></head>")
    .replace("</body>", "<script>" + js.replace(/<\/script/gi, "<\\/script") + "</script></body>");
}

function createServer() {
  const server = new McpServer({ name: "son-penalti", version: "0.1.0" });
  server.registerResource("Son Penaltı oyun ekranı", resourceUri, { mimeType: "text/html" }, async () => ({
    contents: [{ uri: resourceUri, mimeType: "text/html", text: await gameHtml() }]
  }));
  server.registerTool("oyunu_ac", {
    title: "Son Penaltı'yı Oyna",
    description: "ChatGPT sohbetinde oynanabilen Son Penaltı futbol oyununu açar. Beş penaltı, robotla maç ve dükkân içerir.",
    inputSchema: z.object({}),
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    _meta: { ui: { resourceUri } }
  }, async () => ({
    content: [{ type: "text", text: "Son Penaltı hazır! Kaleye nişan alıp şut çekebilir, Maç düğmesiyle robota karşı oynayabilirsin." }]
  }));
  return server;
}

app.get("/", (_req, res) => res.send("Son Penaltı MCP sunucusu çalışıyor."));
app.post("/mcp", async (req, res) => {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => { transport.close().catch(() => {}); server.close().catch(() => {}); });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});
app.get("/mcp", (_req, res) => res.status(405).send("POST kullanın"));
app.delete("/mcp", (_req, res) => res.status(405).send("POST kullanın"));
app.listen(Number(process.env.PORT || 8787), "0.0.0.0", () => console.log("Son Penaltı MCP hazır"));
