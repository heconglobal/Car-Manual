# Body R8 — complete exterior review

**Work paused at the owner’s request after the BODY R8 update.** Current results and unfinished verification are recorded in [the pause record](../artifacts/r8-user-pause.json). Further work awaits the owner’s next instruction.

Vehicle scope: owner-described 1985 Pontiac Fiero SE 2M6, notchback, non-aero front/rear fascias, US left-hand drive, WS6 and 14-inch Hi-Tech wheels. The body and Body explorer share native geometry. Roof and deck equipment remain selectable previews.

## Dimensional authority

Use the locally preserved Pontiac **1985–86 MVMA specification**, issued September 1, 1984, PDF pages 22–23 for coupe/SE body dimensions and page 26 for lamp datums. Page 31 defines measurement references. The **1985 Pontiac Fiero brochure**, PDF page 3, establishes the production SE appearance, including the non-aero nose, separate bumper pads, notchback pillars and Hi-Tech wheels. Its option table is on page 6. The production packaging profile in **Pontiac Performance Plus**, PDF page 37 / printed page 46, supports the overall silhouette; adjacent racing-car photographs do not establish production panel contours.

| Reference | Nominal |
|---|---:|
| Wheelbase | 2373 mm |
| Coupe/SE length | 4082 mm |
| Body width, excluding mirrors | 1752 mm |
| Solid-roof height | 1192 mm |
| Front / rear overhang | 924 / 785 mm |
| Front / rear track | 1468 / 1492 mm |
| Cowl height | 832 mm |
| Deck reference height | 875 mm |
| Upper-structure reference length | 1518 mm |
| Front / rear rocker bottom | 168 / 171 mm |
| Closed painted door bottom | 245 mm |

Design-load dimensions refer to the manufacturer's specified loading. Curb-load lamp heights use the explicitly documented estimated static-pitch conversion in `src/body-datums.js`. The 315 / 333 mm published bumper ground references remain unresolved as to the corresponding modeled surface; they are not silently reassigned to a convenient pad vertex. The painted front / rear apron minima remain reconstructed at 270 / 245 mm, with rear exhaust scallops.

Numerical agreement with these reference dimensions does **not** establish exact factory panel tooling, production tolerances or owner approval. No factory surface loft or calibrated complete panel scan has been obtained.

## Exterior pass and intended form

| Region | R8 inspection / correction |
|---|---|
| Front nose and bumper ends | Preserve the non-aero wedge, curved impact face, separate black pads and recessed park/turn wells around the smaller amber lenses. Their height and opening dimensions are photo-guided; the 500 mm bulb offset remains the published datum. Refit the wraparound molding across its entire ribbed section. Correct the nose extremity after fitting the trim. |
| Lower nose | Put the flexible deflector below and behind the apron return instead of inside the painted fascia. |
| Hood and pop-up covers | Retain matching crowned hood/door surfaces, actual apertures and separate raised/closed covers; seat the nose crest on its curved panel. Densify hood seam sampling and inspect the front close view. |
| Both front fenders | Retain rolled shoulders, circular wheel openings and inward lips; refit the molding on the real curved skin. |
| Both doors | Preserve dimensional door bottoms and upper shoulder, handles, key cylinders and window wiping seals. Molding cross sections now follow the skin at every height; recessed jamb backing closes bright sightlines through the door gaps. |
| Both rear quarters | Remove the molding-height kink introduced by the body correction. Cut the fuel and intake apertures to their boundaries instead of removing whole grid triangles. |
| Driver quarter intake | Move the opening below the protective molding; keep its grille recessed with a continuous strip above it. |
| Rockers | Retain rolled outer faces, tucked returns and documented front/rear ground datums. |
| Windshield, roof and side glass | Inspect the A-post, roof shoulders, sunroof frame and glass interfaces in a close roof view. Match the roof return and pillar crown to one shared boundary and retain the sourced height/cowl anchors. |
| Sail appliques and rear pillars | Retain the opaque framed triangles and broad painted notchback pillars. Reduce the metallic-looking sail reflections so their actual borders remain readable. |
| Rear window | Retain the recessed glass, painted header/reveals and separate optional defroster. |
| Decklid and ventilation | Retain the 1985 raised centre and real grille openings. Recess the outer deck seam slightly below the skin. Fit carrier supports and wing pedestals to the actual foil undersides, and check plain, carrier and wing configurations. |
| Rear fascia and apron | Retain the deeper R7 apron, matching quarter ends, underturned edge, exhaust clearance, separate tall pads and recessed plate pocket. |
| Rear lamps | Retain R7 softened upper corners and layered original-assembly construction. Reduce the clear-cover opacity/reflection and improve red/reverse insert visibility. |
| Mirrors, wipers, antenna and badges | Inspect both mirror shells/glass/pedestals, parked nominal 18-inch blades, cowl nozzles, passenger antenna and identification pieces. Fine badge artwork remains illustrative. |
| Wheels and tires | Use a less reflective machined finish and planar spoke faces. Seat the sidewall rings on the tire profile; replace raised tread blocks with a continuous crown and recessed grooves, retaining the road-tire envelope. |
| Finish and viewing | Reduce paint glare and retain multisample antialiasing in the software render target so thin seams remain readable. |

## Review evidence

Current results are recorded after final geometry and browser checks in `artifacts/body-geometry-verification.json`, `artifacts/exterior-fit-audit.json`, the source-stamped browser history and `artifacts/visual-inspection-manifest.json`. Screenshots from intermediate sources are archived and do not count as final review evidence.

The new exterior-fit audit casts rays against actual trim and paint meshes at 78 positions, checks molding straightness, tests nine intake sightlines and measures the road-tire tread envelope. It also checks the carrier and wing support contacts on the real surfaces. These protect the corrected interfaces; they are not factory manufacturing-tolerance tests.

Owner photographs remain a second visual source, with uncalibrated cameras and lighting. The original lamp-assembly photographs and GM parts illustrations establish construction rather than dimensional tooling. See [R7 source and lamp details](body-r7-specification.md) for provenance and original-page references.
