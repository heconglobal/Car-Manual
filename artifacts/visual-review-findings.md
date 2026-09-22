# Visual review findings — September 22, 2026

This is a development review, not final visual acceptance. The software-renderer captures below were inspected directly. A clear exploded view does not establish a measured production surface.

| Earlier capture inspected (2e64d5ce13c4) | Observation | Remaining requirement |
| --- | --- | --- |
| `headlight-left-assembled.png` | The sealed lamp, bezel, independent cover and fixed mounting structure are visible as distinct geometry. | Original optical tooling, molded profiles and calibrated door contact remain unverified. |
| `headlight-motor-exploded.png` | Case halves, gear/cushion group, shaft, armature, field shell and hand knob separate coherently. | Exact gear tooth counts, contact shapes, winding construction and case dimensions remain open. |
| `body-hood-assembled.png` | Curved painted skin and open lamp apertures are retained. | Measured skin sections, inner reinforcement and edge/gap dimensions remain open. |
| `brakes-front-caliper-assembled.png` | Piston housing, bridge and pad areas are distinguishable. | The casting still has simplified rectilinear faces; this does not meet the final photorealistic casting criterion. |
| `fuel-tank-assembled.png` | Long early tank, stepped top, perimeter seam and retaining straps are visible. | Tank stamping contours, baffles and sender clearance remain reconstructed. |
| `exhaust-complete-assembled.png` | Manifold, crossover, converter, shields and rear silencer form a continuous layout. | Production bends, muffler internals and installed heat/body clearances remain unverified. |
| `wiring-cluster-assembled.png` | Early speedometer/tachometer arrangement and inset oil scale are present. | Glazing appearance, exact markings/tooling, movement geometry and all electrical paths require further verification. |
| `hvac-c41-assembled.png` | Heater, blower and duct branches are separate inspectable objects. | Molded case and duct contours, mounting datums and door travel remain approximate. |

The eight table captures were inspected again after being refreshed by the full regression begun at approximately 2026-09-22T06:54:52Z against source `2e64d5ce13c48fabccadb6af0d09da1f041fea81f7b88f267f7791e2e9ad6029`. The [inspection manifest](visual-inspection-manifest.json) records their hashes and capture times. Browser-run completion is tracked separately; these visual observations do not imply that the run has passed. The current `engine-mobile.png` was also inspected: its controls fit the narrow viewport, while the assembly is small within the visible scene.

The engine assembled/exploded and battery/charging/lamp captures were refreshed and inspected on source 2e64d5ce13c4. They now form historical evidence, with available matching images archived under `visual-inspection-history/2e64d5ce13c4/`. The older `service-complete-engine.png` remains historical.

No requirement is marked complete by this document. Full surface accuracy, movement, routing, procedures and the complete parts inventory remain governed by `REMAINING-WORK.md`.

The earlier cross-view scale defect prompted the shared powertrain correction described below. Its resolution is evaluated by vertex comparisons and geometry checks, separately from screenshots.

The refreshed headlamp guide captures were inspected after its full-suite scenario passed: `headlamp-procedure-spring.png` shows the isolated native aiming spring with the active factory step, and `headlamp-procedure-mobile.png` shows the final reconnect order, tools, navigation and source link without horizontal overflow. The mobile capture starts at the top of the document, avoiding the earlier scrolled sticky-tab screenshot. This confirms presentation of those captured states, not physical removal paths.

Browser capability probes used default headless, X11/EGL and an explicit D3D12 request. They returned SwiftShader or llvmpipe, with successful simple-pixel output and no native hardware renderer. These probes do not establish the host lacks a GPU; they establish that the tested Linux browser paths used software rendering. Hardware appearance and performance remain unverified. See `hardware-probe.json` and `hardware-d3d12-probe.json`.

Additional current-suite captures inspected: `transmission-assembled.png` shows a lobed case, ribs, selector and clutch-end construction. Its nearly uniform ribs and extruded end contours remain visibly simplified; exact casting profiles and fits need further work; `cooling-complete-circuit.png` shows separate front/rear circuits and the asymmetric early pipe routing, whose production bends and complete interfaces remain approximate; `suspension-front-assembled.png` shows distinct coils, shocks, arms, rack, damper and stabilizer hardware, with unverified stamping forms, hard points and full-travel clearance. None establishes factory-dimensional acceptance.


## Additional historical capture inspection

The refreshed 2e64d5ce13c4 engine captures show 319 selections, with coherent assembled/exploded views; castings and routing still look reconstructed. Battery, starter and alternator shapes are distinguishable, but the starter nose/mounting block and generator bracket/casting forms are visibly simplified. The rear lamp has separate red/clear chambers and a modeled optical grid; its actual tooling and optics remain unverified. These captures predate the shared powertrain changes and are not current-source acceptance. The inspection manifest records their hashes.


## Current shared powertrain inspection

Source `b2019702353965532ff3dcd7d8016da9555acf341514d85704bcced93b67718c`; capture session 09:03–09:05 UTC. `shared-powertrain-whole-car.png` retains the accepted exterior shape. `shared-powertrain-installed.png` shows the common engine surfaces inside the transparent vehicle context. `shared-powertrain-engine.png` shows 320 selections and the revised engine stack; the previously protruding exhaust valve hardware is no longer visible through the assembled covers. `shared-powertrain-engine-exploded.png` retains the nested breakdown and separate accessory pulley/belt. All four were inspected directly; the current inspection manifest records their hashes.

These remain reconstructed castings, ports, leads and hardware. The views are not a complete photorealistic or dimensionally certified engine. The separate geometry audit checks shared vertices, deck planes, stagger and selected fits; it does not cover every internal contact, removal path or production mount.

## Current body and brake inspection

Source `b2019702353965532ff3dcd7d8016da9555acf341514d85704bcced93b67718c`. The current regression refreshed the inspected decklid, driver-door exploded, body mobile, front-caliper assembled, rear-caliper exploded and master-cylinder exploded captures. The manifest records each exact image.

The decklid retains curved skin and separate vents/hinges/torque rods. Its inner stampings, gaps and production hardware positions are not measured. The door separates skin, glass, trim and hinges, but still lacks the complete regulator/lock/mirror internals. The mobile body inspector fits the narrow viewport; that scrolled capture does not demonstrate simultaneous visibility of the model.

The front caliper has visibly simplified, nearly rectangular casting faces. The rear caliper separates pads, piston, seals, parking lever and selected hardware, but small pieces are hard to inspect at the full-explosion framing. The master cylinder shows a separate reservoir, diaphragm, grommets, cylinder and piston/spring groups. These are usable construction views, not final photorealistic castings or proof of complete internal fits.

## Native Windows GPU inspection

The dedicated Windows Edge test profile successfully used Intel UHD Graphics through ANGLE Direct3D11, with hardware WebGL and GPU compositing enabled. The initial session (09:25:52–09:27:47 UTC, same `b2019702353965532ff3dcd7d8016da9555acf341514d85704bcced93b67718c` source) captured the vehicle and engine at 65% and 100% explosion without browser exceptions. All three images were inspected directly. The engine 65% capture is not an assembled view. Their hashes are in the inspection manifest, and the original session is preserved in `native-windows-review-initial.json`.

The hardware path retains physical glazing and body highlights; it does not resolve the reconstructed wheel/casting/trim surfaces. Small engine hardware remains crowded at full-engine framing. Initial readiness took approximately 97 seconds during a concurrent software regression; that is an observed slow load, not an isolated performance benchmark or an acceptable performance certification.

The follow-up all-family capture process exited with code 143 before a completion report. It is recorded as interrupted in `native-windows-all-families-interrupted.json`; no all-family GPU pass is claimed. This supersedes the earlier blanket statement that hardware appearance had not been inspected, while leaving broad hardware/device performance and visual acceptance open.

The current-source `engine-mobile.png` was inspected after its scenario passed. The timing assembly and controls fit the narrow viewport without horizontal overflow. Individual small pieces require focus/zoom; full-explosion framing does not provide a detailed view of every piece at once.

Current-source exhaust and instrument views were inspected after their scenarios refreshed the captures. The shared manifold/crossover joins now form the intended assembled route, while pipe bends and shield stampings remain reconstructed. The instrument cluster retains the early face layout and inset oil-pressure scale, but the software glazing remains visually cloudy and small markings need closer inspection. These are explicit visual limitations, not factory-accuracy passes.

Current-source headlight close-ups were inspected: the LH assembled lamp, early motor explosion and closed cover. The lamp has a convex lens, reflector and separate bezel; the optical relief remains a uniform reconstruction rather than the original asymmetric tooling. The motor's case/armature/gears/cushions are distinguishable, but case radii, gear geometry and pigtail colors still need refinement. The closed cover retains a curved painted skin. None of these images verifies production mechanism hard points or contact throughout movement.

The RH assembled/exploded headlight captures and mobile cushion inspector were also inspected on the current source. The RH motor and main lamp separate into their scopes. The mobile inspector fits and shows the documented limits; its scrolled screenshot contains the inspector rather than the 3D viewport.

The refreshed mobile ICM capture shows the selected module and its source-linked EST table without horizontal overflow. Connector forms and original distributor variant remain unverified. The water-pump explosion shows the revised inlet, housing, pulley, gasket and attachment sets; the impeller, bearing and seal breakdown is still absent. The assembled C41 heater view shows separate blower/case/ducts, whose molded profiles and internal mechanisms remain approximate.

The current b20197023539 headlamp guide captures were inspected after scenario 17 passed. The isolated aiming spring corresponds to the active factory step. The full-page mobile view includes the 3D viewport, final reconnect sequence, tools, navigation and source link without horizontal overflow. Removal paths and physical workshop validation remain open.

Current b20197023539 suspension, rack, transaxle, clutch, coolant-circuit and front-facing LHD captures were inspected directly. The rack separates boots, ties, bearings and mounts, with small hardware requiring closer focus. The suspension stampings and transaxle case remain visibly simplified; the latter has uniform extruded lobes/ribs rather than a verified production casting. The clutch facing and release mechanism remain distinct. Cooling connections follow the revised powertrain positions, while bends/supports remain reconstructed. The steering wheel and pedals appear on the vehicle-left side (viewer-right from the front), as intended. These captured states do not validate full travel, every interface or exact castings.

Current valve-gear assembled/exploded and isolated rocker captures were inspected. The separate spring, retainer, keeper, stem seal, stud/nut, pushrod and lifter are accessible, with the smallest hardware needing focus. The rocker is an open stamped-channel reconstruction; its exact pressed contour/contact geometry and operating interfaces remain unverified. The separate engine-timing mesh audit now reproduces the 131.000 mm cam/crank separation and fails against the 159.03 mm nominal. Passing valve-gear navigation does not resolve that defect.

The final current-source mobile explorer capture was inspected after all 31 browser scenarios passed. At 390 px width, the selected air-filter group, camera buttons, explorer links and full inspector fit without horizontal overflow. The filter/canister remain simplified illustrative geometry, and adjacent ghosted geometry is visually dense. This is layout verification, not photorealistic or physical-device performance acceptance.
