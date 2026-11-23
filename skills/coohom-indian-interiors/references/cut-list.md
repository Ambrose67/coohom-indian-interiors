# Plywood cut lists and sheet optimisation

Goal: from a finished design, produce a panel list the workshop can cut, a sheet count per material, and edge band lengths — without counting by hand.

## 1. From design to panels

For every unit (kitchen base, wall, tall, wardrobe bay, loft, TV unit…) write down: outer width × height × carcass depth (without shutter), top type, back type, partitions, shelves, shutters, drawers and materials. Then each carcass breaks into:

| Panel | Size (T = carcass thickness) | Grain | Edge band |
|---|---|---|---|
| Sides × 2 | H × side depth | vertical (along H) | front edge |
| Bottom | (W − 2T) × side depth | along W | front edge |
| Top (full) | (W − 2T) × side depth | along W | front edge |
| Top rails × 2 (base units under a counter) | (W − 2T) × 100 (rule of thumb) | along W | front edge |
| Back, overlay (nailed on) | H × W; side depth = depth − back thickness | any | none |
| Back, inset in a groove | (H − 2T + 2g) × (W − 2T + 2g), g ≈ 8 (rule of thumb) | any | none |
| Partitions | (H − 2T) × side depth | vertical | front edge |
| Shelves | bay width × (side depth − 20 setback) | along W | front edge |
| Shutters (full overlay) | (H − 3) × (W / n − 3) — 3 mm gaps (rule of thumb) | vertical | all four |
| Drawer fronts | (W − 3) × front height | along W | all four |
| Drawer box (telescopic, ply) | sides = slide length × (front − 50); front/back = (W − 2T − 26 − 2t) × same; bottom = slide length × (W − 2T − 26) | — | top edges |

Slide clearance (13 per side for telescopic channels) and box sizes for tandem/metal-side systems come from the hardware maker's cutting formula — (check catalogue).

## 2. Sheets
- Standard sheet 8' × 4' = **2440 × 1220**. Laminated and veneered sheets have a grain/pattern along the 2440 side.
- Trim about 10 mm off every edge before cutting (factory edges are often damaged) — rule of thumb; set to your saw.
- Kerf (blade width) is typically 3–4 mm; set it to your blade.
- Keep one sheet type per material + thickness + finish combination. Interior liner and exterior laminate may differ: list shutters separately from carcass.

## 3. Grain direction
- Sides, partitions, shutters and tall panels: grain vertical (along height).
- Shelves, tops, bottoms and drawer fronts: grain horizontal (along width), so a run of drawer fronts reads continuously.
- For plain backs and hidden panels grain does not matter, so they may be rotated to save sheets.
- A grain-locked panel longer than 2420 (2440 minus trim) cannot be cut from one sheet: join it at a partition, use a longer sheet if available, or rotate only if the finish has no direction.

## 4. Edge banding
- 0.8 mm on internal/visible-inside edges (carcass fronts, shelves); 2 mm on shutters and drawer fronts (all four edges), matched to the laminate.
- Cutting size = finish size − band thickness on each banded edge (when the edge bander does not pre-mill). The tool does this by default; turn it off with `"deduct_edge_band": false`.
- Order edge band by the metre per type and colour; add your machine's trimming allowance.

## 5. Labels
Give every panel a unique label `CABINET-PART-n` (e.g. `K04-SHUTTER-2`). Write it on the panel (back face) as soon as it is cut, and on the drawing. Labels let the factory, the site carpenter and the cut list talk about the same piece.

## 6. Optimisation tips
- Design modules around the sheet: 600-deep wardrobes give two 560–580 sides across a 1220 sheet; 300/350 wall-unit depths give three across.
- Group panels of the same width into strips; cut long rips first, then crosscut.
- Use offcuts for drawer boxes, fillers and shelves.
- Add 5–10% spare material for site-made work and repairs (rule of thumb).
- The included packer is a three-stage guillotine heuristic (strips → columns → stacked pieces) with trim and kerf. It is conservative; optimiser software or a beam-saw's own program may save a sheet.

## 7. JSON spec for `cut_list` / `scripts/cutlist.mjs`

```json
{
  "project": "Sample wardrobe",
  "sheet": { "length": 2440, "width": 1220, "trim": 10, "kerf": 4 },
  "defaults": { "carcass": "18mm MR ply", "back": "6mm MR ply", "shutter": "18mm MR ply",
                "drawer_box": "12mm MR ply", "drawer_bottom": "6mm MR ply" },
  "edges": { "internal": "0.8mm", "shutter": "2mm" },
  "deduct_edge_band": true,
  "cabinets": [
    { "id": "W01", "name": "Bay 1 long hanging", "width": 900, "height": 2100, "depth": 582,
      "top": "full", "back": "overlay", "shelves": 2, "shutters": 2 },
    { "id": "W02", "name": "Bay 2 drawers", "width": 900, "height": 2100, "depth": 582,
      "shelves": 1, "shutters": { "count": 2, "height": 1400 },
      "drawers": { "count": 3, "front_heights": [200, 200, 200], "slide": "telescopic" } }
  ],
  "extra_panels": [
    { "cabinet": "L1", "part": "Loft fascia", "material": "18mm BWP ply", "length": 1800, "width": 100,
      "qty": 1, "grain": "length", "edges": { "L1": "2mm" } }
  ]
}
```

Field notes:
- Material names start with the thickness (`18mm …`), or add `"materials": {"Name": {"thickness": 18}}`.
- `top`: `full` | `rails` | `none`. `back`: `overlay` | `inset` | `none` (e.g. sink base, cylinder unit).
- `shutters`: a number, or `{count, rows, height}` (rows split tall shutters; height leaves room for drawers).
- `drawers`: a number, or `{count, front_heights, slide: "telescopic" | "tandem", slide_length}`.
- `qty` on a cabinet repeats it. `allow_wide_shutters: true` silences the > 600 shutter warning.
- `kitchen_layout` and `wardrobe_layout` return a ready `cut_list_spec`; edit materials and internals, then run it.

CLI:

```bash
node skills/coohom-indian-interiors/scripts/cutlist.mjs examples/kitchen-2bhk.json out/kitchen
```

writes `out/kitchen-panels.csv` (label, part, material, finish and cut sizes, qty, grain, edge bands) and `out/kitchen-sheets.csv` (placement of each panel on each sheet).
