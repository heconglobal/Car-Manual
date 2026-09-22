# Car-Manual
Manual for a 1985 Pontiac Fiero 2M6


---

# Fiero / Workshop 85 — visual review 0.2

Interactive 3D workshop prototype for the owner's original **1985 Pontiac Fiero SE 2M6**, VIN `1G2PF3796FP217611`, original four-speed manual, and owner-confirmed WS6 option.

## Run

Requires Node.js 22.12+ or 24+.

```sh
npm ci
npm run dev
```

Open **http://localhost:5185/**. The server binds to all interfaces for testing from another device on the same accessible network. No authentication or backend is included. Feedback stays in the browser.

```sh
npm run build
npm run preview
```

The production bundle is in `dist/`. Assets are bundled locally; no external fonts, photographs, analytics, image services or CDN dependencies are loaded at runtime. Reference links only open when clicked.

## UAT scope

- Headlight explorer: 103 selections across both lamp/aiming, independent cover/linkage and early motor assemblies, plus relays/harness. Shared raised/closed geometry preserves the low exterior profile.
- [Remaining work](REMAINING-WORK.md): 20 areas / 73 development tasks, also available from the in-app reference library and UAT panel.

- 82 selectable 3D component groups across nine vehicle systems, including separate rear glass, sail appliques, rear roof clip and engine-deck vent grilles.
- Heater/ventilation explorer: 64 entries across C41 and C60 alternatives, including blower, case/doors, ducts, controls and optional evaporator/accumulator. Exact case tooling and full refrigeration/wiring remain incomplete.
- Body-panel explorer: 111 selections including the preserved skins, separate rockers/door trim/glass, hood stay and latch, decklid torque rods, door hinges, liners and attachment sets.
- Exhaust explorer: 44 selections including the early pellet catalyst cutaway, crossover, shields, muffler and supports.
- Fuel explorer: 53 selections covering the early tank, pump/sender, filler/vent, filter, separate feed/return and vapor system.
- Suspension/steering explorer: 216 selections including formed control arms, separate front shocks, rear strut stacks, toe links, manual rack internals and steering damper.
- Braking explorer: 212 selections across four corners, master/booster, hydraulic lines, parking cables and pedal scopes; see `references/brake-reconstruction.md`.
- Transmission/clutch and cooling explorers: 95 and 36 selections, with independent explosions and US left-hand-drive placement.
- Engine component explorer: 315 selectable parts and grouped sets, ten main subassembly views plus nineteen nested service views, an independent explode slider, component inspection / isolation and return to the previous vehicle view.
- Curved SE bumper-pad / notchback exterior, reconstructed from factory references and anchored to published dimensions. Roof/pillars, convex side skins, Hi-Tech wheels and lowered raised headlamps were further refined using the supplied four-angle reference images; see `references/roof-side-wheel-refinement.md`.
- Physical paint, glass, metal, rubber and upholstery materials; local CC0 studio lighting and contact shading.
- Detailed reconstructed V6, four-speed transaxle, wheels, suspension and integrated-headrest cabin geometry.
- Options panel: 18 appearance / equipment controls, plus raised headlights, window position, studio theme and dimension guides. Choices persist locally and are included in feedback exports.
- Solid, glass and removed-glass roof states; plain deck, luggage carrier and GT-style wing previews.
- Revised recessed rear window, smaller taillight panel, curved C-pillars and raised-center engine lid; see `references/rear-body-refinement.md`.
- Mouse, touch and keyboard camera controls; perspective, front, rear, side and top views.
- System filtering, global component search, direct 3D picking, part focus and isolation.
- Body visibility, labels, wireframe and continuously adjustable exploded views.
- Three guided tours, including an air-cleaner assembly demonstration.
- Vehicle specification record distinguishing source-confirmed identity from pending technical values.
- Source library and explicit model / content coverage.
- Browser-local UAT checklist and feedback, with JSON export.
- Responsive layout and mobile assembly navigation.

## Accuracy and coverage

**This release supports interaction and visual review. It has not passed acceptance for photorealistic, fully accurate vehicle and component geometry, and it is not a complete or validated repair manual.**

The geometry is reconstructed from factory illustrations. Wheelbase, track spacing and the overall envelope use the factory DIY manual's dimensions. Detailed contours, spring shapes, routing, clearances and exploded offsets are not engineering data. The model has not been measured against this specific vehicle. Red paint is a display choice; the owner's paint code and remaining RPO options are unknown. WS6 does not establish every other GT option.

NHTSA confirms the 1985 Pontiac Fiero SE, 2.8L V6, Pontiac assembly plant and valid check digit. The original manual transmission and WS6 are owner-reported. The factory brochure supports the V6 / four-speed combination. Pontiac's 1985 section 6E3 identifies the L44 / VIN engine code 9. The intake inspector includes the 1985–86 upper-plenum number from the November 1990 GM 22P catalog with its page and applicability. Most part numbers, exact factory service values and repair procedures remain unverified; they are not inferred from approximate geometry.

Some fasteners, grooves, cast ribs, tread and switches are modeled, but they are not a complete measured parts inventory. The separate engine explorer includes reconstructed internal parts; exact casting contours, running kinematics, measured transmission profiles, full accessory systems, wiring pinouts, hose routes and collision-valid repair animations remain to be produced. Guided tours are orientation and assembly demonstrations, not instructions for carrying out a repair.

Option previews do not establish bolt-on compatibility. Ten additional factory alternatives are listed as reference-only until their hardware and dependencies are modeled. The Canadian brochure is evidence of period choices, not this individual car's build sheet. See [geometry provenance](references/geometry-provenance.md) and [asset credits](ASSET-CREDITS.md).

## Tests

```sh
npm test
```

Playwright uses a cached Chromium executable on this workstation, with software WebGL for reproducible rendering. Override `CHROMIUM_PATH` for another installation. The server must be accessible to the test process; restrictive sandboxes may require running tests outside the sandbox.

Tests cover actual WebGL rendering, zero photo requests, system filtering, global search, camera and model controls, direct 3D picking, all tour navigation, specification provenance, feedback persistence and export, mobile layout, option-driven geometry changes, saved configuration recovery and unchanged VIN identity. Tests on software WebGL allow extra time for physical-material shader compilation.

Screenshots: `artifacts/`. Test report: `playwright-report/index.html` after a run.

## Project layout

- `src/data.js`: vehicle identity, component catalogue, provenance, tour steps and UAT checklist.
- `src/lighting.js`: reconstructed headlamp covers, bezels, sealed-beam optics and first-generation actuator layout, referenced to factory DIY 2-28 / 2-29 and GM 22P K-17 / K-18.
- `src/structure.js`: formed steel frame reconstruction from factory DIY 1-4 / 1-5, including floor pans, pillars, rails, bulkheads and wheelhouses.
- `src/model.js`: stable assembly IDs, model construction, configuration and exploded offsets.
- `src/body.js`: reconstructed body surfaces, glazing, exterior trim and roof / deck variants.
- `src/fascias.js`, `src/spoilers.js`: rounded SE end profiles, raked rear lamps, V56 carrier and optional pedestal-wing surfaces.
- `src/rear-clip.js`, `src/decklid.js`, `src/body-contours.js`: separate rear roof / sail / glass geometry, raised-center decklid and shared body shoulder contours.
- `src/mechanics.js`: reconstructed powertrain, chassis, wheels, cockpit and accessory geometry.
- `src/engine-catalog.js`, `src/engine-detail.js`: engine subassembly catalog and detailed inspection meshes, built when the engine explorer is opened. See `references/engine-explorer.md` for coverage and sources.
- `src/ignition-catalog.js`, `src/ignition.js`: distributor/ICM, coil, harness and plug inventories, service references and authored meshes.
- `src/engine-controls.js`, `src/engine-castings.js`: sensors, valves, plumbing and contoured casting/pan meshes.
- `src/vehicle-ignition.js`: shared engine detail geometry in the vehicle assembly view.
- `src/coverage.js`: known modeled and missing coverage across the vehicle.
- `src/geometry.js`, `src/materials.js`: geometry builders, draw-call consolidation and physical materials.
- `src/configuration.js`: period choices, preview defaults, validation and factory dimensions.
- `src/viewer.js`: rendering, picking, camera, labels, visibility and exploded transforms.
- `src/main.js`: interface, state, tour navigation and local feedback storage.
- `src/style.css`: responsive workshop interface.
- `tests/workshop.spec.js`: browser acceptance checks.
- `UAT.md`: tester instructions and release limitations.
- `scripts/visual-review.mjs`: captures front, rear, side and perspective views for inspection.
- `scripts/detail-review.mjs`: captures the isolated frame and raised headlamps, and records browser errors / visible geometry statistics.
- `scripts/spoiler-review.mjs`: captures the revised front / rear and both spoiler configurations; reference notes are in `references/exterior-refinement.md`.

## Path to the complete manual

1. Complete source coverage beyond the acquired 22P catalog, 1985 6E3 section, factory DIY manual and brochure. The complete 1985 chassis / body manual S-8510P and the car's remaining RPO codes are still needed for full validation.
2. Extract structured service records with source, page, configuration applicability, units, conditions and verification status. Review OCR against the originals.
3. Replace illustrative components with measured models, preserving component IDs. Model fasteners and hidden attachments at the level each repair requires.
4. Add validated repair prerequisites, tools, disconnection / access sequence, removal paths, installation sequence, torque conditions and final checks.
5. Review geometry and procedures against the original car and factory references with a qualified reviewer; track corrections and coverage per assembly.
6. Expand acceptance testing from interaction behavior to mechanical content accuracy before describing it as workshop-ready.

No generated visual detail should be treated as evidence for a service value or repair procedure.

## Ignition and tune-up detail update

Search **ICM** from the vehicle, or choose **Ignition & tune-up parts**. The engine now contains 315 selectable parts/sets, including 39 ignition items and 21 sensors, valves and line assemblies. **Distributor & ICM** opens a further breakdown of the cap, rotor, module, pickup, shaft and retaining hardware. Electrical now includes vehicle-level distributor, coil/harness and plug/lead entries. **Back to vehicle** restores the prior context.

Each plug also includes the original six-cylinder gap, torque, socket and period AC-type references from the 1985 Pontiac DIY manual.

See [research and accuracy limits](references/ignition-reconstruction.md), [specific engine callout gaps](references/engine-callout-gaps.md), [known vehicle gaps](src/coverage.js), and [UAT results](artifacts/UAT-readiness.md). The 3D model remains a reference reconstruction; full photorealistic and measured all-parts acceptance is outstanding.

## Cooling, lubrication and valve-gear increment

The engine explorer now has **315 selectable parts and grouped sets**. The thermostat, water pump, dipstick and A/C oil-pressure sender have their own service scopes. Each of the twelve valve positions also has an eleven-item scope with separate keepers, retainer, seals, rocker stud and nut. The two heads retain their own paired pushrod guide plates.

Select **Cooling system → Thermostat & filler housing → Explode this assembly**, or search **dipstick**, **oil-pressure sender**, **spring retainer** or **rocker stud**. The whole-car and explorer thermostat use the same authored geometry.

Sources and remaining limits are recorded in [engine-service-reconstruction.md](references/engine-service-reconstruction.md) and [valve-gear-reconstruction.md](references/valve-gear-reconstruction.md). These additions are not a claim of a complete photorealistic vehicle or measured factory CAD.

Transmission/cooling update: **446 detail selections** across three explorer families (315 engine, 95 transmission/clutch, 36 cooling), plus 67 overlapping vehicle assembly records. Shared surfaces connect the new detailed exteriors to the complete car. The US left-hand-drive correction fixes the previous mirrored coordinate convention across the whole car and detail explorers, including lettering and explosion offsets; driver/passenger camera views make orientation explicit. See [reconstruction notes](references/transmission-cooling-reconstruction.md), [UAT](UAT.md), and [remaining work](references/full-vehicle-worklist.md). The whole-car photorealistic target remains unfinished.
