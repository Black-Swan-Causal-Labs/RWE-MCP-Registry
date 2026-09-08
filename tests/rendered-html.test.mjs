import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(new URL(pathname, "http://localhost"), {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the public registry catalogue", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>RWE MCP Registry \| Black Swan Causal Labs<\/title>/i);
  assert.match(html, /A source-reviewed catalogue of MCP servers/);
  assert.match(html, /aria-label="Reviewed registry catalogue"/);
  assert.match(html, /Updated<br\/>weekly/);
  assert.match(html, /HEORAgent MCP Server/);
  assert.match(html, /OMOPHub MCP Server/);
  assert.match(html, /SignalBridge for openFDA/);
  assert.equal((html.match(/class="prototype-card /g) ?? []).length, 60);
  assert.match(html, /Show <!-- -->60<!-- --> more entries|Show 60 more entries/);
  assert.match(html, /Clinical Trials AI MCP \(RWE-0115\) is now held/);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working/);
});

test("server-renders the public methods page", async () => {
  const response = await render("/methods");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Search Methods \| RWE MCP Registry<\/title>/i);
  assert.match(html, /How we search/);
  assert.match(html, /Indexed does not mean validated/);
  assert.match(html, /Controlled vocabulary/);
  assert.match(html, /Published-entry correction/);
  assert.match(html, /hardcoded simulated database/);
});
