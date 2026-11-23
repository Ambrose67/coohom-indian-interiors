// Plywood cut-list engine: cabinet spec -> panel list -> sheet layout + counts.
// Zero dependencies. All sizes in mm.
//
// Conventions
// - Every panel has `length` (along the grain) and `width` (across the grain).
// - Sheets are 2440 x 1220 by default; the sheet's grain runs along its 2440 side.
// - Edge labels: L1/L2 are the two long-direction edges (they run along `length`),
//   W1/W2 the two short-direction edges (they run along `width`).
// - Values marked "rule of thumb" in comments are practice conventions; adjust them
//   to the workshop's machines and hardware catalogue.

export const DEFAULT_SHEET = { length: 2440, width: 1220, trim: 10, kerf: 4 };

export const DEFAULT_MATERIALS = {
  carcass: "18mm BWP ply",
  back: "6mm BWP ply",
  shutter: "18mm BWP ply",
  drawer_box: "12mm BWP ply",
  drawer_bottom: "6mm BWP ply",
};

export const DEFAULT_EDGES = {
  internal: "0.8mm", // visible-but-inside edges: carcass fronts, shelves
  shutter: "2mm", // shutters and drawer fronts, all four edges
};

const SHUTTER_GAP = 3; // rule of thumb: gap between overlay shutters
const SHELF_SETBACK = 20; // rule of thumb: shelf set back from carcass front
const RAIL_WIDTH = 100; // rule of thumb: top rail width on base units
const GROOVE = 8; // rule of thumb: groove depth for inset backs
const SLIDE_CLEARANCE = 13; // rule of thumb: telescopic slide clearance per side (check catalogue)
const SLIDE_LENGTHS = [250, 300, 350, 400, 450, 500, 550];

export function thicknessOf(material, materials = {}) {
  const m = materials[material];
  if (m && typeof m === "object" && Number.isFinite(m.thickness)) return m.thickness;
  if (Number.isFinite(m)) return m;
  const match = /^\s*(\d+(?:\.\d+)?)\s*mm/i.exec(String(material));
  if (match) return Number(match[1]);
  throw new Error(
    `Cannot tell the thickness of material "${material}". Name it like "18mm BWP ply" or give materials: {"${material}": {"thickness": 18}}.`
  );
}

function bandThickness(band) {
  if (!band) return 0;
  const match = /(\d+(?:\.\d+)?)\s*mm/i.exec(String(band));
  return match ? Number(match[1]) : 0;
}

const r1 = (x) => Math.round(x * 10) / 10;

function panel(cab, part, material, length, width, qty, grain, edges = {}) {
  return {
    cabinet: cab.id,
    cabinet_name: cab.name || "",
    part,
    material,
    length: r1(length),
    width: r1(width),
    qty,
    grain,
    edges: { L1: edges.L1 || null, L2: edges.L2 || null, W1: edges.W1 || null, W2: edges.W2 || null },
  };
}

function normShutters(s) {
  if (!s) return { count: 0, rows: 1 };
  if (Number.isFinite(s)) return { count: s, rows: 1 };
  return { count: s.count || 0, rows: s.rows || 1, height: s.height };
}

function normDrawers(d) {
  if (!d) return { count: 0 };
  if (Number.isFinite(d)) return { count: d };
  return { count: d.count || 0, front_heights: d.front_heights, slide: d.slide || "telescopic", slide_length: d.slide_length };
}

/** Expand one cabinet spec into panels. */
export function cabinetPanels(cab, opts = {}) {
  const mats = { ...DEFAULT_MATERIALS, ...(opts.defaults || {}), ...(cab.materials || {}) };
  const edges = { ...DEFAULT_EDGES, ...(opts.edges || {}), ...(cab.edges || {}) };
  const matTable = opts.materials || {};
  const W = cab.width, H = cab.height, D = cab.depth;
  for (const [k, v] of Object.entries({ width: W, height: H, depth: D })) {
    if (!Number.isFinite(v) || v <= 0) throw new Error(`Cabinet ${cab.id || "?"}: ${k} must be a positive number (mm).`);
  }
  if (!cab.id) throw new Error("Every cabinet needs an id, e.g. \"K01\".");
  const T = thicknessOf(mats.carcass, matTable);
  const out = [];
  const warnings = [];
  const backMode = cab.back || "overlay"; // overlay | inset | none
  const backT = backMode === "none" ? 0 : thicknessOf(mats.back, matTable);
  const sideDepth = backMode === "overlay" ? D - backT : D;
  const topMode = cab.top || "full"; // full | rails | none
  const inW = W - 2 * T;

  // Sides: grain vertical, front edge banded.
  out.push(panel(cab, "Side", mats.carcass, H, sideDepth, 2, "length", { L1: edges.internal }));
  // Bottom (between sides)
  out.push(panel(cab, "Bottom", mats.carcass, inW, sideDepth, 1, "length", { L1: edges.internal }));
  if (topMode === "full") out.push(panel(cab, "Top", mats.carcass, inW, sideDepth, 1, "length", { L1: edges.internal }));
  else if (topMode === "rails") out.push(panel(cab, "Top rail", mats.carcass, inW, RAIL_WIDTH, 2, "length", { L1: edges.internal }));

  // Back
  if (backMode === "overlay") out.push(panel(cab, "Back", mats.back, H, W, 1, "none"));
  else if (backMode === "inset") out.push(panel(cab, "Back", mats.back, H - 2 * T + 2 * GROOVE, inW + 2 * GROOVE, 1, "none"));

  // Partitions and shelves
  const p = cab.partitions || 0;
  const innerH = topMode === "none" ? H - T : H - 2 * T;
  if (p > 0) out.push(panel(cab, "Partition", mats.carcass, innerH, sideDepth, p, "length", { L1: edges.internal }));
  const bays = p + 1;
  const bayW = (inW - p * T) / bays;
  const shelves = cab.shelves || 0;
  if (shelves > 0) {
    const shelfMat = cab.shelf_material || mats.shelf || mats.carcass;
    out.push(panel(cab, "Shelf", shelfMat, bayW, sideDepth - SHELF_SETBACK, shelves, "length", { L1: edges.internal }));
  }

  // Drawers
  const dr = normDrawers(cab.drawers);
  const sh = normShutters(cab.shutters);
  let drawerFrontTotal = 0;
  if (dr.count > 0) {
    let fronts = dr.front_heights;
    if (!fronts) {
      const zone = sh.count > 0 ? Math.min(H / 2, 180 * dr.count) : H;
      const each = (zone - SHUTTER_GAP * dr.count) / dr.count;
      fronts = Array(dr.count).fill(r1(each));
    }
    if (fronts.length !== dr.count) throw new Error(`Cabinet ${cab.id}: drawers.front_heights must have ${dr.count} values.`);
    drawerFrontTotal = fronts.reduce((a, b) => a + b, 0) + SHUTTER_GAP * dr.count;
    const allBand = { L1: edges.shutter, L2: edges.shutter, W1: edges.shutter, W2: edges.shutter };
    const groups = new Map();
    for (const h of fronts) groups.set(h, (groups.get(h) || 0) + 1);
    for (const [h, n] of groups) out.push(panel(cab, "Drawer front", mats.shutter, W - SHUTTER_GAP, h, n, "width", allBand));
    if (dr.slide === "telescopic") {
      const slideLen = dr.slide_length || [...SLIDE_LENGTHS].reverse().find((s) => s <= sideDepth - 10);
      if (!slideLen) throw new Error(`Cabinet ${cab.id}: too shallow for drawer slides.`);
      const bt = thicknessOf(mats.drawer_box, matTable);
      const boxW = inW - 2 * SLIDE_CLEARANCE;
      for (const [h, n] of groups) {
        const boxH = Math.max(80, h - 50); // rule of thumb: box 50 lower than front
        out.push(panel(cab, "Drawer side", mats.drawer_box, slideLen, boxH, 2 * n, "length", { L1: edges.internal }));
        out.push(panel(cab, "Drawer front/back", mats.drawer_box, boxW - 2 * bt, boxH, 2 * n, "length", { L1: edges.internal }));
      }
      out.push(panel(cab, "Drawer bottom", mats.drawer_bottom, slideLen, boxW, dr.count, "length"));
    } else {
      warnings.push(
        `Cabinet ${cab.id}: drawer boxes for "${dr.slide}" systems (metal sides) follow the manufacturer's cutting formula; only drawer fronts are listed.`
      );
    }
  }

  // Shutters (overlay), split into rows if asked
  if (sh.count > 0) {
    const zoneH = sh.height || H - drawerFrontTotal;
    const rows = sh.rows || 1;
    const sw = W / sh.count - SHUTTER_GAP;
    const shH = zoneH / rows - SHUTTER_GAP;
    if (sw > 600 && !cab.allow_wide_shutters) warnings.push(`Cabinet ${cab.id}: hinged shutters ${r1(sw)} wide — over about 600 they tend to sag (rule of thumb).`);
    out.push(
      panel(cab, "Shutter", mats.shutter, shH, sw, sh.count * rows, "length", {
        L1: edges.shutter, L2: edges.shutter, W1: edges.shutter, W2: edges.shutter,
      })
    );
  }

  for (const x of cab.extra_panels || []) {
    out.push(panel(cab, x.part || x.label || "Extra", x.material || mats.carcass, x.length, x.width, x.qty || 1, x.grain || "length", x.edges || {}));
  }
  return { panels: out, warnings };
}

/** Apply edge-band deduction to get cutting sizes. */
function withCutSizes(p, deduct) {
  if (!deduct) return { ...p, cut_length: p.length, cut_width: p.width };
  const e = p.edges;
  return {
    ...p,
    cut_length: r1(p.length - bandThickness(e.W1) - bandThickness(e.W2)),
    cut_width: r1(p.width - bandThickness(e.L1) - bandThickness(e.L2)),
  };
}

// Three-stage guillotine: strips across the sheet, columns inside each strip,
// pieces stacked inside each column.
function packOrdered(items, UL, UW, k, trim) {
  const sheets = [];
  const put = (sh, st, col, it) => {
    sh.placements.push({ label: it.label, x: trim + col.x, y: trim + st.y + col.usedH, along: it.along, across: it.across, rotated: it.rotated });
    col.usedH += it.across + k;
  };
  const tryStrip = (sh, st, it) => {
    for (const col of st.columns) {
      if (it.along <= col.width + 1e-6 && col.usedH + it.across <= st.height + 1e-6) { put(sh, st, col, it); return true; }
    }
    if (it.across <= st.height + 1e-6 && st.used + it.along <= UL + 1e-6) {
      const col = { x: st.used, width: it.along, usedH: 0 };
      st.columns.push(col);
      st.used += it.along + k;
      put(sh, st, col, it);
      return true;
    }
    return false;
  };
  const newStrip = (sh, it) => {
    const st = { y: sh.nextY, height: it.across, used: 0, columns: [] };
    sh.strips.push(st);
    sh.nextY += it.across + k;
    return tryStrip(sh, st, it);
  };
  for (const it of items) {
    let placed = false;
    for (const sh of sheets) {
      for (const st of sh.strips) if (tryStrip(sh, st, it)) { placed = true; break; }
      if (placed) break;
      if (sh.nextY + it.across <= UW + 1e-6 && newStrip(sh, it)) { placed = true; break; }
    }
    if (!placed) {
      const sh = { strips: [], placements: [], nextY: 0 };
      sheets.push(sh);
      newStrip(sh, it);
    }
  }
  return sheets;
}

/**
 * Guillotine strip packer (first-fit decreasing). Conservative: a dedicated
 * optimiser or beam-saw software will usually match or beat this count.
 */
export function packSheets(pieces, sheet = DEFAULT_SHEET) {
  const S = { ...DEFAULT_SHEET, ...sheet };
  const UL = S.length - 2 * S.trim;
  const UW = S.width - 2 * S.trim;
  const k = S.kerf;
  const items = [];
  const oversize = [];
  for (const p of pieces) {
    for (let i = 0; i < p.qty; i++) {
      let along = p.cut_length, across = p.cut_width, rotated = false;
      const canRotate = p.grain === "none";
      if (canRotate && across > along) { [along, across] = [across, along]; rotated = true; }
      if (along > UL || across > UW) {
        if (canRotate && across <= UL && along <= UW) { [along, across] = [across, along]; rotated = !rotated; }
        else { oversize.push({ label: p.label, length: p.cut_length, width: p.cut_width }); continue; }
      }
      items.push({ label: p.label, along, across, rotated });
    }
  }
  const orders = [
    (a, b) => b.across - a.across || b.along - a.along,
    (a, b) => b.along * b.across - a.along * a.across,
    (a, b) => b.along - a.along || b.across - a.across,
  ];
  let sheets = null;
  for (const cmp of orders) {
    const res = packOrdered([...items].sort(cmp), UL, UW, k, S.trim);
    if (!sheets || res.length < sheets.length) sheets = res;
  }
  const sheetArea = S.length * S.width;
  return {
    sheets: sheets.map((sh, i) => {
      const used = sh.placements.reduce((a, p) => a + p.along * p.across, 0);
      return { index: i + 1, utilisation_pct: r1((used / sheetArea) * 100), placements: sh.placements };
    }),
    oversize,
  };
}

/** Full pipeline: spec -> panels, per-material sheets, edge band totals, CSV. */
export function cutList(spec) {
  if (!spec || !Array.isArray(spec.cabinets) || spec.cabinets.length === 0) {
    throw new Error("Spec needs a non-empty \"cabinets\" array.");
  }
  const sheet = { ...DEFAULT_SHEET, ...(spec.sheet || {}) };
  const deduct = spec.deduct_edge_band !== false;
  const opts = { defaults: spec.defaults, edges: spec.edges, materials: spec.materials };
  const warnings = [];
  let panels = [];
  const ids = new Set();
  for (const cab of spec.cabinets) {
    if (ids.has(cab.id)) throw new Error(`Duplicate cabinet id "${cab.id}".`);
    ids.add(cab.id);
    const qty = cab.qty || 1;
    const r = cabinetPanels(cab, opts);
    warnings.push(...r.warnings);
    panels.push(...r.panels.map((p) => ({ ...p, qty: p.qty * qty })));
  }
  for (const x of spec.extra_panels || []) {
    panels.push({
      cabinet: x.cabinet || "EXTRA", cabinet_name: x.cabinet_name || "", part: x.part || x.label || "Extra",
      material: x.material || (spec.defaults && spec.defaults.carcass) || DEFAULT_MATERIALS.carcass,
      length: x.length, width: x.width, qty: x.qty || 1, grain: x.grain || "length",
      edges: { L1: null, L2: null, W1: null, W2: null, ...(x.edges || {}) },
    });
  }
  // Labels: CAB-PART-n
  const counters = new Map();
  panels = panels.map((p) => {
    const base = `${p.cabinet}-${p.part.toUpperCase().replace(/[^A-Z0-9]+/g, "")}`;
    const n = (counters.get(base) || 0) + 1;
    counters.set(base, n);
    return withCutSizes({ ...p, label: `${base}-${n}` }, deduct);
  });
  for (const p of panels) {
    if (!(p.length > 0 && p.width > 0)) throw new Error(`Panel ${p.label} has a non-positive size (${p.length} x ${p.width}); check the cabinet sizes.`);
  }

  const byMat = new Map();
  for (const p of panels) {
    if (!byMat.has(p.material)) byMat.set(p.material, []);
    byMat.get(p.material).push(p);
  }
  const materials = [];
  for (const [mat, ps] of byMat) {
    const packed = packSheets(ps, sheet);
    for (const o of packed.oversize) warnings.push(`Panel ${o.label} (${o.length} x ${o.width}) does not fit a ${sheet.length} x ${sheet.width} sheet with its grain direction; join it or use a longer sheet.`);
    const area = ps.reduce((a, p) => a + p.length * p.width * p.qty, 0) / 1e6;
    materials.push({
      material: mat,
      panel_count: ps.reduce((a, p) => a + p.qty, 0),
      panel_area_m2: Math.round(area * 100) / 100,
      sheets: packed.sheets.length,
      average_utilisation_pct: packed.sheets.length ? r1(packed.sheets.reduce((a, s) => a + s.utilisation_pct, 0) / packed.sheets.length) : 0,
      layout: packed.sheets,
    });
  }

  const band = {};
  for (const p of panels) {
    for (const [edge, b] of Object.entries(p.edges)) {
      if (!b) continue;
      const len = edge.startsWith("L") ? p.length : p.width;
      band[b] = (band[b] || 0) + (len * p.qty) / 1000;
    }
  }
  const edge_band_m = Object.fromEntries(Object.entries(band).map(([k, v]) => [k, Math.round(v * 10) / 10]));

  return {
    project: spec.project || "",
    sheet,
    deduct_edge_band: deduct,
    panels,
    materials: materials.map(({ layout, ...m }) => m),
    layouts: Object.fromEntries(materials.map((m) => [m.material, m.layout])),
    edge_band_m,
    total_sheets: materials.reduce((a, m) => a + m.sheets, 0),
    warnings,
    notes: [
      "Sheet counts come from a guillotine strip heuristic with trim and kerf; workshop optimiser software may save a sheet or two.",
      "Edge band metres are net; add your edge bander's trimming allowance.",
      "Rule of thumb: add 5-10% spare material for site-made work and future repairs.",
    ],
    csv: { panels: panelsCsv(panels), sheets: sheetsCsv(materials) },
  };
}

function csvCell(v) {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function panelsCsv(panels) {
  const head = ["label", "cabinet", "cabinet_name", "part", "material", "finish_length", "finish_width", "cut_length", "cut_width", "qty", "grain", "edge_L1", "edge_L2", "edge_W1", "edge_W2"];
  const rows = panels.map((p) => [p.label, p.cabinet, p.cabinet_name, p.part, p.material, p.length, p.width, p.cut_length, p.cut_width, p.qty, p.grain, p.edges.L1, p.edges.L2, p.edges.W1, p.edges.W2]);
  return [head, ...rows].map((r) => r.map(csvCell).join(",")).join("\n") + "\n";
}

function sheetsCsv(materials) {
  const head = ["material", "sheet", "utilisation_pct", "label", "x", "y", "along_grain", "across_grain", "rotated"];
  const rows = [];
  for (const m of materials) for (const s of m.layout) for (const p of s.placements) rows.push([m.material, s.index, s.utilisation_pct, p.label, p.x, p.y, p.along, p.across, p.rotated]);
  return [head, ...rows].map((r) => r.map(csvCell).join(",")).join("\n") + "\n";
}
