import { test } from "node:test";
import assert from "node:assert/strict";
import { wardrobeLayout, planHeights } from "../src/wardrobe.mjs";
import { cutList } from "../src/cutlist.mjs";

test("loft plans for 9, 10 and 11 ft ceilings", () => {
  const nine = wardrobeLayout({ wall_width: 1800, ceiling_ft: 9 });
  assert.equal(nine.summary.wardrobe_height, 2100);
  assert.equal(nine.lofts.length, 1);
  assert.ok(nine.lofts[0].height >= 450 && nine.lofts[0].height <= 900);

  const ten = wardrobeLayout({ wall_width: 1800, ceiling_ft: 10 });
  assert.equal(ten.summary.wardrobe_height, 2400);
  assert.equal(ten.lofts.length, 1);
  assert.ok(ten.lofts[0].height >= 450 && ten.lofts[0].height <= 900);

  const eleven = wardrobeLayout({ wall_width: 1800, ceiling_ft: 11 });
  assert.equal(eleven.summary.wardrobe_height, 2400);
  assert.equal(eleven.lofts.length, 2);
  for (const l of eleven.lofts) assert.ok(l.height >= 450 && l.height <= 900);
});

test("heights add up to the clear height minus the scribe gap", () => {
  for (const clear of [2743, 3048, 3353]) {
    const h = planHeights(clear, "ply");
    assert.equal(h.main + h.lofts.reduce((a, l) => a + l.height, 0), clear - 10);
  }
});

test("low ceilings get a full-height wardrobe instead of a useless loft", () => {
  const h = planHeights(2500, "ply");
  assert.equal(h.lofts.length, 0);
  assert.equal(h.main, 2490);
});

test("RCC loft: wardrobe stops under it and the loft is clad with BWP frame + shutters", () => {
  const r = wardrobeLayout({ wall_width: 2100, ceiling_ft: 10, loft: "rcc", rcc_loft_bottom: 2100, rcc_loft_depth: 450 });
  assert.equal(r.summary.wardrobe_height, 2090);
  assert.ok(r.lofts[0].type.includes("RCC"));
  assert.ok(r.notes.some((n) => /fascia|forward/.test(n)));
  const parts = r.cut_list_spec.extra_panels.map((p) => p.part);
  assert.ok(parts.includes("Loft shutter") && parts.includes("Loft frame stile"));
  assert.ok(r.cut_list_spec.extra_panels.filter((p) => p.part.startsWith("Loft frame")).every((p) => p.material.includes("BWP")));
});

test("hinged shutters are 450-600 wide; bays include long hanging when saris", () => {
  for (const w of [900, 1500, 1800, 2400, 3000]) {
    const r = wardrobeLayout({ wall_width: w, ceiling_ft: 10 });
    assert.ok(r.summary.shutter_width >= 450 && r.summary.shutter_width <= 600, `${w}: ${r.summary.shutter_width}`);
  }
  const r = wardrobeLayout({ wall_width: 2400, ceiling_ft: 10 });
  assert.equal(r.bays[0].zone, "long hanging");
  const noSari = wardrobeLayout({ wall_width: 2400, ceiling_ft: 10, saris: false });
  assert.notEqual(noSari.bays[0].zone, "long hanging");
});

test("tight front clearance switches to sliding", () => {
  const r = wardrobeLayout({ wall_width: 2400, ceiling_ft: 10, front_clearance: 700 });
  assert.equal(r.summary.shutter_type, "sliding");
  assert.equal(r.summary.depth, 650);
});

test("wardrobe spec runs through the cut list", () => {
  const r = wardrobeLayout({ wall_width: 2400, ceiling_ft: 11 });
  const cl = cutList(r.cut_list_spec);
  assert.ok(cl.total_sheets >= 4);
  assert.deepEqual(cl.warnings.filter((w) => /does not fit/.test(w)), []);
});

test("validation", () => {
  assert.throws(() => wardrobeLayout({ wall_width: 300, ceiling_ft: 10 }));
  assert.throws(() => wardrobeLayout({ wall_width: 1800 }));
  assert.throws(() => wardrobeLayout({ wall_width: 1800, ceiling_ft: 10, loft: "steel" }));
});
