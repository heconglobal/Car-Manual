# Early L44 exhaust reconstruction

Target: original 1985 Fiero SE 2M6, four-speed, US LHD. Native procedural geometry is shared between the exhaust explorer and assembled vehicle. The two manifolds also share their surfaces with the engine explorer. No source images are shipped as component stand-ins.

## Primary references inspected

- GM 22P catalog, CD PDF 122–123: 1985–88 L44 exploded plate and year/application rows. The early 1985–86 converter (25127001), separate front pipe (14101400), and muffler with intermediate pipe (14105910) are distinguished from later combinations. Tailpipe saddle clamps are listed at 50.8 mm; converter outlet clamp at 60.32 mm. These are catalog nominal applications, not measured tube-wall dimensions.
- 1986 Pontiac service PDF 705–709, printed 6F-1 through 6F-5: transverse muffler, single-bed pellet converter construction, spring-loaded front-pipe joint, crossover shields, three-spring muffler support arrangements and flexible tailpipe hangers. This is explicitly adjacent-year evidence, supported for the early converter/muffler identities by the catalog's 1985–86 rows.
- The catalog distinguishes 1985 W69 black tailpipes and WU2 bright stainless tailpipes. Both finish previews are exposed. The accepted larger bright tips are retained by default; VIN/owner description does not independently establish their precise original shape or finish.

Source URLs:
- https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=122
- https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=705

## Implemented

44 selectable parts/sets: two manifolds with individual port flanges/common collectors, gasket and fastener sets; crossover, two shields, shield and flange fasteners, seal, joint bolts/springs and early front pipe; eight catalyst cutaway sets plus shields/clamps/fasteners; transverse muffler, intermediate pipe, independent tailpipes, saddle clamps, flexible hangers, fascia shields, support brackets and left/right spring sets.

Driver-end crossover, passenger-side intermediate pipe and separate outlets use the common baked LHD frame. The simplified pipe previously bypassing the converter has been replaced by the early arrangement. The model now has open flange bores and the lower converter shell has a fill-plug aperture. The converter's pellet bed is a grouped visual sample; pellet count/size, insulation thickness and support perforations are not calibrated.

## Remaining limits

Local manifold/flange profiles, exhaust bends, welded junction interiors, precise hanger attachment points, hot-system clearances and original wall thicknesses are unmeasured. The early converter is internally illustrated using the adjacent-year service section; it is not a certified reconstruction of every production detail. Muffler internal baffles remain grouped rather than supplying invented chamber dimensions. The engine itself still uses reconstructed casting geometry and an approximate shared placement transform. Whole-vehicle accessory/structure interfaces need further clearance work.

Welded shell and welded intermediate-pipe separation are illustrative cutaways, not repair operations. No removal sequence, spring handling instruction, tightening torque or emissions modification procedure is published. The current model represents the original arrangement; later recall-related shield changes require separate configuration evidence.

## Verification

Geometry audit checks all 44 IDs, finite vertices, picking metadata and scope membership; driver crossover/passenger intermediate routing; separate tailpipes and support springs; pellet-bed inventory and vertical order. Desktop/mobile screenshots and interaction results are recorded in `artifacts/UAT-readiness.md`. Geometry and interaction checks do not certify measured factory accuracy.
