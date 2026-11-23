import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { lookup } from "../src/standards.mjs";

const serverPath = fileURLToPath(new URL("../src/server.mjs", import.meta.url));

function rpc(messages) {
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [serverPath], { stdio: ["pipe", "pipe", "inherit"] });
    let buf = "";
    const out = [];
    const expected = messages.filter((m) => m.id !== undefined).length;
    p.stdout.on("data", (d) => {
      buf += d;
      let i;
      while ((i = buf.indexOf("\n")) >= 0) {
        out.push(JSON.parse(buf.slice(0, i)));
        buf = buf.slice(i + 1);
        if (out.length === expected) { clearTimeout(timer); p.kill(); resolve(out); }
      }
    });
    p.on("error", reject);
    const timer = setTimeout(() => { p.kill(); reject(new Error("timeout")); }, 5000);
    for (const m of messages) p.stdin.write(JSON.stringify(m) + "\n");
  });
}

test("MCP handshake, tools/list and tools/call over stdio", async () => {
  const [init, list, call, bad] = await rpc([
    { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "t", version: "0" } } },
    { jsonrpc: "2.0", method: "notifications/initialized" },
    { jsonrpc: "2.0", id: 2, method: "tools/list" },
    { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "wardrobe_layout", arguments: { wall_width: 1800, ceiling_ft: 9 } } },
    { jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "kitchen_layout", arguments: { length: 0, width: 0 } } },
  ]);
  assert.equal(init.result.protocolVersion, "2025-06-18");
  assert.equal(init.result.serverInfo.name, "indian-interiors");
  assert.deepEqual(list.result.tools.map((t) => t.name).sort(), ["cut_list", "kitchen_layout", "standards_lookup", "wardrobe_layout"]);
  for (const t of list.result.tools) assert.equal(t.inputSchema.type, "object");
  const body = JSON.parse(call.result.content[0].text);
  assert.equal(body.summary.wardrobe_height, 2100);
  assert.equal(bad.result.isError, true);
});

test("unknown methods return JSON-RPC errors", async () => {
  const [r] = await rpc([{ jsonrpc: "2.0", id: 9, method: "nope" }]);
  assert.equal(r.error.code, -32601);
});

test("standards lookup by topic, alias and free text", () => {
  assert.equal(lookup("kitchen").match[0].topic, "kitchen");
  assert.equal(lookup("saree").match[0].topic, "wardrobe");
  assert.equal(lookup("toilet door").match[0].topic, "doors");
  assert.equal(lookup("gtpt").match[0].topic, "hardware");
  assert.equal(lookup("xyzzy").match, null);
  assert.ok(lookup("").topics.length > 10);
});
