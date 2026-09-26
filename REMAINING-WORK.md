# Remaining 3D model and repair-manual work

**Work paused at the owner’s request after the BODY R8 update.** Current results and unfinished verification are recorded in [the pause record](artifacts/r8-user-pause.json). Further work awaits the owner’s next instruction.

Acceptance requires every item below to be finished and tested. These are model/manual development tasks, not repairs diagnosed on the owner’s car. Native 3D, factory-new appearance and US left-hand drive remain required.

**0 / 109 requirements accepted.** Partial modeling and software tests do not close measured-geometry, factory-application or validated-procedure requirements. See [evidence ledger](references/acceptance-evidence.json) and [machine-readable status](artifacts/acceptance-status.json).

## 1. Headlights

Relay internals, individual terminals, motor conductors and C/D fusible-link construction added; factory calibration remains.

- [ ] **01.1** Check the new LH/RH lamp, cover, linkage, early motor and relay breakdown in UAT.
  Progress: 189 headlight selections now include three nested relay assemblies, separate motor conductors/disconnects and front-harness C/D links. The prior 267f7ce33b67 application passed headlight and replacement-guide scenarios; its 13 native vehicle/headlight captures were inspected and archived. Subsequent engine changes require current-source regression evidence. This is development verification, not owner sign-off or complete dimensional acceptance. Remaining: Owner UAT of the expanded pair, controls and early mechanism is still pending.
- [ ] **01.2** Verify measured cover/bucket profiles, actuator case dimensions, exact gear teeth/ratios, brush/contact shapes and all retainers.
  Progress: Nominal bulb center anchored at 709 mm above ground and 511 mm from vehicle centerline using Pontiac 1985 specifications. Remaining: Measured bucket/cover/motor profiles, production pivots, original gear counts/ratios and complete retainers.
- [ ] **01.3** Calibrate hinge/crank travel and clearances through the full movement; nominal bulb position and constant-length reconstructed linkage are checked, while production pivots, cover contact and motor stops remain unverified.
  Progress: Reconstructed operating link now retains constant length in 101 solved poses; sampled bucket clearance through the hood aperture is checked. Remaining: Measured production hard points, motor end stops, cover contact and full mechanism interference calibration.
- [ ] **01.4** Complete the 1985 headlight switch, dimmer linkage, circuit pinouts, fusible links and factory harness routing; validate aiming and diagnostic procedures.
  Progress: Driver controls plus early relay internals, 16 selectable blades, open connector cavities, white/green/gray motor leads, C101/C102 disconnects, blue harness branches and C/D fusible-link construction added. Connections cross-checked against original adjacent-year GM 8A-102-0; exact 1985 tooling and complete routes remain unverified. Remaining: Complete verified 1985 circuits, physical connector-end drawings, measured relay/motor tooling, fusible-link lengths, full harness routing, calibrated dimmer linkage, aiming and validated diagnostics.
- [ ] **01.5** Lamp aiming screws, spring seats, bucket bushings, motor bracket welds and connector retainers: reconcile every 1985 drawing callout with a selectable part or named hardware set.

## 2. Other exterior and interior lighting

Detailed assemblies added; verification remains.

- [ ] **02.1** Front park/turn lamps and side markers: housings, optical lenses, bulbs, sockets, gaskets, brackets and screws.
  Progress: Separate native front lamp and four marker assemblies replace surface proxies; lamp types checked in the 1985 DIY and owner manuals. Remaining: Measured housings, original optical tooling, dimensions, seals and final visual acceptance.
- [ ] **02.2** Rear stop/turn/tail and reverse lamps: separate chambers, lens sections, reflectors, bulbs, sockets, seals and fasteners.
  Progress: R8 covers the full exterior: refitted straight side/wraparound moldings, accurately clipped fuel/intake openings, intake below the molding, exposed lower nose deflector, smoother road-tire silhouette, revised machined wheel/sail/paint/lamp finishes and close-view inspection. The deeper R7 rear apron and softened upper lamp corners remain. Sixteen selected dimensional comparisons and separate actual-mesh interface audits support development review. Two bumper-reference interpretations and factory tooling accuracy remain unresolved; owner approval is not asserted. Remaining: Dimensioned factory lens/housing/optical tooling, measured seal and mounting interfaces, original electrical validation and owner appearance acceptance.
- [ ] **02.3** License lamps, courtesy lamps, dome/map lighting and instrument illumination; correct factory option variants.
  Progress: License, four overhead lamps, two manual-console lamps and optional courtesy/compartment assemblies added. Remaining: Full instrument illumination, original option identities, exact dimensions and circuit routing.
- [ ] **02.4** Optical prism/flute geometry, lens lettering, reflector plating and bulb-filament/support geometry; establish original lens and socket variants before accepting appearance.

## 3. Battery, starting and charging

Detailed assemblies added; verification remains.

- [ ] **03.1** Battery case/caps, terminals, tray, hold-down and vent/insulation details; complete positive/negative cables and ground straps.
  Progress: Side-terminal battery, tray, retainer, heat shield, cables and braid replace the top-post placeholder. Remaining: Measured battery/tray geometry, original appearance, complete cable routes and interface validation.
- [ ] **03.2** Original starter: housing, solenoid, drive, armature/brushes, mounting and cable interfaces.
  Progress: 22 starter/solenoid construction selections, including armature, field coils, brushes, fork, clutch and pinion. Remaining: Installed original stamping, exact drive tooth count, casting forms, fits and mounting coordinates.
- [ ] **03.3** Alternator: cast housings, rotor/stator, bearings, regulator/rectifier, brushes, pulley, fan and brackets; original belt routing.
  Progress: 27 generator/bracket selections share geometry with the engine and vehicle; separate rotor/stator, brushes, rectifiers and regulator. Remaining: Original 66/94 A application, correct fan revision, measured castings and belt alignment/routing.
- [ ] **03.4** Starter overrunning clutch, shift fork, solenoid contact disc, brush springs and thrust hardware; distinguish complete service units from individually inspectable internals.
- [ ] **03.5** Alternator diode/heat-sink connections, slip rings, insulators, bearing retainers and brush leads; battery cell/plate construction and cable terminal boots.

## 4. Vehicle wiring, switches and instruments

Cluster, fuse panel, ECM, junction and flashers added; coverage remains incomplete.

- [ ] **04.1** Complete body/engine/dash harnesses, branch lengths, connectors, terminal cavities, grommets, clips, junctions and grounds.
  Progress: ECM 24/32-cavity plugs, enclosure/calibration access, junction studs and ground eyelets added. Remaining: Complete harness branch lengths, actual terminal population, grommets/clips, full pinouts and measured connector forms. The ECM has a simplified board substrate; its original populated board, component identities and complete internal connections remain unverified.
- [ ] **04.2** Fuse block, fusible links, relay bases, ignition switch, stop/reverse/clutch switches and horn assemblies/circuit.
  Progress: 17-position fuse panel, contacts, carrier/hinge/releases, separate flashers and horn relay added. Remaining: Fusible links, ignition/brake/reverse/clutch switches, horn units and complete validated circuits.
- [ ] **04.3** Instrument housings, circuit boards, speedometer/tachometer/gauges and warning lamps; correct 1985 pinouts and circuit links.
  Progress: 47 native cluster selections add the original 1985 face arrangement, individual pointers, ten warning windows/bulb units, pod/lens and mounting sets. Remaining: Measured instrument forms, complete movements/circuit boards, exact 1985 pinouts and electrical operation.
- [ ] **04.4** ECM board, calibration module, connector keying and individual terminals; fuse-panel bus bars, splices, grounds and strain relief through every bulkhead.
- [ ] **04.5** Horn diaphragm/contact mechanism, horn relay and steering-wheel contact; ignition/turn/hazard/dimmer switch contacts, cancellation mechanism and column wiring.

## 5. Ignition and engine controls

Modeled; verification remains.

- [ ] **05.1** Verify the installed distributor variant, pickup/module/coil shapes and exact retaining hardware.
- [ ] **05.2** Verify cylinder numbering, firing-order presentation and factory high-tension lead routing, separators, primary wiring and ground points.
  Progress: Four EST leads now independently selectable with verified A/G/453/B3, B/B/424/D5, C/R/430/B5 and D/E/423/B4 assignments. Cylinder bank identities and 1–2–3–4–5–6 firing order now have factory references. Remaining: Exact HT cap clocking/routing, separators and complete primary wiring/grounds.
- [ ] **05.3** Complete sensor mounting details, vacuum routing and emissions-label configuration; validate tune-up and diagnostic content.
- [ ] **05.4** Distributor shaft bushings/end play, reluctor/pickup relationship, coil windings and terminal insulation; exact ICM thermal interface and fastener hardware.
- [ ] **05.5** EGR valve and control solenoid internals, PCV internals, charcoal-purge interfaces and every calibrated vacuum restriction; verify 1985 emissions configuration.

## 6. Engine castings, internals and induction

Nested lifters, oil-pump and water-pump construction added; original dimensions and remaining internals still require verification.

- [ ] **06.1** Measured block/head/plenum/intake/exhaust castings; all ports, chambers, oil/coolant passages and sealing faces.
  Progress: GM production V6 blueprint inspected: 224 mm block deck height and 44 mm correctly oriented bank stagger now supplement the shared 111.8 mm cylinder pitch. Bore/piston and head-stack geometry corrected; installed engine now shares the detailed surfaces. Remaining: Measured L44 block/head/plenum castings, all ports/chambers/passages, sealing faces and complete internal fit validation.
- [ ] **06.2** Correct 1985–86 intake profiles, valley shield, idle-air tube, manual throttle cable/lever and brackets, fuel/vacuum connections.
- [ ] **06.3** Oil-pump gears/relief/screen/drive, early sump/seal geometry, water-pump impeller/bearing/seal, complete accessory brackets and lifts.
  Progress: Oil-pump construction now complements the nested water-pump internals: separate spur gears, relief piston/spring/pin, cover and fasteners, hollow pickup and wire screen. Static reconstructed interfaces have dedicated mesh checks. Remaining: Original pump geometry and calibration, verified early sump/seals, complete accessory brackets/lifts and measured water-pump construction remain incomplete.
- [ ] **06.4** Complete gaskets, plugs, seals, dowels and fastener counts; verify bearing fits, valve interfaces and engine mounting coordinates.
  Progress: Nonuniform installed engine scaling and coarse duplicate block/head/intake removed. Shared exterior geometry, flywheel, rigid engine/transaxle placement, belt wrap and selected hose/cable connections implemented; geometry checks recorded separately. The 131 mm cam/crank discrepancy is corrected to the GM family 159.03 mm nominal. Coordinated shaft/journal/bearing, sprocket/chain, open cover/gasket and twelve follower/pushrod/guide interfaces pass the expanded actual-mesh timing audit, including the cam insertion envelope. The previous lifter and water-pump additions are retained. This pass adds nine oil-pump selections and replaces the solid pump/pickup proxies; current static geometry and targeted interaction checks are recorded in the generated reports. Remaining: Production mounts, complete gaskets/fasteners, original bearing dimensions/clearances, oil holes, cam phases, lifter internals, exact silent-chain plate stack/pitch/tooth engagement and full casting fits remain unverified. Replacement-based 40/20 teeth do not certify original GM application or tooling.
- [ ] **06.5** All twelve hydraulic lifters: body, plunger spring, ball-check retainer/spring/ball, plunger, metering valve, pushrod seat and retaining ring; verify original dimensions, oil paths and calibrated clearances.
  Progress: All twelve lifters now expose nine selections matching adjacent-year GM figure 46: hollow body, plunger spring, ball-check retainer/spring/ball, hollow plunger, metering valve, pushrod seat and split retaining ring. Actual-mesh checks cover open bores, radial feeds, containment and ball-seat contact. Remaining: Verify original dimensions, retaining-cage shape, oil-port geometry, spring rates, operating clearances, preload and leak-down calibration; inspect and test all relevant contexts.
- [ ] **06.6** Air-cleaner canister/lid, filter pleats and end seals, intake snorkel/ducts, resonator or separator as applicable, mounting isolators, drains and clamps.
- [ ] **06.7** Fuel rail, injector internals/seals/clips, cold-start injector and thermo-time circuit, regulator diaphragm/spring, throttle shaft/bushings, return spring, TPS and IAC passages.
- [ ] **06.8** Oil-pump drive/driven gears, relief valve/spring/retainer, pickup joint and screen; filter media/end caps/anti-drainback construction and every gallery plug.
  Progress: Oil pump and pickup now have twelve nested selections, including nine new gear, cover, relief-mechanism, fastener and screen entries. The prior block and solid pickup proxy have been replaced with an open gear pocket, hollow drive socket, annular pickup tube and wire strainer. Relationships follow adjacent-year GM 1986 L44 figure 23; six actual-mesh checks cover static gear separation, pocket/shaft fits, relief containment and inlet/screen openings. Remaining: Measured original 1985 housing and pickup, verified tooth count/profile and operating mesh, pressure-relief calibration, complete internal galleries and mounting coordinates; filter internals and every gallery plug remain unfinished.

## 7. Four-speed transmission, clutch and halfshafts

Modeled; refinement remains.

- [ ] **07.1** Verify original gear tooth counts, ratios, involute profiles, synchronizer fits and measured case contours.
  Progress: Final-drive mesh sections now contain the factory-specified 84 ring teeth and 23 pinion teeth; clutch facing corrected to nominal 232/155 mm. Remaining: Individual speed-gear tooth counts, measured involute/helix profiles, synchronizer fits and case contours.
- [ ] **07.2** Clutch master/slave internals, reservoirs, pushrods, brackets and hydraulic routing.
- [ ] **07.3** Shifter and selector cable internals, levers, bushings, brackets and cable paths.
- [ ] **07.4** Inner/outer CV joints, unequal halfshafts, boots/clamps, axle hardware and complete transaxle mounts.
- [ ] **07.5** Differential side/spider gears, thrust washers, cross pin, bearing rollers/races, selective shims, speedometer drive and every case plug, vent and seal.
- [ ] **07.6** Synchronizer keys/springs, shift-rail detents/interlocks, reverse idler, bearing retainers and clutch disc damper/pressure-plate release hardware; reconcile the original four-speed variant.

## 8. Brakes and parking brake

Modeled; verification remains.

- [ ] **08.1** Measured caliper/master/booster castings and mounting coordinates; rear piston parking-clutch and sealed-hub internals.
- [ ] **08.2** Combination/proportioning valve internal form and calibration; exact line clips, hose fittings and retaining hardware.
- [ ] **08.3** Parking-brake handle/release/switch internals and cable adjustment geometry.
- [ ] **08.4** Verify hose clearance throughout steering/suspension travel and factory bleeding, adjustment and service specifications.
- [ ] **08.5** Master-cylinder cups, compensating ports, reservoir grommets; booster diaphragm/check valve/reaction mechanism and exact pushrod interfaces.
- [ ] **08.6** Front serviceable wheel-bearing rollers/races/seals, rear hub construction, caliper slider boots, pad clips and each parking-cable guide/retainer.

## 9. Suspension and steering

Modeled; refinement remains.

- [ ] **09.1** Measure frame/control-arm stampings, pivot coordinates, ball-joint interfaces and original bushings.
- [ ] **09.2** Verify WS6 spring codes/rates and rack ratio/tooth count; complete shock, strut and steering-damper internals.
- [ ] **09.3** Steering column, tilt mechanism, bearings, locks, lower shafts, universal joints/couplers and attaching hardware.
- [ ] **09.4** Validate alignment datums, steering stops, suspension travel and full wheel/body clearance.
- [ ] **09.5** Ball-joint internals, tie-rod sockets, rack bushings/preload assembly, pinion bearings, gaiter vents and lubrication interfaces.
- [ ] **09.6** Spring isolators, bump stops, strut top bearings/mounts and damper piston/valving; distinguish physical construction from unverified WS6 calibration.

## 10. Wheels, tires, spare and tools

Refinement and detail missing.

- [ ] **10.1** Accurate original wheel faces, inner barrels, center caps, lug seats/nuts, valve stems and balance weights.
- [ ] **10.2** Correct tire profiles, tread and sidewall markings for each verified factory wheel/tire preview.
- [ ] **10.3** Compact spare, jack mechanism, lug wrench, retainers and front-compartment stowage hardware.
- [ ] **10.4** Spare-tire valve and retaining bolt, jack screw/thrust bearing/pivots, handle engagement and front-compartment labels; verify stowage clearances with the hood and sunroof panel.

## 11. Fuel supply and evaporative emissions

Modeled; refinement remains.

- [ ] **11.1** Measured early tank shell/baffles and verified capacity; sender travel/resistance calibration.
- [ ] **11.2** Pump, filter and canister internals; exact filler/vent/return/purge routing, clamps, clips and electrical connections.
- [ ] **11.3** Verify factory fuel-system interfaces and complete documented service content.
- [ ] **11.4** In-tank pump motor/brushes, inlet strainer, outlet/check valve, pulsation damper as applicable, sender rheostat/wiper, float and electrical feedthrough.
- [ ] **11.5** Fuel-cap pressure/vacuum mechanism, filler ground strap, separator/vent details and tank mounting cushions; verify early-tank callouts rather than applying later capacity.

## 12. Exhaust and heat shields

Modeled; refinement remains.

- [ ] **12.1** Measured manifold/crossover profiles, collector junctions and production pipe bends.
- [ ] **12.2** Muffler internal chambers/baffles and verified early converter construction.
- [ ] **12.3** Exact shield stampings, hangers, spring positions, tailpipe finish/application and heat/body clearances.
- [ ] **12.4** Manifold studs/nuts, flange sealing interfaces, oxygen-sensor seat, shield spacers and all spring/strap isolators; reconcile 1985 manual-transmission routing.

## 13. Cooling

Water-pump construction added; original pump details and fan internals remain.

- [ ] **13.1** Complete water-pump and fan-motor internals; verify original fan/shroud option.
- [ ] **13.2** Measured radiator, coolant-pipe and hose bends, clamp/support locations, sender/switch fittings and clearance.
  Progress: Radiator package and front hose endpoints corrected to remove interference with the accepted hood; minimum checked gap 6.3906 mm. Remaining: Measured production mounting datum, all pipe/hose bends, clamp coordinates and full clearances.
- [ ] **13.3** Validate coolant filling/bleeding, capacities, thermostat and pressure specifications from 1985 sources.
  Progress: The 1985 owner VIN-code-9 row confirms approximate 13.0 L system capacity and Pontiac nominal data confirms 103.4 kPa / 15 psi radiator-cap pressure. All twenty original coolant replacement steps are now integrated into the interactive guide, including flushing, recovery-bottle cleaning, staged cap release, thermostat removal/refit and timed purge. Each step selects a real thermostat, radiator, pipe or recovery component. Pipe-plug torque remains limited to the underbody plugs. Source pages were visually inspected again; physical workshop validation is still pending. Remaining: Separately model and verify optional block-drain hardware, original reservoir/tooling/markings and access/removal paths; physically validate the complete guide and remaining factory cooling interfaces.
- [ ] **13.4** Water-pump hub, unitized shaft/bearing, mechanical seal, impeller and weep passage: verify original supplier construction, vane count, chamber and press fits; retain complete-pump replacement as the documented service boundary.
  Progress: Hub, unitized shaft/bearing, mechanical seal assembly and open centrifugal impeller are individually selectable. Reconstructed parts fit the shared shaft/chamber envelope. Generic GMB construction is distinguished from original GM application evidence. Remaining: Original L44 supplier drawing or measured pump, exact impeller vane count/profile/material, weep passage, bearing internals, seal stack and press fits; validate remaining pump/cooling interfaces.
- [ ] **13.5** Radiator fan motor armature, magnets, commutator, brushes/springs, bearings, end covers and connector; radiator cap pressure/vacuum valves and recovery-bottle pickup.

## 14. Heating, ventilation and air conditioning

Modeled; refinement remains.

- [ ] **14.1** Measured C41/C60 case/duct profiles, door seals, linkage positions and calibrated travel.
- [ ] **14.2** Blower and electric-actuator internals, switch contacts, resistor/relay wiring and verified control circuits.
- [ ] **14.3** Complete original A/C compressor/clutch, condenser, refrigerant lines, fittings, O-rings and accumulator internals; verify application before assigning dimensions.
- [ ] **14.4** Expansion/orifice device and screen, pressure switches, service valves/caps, compressor shaft seal, pistons/valves and clutch bearing/air gap for the verified original compressor.
- [ ] **14.5** Fresh-air intake screen, cowl drains, heater-core pipe seals, condensate drain, vacuum/electrical control internals and every case clip/foam seal.

## 15. Doors, windows, locks and mirrors

Detail missing.

- [ ] **15.1** Manual/power window regulators, motors, rollers, stops, glass channels, felt guides and seals.
- [ ] **15.2** Complete latch and key-cylinder internals, lock rods/clips, power-lock actuators, switches and harnesses.
- [ ] **15.3** Manual/power mirror pivots, adjustment mechanisms, cable/wiring, mounting pads and hardware.
  Progress: Both mirrors now have tapered rounded shells, separate recessed glass/carriers and independent pedestals/pads using the inspected GM CD PDF 288 layout. Remaining: Original dimensions, manual/electric adjuster internals, cables/wiring, mounting hardware and calibrated travel.
- [ ] **15.4** Door weatherstrip cross-sections, belt moldings, inner shields and complete trim attachments.
  Progress: Outside handles, key bezels, ribbed door rub moldings and outer window belt seals now have separate native selections. Remaining: Measured weatherstrip sections, inner shields, complete belt molding attachments, channels/felts and trim retaining inventory.
- [ ] **15.5** Door hinge pins/bushings, check/hold-open mechanism, striker spacers, anti-rattle hardware and glass stop adjustments; verify full door and glass movement without clashes.

## 16. Wipers, washer and defroster

Detail missing.

- [ ] **16.1** Wiper motor/gearbox, transmission links, pivots, delay control and exact blade/arm construction.
  Progress: Separate left/right parked arms, pivot caps and 18-inch-envelope blade/refill assemblies replace the short windshield-line proxies; GM CD PDF 284 inspected. Remaining: Motor/gearbox, hidden transmission/pivots, calibrated full sweep, delay controls, exact holder tooling and complete arm construction.
- [ ] **16.2** Washer pump, bottle details, hoses, clips, nozzles and wiring.
- [ ] **16.3** Rear-window defroster grid/terminals, switch, relay, wiring and original-option application.
- [ ] **16.4** Wiper park contacts, delay board, motor brush/bearing stack, arm splines/springs and blade refill clips; washer impeller/check valves and nozzle passages.

## 17. Body panels, roof and structure

Exterior panels and 42 separate exterior pieces revised; measured contours and owner review remain.

- [ ] **17.1** Measured panel curvature, sections, datums and gaps: front/rear fascias, hood, front fenders, doors, rockers, quarters and rear roof clip. Radiator-to-hood interference has been corrected and checked; measured factory placement remains unverified.
  Progress: R8 covers the full exterior: refitted straight side/wraparound moldings, accurately clipped fuel/intake openings, intake below the molding, exposed lower nose deflector, smoother road-tire silhouette, revised machined wheel/sail/paint/lamp finishes and close-view inspection. The deeper R7 rear apron and softened upper lamp corners remain. Sixteen selected dimensional comparisons and separate actual-mesh interface audits support development review. Two bumper-reference interpretations and factory tooling accuracy remain unresolved; owner approval is not asserted. Remaining: Measured panel sections, datums, curvature and gap dimensions throughout the car; final owner appearance review.
- [ ] **17.2** Refine A/B/C pillars, small sail windows, recessed rear window, decklid/vents and rear bumper geometry against source dimensions.
  Progress: R8 covers the full exterior: refitted straight side/wraparound moldings, accurately clipped fuel/intake openings, intake below the molding, exposed lower nose deflector, smoother road-tire silhouette, revised machined wheel/sail/paint/lamp finishes and close-view inspection. The deeper R7 rear apron and softened upper lamp corners remain. Sixteen selected dimensional comparisons and separate actual-mesh interface audits support development review. Two bumper-reference interpretations and factory tooling accuracy remain unresolved; owner approval is not asserted. Remaining: Measured A/B/C-pillar, backlight, decklid/vent and rear bumper sections; final owner visual approval.
- [ ] **17.3** Complete space-frame stampings, weld/joint locations, bulkheads, floor/tunnel, rails, bumper beams and energy absorbers.
- [ ] **17.4** Fascia supports, wheelhouse liners, air deflectors, seals and every verified panel retainer.
  Progress: Visible fascia moldings, pads, lower front deflector, intake grille and existing four liners/retaining sets are separately explorable. Remaining: Original fascia supports, complete air deflectors/seals, measured liner forms and drawing-by-drawing reconciliation of every retainer.
- [ ] **17.5** Finish sunroof latch internals, measured seal sections, water management and stowage; separate AD3 hinge tongues, bushings, latch housing/button, trim frames and fasteners are modeled, with static reconstructed placement.
  Progress: AD3 roof construction now includes 16 separate hinge/bushing/nut, handle, release housing/button, trim, deflector and fastening selections. Panel-mounted pieces follow the removable glass; body-side pieces remain with the open roof. Glass underside/edges and a stepped aperture seal are modeled from the GM component relationships. Remaining: Measured glass and weatherstrip sections, latch detents/springs and calibrated travel, verified water management/drains and front-compartment stowage, complete headliner/adhesive details.
- [ ] **17.6** Wing or luggage-rack mounts/pads/reinforcement, option-specific deck torque rods, fuel-door hinge/latch and power-release mechanisms.
  Progress: Carrier and pedestal wing now have independent selections with configuration-aware visibility. Driver fuel door, pocket and hinge now separate from the quarter skin; filler cap recessed behind the closed door. Remaining: Verified mounts/pads/reinforcement, option-specific torque rods, full fuel-door release and power-release mechanisms, measured geometry and travel.
- [ ] **17.7** Front/rear compartment seals, drain plugs, service access covers, trunk lining, battery-side heat insulation and concealed harness/pipe brackets.
- [ ] **17.8** Glazing encapsulation/adhesive sections, sail-panel attachments, seam sealer, structural adhesives and original corrosion coatings; no invented structural dimensions.

## 18. Seats, restraints, trim and cabin controls

Detail missing.

- [ ] **18.1** Seat frames, tracks, recliners, cushion construction, speaker internals and mounting hardware.
- [ ] **18.2** Seat-belt retractors, buckles, anchors, covers and warning-switch wiring.
- [ ] **18.3** Dashboard/console/door trim moldings, hidden attachments, carpet, insulation and sound pads.
- [ ] **18.4** Pedal pivots, throttle cable/return hardware, shifter boot/control details, radio and speaker assemblies/wiring.
- [ ] **18.5** Sun visors/pivots, interior rear-view mirror mount, assist/trim hardware, ashtray/cigarette lighter, radio controls/antenna/coax and speaker cones/magnets.
- [ ] **18.6** Pedal bushings/return springs, clutch and brake stop pads, accelerator hinge/cable end, console skeleton and every removable carpet/trim retainer.

## 19. Factory options and interchange

Coverage incomplete.

- [ ] **19.1** Complete cruise-control hardware/cables/switches and verified option-specific electrical/vacuum architecture.
- [ ] **19.2** Finish supported factory alternatives for tilt, power windows/locks/mirrors/releases, delay wipers, lighting packages, defroster and roof equipment.
- [ ] **19.3** Verify model-year/RPO/side compatibility for swap previews; separate original build facts from preview choices.
- [ ] **19.4** Original paint/trim, spring codes and other undocumented installed RPOs remain unknown; the VIN alone does not establish them.
- [ ] **19.5** RPO/SPID, emissions, tire/loading and service labels; factory lettering/placement and paint/trim alternatives with unknown original build choices kept explicit.
- [ ] **19.6** For each supported swap, list all required brackets, harness changes, fasteners, control changes and year/side dependencies; preview compatibility does not establish safe interchange.

## 20. Specifications, procedures and final acceptance

Required across every system.

- [ ] **20.1** Source every published part identity/application, fastener quantity, torque, clearance, fluid and maintenance value.
  Progress: Intact 1985 owner manual acquired; fuse ratings, bulb identities and EST terminal assignments inspected and recorded. Remaining: All other identities, applications, quantities, torque, clearance, fluid and maintenance values across the full inventory.
- [ ] **20.2** Build validated step-by-step procedures with tools, access, removal/refit order and verification linked to the actual selectable parts.
  Progress: Two source-checked interactive guides now provide the nine-step 1985 headlamp sequence and complete twenty-step coolant replacement sequence. All steps select actual modeled components across their respective inspection scopes. The coolant guide retains flushing, bottle cleaning, pressure-release stages, thermostat order and the qualified pipe-plug torque. Shared navigation supports per-step assembly changes and guide-specific temporary configuration. Browser results are recorded separately from physical workshop validation. Remaining: Complete procedures for the remaining systems, optional coolant block-drain selections, verified tools/access and removal paths, and physical workshop validation of the finished guides.
- [ ] **20.3** Check left/right orientation, assembly interfaces, full travel, hose/cable routing and clashes throughout the car.
  Progress: R8 covers the full exterior: refitted straight side/wraparound moldings, accurately clipped fuel/intake openings, intake below the molding, exposed lower nose deflector, smoother road-tire silhouette, revised machined wheel/sail/paint/lamp finishes and close-view inspection. The deeper R7 rear apron and softened upper lamp corners remain. Sixteen selected dimensional comparisons and separate actual-mesh interface audits support development review. Two bumper-reference interpretations and factory tooling accuracy remain unresolved; owner approval is not asserted. Remaining: Calibrated full travel, complete routing and clash checks throughout the vehicle.
- [ ] **20.4** Review close-up surface accuracy/materials and assembled/exploded interaction for each system; test desktop and mobile performance.
  Progress: R8 covers the full exterior: refitted straight side/wraparound moldings, accurately clipped fuel/intake openings, intake below the molding, exposed lower nose deflector, smoother road-tire silhouette, revised machined wheel/sail/paint/lamp finishes and close-view inspection. The deeper R7 rear apron and softened upper lamp corners remain. Sixteen selected dimensional comparisons and separate actual-mesh interface audits support development review. Two bumper-reference interpretations and factory tooling accuracy remain unresolved; owner approval is not asserted. Remaining: Finish the remaining current-source full-suite scenarios, refreshed native hardware review, complete device performance, measured factory tooling, hidden mechanisms and physical assembly interfaces. Owner acceptance of the revised body remains pending.
- [ ] **20.5** Resolve remaining provenance/licensing and dimensional evidence gaps before claiming a complete photorealistic, factory-spec manual.
  Progress: Native mesh/procedural-surface provenance recorded; Three.js/Vite notices and identified CC0 lighting asset now ship in the production package. Distribution audit passed with no reference scans, component photos or imported car meshes. Remaining: Resolve measured geometry and complete original-application evidence throughout the model before any full photorealistic factory-spec claim. Current reference evidence remains insufficient for several production surfaces, hidden mechanisms and variants.
- [ ] **20.6** Reconcile all applicable GM parts-book callouts, service-manual subassemblies and hardware quantities against the selectable inventory; explicitly record missing, grouped, option-dependent and unverified items in every area.
  Progress: Generated an index of every current detail selection with section, reference/callout and option metadata, and mapped each of the 13 families to the 20 checklist areas. Areas without dedicated complete explorers and grouped/overlapping selections are explicitly identified. Targeted distributor, valve and lifter callout checks exist. Remaining: Complete drawing-by-drawing reconciliation of all applicable GM callouts, service internals, physical hardware quantities and option/year variants. The authored catalog alone cannot prove a complete factory bill of materials.
- [ ] **20.7** For every nested assembly, verify selection, independent explosion, isolation, return navigation and option visibility; retain current-source evidence and an inspected assembled/exploded close-up.
