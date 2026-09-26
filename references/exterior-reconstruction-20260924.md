# Exterior reconstruction — 24 September 2026

A subsequent [sunroof hardware revision](sunroof-reconstruction-20260924.md) expands Body to 169 selections and the exterior catalog to 58. Counts and test results below describe the earlier exterior snapshot.

This revision follows the owner's rejection of the body appearance. Earlier notes describing the outer contours as accepted are superseded by this review. The target remains a factory-new 1985 SE notchback with bumper-pad fascias, native mesh geometry and US left-hand drive.

The four owner photographs at `/home/hesh913/.codex/tmp/IMG_5459.jpg` through `IMG_5462.jpg` were reopened and compared with the current model. The original 1985 Canadian brochure PDF page 3 and GM parts CD PDF 237, 281, 284, 288, 300, 330–332 and 336, plus P22 PDF 309 were rendered and inspected locally. New renders are retained in `artifacts/exterior-reference-20260924/`. Catalog drawings establish component relationships and application distinctions, not production surface coordinates. The pictures' weathering, decorative graphics and registration are not copied into runtime assets.

## Coverage of exterior surfaces

| Area | Revised construction |
| --- | --- |
| Front hood and headlamp doors | Shared curved hood/headlamp datum retained; hood perimeter now has finite edge returns. Existing separately explorable early headlamp assemblies remain in Electrical. |
| Front fascia | Rolled fascia with closed, raised bumper pads, open park-lamp apertures, ribbed wrap molding, plate pocket, lower deflector and separate nose crest. |
| Front fenders | Wheel openings split at their spring points; circular lips and inward returns replace the jagged cutoff. Separate moldings stop at the existing side markers. |
| Door skins and rockers | Reduced excessive skin bulge, edge and sill returns; handle aligned with rub strip and finger recess below. Separate key bezel, belt seal, mirror shell, glass/carrier and pedestal. |
| Rear quarters | Circular fuel-door opening and recessed intake aperture, independently selectable fuel door/pocket/hinge and open grille vanes; revised wheel lips and separate moldings. The filler cap is recessed behind the door. |
| Roof, pillars and sail appliques | Existing formed roof and notchback sails retained as distinct panels; sunroof glass and aperture seal now select separately. Recessed rear-glass opening enlarged vertically to match the photographs more closely. |
| Rear deck and vents | Raised-center lid and open side vent grilles retained; front/rear lid returns added. Carrier and pedestal wing are independent option selections instead of being merged into the decklid skin. |
| Rear fascia | Raised split pads with inset openings, separate molding and plate pocket, rear identification lettering. Existing rear lamps and license lights remain separate electrical assemblies. |
| Windshield and other exterior equipment | Separate parked arms and 18-inch-envelope blade/refill assemblies, open cowl grille/nozzles, passenger-side antenna mast and base. |

The Body explorer has 153 selections, including 42 newly separated exterior selections. The same builder supplies the car and detail explorer, preventing mismatched surfaces between views. Existing IDs remain available. Optional equipment does not establish the owner's original build configuration.

## Geometry findings

The first render exposed two defects that numeric catalog checks missed: large triangles used to wrap the new pads intersected the curved fascia, and the pre-existing fuel-cap grip protruded through its exterior door. Pad surfaces are now subdivided before wrapping. The cap, seal, filler-mouth and mounting pieces are moved inward together, retaining the existing lower filler hose endpoints. The pocket is open around the neck rather than a solid disk obstructing it.

`scripts/audit-exterior.mjs` checks independently owned finite meshes, exact shared skin vertices, unobstructed quarter openings, wheel-opening clearance, recessed mirror glass, front lamp apertures, blade envelope and option ownership. Visual evidence and browser results are recorded separately; a geometry pass does not prove visual accuracy.

## Open requirements

All local sections, mirror tooling, panel gaps, hinge locations, attachment lengths and fascia radii remain reconstructed. Full roof drains/latch construction, hidden wiper mechanisms, mirror adjusters, calibrated door/glass travel, every concealed panel retainer, exact original emblems, structural stampings and measured factory alignment remain open. Existing lighting lenses still require optical-tooling verification. No body repair procedure, spring selection, structural specification or final owner acceptance is inferred from this pass.

Source-link review also caught the different pagination of the two GM scans: the carrier is CD PDF 332 / P22 PDF 331; the wing reference is P22 PDF 309. Roof-glass and seal entries now link to CD PDF 330, and the antenna to its actual fixed-mast drawing at CD PDF 281. The filler-cap bounding boxes have 7.2 mm conservative separation from the reconstructed door after the correction; this is a mesh observation, not a specified production clearance.

Removing the old round arch-edge tubes also narrowed the painted-skin envelope. The wheel flare was recalibrated to the documented 1,752 mm body width while leaving the door-seam crown unchanged; an actual-mesh envelope assertion now guards that datum. The mobile scenario reopens the assembly drawer after entering a detail scope, then selects the intake through the visible UI. No hidden-element click is forced.

The exploded layout separates mirror housings, glass and pedestals rather than moving them as one stack. Fuel door/pocket, arm/blade and roof/deck options also have distinct offsets. Those offsets illustrate construction and do not prescribe service removal paths.

## Final verification scope

The production build, all 13 geometry audit groups (including 12 exterior mesh checks), and 99 local PDF-page links pass. Seven affected browser scenarios pass in completed reports: three exterior scenarios, complete body hardware, two configuration scenarios and independent rear-body parts. The other 29 scenarios remain unverified on this revision. Twenty-one current captures were opened and reviewed; their hashes are saved in the visual manifest. Native Windows hardware rendering has not been refreshed. These checks support this reconstruction, not factory dimensional certification or owner acceptance.
