# L44 C60 refrigeration reconstruction

The HVAC explorer now includes 37 additional selections for the optional refrigeration circuit, bringing the HVAC catalog to 101 selections before option filtering. The vehicle and detail view use the same native builders. Existing evaporator, accumulator, fixed orifice and short evaporator connections remain linked to the new compressor, condenser and three distinct long-circuit branches. This is source-backed external architecture, with physical inspection and exact installed-equipment verification still pending.

## Original catalog pages inspected

All pages below refer to the local 356-page `fiero-parts-cd.pdf`, also [available in the archive](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf). The page renders and hashes are recorded in [completion-hvac-source-register.json](completion-hvac-source-register.json).

| PDF pages | Factory figure / application | Use in this increment |
| --- | --- | --- |
| 263–264 | 2P09-001, 1984–88 A/C and heater module | Existing evaporator, accumulator, orifice and mode-actuator architecture. The table distinguishes the 1985–88 accumulator/core and the 1984–85 orifice. |
| 265–266 | GM09-090, DA-6 / HR-6 combined compressor construction | External cylinder housing, heads, head seals, pulley, bearing, field coil, clutch plate, nut, pressure-relief fitting and switch construction. This combined service drawing does not identify the compressor installed on this car. |
| 267 | GM09-093, 1986–88 V-5 compressor | Retained for later model expansion; not used to claim 1985 L44 equipment. |
| 268 | 2P09-003, 1984–85 L4 compressor mounting | Retained for the four-cylinder model; excluded from this L44 bracket set. |
| 269 | 2P09-009, 1985–88 L44 compressor mounting | L44 pivot and rear brackets, hardware, belt relationship and the 1985–87 adjuster, catalog 10032584. The different 1988 adjuster 10044943 remains a later-year record. |
| 270–271 | 2P09-010 / 011, 1986 and 1987–88 L4 mounting | Retained for later/four-cylinder expansion; not transplanted into the 1985 V6. |
| 272–273 | 2P09-006, 1984 refrigeration | Retained as a distinct system/application; later application notes appearing in that table are not a complete 1985 circuit source. |
| 274–275 | 2P09-008, 1985–87 refrigeration | Primary loop drawing: L44 hose assembly 10034325, 1985–86 inlet/outlet pipe assembly 10038935, front connections, condenser 3050988, seals, clamp sets and shields. The compressor table contains pulley design notes; the actual variant remains unknown. |
| 276–277 | 2P09-013, 1988 refrigeration | Preserved to support later-year work. Distinct front tubes, later hose/pipe details and pressure-relief arrangement remain separated from the 1985 model. |

## What changed

The compressor view separates the housing, front/rear heads and true rear-head suction/discharge bores; two head seals; bolt set; field coil, open pulley, bearing, retainer, three-arm clutch and nut; relief fitting and rear-head switch exterior; L44 brackets and their slotted adjuster; mounting hardware; belt, additional crank accessory groove and splash shield. The specific compressor internals, switch calibration and original pulley design are not guessed.

The condenser has a continuous multi-pass tube construction, corrugated fin surfaces, support rails with open holes, air seals, retainers and support hardware. Its tubes and fins are construction selections within one catalog condenser service unit, not separate OEM ordering items.

The lines view separates the paired compressor hoses, paired-port manifold, compressor seals, paired underbody pipes, front discharge tube, front liquid tube, front suction-return connection, joint seals, support clamps, front clip and protective shield. Authored branch endpoints meet the existing accumulator outlet and evaporator inlet. This verifies model continuity; actual bends, hose lengths, radii, service clearances and engine movement remain unmeasured.

The former two-cylinder compressor, solid condenser rectangle on the radiator and single line grouped with coolant pipes have been removed by the integration owner. The new vehicle owners are `ac-compressor`, `ac-condenser` and `ac-refrigerant-lines`. All new geometry follows the C60 option. The whole car receives the same native geometry and keeps `detailPartId` for the correspondence.

## Verification and limits

`node scripts/audit-completion-refrigeration.mjs` passed with 37 nonempty selections and 137,517 vertices. It checks finite positive-handed meshes, option gating, route endpoint connections, actual open rear-head bores, bearing containment in the pulley and the condenser's position ahead of the radiator plane. Reports are saved to a fresh directory under `artifacts/completion-refrigeration/` with the app source fingerprint.

`tests/refrigeration.spec.js` covers selectable compressor/condenser/line scopes, factory page links, screenshots and recovery to the heater scope when C60 is disabled. The shared verification owner runs the browser suite after source freeze; screenshots must be opened before being recorded as reviewed.

No refrigerant charge, pressures, torque sequence, retrofit instructions or compressor teardown procedure is supplied by this increment. Those require the correct service source and installed equipment identification. The provided dimensions, fin/pass counts and bracket profiles are reconstructions. The owner plans physical validation later; this work does not mark that acceptance complete.
