# Coohom Indian Interiors — Claude skill + MCP server

An open-source toolkit that lets any Claude agent design **Indian homes and interiors in [Coohom](https://www.coohom.com)** correctly — modular kitchens, wardrobes, lofts (including RCC/concrete lofts), TV, pooja, crockery and shoe units, doors and false ceilings — and turn the design into a **plywood cut list with 8'×4' sheet counts**.

Made by Rose Architects (Alangulam, Tenkasi, Tamil Nadu), an architect-led design-and-make firm with its own interior, furniture and sofa factory. The rules reflect Tamil Nadu and Kerala practice and work for most of India.

## What's inside

| Part | What it does |
|---|---|
| **Skill** `coohom-indian-interiors` | Design rules for kitchens, wardrobes, lofts for 9/10/11 ft ceilings, rooms, doors, ceilings, materials (MR/BWP ply, HDHMR, laminates, acrylic, PU, veneer) and hardware; scratch-to-finish Coohom workflows for every tool (wall tool, columns, beams, doors/windows, stairs, AI templates, model library and kitchen assets, colour/texture/tiles, wall editor, ceiling editor, strip/spot lights, Kitchen & Bath, wardrobes, Freeform/custom modelling, 2D and construction drawings, rendering) with plan requirements; cut-list method and a CLI script |
| **MCP server** `indian-interiors` | Four tools: `kitchen_layout`, `wardrobe_layout`, `cut_list`, `standards_lookup`. Zero dependencies — plain Node.js ≥ 18 |
| **Plugin marketplace** | Install the skill in Claude Code with two commands |

Every number is labelled: plain values are typical Indian practice, **(rule of thumb)** values are conventions, **(check catalogue)** values depend on the hardware brand. Site measurements and the client's needs always win. See [`references/sources.md`](skills/coohom-indian-interiors/references/sources.md).

## Coohom plans

Some Coohom tools need a paid plan. From Coohom's pricing page and Help Center (November 2026):

| Feature | Plan listed |
|---|---|
| Custom modeling tool (Freeform), BOM download, unlimited 4K renders, 720° VR | **Pro** and above |
| Download construction drawings and floor plans, export to CAD, 3D presentation links, team collaboration | **Elite** and above (floor plan drawing download is Elite-only for personal users) |
| Custom Furniture (cabinet) drawings | **Enterprise** (Elite gets 5 free trials) |
| Kitchen & Bath parametric editor, K&B construction drawings, K&B JSON/XML export | **Enterprise** |
| Renders on the free Basic plan | 1K, watermarked; credits for some render types |

Full table: [`references/coohom-plans.md`](skills/coohom-indian-interiors/references/coohom-plans.md). Accounts with trials or legacy access may differ; go by what your account shows. The plywood `cut_list` here works on any plan.

## Install

### 1. The skill (Claude Code plugin)

In Claude Code:

```
/plugin marketplace add Ambrose67/coohom-indian-interiors
/plugin install coohom-indian-interiors@coohom-indian-interiors
```

or from a terminal:

```bash
claude plugin marketplace add Ambrose67/coohom-indian-interiors
```

```bash
claude plugin install coohom-indian-interiors@coohom-indian-interiors
```

For Claude Desktop / claude.ai, zip the `skills/coohom-indian-interiors` folder and upload it under Settings → Capabilities → Skills (the cut-list script there needs the MCP server or a local copy of this repo).

### 2. The MCP server

**Claude Code** (no clone needed — npx fetches it from GitHub):

```bash
claude mcp add --scope user indian-interiors -- npx -y github:Ambrose67/coohom-indian-interiors
```

or from a local clone (faster start, works offline):

```bash
git clone https://github.com/Ambrose67/coohom-indian-interiors.git ~/coohom-indian-interiors
```

```bash
claude mcp add --scope user indian-interiors -- node ~/coohom-indian-interiors/mcp/src/server.mjs
```

**Claude Desktop** — add to `claude_desktop_config.json` (Settings → Developer → Edit Config), then restart:

```json
{
  "mcpServers": {
    "indian-interiors": {
      "command": "npx",
      "args": ["-y", "github:Ambrose67/coohom-indian-interiors"]
    }
  }
}
```

(or `"command": "node", "args": ["/absolute/path/to/coohom-indian-interiors/mcp/src/server.mjs"]` for a local clone).

Check it: `claude mcp list` should show `indian-interiors … ✓ Connected`.

## The tools

### `kitchen_layout`
Room size (+ optional family size / BHK type, cook height, window, fridge width, island wish, Vastu) → layout (straight / L / parallel / U / + island), counter height from the cook's height, sink/hob/fridge walls, base and wall unit list with positions (sink, hob with drawers, oil pull-outs, tandem/basket drawer units, corner, tall units, fillers), work-triangle check, warnings, and a ready `cut_list_spec`.

Rules it enforces: island only with ≥ 1000 mm clear all round; hob never beside the sink or fridge; landing space next to the hob; triangle 4.0–7.9 m.

```json
{ "length": 3300, "width": 2700, "home_type": "2bhk", "cook_height": 1550, "window_wall": "A", "window_center": 1500 }
```

### `wardrobe_layout`
Wall width + ceiling (9/10/11 ft or mm) + loft type (`ply`, `rcc`, `none`) → wardrobe height, loft rows, hinged or sliding shutters (sliding chosen automatically if front clearance < 900), bays with internal zones (long hanging for saris, short hanging + drawers + locker, shelves), front area in sq ft (for per-sq-ft pricing), RCC loft cladding (BWP frame + shutters), and a `cut_list_spec`.

```json
{ "wall_width": 2400, "ceiling_ft": 10, "loft": "rcc", "rcc_loft_bottom": 2100, "rcc_loft_depth": 450 }
```

### `cut_list`
Cabinet spec → every panel (sides, top/rails, bottom, back, partitions, shelves, shutters, drawer fronts and boxes) with grain direction, edge banding and cutting sizes; per-material sheet counts on 2440×1220 sheets with trim and kerf (three-stage guillotine layout); edge band metres; CSV text. Spec format: [`references/cut-list.md`](skills/coohom-indian-interiors/references/cut-list.md).

### `standards_lookup`
Topic or free text (`"kitchen"`, `"saree hanging"`, `"toilet door"`, `"10 ft loft"`, `"gtpt"`) → typical values in mm with a pointer to the reference file.

## Cut list from the command line

```bash
node skills/coohom-indian-interiors/scripts/cutlist.mjs skills/coohom-indian-interiors/examples/kitchen-2bhk.json kitchen
```

Prints sheets per material and edge band metres; writes `kitchen-panels.csv` and `kitchen-sheets.csv`.

## Development

```bash
npm test
```

Runs the calculator and MCP protocol tests with Node's built-in test runner (no install step).

Layout:

```
.claude-plugin/          plugin + marketplace manifests
skills/coohom-indian-interiors/
  SKILL.md               entry point for Claude
  references/            kitchen, wardrobes & lofts, rooms, materials, cut list, Coohom workflows, sources
  scripts/cutlist.mjs    CLI
  examples/              sample specs
mcp/src/                 server.mjs + kitchen, wardrobe, cutlist, standards modules
mcp/test/                tests
```

Contributions welcome — especially regional variations (Karnataka, Andhra, Maharashtra…), hardware catalogue data, and corrections from practice. Please keep the labelling convention: never add a number you cannot ground; mark conventions as (rule of thumb).

## Disclaimer

Typical values for planning and design. Structural items (RCC lofts, slabs, hooks for swings) need a structural engineer; approvals follow the current NBC 2016 and state building rules. Coohom is a trademark of its owner; this project is independent and not affiliated with Coohom. Menu names were taken from Coohom's public Help Center in November 2026 and may change.

## Licence

MIT — see [LICENSE](LICENSE).
