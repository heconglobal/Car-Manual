# Geometry provenance — visual review 0.2

The geometry is a reconstruction from factory illustrations. It is **not factory CAD, a scan, or a fully dimensioned engineering model**. No field measurements of this specific car are available. More polygons and reflective materials do not change that status.

| Area | Evidence used | Current status |
| --- | --- | --- |
| 1985 SE / V6 identity | NHTSA vPIC VIN response | Identity confirmed; VIN does not list the full RPO build |
| Manual transmission / WS6 | Owner information; period configuration chart | Owner-confirmed configuration |
| Axle spacing | Factory DIY printed 3-2: 2,373 mm | Centers placed at Z ±1.1865 m |
| Track spacing | Same page: SE front 1,468 mm, rear 1,492 mm | Wheel centers at X ±0.734 / ±0.746 m |
| Vehicle envelope | Same page: SE 4,082 × 1,752 × 1,192 mm | Used as body design targets; local contours, mirrors, trim protrusions and seam clearances are reconstructed |
| Nose / roof / rear silhouette | Brochure PDF p.3; DIY printed 3-2 | SE bumper-pad nose and notchback; no later fastback substitution |
| Fascia corners / rear lamp rake / spoiler profiles | GM 22P G-13, G-19, G-10, H-7; brochure pp.2–3 | Rounded fascia lofts, split bumper pads, raked rear lenses, V56 carrier / integral spoiler and lower curved pedestal wing; local radii and airfoil sections remain reconstructed |
| Wheel / tire | DIY printed 3-3; WS6 brochure description | 14-inch wheel and P215/60R14 nominal tire envelope; wheel-face contours and tread are approximate |
| Body joints and attachment points | Exploded factory panel illustration | Separate selectable panels; seam positions and fasteners are not fully validated |
| Rear roof / sail / backlight / engine lid | GM 22P H-8, 1985 brochure, four supplied reference images | Separate small framed appliques ahead of broad painted pillars, smaller recessed glass, raised-center lid and separate vent grilles; contours remain reconstructed. See [rear-body refinement](rear-body-refinement.md) |
| Steel space frame | Factory DIY 1-4 / 1-5 | Formed channel sections, open door apertures, floor pans, tunnel, wheelhouses, strut-tower shoulders and bulkheads reconstructed. No measured alignment points or structural calculations |
| Engine and four-speed transaxle | Factory illustrations and packaging | Reconstructed castings and assembly layout; internals, exact cast dimensions and mounting points unverified |
| Engine component explorer | GM 22P H-19 / H-22 exploded illustrations | 210 selectable parts / sets across ten main and three nested ignition views, including reconstructed internals. Shapes and separation paths are approximate; see [engine explorer coverage](engine-explorer.md) |
| L44 upper plenum | GM 22P H-22 / H-23, item 6 | 1985–86 catalog reference 10033120 added with date and applicability; this does not validate the mesh's local dimensions |
| Pop-up headlamps | Factory DIY 2-28 / 2-29; GM 22P K-17 / K-18 | Rebuilt hinged covers, curved black bezels, recessed sealed-beam reflectors, glass relief and first-generation actuator layout. Lamp envelope, hinge angle, linkage and fastener coordinates are approximate |
| Cabin | Brochure PDF p.4 | Reconstructed instrument pod, buckets, integrated headrests and controls; not measured upholstery or switchgear |
| Routing / suspension | Factory layout illustrations | Orientation geometry; not installation, alignment or removal-path data |
| Paint / interior / accessories | Period choices from Canadian brochure | Preview only; actual paint, trim and unreported equipment unknown |
| Wing / drivetrain alternatives | Period GT and alternative configurations | Appearance / reference entries do not establish compatibility or SE factory installation |

## Changes checked visually in 0.2

- Replaced the primitive body with curved panel surfaces and explicit wheel openings.
- Corrected the hood / nose slope, windshield width, roof headers and triangular quarter-window insets.
- Closed front and rear fascia joins; repositioned the reconstructed engine below the decklid.
- Replaced the solid door-aperture obstruction with an open frame.
- Rebuilt the exposed steel frame with flanged formed sections, broader pillars, stamped floor contours and wheelhouses in place of the earlier round-tube outline. Pressing details and mounting coordinates remain approximate.
- Added integrated-headrest seat contours, detailed wheel faces, lamp lenses, moldings, grille details, exhaust outlets and factory-style materials.
- Preserved the existing 53 assembly IDs and added four front-service records from the factory manual (57 total).
- Corrected the transaxle to the driver side, the V6 accessory drive to the passenger side, and the connected intake / shift cable layout.
- Reviewed the L44 exploded catalog illustrations; corrected longitudinal valve-cover ribs and upper intake runner finish. The castings still need a measured detail pass.
- Replaced the shallow headlamp blocks and opaque silver stripes with rounded lamp openings, chrome reflector bowls and convex glass with fine optical relief. Covers now slope toward their rear hinges; actuator representations stay under the closed hood. This is a visual assembly reconstruction, not a validated mechanism simulation.
- Refined fascia and spoiler contours following the owner's feedback; see [exterior refinement evidence](exterior-refinement.md) for the exact reference pages, geometry changes and remaining limits.

- Refined the roof/pillar/sail boundaries, convex side skins, formed sills, Hi-Tech wheel faces, lower raised headlamps and wing tips; see [roof and side refinement evidence](roof-side-wheel-refinement.md).

## Accuracy acceptance still outstanding

The rear-body revision adds six independently selectable assemblies, bringing the current total to 63. Earlier counts above describe their respective historical passes.

- Independent overlay / silhouette comparison against dimensioned orthographic references.
- Correct high-detail castings, wheel face, dashboard, underbody and all hidden hardware.
- Full accessory equipment and real interchangeability, including brackets, wiring and trim dependencies.
- Mechanical clearance and collision-valid disassembly paths.
- Complete, page-verified service procedures, torque conditions, part numbers and service limits.

This release may be reviewed for interactions and improvements in appearance. **It has not passed the user's requested photorealistic, fully accurate vehicle-and-parts acceptance standard.**

The ignition/control follow-up adds four vehicle entries (67 total). Distributor, coil/HT/primary wiring and sensor/valve reconstruction sources and limits are in [ignition reconstruction](ignition-reconstruction.md). Local source drawings establish arrangement, not dimensional certification.

## 2026-09-21 transmission, cooling and handedness correction

Detailed four-speed and coolant-system geometry and source limits are recorded in `transmission-cooling-reconstruction.md`. The model now has three inspection families with 446 detailed selections in total (315 engine, 95 transmission/clutch, 36 cooling). These are not a complete physical BOM.

**Superseded coordinate assumption:** older notes and assertions that equated +X with vehicle-left were wrong while the nose pointed -Z. The owner correctly identified the mirrored car. Final rendered vehicle and inspection geometry now use -X left/driver, +X right/passenger, -Z front. The original authored curves remain in a legacy frame internally and are converted once at each model boundary. `vehicle-frame.js` bakes the conversion, repairs face winding and label UV parity, and converts explosion offsets. Do not apply another root mirror or infer occupant-left from a legacy source coordinate before the boundary conversion.

This corrects placement and modeled relationships. Original helix angles, spring handedness, exact gear tooth counts, casting shapes and hose bends still need measured or dimensioned references; visual reconstructions are not manufacturing specifications.
