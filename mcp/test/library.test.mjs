import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { loadLibrary, libraryLookup, fits } from "../src/library.mjs";

const dir = fileURLToPath(new URL("./fixtures/library", import.meta.url));
const lib = loadLibrary(dir);

test("loads all files from the library folder", () => {
  assert.equal(lib.own.favourites.length, 6);
  assert.equal(lib.catalogues.length, 1);
  assert.deepEqual(lib.missing, []);
});

test("fit check allows a quarter turn and reports unknown sizes", () => {
  assert.equal(fits({ w: 2000, d: 600, h: 2100 }, { width: 700, depth: 2100 }), "fits");
  assert.equal(fits({ w: 2000, d: 600, h: 2400 }, { width: 2100, depth: 700, height: 2300 }), "too big");
  assert.equal(fits({ name: "x" }, { width: 1000 }), "unknown");
});

test("query finds favourites first, then catalogue folders and public categories", () => {
  const r = libraryLookup({ query: "sofa" }, lib);
  assert.equal(r.from_your_library[0].source, "favourite");
  assert.ok(r.from_your_library.some((x) => x.source === "personal library"));
  assert.equal(r.public_categories[0].category, "Three-seater Sofas");
});

test("space filter drops items that do not fit", () => {
  const r = libraryLookup({ query: "wardrobe", space: { width: 2000, depth: 650, height: 2400 } }, lib);
  assert.deepEqual(r.from_your_library.map((x) => x.id), ["F5"]);
});

test("preferences: preferred items rank first, avoided items are hidden", () => {
  const r = libraryLookup({ query: "partition, wardrobe" }, lib);
  assert.equal(r.from_your_library[0].id, "F2");
  assert.equal(r.from_your_library[0].preferred, true);
  assert.ok(!r.from_your_library.some((x) => x.id === "F4"));
});

test("room mode lists every need with matches", () => {
  const r = libraryLookup({ room: "pooja" }, lib);
  const unit = r.needs.find((n) => n.need.startsWith("pooja"));
  assert.ok(unit.from_your_library.some((x) => x.id === "F6" || x.id === "P2"));
  const k = libraryLookup({ query: "sink" }, lib);
  assert.equal(k.catalogue_folders[0].folder, "Base > Sink Base");
  assert.throws(() => libraryLookup({ room: "garage" }, lib));
});

test("empty library folder gives a helpful summary, not a crash", () => {
  const empty = loadLibrary("/nonexistent/coohom-library");
  const r = libraryLookup({}, empty);
  assert.equal(r.summary.favourites, 0);
  assert.ok(r.missing_files.length >= 2);
});

test("keywords match at word starts only", () => {
  const custom = { ...lib, own: { favourites: [{ id: "W", name: "Ribbed panel", cat: "Wainscot", w: 600, d: 30, h: 2000 }, { id: "C", name: "Teak cot", cat: "Bed frame", w: 1900, d: 2100, h: 1000 }] } };
  const r = libraryLookup({ query: "cot" }, custom);
  assert.deepEqual(r.from_your_library.map((x) => x.id), ["C"]);
});
