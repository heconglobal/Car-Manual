# Vehicle/detail dimensional consistency — September 22, 2026

The earlier defect was real: the vehicle scaled ignition, thermostat and manifolds by different amounts on each axis and used separate coarse block/head/intake surfaces. That turned a 111.8 mm cylinder pitch into 178.88 mm in the installed ignition.

The current implementation removes those transforms and duplicate castings. `vehicle-engine.js` draws exterior parts from `createEngineDetail`; `powertrain-layout.js` defines unit-scale engine and transaxle placements. Manifolds, generator and flywheel are shared with their respective explorers. The final US-LHD conversion is applied once.

See [reconstruction and factory-source limits](shared-powertrain-reconstruction.md). The [geometry audit](../artifacts/cross-view-scale-review.json) reports its exact source fingerprint, vertex comparisons and selected alignment/clearance results. A previous pass does not certify a subsequently edited source.

This closes the implementation strategy that distorted parts between views, subject to the current audit passing. It does not close acceptance requirement 06.4: complete small hardware, actual mounting datums, all internal fits, cradle interfaces and full travel remain incomplete. The chosen installation angle is reconstructed, not read from a Fiero factory mount drawing.
