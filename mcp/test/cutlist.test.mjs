import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cabinetPanels, cutList, packSheets, thicknessOf } from "../src/cutlist.mjs";

const box = { id: "T1", width: 600, height: 720, depth: 560, top: "full", back: "overlay", shelves: 1, shutters: 1 };

test("thickness is parsed from material names", () => {
  assert.equal(thicknessOf("18mm BWP ply"), 18);
  assert.equal(thicknessOf("0.8mm band"), 0.8);
  assert.equal(thicknessOf("Teak board", { "Teak board": { thickness: 25 } }), 25);
  assert.throws(() => thicknessOf("mystery board"));
});

test("a simple box gives the expected panels and sizes", () => {
  const { panels } = cabinetPanels(box);
  const get = (part) => panels.find((p) => p.part === part);
  assert.deepEqual([get("Side").length, get("Side").width, get("Side").qty], [720, 554, 2]); // depth minus 6 back
  assert.deepEqual([get("Bottom").length, get("Bottom").width], [564, 554]); // 600 - 2x18
  assert.equal(get("Top").length, 564);
  assert.deepEqual([get("Back").length, get("Back").width], [720, 600]);
  assert.deepEqual([get("Shelf").length, get("Shelf").width], [564, 534]); // 20 setback
  assert.deepEqual([get("Shutter").length, get("Shutter").width], [717, 597]);
  assert.equal(get("Shutter").edges.W1, "2mm");
});

test("partitions split shelf widths", () => {
  const { panels } = cabinetPanels({ ...box, width: 1200, partitions: 1, shelves: 2 });
  const shelf = panels.find((p) => p.part === "Shelf");
  assert.equal(shelf.length, (1200 - 36 - 18) / 2);
  assert.equal(panels.find((p) => p.part === "Partition").length, 720 - 36);
});

test("telescopic drawers create box panels; tandem only fronts plus a warning", () => {
  const tel = cabinetPanels({ ...box, shutters: 0, drawers: { count: 3, front_heights: [150, 250, 300] } });
  assert.equal(tel.panels.filter((p) => p.part === "Drawer front").reduce((a, p) => a + p.qty, 0), 3);
  assert.equal(tel.panels.find((p) => p.part === "Drawer bottom").qty, 3);
  assert.equal(tel.panels.find((p) => p.part === "Drawer bottom").length, 500); // largest slide <= 554-10
  const tan = cabinetPanels({ ...box, shutters: 0, drawers: { count: 2, slide: "tandem" } });
  assert.ok(!tan.panels.some((p) => p.part === "Drawer side"));
  assert.equal(tan.warnings.length, 1);
});

test("edge band deduction gives cutting sizes", () => {
  const r = cutList({ cabinets: [box] });
  const sh = r.panels.find((p) => p.part === "Shutter");
  assert.equal(sh.cut_length, 713);
  assert.equal(sh.cut_width, 593);
  const r2 = cutList({ cabinets: [box], deduct_edge_band: false });
  assert.equal(r2.panels.find((p) => p.part === "Shutter").cut_length, 717);
});

test("labels are unique", () => {
  const r = cutList({ cabinets: [box, { ...box, id: "T2" }] });
  const labels = r.panels.map((p) => p.label);
  assert.equal(new Set(labels).size, labels.length);
});

test("packer: 8 panels of 1200x600 need 2 sheets, never overlap, and respect grain", () => {
  const pieces = [{ label: "P", cut_length: 1200, cut_width: 600, qty: 8, grain: "length" }];
  const { sheets } = packSheets(pieces, { length: 2440, width: 1220, trim: 0, kerf: 4 });
  // 2 along the length x 1 across (600 + 4 + 600 > 1220? no: 1204 <= 1220 -> 2 across)
  assert.equal(sheets.length, 2);
  for (const s of sheets) {
    const ps = s.placements;
    for (let i = 0; i < ps.length; i++) {
      const a = ps[i];
      assert.ok(a.x + a.along <= 2440 && a.y + a.across <= 1220, "inside sheet");
      assert.equal(a.rotated, false);
      for (let j = i + 1; j < ps.length; j++) {
        const b = ps[j];
        const overlap = a.x < b.x + b.along && b.x < a.x + a.along && a.y < b.y + b.across && b.y < a.y + a.across;
        assert.ok(!overlap, `overlap ${i}/${j}`);
      }
    }
  }
});

test("packer: grain-locked pieces longer than the sheet are reported as oversize", () => {
  const { oversize } = packSheets([{ label: "X", cut_length: 2600, cut_width: 300, qty: 1, grain: "length" }]);
  assert.equal(oversize.length, 1);
  const free = packSheets([{ label: "Y", cut_length: 1000, cut_width: 2400, qty: 1, grain: "none" }]);
  assert.equal(free.oversize.length, 0);
  assert.equal(free.sheets[0].placements[0].rotated, true);
});

test("sheet count is never below the area lower bound", () => {
  const spec = JSON.parse(readFileSync(new URL("../../skills/coohom-indian-interiors/examples/kitchen-2bhk.json", import.meta.url)));
  const r = cutList(spec);
  for (const m of r.materials) {
    const lb = Math.ceil(m.panel_area_m2 / (2.44 * 1.22));
    assert.ok(m.sheets >= lb, `${m.material}: ${m.sheets} < ${lb}`);
  }
  assert.ok(r.total_sheets > 0);
  assert.match(r.csv.panels.split("\n")[0], /^label,cabinet/);
  assert.ok(r.edge_band_m["2mm"] > 0);
});

test("bad specs fail with clear messages", () => {
  assert.throws(() => cutList({}), /cabinets/);
  assert.throws(() => cutList({ cabinets: [{ id: "A", width: 0, height: 700, depth: 500 }] }), /width/);
  assert.throws(() => cutList({ cabinets: [box, box] }), /Duplicate/);
});
