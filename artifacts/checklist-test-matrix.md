# Checklist and test coverage

Generated 2026-09-22T10:38:36.450Z. Source `b2019702353965532ff3dcd7d8016da9555acf341514d85704bcced93b67718c`.

**0/73 requirements accepted; 25 partial and 48 open.** Current browser regression: 31/31 passing scenarios.

Test scenarios overlap areas. Counts must not be summed as unique tests. Passing browser tests do not establish factory dimensions, physical operation, complete part coverage or owner acceptance.

## 1. Headlights

Selection, nested explosion, cover pose, mobile controls and the headlamp guide are covered. Exact motor internals, production hard points, operating stops, optics and complete circuits are not.

Related test files: [headlights.spec.js](../tests/headlights.spec.js), [service-guides.spec.js](../tests/service-guides.spec.js), [configuration.spec.js](../tests/configuration.spec.js). 4/4 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 01.1 | partial | Owner UAT of the expanded pair, controls and early mechanism is still pending. |
| 01.2 | partial | Measured bucket/cover/motor profiles, production pivots, original gear counts/ratios and complete retainers. |
| 01.3 | partial | Measured production hard points, motor end stops, cover contact and full mechanism interference calibration. |
| 01.4 | partial | Full 1985 circuits, harness routing, calibrated dimmer linkage, aiming and diagnostic procedure validation. |

## 2. Other exterior and interior lighting

Lamp selection, option visibility and assembled/exploded presentation are covered. Original optical tooling and complete working circuits are not.

Related test files: [electrical.spec.js](../tests/electrical.spec.js). 2/2 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 02.1 | partial | Measured housings, original optical tooling, dimensions, seals and final visual acceptance. |
| 02.2 | partial | Measured lens optics/case profiles and assembled rear appearance acceptance. |
| 02.3 | partial | Full instrument illumination, original option identities, exact dimensions and circuit routing. |

## 3. Battery, starting and charging

Battery/starter/alternator selection and breakdown are covered. Original casting dimensions, exact drive teeth, full cables and live electrical operation are not.

Related test files: [electrical.spec.js](../tests/electrical.spec.js). 2/2 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 03.1 | partial | Measured battery/tray geometry, original appearance, complete cable routes and interface validation. |
| 03.2 | partial | Installed original stamping, exact drive tooth count, casting forms, fits and mounting coordinates. |
| 03.3 | partial | Original 66/94 A application, correct fan revision, measured castings and belt alignment/routing. |

## 4. Vehicle wiring, switches and instruments

Fuse/ECM/cluster selection, the EST terminal table and mobile navigation are covered. Complete harness topology and pin-by-pin circuit operation are not.

Related test files: [electrical.spec.js](../tests/electrical.spec.js). 2/2 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 04.1 | partial | Complete harness branch lengths, actual terminal population, grommets/clips, full pinouts and measured connector forms. |
| 04.2 | partial | Fusible links, ignition/brake/reverse/clutch switches, horn units and complete validated circuits. |
| 04.3 | partial | Measured instrument forms, complete movements/circuit boards, exact 1985 pinouts and electrical operation. |

## 5. Ignition and engine controls

Module, coil, distributor and ignition-part selection/explosion are covered. Exact variant geometry and every wire route remain unverified.

Related test files: [ignition.spec.js](../tests/ignition.spec.js). 2/2 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 05.1 | open | Verify the installed distributor variant, pickup/module/coil shapes and exact retaining hardware. |
| 05.2 | partial | Exact HT cap clocking/routing, separators and complete primary wiring/grounds. |
| 05.3 | open | Complete sensor mounting details, vacuum routing and emissions-label configuration; validate tune-up and diagnostic content. |

## 6. Engine castings, internals and induction

Engine navigation, internals, selected service parts and valve-gear presentation are covered. Complete internal fits, measured castings and operating kinematics are not; the known cam/crank datum discrepancy remains open.

Related test files: [engine.spec.js](../tests/engine.spec.js), [engine-service.spec.js](../tests/engine-service.spec.js), [valve-gear.spec.js](../tests/valve-gear.spec.js). 4/4 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 06.1 | partial | Measured L44 block/head/plenum castings, all ports/chambers/passages, sealing faces and complete internal fit validation. |
| 06.2 | open | Correct 1985–86 intake profiles, valley shield, idle-air tube, manual throttle cable/lever and brackets, fuel/vacuum connections. |
| 06.3 | open | Oil-pump gears/relief/screen/drive, early sump/seal geometry, water-pump impeller/bearing/seal, complete accessory brackets and lifts. |
| 06.4 | partial | Production mounts, complete gaskets/fasteners and internal fits remain unverified. In particular, the timing builder still has a 131 mm cam/crank separation versus the GM blueprint’s 159.03 mm; shaft, bearings, sprocket, chain, cover and valve-gear interfaces need a coordinated correction. |

## 7. Four-speed transmission, clutch and halfshafts

Gear/shaft/differential/clutch selection and return navigation are covered. Case contours, every tooth profile, synchronizer engagement and hydraulic mechanisms are not.

Related test files: [transmission-cooling.spec.js](../tests/transmission-cooling.spec.js). 1/1 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 07.1 | partial | Individual speed-gear tooth counts, measured involute/helix profiles, synchronizer fits and case contours. |
| 07.2 | open | Clutch master/slave internals, reservoirs, pushrods, brackets and hydraulic routing. |
| 07.3 | open | Shifter and selector cable internals, levers, bushings, brackets and cable paths. |
| 07.4 | open | Inner/outer CV joints, unequal halfshafts, boots/clamps, axle hardware and complete transaxle mounts. |

## 8. Brakes and parking brake

Front/rear caliper, rotor, master-cylinder and parking-brake breakdown/navigation are covered. Full hydraulic behavior, calibrated valve internals, measured castings and swept hose clearances are not.

Related test files: [brakes.spec.js](../tests/brakes.spec.js). 1/1 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 08.1 | open | Measured caliper/master/booster castings and mounting coordinates; rear piston parking-clutch and sealed-hub internals. |
| 08.2 | open | Combination/proportioning valve internal form and calibration; exact line clips, hose fittings and retaining hardware. |
| 08.3 | open | Parking-brake handle/release/switch internals and cable adjustment geometry. |
| 08.4 | open | Verify hose clearance throughout steering/suspension travel and factory bleeding, adjustment and service specifications. |

## 9. Suspension and steering

Early front/rear suspension and manual rack selection/explosion are covered. WS6 rates, measured mounting points, full articulation and column mechanisms are not.

Related test files: [suspension.spec.js](../tests/suspension.spec.js). 1/1 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 09.1 | open | Measure frame/control-arm stampings, pivot coordinates, ball-joint interfaces and original bushings. |
| 09.2 | open | Verify WS6 spring codes/rates and rack ratio/tooth count; complete shock, strut and steering-damper internals. |
| 09.3 | open | Steering column, tilt mechanism, bearings, locks, lower shafts, universal joints/couplers and attaching hardware. |
| 09.4 | open | Validate alignment datums, steering stops, suspension travel and full wheel/body clearance. |

## 10. Wheels, tires, spare and tools

The wheel preview control is covered. This is not a tire/wheel dimensional test or an inspection of jack/spare/tool internals.

Related test files: [configuration.spec.js](../tests/configuration.spec.js). 2/2 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 10.1 | open | Accurate original wheel faces, inner barrels, center caps, lug seats/nuts, valve stems and balance weights. |
| 10.2 | open | Correct tire profiles, tread and sidewall markings for each verified factory wheel/tire preview. |
| 10.3 | open | Compact spare, jack mechanism, lug wrench, retainers and front-compartment stowage hardware. |

## 11. Fuel supply and evaporative emissions

Tank/sender/pump/filter/canister selection and explosion are covered. Tank baffles, sender calibration, pressure/flow, exact routing and full service procedures are not.

Related test files: [fuel.spec.js](../tests/fuel.spec.js). 1/1 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 11.1 | open | Measured early tank shell/baffles and verified capacity; sender travel/resistance calibration. |
| 11.2 | open | Pump, filter and canister internals; exact filler/vent/return/purge routing, clamps, clips and electrical connections. |
| 11.3 | open | Verify factory fuel-system interfaces and complete documented service content. |

## 12. Exhaust and heat shields

Complete exhaust and crossover/manifold selection and explosion are covered. Exact production bends, internal baffles and installed thermal clearance are not.

Related test files: [exhaust.spec.js](../tests/exhaust.spec.js). 1/1 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 12.1 | open | Measured manifold/crossover profiles, collector junctions and production pipe bends. |
| 12.2 | open | Muffler internal chambers/baffles and verified early converter construction. |
| 12.3 | open | Exact shield stampings, hangers, spring positions, tailpipe finish/application and heat/body clearances. |

## 13. Cooling

Circuit/pipe/radiator/fan selection and engine cooling-part access are covered. Fan/pump internals, complete factory fill/bleed guide and every clearance are not.

Related test files: [transmission-cooling.spec.js](../tests/transmission-cooling.spec.js), [engine-service.spec.js](../tests/engine-service.spec.js). 2/2 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 13.1 | open | Complete water-pump and fan-motor internals; verify original fan/shroud option. |
| 13.2 | partial | Measured production mounting datum, all pipe/hose bends, clamp coordinates and full clearances. |
| 13.3 | partial | Integrate the complete source-checked filling/bleeding procedure into the interactive manual, verify every referenced part and validate the finished guide. |

## 14. Heating, ventilation and air conditioning

C41/C60 preview switching, applicable part visibility and selection are covered. Calibrated door travel, complete control circuits and the refrigeration system are not.

Related test files: [hvac.spec.js](../tests/hvac.spec.js). 1/1 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 14.1 | open | Measured C41/C60 case/duct profiles, door seals, linkage positions and calibrated travel. |
| 14.2 | open | Blower and electric-actuator internals, switch contacts, resistor/relay wiring and verified control circuits. |
| 14.3 | open | Complete original A/C compressor/clutch, condenser, refrigerant lines, fittings, O-rings and accumulator internals; verify application before assigning dimensions. |

## 15. Doors, windows, locks and mirrors

Door skin/glass/trim/hinge selection and option previews are covered. Missing regulator, latch, lock and mirror internals are not tested.

Related test files: [body-hardware.spec.js](../tests/body-hardware.spec.js), [configuration.spec.js](../tests/configuration.spec.js). 3/3 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 15.1 | open | Manual/power window regulators, motors, rollers, stops, glass channels, felt guides and seals. |
| 15.2 | open | Complete latch and key-cylinder internals, lock rods/clips, power-lock actuators, switches and harnesses. |
| 15.3 | open | Manual/power mirror pivots, adjustment mechanisms, cable/wiring, mounting pads and hardware. |
| 15.4 | open | Door weatherstrip cross-sections, belt moldings, inner shields and complete trim attachments. |

## 16. Wipers, washer and defroster

There is no dedicated wiper/washer/defroster detail or mechanism regression. Whole-car rendering does not substitute for it.

No dedicated browser scenario exists for this area.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 16.1 | open | Wiper motor/gearbox, transmission links, pivots, delay control and exact blade/arm construction. |
| 16.2 | open | Washer pump, bottle details, hoses, clips, nozzles and wiring. |
| 16.3 | open | Rear-window defroster grid/terminals, switch, relay, wiring and original-option application. |

## 17. Body panels, roof and structure

Panel/hinge/vent/torque-rod selection, body configuration and rear geometry presentation are covered. Measured panel sections, all hidden structure, gaps and full hinge travel are not.

Related test files: [body-hardware.spec.js](../tests/body-hardware.spec.js), [rear-body.spec.js](../tests/rear-body.spec.js), [configuration.spec.js](../tests/configuration.spec.js). 4/4 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 17.1 | partial | Measured panel sections, datums, curvature and gaps throughout the car. |
| 17.2 | open | Refine A/B/C pillars, small sail windows, recessed rear window, decklid/vents and rear bumper geometry against source dimensions. |
| 17.3 | open | Complete space-frame stampings, weld/joint locations, bulkheads, floor/tunnel, rails, bumper beams and energy absorbers. |
| 17.4 | open | Fascia supports, wheelhouse liners, air deflectors, seals and every verified panel retainer. |
| 17.5 | open | Sunroof latch/seals/drains/stowage, roof trim and glazing adhesive/weatherstrip sections. |
| 17.6 | open | Wing or luggage-rack mounts/pads/reinforcement, option-specific deck torque rods, fuel-door hinge/latch and power-release mechanisms. |

## 18. Seats, restraints, trim and cabin controls

Driver-control handedness and cabin preview visibility are covered. Seat/retractor/recliner/column/pedal internal mechanisms are not.

Related test files: [transmission-cooling.spec.js](../tests/transmission-cooling.spec.js), [configuration.spec.js](../tests/configuration.spec.js). 3/3 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 18.1 | open | Seat frames, tracks, recliners, cushion construction, speaker internals and mounting hardware. |
| 18.2 | open | Seat-belt retractors, buckles, anchors, covers and warning-switch wiring. |
| 18.3 | open | Dashboard/console/door trim moldings, hidden attachments, carpet, insulation and sound pads. |
| 18.4 | open | Pedal pivots, throttle cable/return hardware, shifter boot/control details, radio and speaker assemblies/wiring. |

## 19. Factory options and interchange

Preview changes, persistence, invalid saved values and some option-specific visibility are covered. This does not establish the original build sheet or compatibility of every swap.

Related test files: [configuration.spec.js](../tests/configuration.spec.js), [hvac.spec.js](../tests/hvac.spec.js). 3/3 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 19.1 | open | Complete cruise-control hardware/cables/switches and verified option-specific electrical/vacuum architecture. |
| 19.2 | open | Finish supported factory alternatives for tilt, power windows/locks/mirrors/releases, delay wipers, lighting packages, defroster and roof equipment. |
| 19.3 | open | Verify model-year/RPO/side compatibility for swap previews; separate original build facts from preview choices. |
| 19.4 | open | Original paint/trim, spring codes and other undocumented installed RPOs remain unknown; the VIN alone does not establish them. |

## 20. Specifications, procedures and final acceptance

General search, selection, camera, visibility, guides, source links, feedback export and mobile presentation are covered. Full physical fidelity, complete procedures and broad device performance remain open.

Related test files: [workshop.spec.js](../tests/workshop.spec.js), [service-guides.spec.js](../tests/service-guides.spec.js). 12/12 associated scenarios currently pass.

| Requirement | Status | Remaining acceptance work |
| --- | --- | --- |
| 20.1 | partial | All other identities, applications, quantities, torque, clearance, fluid and maintenance values across the full inventory. |
| 20.2 | partial | Remaining procedures for every other system, exact removal paths and physical workshop validation. |
| 20.3 | partial | Calibrated full travel, complete routing and clash checks throughout the vehicle. |
| 20.4 | partial | Photoreal surface acceptance for every component, full device performance review and outstanding system-specific checks. Native initial readiness was approximately 97 seconds during concurrent regression. Broad native hardware/device testing and startup performance remain unresolved; the follow-up all-family capture run was interrupted. |
| 20.5 | partial | Resolve measured geometry and complete original-application evidence throughout the model before any full photorealistic factory-spec claim. Current reference evidence remains insufficient for several production surfaces, hidden mechanisms and variants. |

[Original requirements](../REMAINING-WORK.md) · [Acceptance evidence](../references/acceptance-evidence.json) · [Current verification report](current-UAT.md)
