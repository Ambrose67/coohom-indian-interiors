# Coohom workflows (step by step)

Coohom is a browser-based (also Windows/Mac app) 3D interior tool. Menu names below are from the Coohom Help Center and beginner lessons as read in November 2026; Coohom updates its UI often, so if a label differs, take a screenshot and adapt. Features marked **(plan-dependent)** may need a paid or enterprise plan — if a tool is locked, tell the user rather than working around it.

The canvas is WebGL: walls and models are not in the page's accessibility tree. Read menus and input fields from the DOM, judge the design from screenshots, and type exact numbers into fields instead of dragging.

## 0. Setup
1. Workbench → **New Project**. Three starts: upload a floor plan (CAD or image), pick a template, or start blank.
2. Avatar (top-right) → **Preferences**: language, **unit** (set mm for interiors), appearance; Floor Plan → **Wall Intersect Split = Auto** is handy. Keyboard shortcuts and mouse controls are listed there.
3. Countertop thickness and other cabinet fields can refuse to change while the unit is metres — switch to millimetres first (Help Center tip).

## 1. Floor plan, walls, rooms
1. Upload the CAD/PDF/image plan if you have one (traces faster), or draw: **Draw Room / Rectangle Wall** for closed rooms, **Wall** for single walls (click start, type length, Enter; right-click to exit).
2. Edit walls: **Edit → Merge/Split/Align**, or select a wall and use **Split/Merge** in the floating toolbar. **One-click Slice** (Shift for all walls) splits at intersections; **Split** at a typed distance; double-click joins aligned walls of equal thickness; **Align** snaps one line to another.
3. Wall thickness: 230 external / 115 internal brick (or finished 260 / 145) — say which convention you used. Individual wall height can be adjusted.
4. Name every room (Kitchen, Bed 1, Pooja…). Check each room's area against the brief.
5. Multiple floors: create floors and add **Floor Opening** for stair voids and double heights.

## 2. Doors and windows
1. Place doors/windows from the structure tools; set width, height and sill height numerically (Indian defaults: main 1000–1200 × 2100, bedroom 900, toilet 750; window sill 750–900).
2. Custom shapes: rectangular, arched and custom openings; curved windows and corner bay windows have their own tools.
3. Change a style: select the door/window → **Style** in the Parameters panel (door leaf, mouldings, panels, handles). To swap the whole model, enter the **Doors & Windows** customisation, switch to **3D**, and drag the new model onto the old one (in 2D it reports an overlap).

## 3. Model library and materials
1. Model library (left panel): search, favourite, drag into the plan; set W/D/H, position and rotation in the right panel. Group/ungroup with shortcuts. Upload your own SketchUp/3ds Max models to a personal library.
2. Floors and walls: select a surface and replace its material; set tile pattern and direction; thresholds.
3. **AI templates** can furnish a whole house in one style — use only as a starting point and then correct sizes to Indian standards.

## 4. Ceilings and lighting
1. Select a ceiling surface → **Ceiling Editor** in the floating window. Draw a shape (line/curve/rectangle/circle), set **Extrusion** for the drop (225–300 typical), then select the shape edge and pick a cove profile such as **Indented Lamp Belt** or **External Expansion Belt**; **Exit with Save**.
2. Light strips can also be added from **Advanced Tool → Material and Component → Light Strips** (with or without a light trough: brightness, colour, size).
3. Ceiling templates exist for tray, stepped, curved and luminous ceilings; you can save your own templates.
4. For a 9 ft ceiling keep a peripheral ceiling/cove only (see `rooms-and-units.md`).
5. A UGR/illumination calculation report is available from the lighting tools (plan-dependent).

## 5. Kitchen & Bath tool (modular kitchen)
Entry: **Advanced Tool** (left sidebar) → **Kitchen & Bath**. (Some articles call the cabinet tool "Kitchen & Closet".)

Option A — AI auto-layout:
1. Choose **AI Kitchen Auto-Layout** at the top. Draw the cabinet runs inside the pop-up room; right-click to stop drawing.
2. Place appliances from the left toolbar (type positions to be exact).
3. **Generate** → confirm "replace current design" → switch to **3D**. Then correct every unit to the plan from `kitchen_layout`.

Option B — manual (more control, recommended for Indian sizes):
1. Drag base, wall and tall cabinets from the public library; set width/height/depth numerically to the `kitchen_layout` unit list (base carcass 720, depth 560–580; wall units 600–720 high, 300–350 deep, bottom at counter + 600–750; tall 2100–2150).
2. Drawers: **Parts** (top of left sidebar) → **Drawer** → drag in → **Fill with Drawers**; set **Number** and **Fill Mode** (Equal / By Ratio / By Numeric Value).
3. Replace an appliance in a cabinet by double-clicking a similar-size one in the list.
4. **Generate → Countertop** (top toolbar or a cabinet's floating toolbar): select cabinets (Shift or **Auto-select**), set front edge, backsplash and material (granite/quartz), **Generate**; **manual edit** for custom outlines and edge oversize; **Finish**.
5. **Generate → Sink**: pick sink and tap style, installation type and spacing; **Add Sink** for a second bowl; **Generate**. (Generate stays grey until a cabinet is selected.)
6. **Generate → Stove** (hob) and chimney hood style; installation type, alignment, spacing; **Generate**. Check the hood is 650–750 above the hob.
7. **Generate → Toekick molding** (skirting) with style/material; crown molding, knobs/handles, furniture legs and sliding doors also have one-click generators.
8. Materials: select a cabinet → **Style** in the Parameters panel (carcass, door and handle style); **Global Edit → Global Style** to change all custom cabinets at once; **Material Brush** to copy a finish.
9. **Smart Decors** puts template decor into cabinets for renders.

## 6. Wardrobes, lofts, TV/crockery/shoe units (Kitchen & Closet → Closet)
1. Enter **Kitchen & Closet design** → choose **Closet** (or start from a design template and **Apply**).
2. From the **Public** library filter unit cabinets, wardrobes, tatami, wall panels; drag a cabinet out and set its size from `wardrobe_layout` (bay widths, main height 2100/2400, depth).
3. Internals: drag panels (shelves, partitions), rods, drawers into the cabinet; doors: drag a door onto the cabinet and adjust its four handles (auto-snaps to edges). Sliding doors: **Generate → Sliding Doors**, choose the cabinet with top lines, set area/count and style.
4. Lofts: add a second cabinet row above at the loft height(s) from `wardrobe_layout`, with shutters aligned to the wardrobe below.
5. **RCC lofts**: model the concrete slab as part of the building (a structural element/box from the structure or construction tools — confirm the exact tool in your version, or use Custom modeling/Freeform), then place a shutter-only front (frame + shutters) in Closet.
6. Style and materials as for kitchens (**Style**, **Global Style**). Note: the wall/floor/ceiling material editors are not available inside the Kitchen & Closet tool — do those in the main interior design tool.

## 7. Staircases
1. In the floor plan tool hover **Staircase** in the left sidebar and pick a model (straight, L, U, spiral…); drag it into place.
2. Select it → set **Length, Width, Height** in the right panel (greyed fields are fixed by the model).
3. **Customize** (floating window) → reselect → set **Number of Staircase Steps**, **Railing Height** and **Tread Depth**.
4. Check: riser 150–190, tread 250–300, 2R + T ≈ 600–640, width 900–1200, headroom ≥ 2200, handrail ≈ 900. Place the floor opening above.
5. Under-stair storage: use a custom cabinet (Closet) shaped to the stair.

## 8. Drawings (plans, elevations) and exports
- **Floor plan drawings**: **Drawings → Floor Plan** (enterprise: **Drawings & Schedules → Floor Plan Drawings**). Pick a template, toggle wall/furniture shadows, annotate (Auto-Annotation, Dimension, Attribute, Text, Leader, Symbol), set scale, then **Download** as image or PDF (plan-dependent).
- **Cabinet drawings (Kitchen & Closet)**: **Drawing → Edit views** — auto-annotate or add dimension/text annotations; place elevation marks with **generate views → elevation** (Auto-Place or manual), then generate the elevation views. **Drawing → Drawings Layout** arranges views on sheets (drag from the view manager, set sheet scale) → **Download** and choose the format.
- A small **Drawing** tab in the top-right view window shows drawings live while designing (**Auto-Annotate**, **Editing Drawing Views**, **Back to Design**).
- Sections: not documented in the Help Center pages read; if needed, check your version or draw them from the elevations.
- **File → Export JSON/XML** (Kitchen & Closet): set the quote logic and the range (room, floor, all floors) → **Generate** → **Download** (zip) — useful for factory software and quotations.
- Quotations: enterprise accounts can configure quotation lists and rules (projection area, unfolding area, running metre). Coohom does not document a plywood cut list export; use the `cut_list` tool with the module sizes from the drawings.

## 9. Rendering
1. **Live Render** (top of the design tool) previews while you edit materials and models.
2. **Render** settings: aspect ratio, resolution, views (smart views or saved **My Views**), lighting, environment; **Generate** (turn wireframe off first). Results go to the **Gallery**; **Compare** gives a before/after slider.
3. **Classic Render** offers panoramas, videos and other outputs. Rendering uses credits (plan-dependent) — ask before large batches.
4. Camera at eye level (about 1500) for client views; show 2–3 renders per room.

## 10. Hand-over checklist
- Rooms named, areas checked; every door swing clear.
- Kitchen: counter height, triangle, island clearance, appliances, chimney duct.
- Wardrobes: depths, shutter widths, loft heights, RCC loft cladding.
- Elevations with mm dimensions, materials, finish codes, hardware.
- Cut list CSVs and sheet counts per material; edge band metres.
- Save the project (Ctrl+S); never delete or overwrite projects without the user's go-ahead.
