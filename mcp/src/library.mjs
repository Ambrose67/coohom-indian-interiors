// Coohom library lookup: suggests models from the user's OWN Coohom library
// (favourites, personal library) and points to the right public catalogue
// folders/categories for a room or a measured space.
//
// The catalogue is private user data and is NOT shipped in this repo. It is read
// from a local folder (default ~/.claude/coohom-library, or COOHOM_LIBRARY_DIR):
//   own.json                 {favourites[], personal_library[], favourite_materials[], favourite_components[]}
//                            items: {id, name, cat, w, d, h} (mm bounding box)
//   public-categories.json   [{name, path, count}]  (coohom.com/3d-models tree)
//   catalogues/*.json        {label, folders: {"A > B": {name, n, widths_in[]}}}
//   preferences.json         {preferred: [{id|name, note}], avoid: [...]}  (optional, hand-edited)
// Every file is optional; the tool says what is missing.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export function libraryDir() {
  return process.env.COOHOM_LIBRARY_DIR || join(homedir(), ".claude", "coohom-library");
}

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

export function loadLibrary(dir = libraryDir()) {
  const lib = { dir, own: null, publicCategories: [], catalogues: [], preferences: { preferred: [], avoid: [] }, missing: [] };
  const f = (n) => join(dir, n);
  if (existsSync(f("own.json"))) lib.own = readJson(f("own.json"));
  else lib.missing.push("own.json (favourites / personal library)");
  if (existsSync(f("public-categories.json"))) lib.publicCategories = readJson(f("public-categories.json"));
  else lib.missing.push("public-categories.json");
  if (existsSync(f("catalogues"))) {
    for (const n of readdirSync(f("catalogues")).filter((x) => x.endsWith(".json"))) lib.catalogues.push(readJson(join(f("catalogues"), n)));
  } else lib.missing.push("catalogues/ (Kitchen & Closet catalogues)");
  if (existsSync(f("preferences.json"))) lib.preferences = { preferred: [], avoid: [], ...readJson(f("preferences.json")) };
  return lib;
}

// What an Indian room usually needs, with search words and typical sizes (mm, rule of thumb;
// see references/rooms-and-units.md). Keywords match item names and Coohom category names.
export const ROOM_NEEDS = {
  living: [
    { need: "3-seater sofa", kw: ["sofa", "card slot", "sectional"], size: "1950-2200 x 850-950" },
    { need: "single sofa / armchair", kw: ["armchair", "single sofa", "lounge chair", "chair"] },
    { need: "coffee table", kw: ["coffee table", "tea table"], size: "h 400-450" },
    { need: "TV unit / TV wall", kw: ["tv", "tv stand", "tv wall", "media"], size: "console 350-450 deep" },
    { need: "partition / jaali", kw: ["partition", "screen", "divider", "jaali"] },
    { need: "feature / background wall", kw: ["background wall", "walls", "wainscot", "panel"] },
    { need: "ceiling fan / lights", kw: ["fan", "chandelier", "downlight", "ceiling lamp", "track light"] },
    { need: "swing (oonjal)", kw: ["swing", "oonjal", "hanging chair"] },
  ],
  bedroom: [
    { need: "bed (queen/king)", kw: ["bed", "bed frame", "bed combination", "headboard", "cot"], size: "Queen 1525x1980, King 1830x1980" },
    { need: "bedside table", kw: ["bedside", "nightstand", "side table"] },
    { need: "wardrobe", kw: ["wardrobe", "closet"], size: "600 deep, 2100-2400 high" },
    { need: "dressing unit", kw: ["dresser", "dressing", "mirror"] },
    { need: "bed bench", kw: ["bed bench", "bench", "ottoman", "bed end"] },
    { need: "study desk", kw: ["desk", "study"], size: "750 h, 500-600 d" },
  ],
  kitchen: [
    { need: "modular cabinets", kw: ["kitchen", "cabinet", "cabinetry"] },
    { need: "island / breakfast counter", kw: ["island", "bar counter", "bar"] },
    { need: "bar stools", kw: ["bar chair", "stool"] },
    { need: "chimney / hob / appliances", kw: ["chimney", "hood", "hob", "fridge", "refrigerator", "microwave", "oven", "dishwasher"] },
  ],
  dining: [
    { need: "dining table", kw: ["dining table", "dining"], size: "4-seat 1200x800-900, 6-seat 1800x900" },
    { need: "dining chairs", kw: ["dining chair", "chair"] },
    { need: "crockery unit", kw: ["crockery", "display cabinet", "decorative cabinet", "sideboard"] },
  ],
  pooja: [
    { need: "pooja unit / mandir", kw: ["pooja", "poja", "puja", "pooja units", "mandir", "prayer", "temple"] },
    { need: "bells / lamps / decor", kw: ["bell", "lamp", "diya", "brass"] },
  ],
  foyer: [
    { need: "shoe cabinet", kw: ["shoe"], size: "300-350 deep" },
    { need: "partition / screen", kw: ["partition", "screen", "foyer"] },
    { need: "console / mirror", kw: ["console", "mirror"] },
  ],
  bathroom: [
    { need: "vanity / wash basin", kw: ["wash basin", "vanity", "basin", "bathroom furniture"] },
    { need: "mirror", kw: ["bathroom mirror", "mirror"] },
  ],
  study: [
    { need: "desk + storage", kw: ["desk", "study", "bookcase", "book"] },
    { need: "chair", kw: ["office chair", "chair"] },
  ],
  stair: [
    { need: "staircase", kw: ["stair"] },
    { need: "under-stair storage / garden", kw: ["stair storage", "under stair", "garden"] },
  ],
};

const norm = (s) => String(s || "").toLowerCase();

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Match at the start of a word so "cot" does not hit "wainscot".
function matches(item, kws) {
  const hay = `${norm(item.name)} | ${norm(item.cat)}`;
  return kws.some((k) => !k || new RegExp(`(^|[^a-z0-9])${esc(norm(k))}`).test(hay));
}

/** Does an item fit a space? Allows a 90 degree turn in plan. Unknown sizes are "unknown". */
export function fits(item, space) {
  if (!space) return "n/a";
  const { w, d, h } = item;
  if (![w, d].every(Number.isFinite)) return "unknown";
  const W = space.width ?? Infinity, D = space.depth ?? Infinity, H = space.height ?? Infinity;
  const planOk = (w <= W && d <= D) || (d <= W && w <= D);
  const hOk = !Number.isFinite(h) || h <= H;
  return planOk && hOk ? "fits" : "too big";
}

function pref(lib, item) {
  const hit = (list) => list.find((p) => (p.id && p.id === item.id) || (p.name && norm(item.name).includes(norm(p.name))));
  const p = hit(lib.preferences.preferred || []);
  const a = hit(lib.preferences.avoid || []);
  return { preferred: !!p, note: p?.note || a?.note, avoid: !!a };
}

function ownItems(lib) {
  if (!lib.own) return [];
  const tag = (arr, source) => (arr || []).map((x) => ({ ...x, source }));
  return [
    ...tag(lib.own.favourites, "favourite"),
    ...tag(lib.own.personal_library, "personal library"),
    ...tag(lib.own.favourite_components, "favourite component"),
    ...tag(lib.own.favourite_materials, "favourite material"),
  ];
}

function rank(lib, items, space) {
  return items
    .map((it) => ({ ...it, fit: fits(it, space), ...pref(lib, it) }))
    .filter((it) => !it.avoid && it.fit !== "too big")
    .sort((a, b) =>
      (b.preferred - a.preferred) ||
      ((a.source === "favourite" ? 0 : 1) - (b.source === "favourite" ? 0 : 1)) ||
      ((a.fit === "fits" ? 0 : 1) - (b.fit === "fits" ? 0 : 1)) ||
      // bigger items that still fit use the space better
      ((b.w || 0) * (b.d || 0) - (a.w || 0) * (a.d || 0))
    )
    .map(({ avoid, ...it }) => it);
}

function catalogueHits(lib, kws, limit = 8) {
  const out = [];
  for (const c of lib.catalogues) {
    for (const [path, f] of Object.entries(c.folders || {})) {
      const hay = norm(`${path} ${f.name}`);
      if (kws.some((k) => hay.includes(norm(k)))) out.push({ catalogue: c.label, folder: path, items: f.n, widths_in: f.widths_in });
    }
  }
  return out.slice(0, limit);
}

function publicHits(lib, kws, limit = 6) {
  return lib.publicCategories
    .filter((c) => kws.some((k) => norm(c.name).includes(norm(k)) || norm(k).includes(norm(c.name))))
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, limit)
    .map((c) => ({ category: c.name, models: c.count, browse: c.path ? `https://www.coohom.com${c.path}` : undefined }));
}

/**
 * @param {object} i  query (free text), room (living|bedroom|kitchen|dining|pooja|foyer|bathroom|study|stair),
 *   space {width, depth, height} in mm (clear space available), limit (default 8)
 */
export function libraryLookup(i = {}, lib = loadLibrary()) {
  const limit = i.limit || 8;
  const space = i.space;
  const base = {
    library_dir: lib.dir,
    missing_files: lib.missing,
    note: "Your favourites are treated as your usual picks and ranked first. Sizes are Coohom bounding boxes (mm). Search the Coohom model library by the item name; place it, then check clearances.",
  };
  const all = ownItems(lib);

  if (i.room) {
    const needs = ROOM_NEEDS[norm(i.room)];
    if (!needs) throw new Error(`room must be one of: ${Object.keys(ROOM_NEEDS).join(", ")}`);
    return {
      ...base,
      room: i.room,
      space: space || null,
      needs: needs.map((n) => ({
        need: n.need,
        typical_size: n.size,
        from_your_library: rank(lib, all.filter((it) => matches(it, n.kw)), space).slice(0, Math.min(limit, 5)),
        catalogue_folders: catalogueHits(lib, n.kw, 4),
        public_categories: publicHits(lib, n.kw, 3),
      })),
    };
  }

  const q = String(i.query || "").trim();
  if (!q && !space) {
    return {
      ...base,
      summary: {
        favourites: lib.own?.favourites?.length || 0,
        personal_library: lib.own?.personal_library?.length || 0,
        catalogues: lib.catalogues.map((c) => ({ label: c.label, folders: Object.keys(c.folders || {}).length, items: Object.values(c.folders || {}).reduce((a, f) => a + (f.n || 0), 0) })),
        public_categories: lib.publicCategories.length,
        rooms: Object.keys(ROOM_NEEDS),
      },
    };
  }
  const kws = q ? q.split(/[,;]+/).map((s) => s.trim()).filter(Boolean) : [""];
  return {
    ...base,
    query: q,
    space: space || null,
    from_your_library: rank(lib, all.filter((it) => !q || matches(it, kws)), space).slice(0, limit),
    catalogue_folders: q ? catalogueHits(lib, kws, limit) : [],
    public_categories: q ? publicHits(lib, kws, limit) : [],
  };
}
