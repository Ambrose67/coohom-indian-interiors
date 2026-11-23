// Indian residential interior standards for quick lookup. All sizes in mm unless stated.
// Labels: "(rule of thumb)" = practice convention; "(check catalogue)" = brand-dependent.
// Full explanations live in skills/coohom-indian-interiors/references/*.md.

export const STANDARDS = {
  kitchen: {
    aliases: ["modular kitchen", "counter", "countertop", "worktop", "work triangle", "chimney", "hob", "sink"],
    ref: "references/kitchen.md",
    values: {
      counter_height: "820-860 typical; from cook height: 0.617 x stature - 100, limited to 820-900 (rule of thumb)",
      counter_depth: "600 (650 with back ledge); carcass 560-580",
      base_carcass: "about 720 + legs/skirting 100-150 + counter 20-40",
      wall_units: "600-720 high, 300-350 deep, bottom 600-750 above counter",
      chimney_above_hob: "650-750 (check catalogue)",
      tall_units: "2100-2150 high, 560-600 deep",
      aisle: "1000-1200 (1200 for two cooks); island only with >= 1000 clear on every working side",
      work_triangle: "each leg 1200-2700, total 4000-7900",
      module_widths: "300, 450, 600, 900 + corner units",
      oil_pullout: "cabinet widths 150, 200, 300 (check catalogue)",
      hob_landing: "at least 300 each side, 450 better (rule of thumb)",
      sockets: "about 1100 above floor",
    },
  },
  wardrobe: {
    aliases: ["closet", "almirah", "cupboard", "saree", "sari", "hanging"],
    ref: "references/wardrobes-and-lofts.md",
    values: {
      depth: "600 hinged (550 minimum for hangers); about 650 sliding (rule of thumb, check catalogue)",
      height: "2100 standard; 2400 with 10-11 ft ceilings",
      shutter_width: "450-600 hinged; sliding panels about 750-1200 (check catalogue)",
      front_clearance: "900 for hinged",
      long_hanging: "1400-1500 clear below rod",
      short_hanging: "900-1000 clear below rod",
      rod_height: "about 1600-1750",
      shelf_spacing: "300-350",
      top_daily_shelf: "at or below about 1800",
      drawers: "fronts 150-250, placed 300-900 above floor (rule of thumb)",
      locker: "900-1200 above floor (rule of thumb)",
    },
  },
  loft: {
    aliases: ["lofts", "rcc loft", "concrete loft", "ceiling height", "9 ft", "10 ft", "11 ft"],
    ref: "references/wardrobes-and-lofts.md",
    values: {
      ceiling_heights: "9 ft = 2743, 10 ft = 3048, 11 ft = 3353",
      useful_loft_height: "450-900 (rule of thumb); over 900 split into two rows or raise the wardrobe",
      nine_ft: "wardrobe 2100 + loft about 640",
      ten_ft: "wardrobe 2400 + loft about 650",
      eleven_ft: "wardrobe 2400 + two loft rows about 475 each",
      rcc_loft: "survey depth/height, damp-check, clad with 18 BWP ply frame + shutters or a lined ply box",
    },
  },
  false_ceiling: {
    aliases: ["ceiling", "gypsum", "cove", "pop"],
    ref: "references/rooms-and-units.md",
    values: {
      material: "12.5 gypsum board on GI frame; POP; wood panels (Kerala); PVC/WPC in wet areas",
      drop: "225-300 for coves and lights",
      clear_height_target: "about 2600 (rule of thumb); 9 ft rooms: peripheral/cove only",
    },
  },
  doors: {
    aliases: ["door", "main door", "toilet door", "flush door"],
    ref: "references/rooms-and-units.md",
    values: {
      main: "1000-1200 x 2100; teak or teak-faced shutter, hardwood frame",
      bedroom: "900 x 2100; flush door with laminate/veneer",
      kitchen: "900 x 2100 or open arch",
      toilet: "750 x 2100; FRP/WPC/PVC shutter, WPC frame, granite threshold",
      lintel: "2100",
    },
  },
  tv_unit: {
    aliases: ["tv", "television", "media unit", "living"],
    ref: "references/rooms-and-units.md",
    values: {
      console: "350-450 deep, 300-450 above floor",
      tv_centre: "1000-1100 above floor seated",
      viewing_distance: "about 1.5-2.5 x screen diagonal",
      sofa: "3-seater 1950-2200 x 850-950, seat 420-450",
      sofa_to_coffee_table: "400-450",
    },
  },
  crockery: { aliases: ["crockery unit", "display unit"], ref: "references/rooms-and-units.md", values: { base: "400-450 deep", upper: "300-350 deep, glass shutters", height: "about 2100" } },
  shoe_rack: { aliases: ["shoe", "shoes"], ref: "references/rooms-and-units.md", values: { depth: "300-350", height: "900-1050 (can include a seat)", note: "ventilated shutters" } },
  pooja: {
    aliases: ["puja", "mandir", "prayer"],
    ref: "references/rooms-and-units.md",
    values: { wall_unit: "600-1200 wide, 300-450 deep", floor_mandir: "900-1200 wide", platform_standing: "900-1100", platform_seated: "600-900", room: "about 4'x4' to 5'x6'", vastu: "north-east (option)" },
  },
  bedroom: {
    aliases: ["bed", "dressing", "study"],
    ref: "references/rooms-and-units.md",
    values: { king: "1830 x 1980", queen: "1525 x 1980", single: "915 x 1905", bed_height: "450-500", side_clearance: "600 min", dressing_mirror: "bottom 1000-1100, top >= 1800-1900", study_table: "750 high, 500-600 deep" },
  },
  bathroom: {
    aliases: ["toilet", "vanity", "bath"],
    ref: "references/rooms-and-units.md",
    values: { vanity_rim: "800-850", vanity_material: "WPC/PVC or BWP ply", wc_centre_from_wall: "400-450", wc_front_clear: "600", shower: "900 x 900 min, 1200 x 900 better", geyser: "1800-2000" },
  },
  materials: {
    aliases: ["plywood", "ply", "mr", "bwp", "bwr", "hdhmr", "mdf", "laminate", "acrylic", "pu", "veneer", "wpc"],
    ref: "references/materials-and-hardware.md",
    values: {
      mr_ply: "IS 303 moisture resistant: dry areas (wardrobes, TV units)",
      bwp_ply: "IS 710 marine / boiling-water proof: kitchens, vanities, utility, damp walls, RCC loft linings",
      hdhmr: "shutters, CNC fronts, budget kitchens",
      mdf: "dry decorative only",
      wpc_pvc: "bathroom vanities, wet utility",
      thickness: "18-19 carcass/shutters; 12 some shelves; 6-8 backs",
      laminate: "about 1 mm outside, 0.7-0.8 liner inside",
      finishes: "laminate, acrylic, PU, veneer, lacquered glass, profile shutters",
      counters: "granite standard; quartz premium; avoid marble for Indian cooking",
    },
  },
  hardware: {
    aliases: ["hinges", "channels", "slides", "tandem", "gtpt", "baskets", "pull-out", "corner"],
    ref: "references/materials-and-hardware.md",
    values: {
      hinges: "soft-close concealed; count per shutter by height/weight (check catalogue)",
      slides: "telescopic (budget) or tandem/box systems (soft-close)",
      baskets: "thali, plate, cup-saucer, cutlery, plain; SS 304 in humid regions",
      corners: "blind corner, magic corner, LeMans, carousel (check catalogue)",
      brands: "Hettich, Häfele, Ebco, Blum and others",
    },
  },
  sheets: {
    aliases: ["sheet", "8x4", "cut list", "cutlist", "kerf", "edge band", "edge banding", "grain"],
    ref: "references/cut-list.md",
    values: {
      sheet: "8' x 4' = 2440 x 1220 (others such as 7'x4', 8'x3' exist; check availability)",
      trim: "about 10 per edge (rule of thumb; set to your saw)",
      kerf: "3-4 typical (set to your blade)",
      edge_band: "0.8 internal edges, 2 on visible edges and shutters",
      grain: "sheet grain along 2440; sides and shutters vertical",
    },
  },
  lighting: {
    aliases: ["lux", "light", "colour temperature", "kelvin"],
    ref: "references/rooms-and-units.md",
    values: { living: "150-300 lux", bedroom: "100-150 lux", kitchen_counter: "300-500 lux", study: "300-500 lux", bath: "150-200 lux", cct: "2700-3000K living/bed, about 4000K kitchen/study/bath" },
  },
  electrical: {
    aliases: ["switch", "socket", "points", "ac point"],
    ref: "references/rooms-and-units.md",
    values: { switchboard: "1200-1350", general_socket: "300", kitchen_socket: "about 1100", bedside: "600-750", ac: "2100-2300", geyser: "about 2000", tv: "about 450 or behind TV" },
  },
  anthropometry: {
    aliases: ["body", "height", "reach", "elbow", "elderly", "children", "wheelchair"],
    ref: "human-anthropometry skill",
    values: {
      stature: "men about 1650, women about 1520-1530",
      elbow_standing: "men about 1020, women about 940",
      reach: "comfortable overhead men 1900-2000, women 1750-1800",
      wheelchair: "turning circle 1500; door clear width >= 900",
    },
  },
  stairs: {
    aliases: ["staircase", "stair", "riser", "tread"],
    ref: "architectural-planning skill",
    values: { riser: "150-190", tread: "250-300", rule: "2R + T about 600-640", width: "900-1200 for homes", headroom: ">= 2200", handrail: "about 900" },
  },
};

export function topics() {
  return Object.keys(STANDARDS);
}

export function lookup(query) {
  const q = String(query || "").toLowerCase().trim();
  if (!q) return { topics: topics() };
  const hits = [];
  for (const [key, t] of Object.entries(STANDARDS)) {
    let score = 0;
    if (q === key || q.replace(/[\s-]+/g, "_") === key) score = 100;
    else if (key.includes(q) || q.includes(key.replace(/_/g, " "))) score = 50;
    for (const a of t.aliases) if (q === a) score = Math.max(score, 90); else if (q.includes(a) || a.includes(q)) score = Math.max(score, 40);
    if (!score) for (const k of Object.keys(t.values)) if (k.includes(q.replace(/[\s-]+/g, "_"))) score = Math.max(score, 30);
    if (score) hits.push({ score, key, t });
  }
  hits.sort((a, b) => b.score - a.score);
  if (!hits.length) return { match: null, topics: topics(), message: `No topic matches "${query}". Try one of the listed topics.` };
  const top = hits.filter((h) => h.score === hits[0].score);
  return {
    match: top.map((h) => ({ topic: h.key, values: h.t.values, reference: h.t.ref })),
    other_topics: hits.slice(top.length, top.length + 3).map((h) => h.key),
    units: "mm unless stated",
    note: "Typical Indian residential values; site measurements and the client's needs override. (rule of thumb) = convention; (check catalogue) = brand-dependent.",
  };
}
