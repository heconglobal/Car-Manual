# Body R5 — factory specification review

**Historical record, superseded in R7:** The equation of H102/H104 with the complete painted fascia minimum was not established. Those two dimensional passes are withdrawn; see [R7 specification](body-r7-specification.md). The remaining text records the earlier interpretation, not current acceptance.

The owner asked to continue the entire body and explicitly required published model specifications, not only owner photographs. The dimensional authority is Pontiac Motor Division's 1985 MVMA form, issued 1 September 1984. Use the **2-door coupe / SE** column; the longer GT bumper dimensions do not apply to the modeled bumper-pad SE.

## Sources reopened

- [Pontiac MVMA scan](1985-86-specifications.pdf): PDF 22 (printed 20), coupe/SE envelope, overhangs, heights and bumper ground clearances; PDF 23, seating/upper-body opening and luggage references; PDF 26, curb-mass lamp centers; PDF 31, dimension definitions. New page renders are retained under `artifacts/body-specification-review-r5/`; the earlier high-resolution dimension and definition renders remain under `artifacts/body-specification-review-20260924/`.
- [1985 Pontiac brochure](1985-fiero-brochure.pdf), PDF 3: the SE body, stock panel relationships and bumper-pad appearance; PDF 6: model/option table and dimensions. [Public archive copy](https://xr793.com/wp-content/uploads/2018/10/1985-Pontiac-Fiero-Cdn.pdf). The GT photographs on PDF 2 do not supply the SE's fascia geometry.
- Owner photographs remain a secondary check of visible form and the described car's configuration. They do not override a documented model dimension or supply hidden tooling coordinates.

## Dimensional authority and load states

| Item | Published reference | Treatment |
| --- | --- | --- |
| Wheelbase | 2373 mm | Axle stations stay fixed. |
| Overall length / width | 4082 / 1752 mm | Actual-mesh envelope, not just constants. Mirrors and marker lamps excluded from width as defined. |
| Front / rear overhang | 924 / 785 mm | Outer body/trim extremities measured relative to axles. |
| Solid-roof height | 1192 mm | Design load: two front occupants, no cargo. |
| Cowl / deck point heights | 832 / 875 mm | Lower centerline daylight-opening references, not the bumper top or rear edge of the decklid. |
| Upper structure length | 1518 mm | Longitudinal cowl-to-deck reference. |
| Rocker front / rear / closed-door bottom | 168 / 171 / 245 mm | Kept separate from fascia bottoms. |
| Front / rear bumper ground clearance | 315 / 333 mm | R5 applies these to the minimum visible bumper-fascia envelope; the front air deflector is a separate piece. |
| Front / rear bumper at curb mass | 341 / 343 mm | Separate source load condition. |
| Front / rear marker at curb mass | 555 / 655 mm | Separate from design-load body heights. |
| Highest outside tail bulb at curb mass | 716 mm height, 678 mm lateral offset | Lamp optical center, not total lens bounding box. |
| Front / rear direction-indicator offsets | 500 / 538 mm | Absolute lateral bulb-center positions. |

The brochure's whole-millimeter width differs from the MVMA envelope by 1 mm; the MVMA's explicitly defined W103 1752 mm is retained. No average or GT width/length is substituted.

For the design-load rendering, R5 explicitly estimates the curb-to-design height difference by interpolating the **26 mm front / 10 mm rear** bumper-height differences along the car. This is a reconstructed static-pitch approximation, **not** published suspension kinematics or an exact lamp height at design load. The source curb figures remain intact. Horizontal lamp offsets are independent of that approximation. The existing retracting-headlamp curb-height convention is separate and must not be described as a complete vehicle load simulation.

## Geometry changes and interpretation

R4's lower fascia surfaces extended below the source bumper ground heights. R5 raises those surfaces and blends the adjacent fender/quarter lower edges into them while preserving wheel openings and sill/door references. The rear pad, plate and license-light arrangement follows the revised rear section. Curved corner turns begin farther inboard, reducing the slab-like rear corners.

The rear lamp strip and side moldings move toward the source lamp datums; door handles and their recesses follow the molding rather than remaining at the earlier low arbitrary height. Panel lands beneath these fittings are recessed so they fit within the specified width. The rear deck/quarter crown becomes shallower toward the tail, with attached vents and rack/wing mounting surfaces following the same function. Those connecting curves and recess depths are reconstructions informed by the factory brochure and owner references, not factory loft measurements.

Full glass slope angles, fascia tooling sections, panel radii and every panel gap are not supplied by these MVMA tables. The diagrams illustrating dimension definitions are generic and are not traced as Fiero body blueprints. Published luggage liftover height refers to the trimmed luggage-opening edge, not the exterior lid surface; it is not used to force an unrelated panel height.

Final geometry results are recorded below; completed browser coverage and inspected captures are linked from the current UAT review. The entire body remains a reconstruction pending further dimensional and visual acceptance; specification rows alone do not establish an exact factory replica.

## Why the earlier envelope checks missed this

Sampling the preserved R4 fascia bottom edge gives 245.0 mm at the front and 272.1 mm at the rear. The earlier 16-row audit did not include H102/H104, so the overall length/width/height could pass while both fascia bottoms sat too low. R5's actual fascia minima are 315/333 mm and the audit now has 18 rows. The rear-corner shape and the interpolation into the quarter remain reconstructed; the new check adds a published constraint rather than certifying the complete surface.

The expanded lamp audit also measures the actual glass-envelope center of each modeled bulb. It separately records direct lateral datums and heights after the explicitly estimated load conversion. Factory brochure PDF5 and the retained GM parts diagrams were reopened for panel and fitting relationships; they do not supply numerical surface sections. The online lookup did not yield an accessible model-specific panel-gap table, so no unsourced gap tolerance was adopted.

## Plate and license-light refinement after visual inspection

The first R5 render exposed a separate fitting defect: the planar plate graphic intersected a backing that followed the fascia curvature. The backing is now planar, inside a real opening in the sculpted recess. Nine ray samples across the plate check that neither the backing nor the fascia hides its face. The license-light housings sit farther behind the upper recess edge; a vertex-based check prevents those housings from protruding through the painted bridge. The Pontiac lettering follows the local bridge slope so the plane is not sliced by the fascia. These are mesh/interface corrections, not newly discovered factory plate-bracket dimensions.

The expanded rear-body audit now has ten groups, 24 lens-order samples and 12 lamp-datum rows (six direct lateral measurements and six heights after the explicitly approximate load conversion).

## Completed final geometry verification

Final application snapshot: `8ad735976842d215e6ed1f8376c8da89e3361c38223d6a94fafc39fa4472b19a`. All 15 geometry audit groups completed successfully on this snapshot. The actual mesh passes all 18 selected body-dimension rows, including 4082 mm overall length, 1752.089 mm sampled width, 1192 mm solid-roof height, 924/785 mm overhangs and 315/333 mm fascia ground clearances. These software comparison tolerances are not manufacturing tolerances. The ten rear-body groups pass, including 24 optical-order samples, nine plate-visibility rays, housing concealment and 12 lamp-datum rows. The production build completed, and the source served at port 5185 includes the final plate/recess correction. Browser coverage and individually inspected captures are reported separately in the current UAT evidence.

A [source diff against the preserved R4 baseline](../artifacts/body-r5-source-review-20260924T213236Z.patch) retains the application and audit changes for direct review. Original source, reports and captures remain under timestamped preservation directories.

Final browser verification completed five targeted scenarios out of the current 38; 33 were not refreshed. The interrupted two-scenario batch does not count, and its body/lighting scenarios subsequently completed separately. Eighteen final captures were opened and their hashes checked. See [browser notes](../artifacts/browser-verification-notes.md), [visual findings](../artifacts/visual-review-findings.md) and [current review](../artifacts/current-UAT.md). Full-body shape and all-items acceptance remain open.
