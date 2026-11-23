#!/usr/bin/env node
// Minimal, dependency-free MCP server over stdio (JSON-RPC 2.0, one message per line).
import { createInterface } from "node:readline";
import { kitchenLayout } from "./kitchen.mjs";
import { wardrobeLayout } from "./wardrobe.mjs";
import { cutList } from "./cutlist.mjs";
import { lookup, topics } from "./standards.mjs";

const SERVER_INFO = { name: "indian-interiors", version: "0.1.0" };
const PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];

const cabinetSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "Unique id, e.g. K01" },
    name: { type: "string" },
    width: { type: "number" }, height: { type: "number" }, depth: { type: "number", description: "Carcass depth without shutter" },
    qty: { type: "number" },
    top: { type: "string", enum: ["full", "rails", "none"] },
    back: { type: "string", enum: ["overlay", "inset", "none"] },
    partitions: { type: "number" }, shelves: { type: "number" },
    shutters: { description: "number, or {count, rows, height}" },
    drawers: { description: "number, or {count, front_heights[], slide: telescopic|tandem, slide_length}" },
    materials: { type: "object", description: "Override carcass/back/shutter/drawer_box/drawer_bottom/shelf material names" },
    extra_panels: { type: "array" },
  },
  required: ["id", "width", "height", "depth"],
};

export const TOOLS = [
  {
    name: "kitchen_layout",
    description:
      "Recommend an Indian modular kitchen: layout (straight/L/parallel/U/+island), counter height from the cook's height, sink/hob/fridge walls, base and wall unit list with positions, oil pull-outs, drawer (tandem/basket) units, tall units, corner units, work-triangle check, and a cut_list-ready cabinet spec. Room frame: wall A runs along the room length from the corner with wall B; wall C is opposite A; wall D (x=length) is assumed to be the door wall. All mm.",
    inputSchema: {
      type: "object",
      properties: {
        length: { type: "number", description: "Internal length along wall A (mm)" },
        width: { type: "number", description: "Internal width, A to C (mm)" },
        free_walls: { type: "array", items: { type: "string", enum: ["A", "B", "C"] }, description: "Walls that can take base units (default A,B,C)" },
        family_size: { type: "number" },
        home_type: { type: "string", enum: ["1bhk", "2bhk", "3bhk", "villa"] },
        cook_height: { type: "number", description: "Main cook's height in mm (default 1525)" },
        window_wall: { type: "string", enum: ["A", "B", "C"] },
        window_center: { type: "number", description: "Window centre measured along its wall from the A/B corner (mm)" },
        window_width: { type: "number" },
        fridge_width: { type: "number", description: "Space for the fridge (default 750)" },
        want_island: { type: "boolean" },
        vastu: { type: "boolean" },
        east_wall: { type: "string", enum: ["A", "B", "C", "D"], description: "Which wall faces east (for the Vastu option)" },
      },
      required: ["length", "width"],
    },
    run: kitchenLayout,
  },
  {
    name: "wardrobe_layout",
    description:
      "Plan a wardrobe with lofts for Indian homes: shutters (hinged/sliding), bays with internal zones (long hanging for saris, short hanging + drawers + locker, shelves), loft rows for 9/10/11 ft ceilings, RCC (concrete) loft cladding, front area in sq ft, and a cut_list-ready spec. All mm.",
    inputSchema: {
      type: "object",
      properties: {
        wall_width: { type: "number" },
        ceiling_ft: { type: "number", description: "Floor to slab in feet, e.g. 9, 10, 11" },
        ceiling_mm: { type: "number" },
        loft: { type: "string", enum: ["ply", "rcc", "none"], description: "ply = new ply loft; rcc = existing concrete loft" },
        rcc_loft_bottom: { type: "number", description: "Height of the RCC loft bottom from floor (default 2100)" },
        rcc_loft_depth: { type: "number" },
        false_ceiling_drop: { type: "number" },
        shutter_type: { type: "string", enum: ["hinged", "sliding"] },
        front_clearance: { type: "number", description: "Clear space in front; < 900 selects sliding" },
        depth: { type: "number" },
        saris: { type: "boolean", description: "Include a long-hanging bay (default true)" },
      },
      required: ["wall_width"],
    },
    run: wardrobeLayout,
  },
  {
    name: "cut_list",
    description:
      "Turn a cabinet spec into a plywood cut list: panels (sides, top/rails, bottom, back, partitions, shelves, shutters, drawer fronts and boxes) with grain and edge banding, cutting sizes, per-material 8'x4' sheet counts using a guillotine layout with trim and kerf, edge band metres, and CSV text. Pass `cut_list_spec` from kitchen_layout/wardrobe_layout directly, or write your own.",
    inputSchema: {
      type: "object",
      properties: {
        project: { type: "string" },
        sheet: { type: "object", properties: { length: { type: "number" }, width: { type: "number" }, trim: { type: "number" }, kerf: { type: "number" } } },
        defaults: { type: "object", description: "Material names: carcass, back, shutter, drawer_box, drawer_bottom, shelf (thickness parsed from a leading '18mm')" },
        materials: { type: "object", description: "Optional {name: {thickness}} for names without a leading thickness" },
        edges: { type: "object", description: "{internal: '0.8mm', shutter: '2mm'}" },
        deduct_edge_band: { type: "boolean", description: "Cut size = finish size minus band thickness (default true)" },
        cabinets: { type: "array", items: cabinetSchema },
        extra_panels: { type: "array" },
        include_layout: { type: "boolean", description: "Include sheet placements (default false)" },
        include_csv: { type: "boolean", description: "Include CSV text (default true)" },
      },
      required: ["cabinets"],
    },
    run: (args) => {
      const r = cutList(args);
      if (!args.include_layout) delete r.layouts;
      if (args.include_csv === false) delete r.csv;
      return r;
    },
  },
  {
    name: "standards_lookup",
    description: `Look up typical Indian residential interior values (mm). Topics: ${topics().join(", ")}. Free text like "saree hanging", "toilet door" or "10 ft loft" also works.`,
    inputSchema: { type: "object", properties: { topic: { type: "string" } }, required: ["topic"] },
    run: (args) => lookup(args.topic),
  },
];

export function handle(msg) {
  const { id, method, params } = msg;
  const reply = (result) => ({ jsonrpc: "2.0", id, result });
  const fail = (code, message) => ({ jsonrpc: "2.0", id, error: { code, message } });
  switch (method) {
    case "initialize": {
      const asked = params && params.protocolVersion;
      return reply({
        protocolVersion: PROTOCOL_VERSIONS.includes(asked) ? asked : PROTOCOL_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions: "Indian residential interior calculators (kitchens, wardrobes/lofts, plywood cut lists, standards). Pair with the coohom-indian-interiors skill.",
      });
    }
    case "ping":
      return reply({});
    case "tools/list":
      return reply({ tools: TOOLS.map(({ run, ...t }) => t) });
    case "tools/call": {
      const tool = TOOLS.find((t) => t.name === (params && params.name));
      if (!tool) return fail(-32602, `Unknown tool: ${params && params.name}`);
      try {
        const out = tool.run((params && params.arguments) || {});
        return reply({ content: [{ type: "text", text: JSON.stringify(out, null, 2) }], isError: false });
      } catch (e) {
        return reply({ content: [{ type: "text", text: `Error: ${e.message}` }], isError: true });
      }
    }
    default:
      if (id === undefined || id === null) return null; // notification
      return fail(-32601, `Method not found: ${method}`);
  }
}

function main() {
  const rl = createInterface({ input: process.stdin });
  rl.on("line", (line) => {
    if (!line.trim()) return;
    let msg;
    try { msg = JSON.parse(line); } catch {
      process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }) + "\n");
      return;
    }
    const batch = Array.isArray(msg) ? msg : [msg];
    const out = batch.map(handle).filter(Boolean);
    if (out.length) process.stdout.write(JSON.stringify(Array.isArray(msg) ? out : out[0]) + "\n");
  });
}

import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
const isMain = (() => {
  try { return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); } catch { return false; }
})();
if (isMain) main();
