# Interior I1 — 1985 Fiero SE 2M6 reconstruction

This pass replaces the generic cabin with early Fiero bucket seats, door fittings, dashboard, manual console and removable trim. The grey cloth configuration with headrest speakers is the working showroom reference. The owner's original trim/RPO label has not been supplied. Tan cloth and equipment controls remain previews, not an assertion of this car's original build.

## Primary evidence inspected

- Pontiac's **1985 Fiero Canadian brochure, PDF 4**: the large photograph explicitly identifies the SE interior. It establishes two-tone cloth, the integrated headrest, fabric speaker areas, three-spoke wheel, vertical end outlets, passenger map pocket, console proportions and angled door pull. The detailed shifter photograph is the four-cylinder five-speed; its shift pattern was not copied into this V6 four-speed model. [Local scan](1985-fiero-brochure.pdf#page=4), [Pontiac catalog mirror](https://www.carsandracingstuff.com/library/p/pontiac_85pontiac.php).
- **GM/Pontiac 22P parts catalog, PDF 289–290**: instrument panel and 1984–85 applications; **293–295**: early console and attachments; **346–347**: early door/quarter trim; **350–351**: seats, belts, floor trim, with explicit 1985 seat-pad, pan and stereo applications. [Local GM scan](fiero-parts-cd.pdf). Callouts identify assemblies; subdivision into foam, wires, magnets, springs or individual fasteners is not automatically a separate GM service callout.
- The later **348–349** quarter-trim drawing and **352–355** later-seat/lumbar drawings were checked to avoid putting 1986–88 sail speakers or 1988 lumbar equipment in the 1985 cabin.
- **1985 Pontiac MVMA, PDF 23** supplies the cabin values below. [Local specification scan](1985-86-specifications.pdf#page=23). PDF 25 identifies front fiducials with front-seat adjuster mounting points; its base-grid/load definitions still require reconciliation before any seat-fastener coordinate can be claimed as verified.
- An original-car sales photo provides an independent colour/shape comparison: [1985 SE listing](https://classiccars.com/listings/view/1465199/1985-pontiac-fiero-for-sale-in-morgantown-pennsylvania-19543), [saved cabin photo](1985-se-seat-photo-i1.jpg). This listed car is four-cylinder; only the shared SE upholstery and visible cabin trim inform the reconstruction. Its drivetrain and installed equipment are not proof of this V6's build. The separately downloaded `1985-se-interior-photo-i1.jpg` shows an engine bay despite its filename and was excluded from cabin comparisons.

## Published cabin specifications

| GM/SAE code | Published nominal | Application and limitation |
| --- | ---: | --- |
| L31 | 1,152 mm | Seating reference X coordinate aft of base grid; shared exterior datum already retained |
| H61 | 941 mm | Effective head room; an occupant-envelope measurement, not cushion-to-roof distance |
| L34 | 1,105 mm | Maximum effective accelerator leg room; not a straight pedal/seat distance |
| H30 | 159 mm | Seating reference to heel; requires an SAE occupant reference, not the visible cloth surface |
| L17 | 199 mm | Design H-point front travel; no calibrated slide animation is claimed |
| W3 | 1,395 mm | Shoulder room; not outer door-shell width |
| W5 | 1,380 mm | Hip room; not combined seat-cushion width |
| H50 | 1,081 mm | Upper body opening to ground, per source definition |
| H18 | 16.5° | Steering-wheel angle |
| L40 | 26.5° | Design back angle; it is not a dimensioned foam/tooling section |

Neither the specification sheet nor the parts diagram supplies a three-dimensional seat-foam loft, cloth cutting pattern, recliner tooth form or complete interior fastener bill. Local radii, profiles, attachment coordinates and unspecified quantities are reconstructed. They must not be labelled exact factory dimensions.

## Component accounting

The Interior family contains 313 selectable records, including hardware sets, option alternatives and links to existing detailed assemblies. This is not 313 unique physical pieces and is not an exhaustive factory BOM.

- **Both seats:** separate cushion pan/back frame, support wires, pads, cloth covers, listing wires and hog-ring sets; inner/outer tracks and sliders; release handle/link wire/spring; recliner, hinge, covers, knob and pins; four floor nuts and four track-to-pan bolts per seat; two speakers per headrest with basket, cone, magnet and leads.
- **Restraints:** retractor assembly, webbing, upper guide/cover, latch plate, buckle/button/stalk, lower cover, warning lead and four anchor attachments per side. Retractor inertia mechanisms and buckle internals remain grouped. This model is not restraint engineering or an installation specification.
- **Dashboard:** upper pad, end trim, open passenger pocket and lip, carrier and lower trim; two elongated speaker assemblies and grilles; shared original-layout instrument pod and HVAC outlets. Open the linked explorers for cluster and duct components.
- **Console/audio:** skeleton, front surround and face plate, four-speed shift surround/plate/boot/retainer/lever/knob/clip, two ashtrays/lids/springs, option controls or blanks, rear padded shell/storage/door/hinge/latch/spring/striker, side vents, lighter/socket/retainer, Delco receiver case/face/knobs/bracket/connectors and attachment screws. The existing ECM and heater-control models are linked, with deeper components accessible in their original explorers.
- **Doors and trim:** shared door skins/retainers, water shields, armrests/brackets, release cups/levers/lock slides, manual cranks/clips or power-window controls, pockets, carpet/underlay/mats, bulkhead carpet, sills/attachments, pillar garnish, roof-dependent headliner, visors/pivots/clips/screws and interior mirror/stem/button.
- **Driver controls:** three-spoke wheel, horn/contact/nut, column shrouds, stalk, key cylinder, hazard switch and shroud fasteners; clutch/accelerator parts; links to existing brake-pedal and parking-brake components. Full column collapse/tilt mechanisms, calibrated pedal travel and all switch internals remain outstanding.

Seat hinge pins illustrate peened/riveted construction. Hog rings and several small attachment patterns are named reconstructed sets. Exploding these records does not imply a factory-approved remove/reuse sequence. Adhesive and welded joints are described rather than represented as invented removable fasteners.

## Review and acceptance

[Open the side-by-side Interior review](http://localhost:5185/interior-review.html). The main manual exposes the same native geometry through **Interior & controls → Seats → Explode this assembly** and the Interior subassembly list. Review supports assembled and exploded views and grey/tan comparisons against the local factory photograph and drawings.

Software checks cover finite geometry, selectable ownership, shared vehicle/explorer meshes, static packaging, visibility variants and browser interactions. Visual review addresses the saved views only. Original tooling, complete hidden hardware, calibrated movement, original trim code, physical service validation and owner appearance acceptance remain open. The exterior retains revision R12; its prior acceptance evidence is historical unless refreshed against this source.

## Enlarged callout reconciliation

The 313-record inventory includes an additional 28 small fitting records identified during enlarged reading of the early applications: seat hinge bushes/stereo branches, door armrest hanger plates/nuts/plugs and crank bearing plates, lower windshield garnish, console carpet supports/clips, shift gasket/retainers, storage strap, lighter plate/bulb, dashboard U-nuts, column filler and optional rear-defogger control. Earlier development callout transcription errors were corrected against enlarged PDF 290/294/347/351.

The [145-callout reconciliation](interior-i1-callout-reconciliation.csv) accounts for each numbered item in the four inspected drawings as a native selection/parent assembly, an existing/shared component, a year-excluded application or an explicit open item. Open items include concealed wiring, seals/retainers, quarter-pressure valve and optional mechanisms; no claim is made that every factory rivet or clip is now individually modeled. [Full selectable inventory](interior-i1-parts-inventory.csv).

## Final fit correction

Rear close-ups exposed frame tips and foam-edge artifacts through the cloth. The frame was recessed 12 mm, the speaker recess backs were given the seat-back slope, and the cushion insert was terminated at the backrest junction. The new rear-cloth ray check rejects the saved pre-correction mesh. The corrected sample covers 1,046 frame/foam vertices with a minimum 9.98 mm reconstructed concealment margin. All four speaker magnets clear their recess backs. These margins describe this model, not GM production tolerances. [Before/after fit results](../artifacts/interior-i1-fit-comparison.json).

The console explorer includes its radio subtree and shared centre vent. The cabin camera now keeps the instrument, lighting and HVAC controls opaque when Interior is selected. The final record count is 313, including shared contexts and option alternatives.
