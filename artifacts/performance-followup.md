# Startup performance follow-up

Source `b2019702353965532ff3dcd7d8016da9555acf341514d85704bcced93b67718c`. This is diagnosis, not performance acceptance.

- Native Windows Edge / Intel UHD Direct3D11 reached initial readiness in approximately 97 seconds during concurrent software regression. The limited three-image session completed; a later all-family attempt was interrupted.
- A separate Node probe spent approximately 83 seconds constructing the car before any browser layout or GPU rendering. Canvas drawing was stubbed.
- The CPU-sampled repeat took approximately 97 seconds. Its call tree includes engine construction, powertrain, brakes, wiring and headlights, alongside geometry copying, normal transforms, handedness conversion and garbage collection. Sampling and concurrent work affect these timings; the two runs are not a controlled comparison.

The model constructs all vehicle geometry synchronously at startup. Reducing shader cost alone cannot remove the measured construction delay. Potential changes require preserving all options, selection IDs, handedness, geometry and detail-view consistency; no model simplification or caching change is accepted by this report.

Evidence: [construction timing](vehicle-construction-profile.json), [CPU hotspots](model-construction-hotspots.json), [raw CPU profile](model-construction.cpuprofile), [native session](native-windows-review-initial.json).
