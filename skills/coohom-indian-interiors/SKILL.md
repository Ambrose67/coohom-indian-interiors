---
name: coohom-indian-interiors
description: Use when designing Indian homes or interiors in Coohom, or operating any Coohom tool (walls, columns, wall/ceiling editors, lighting, materials, AI templates, Kitchen & Bath, closets, drawings, rendering) — modular kitchens, wardrobes, lofts (including RCC/concrete lofts), TV, pooja, crockery and shoe units, doors, false ceilings, materials — or when making a plywood cut list / sheet count from a cabinet design. Covers Indian (Tamil Nadu and Kerala) practice, 9/10/11 ft ceilings, and step-by-step Coohom workflows for the Kitchen & Bath, Kitchen & Closet, staircase, drawing and render tools.
---

# Indian interiors in Coohom

This skill turns an Indian residential brief into a correct Coohom model and a buildable cut list. It is written for architect-led design-and-make firms in Tamil Nadu and Kerala but works for most of India.

Three layers, use them in this order:
1. **Decide** the design with the rules in `references/` (sizes, layouts, unit counts).
2. **Model** it in Coohom using `references/coohom-workflows.md`.
3. **Make** it: derive panels and sheet counts with `references/cut-list.md` and `scripts/cutlist.mjs` (or the `cut_list` MCP tool).

If the `indian-interiors` MCP server is connected, call its tools instead of doing arithmetic by hand:
`kitchen_layout`, `wardrobe_layout`, `cut_list`, `standards_lookup`.

## How to read the numbers

- Values are typical working values for Indian homes, in **mm** unless stated. Clients speak feet-inches; 1 ft = 304.8 mm, 1 in = 25.4 mm. Give both in client-facing text.
- Values marked **(rule of thumb)** are practice conventions, not codes or manufacturer data. Values marked **(check catalogue)** depend on the hardware brand and model — confirm with the supplier before ordering.
- Site measurements after plastering (and after tiling for kitchens) always override drawings. Never finalise a kitchen or wardrobe from the architectural plan alone.
- The main user's body overrides averages: ask the main cook's height; ask who uses the wardrobe.
- Do not invent numbers that are not here or in the user's brief. If a value is missing, say so and ask, or label your estimate.

## Reference files (read the one you need)

| File | Use it for |
|---|---|
| `references/kitchen.md` | Layout choice by room size, island rule, work triangle, heights/depths, hob/sink/fridge/chimney placement, unit lists and counts per 1BHK/2BHK/3BHK/villa, pull-outs, tall units, corners, utility |
| `references/wardrobes-and-lofts.md` | Wardrobe depths/heights/shutters, internal layouts (saree, shirts, shelves, drawers, locker), lofts for 9/10/11 ft ceilings, cladding RCC lofts, sliding vs hinged |
| `references/rooms-and-units.md` | Living/TV, crockery, shoe rack, pooja, bedroom, dressing/study, bathroom vanity, doors, false ceilings, lighting |
| `references/materials-and-hardware.md` | Ply grades (MR/BWR/BWP), HDHMR, MDF, WPC, laminates, acrylic, PU, veneer, edge band, hardware types and brands, colour palettes |
| `references/cut-list.md` | Panels from a cabinet, 8'×4' sheet optimisation, grain, edge banding, kerf, labels, the JSON spec format for the script |
| `references/coohom-workflows.md` | Scratch-to-finish Coohom steps: project setup, wall tool, wall edits/heights, beams, columns, doors/windows, stairs, AI templates and AI floor-plan fix, placing models and kitchen assets, materials/colour/texture/tiles, wall editor (panels, mouldings), ceiling editor (coves), lighting (strips, spots/IES, colour temperature), Kitchen & Bath, wardrobes/closet, Freeform/custom modelling, 2D and construction drawings, exports, rendering |
| `references/coohom-plans.md` | Which Coohom plan (Basic/Pro/Elite/Enterprise) unlocks which feature, credits |
| `references/sources.md` | Where each kind of number comes from, and what is unconfirmed |

## Default workflow for a full-home interior

1. **Brief**: family size and ages, main cook's height, cooking style (heavy Indian frying/grinding → chimney + utility), BHK type, ceiling height (9/10/11 ft), existing RCC lofts, Vastu preference, budget band, style, TN or Kerala (humidity → material grade).
2. **Measure**: room sizes, window/door positions and sill heights, beam drops, existing loft depths and heights, plumbing and electrical points.
3. **Decide per room** with the reference files. For the kitchen and each wardrobe, run `kitchen_layout` / `wardrobe_layout` (or follow the same rules by hand) and restate the plan to the user as a short list before modelling.
4. **Model in Coohom**: walls and openings → named rooms → Kitchen & Bath for the kitchen → Kitchen & Closet / custom cabinet for wardrobes, TV, crockery, shoe, pooja → ceilings and lighting → materials → renders.
5. **Drawings**: elevations of every unit with mm dimensions, shutter types, handles, hardware and finish codes.
6. **Cut list**: write a cabinet JSON spec for each unit, run `cut_list`, check sheet counts and edge band lengths, add 5–10% wastage for site-made work (rule of thumb).
7. **Report**: what was modelled, key sizes, materials and hardware, sheet counts, open decisions for the client.

## Hard rules (apply every time)

- Kitchen island only if there is **≥1000 mm clear on every side** that people use; otherwise drop it and use a peninsula or breakfast counter.
- Hob never directly under a window, and not directly beside the fridge or the sink; leave counter landing space on both sides.
- Plywood next to water (sink base, bathroom vanity, utility) is **BWP**, not MR.
- Wardrobe clear depth for hanging is at least 550 mm inside the shutter (600 mm overall is the norm).
- A loft above a wardrobe is for rarely used items. Any shelf in daily use stays at or below about 1800 mm.
- Every hinged shutter must swing clear of beds, doors and other shutters in plan; use sliding shutters where it does not.
- Gas cylinder: in a ventilated base unit or outside with piped supply — never in a sealed cabinet next to the hob, and follow the gas supplier's rules.
- Never delete, overwrite or share a Coohom project, or spend render credits on large jobs, without the user's go-ahead.

## Related skills

If installed, these complement this one: `coohom-designer` (driving the Coohom UI through a browser), `coohom-freeform` (scripted Freeform modelling over MCP), `interior-design-standards`, `human-anthropometry`, `architectural-planning`, `architect-design-and-color`, `tn-kerala-interior-practice`, `tn-kerala-construction-standards`, `tamil-nadu-home-design`.
