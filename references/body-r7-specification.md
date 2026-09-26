# Body R7 — 1985 SE shape specification and evidence limits

Target: US 1985 Pontiac Fiero SE, early bumper-pad fascias and notchback lamps. GT/aero fascias and 1987–88 coupe ends are excluded. The owner rejected R6’s shallow rear lower section and sharp upper lamp corners. This specification separates published dimensions from reconstructed surfaces; passing an envelope audit is not approval of the body shape.

## Source hierarchy

1. [1985 Pontiac MVMA, PDF 22–23](1985-86-specifications.pdf#page=22), coupe column, issued 1 September 1984: dimensions and load conditions. [PDF 26](1985-86-specifications.pdf#page=26): curb-load bulb datums. [PDF 31](1985-86-specifications.pdf#page=31): definitions.
2. [1985 Pontiac brochure, PDF 3](1985-fiero-brochure.pdf#page=3): original SE exterior and panel relationships. [GM lamp illustration 2P02-002](fiero-parts-cd.pdf#page=72) and [1985 DIY 2-25](1985-fiero-diy.pdf#page=34): lamp construction.
3. [Pontiac Performance Plus, printed 46 / PDF 37](pontiac-super-duty-guide-r7.pdf#page=37), copyright 1983 Pontiac Motor Division: explicitly captioned **production Fiero** packaging profile and production-car side photograph. Its neighboring race-car drawings, widened tracks, wings and lowered ride heights are not used. This is an adjacent-year production profile, not a dimensioned 1985 SE tooling drawing. [Public original scan](https://spad.dy.fi/fiero/manuals/Pontiac_Fiero-HotrodSD4guide.pdf#page=37).
4. Owner photographs and opened original lamp photographs corroborate visible contours. Perspective, lens distortion, terrain and suspension condition preclude treating their pixels as millimeter measurements.

## Confirmed dimensional constraints

All dimensions below are millimeters. Ground-related body dimensions use the MVMA manufacturer design load: two front occupants and no cargo. Optical heights in the separate source table use curb mass; the existing load-height interpolation remains an estimate.

| Constraint | Published target | Model treatment |
| --- | ---: | --- |
| Wheelbase | 2373 | Fixed axle stations |
| Length / body width / solid-roof height | 4082 / 1752 / 1192 | Actual mesh envelope; width excludes mirrors and marker lamps |
| Front / rear overhang | 924 / 785 | Actual extremities relative to axle stations |
| Cowl / deck reference heights | 832 / 875 | Lower daylight-opening reference points, not arbitrary skin maxima |
| Upper structure length | 1518 | Cowl-to-deck reference distance |
| Front / rear rocker bottom | 168 / 171 | Actual rocker surfaces |
| Closed-door bottom | 245 | Actual painted door bottom |
| Body width at front seating reference | 1751 | Cross-section through door skins |
| Outside tail / rear directional lateral centers | 678 / 538 | Actual bulb geometry, each side |
| Outside tail height at curb mass | 716 | Retained as source value; design-load conversion explicitly estimated |
| Front / rear bumper ground reference | 315 / 333 | **Unresolved measurement-surface interpretation**, retained separately from fascia minima |

### Correction to the R5/R6 claim

R5 forced the entire painted front/rear fascia minima to H102/H104 and advertised 18 verified dimensions. The definition says bumper, including standard bumper guards; it does not identify a Fiero surface in a dimensioned section. That equation was not established. R7 withdraws those two passes. The report retains the published numbers and the modeled fascia minima as unresolved comparisons, rather than moving a test point or widening a tolerance to manufacture agreement. Sixteen other dimension comparisons remain independently testable. No claim is made that H102/H104 have now been resolved.

## Surface specification and current reconstruction controls

| Region | Required visible form | R7 control / evidence status |
| --- | --- | --- |
| Rear fascia | Painted lower apron below the two black pads; tucked under-return; curved ends continuous with quarters | Lowest authored edge 245 mm, 88 mm below R6; section rolls through 270/305/333 mm before the impact face, with 43 mm outlet-clearance scallops centered 510 mm either side of the centerline. Reconstruction, not published tooling. |
| Front fascia / fender lower ends | Lower painted return distinct from impact pads, continuous into fenders | Authored edge 270 mm, 45 mm below R6; retained nose/axle/length anchors. Reconstruction. |
| Rear lamp covers | Soft upper corners, tighter lower corners, tapered outboard edge; clear cover over independent optics | Upper outboard radius 34 mm, upper inboard 22 mm, lower 7 mm; R6 used 10 mm uniformly. These are curve controls, not measured factory radii. |
| Lamp apertures | Same rounded perimeter as covers, no painted triangles across visible optics | Shared profile and clipped/reprojected fascia mesh; actual ray checks. |
| Hood / headlamp doors | Separate flush panels, preserved cowl and front-overhang anchors | Existing shared hood/lid coordinates retained; local crown and gaps remain unmeasured. |
| Doors / rockers / quarters | Continuous lower silhouette and molding; fixed wheel openings and sill heights | Both rear quarter tails follow the lowered fascia; front fender tails follow the front return. Door width/height anchors retained. |
| Roof / A-posts / rear clip / sail panels | Continuous roof crown, recessed backlight, notchback buttresses | Checked against production profile and 1985 brochure; measured slopes and radii unavailable. No new exactness claim. |
| Decklid / vents | Low rear deck with separate grilles and 1985 raised forward center | Retains deck reference and shared attachment surfaces. Exact crown/vent tooling remains open. |
| Exterior trim / lamps / handles / mirrors | Attached to shared skin coordinates with independent selectable parts | Retained shared builders; hidden mounts and production gaps remain open. |

The deeper apron initially intersected the existing exhaust heat shields. Their reconstructed placement moves 50 mm forward, and the outlet scallops retain space above the twin pipes. This is an interface correction, not a factory exhaust-location measurement.

R7 also stops clear outer tail covers from casting opaque shadow maps onto their inner lenses. The complete-vehicle shadow frustum is limited to the car scene rather than extending 500 meters; this addresses rendering artifacts, not physical dimensions.

## Acceptance conditions

- Confirmed envelope, axle and reference-point dimensions remain within numerical sampling tolerances. These tolerances are not manufacturing tolerances.
- Rear skirt must visibly extend below both pads in straight rear and quarter views, with no holes at the lower sample points and continuous quarter joins.
- Both lamp upper ends must have visibly rounded transitions; cover and fascia aperture must agree without paint occluding optics.
- The complete vehicle, neutral-material body, lamp detail and separated lamp must be inspected after the final source changes. A browser assertion alone cannot certify these shapes.
- H102/H104 physical surfaces, complete panel/tooling sections, original optical properties, panel gaps and owner visual acceptance remain open until supported. Exact factory replication cannot be certified from the presently obtained documents.

Final run identifiers, inspected captures and deviations are recorded in the current development report after visual iteration.

## Completed development verification

Final source: `c1c7f63300ab74f4b9ea21fcfec6b9332ddaf397e432890f18639a8cff35dfbc`. The production build, four targeted body/clearance audits and three targeted browser scenarios pass. Sixteen published dimension comparisons and 16 rear-body groups pass; the two bumper references remain unresolved. Fifteen final renders were opened and inspected. The interrupted full aggregate is excluded, and browser coverage is 3/39. [Run notes](../artifacts/browser-verification-notes.md), [visual findings](../artifacts/visual-review-findings.md), [targeted geometry](../artifacts/body-geometry-verification.json), and [source changes](../artifacts/body-r7-source-review-20260924T225915Z.patch). The live viewer was confirmed to serve BODY R7. These results do not close factory surface or owner acceptance.
