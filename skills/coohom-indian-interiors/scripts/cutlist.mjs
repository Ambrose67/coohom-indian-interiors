#!/usr/bin/env node
// Usage: node cutlist.mjs <spec.json> [output-prefix]
// Writes <prefix>-panels.csv and <prefix>-sheets.csv and prints a summary.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const { cutList } = await import(join(here, "..", "..", "..", "mcp", "src", "cutlist.mjs"));

const [specPath, prefixArg] = process.argv.slice(2);
if (!specPath) {
  console.error("Usage: node cutlist.mjs <spec.json> [output-prefix]");
  process.exit(1);
}
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const r = cutList(spec);
const prefix = prefixArg || resolve(basename(specPath).replace(/\.json$/i, ""));
writeFileSync(`${prefix}-panels.csv`, r.csv.panels);
writeFileSync(`${prefix}-sheets.csv`, r.csv.sheets);
console.log(`Project: ${r.project || "(unnamed)"}`);
for (const m of r.materials) {
  console.log(`  ${m.material}: ${m.panel_count} panels, ${m.panel_area_m2} m2, ${m.sheets} sheet(s) of ${r.sheet.length}x${r.sheet.width}, avg use ${m.average_utilisation_pct}%`);
}
console.log(`  Total sheets: ${r.total_sheets}`);
console.log(`  Edge band (m): ${Object.entries(r.edge_band_m).map(([k, v]) => `${k} ${v}`).join(", ")}`);
for (const w of r.warnings) console.log(`  WARNING: ${w}`);
console.log(`Wrote ${prefix}-panels.csv and ${prefix}-sheets.csv`);
