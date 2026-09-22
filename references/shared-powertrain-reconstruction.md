# Shared powertrain geometry — September 22, 2026

The earlier whole-car engine used a separate coarse block/head/intake plus nonuniformly scaled ignition, thermostat and exhaust details. That made the installed dimensions disagree with their component explorers. The replacement uses the engine explorer's exterior surfaces, one translation into the car and one final US-LHD conversion. Circular parts retain their profiles and dimensions.

## Original GM evidence inspected

[Chevrolet Power Service Manual, 60-degree V6 chapter](https://fieroinfo.com/manuals/Chevrolet_60V6_Power_Manual.pdf), locally archived as `chevrolet-60v6-power.pdf`: PDF 3 / printed 3-2 describes production-family dimensions and early/late distinctions. PDF 6 / printed 3-5, figure 11 is the nominal engine blueprint, visually inspected at enlarged resolution. It gives a 224 mm block deck height and 44 mm bank offset; cylinder spacing is 111.8 mm. The odd-numbered bank is toward the pulley end relative to the even bank. The previous 26 mm total offset, with opposite sign, was a reconstruction error.

This is a mixed-year, production/performance chapter. Its racing modifications, later aluminum heads, different journals and other variants are not assigned to the original Fiero indiscriminately. The figure does not establish a Fiero installed mount position, complete L44 casting surface, intake shape or repair procedure.

## Implementation and limits

The block deck planes and bore termination use the nominal deck height. The head/cover stack is repositioned along each bank axis, with revised head base geometry; head castings, chambers and the remaining valve train fits still require detailed verification. Engine, ignition and upper service assemblies share those relationships. The flywheel now uses one builder in both engine and clutch explorers, replacing two incompatible profiles; sharing does not verify its reconstructed tooth profile.

The transaxle is placed with a rigid rotation about the differential datum. The reconstruction keeps the differential at the existing halfshaft axes and aligns the engine flywheel with the clutch/input axis. The selected installation angle is a packaging reconstruction, not a dimension read from the blueprint. No body panels were reshaped to hide an oversized engine. Manifold outlets, alternator placement and the rear thermostat hose connection derive from the shared engine placement.

The geometry audit compares installed engine vertices with the same detailed parts after a translation, verifies the two deck planes and bank stagger, checks selected connections and samples the closed-deck clearance. It does not certify all mounts, cradle clearances, motion, fuel/vacuum/engine harness routing, internal fits, exact casting geometry or removability. These requirements stay open in the acceptance ledger.

## Internal timing-drive datum still pending

Figure 11 also dimensions the camshaft center 159.03 mm above the crankshaft center. The current timing builder still places the shaft, bearings and cam sprocket at Y=1.181 m against crank Y=1.050 m: a reconstructed 131 mm separation. This internal discrepancy is outside the selected shared-exterior audit and must be corrected coherently with the chain, cover, lifters and pushrod interfaces before engine dimensional acceptance. The cam lobe phases, timing-sprocket tooth counts and chain pitch likewise remain unverified. A passing shared-vertex comparison does not close these internal requirements.

The independent `scripts/audit-engine-timing.mjs` now reproduces the discrepancy from actual mesh shaft-end circles, rather than reading construction constants. Its current report fails and is included in the acceptance gate. Manufacturer replacement-gear research is recorded separately in `timing-replacement-followup.json`; it does not establish the original fitted timing set.
