// Indian modular kitchen layout calculator. All sizes in mm.
// Rules come from skills/coohom-indian-interiors/references/kitchen.md.
// Room frame: wall A runs along x from (0,0) to (length,0); wall B is x=0;
// wall C is y=width (opposite A); wall D is x=length (usually the door wall).

const COUNTER_DEPTH = 600;
const CARCASS_DEPTH = 560;
const BASE_CARCASS_H = 720;
const WALL_UNIT_H = 720;
const WALL_UNIT_D = 350;
const TALL_H = 2100;
const CORNER_FILLER = 75; // rule of thumb
const ISLAND_CLEAR = 1000; // hard rule: >= 1000 on every working side
const ISLAND_DEPTH = 900; // rule of thumb: worktop island
const ISLAND_MIN_LEN = 1200; // rule of thumb

// Rule-of-thumb starting counts per home type (see kitchen.md section 6).
export const HOME_PRESETS = {
  "1bhk": { drawers: 2, oil: [150], tall: 0 },
  "2bhk": { drawers: 3, oil: [150, 200], tall: 1 },
  "3bhk": { drawers: 4, oil: [150, 200], tall: 2 },
  villa: { drawers: 5, oil: [150, 200], tall: 3 },
};

export function homeTypeFromFamily(n) {
  if (!Number.isFinite(n) || n <= 2) return "1bhk";
  if (n <= 4) return "2bhk";
  if (n <= 6) return "3bhk";
  return "villa";
}

/** Counter height from the main cook's height (rule of thumb). */
export function counterHeight(cookHeight = 1525) {
  const elbow = 0.617 * cookHeight; // Indian anthropometry: elbow ~ 0.617 x stature
  const h = Math.round((elbow - 100) / 5) * 5;
  return Math.min(900, Math.max(820, h));
}

/** Best combination of 600/450/300 modules filling `g` (max fill, fewest units). */
export function fillModules(g) {
  let best = { fill: 0, units: [] };
  for (let a = Math.floor(g / 600); a >= 0; a--) {
    for (let b = Math.floor((g - 600 * a) / 450); b >= 0; b--) {
      const c = Math.floor((g - 600 * a - 450 * b) / 300);
      const fill = 600 * a + 450 * b + 300 * c;
      const n = a + b + c;
      if (fill > best.fill || (fill === best.fill && n < best.units.length)) {
        best = { fill, units: [...Array(a).fill(600), ...Array(b).fill(450), ...Array(c).fill(300)] };
      }
    }
  }
  const rest = g - best.fill;
  return { units: best.units, leftover: rest };
}

function chooseLayout(width, length, free) {
  const has = (w) => free.includes(w);
  const short = Math.min(width, length);
  if (short < 1600) return "straight";
  if (short < 2200) return has("B") && width - COUNTER_DEPTH - CORNER_FILLER >= 1200 ? "L" : "straight";
  if (short < 2400) {
    if (has("C") && width >= 2 * COUNTER_DEPTH + 1000) return "parallel";
    return has("B") ? "L" : "straight";
  }
  if (has("B") && has("C") && width - 2 * COUNTER_DEPTH >= 1200) return "U";
  if (has("B")) return "L";
  if (has("C")) return "parallel";
  return "straight";
}

function islandCheck(layout, width, length) {
  if (!["straight", "L"].includes(layout)) {
    return { fits: false, reason: `an island is not combined with a ${layout} layout here (too little clear space)` };
  }
  const needW = COUNTER_DEPTH + ISLAND_CLEAR + ISLAND_DEPTH + ISLAND_CLEAR;
  const legB = layout === "L" ? COUNTER_DEPTH : 0;
  const needL = legB + ISLAND_CLEAR + ISLAND_MIN_LEN + ISLAND_CLEAR;
  if (width < needW) return { fits: false, reason: `room width ${width} < ${needW} needed for 1000 clear on both sides of a ${ISLAND_DEPTH} deep island` };
  if (length < needL) return { fits: false, reason: `room length ${length} < ${needL} needed for 1000 clear at both ends of a ${ISLAND_MIN_LEN} island` };
  const islandLen = Math.min(2400, length - legB - 2 * ISLAND_CLEAR);
  const islandDepth = Math.min(1200, width - COUNTER_DEPTH - 2 * ISLAND_CLEAR);
  return {
    fits: true,
    island: {
      length: islandLen, depth: islandDepth,
      x: legB + ISLAND_CLEAR, y: COUNTER_DEPTH + ISLAND_CLEAR,
      seating: islandDepth >= 1200 ? `one side, about ${Math.floor(islandLen / 600)} stools at 600 each (rule of thumb)` : "none (depth under 1200)",
    },
  };
}

function point(wall, s, width) {
  if (wall === "A") return [s, COUNTER_DEPTH / 2];
  if (wall === "B") return [COUNTER_DEPTH / 2, s];
  return [s, width - COUNTER_DEPTH / 2];
}

const dist = (p, q) => Math.round(Math.hypot(p[0] - q[0], p[1] - q[1]));

/**
 * @param {object} i
 *  length, width (internal mm, length along wall A); free_walls (default ["A","B","C"]);
 *  family_size; home_type ("1bhk"|"2bhk"|"3bhk"|"villa"); cook_height;
 *  window_wall ("A"|"B"|"C"), window_center (mm along that wall), window_width;
 *  fridge_width (default 750); want_island; vastu; east_wall ("A"|"B"|"C"|"D").
 */
export function kitchenLayout(i) {
  const length = Number(i.length), width = Number(i.width);
  if (!(length > 0 && width > 0)) throw new Error("length and width (internal, mm) are required.");
  const free = (i.free_walls || ["A", "B", "C"]).map((w) => String(w).toUpperCase());
  if (!free.includes("A")) throw new Error("Wall A must be free: name the longest free wall A.");
  const homeType = (i.home_type || homeTypeFromFamily(i.family_size)).toLowerCase();
  const preset = HOME_PRESETS[homeType];
  if (!preset) throw new Error(`home_type must be one of ${Object.keys(HOME_PRESETS).join(", ")}`);
  const fridgeW = i.fridge_width || 750;
  const notes = [];
  const warnings = [];

  let layout = chooseLayout(width, length, free);
  let island = null;
  if (i.want_island && layout === "U" && free.includes("B") && islandCheck("L", width, length).fits) {
    layout = "L";
    notes.push("Chose L + island instead of U because an island was requested and fits with 1000 clear all round.");
  }
  if (i.want_island) {
    const chk = islandCheck(layout, width, length);
    if (chk.fits) island = chk.island;
    else notes.push(`Island omitted: ${chk.reason}. Offer a peninsula or breakfast ledge instead.`);
  }

  // Runs: [wall, start, end, cornerAtStart]
  const runs = { A: { start: 0, end: length, corner: false } };
  if (layout === "L") { runs.A.corner = true; runs.B = { start: COUNTER_DEPTH + CORNER_FILLER, end: width, corner: false }; }
  if (layout === "parallel") runs.C = { start: 0, end: length, corner: false };
  if (layout === "U") {
    runs.A.corner = true;
    runs.C = { start: 0, end: length, corner: true };
    runs.B = { start: COUNTER_DEPTH + CORNER_FILLER, end: width - COUNTER_DEPTH - CORNER_FILLER, corner: false };
  }

  // Which wall gets sink, hob, fridge/tall.
  const walls = Object.keys(runs);
  let sinkWall = i.window_wall && walls.includes(i.window_wall) ? i.window_wall : null;
  let hobWall;
  if (layout === "straight") { sinkWall = "A"; hobWall = "A"; }
  else if (layout === "L") { sinkWall = sinkWall || "B"; hobWall = sinkWall === "A" ? "B" : "A"; }
  else if (layout === "parallel") { sinkWall = sinkWall || "A"; hobWall = sinkWall === "A" ? "C" : "A"; }
  else { sinkWall = sinkWall || "B"; hobWall = sinkWall === "A" ? "C" : "A"; }
  if (i.vastu) {
    if (i.east_wall && walls.includes(i.east_wall) && i.east_wall !== sinkWall) {
      hobWall = i.east_wall;
      notes.push(`Vastu option: hob on the east wall (${hobWall}) so the cook faces east; keep it toward the south-east end.`);
    } else {
      notes.push("Vastu option: place the hob in the south-east zone with the cook facing east and keep the sink away from the hob; give east_wall to let the tool place it.");
    }
  }
  if (i.window_wall && i.window_wall === hobWall && layout !== "straight") {
    warnings.push("The hob wall has a window: keep the hob clear of the window opening (wind and curtains).");
  }
  let fridgeWall = "A";
  if (layout === "L") fridgeWall = sinkWall === "A" ? "A" : "B";
  if (layout === "parallel" || layout === "U") {
    fridgeWall = sinkWall === "A" ? "C" : sinkWall === "C" ? "A" : hobWall === "A" ? "C" : "A";
  }
  if (layout === "L" && fridgeWall === hobWall) fridgeWall = sinkWall;
  // mandatory length on a wall (corner, sink, landing, hob block, minimum landing)
  const need = (wall, corner) =>
    (corner ? 900 : 0) + (wall === sinkWall ? 900 : 0) + (wall === sinkWall && wall === hobWall ? 600 : 0) + (wall === hobWall ? 1200 : 0) + 300;

  const units = [];
  let drawersLeft = preset.drawers;
  let tallLeft = preset.tall;
  const add = (wall, s, w, type, extra = {}) => units.push({ wall, start: s, width: w, type, ...extra });

  function fill(wall, s, e) {
    const { units: mods, leftover } = fillModules(e - s);
    let x = s;
    for (const m of mods) {
      if (drawersLeft > 0 && m >= 450) { add(wall, x, m, "drawer unit (tandem/basket)"); drawersLeft--; }
      else add(wall, x, m, "shutter unit");
      x += m;
    }
    if (leftover >= 150) { add(wall, x, leftover, "open rack / spice shelf"); x += leftover; }
    else if (leftover > 0) { add(wall, x, leftover, "filler"); x += leftover; }
    return x;
  }

  for (const wall of walls) {
    const run = runs[wall];
    let x = run.start;
    let end = run.end;
    if (run.corner) { add(wall, x, 900, "corner unit (blind / magic corner)"); x += 900; }

    // reserve the far end for fridge and tall units
    const tail = [];
    if (wall === fridgeWall) {
      tail.push({ w: fridgeW, type: "fridge space" });
      while (tallLeft > 0 && end - run.start - tail.reduce((a, t) => a + t.w, 0) - 600 >= need(wall, run.corner)) {
        tail.unshift({ w: 600, type: tallLeft === preset.tall ? "tall unit (microwave/oven)" : "tall unit (pantry)" });
        tallLeft--;
      }
    }
    const tailW = tail.reduce((a, t) => a + t.w, 0);
    const workEnd = end - tailW;

    if (wall === sinkWall) {
      let sinkStart = x;
      if (i.window_wall === wall && Number.isFinite(i.window_center)) {
        const after = need(wall, false) - 300 + (wall === hobWall ? 300 : 0);
        sinkStart = Math.max(x, Math.min(i.window_center - 450, workEnd - after));
        if (sinkStart > x) x = fill(wall, x, sinkStart);
      }
      add(wall, x, 900, "sink base (BWP, no drawers)"); x += 900;
      if (wall === hobWall) { // straight layout: landing unit between sink and hob
        const isDrawer = drawersLeft > 0;
        if (isDrawer) drawersLeft--;
        add(wall, x, 600, isDrawer ? "drawer unit (tandem/basket)" : "shutter unit"); x += 600;
      }
    }
    if (wall === hobWall) {
      add(wall, x, 900, "hob base with 2-3 deep drawers", { chimney_above: true }); x += 900;
      for (const ow of preset.oil) {
        if (workEnd - x - ow >= 450) { add(wall, x, ow, `oil / bottle pull-out (cabinet ${ow})`); x += ow; }
        else notes.push(`Oil pull-out (cabinet ${ow}) skipped on wall ${wall}: it would leave under 450 landing space beside the hob.`);
      }
      if (workEnd - x < 300) warnings.push(`Wall ${wall}: less than 300 landing space after the hob block.`);
    }
    if (x > workEnd) {
      warnings.push(`Wall ${wall} is too short for the required units (${x} > ${workEnd} mm); reduce units or choose another layout.`);
    } else x = fill(wall, x, workEnd);
    let t = workEnd;
    for (const tu of tail) { add(wall, t, tu.w, tu.type); t += tu.w; }
  }
  if (drawersLeft > 0) notes.push(`${drawersLeft} drawer unit(s) from the ${homeType} preset did not fit; consider tall pull-outs or an island.`);
  if (tallLeft > 0) notes.push(`${tallLeft} tall unit(s) from the ${homeType} preset did not fit.`);

  // Work triangle
  const centre = (u) => point(u.wall, u.start + u.width / 2, width);
  const sink = units.find((u) => u.type.startsWith("sink"));
  const hob = units.find((u) => u.type.startsWith("hob"));
  const fridge = units.find((u) => u.type === "fridge space");
  let triangle = null;
  if (sink && hob && fridge) {
    const legs = { sink_hob: dist(centre(sink), centre(hob)), hob_fridge: dist(centre(hob), centre(fridge)), fridge_sink: dist(centre(fridge), centre(sink)) };
    const total = legs.sink_hob + legs.hob_fridge + legs.fridge_sink;
    triangle = { legs, total, within_4000_7900: total >= 4000 && total <= 7900, all_legs_1200_2700: Object.values(legs).every((l) => l >= 1200 && l <= 2700) };
    if (!triangle.within_4000_7900) warnings.push(`Work triangle total ${total} mm is outside 4000-7900.`);
    else if (!triangle.all_legs_1200_2700) notes.push("Work triangle total is fine but one leg is outside 1200-2700; adjust unit order if possible.");
  }

  // Wall units: over base runs, skipping hob (chimney), window, tall units and fridge.
  const wallUnits = [];
  for (const wall of walls) {
    const blocked = units.filter((u) => u.wall === wall && (u.chimney_above || u.type.startsWith("tall") || u.type === "fridge space"))
      .map((u) => [u.start, u.start + u.width]);
    if (i.window_wall === wall && Number.isFinite(i.window_center)) {
      const ww = i.window_width || 1200;
      blocked.push([i.window_center - ww / 2, i.window_center + ww / 2]);
    }
    blocked.sort((a, b) => a[0] - b[0]);
    let s = runs[wall].start;
    const segs = [];
    for (const [b0, b1] of blocked) { if (b0 > s) segs.push([s, b0]); s = Math.max(s, b1); }
    if (runs[wall].end > s) segs.push([s, runs[wall].end]);
    for (const [a, b] of segs) {
      let x = a;
      for (const m of fillModules(b - a).units) { wallUnits.push({ wall, start: x, width: m, type: "wall unit" }); x += m; }
    }
    const f = units.find((u) => u.wall === wall && u.type === "fridge space");
    if (f) wallUnits.push({ wall, start: f.start, width: f.width, type: "bridge unit above fridge (shallow)" });
  }

  const ch = counterHeight(i.cook_height || 1525);
  const heights = {
    counter_top: ch,
    base_carcass: BASE_CARCASS_H,
    plinth_legs: ch - BASE_CARCASS_H - 20,
    counter_thickness_assumed: 20,
    wall_unit_bottom: ch + 600,
    wall_unit_height: WALL_UNIT_H,
    wall_unit_depth: WALL_UNIT_D,
    chimney_above_hob: "650-750 (check the chimney manual)",
    tall_unit_height: TALL_H,
    kitchen_sockets: 1100,
  };
  if (heights.plinth_legs < 80) warnings.push("Plinth below 80 mm: reduce the carcass height for this counter height.");

  const count = (pred) => units.filter(pred).length;
  const summary = {
    layout, home_type: homeType, island: island || "none",
    base_run_mm: Object.values(runs).reduce((a, r) => a + (r.end - r.start), 0),
    sink_wall: sinkWall, hob_wall: hobWall, fridge_wall: fridgeWall,
    drawer_units: count((u) => u.type.startsWith("drawer")),
    oil_pullouts: units.filter((u) => u.type.startsWith("oil")).map((u) => u.width),
    tall_units: count((u) => u.type.startsWith("tall")),
    corner_units: count((u) => u.type.startsWith("corner")),
    shutter_units: count((u) => u.type === "shutter unit"),
    wall_units: wallUnits.length,
  };

  notes.push(
    "Counts are rule-of-thumb starting points; adjust to the family's vessels and storage.",
    "Provide sockets for chimney, hob (if electric), microwave, mixie, wet grinder, RO, fridge and dishwasher; a ventilated cylinder unit or piped gas.",
    "Plan a utility/work area next to the kitchen for wet grinding and vessel washing if space allows."
  );

  return {
    summary, heights, triangle, base_units: units, wall_units: wallUnits, notes, warnings,
    cut_list_spec: toCutListSpec(units, wallUnits, ch),
  };
}

function toCutListSpec(units, wallUnits, ch) {
  const cabinets = [];
  let n = 1;
  const id = () => `K${String(n++).padStart(2, "0")}`;
  for (const u of units) {
    if (u.type === "fridge space" || u.type === "filler") continue;
    const base = { id: id(), name: `${u.type} ${u.width} (wall ${u.wall})`, width: u.width, height: BASE_CARCASS_H, depth: CARCASS_DEPTH, top: "rails", back: "overlay" };
    if (u.type.startsWith("sink")) cabinets.push({ ...base, back: "none", shutters: 2 });
    else if (u.type.startsWith("hob")) cabinets.push({ ...base, drawers: { count: 2, front_heights: [300, 400] } });
    else if (u.type.startsWith("drawer")) cabinets.push({ ...base, drawers: { count: 3, front_heights: [150, 250, 300] } });
    else if (u.type.startsWith("oil")) cabinets.push({ ...base, shutters: 1, allow_wide_shutters: true });
    else if (u.type.startsWith("corner")) cabinets.push({ ...base, shelves: 1, shutters: 1 });
    else if (u.type.startsWith("open rack")) cabinets.push({ ...base, shelves: 2 });
    else if (u.type.startsWith("tall")) cabinets.push({ ...base, height: TALL_H, top: "full", shelves: 4, shutters: { count: u.width > 600 ? 2 : 1, rows: 2 } });
    else cabinets.push({ ...base, shelves: 1, shutters: u.width > 600 ? 2 : 1 });
  }
  for (const u of wallUnits) {
    const shallow = u.type.startsWith("bridge");
    cabinets.push({
      id: id(), name: `${u.type} ${u.width} (wall ${u.wall})`, width: u.width, height: shallow ? 400 : WALL_UNIT_H,
      depth: WALL_UNIT_D, top: "full", back: "overlay", shelves: shallow ? 0 : 1, shutters: u.width > 600 ? 2 : 1,
    });
  }
  return {
    project: "Kitchen",
    defaults: { carcass: "18mm BWP ply", back: "6mm BWP ply", shutter: "18mm BWP ply" },
    cabinets,
    note: `Counter top at ${ch}; base carcass ${BASE_CARCASS_H}. Edit materials and internals before cutting.`,
  };
}
