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


## September 22 shared powertrain inspection

Source `b2019702353965532ff3dcd7d8016da9555acf341514d85704bcced93b67718c`; capture session 09:03–09:05 UTC. `shared-powertrain-whole-car.png` retains the accepted exterior shape. `shared-powertrain-installed.png` shows the common engine surfaces inside the transparent vehicle context. `shared-powertrain-engine.png` shows 320 selections and the revised engine stack; the previously protruding exhaust valve hardware is no longer visible through the assembled covers. `shared-powertrain-engine-exploded.png` retains the nested breakdown and separate accessory pulley/belt. All four were inspected directly; the current inspection manifest records their hashes.

These remain reconstructed castings, ports, leads and hardware. The views are not a complete photorealistic or dimensionally certified engine. The separate geometry audit checks shared vertices, deck planes, stagger and selected fits; it does not cover every internal contact, removal path or production mount.

## September 22 body and brake inspection

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

## September 23 electrical expansion — intermediate visual review

The 179-part intermediate source `dc6681ff885384fb820baf2a02970a3ba95bdb7cb5e2b4850c1f5d9ebc193773` was inspected in LH relay explosion, isolation-relay assembly and motor explosion. Relay shells, coils, contact carriers, blades, connectors and separate conductors rendered; no runtime errors occurred in that targeted scenario. The isolation relay looked too small because its full-width harness dominated framing. The final source separates long output branches from the close relay scope. Final-source captures require review after the new regression run; this intermediate review does not certify them.

September 23 intermediate source `8d27d7eee756` body/brake captures inspected: driver-door explosion, rear-clip explosion, front-caliper assembly and rear-caliper explosion. No geometry-storage regression is visible in those views. The same simplified casting faces and incomplete door mechanisms remain; the optimization preserves these surfaces rather than certifying them. The current manifest records only captures opened on the current source. Historical matching images/manifests are under `visual-inspection-history/`.

## Corrected terminal close-up — September 23

Current source `267f7ce33b674db06a91c3ae15cb71ee195ef8e058968119cb0bd117a4f00c23`. Native Windows Edge / Intel UHD Direct3D11 captured 13 vehicle/headlight states with no application exceptions. Four were opened and inspected: LH relay assembled/exploded, isolated coil and isolated connector contacts. The corrected crimp spine eliminates the visibly detached support wings found in the intermediate hardware review. Original terminal tooling remains reconstructed. The current visual manifest records these four final-source captures; earlier inspected captures are archived by source.

The remaining nine `267f7ce33b67` native captures were subsequently opened: complete vehicle, relay/harness assembled and exploded, RH actuator relay assembled and exploded, isolation relay assembled and exploded, and C/D power branches assembled and exploded. All 13 native captures are now recorded in the current manifest. The full harness keeps spatial context but makes small terminals and fusible-link splices too small for detailed inspection; nested scopes and individual focus are required. The isolated relay scopes visibly improve framing. Painted panel, wheel, optical lens and original relay tooling accuracy remain open.

The final-source archived headlight/guide batch passed both scenarios. The refreshed motor explosion, isolation-relay explosion, C/D explosion, mobile cushion inspector, guide disconnect and full-page mobile guide captures were opened and recorded. The guide isolates the open single-cavity connector shell at step 2; terminal and lead selections remain separate. Its mobile final step shows the reconnection sequence and source link without horizontal overflow. The cushion screenshot is scrolled to the inspector and does not show the 3D cushion simultaneously. Full relay/harness explosions need individual focus to inspect their smallest parts; these views do not validate every fit or workshop removal path.

Current `267f7ce33b67` body/brake batch captures inspected: assembled decklid, driver-door explosion, assembled front caliper and master-cylinder explosion. Curved painted skin, separate vents/hinges and hydraulic/retainer groups remain visible after indexed merging. Front-caliper casting faces are still simplified, and the door view still lacks complete regulator, latch and mirror internals. These outstanding geometry requirements have not been closed.

Current electrical batch captures inspected: assembled 1985 cluster and exploded ECM enclosure. Original-layout instrument faces and the separate ECM case, calibration cover, connector shells and screw set remain accessible. The software-rendered cluster lens remains cloudy, and the ECM board is a simplified substrate rather than a populated original circuit-board reconstruction. Instrument movements, complete PCB components and original connector tooling remain acceptance gaps.

Current HVAC and engine-service captures inspected: blower explosion, C60 heater-case explosion, water-pump explosion and isolated thermostat. Their separate housings, core/wheel, seals and fastener groups survive the geometry-storage change. The blower and water pump still lack complete motor/impeller/bearing/seal internals; molded and cast profiles remain reconstructed. Thermostat replacement-envelope dimensions are explicitly distinguished from original factory-installed dimensions in the inspector. These inspections do not close checklist 06.3, 13.1 or 14.1–14.3.

Current exhaust/fuel batch captures inspected: crossover assembly, early converter cutaway, tank cutaway and sender explosion. Distinct native shells, straps, pipe/shield groups, float, sender, seal and pump parts remain rendered after indexing. The tank view has no complete internal baffle construction, the pump is not internally exploded, and converter/pipe profiles remain reconstructed. Sender resistance/travel and all original component interfaces remain uncalibrated.

Current running-gear captures inspected: exploded steering rack, input-shaft/synchronizer group, complete coolant circuit and front-facing cabin controls. Separate gear/bearing/rack hardware remains visible; the steering wheel and pedals are on vehicle-left (viewer-right from the front). This confirms those displayed controls, not every component throughout the vehicle. Original gear profiles, rack ratio, casting contours, calibrated travel and complete hose/pipe routing remain open.

The final software-rendered whole-vehicle overview was inspected after its workshop scenario passed. The closed lamp covers and accepted SE exterior outline remain intact. Glazing, wheel detail and shadow appearance differ from the bounded native hardware captures; neither view establishes final photoreal surface acceptance.

The final current-source mobile explorer capture was opened after its scenario passed. The 390 px layout fits the 3D stage, camera controls and component inspector without horizontal overflow. Air-cleaner geometry remains illustrative and nearby ghosted geometry is dense. The manifest now records 39 explicitly inspected current-source captures, including the 13 native Windows hardware captures. These are sampled development views, not inspection of every physical part or a full device-performance review. All 31 browser scenarios have eligible passing results; the concurrent rear-body timeout and unchanged isolated rerun are retained in the execution notes.
