import { test } from "node:test";
import assert from "node:assert/strict";
import { kitchenLayout, counterHeight, fillModules, homeTypeFromFamily } from "../src/kitchen.mjs";
import { cutList } from "../src/cutlist.mjs";

test("counter height follows the cook and stays within 820-900", () => {
  assert.equal(counterHeight(1525), 840);
  assert.equal(counterHeight(1400), 820);
  assert.equal(counterHeight(1800), 900);
  const h = counterHeight(1600);
  assert.ok(h > 840 && h < 900);
});

test("module fill uses standard widths and leaves < 300", () => {
  for (const g of [300, 1050, 1234, 2250, 3000]) {
    const { units, leftover } = fillModules(g);
    assert.ok(units.every((u) => [300, 450, 600].includes(u)));
    assert.equal(units.reduce((a, b) => a + b, 0) + leftover, g);
    assert.ok(leftover < 300);
  }
});

test("family size maps to home type", () => {
  assert.equal(homeTypeFromFamily(2), "1bhk");
  assert.equal(homeTypeFromFamily(4), "2bhk");
  assert.equal(homeTypeFromFamily(6), "3bhk");
  assert.equal(homeTypeFromFamily(9), "villa");
});

test("layout selection by width", () => {
  assert.equal(kitchenLayout({ length: 3000, width: 1500 }).summary.layout, "straight");
  assert.equal(kitchenLayout({ length: 3000, width: 2250 }).summary.layout, "parallel");
  assert.equal(kitchenLayout({ length: 3300, width: 2700 }).summary.layout, "U");
  assert.equal(kitchenLayout({ length: 3300, width: 2700, free_walls: ["A", "B"] }).summary.layout, "L");
});

test("island only with >= 1000 clear all round", () => {
  const small = kitchenLayout({ length: 3600, width: 3000, want_island: true });
  assert.equal(small.summary.island, "none");
  assert.ok(small.notes.some((n) => /Island omitted/.test(n)));
  const big = kitchenLayout({ length: 5000, width: 4000, want_island: true, home_type: "villa" });
  assert.notEqual(big.summary.island, "none");
  const isl = big.summary.island;
  assert.ok(isl.y - 600 >= 1000, "clear to wall A counter");
  assert.ok(4000 - (isl.y + isl.depth) >= 1000, "clear to far wall");
  assert.ok(isl.x - 600 >= 1000 && 5000 - (isl.x + isl.length) >= 1000, "clear at both ends");
});

test("units never overlap and fit their runs; hob is not beside the fridge or sink", () => {
  for (const [length, width, home_type] of [[3600, 1800, "1bhk"], [3000, 2250, "2bhk"], [3300, 2700, "2bhk"], [4200, 3000, "3bhk"]]) {
    const r = kitchenLayout({ length, width, home_type, window_wall: "A", window_center: 1500 });
    for (const wall of ["A", "B", "C"]) {
      const us = r.base_units.filter((u) => u.wall === wall).sort((a, b) => a.start - b.start);
      for (let i = 1; i < us.length; i++) assert.ok(us[i].start >= us[i - 1].start + us[i - 1].width, `${wall} overlap`);
      const lim = wall === "B" ? width : length;
      if (us.length) assert.ok(us.at(-1).start + us.at(-1).width <= lim, `${wall} overflow`);
      const hobIdx = us.findIndex((u) => u.type.startsWith("hob"));
      if (hobIdx >= 0) {
        for (const n of [us[hobIdx - 1], us[hobIdx + 1]]) {
          if (n) assert.ok(!n.type.startsWith("sink") && n.type !== "fridge space", `hob neighbour ${n.type}`);
        }
      }
    }
    assert.equal(r.base_units.filter((u) => u.type.startsWith("sink")).length, 1);
    assert.equal(r.base_units.filter((u) => u.type.startsWith("hob")).length, 1);
  }
});

test("2BHK U kitchen passes the work triangle and gives a valid cut list spec", () => {
  const r = kitchenLayout({ length: 3300, width: 2700, home_type: "2bhk", window_wall: "A", window_center: 1500 });
  assert.ok(r.triangle.within_4000_7900);
  assert.ok(r.summary.drawer_units >= 3);
  const cl = cutList(r.cut_list_spec);
  assert.ok(cl.total_sheets > 0);
});

test("input validation", () => {
  assert.throws(() => kitchenLayout({ length: 0, width: 2000 }));
  assert.throws(() => kitchenLayout({ length: 3000, width: 2000, home_type: "castle" }));
});
