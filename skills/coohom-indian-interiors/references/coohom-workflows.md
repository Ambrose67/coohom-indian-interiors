# Coohom workflows — scratch to finished design

Menu names come from Coohom's beginner lessons, Help Center and pricing page, read in November 2026. Coohom updates its UI often: if a label differs, take a screenshot and adapt. Plan tags such as **[Elite]** come from the pricing page or the article itself (see `coohom-plans.md`). If a tool is locked on the user's account, say so; do not work around it.

**Driving Coohom as an agent.** The canvas is WebGL, so walls and models are not in the page's accessibility tree. Read menus and fields from the DOM, judge the design from screenshots, and type numbers into fields rather than dragging. Dimension fields accept arithmetic (`+ - * /`). Save often (Ctrl/⌘+S). Never refresh a project tab with unsaved work, and never delete, overwrite or share a project without the user's go-ahead.

Contents: 0 Project setup · 1 Floor plan (wall tool, editing walls, height, beams, columns, openings, stairs) · 2 AI tools · 3 Placing models · 4 Materials, colour and texture · 5 Wall editor (panels, mouldings, paint) · 6 Ceiling editor · 7 Lighting · 8 Kitchen & Bath · 9 Wardrobes and custom furniture · 10 Freeform / custom modelling · 11 2D drawings and exports · 12 Rendering · 13 Hand-over checklist

---

## 0. Project setup
1. Workbench → **Create New Project** / **New Project**. There are three ways to start: upload a floor plan (CAD or image), start from a template (including AI templates, see §2), or start blank.
2. Avatar (top right) → **Preferences**: set language, units (**mm** for interiors; cabinet fields such as countertop thickness can refuse edits while the unit is metres), appearance, keyboard shortcuts and mouse controls. Floor Plan → **Wall Intersect Split = Auto** makes crossing walls split automatically. Renderings → brightness measurement unit.
3. Confirm the brief first: room sizes, north, ceiling height (9/10/11 ft = 2743/3048/3353), Vastu, style and budget. Restate the room list to the user before drawing.

## 1. Floor plan

### 1a. Upload instead of redrawing
- **Import 2D Drawing** (CAD, PDF or image), then **Floor Plan Check**. For the AI fix-up, see §2.
- Several images can be imported to build multi-floor layouts.

### 1b. Wall tool: drawing walls
1. Left toolbar → **Draw Room / Rectangle Wall** for closed rooms, or **Wall** for single runs. Walls must close a loop to form a room.
2. Click a start point, type the length, then press Enter. Right-click ends the tool.
3. Hold **Alt** while drawing to change the thickness on the fly.
4. Indian convention: 230 mm external and 115 mm internal brick walls (or 260/145 finished with plaster). State which convention you used.

### 1c. Editing walls
- **Length**: select the wall, click its length dimension, type the value, choose which way it extends, then press Enter.
- **Thickness**: click the thickness dimension and type a value, or select the wall and set **Thickness** in the right panel.
- **Height**: select the wall and set **Height** in the right panel (default 2800). For one wall only: in 3D, Ctrl/⌘-click the wall and set Height under **Basic**. Lower than the room makes a half wall ("Custom"); higher raises the room after you confirm. Set **Room Height** first, then use **Custom** for individual walls.
- **Split / Merge / Align**: use the **Edit** menu or the wall's floating toolbar.
  - **One-click Slice** splits a wall at its intersections; Shift-select all walls to slice every wall.
  - **Split** cuts at a point or at a typed distance.
  - Double-click joins aligned walls of the same thickness; **Merge → Select Neighbor Object** does the same from the menu.
  - **Align** lines one wall up to a reference line.
- Name every room (Kitchen, Bed 1, Pooja…) and check each area against the brief.

### 1d. Beams
1. Left panel → **Beam**, then click the start and end points. Shift keeps it orthogonal; Ctrl/⌘ cycles the location line (Internal / Center / External).
2. Set **Width** and **Height** in the right panel. **Position** is Ceiling or Floor. Then set **Distance from Top Surface** or **Distance from the Ground**.
3. Model every beam drop: it decides loft heights, wardrobe tops and false-ceiling levels.

### 1e. Columns, pillars and flues
- The Help Center documents columns under the **Kitchen & Closet** room tools: select the room, then pick a column, beam or flue.
- Hover the column's lower-right corner to choose a square or round shape, then drag it into place.
- Resize with the adjustment points, or set length and width under **Basic**. For height, switch to **Custom** and type the value.
- In the main floor planner, use its structure tools the same way. In Cloud Design 5.0 columns fuse with walls to enclose rooms.
- Indian RCC columns are typically 230 × 300 to 230 × 450 (rule of thumb; use the structural drawing).

### 1f. Doors, windows and openings
- Place doors and windows from the structure tools. Set width, height and sill numerically.
- Indian defaults: main door 1000–1200 × 2100, bedroom 900, toilet 750, window sill 750–900.
- There are also tools for rectangular, arched and custom openings, curved windows and corner bay windows.
- To change a style: select the door or window → **Style** in the Parameters panel (leaf, mouldings, panels, handles).
- To swap the whole model: enter the **Doors & Windows** customisation, switch to **3D** and drag the new model onto the old one (in 2D it reports an overlap).
- **Floor Opening**: **Plane** cuts the floor slab; **Top Face** cuts the ceiling, for stair voids and double heights.

### 1g. Staircases
1. Left sidebar → hover **Staircase** → pick a model → drag it in.
2. Set **Length, Width, Height** in the right panel. **Customize** → reselect the stair → set **Number of Staircase Steps**, **Railing Height** and **Tread Depth**.
3. Check: riser 150–190, tread 250–300, 2R + T ≈ 600–640, width 900–1200, headroom ≥ 2200, handrail ≈ 900. Add the floor opening above it.

### 1h. Multiple floors
Create the floors, keep wet areas stacked, and cut floor openings for the stairs.

## 2. AI tools (what is documented)
| Tool | Where | What it does |
|---|---|---|
| **AI templates** | Beginner lesson 4: pick an AI template style → select a template → apply it to the whole house | Furnishes and decorates every room in one style. Use it as a starting point, then correct sizes to Indian standards (furniture, clearances, kitchen heights) |
| **Auto-Fix Imported 2D Floor Plans with AI** | **Import 2D Drawing** → **Floor Plan Check** | Recognises walls and openings from a drawing. **Opacity** (hold Y) compares with the original; **Re-recognition** re-reads a boxed area; **Alignment** (Ignore Current / Focus On) tidies wall alignment; **Generate** finishes |
| **AI Kitchen Auto-Layout** | Advanced Tool → Kitchen & Bath → top bar | Draw the cabinet runs, place appliances, **Generate** (it replaces the current kitchen). Check the result with `kitchen_layout` rules |
| AI rendering / "AI tools" | Mentioned on the pricing page for Pro and above, with an AI allowance by contract on Enterprise | No step-by-step article found |

"AI Home", AI decoration or generator tools and AI render settings had no Help Center article in November 2026. If the user's account shows them, take a screenshot, describe what is on screen, and keep Indian sizes and rules in force.

## 3. Placing models (furniture, appliances, decor, kitchen assets)
1. Left panel → **Model Library**. Search by keyword or use **Search by image**. Click the model or drag it into the plan.
2. The floating toolbar offers flip, duplicate, rotate and delete. Set W/D/H, position, height off the floor and rotation in the right panel. Typed values beat dragging.
3. Group and ungroup models with shortcuts. Favourite models you reuse.
4. Upload your own SketchUp or 3ds Max models to **My Library** (personal library slots depend on plan: 10 Basic, 100 Pro, 2000 Elite).
5. Check clearances with the measure tool against `rooms-and-units.md`: walkways 900–1200, bed sides ≥ 600, wardrobe front 900.
6. **Kitchen assets**: loose appliances (fridge, microwave, mixie, RO) come from the library. Cabinet-integrated hob, sink, chimney and built-in appliances come from the Kitchen & Bath tool (§8). Replace an appliance inside a cabinet by double-clicking a similar-size one in the list.
7. Lighting fixtures (pendants, downlight models, fans) are library models. The light they give comes from §7.

## 4. Materials, colour and texture
- **Paint or replace a surface**: select a floor, wall or ceiling surface and replace its material.
  - In the desktop app the whole room is painted by default. To paint one wall: **Model Library → Finishes**, switch to **3D**, pick a finish, then **Ctrl-drag** it onto that wall.
- **Colour selection**: paints are under **Wall Decor → Paints & Coatings** (in the wall and ceiling editors) and **Finishes**.
  - The Help Center has no colour-picker article; choose from the palette shown, then compare with the client's paint shade card.
  - Use the 60-30-10 rule and the regional palettes in `materials-and-hardware.md`. Screen colours differ from paint: tell the client to test patches on site.
- **Texture and pattern**: the wall and ceiling editors have **Wall Decor** categories (Wood Veneers, Wall Panel, Stone → Marble, …). **Paving Brush** and **Molding Brush** copy textures and mouldings. **Edit Elevation** assigns a material to a modelled line.
- **Floor tiles**:
  1. Select the floor → **Floor Editor** → **Tiles** → choose a category (e.g. **Porcelain Tile**) → pick a material.
  2. **Paving** sets the laying pattern. **Control** sets position, angle and gap (joint). **Pattern** sets tile size.
  3. **Exit with Save**. **Rotate** on a room's floating toolbar turns the floor pattern.
  4. Indian sizes: 600 × 600, 600 × 1200, 800 × 1600; granite thresholds at doors; anti-skid tiles in wet areas.
- **Kitchen and Closet cabinets**: select a cabinet → **Style** (carcass, door, handle). **Global Edit → Global Style** changes every custom cabinet; **Material Brush** copies a finish.

## 5. Wall editor (panels, cladding, mouldings, feature walls)
1. Select the wall → **Wall Editor**.
2. Lay out regions: **Guides** add construction lines; **Rectangle** splits the wall into zones (e.g. a TV-wall centre panel with two side zones).
3. For each zone pick a material from **Wall Decor** (Wood Veneers, Wall Panel, Stone/Marble…). Set **Extrusion** for depth (panels, fluting, grille). **Edit Elevation** gives a modelled line its material.
4. For repeated battens or grilles: draw one, then **Duplicate → Paste into Current Styling Area**, or Shift-frame-select it → **Array → Rectangular Array**.
5. For a lit groove, select the line and tick **Indented Lamp Belt**, then set Brightness and Color.
6. Check the preview in the top-right window, then **Exit with Save**.
7. **Mouldings, skirting, wainscoting**: **Advanced Tool → Material & Component → Moldings**. Choose a type (e.g. corner moldings) and click to place it; or Shift-click edges and pick the surface.
   - **Section Plane** sets L, W, Flip, Angle and Offset.
   - **Secondary Beam Lights** adds a light strip in the moulding.
   - **Replace** swaps the material; **Reset** undoes changes.
8. Free-form wall features: **Material & Component → Push/Pull** (§10).

## 6. Ceiling editor (false ceilings, coves)
1. Select the ceiling → **Ceiling Editor**. You can also reach it from **Advanced Tool → Material & Component → Ceiling → Ceiling Editor**, or **3D → Ceiling → Ceiling Editor**.
2. Draw the false-ceiling outline with **Line / Curve / Rectangle / Circle**. Use **Offset** for a parallel border (a peripheral ceiling).
3. Set **Extrusion** for the drop: 225–300 typical. For a 9 ft room keep it peripheral only (see `rooms-and-units.md`).
4. **Cove light**: choose **Light Strip**, click the shape's edge, then pick **Indented Lamp Belt** (a hidden cove) or **External Expansion Belt**.
5. Finish surfaces from **Wall Decor → Paints & Coatings**; use luminous materials for backlit panels.
6. **Exit with Save**.
7. **Templates**: **My Account → My Styling → Save as Ceiling Template** (with room type and name). In another room, open the Ceiling Editor → **My Styling → Apply**; the room must be at least as large.
8. Help Center guides exist for curved, tray (slanted edge), multi-level stepped, no-main-light and freeform luminous ceilings.

## 7. Lighting
| Need | How |
|---|---|
| Strip / cove LED | §6 step 4, or **Material & Component → Light Strips**. With a light trough: brightness, colour, length, width. Without: brightness, colour, position. Shift-select paths and click the blue surface; Shift+double-click a strip to **Connect Faces / Group** |
| Lights in mouldings or wall grooves | **Secondary Beam Lights** (Moldings) or **Indented Lamp Belt** (Wall Editor) |
| Spot / downlights / extra fill | Render → light customisation (below): **Rectangle Light**, **Omni Light**, **IES Lights** (upload a manufacturer's IES file for a real spot beam), **Volumetric Lights**. Downlight fixtures themselves are library models |
| Colour temperature & brightness | Click a light → colour, brightness and height in the right panel. Sunlight: **Status, Color Temperature, Shadow Softness, Brightness** (the article suggests ≤ 50%) and sun position |
| Presets | **Natural Daylight 3.0**, **Natural Nightlight 3.0**, Public Space templates |

To customise lights: **Render** → add a custom lighting scheme → name it → pick a base template → add or adjust lights → Save.

Indian targets: warm 2700–3000 K in living and bedrooms; about 4000 K in kitchen, study and bath. Under-cabinet task light in kitchens. See the lux table in `rooms-and-units.md`.

## 8. Kitchen & Bath (modular kitchen, vanity)
**[Enterprise for the parametric editor, K&B construction drawings and JSON/XML export, per the pricing page; check what the account shows.]** Entry: **Advanced Tool → Kitchen & Bath**. Some articles call the closet side "Kitchen & Closet".

1. Get the unit plan from `kitchen_layout` (layout, counter height, unit list with positions).
2. Model columns, beams and flues inside the room tools (§1e) so cabinets avoid them.
3. Optional: run **AI Kitchen Auto-Layout** (§2) for a concept. Otherwise place cabinets from the catalogue.
   - Start with tall units, fixed appliances and corners, then fill each run by dimension.
   - Sizes: base carcass 720, depth 560–580; wall units 600–720 high, 300–350 deep, bottom at counter + 600–750; tall units 2100–2150.
4. Drawers: **Parts → Drawer** → drag in → **Fill with Drawers**. Set **Number** and **Fill Mode** (Equal / By Ratio / By Numeric Value).
5. **Generate → Countertop** (Shift-select cabinets or **Auto-select**):
   - Set the front edge, backsplash and material (granite or quartz).
   - **manual edit** for custom outlines and edge oversize; you cannot change only one side's height.
6. **Generate → Sink**: style, tap, installation type and spacing; **Add Sink** for a second bowl. Put it centred under the window.
7. **Generate → Stove**: hob and chimney hood style, installation type, alignment, spacing. Keep the hood 650–750 above the hob and the hob away from the window and fridge.
8. **Generate → Toekick molding** (skirting). Crown molding, knobs/handles, legs and sliding doors also have one-click generators.
9. **Style / Global Style / Material Brush** for finishes; **Smart Decors** to dress cabinets for renders.
10. Bathroom: place the WC, shower and vanity to their rough-ins; for the vanity use **Fill with Drawers** and BWP/WPC materials.

## 9. Wardrobes, lofts, TV / crockery / shoe / pooja units (Closet, custom furniture)
1. **Kitchen & Closet design → Closet** (or apply a design template). Get the plan from `wardrobe_layout`.
2. From the **Public** library choose unit cabinets, wardrobes, tatami or wall panels. Drag one out and set its size per bay (main height 2100/2400, depth 600 hinged or 650 sliding).
3. Internals: drag shelves, partitions, rods and drawers into the cabinet.
   - Doors: drag a door onto the cabinet and set it with its four adjustment points (they snap to edges).
   - Sliding doors: **Generate → Sliding Doors**.
4. Lofts: add a second row of cabinets at the loft heights, with shutters lined up to those below.
5. RCC lofts: model the slab as building structure (a structural box or beam, or a Freeform object, §10), then add a shutter-only front.
6. Note: the wall, floor and ceiling editors are not available inside the Kitchen & Closet tool. Do those in the main design tool.

## 10. Freeform and custom modelling (3D shapes the libraries don't have) **[Pro and above: custom modeling tool]**
- **Material & Component → Push/Pull**:
  1. Draw a shape on a wall with Line, Rectangle, Circle or Arc.
  2. Choose Push/Pull, click the face, then drag or type a distance. Double-click the next face to repeat the last distance.
  3. Only architectural surfaces can be pushed or pulled, not structural walls, floors or ceilings.
- **Import CAD file** (Material & Component): bring in a 2D CAD outline, ungroup it, Push/Pull it for thickness, group the faces and drag a texture onto it. Good for CNC jaali, temple-door outlines and custom TV-wall profiles.
- Other tools exist in Material & Component: Loft, Face Editor, Guides, Measure, roofs and sloped ceilings.
- **Custom modeling (Freeform)**: for scripted, exact or organic models (live-edge TV units, carved pooja frames, custom wardrobes on a chosen wall), use the separate **`coohom-freeform`** skill and its `freeform-modeling-mcp` tools.
  - Entry: **Advanced Tool → Custom modeling**.
  - That skill covers connecting the session, locating walls with temporary markers, building in one named group, and making materials.
  - Entering Custom modeling auto-saves the project.

## 11. 2D drawings, construction drawings and exports
| Output | Steps | Plan |
|---|---|---|
| Floor plan drawings | **Drawings → Floor Plan** (enterprise: **Drawings & Schedules → Floor Plan Drawings**). Choose a template and colour scheme, wall and furniture shadows, then annotate: **Auto-Annotation, Dimension, Attribute, Text, Leader, Symbol**. Set scale with **Adjust the Size**, then **Download** as Image or PDF | Download: **[Elite]** for personal users |
| Custom furniture (cabinet) drawings | **Drawings → Custom Furniture Drawings** (or from Closet / Kitchen & Bath: **Drawings & Schedules → Custom Furniture Drawings**). Pick the target → **Annotation Drawing** → **Enter Annotation Drawing**. **2D** gives Front / Left / Right / Top views. Annotate with **Auto Measure / Semi-Auto Measure / Manual Measure**, callouts and internal zones. Take screenshots → **Generate Drawing** → edit title block and layout → **Download CAD File** | **[Enterprise]**; Elite users get 5 free trials |
| Kitchen & Closet views and elevations | **Drawing → Edit views**: auto or manual annotation; elevation marks via **generate views → elevation** (Auto-Place / Manu-Place). **Drawing → Drawings Layout**: drag views onto sheets, set scale, **Download** | K&B construction drawings **[Enterprise]** |
| Construction drawing download, CAD export | Listed as plan features | **[Elite]** and **[Enterprise]** |
| BOM (bill of materials) | Listed as a plan feature | **[Pro]** and above; custom quotation/BOM export **[Enterprise]** |
| JSON/XML (K&B) | **File → Export JSON/XML** → choose quote logic and range → **Generate → Download** | **[Enterprise]** |

Sections: no Help Center article found. Draw sections from the elevations, or export to CAD and section there.

Plywood cut list: Coohom does not document one. Use the `cut_list` tool with the module sizes from the drawings.

## 12. Rendering
1. **Render** opens the render tool. Modes: perspective, **360° walkthrough**, top view, video, real-time.
2. Settings:
   - **Aspect ratio**.
   - **Lighting** template or a custom scheme (§7).
   - **Environment**: brightness, tone, position, ambient light.
   - **Camera**: position, Smart Views or saved **My Views**, clipping. Use about 1500 eye height for client views.
   - **Resolution**: start at 1K for previews, then go up.
3. **Generate**, then view results in the **Gallery** (Large View, separate window). **Share** gives a link or QR code; Recycle Bin removes images.
4. **Live Render** previews changes while you edit and has a **Compare** slider. Turn Wireframe off before **Generate**. Its **Top Up** shows remaining credits and time.
5. **Classic Render** is for panoramas, video and richer outputs.
6. Plan limits (pricing page, Nov 2026):
   - Basic: low-resolution watermarked renders; 360° at 2K.
   - Pro: unlimited 4K, monthly 8K and video quotas, 720° VR.
   - Elite: annual 8K/video quotas plus 3D presentation links.
   - Credits are used for some renders. Ask before large batches.

## 13. Hand-over checklist
- Rooms named and areas checked; every door swing clear; beams and columns modelled.
- Kitchen: counter height, work triangle, island clearance, appliances, chimney duct, sockets.
- Wardrobes: depths, shutter widths, loft heights, RCC loft cladding.
- Ceilings: drops versus ceiling height; coves and lighting colour temperature.
- Drawings: plan and elevations with mm dimensions, materials, finish codes and hardware (whatever the plan allows to download; otherwise screenshots plus the `cut_list` CSVs).
- Cut list CSVs, sheet counts and edge band metres.
- Renders: 2–3 eye-level views per room.
- Project saved.

## 14. Where things are (UI map, observed November 2026)

**Workbench** (coohom.com/pub/saas/workbench) left menu:
- Projects: My projects, Team projects.
- Material:
  - Team library: Furniture, Furniture Sets, Textures, Paving, Molding/Wall panels, Material Submission Management.
  - Personal Library: Models / Textures / Ceiling & Wall.
  - My Favourite, with tabs Model/Material, Kitchen & Bath, Custom Furniture, Doors & Windows, Floor plan.
- AI tools: AI Image, AI Modeler, AI Layout, AI Templates (Submit, My Template, Template Manager, Config Management).
- Management: Members, Subscription, Settings.

**New Project** offers New 3D Project, New Kitchen & Closet Project and New House Design Project. A 3D project then offers Draw, Import floor plan, or style templates.

**3D design tool**:
- Left rail: Floor Plan, Inspiration Library, Models, Team library, Drawings, Render settings, Advanced tool, Resource manager.
- Top bar: File, Save, Undo/Redo, Clear, Toolkit, Gallery, Live render, Share, Help; Edit / Split area / AI Layout above the canvas.
- Floor Plan panel:
  - Import floor plan → Import 2D drawing.
  - Draw room → Straight wall (B), Rect wall (F), Arc wall (H), External area.
  - Place doors and windows → Door, Window, Bay window, Opening.
  - Add structures → Column, Beam, Staircase, Flue, Floor opening, Partition wall, Bay window sill, Niche.
- Right panel: New upper/lower floor, Current floor, Room height, Slab thickness, wall/floor opacity.
- Advanced tool: Material & Component, Kitchen & Bath (⌥4), Closet (⌥5), Custom modeling. Kitchen & Bath and Closet need a closed room first.

**Kitchen & Closet tool**:
- Left rail: Room, Kitchen, Closet, Decors, Rendering, Drawing.
- Room tab:
  - Walls: Straight, Curved and Rect wall.
  - Structure & opening: Column, Beam, Flue, Niche, Door opening, Window opening.
  - Doors & Windows: Single, Double and Sliding door; Linear, Linear bay and French window.
- Library switcher (top of the Kitchen/Closet panel):
  - **Manufacturers**: generic + manufacturer catalogues.
  - **Enterprise**: your team's catalogue.
  - **Personal**.
- Catalogue types: Product Catalogue, Parts, Combinations, Materials, Hybrid libraries.
- Kitchen generic catalogues: Frameless Cabinet New, Frameless Cabinets, Framed Cabinets. Manufacturer lines are mostly US brands (Panel Plus, River Run, Wellborn, JSI, US Cabinet Depot).
  - **Frameless Cabinet New → Products** has about 2,400 units in folders: Base, Base Corner, Tall, Wall, Wall Corner, Filler.
    - Sub-folders: door/drawer, full door, 2–5 drawers, sink base, cook & vent, open shelf, blind/diagonal/90° corners, utility, pantry, oven and fridge towers, wall units 15–60 in high with door, glass, spice rack, open shelf or bottom drawers, fridge bridge, peninsula units, fillers.
    - SKUs are in **inches** (B30 = 30-inch base, TD2484 = 24 × 84 in tall). Convert: 1 in = 25.4 mm. Indian modules (300/450/600/900 mm) are close to 12/18/24/36 in.
  - **Parts**: door and drawer-front styles and a handle library.
- Closet manufacturers: Panel Plus, Hurmar, Selected Closet (base units, corner units, walk-in closet combinations).
- Indian-sized custom wardrobes and kitchens are usually built with the parametric cabinets plus your own sizes, or from your favourites/team library.

Your own favourites, personal library and these catalogues can be indexed locally and searched with the `library_lookup` MCP tool (see the README).

### Inside Advanced tool → Closet and Kitchen & Bath (observed November 2026)
Both tools have a left rail: **Public Catalog, Team Catalog, Manufacturer Catalog, Personal Catalog, Advanced Tools**. Each catalogue has **Product Catalogue** and **Parts** tabs, folders on the left, and filter tags at the top of each folder. Advanced Tools also lists **Doors & Windows (⌥6)**.

- **Closet → Product Catalogue**:
  - **Space System** (ready combinations per room: bedroom hinged / sliding / walk-in / children / bed / TV / dressing; living TV; dining wine and sideboard; home office; entrance shoe and display; balcony; multi-function tatami).
  - **Space Unit**: single units per room, including bay window, washing machine and no-handle units.
  - **Open Cabinet** (no doors), **Cabinet with Hinged Door** and **Cabinet for Sliding Door**, each split into:
    - Base Unit: floor unit on legs or skirting.
    - Bottom Unit: lower part of a full-height wardrobe.
    - Top Unit: **loft**.
    - Low Unit: waist-high.
    - Wall Unit: hanging.
    - Tabletop Unit.
  - Door counts 1–6; "Cut" and "Cut Beam" variants fit around columns and beams.
  - **Special-shaped** (L, pentagon, linear-corner, chamfer, stair, partition units), **Side Cabinet**, **Desk Cabinet**, **Tatami**, **Auxiliaries** (fillers, end panels, Roman columns, lintels, pedestals, crown mouldings), **Wall Panel**, **DIY Panel**, **Decoration**, **Unit cabinet**, **Pooja Units**, **Storage Rack**, **Handrail**.
- **Closet → Parts**:
  - **Door library**: aluminium frame, flat, golden outline, coated, blister/membrane, solid wood, powder-coated, Popular Series. Handle-less profiles: concave, long pull, J/T-shaped, embedded handle.
  - Shelves (glass and lit), back panels (9 / 18 mm), vertical plates.
  - Drawers, pants racks, pull-out baskets, clothes rails, hooks, dressing mirrors, wine / Z / antique racks, light strips, ready combinations.
- **Kitchen & Bath → Product Catalogue**:
  - **Base Cabinet** (Common / No-handle / Decorative), filter tags With Doors, With Drawers, With Sink, With Stove, Functional (rice bin, pull-outs), With Appliance, Open, Corner, Chamfer.
  - **Wall Cabinet**: doors, lift-up flap, open, functional (above-fridge, chimney), corner.
  - **Tall** and **Semi-Tall Cabinet**: appliance towers, interlock pull-out pantry.
  - **Tabletop Cabinet**.
  - **Kitchen Appliance**: induction and gas cooktops, chimney hoods, ovens, microwaves, dishwashers, fridges by type, water heaters. Mostly US/EU models: choose by size.
  - **Bathroom Cabinet**: wall-mounted and full-height vanities, mirror cabinets, shower enclosures.
  - **Auxiliaries**: fillers, end panels, decorative columns, lintels, pipe covers.
  - **Decoration**.
- **Kitchen & Bath → Parts**:
  - Door-panel series: flat, powder-coated, blister, frame, solid wood, golden outline, no-handle, **T/G-shaped pull (gola)**, embedded handle, Popular Series.
  - Drawers, including multi-function pull-out basket and three-side dish (plate / thali) basket.
  - Lintels, internal modules, light strips, bins.

Handles, colours and finishes for placed cabinets are changed in the cabinet's **Style** panel or with **Global Edit → Global Style**.
- **Doors & Windows (⌥6) → Public Catalog**: libraries *Whole wood doors and windows* and *Aluminium door and window library*:
  - Solid-wood swing doors (single, double leaf, glass core), sliding and hanging doors, concealed and folding doors.
  - Aluminium casement windows (inward/outward, arched, irregular, bay), double- and three-track sliding windows, hanging, swing and folding doors, door-windows with mosquito screen, sunrooms, curtain-wall and arc windows.
  - Numbers such as 65 / 88 / 137 are aluminium profile series.
  - Place a door or window, then set its width, height and sill in the parameters.
- **Kitchen & Bath / Closet → catalogue dropdown → Materials** is the cabinet colour and finish library used by the Style panel.
  - **Selected Material**: laminate/PVC finish sheets (embossed or non-embossed; high-gloss, matte, super-matte; synchronous wood grain), veneer sheet, powder coating, solid wood.
  - **Common Material**, by grain (wood, solid colour, lacquer, stone, metal), by panel, and by craftsmanship (door panel / countertop / trim material).
  - Glass and mirror.
  - The dropdown also offers **Combinations**.
- **Material & Component → Materials**:
  - Mapping (wallpaper, wall paint, wall fabric, wood panel, pattern, wall and floor tiles, carpet).
  - Moldings (corner, baseboard, decorative, outside corner).
  - Ceramic (archaic, glazed, polished, porcelain, marble-look, special-shaped, slate).
  - Stone (marble, granite, cultural, artificial, slate).
  - Flooring (solid, composite, bamboo, cork, WPC).
  - Buckle board, Wall panel, Coating, Carpets & Rubbers.
  - **Schemes** (paving/laying patterns).
  - Search by image.
