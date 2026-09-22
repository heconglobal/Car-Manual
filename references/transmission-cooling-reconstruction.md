# Four-speed, cooling and US left-hand-drive reconstruction

Vehicle: owner-described original 1985 Pontiac Fiero SE 2M6, L44 V6, manual transmission, WS6. The VIN establishes identity, not every option. This increment adds 95 transmission/clutch and 36 cooling parts or grouped sets; the existing 315 engine entries remain. The 67 complete-car entries overlap these detail views and must not be added as a unique physical parts count.

## Factory references inspected

- GM 22P parts CD, PDF 128–130: 1985–86 four-speed plate and item tables. The printed table heading is MY8/M17 (the PDF bookmark transcribes it differently); the output gear table distinguishes the 3.65 final-drive application. The illustration is a component identity reference, not dimensioned CAD. [Factory parts publication](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=128).
- Adjacent-year 1986 Pontiac service manual, PDF 802–804, printed 7B1-2 through 7B1-4: numbered exploded view, legend and shaft cross-section. Third/fourth synchronization is on the input shaft; first/second is on the output shaft. [Factory service publication](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=802). Transmission inspection callouts use this service drawing's numbering, which differs from the parts catalog near the differential. It must not be mistaken for a 1985 torque/clearance source.
- GM 22P CD, PDF 36: 1985 hydraulic clutch linkage. PDF 40: clutch cover/driven plate/flywheel/release-bearing table; separate early V6 and later five-speed entries. [Clutch illustration](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=40).
- GM 22P CD, PDF 51–52: L44 radiator inlet/outlet pipes, radiator, thermostat and clamps. Item 25 is the left radiator inlet pipe; item 32 distinguishes 1985–86, 1987 and 1988 return pipes. Item 35 distinguishes the manual rear inlet pipe from automatic variants. [Cooling circuit](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=51).
- 1986 service PDF 343–345, printed 6B-2 through 6B-4: radiator/cap/recovery relationships and electric-fan support variants. Fan blade shape and variant are not established to an original 1985 part number by these diagrams.
- GM 22P CD PDF 263: C60 heater-module exploded view. Only core, seals, tanks and provisional supply/return plumbing are represented; the module case, doors and control mechanism are not complete. This is a C60 preview, not VIN-decoded equipment.
- 1985 DIY PDF 13 and 23, printed 2-4 and 2-14: front-compartment layout and driver-side hydraulic clutch master. PDF 50, printed 2-41: V6 thermostat housing is on the passenger side. [1985 factory publication](https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=13).

The web reader could not open the two large factory PDFs due to its file-size limit. Their existing local copies were rendered and inspected directly with PyMuPDF. No reference scans or photographs are shipped in the app.

## Handedness audit

The original model was mirrored, as the owner observed. Its comments and previous tests called +X "left" while the nose pointed -Z. In Three.js right-handed, Y-up space, an occupant facing -Z has **left = -X** (`up × forward`). The initial audit in this session inherited that mistaken convention; it was withdrawn before UAT and replaced by a physical-frame check.

| Assembly | Correct final location | Correction |
| --- | --- | --- |
| Steering wheel, instrument pod, pedals | -X / left | Reflected from the previous +X side. Added lower column, left rack pinion and distinct accelerator/pedal shapes. |
| Brake booster and clutch master | -X / left | Converted with their connecting lines. |
| Air cleaner, side intake, fuel door | -X / left | Converted with the body and engine context. |
| Transaxle | -X / left | New detailed geometry shares the corrected frame with the vehicle. |
| Battery, thermostat/filler | +X / right | Converted with engine, ignition and plumbing. |
| Coolant recovery bottle | +X / right, front | Detailed replacement in the corrected frame. |
| Radiator inlet and return pipes | -X inlet / +X return | Replaced symmetrical hoses with separate routes, then converted the complete circuit. |
| Rear halfshafts | Unequal, differential on left | Replaced the continuous bar with two shafts and boots; converted their hub/differential connections together. |

`vehicle-frame.js` performs one conversion at each model boundary. Existing local corrective transforms are composed before baking so the engine is not accidentally converted twice. Negative determinants are removed from render objects; indexed and nonindexed triangle winding is repaired to agree with surface normals. Canvas lettering retains readable UV parity. Part IDs, material flags, source associations and option visibility remain intact; explosion vectors receive the same coordinate change as their geometry. A guard prevents duplicate conversion.

This conversion preserves all modeled geometric relationships under reflection; it does not validate the exact handedness of unmeasured gear teeth, springs or internal mechanisms. Those profiles remain illustrative. The exterior contours were retained, with their vehicle sides corrected.

The UI identifies US left-hand drive and provides named driver/passenger side views. Automated assertions derive forward from the actual nose and rear-fascia bounds, calculate occupant-left from world up, then check the steering wheel against that physical basis. Tests also check signed bounds, positive transforms, indexed/nonindexed winding, label-map parity and explosion-vector direction. Existing tests that encoded the incorrect positive-X-left assumption were corrected. Camera controls are stacked on narrow screens.

## Modeling limits

- Gear tooth counts, bearing roller/ball types, trapezoidal helical tooth profiles, helix angles and bevel pinion forms are illustrative. The mesh is not suitable for gear manufacture, interference analysis or validating ratios. Shaft spacing is represented as 76 mm; other dimensions are reconstructed.
- Castings are hollow, lobed surfaces with machined seats, flange edges and ribs. They are not scans of original castings. Some dowel/bolt positions and retainer shapes remain approximate.
- Synchronizer hub/sleeve, bearing races/rollers, paired thrust washers, fastener sets and some springs remain grouped selections. Do not equate selection count with physical piece count or full callout coverage.
- Radiator fins, tubes, seams, crimp tabs and tanks are native geometry. Fin count/pitch, tank materials and radiator variants need further verification. Core/tank separation is an inspection view, not an instruction to service crimped assemblies.
- Fan motor and water-pump internals remain incomplete. Fan blade count/profile and motor-support variant remain approximate.
- Main cooling connections are asymmetric and follow factory circuit identity, but exact hose bends, tube lengths, clearance to every component and heater routing are provisional. The 1985 return has no later return-pipe heater tee.
- The full-vehicle model shares the new transmission exterior/clutch/selector and cooling geometry. Hidden transmission gear trains load only in the detail explorer. The existing engine detail remains separate from its coarse whole-vehicle block/head representation.
- Factory-new PBR materials improve surfaces. This increment does not establish a fully photorealistic or specification-complete whole car. No unverified tightening torque, fluid recommendation, repair sequence or fit guarantee was added.

## Verification

See `artifacts/model-audit.json`, the transmission/cooling browser test, and `artifacts/UAT-readiness.md` for actual results. Production build and geometry audit are separate from visual review; successful compilation alone is not visual acceptance.

### Additional specification research

The 1985 DIY printed 3-2 (PDF 59) was inspected again during this increment. Its four-speed table clearly supports final drive 3.65, first 3.31, second 1.95, third 1.24 and reverse 3.42. The final digit in the fourth-gear row is damaged in this scan; no fourth-gear value was added to the app from that scan. The ratios are not used to claim that the illustrative gear teeth reproduce a functioning exact-ratio gearbox. The current GM public Vehicle Information Kits index was also checked; it had no Fiero match, so it did not supply additional factory CAD or dimensions.

### Cabin details that must not be blindly mirrored

The 1985 Pontiac brochure, page 4, shows the speedometer left of the tachometer, the turn-signal stalk left of the column, and the HVAC controls above the radio. The final cabin correction restores these internal arrangements after relocating the whole cockpit. The existing generic `1 3 R` marking on top of the shift knob is removed: it was not a verified four-speed factory legend or location. A correct console shift-pattern plate remains a separate fidelity task. The online 1985 owner's PDF download returned a damaged zero-page document in both PyMuPDF and pypdf; it was not treated as inspected evidence.

Options → Cabin uses a 60-degree inspection field of view so the instruments, stalk and pedals can be viewed together. Exterior/detail framing returns to 37 degrees; saved vehicle camera state includes its field of view. The final cabin/exterior replay completed without page exceptions, and both captures were visually reviewed. This improves inspection access, not the dimensional fidelity of the remaining simplified cabin geometry.
