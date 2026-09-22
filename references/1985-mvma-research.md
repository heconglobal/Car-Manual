# Pontiac 1985 nominal specifications — research worksheet

Source: Pontiac Motor Division, General Motors, *Motor Vehicle Specifications, Passenger Car, Fiero, 1985*, issued September 1, 1984. The cover identifies 1985 even though the archive filename says 1985–86.

- Local scan: `1985-86-specifications.pdf` (35 PDF pages).
- [Archive download](https://www.boomtastic.com/files/?serve_file=Service+Manuals%2C+Guides%2C+and+Tips%2FMotor+Vehicle+Specifcations%2F1985-86+Pontiac+Fiero.PDF).
- PDF page = printed page + 2, except cover/index pages.
- These are manufacturer nominal design specifications, not measured surfaces or a service procedure. A source value does not certify the reconstructed geometry. Empty cells are not silently filled from the adjacent engine column.

## Verified transcriptions relevant to this model

| Printed / PDF page | Application | Specification |
|---|---|---|
| 2 / 4 | L44, SE optional / GT standard | M17 four-speed; final drive 3.65; 140 bhp at 5,200 rpm; 170 lb-ft at 3,600 rpm; compression 8.46:1 |
| 3 / 5 | L44 | Bore 89.0 mm; stroke 76.0 mm; bore spacing 111.8 mm; cast-iron block and heads; block deck height 224.0 mm |
| 3 / 5 | L44 | Firing order 1–2–3–4–5–6; bank labels use a view from the drive-takeoff end (must be translated into vehicle coordinates, not copied as driver/passenger) |
| 5 / 7 | L44 A/C column | Five-blade plastic electric fan, 415 mm diameter, 150 W, plastic shroud; radiator thickness 34.0 mm, width 500 mm |
| 5 / 7 | L44 heater-only column | Seven-blade plastic electric fan, 385 mm diameter, 96 W, unshrouded; radiator thickness 23.5 mm, width 430 mm |
| 5 / 7 | Cooling | Cap relief pressure 103.4 kPa / 15 psi; table gives 13.0 L / 13.8 qt for heater and A/C, but cross-check application/capacity against owner/service manuals before repair guidance |
| 8 / 10 | L44 four-speed | Forward ratios 3.31, 1.95, 1.24, 0.81; reverse 3.42; synchronized forward gears; 2.8 L stated lubricant capacity |
| 8 / 10 | L44 clutch | Borg & Beck dry single disc; facing part number 14087220; OD 232.0 mm, ID 155.0 mm; assembled facing thickness 7.5–8.0 mm; 36 facing rivets per plate; 6,230 N pressure-plate load |
| 9 / 11 | 3.65 final drive | 23 pinion teeth and 84 ring-gear teeth (84/23 = 3.65217 nominal). Does not establish individual transmission-speed gear tooth counts |
| 10 / 12 | Manual shafts | Solid bars, 27.2 mm diameter; left length 313.0 mm, right 725.0 mm; page footnote defines joint-center/attachment-center length, so do not use as exposed straight-bar length without checking the drawing |
| 10 / 12 | CV joints | Saginaw inner tri-pot, outer Rzeppa; two shafts, snap-ring attachment |
| 11 / 13 | Suspension | Front jounce/rebound 64/96 mm, rear 62/120 mm; 23.0 mm front stabilizer; no rear stabilizer; 25.0 mm shock/strut piston diameter |
| 11 / 13 | WS6 nominal spring rates | Front 36.5 N/mm (208.1 lb/in); rear 44.0 N/mm (250.8 lb/in). Does not identify the owner's installed spring codes |
| 12 / 14 | Brakes | Solid iron discs, 247.0 mm outer working diameter both axles; nominal rotor thickness front 11.0 mm, rear 12.6 mm; caliper bores front 49.0 mm, rear 48.0 mm; master bore 25.4 mm; pedal ratio 4.0:1 |
| 13 / 15 | SE 2PF37 standard | P195/70R14, 14×6 aluminum wheel, 35 mm offset; 5×100 mm bolt circle; five M12×1.5 studs/nuts |
| 13 / 15 | GT 2PC37 standard | P215/60R14, 14×6 aluminum wheel, 35 mm offset; same bolt pattern/thread |
| 14 / 16 | Steering | Manual Saginaw rack and pinion; 368.0 mm steering-wheel rim diameter; optional tilt; 3.0 turns stop-to-stop; 22:1 stated gear ratio (cross-check option application before assigning WS6 ratio) |
| 15 / 17 | Wiper / horns | 18-inch blades; electric washer pump; two electric vibrator horns |
| 16 / 18 | L44 battery | Delco Remy Freedom II 75-60 base, 500 A at 0°F; UA1 75A-60, 630 A; 12 V; right front engine compartment |
| 16 / 18 | Alternator | 66 A standard, 94 A optional; integral regulator; 2.78:1 alternator-to-crank ratio. Does not establish installed alternator stampings |
| 16 / 18 | L44 ignition identities | Remote Delco Remy coil 1115314; distributor 1103633 (nominal original application, not a physical inspection of this car) |
| 20 / 22 | Coupe / SE | Wheelbase 2,373 mm, width 1,752 mm, length 4,082 mm; front/rear overhang 924/783 mm; front/rear track 1,468/1,492 mm |
| 20 / 22 | Body reference | Height 1,192 mm at stated design load (2 front occupants, no cargo); cowl 832 mm; deck 875 mm; rocker front/rear 168/171 mm; upper structure length 1,518 mm |
| 21 / 23 | Cabin | Steering-wheel angle 16.5°; seat back angle 26.5°; nominal seat design H-point travel 199 mm |
| 24 / 26 | Lamps, curb mass | Headlamp bulb center height 709 mm, lateral offset 511 mm; taillamp bulb center height 716 mm, outer lateral offset 678 mm; front/rear marker heights 555/655 mm; front/rear directional offsets 500/538 mm |

## Conflicts, ambiguities and intentionally excluded entries

- Cooling radiator height reads `38.2` with no sufficient local unit clarification; do not publish as 38.2 mm or assume a missing zero.
- Rear WS6 **wheel rate** prints `95.1 (257.7)`; those units are inconsistent. The separate spring-rate row is internally consistent. Do not propagate the wheel-rate value.
- The ignition spark-plug rows appear populated only in the L4 column. Do not transfer the printed R43TSX / .060-inch / 15–25 lb-ft values to the V6. The 1985 DIY V6 instructions specify R42CTS, .045 inch and 11 lb-ft; service-context verification remains required.
- Rotor OD is labeled **outer working diameter**, not an engineering drawing of total rotor casting OD. Do not rescale the whole hub to that value.
- Shaft lengths carry a joint-center footnote. They are not proof that exposed shaft stock must be that long.
- Source includes obvious printing/conversion errors elsewhere. Cross-check any value used in repair instructions.
- The source does not provide full body loft sections, casting tooling, harness branch lengths, motor gear profiles, all part internals, installed option codes, or licensing permission to redistribute scans.

## Model discrepancies identified for correction

- Current headlight bulb/lens center is at approximately Y=.753 m and |X|=.515 m; nominal source is .709 m and .511 m. Correct the bucket/cover/linkage coherently; preserve the fitted closed hood surface and test clearances in both poses.
- Current detailed engine repeats .105 m bore pitch; nominal source is .1118 m. Move matching cylinder, valve-train, ports and ignition endpoints together, not only pistons.
- Current final-drive visual teeth are 72/20; manufacturer source supports 84/23. Individual speed gear counts remain unverified.
- Current clutch friction outside diameter is approximately 218 mm; L44 nominal is 232 mm. Correct matching pressure surface and facing ID/stack together.
- Existing 1985 gauge face is a simplified two-dial placeholder. The owner's manual PDF32 (printed2C-1) shows the oil-pressure gauge within the tachometer, temperature above fuel in the center, and warning columns flanking those center gauges.

## Implemented selected-datum pass

Cylinder pitch is now111.8 mm in matching engine geometry; bank/cylinder labels identify the physical original layout. A shared, explicitly reconstructed13 mm bank offset aligns each piston with its bore; that offset is not a factory measurement. Ray checks confirm bore centering. Flat ring sections replace the prior torus rings that exceeded the bore envelope; section sizes remain illustrative, not specified service fits.

The final-drive visual tooth count is now84/23 and the clutch facing uses232/155 mm nominal diameters. Tooth pitch/profile/helix, individual speed-gear counts and clutch carrier/rivet details remain unmeasured. Raised headlamp datums are709 mm height and511 mm lateral offset; the bucket, cover and constant-length link reconstruction are separately documented in `headlight-reconstruction.md`.
