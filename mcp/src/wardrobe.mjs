// Wardrobe + loft module planner for Indian homes. All sizes in mm.
// Rules come from skills/coohom-indian-interiors/references/wardrobes-and-lofts.md.

export const FT = 304.8;
const SCRIBE = 10; // rule of thumb: gap left at the ceiling for fitting
const LOFT_MIN = 450; // rule of thumb
const LOFT_MAX = 900; // rule of thumb

export function ceilingMm(i) {
  if (Number.isFinite(i.ceiling_mm)) return i.ceiling_mm;
  if (Number.isFinite(i.ceiling_ft)) return Math.round(i.ceiling_ft * FT);
  throw new Error("Give ceiling_ft (e.g. 9, 10, 11) or ceiling_mm.");
}

/** Heights of the main wardrobe and loft rows for a given clear height. */
export function planHeights(clear, loft = "ply", rcc = {}) {
  if (loft === "rcc") {
    const bottom = rcc.bottom || 2100;
    return {
      main: bottom - SCRIBE,
      lofts: [{ type: "existing RCC loft", height: clear - bottom, depth: rcc.depth || null }],
      note: "Existing RCC loft: survey its depth, damp-check it, and clad it with a ply frame + shutters (or a lined ply box).",
    };
  }
  const usable = clear - SCRIBE;
  if (loft === "none") {
    const main = Math.min(usable, 2400);
    return { main, lofts: [], note: usable > 2400 ? "No loft requested; wardrobe stops at 2400 with open space above." : "Full-height wardrobe." };
  }
  let main = 2100;
  let rest = usable - main;
  if (rest < LOFT_MIN) return { main: usable, lofts: [], note: `Only ${rest} left above 2100, under the ${LOFT_MIN} useful minimum: make the wardrobe full height instead.` };
  if (rest > LOFT_MAX) { main = 2400; rest = usable - main; }
  if (rest > LOFT_MAX) {
    const h = Math.floor(rest / 2);
    return { main, lofts: [{ type: "ply loft (lower row)", height: h }, { type: "ply loft (upper row)", height: rest - h }], note: "Loft over 900 split into two rows (rule of thumb)." };
  }
  return { main, lofts: [{ type: "ply loft", height: rest }], note: "" };
}

function shutterPlan(W, type) {
  if (type === "sliding") {
    const n = W <= 2000 ? 2 : W <= 3000 ? 3 : Math.ceil(W / 1100);
    return { count: n, width: Math.round(W / n), type };
  }
  let n = Math.max(1, Math.ceil(W / 600));
  if (W / n < 450 && n > 1) n -= 1;
  return { count: n, width: Math.round(W / n), type };
}

const ZONES = {
  long: { zone: "long hanging", detail: "rod at about 1700; about 1500 clear below for saris/salwar/dresses; 1-2 shelves above the rod", shelves: 2, drawers: 0 },
  short_drawers: { zone: "short hanging + drawers + locker", detail: "3 internal drawers (fronts 150-250) from about 300 up, locker in the top drawer or a box at 900-1200; rod above with 900-1000 clear; shelf above", shelves: 1, drawers: 3 },
  shelves: { zone: "shelves", detail: "shelves at 300-350 spacing for folded clothes/saris; daily-use shelves at or below about 1800", shelves: 5, drawers: 0 },
  short: { zone: "short hanging", detail: "two rods stacked for shirts/children's clothes, about 900-1000 clear each", shelves: 1, drawers: 0 },
};

/**
 * @param {object} i wall_width, ceiling_ft|ceiling_mm, loft ("ply"|"rcc"|"none"),
 *   rcc_loft_bottom, rcc_loft_depth, false_ceiling_drop, shutter_type ("hinged"|"sliding"),
 *   depth, saris (bool, default true), front_clearance (mm in front, optional)
 */
export function wardrobeLayout(i) {
  const W = Number(i.wall_width);
  if (!(W >= 450)) throw new Error("wall_width (mm) must be at least 450.");
  const ceiling = ceilingMm(i);
  const clear = ceiling - (i.false_ceiling_drop || 0);
  const loft = i.loft || "ply";
  if (!["ply", "rcc", "none"].includes(loft)) throw new Error('loft must be "ply", "rcc" or "none".');
  const warnings = [];
  const notes = [];

  let type = i.shutter_type || "hinged";
  if (!i.shutter_type && Number.isFinite(i.front_clearance) && i.front_clearance < 900) {
    type = "sliding";
    notes.push(`Only ${i.front_clearance} clear in front (< 900 for hinged): sliding shutters chosen.`);
  }
  const depth = i.depth || (type === "sliding" ? 650 : 600);
  if (depth < 550) warnings.push("Depth under 550: hangers will not fit; use shelves only or increase depth.");

  const h = planHeights(clear, loft, { bottom: i.rcc_loft_bottom, depth: i.rcc_loft_depth });
  if (h.note) notes.push(h.note);
  if (loft === "rcc" && i.rcc_loft_depth && i.rcc_loft_depth < depth) {
    notes.push(`RCC loft (${i.rcc_loft_depth} deep) is shallower than the wardrobe (${depth}): add a fascia or bring the loft shutters forward on a frame so all fronts line up.`);
  }

  const sh = shutterPlan(W, type);
  if (type === "sliding" && sh.width > 1200) warnings.push(`Sliding panels ${sh.width} wide: check the track's maximum panel size and weight.`);

  // Bays: hinged = pairs of shutters; sliding = roughly 900-1000 wide bays.
  const bayWidths = [];
  if (type === "hinged") {
    const pairs = Math.floor(sh.count / 2);
    for (let k = 0; k < pairs; k++) bayWidths.push({ w: sh.width * 2, shutters: 2 });
    if (sh.count % 2) bayWidths.push({ w: sh.width, shutters: 1 });
  } else {
    const n = Math.max(2, Math.round(W / 950));
    for (let k = 0; k < n; k++) bayWidths.push({ w: Math.round(W / n), shutters: 0 });
  }
  const order = i.saris === false ? ["short_drawers", "shelves", "short", "long"] : ["long", "short_drawers", "shelves", "short"];
  if (bayWidths.length === 1) order.splice(0, order.length, "short_drawers");
  const bays = bayWidths.map((b, k) => ({ bay: k + 1, width: b.w, shutters: b.shutters, ...ZONES[order[k % order.length]] }));

  const lofts = h.lofts.map((l) => ({ ...l, shutters: sh.count, shutter_width: sh.width, use: "rarely used items: suitcases, bedding, festival items" }));
  for (const l of lofts) {
    if (l.type.startsWith("existing") && l.height < LOFT_MIN) warnings.push(`RCC loft opening only ${l.height} high: shutters will be short; consider an open/fascia finish.`);
  }

  const frontArea = (W * (h.main + h.lofts.reduce((a, l) => a + l.height, 0))) / (FT * FT);
  const cut_list_spec = toSpec(bays, h, depth, type, lofts, W);

  return {
    summary: {
      wall_width: W, ceiling_mm: ceiling, clear_height: clear, wardrobe_height: h.main,
      lofts: lofts.map((l) => `${l.type} ${l.height}`), depth, shutter_type: type,
      shutters: sh.count, shutter_width: sh.width, bays: bays.length,
      front_area_sqft: Math.round(frontArea * 10) / 10,
    },
    bays, lofts, notes, warnings,
    checks: [
      type === "hinged" ? "Keep about 900 clear in front for hinged shutters." : "Sliding: plan internal drawers so they clear the inner panel (check catalogue).",
      "Top daily-use shelf at or below about 1800; lofts need a step stool.",
      "Plan wardrobe light and sockets before the walls are finished.",
    ],
    cut_list_spec,
  };
}

function toSpec(bays, h, depth, type, lofts, W) {
  const cabinets = [];
  const carcassD = type === "sliding" ? depth - 75 : depth - 18; // rule of thumb: track zone / shutter thickness
  bays.forEach((b, k) => {
    cabinets.push({
      id: `W${String(k + 1).padStart(2, "0")}`, name: `Wardrobe bay ${k + 1} (${b.zone})`,
      width: b.width, height: h.main, depth: carcassD, top: "full", back: "overlay",
      shelves: b.shelves, drawers: b.drawers ? { count: b.drawers, front_heights: [200, 200, 200] } : undefined,
      shutters: type === "hinged" ? b.shutters : 0,
    });
  });
  const extra = [];
  lofts.forEach((l, k) => {
    if (l.type.startsWith("existing")) {
      // Shutter frame on the RCC loft front: 2 stiles + 2 rails of 75 (rule of thumb)
      extra.push({ cabinet: `L${k + 1}`, part: "Loft frame stile", material: "18mm BWP ply", length: l.height, width: 75, qty: 2, edges: { L1: "2mm" } });
      const railPieces = Math.ceil((W - 150) / 2400);
      extra.push({ cabinet: `L${k + 1}`, part: "Loft frame rail", material: "18mm BWP ply", length: Math.round((W - 150) / railPieces), width: 75, qty: 2 * railPieces, edges: { L1: "2mm" } });
      extra.push({ cabinet: `L${k + 1}`, part: "Loft shutter", material: "18mm BWP ply", length: l.height - 6, width: l.shutter_width - 3, qty: l.shutters, edges: { L1: "2mm", L2: "2mm", W1: "2mm", W2: "2mm" } });
    } else {
      // One loft box per bay so no panel exceeds a sheet; shutters match the bay below.
      bays.forEach((b, j) => {
        const n = type === "hinged" ? b.shutters : Math.max(1, Math.ceil(b.width / 600));
        cabinets.push({
          id: `L${k + 1}${String(j + 1).padStart(2, "0")}`, name: `${l.type} over bay ${j + 1}`, width: b.width, height: l.height,
          depth: carcassD, top: "full", back: "overlay", shelves: 0, shutters: n,
        });
      });
    }
  });
  if (type === "sliding") {
    extra.push({ cabinet: "SLD", part: "Sliding shutter", material: "18mm HDHMR", length: h.main - 50, width: Math.round(W / (W <= 2000 ? 2 : W <= 3000 ? 3 : Math.ceil(W / 1100))) + 25, qty: W <= 2000 ? 2 : W <= 3000 ? 3 : Math.ceil(W / 1100), edges: { L1: "2mm", L2: "2mm", W1: "2mm", W2: "2mm" }, note: "size per sliding system's formula — check catalogue" });
  }
  return {
    project: "Wardrobe",
    defaults: { carcass: "18mm MR ply", back: "6mm MR ply", shutter: "18mm MR ply", drawer_box: "12mm MR ply", drawer_bottom: "6mm MR ply" },
    cabinets,
    extra_panels: extra,
    note: "MR grade for dry bedrooms; switch to BWP on damp external walls or in Kerala's humidity. Sliding shutter sizes follow the track maker's formula.",
  };
}
