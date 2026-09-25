# Checklist and test coverage

Generated 2026-09-25T01:52:14.578Z. Source `0c1e23dd80f0886b27d6e772e2800d88db8c74418c309c5d59a62a201255d310`.

**0/109 requirements accepted; 37 partial and 72 open.** Current browser regression: 4/40 passing scenarios.

Test scenarios overlap areas. Counts must not be summed as unique tests. Passing browser tests do not establish factory dimensions, physical operation, complete part coverage or owner acceptance.

## 1. Headlights

Selection, all three nested relay explosions, individual terminals, C/D fusible links, cover pose, mobile controls and the guide disconnect are covered. Exact motor internals, production hard points, operating stops, optics and complete circuits are not.

Related test files: [headlights.spec.js](../tests/headlights.spec.js), [service-guides.spec.js](../tests/service-guides.spec.js), [configuration.spec.js](../tests/configuration.spec.js). 0/4 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 01.1 | partial | Owner UAT of the expanded pair, controls and early mechanism is still pending. |
| 01.2 | partial | Measured bucket/cover/motor profiles, production pivots, original gear counts/ratios and complete retainers. |
| 01.3 | partial | Measured production hard points, motor end stops, cover contact and full mechanism interference calibration. |
| 01.4 | partial | Complete verified 1985 circuits, physical connector-end drawings, measured relay/motor tooling, fusible-link lengths, full harness routing, calibrated dimmer linkage, aiming and validated diagnostics. |
| 01.5 | open | Lamp aiming screws, spring seats, bucket bushings, motor bracket welds and connector retainers: reconcile every 1985 drawing callout with a selectable part or named hardware set. |

## 2. Other exterior and interior lighting

Lamp selection, option visibility and assembled/exploded presentation are covered. The focused rear-lamp scenario checks four chambers per side, separate inner optics and clear-cover behavior; the rear geometry audit checks the published bulb datums and reconstructed perimeter fit. Original optical tooling and complete working circuits are not.

Related test files: [electrical.spec.js](../tests/electrical.spec.js), [tail-lamp-review.spec.js](../tests/tail-lamp-review.spec.js). 0/3 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 02.1 | partial | Measured housings, original optical tooling, dimensions, seals and final visual acceptance. |
| 02.2 | partial | Dimensioned factory lens/housing/optical tooling, measured seal and mounting interfaces, original electrical validation and owner appearance acceptance. |
| 02.3 | partial | Full instrument illumination, original option identities, exact dimensions and circuit routing. |
| 02.4 | open | Optical prism/flute geometry, lens lettering, reflector plating and bulb-filament/support geometry; establish original lens and socket variants before accepting appearance. |

## 3. Battery, starting and charging

Battery/starter/alternator selection and breakdown are covered. Original casting dimensions, exact drive teeth, full cables and live electrical operation are not.

Related test files: [electrical.spec.js](../tests/electrical.spec.js). 0/2 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 03.1 | partial | Measured battery/tray geometry, original appearance, complete cable routes and interface validation. |
| 03.2 | partial | Installed original stamping, exact drive tooth count, casting forms, fits and mounting coordinates. |
| 03.3 | partial | Original 66/94 A application, correct fan revision, measured castings and belt alignment/routing. |
| 03.4 | open | Starter overrunning clutch, shift fork, solenoid contact disc, brush springs and thrust hardware; distinguish complete service units from individually inspectable internals. |
| 03.5 | open | Alternator diode/heat-sink connections, slip rings, insulators, bearing retainers and brush leads; battery cell/plate construction and cable terminal boots. |

## 4. Vehicle wiring, switches and instruments

Fuse/ECM/cluster selection, the EST terminal table and mobile navigation are covered. Complete harness topology and pin-by-pin circuit operation are not.

Related test files: [electrical.spec.js](../tests/electrical.spec.js). 0/2 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 04.1 | partial | Complete harness branch lengths, actual terminal population, grommets/clips, full pinouts and measured connector forms. The ECM has a simplified board substrate; its original populated board, component identities and complete internal connections remain unverified. |
| 04.2 | partial | Fusible links, ignition/brake/reverse/clutch switches, horn units and complete validated circuits. |
| 04.3 | partial | Measured instrument forms, complete movements/circuit boards, exact 1985 pinouts and electrical operation. |
| 04.4 | open | ECM board, calibration module, connector keying and individual terminals; fuse-panel bus bars, splices, grounds and strain relief through every bulkhead. |
| 04.5 | open | Horn diaphragm/contact mechanism, horn relay and steering-wheel contact; ignition/turn/hazard/dimmer switch contacts, cancellation mechanism and column wiring. |

## 5. Ignition and engine controls

Module, coil, distributor and ignition-part selection/explosion are covered. Exact variant geometry and every wire route remain unverified.

Related test files: [ignition.spec.js](../tests/ignition.spec.js). 0/2 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 05.1 | open | Verify the installed distributor variant, pickup/module/coil shapes and exact retaining hardware. |
| 05.2 | partial | Exact HT cap clocking/routing, separators and complete primary wiring/grounds. |
| 05.3 | open | Complete sensor mounting details, vacuum routing and emissions-label configuration; validate tune-up and diagnostic content. |
| 05.4 | open | Distributor shaft bushings/end play, reluctor/pickup relationship, coil windings and terminal insulation; exact ICM thermal interface and fastener hardware. |
| 05.5 | open | EGR valve and control solenoid internals, PCV internals, charcoal-purge interfaces and every calibrated vacuum restriction; verify 1985 emissions configuration. |

## 6. Engine castings, internals and induction

Engine navigation, internals, selected service parts, nine-piece lifter navigation and water-pump internal selection are covered. Oil-pump navigation, independent explosion, isolation, return and mobile search are covered by the dedicated scenario. Complete internal fits, measured castings and operating kinematics are not; the separate timing audit checks the corrected cam datum and selected static mesh fits. The internal audit checks twelve lifter passages/containment and pump shaft/chamber fit.

Related test files: [engine.spec.js](../tests/engine.spec.js), [engine-service.spec.js](../tests/engine-service.spec.js), [valve-gear.spec.js](../tests/valve-gear.spec.js), [oil-pump.spec.js](../tests/oil-pump.spec.js). 0/5 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 06.1 | partial | Measured L44 block/head/plenum castings, all ports/chambers/passages, sealing faces and complete internal fit validation. |
| 06.2 | open | Correct 1985–86 intake profiles, valley shield, idle-air tube, manual throttle cable/lever and brackets, fuel/vacuum connections. |
| 06.3 | partial | Original pump geometry and calibration, verified early sump/seals, complete accessory brackets/lifts and measured water-pump construction remain incomplete. |
| 06.4 | partial | Production mounts, complete gaskets/fasteners, original bearing dimensions/clearances, oil holes, cam phases, lifter internals, exact silent-chain plate stack/pitch/tooth engagement and full casting fits remain unverified. Replacement-based 40/20 teeth do not certify original GM application or tooling. |
| 06.5 | partial | Verify original dimensions, retaining-cage shape, oil-port geometry, spring rates, operating clearances, preload and leak-down calibration; inspect and test all relevant contexts. |
| 06.6 | open | Air-cleaner canister/lid, filter pleats and end seals, intake snorkel/ducts, resonator or separator as applicable, mounting isolators, drains and clamps. |
| 06.7 | open | Fuel rail, injector internals/seals/clips, cold-start injector and thermo-time circuit, regulator diaphragm/spring, throttle shaft/bushings, return spring, TPS and IAC passages. |
| 06.8 | partial | Measured original 1985 housing and pickup, verified tooth count/profile and operating mesh, pressure-relief calibration, complete internal galleries and mounting coordinates; filter internals and every gallery plug remain unfinished. |

## 7. Four-speed transmission, clutch and halfshafts

Gear/shaft/differential/clutch selection and return navigation are covered. Case contours, every tooth profile, synchronizer engagement and hydraulic mechanisms are not.

Related test files: [transmission-cooling.spec.js](../tests/transmission-cooling.spec.js). 0/1 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 07.1 | partial | Individual speed-gear tooth counts, measured involute/helix profiles, synchronizer fits and case contours. |
| 07.2 | open | Clutch master/slave internals, reservoirs, pushrods, brackets and hydraulic routing. |
| 07.3 | open | Shifter and selector cable internals, levers, bushings, brackets and cable paths. |
| 07.4 | open | Inner/outer CV joints, unequal halfshafts, boots/clamps, axle hardware and complete transaxle mounts. |
| 07.5 | open | Differential side/spider gears, thrust washers, cross pin, bearing rollers/races, selective shims, speedometer drive and every case plug, vent and seal. |
| 07.6 | open | Synchronizer keys/springs, shift-rail detents/interlocks, reverse idler, bearing retainers and clutch disc damper/pressure-plate release hardware; reconcile the original four-speed variant. |

## 8. Brakes and parking brake

Front/rear caliper, rotor, master-cylinder and parking-brake breakdown/navigation are covered. Full hydraulic behavior, calibrated valve internals, measured castings and swept hose clearances are not.

Related test files: [brakes.spec.js](../tests/brakes.spec.js). 0/1 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 08.1 | open | Measured caliper/master/booster castings and mounting coordinates; rear piston parking-clutch and sealed-hub internals. |
| 08.2 | open | Combination/proportioning valve internal form and calibration; exact line clips, hose fittings and retaining hardware. |
| 08.3 | open | Parking-brake handle/release/switch internals and cable adjustment geometry. |
| 08.4 | open | Verify hose clearance throughout steering/suspension travel and factory bleeding, adjustment and service specifications. |
| 08.5 | open | Master-cylinder cups, compensating ports, reservoir grommets; booster diaphragm/check valve/reaction mechanism and exact pushrod interfaces. |
| 08.6 | open | Front serviceable wheel-bearing rollers/races/seals, rear hub construction, caliper slider boots, pad clips and each parking-cable guide/retainer. |

## 9. Suspension and steering

Early front/rear suspension and manual rack selection/explosion are covered. WS6 rates, measured mounting points, full articulation and column mechanisms are not.

Related test files: [suspension.spec.js](../tests/suspension.spec.js). 0/1 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 09.1 | open | Measure frame/control-arm stampings, pivot coordinates, ball-joint interfaces and original bushings. |
| 09.2 | open | Verify WS6 spring codes/rates and rack ratio/tooth count; complete shock, strut and steering-damper internals. |
| 09.3 | open | Steering column, tilt mechanism, bearings, locks, lower shafts, universal joints/couplers and attaching hardware. |
| 09.4 | open | Validate alignment datums, steering stops, suspension travel and full wheel/body clearance. |
| 09.5 | open | Ball-joint internals, tie-rod sockets, rack bushings/preload assembly, pinion bearings, gaiter vents and lubrication interfaces. |
| 09.6 | open | Spring isolators, bump stops, strut top bearings/mounts and damper piston/valving; distinguish physical construction from unverified WS6 calibration. |

## 10. Wheels, tires, spare and tools

The wheel preview control is covered. This is not a tire/wheel dimensional test or an inspection of jack/spare/tool internals.

Related test files: [configuration.spec.js](../tests/configuration.spec.js). 0/2 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 10.1 | open | Accurate original wheel faces, inner barrels, center caps, lug seats/nuts, valve stems and balance weights. |
| 10.2 | open | Correct tire profiles, tread and sidewall markings for each verified factory wheel/tire preview. |
| 10.3 | open | Compact spare, jack mechanism, lug wrench, retainers and front-compartment stowage hardware. |
| 10.4 | open | Spare-tire valve and retaining bolt, jack screw/thrust bearing/pivots, handle engagement and front-compartment labels; verify stowage clearances with the hood and sunroof panel. |

## 11. Fuel supply and evaporative emissions

Tank/sender/pump/filter/canister selection and explosion are covered. Tank baffles, sender calibration, pressure/flow, exact routing and full service procedures are not.

Related test files: [fuel.spec.js](../tests/fuel.spec.js). 0/1 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 11.1 | open | Measured early tank shell/baffles and verified capacity; sender travel/resistance calibration. |
| 11.2 | open | Pump, filter and canister internals; exact filler/vent/return/purge routing, clamps, clips and electrical connections. |
| 11.3 | open | Verify factory fuel-system interfaces and complete documented service content. |
| 11.4 | open | In-tank pump motor/brushes, inlet strainer, outlet/check valve, pulsation damper as applicable, sender rheostat/wiper, float and electrical feedthrough. |
| 11.5 | open | Fuel-cap pressure/vacuum mechanism, filler ground strap, separator/vent details and tank mounting cushions; verify early-tank callouts rather than applying later capacity. |

## 12. Exhaust and heat shields

Complete exhaust and crossover/manifold selection and explosion are covered. Exact production bends, internal baffles and installed thermal clearance are not.

Related test files: [exhaust.spec.js](../tests/exhaust.spec.js). 0/1 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 12.1 | open | Measured manifold/crossover profiles, collector junctions and production pipe bends. |
| 12.2 | open | Muffler internal chambers/baffles and verified early converter construction. |
| 12.3 | open | Exact shield stampings, hangers, spring positions, tailpipe finish/application and heat/body clearances. |
| 12.4 | open | Manifold studs/nuts, flange sealing interfaces, oxygen-sensor seat, shield spacers and all spring/strap isolators; reconcile 1985 manual-transmission routing. |

## 13. Cooling

Circuit/pipe/radiator/fan selection and engine cooling-part access are covered. The twenty-step source-checked coolant replacement guide traverses both engine and radiator scopes; physical workshop validation, optional block-drain selections, remaining fan/pump internals and every clearance remain outstanding.

Related test files: [transmission-cooling.spec.js](../tests/transmission-cooling.spec.js), [engine-service.spec.js](../tests/engine-service.spec.js), [coolant-guide.spec.js](../tests/coolant-guide.spec.js). 0/3 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 13.1 | open | Complete water-pump and fan-motor internals; verify original fan/shroud option. |
| 13.2 | partial | Measured production mounting datum, all pipe/hose bends, clamp coordinates and full clearances. |
| 13.3 | partial | Separately model and verify optional block-drain hardware, original reservoir/tooling/markings and access/removal paths; physically validate the complete guide and remaining factory cooling interfaces. |
| 13.4 | partial | Original L44 supplier drawing or measured pump, exact impeller vane count/profile/material, weep passage, bearing internals, seal stack and press fits; validate remaining pump/cooling interfaces. |
| 13.5 | open | Radiator fan motor armature, magnets, commutator, brushes/springs, bearings, end covers and connector; radiator cap pressure/vacuum valves and recovery-bottle pickup. |

## 14. Heating, ventilation and air conditioning

C41/C60 preview switching, applicable part visibility and selection are covered. Calibrated door travel, complete control circuits and the refrigeration system are not.

Related test files: [hvac.spec.js](../tests/hvac.spec.js). 0/1 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 14.1 | open | Measured C41/C60 case/duct profiles, door seals, linkage positions and calibrated travel. |
| 14.2 | open | Blower and electric-actuator internals, switch contacts, resistor/relay wiring and verified control circuits. |
| 14.3 | open | Complete original A/C compressor/clutch, condenser, refrigerant lines, fittings, O-rings and accumulator internals; verify application before assigning dimensions. |
| 14.4 | open | Expansion/orifice device and screen, pressure switches, service valves/caps, compressor shaft seal, pistons/valves and clutch bearing/air gap for the verified original compressor. |
| 14.5 | open | Fresh-air intake screen, cowl drains, heater-core pipe seals, condensate drain, vacuum/electrical control internals and every case clip/foam seal. |

## 15. Doors, windows, locks and mirrors

Door skin/glass/trim/hinge selection and option previews are covered. Missing regulator, latch, lock and mirror internals are not tested.

Related test files: [body-hardware.spec.js](../tests/body-hardware.spec.js), [exterior.spec.js](../tests/exterior.spec.js), [configuration.spec.js](../tests/configuration.spec.js). 2/6 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 15.1 | open | Manual/power window regulators, motors, rollers, stops, glass channels, felt guides and seals. |
| 15.2 | open | Complete latch and key-cylinder internals, lock rods/clips, power-lock actuators, switches and harnesses. |
| 15.3 | partial | Original dimensions, manual/electric adjuster internals, cables/wiring, mounting hardware and calibrated travel. |
| 15.4 | partial | Measured weatherstrip sections, inner shields, complete belt molding attachments, channels/felts and trim retaining inventory. |
| 15.5 | open | Door hinge pins/bushings, check/hold-open mechanism, striker spacers, anti-rattle hardware and glass stop adjustments; verify full door and glass movement without clashes. |

## 16. Wipers, washer and defroster

Exterior checks cover parked blade selection/isolation and the nominal blade span. Hidden wiper motor, sweep, washer hydraulics and defroster operation still have no complete mechanism regression.

Related test files: [exterior.spec.js](../tests/exterior.spec.js). 2/3 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 16.1 | partial | Motor/gearbox, hidden transmission/pivots, calibrated full sweep, delay controls, exact holder tooling and complete arm construction. |
| 16.2 | open | Washer pump, bottle details, hoses, clips, nozzles and wiring. |
| 16.3 | open | Rear-window defroster grid/terminals, switch, relay, wiring and original-option application. |
| 16.4 | open | Wiper park contacts, delay board, motor brush/bearing stack, arm splines/springs and blade refill clips; washer impeller/check valves and nozzle passages. |

## 17. Body panels, roof and structure

Six exterior views, independent exterior pieces, roof/deck options, mobile selection, panel/hinge/vent/torque-rod navigation, sunroof panel/body hardware ownership and body configuration are covered. Sixteen selected nominal body dimensions are measured separately by audit-body-dimensions.mjs. Two bumper ground-reference interpretations are unresolved and excluded from dimensional passes. Complete measured panel sections, all hidden structure, gaps and full hinge travel remain unverified.

Related test files: [body-hardware.spec.js](../tests/body-hardware.spec.js), [rear-body.spec.js](../tests/rear-body.spec.js), [exterior.spec.js](../tests/exterior.spec.js), [sunroof.spec.js](../tests/sunroof.spec.js), [configuration.spec.js](../tests/configuration.spec.js), [body-shape-review.spec.js](../tests/body-shape-review.spec.js), [tail-lamp-review.spec.js](../tests/tail-lamp-review.spec.js). 3/10 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 17.1 | partial | Measured panel sections, datums, curvature and gap dimensions throughout the car; final owner appearance review. |
| 17.2 | partial | Measured A/B/C-pillar, backlight, decklid/vent and rear bumper sections; final owner visual approval. |
| 17.3 | open | Complete space-frame stampings, weld/joint locations, bulkheads, floor/tunnel, rails, bumper beams and energy absorbers. |
| 17.4 | partial | Original fascia supports, complete air deflectors/seals, measured liner forms and drawing-by-drawing reconciliation of every retainer. |
| 17.5 | partial | Measured glass and weatherstrip sections, latch detents/springs and calibrated travel, verified water management/drains and front-compartment stowage, complete headliner/adhesive details. |
| 17.6 | partial | Verified mounts/pads/reinforcement, option-specific torque rods, full fuel-door release and power-release mechanisms, measured geometry and travel. |
| 17.7 | open | Front/rear compartment seals, drain plugs, service access covers, trunk lining, battery-side heat insulation and concealed harness/pipe brackets. |
| 17.8 | open | Glazing encapsulation/adhesive sections, sail-panel attachments, seam sealer, structural adhesives and original corrosion coatings; no invented structural dimensions. |

## 18. Seats, restraints, trim and cabin controls

Driver-control handedness and cabin preview visibility are covered. Seat/retractor/recliner/column/pedal internal mechanisms are not.

Related test files: [transmission-cooling.spec.js](../tests/transmission-cooling.spec.js), [configuration.spec.js](../tests/configuration.spec.js). 0/3 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 18.1 | open | Seat frames, tracks, recliners, cushion construction, speaker internals and mounting hardware. |
| 18.2 | open | Seat-belt retractors, buckles, anchors, covers and warning-switch wiring. |
| 18.3 | open | Dashboard/console/door trim moldings, hidden attachments, carpet, insulation and sound pads. |
| 18.4 | open | Pedal pivots, throttle cable/return hardware, shifter boot/control details, radio and speaker assemblies/wiring. |
| 18.5 | open | Sun visors/pivots, interior rear-view mirror mount, assist/trim hardware, ashtray/cigarette lighter, radio controls/antenna/coax and speaker cones/magnets. |
| 18.6 | open | Pedal bushings/return springs, clutch and brake stop pads, accelerator hinge/cable end, console skeleton and every removable carpet/trim retainer. |

## 19. Factory options and interchange

Preview changes, persistence, invalid saved values and some option-specific visibility are covered. This does not establish the original build sheet or compatibility of every swap.

Related test files: [configuration.spec.js](../tests/configuration.spec.js), [hvac.spec.js](../tests/hvac.spec.js). 0/3 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 19.1 | open | Complete cruise-control hardware/cables/switches and verified option-specific electrical/vacuum architecture. |
| 19.2 | open | Finish supported factory alternatives for tilt, power windows/locks/mirrors/releases, delay wipers, lighting packages, defroster and roof equipment. |
| 19.3 | open | Verify model-year/RPO/side compatibility for swap previews; separate original build facts from preview choices. |
| 19.4 | open | Original paint/trim, spring codes and other undocumented installed RPOs remain unknown; the VIN alone does not establish them. |
| 19.5 | open | RPO/SPID, emissions, tire/loading and service labels; factory lettering/placement and paint/trim alternatives with unknown original build choices kept explicit. |
| 19.6 | open | For each supported swap, list all required brackets, harness changes, fasteners, control changes and year/side dependencies; preview compatibility does not establish safe interchange. |

## 20. Specifications, procedures and final acceptance

General search, selection, camera, visibility, guides, source links, feedback export and mobile presentation are covered. Full physical fidelity, complete procedures and broad device performance remain open.

Related test files: [workshop.spec.js](../tests/workshop.spec.js), [service-guides.spec.js](../tests/service-guides.spec.js). 0/12 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 20.1 | partial | All other identities, applications, quantities, torque, clearance, fluid and maintenance values across the full inventory. |
| 20.2 | partial | Complete procedures for the remaining systems, optional coolant block-drain selections, verified tools/access and removal paths, and physical workshop validation of the finished guides. |
| 20.3 | partial | Calibrated full travel, complete routing and clash checks throughout the vehicle. |
| 20.4 | partial | Finish the remaining current-source full-suite scenarios, refreshed native hardware review, complete device performance, measured factory tooling, hidden mechanisms and physical assembly interfaces. Owner acceptance of the revised body remains pending. |
| 20.5 | partial | Resolve measured geometry and complete original-application evidence throughout the model before any full photorealistic factory-spec claim. Current reference evidence remains insufficient for several production surfaces, hidden mechanisms and variants. |
| 20.6 | partial | Complete drawing-by-drawing reconciliation of all applicable GM callouts, service internals, physical hardware quantities and option/year variants. The authored catalog alone cannot prove a complete factory bill of materials. |
| 20.7 | open | For every nested assembly, verify selection, independent explosion, isolation, return navigation and option visibility; retain current-source evidence and an inspected assembled/exploded close-up. |

[Original requirements](../REMAINING-WORK.md) · [Acceptance evidence](../references/acceptance-evidence.json) · [Current verification report](current-UAT.md)
