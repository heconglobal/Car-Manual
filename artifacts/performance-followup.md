# Startup performance follow-up

Source `b2019702353965532ff3dcd7d8016da9555acf341514d85704bcced93b67718c`. This is diagnosis, not performance acceptance.

- Native Windows Edge / Intel UHD Direct3D11 reached initial readiness in approximately 97 seconds during concurrent software regression. The limited three-image session completed; a later all-family attempt was interrupted.
- A separate Node probe spent approximately 83 seconds constructing the car before any browser layout or GPU rendering. Canvas drawing was stubbed.
- The CPU-sampled repeat took approximately 97 seconds. Its call tree includes engine construction, powertrain, brakes, wiring and headlights, alongside geometry copying, normal transforms, handedness conversion and garbage collection. Sampling and concurrent work affect these timings; the two runs are not a controlled comparison.

The model constructs all vehicle geometry synchronously at startup. Reducing shader cost alone cannot remove the measured construction delay. Potential changes require preserving all options, selection IDs, handedness, geometry and detail-view consistency; no model simplification or caching change is accepted by this report.

Evidence: [construction timing](vehicle-construction-profile.json), [CPU hotspots](model-construction-hotspots.json), [raw CPU profile](model-construction.cpuprofile), [native session](native-windows-review-initial.json).

## September 23 indexed-geometry comparison

The complete current vehicle was constructed in two temporary copies, changing only the merge algorithm. Every mesh’s expanded triangle position/normal/UV hash, material bucket, part/option identity and triangle count matched. Indexed storage retained 8,501,856 vertices instead of 15,567,469, a 45.39% reduction, with the same 5,416,283 triangles. This does not simplify surfaces or remove detail.

Sequential Node samples observed 57.9 seconds for indexed construction versus 87.1 seconds for the former expansion algorithm. Peak process RSS was about 908 MiB versus 1,246 MiB. Canvas was stubbed and browser regression was running concurrently; these are observations, not an isolated benchmark or a promised device speedup. Browser startup and rendering still need performance work. See [exact comparison and limits](indexed-geometry-comparison.json).

The final crimp correction was compared again on source `267f7ce33b674db06a91c3ae15cb71ee195ef8e058968119cb0bd117a4f00c23` after pausing regression and finishing the native capture. Both algorithms produce identical expanded mesh hashes and 5,416,475 triangles. Indexed storage uses 8,502,240 vertices versus 15,568,045 (45.39% fewer). Construction samples were 25.6 versus 29.9 seconds; peak RSS about 906 versus 1,252 MiB. The different workload makes these timings unsuitable for direct comparison with the earlier concurrent samples. Native Edge captured the corrected vehicle/headlight views with no application exceptions; see [hardware report](native-windows-headlight-review.json).
