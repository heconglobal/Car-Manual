# Remaining 3D model and repair-manual work

Acceptance requires every item below to be finished and tested. These are model/manual development tasks, not repairs diagnosed on the owner’s car. Native 3D, factory-new appearance and US left-hand drive remain required.

**0 / 73 requirements accepted.** Partial modeling and software tests do not close measured-geometry, factory-application or validated-procedure requirements. See [evidence ledger](references/acceptance-evidence.json) and [machine-readable status](artifacts/acceptance-status.json).

## 1. Headlights

Nominal bulb position and reconstructed linkage checked; factory calibration remains.

- [ ] **01.1** Check the new LH/RH lamp, cover, linkage, early motor and relay breakdown in UAT.
  Progress: The current-source full run passes the LH/RH headlight scenario and the nine-step headlamp guide scenario. Both assembled/exploded lamps, motor, closed cover and mobile guide states were visually inspected; 118 selections are available. This is development verification, not owner sign-off or complete dimensional acceptance. Remaining: Owner UAT of the expanded pair, controls and early mechanism is still pending.
- [ ] **01.2** Verify measured cover/bucket profiles, actuator case dimensions, exact gear teeth/ratios, brush/contact shapes and all retainers.
  Progress: Nominal bulb center anchored at 709 mm above ground and 511 mm from vehicle centerline using Pontiac 1985 specifications. Remaining: Measured bucket/cover/motor profiles, production pivots, original gear counts/ratios and complete retainers.
- [ ] **01.3** Calibrate hinge/crank travel and clearances through the full movement; nominal bulb position and constant-length reconstructed linkage are checked, while production pivots, cover contact and motor stops remain unverified.
  Progress: Reconstructed operating link now retains constant length in 101 solved poses; sampled bucket clearance through the hood aperture is checked. Remaining: Measured production hard points, motor end stops, cover contact and full mechanism interference calibration.
- [ ] **01.4** Complete the 1985 headlight switch, dimmer linkage, circuit pinouts, fusible links and factory harness routing; validate aiming and diagnostic procedures.
  Progress: Driver switch, PARK button, panel dimmer, transistor, beam switch/rod and plugs added. Remaining: Full 1985 circuits, harness routing, calibrated dimmer linkage, aiming and diagnostic procedure validation.

## 2. Other exterior and interior lighting

Detailed assemblies added; verification remains.

- [ ] **02.1** Front park/turn lamps and side markers: housings, optical lenses, bulbs, sockets, gaskets, brackets and screws.
  Progress: Separate native front lamp and four marker assemblies replace surface proxies; lamp types checked in the 1985 DIY and owner manuals. Remaining: Measured housings, original optical tooling, dimensions, seals and final visual acceptance.
- [ ] **02.2** Rear stop/turn/tail and reverse lamps: separate chambers, lens sections, reflectors, bulbs, sockets, seals and fasteners.
  Progress: 1984–85 rear housings, inner red/clear lenses, outer lens, three chambers, two 2057 bulbs and inboard 1156 per side added. Remaining: Measured lens optics/case profiles and assembled rear appearance acceptance.
- [ ] **02.3** License lamps, courtesy lamps, dome/map lighting and instrument illumination; correct factory option variants.
  Progress: License, four overhead lamps, two manual-console lamps and optional courtesy/compartment assemblies added. Remaining: Full instrument illumination, original option identities, exact dimensions and circuit routing.

## 3. Battery, starting and charging

Detailed assemblies added; verification remains.

- [ ] **03.1** Battery case/caps, terminals, tray, hold-down and vent/insulation details; complete positive/negative cables and ground straps.
  Progress: Side-terminal battery, tray, retainer, heat shield, cables and braid replace the top-post placeholder. Remaining: Measured battery/tray geometry, original appearance, complete cable routes and interface validation.
- [ ] **03.2** Original starter: housing, solenoid, drive, armature/brushes, mounting and cable interfaces.
  Progress: 22 starter/solenoid construction selections, including armature, field coils, brushes, fork, clutch and pinion. Remaining: Installed original stamping, exact drive tooth count, casting forms, fits and mounting coordinates.
- [ ] **03.3** Alternator: cast housings, rotor/stator, bearings, regulator/rectifier, brushes, pulley, fan and brackets; original belt routing.
  Progress: 27 generator/bracket selections share geometry with the engine and vehicle; separate rotor/stator, brushes, rectifiers and regulator. Remaining: Original 66/94 A application, correct fan revision, measured castings and belt alignment/routing.

## 4. Vehicle wiring, switches and instruments

Cluster, fuse panel, ECM, junction and flashers added; coverage remains incomplete.

- [ ] **04.1** Complete body/engine/dash harnesses, branch lengths, connectors, terminal cavities, grommets, clips, junctions and grounds.
  Progress: ECM 24/32-cavity plugs, enclosure/calibration access, junction studs and ground eyelets added. Remaining: Complete harness branch lengths, actual terminal population, grommets/clips, full pinouts and measured connector forms.
- [ ] **04.2** Fuse block, fusible links, relay bases, ignition switch, stop/reverse/clutch switches and horn assemblies/circuit.
  Progress: 17-position fuse panel, contacts, carrier/hinge/releases, separate flashers and horn relay added. Remaining: Fusible links, ignition/brake/reverse/clutch switches, horn units and complete validated circuits.
- [ ] **04.3** Instrument housings, circuit boards, speedometer/tachometer/gauges and warning lamps; correct 1985 pinouts and circuit links.
  Progress: 47 native cluster selections add the original 1985 face arrangement, individual pointers, ten warning windows/bulb units, pod/lens and mounting sets. Remaining: Measured instrument forms, complete movements/circuit boards, exact 1985 pinouts and electrical operation.

## 5. Ignition and engine controls

Modeled; verification remains.

- [ ] **05.1** Verify the installed distributor variant, pickup/module/coil shapes and exact retaining hardware.
- [ ] **05.2** Verify cylinder numbering, firing-order presentation and factory high-tension lead routing, separators, primary wiring and ground points.
  Progress: Four EST leads now independently selectable with verified A/G/453/B3, B/B/424/D5, C/R/430/B5 and D/E/423/B4 assignments. Cylinder bank identities and 1–2–3–4–5–6 firing order now have factory references. Remaining: Exact HT cap clocking/routing, separators and complete primary wiring/grounds.
- [ ] **05.3** Complete sensor mounting details, vacuum routing and emissions-label configuration; validate tune-up and diagnostic content.

## 6. Engine castings, internals and induction

Modeled; refinement remains.

- [ ] **06.1** Measured block/head/plenum/intake/exhaust castings; all ports, chambers, oil/coolant passages and sealing faces.
  Progress: GM production V6 blueprint inspected: 224 mm block deck height and 44 mm correctly oriented bank stagger now supplement the shared 111.8 mm cylinder pitch. Bore/piston and head-stack geometry corrected; installed engine now shares the detailed surfaces. Remaining: Measured L44 block/head/plenum castings, all ports/chambers/passages, sealing faces and complete internal fit validation.
- [ ] **06.2** Correct 1985–86 intake profiles, valley shield, idle-air tube, manual throttle cable/lever and brackets, fuel/vacuum connections.
- [ ] **06.3** Oil-pump gears/relief/screen/drive, early sump/seal geometry, water-pump impeller/bearing/seal, complete accessory brackets and lifts.
- [ ] **06.4** Complete gaskets, plugs, seals, dowels and fastener counts; verify bearing fits, valve interfaces and engine mounting coordinates.
  Progress: Nonuniform installed engine scaling and coarse duplicate block/head/intake removed. Shared exterior geometry, flywheel, rigid engine/transaxle placement, belt wrap and selected hose/cable connections implemented; geometry checks recorded separately. Remaining: Production mounts, complete gaskets/fasteners and internal fits remain unverified. In particular, the timing builder still has a 131 mm cam/crank separation versus the GM blueprint’s 159.03 mm; shaft, bearings, sprocket, chain, cover and valve-gear interfaces need a coordinated correction.

## 7. Four-speed transmission, clutch and halfshafts

Modeled; refinement remains.

- [ ] **07.1** Verify original gear tooth counts, ratios, involute profiles, synchronizer fits and measured case contours.
  Progress: Final-drive mesh sections now contain the factory-specified 84 ring teeth and 23 pinion teeth; clutch facing corrected to nominal 232/155 mm. Remaining: Individual speed-gear tooth counts, measured involute/helix profiles, synchronizer fits and case contours.
- [ ] **07.2** Clutch master/slave internals, reservoirs, pushrods, brackets and hydraulic routing.
- [ ] **07.3** Shifter and selector cable internals, levers, bushings, brackets and cable paths.
- [ ] **07.4** Inner/outer CV joints, unequal halfshafts, boots/clamps, axle hardware and complete transaxle mounts.

## 8. Brakes and parking brake

Modeled; verification remains.

- [ ] **08.1** Measured caliper/master/booster castings and mounting coordinates; rear piston parking-clutch and sealed-hub internals.
- [ ] **08.2** Combination/proportioning valve internal form and calibration; exact line clips, hose fittings and retaining hardware.
- [ ] **08.3** Parking-brake handle/release/switch internals and cable adjustment geometry.
- [ ] **08.4** Verify hose clearance throughout steering/suspension travel and factory bleeding, adjustment and service specifications.

## 9. Suspension and steering

Modeled; refinement remains.

- [ ] **09.1** Measure frame/control-arm stampings, pivot coordinates, ball-joint interfaces and original bushings.
- [ ] **09.2** Verify WS6 spring codes/rates and rack ratio/tooth count; complete shock, strut and steering-damper internals.
- [ ] **09.3** Steering column, tilt mechanism, bearings, locks, lower shafts, universal joints/couplers and attaching hardware.
- [ ] **09.4** Validate alignment datums, steering stops, suspension travel and full wheel/body clearance.

## 10. Wheels, tires, spare and tools

Refinement and detail missing.

- [ ] **10.1** Accurate original wheel faces, inner barrels, center caps, lug seats/nuts, valve stems and balance weights.
- [ ] **10.2** Correct tire profiles, tread and sidewall markings for each verified factory wheel/tire preview.
- [ ] **10.3** Compact spare, jack mechanism, lug wrench, retainers and front-compartment stowage hardware.

## 11. Fuel supply and evaporative emissions

Modeled; refinement remains.

- [ ] **11.1** Measured early tank shell/baffles and verified capacity; sender travel/resistance calibration.
- [ ] **11.2** Pump, filter and canister internals; exact filler/vent/return/purge routing, clamps, clips and electrical connections.
- [ ] **11.3** Verify factory fuel-system interfaces and complete documented service content.

## 12. Exhaust and heat shields

Modeled; refinement remains.

- [ ] **12.1** Measured manifold/crossover profiles, collector junctions and production pipe bends.
- [ ] **12.2** Muffler internal chambers/baffles and verified early converter construction.
- [ ] **12.3** Exact shield stampings, hangers, spring positions, tailpipe finish/application and heat/body clearances.

## 13. Cooling

Modeled; verification remains.

- [ ] **13.1** Complete water-pump and fan-motor internals; verify original fan/shroud option.
- [ ] **13.2** Measured radiator, coolant-pipe and hose bends, clamp/support locations, sender/switch fittings and clearance.
  Progress: Radiator package and front hose endpoints corrected to remove interference with the accepted hood; minimum checked gap 6.3906 mm. Remaining: Measured production mounting datum, all pipe/hose bends, clamp coordinates and full clearances.
- [ ] **13.3** Validate coolant filling/bleeding, capacities, thermostat and pressure specifications from 1985 sources.
  Progress: 1985 owner VIN-code-9 row confirms approximate 13.0 L capacity; original Pontiac nominal form confirms 103.4 kPa / 15 psi cap pressure. All factory coolant replacement pages inspected, including pipe-plug torque and staged thermostat/cap handling. Four-cylinder 13.3 L entry excluded. Remaining: Integrate the complete source-checked filling/bleeding procedure into the interactive manual, verify every referenced part and validate the finished guide.

## 14. Heating, ventilation and air conditioning

Modeled; refinement remains.

- [ ] **14.1** Measured C41/C60 case/duct profiles, door seals, linkage positions and calibrated travel.
- [ ] **14.2** Blower and electric-actuator internals, switch contacts, resistor/relay wiring and verified control circuits.
- [ ] **14.3** Complete original A/C compressor/clutch, condenser, refrigerant lines, fittings, O-rings and accumulator internals; verify application before assigning dimensions.

## 15. Doors, windows, locks and mirrors

Detail missing.

- [ ] **15.1** Manual/power window regulators, motors, rollers, stops, glass channels, felt guides and seals.
- [ ] **15.2** Complete latch and key-cylinder internals, lock rods/clips, power-lock actuators, switches and harnesses.
- [ ] **15.3** Manual/power mirror pivots, adjustment mechanisms, cable/wiring, mounting pads and hardware.
- [ ] **15.4** Door weatherstrip cross-sections, belt moldings, inner shields and complete trim attachments.

## 16. Wipers, washer and defroster

Detail missing.

- [ ] **16.1** Wiper motor/gearbox, transmission links, pivots, delay control and exact blade/arm construction.
- [ ] **16.2** Washer pump, bottle details, hoses, clips, nozzles and wiring.
- [ ] **16.3** Rear-window defroster grid/terminals, switch, relay, wiring and original-option application.

## 17. Body panels, roof and structure

Modeled; specification audit remains.

- [ ] **17.1** Measured panel curvature, sections, datums and gaps: front/rear fascias, hood, front fenders, doors, rockers, quarters and rear roof clip. Radiator-to-hood interference has been corrected and checked; measured factory placement remains unverified.
  Progress: The dark hood strip was identified as protruding radiator support/filler hardware and corrected. Remaining: Measured panel sections, datums, curvature and gaps throughout the car.
- [ ] **17.2** Refine A/B/C pillars, small sail windows, recessed rear window, decklid/vents and rear bumper geometry against source dimensions.
- [ ] **17.3** Complete space-frame stampings, weld/joint locations, bulkheads, floor/tunnel, rails, bumper beams and energy absorbers.
- [ ] **17.4** Fascia supports, wheelhouse liners, air deflectors, seals and every verified panel retainer.
- [ ] **17.5** Sunroof latch/seals/drains/stowage, roof trim and glazing adhesive/weatherstrip sections.
- [ ] **17.6** Wing or luggage-rack mounts/pads/reinforcement, option-specific deck torque rods, fuel-door hinge/latch and power-release mechanisms.

## 18. Seats, restraints, trim and cabin controls

Detail missing.

- [ ] **18.1** Seat frames, tracks, recliners, cushion construction, speaker internals and mounting hardware.
- [ ] **18.2** Seat-belt retractors, buckles, anchors, covers and warning-switch wiring.
- [ ] **18.3** Dashboard/console/door trim moldings, hidden attachments, carpet, insulation and sound pads.
- [ ] **18.4** Pedal pivots, throttle cable/return hardware, shifter boot/control details, radio and speaker assemblies/wiring.

## 19. Factory options and interchange

Coverage incomplete.

- [ ] **19.1** Complete cruise-control hardware/cables/switches and verified option-specific electrical/vacuum architecture.
- [ ] **19.2** Finish supported factory alternatives for tilt, power windows/locks/mirrors/releases, delay wipers, lighting packages, defroster and roof equipment.
- [ ] **19.3** Verify model-year/RPO/side compatibility for swap previews; separate original build facts from preview choices.
- [ ] **19.4** Original paint/trim, spring codes and other undocumented installed RPOs remain unknown; the VIN alone does not establish them.

## 20. Specifications, procedures and final acceptance

Required across every system.

- [ ] **20.1** Source every published part identity/application, fastener quantity, torque, clearance, fluid and maintenance value.
  Progress: Intact 1985 owner manual acquired; fuse ratings, bulb identities and EST terminal assignments inspected and recorded. Remaining: All other identities, applications, quantities, torque, clearance, fluid and maintenance values across the full inventory.
- [ ] **20.2** Build validated step-by-step procedures with tools, access, removal/refit order and verification linked to the actual selectable parts.
  Progress: Nine-step headlamp replacement guide cross-checked against 1985 Pontiac DIY printed 2-28 through 2-30, with native 3D part references, tools, motor isolation, aiming preservation, bezel torque and relay reconnection order. Expanded desktop/mobile regression passes in the current 31-scenario full run, including cross-assembly selection, saved configuration and return navigation. Remaining: Remaining procedures for every other system, exact removal paths and physical workshop validation.
- [ ] **20.3** Check left/right orientation, assembly interfaces, full travel, hose/cable routing and clashes throughout the car.
  Progress: Shared engine geometry preserves its dimensions in the car; differential datum is retained and flywheel/clutch axes coincide. Both banks valve-cover containment, belt wrap and sampled deck clearances are checked separately. Production mount coordinates, complete routing and full motion remain unverified. Remaining: Calibrated full travel, complete routing and clash checks throughout the vehicle.
- [ ] **20.4** Review close-up surface accuracy/materials and assembled/exploded interaction for each system; test desktop and mobile performance.
  Progress: Electrical/charging desktop and mobile reviews executed; expanded full regression run is tracked separately. Software-renderer redraw cost reduced and mobile selection rechecked; original-layout instruments reviewed on desktop and mobile. A limited native Windows Edge / Intel UHD Direct3D11 session captured the vehicle and engine without browser exceptions; its three images were inspected. A Node construction probe took about 83 seconds; CPU sampling identifies substantial geometry construction, copying and handedness transformation costs before rendering. The full current-source browser run passes all 31 scenarios, with zero failed, skipped or flaky outcomes; raw outcomes and the exact source manifest are archived. Remaining: Photoreal surface acceptance for every component, full device performance review and outstanding system-specific checks. Native initial readiness was approximately 97 seconds during concurrent regression. Broad native hardware/device testing and startup performance remain unresolved; the follow-up all-family capture run was interrupted.
- [ ] **20.5** Resolve remaining provenance/licensing and dimensional evidence gaps before claiming a complete photorealistic, factory-spec manual.
  Progress: Native mesh/procedural-surface provenance recorded; Three.js/Vite notices and identified CC0 lighting asset now ship in the production package. Distribution audit passed with no reference scans, component photos or imported car meshes. Remaining: Resolve measured geometry and complete original-application evidence throughout the model before any full photorealistic factory-spec claim. Current reference evidence remains insufficient for several production surfaces, hidden mechanisms and variants.
