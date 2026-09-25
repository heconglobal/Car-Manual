// Model/manual development backlog, not repairs diagnosed on the owner’s car.
// Append within existing areas to preserve acceptance IDs. Presence is not acceptance.
export const remainingWork=[
  {
    "name": "Headlights",
    "stage": "Relay internals, individual terminals, motor conductors and C/D fusible-link construction added; factory calibration remains",
    "assembly": "headlight-system",
    "items": [
      "Check the new LH/RH lamp, cover, linkage, early motor and relay breakdown in UAT.",
      "Verify measured cover/bucket profiles, actuator case dimensions, exact gear teeth/ratios, brush/contact shapes and all retainers.",
      "Calibrate hinge/crank travel and clearances through the full movement; nominal bulb position and constant-length reconstructed linkage are checked, while production pivots, cover contact and motor stops remain unverified.",
      "Complete the 1985 headlight switch, dimmer linkage, circuit pinouts, fusible links and factory harness routing; validate aiming and diagnostic procedures.",
      "Lamp aiming screws, spring seats, bucket bushings, motor bracket welds and connector retainers: reconcile every 1985 drawing callout with a selectable part or named hardware set."
    ]
  },
  {
    "name": "Other exterior and interior lighting",
    "stage": "Detailed assemblies added; verification remains",
    "assembly": "lighting-system",
    "items": [
      "Front park/turn lamps and side markers: housings, optical lenses, bulbs, sockets, gaskets, brackets and screws.",
      "Rear stop/turn/tail and reverse lamps: separate chambers, lens sections, reflectors, bulbs, sockets, seals and fasteners.",
      "License lamps, courtesy lamps, dome/map lighting and instrument illumination; correct factory option variants.",
      "Optical prism/flute geometry, lens lettering, reflector plating and bulb-filament/support geometry; establish original lens and socket variants before accepting appearance."
    ]
  },
  {
    "name": "Battery, starting and charging",
    "stage": "Detailed assemblies added; verification remains",
    "assembly": "charging-system",
    "items": [
      "Battery case/caps, terminals, tray, hold-down and vent/insulation details; complete positive/negative cables and ground straps.",
      "Original starter: housing, solenoid, drive, armature/brushes, mounting and cable interfaces.",
      "Alternator: cast housings, rotor/stator, bearings, regulator/rectifier, brushes, pulley, fan and brackets; original belt routing.",
      "Starter overrunning clutch, shift fork, solenoid contact disc, brush springs and thrust hardware; distinguish complete service units from individually inspectable internals.",
      "Alternator diode/heat-sink connections, slip rings, insulators, bearing retainers and brush leads; battery cell/plate construction and cable terminal boots."
    ]
  },
  {
    "name": "Vehicle wiring, switches and instruments",
    "stage": "Cluster, fuse panel, ECM, junction and flashers added; coverage remains incomplete",
    "assembly": "wiring-system",
    "items": [
      "Complete body/engine/dash harnesses, branch lengths, connectors, terminal cavities, grommets, clips, junctions and grounds.",
      "Fuse block, fusible links, relay bases, ignition switch, stop/reverse/clutch switches and horn assemblies/circuit.",
      "Instrument housings, circuit boards, speedometer/tachometer/gauges and warning lamps; correct 1985 pinouts and circuit links.",
      "ECM board, calibration module, connector keying and individual terminals; fuse-panel bus bars, splices, grounds and strain relief through every bulkhead.",
      "Horn diaphragm/contact mechanism, horn relay and steering-wheel contact; ignition/turn/hazard/dimmer switch contacts, cancellation mechanism and column wiring."
    ]
  },
  {
    "name": "Ignition and engine controls",
    "stage": "Modeled; verification remains",
    "assembly": "ignition",
    "items": [
      "Verify the installed distributor variant, pickup/module/coil shapes and exact retaining hardware.",
      "Verify cylinder numbering, firing-order presentation and factory high-tension lead routing, separators, primary wiring and ground points.",
      "Complete sensor mounting details, vacuum routing and emissions-label configuration; validate tune-up and diagnostic content.",
      "Distributor shaft bushings/end play, reluctor/pickup relationship, coil windings and terminal insulation; exact ICM thermal interface and fastener hardware.",
      "EGR valve and control solenoid internals, PCV internals, charcoal-purge interfaces and every calibrated vacuum restriction; verify 1985 emissions configuration."
    ]
  },
  {
    "name": "Engine castings, internals and induction",
    "stage": "Twelve nested lifters and water-pump construction added; original dimensions and remaining internals still require verification",
    "assembly": "engine",
    "items": [
      "Measured block/head/plenum/intake/exhaust castings; all ports, chambers, oil/coolant passages and sealing faces.",
      "Correct 1985–86 intake profiles, valley shield, idle-air tube, manual throttle cable/lever and brackets, fuel/vacuum connections.",
      "Oil-pump gears/relief/screen/drive, early sump/seal geometry, water-pump impeller/bearing/seal, complete accessory brackets and lifts.",
      "Complete gaskets, plugs, seals, dowels and fastener counts; verify bearing fits, valve interfaces and engine mounting coordinates.",
      "All twelve hydraulic lifters: body, plunger spring, ball-check retainer/spring/ball, plunger, metering valve, pushrod seat and retaining ring; verify original dimensions, oil paths and calibrated clearances.",
      "Air-cleaner canister/lid, filter pleats and end seals, intake snorkel/ducts, resonator or separator as applicable, mounting isolators, drains and clamps.",
      "Fuel rail, injector internals/seals/clips, cold-start injector and thermo-time circuit, regulator diaphragm/spring, throttle shaft/bushings, return spring, TPS and IAC passages.",
      "Oil-pump drive/driven gears, relief valve/spring/retainer, pickup joint and screen; filter media/end caps/anti-drainback construction and every gallery plug."
    ]
  },
  {
    "name": "Four-speed transmission, clutch and halfshafts",
    "stage": "Modeled; refinement remains",
    "assembly": "transmission",
    "items": [
      "Verify original gear tooth counts, ratios, involute profiles, synchronizer fits and measured case contours.",
      "Clutch master/slave internals, reservoirs, pushrods, brackets and hydraulic routing.",
      "Shifter and selector cable internals, levers, bushings, brackets and cable paths.",
      "Inner/outer CV joints, unequal halfshafts, boots/clamps, axle hardware and complete transaxle mounts.",
      "Differential side/spider gears, thrust washers, cross pin, bearing rollers/races, selective shims, speedometer drive and every case plug, vent and seal.",
      "Synchronizer keys/springs, shift-rail detents/interlocks, reverse idler, bearing retainers and clutch disc damper/pressure-plate release hardware; reconcile the original four-speed variant."
    ]
  },
  {
    "name": "Brakes and parking brake",
    "stage": "Modeled; verification remains",
    "assembly": "braking-system",
    "items": [
      "Measured caliper/master/booster castings and mounting coordinates; rear piston parking-clutch and sealed-hub internals.",
      "Combination/proportioning valve internal form and calibration; exact line clips, hose fittings and retaining hardware.",
      "Parking-brake handle/release/switch internals and cable adjustment geometry.",
      "Verify hose clearance throughout steering/suspension travel and factory bleeding, adjustment and service specifications.",
      "Master-cylinder cups, compensating ports, reservoir grommets; booster diaphragm/check valve/reaction mechanism and exact pushrod interfaces.",
      "Front serviceable wheel-bearing rollers/races/seals, rear hub construction, caliper slider boots, pad clips and each parking-cable guide/retainer."
    ]
  },
  {
    "name": "Suspension and steering",
    "stage": "Modeled; refinement remains",
    "assembly": "suspension-system",
    "items": [
      "Measure frame/control-arm stampings, pivot coordinates, ball-joint interfaces and original bushings.",
      "Verify WS6 spring codes/rates and rack ratio/tooth count; complete shock, strut and steering-damper internals.",
      "Steering column, tilt mechanism, bearings, locks, lower shafts, universal joints/couplers and attaching hardware.",
      "Validate alignment datums, steering stops, suspension travel and full wheel/body clearance.",
      "Ball-joint internals, tie-rod sockets, rack bushings/preload assembly, pinion bearings, gaiter vents and lubrication interfaces.",
      "Spring isolators, bump stops, strut top bearings/mounts and damper piston/valving; distinguish physical construction from unverified WS6 calibration."
    ]
  },
  {
    "name": "Wheels, tires, spare and tools",
    "stage": "Refinement and detail missing",
    "items": [
      "Accurate original wheel faces, inner barrels, center caps, lug seats/nuts, valve stems and balance weights.",
      "Correct tire profiles, tread and sidewall markings for each verified factory wheel/tire preview.",
      "Compact spare, jack mechanism, lug wrench, retainers and front-compartment stowage hardware.",
      "Spare-tire valve and retaining bolt, jack screw/thrust bearing/pivots, handle engagement and front-compartment labels; verify stowage clearances with the hood and sunroof panel."
    ]
  },
  {
    "name": "Fuel supply and evaporative emissions",
    "stage": "Modeled; refinement remains",
    "assembly": "fuel-system",
    "items": [
      "Measured early tank shell/baffles and verified capacity; sender travel/resistance calibration.",
      "Pump, filter and canister internals; exact filler/vent/return/purge routing, clamps, clips and electrical connections.",
      "Verify factory fuel-system interfaces and complete documented service content.",
      "In-tank pump motor/brushes, inlet strainer, outlet/check valve, pulsation damper as applicable, sender rheostat/wiper, float and electrical feedthrough.",
      "Fuel-cap pressure/vacuum mechanism, filler ground strap, separator/vent details and tank mounting cushions; verify early-tank callouts rather than applying later capacity."
    ]
  },
  {
    "name": "Exhaust and heat shields",
    "stage": "Modeled; refinement remains",
    "assembly": "exhaust-system",
    "items": [
      "Measured manifold/crossover profiles, collector junctions and production pipe bends.",
      "Muffler internal chambers/baffles and verified early converter construction.",
      "Exact shield stampings, hangers, spring positions, tailpipe finish/application and heat/body clearances.",
      "Manifold studs/nuts, flange sealing interfaces, oxygen-sensor seat, shield spacers and all spring/strap isolators; reconcile 1985 manual-transmission routing."
    ]
  },
  {
    "name": "Cooling",
    "stage": "Water-pump construction added; original pump details and fan internals remain",
    "assembly": "cooling-system",
    "items": [
      "Complete water-pump and fan-motor internals; verify original fan/shroud option.",
      "Measured radiator, coolant-pipe and hose bends, clamp/support locations, sender/switch fittings and clearance.",
      "Validate coolant filling/bleeding, capacities, thermostat and pressure specifications from 1985 sources.",
      "Water-pump hub, unitized shaft/bearing, mechanical seal, impeller and weep passage: verify original supplier construction, vane count, chamber and press fits; retain complete-pump replacement as the documented service boundary.",
      "Radiator fan motor armature, magnets, commutator, brushes/springs, bearings, end covers and connector; radiator cap pressure/vacuum valves and recovery-bottle pickup."
    ]
  },
  {
    "name": "Heating, ventilation and air conditioning",
    "stage": "Modeled; refinement remains",
    "assembly": "hvac-system",
    "items": [
      "Measured C41/C60 case/duct profiles, door seals, linkage positions and calibrated travel.",
      "Blower and electric-actuator internals, switch contacts, resistor/relay wiring and verified control circuits.",
      "Complete original A/C compressor/clutch, condenser, refrigerant lines, fittings, O-rings and accumulator internals; verify application before assigning dimensions.",
      "Expansion/orifice device and screen, pressure switches, service valves/caps, compressor shaft seal, pistons/valves and clutch bearing/air gap for the verified original compressor.",
      "Fresh-air intake screen, cowl drains, heater-core pipe seals, condensate drain, vacuum/electrical control internals and every case clip/foam seal."
    ]
  },
  {
    "name": "Doors, windows, locks and mirrors",
    "stage": "Detail missing",
    "assembly": "body-system",
    "items": [
      "Manual/power window regulators, motors, rollers, stops, glass channels, felt guides and seals.",
      "Complete latch and key-cylinder internals, lock rods/clips, power-lock actuators, switches and harnesses.",
      "Manual/power mirror pivots, adjustment mechanisms, cable/wiring, mounting pads and hardware.",
      "Door weatherstrip cross-sections, belt moldings, inner shields and complete trim attachments.",
      "Door hinge pins/bushings, check/hold-open mechanism, striker spacers, anti-rattle hardware and glass stop adjustments; verify full door and glass movement without clashes."
    ]
  },
  {
    "name": "Wipers, washer and defroster",
    "stage": "Detail missing",
    "items": [
      "Wiper motor/gearbox, transmission links, pivots, delay control and exact blade/arm construction.",
      "Washer pump, bottle details, hoses, clips, nozzles and wiring.",
      "Rear-window defroster grid/terminals, switch, relay, wiring and original-option application.",
      "Wiper park contacts, delay board, motor brush/bearing stack, arm splines/springs and blade refill clips; washer impeller/check valves and nozzle passages."
    ]
  },
  {
    "name": "Body panels, roof and structure",
    "stage": "Modeled; specification audit remains",
    "assembly": "body-system",
    "items": [
      "Measured panel curvature, sections, datums and gaps: front/rear fascias, hood, front fenders, doors, rockers, quarters and rear roof clip. Radiator-to-hood interference has been corrected and checked; measured factory placement remains unverified.",
      "Refine A/B/C pillars, small sail windows, recessed rear window, decklid/vents and rear bumper geometry against source dimensions.",
      "Complete space-frame stampings, weld/joint locations, bulkheads, floor/tunnel, rails, bumper beams and energy absorbers.",
      "Fascia supports, wheelhouse liners, air deflectors, seals and every verified panel retainer.",
      "Sunroof latch/seals/drains/stowage, roof trim and glazing adhesive/weatherstrip sections.",
      "Wing or luggage-rack mounts/pads/reinforcement, option-specific deck torque rods, fuel-door hinge/latch and power-release mechanisms.",
      "Front/rear compartment seals, drain plugs, service access covers, trunk lining, battery-side heat insulation and concealed harness/pipe brackets.",
      "Glazing encapsulation/adhesive sections, sail-panel attachments, seam sealer, structural adhesives and original corrosion coatings; no invented structural dimensions."
    ]
  },
  {
    "name": "Seats, restraints, trim and cabin controls",
    "stage": "Detail missing",
    "items": [
      "Seat frames, tracks, recliners, cushion construction, speaker internals and mounting hardware.",
      "Seat-belt retractors, buckles, anchors, covers and warning-switch wiring.",
      "Dashboard/console/door trim moldings, hidden attachments, carpet, insulation and sound pads.",
      "Pedal pivots, throttle cable/return hardware, shifter boot/control details, radio and speaker assemblies/wiring.",
      "Sun visors/pivots, interior rear-view mirror mount, assist/trim hardware, ashtray/cigarette lighter, radio controls/antenna/coax and speaker cones/magnets.",
      "Pedal bushings/return springs, clutch and brake stop pads, accelerator hinge/cable end, console skeleton and every removable carpet/trim retainer."
    ]
  },
  {
    "name": "Factory options and interchange",
    "stage": "Coverage incomplete",
    "items": [
      "Complete cruise-control hardware/cables/switches and verified option-specific electrical/vacuum architecture.",
      "Finish supported factory alternatives for tilt, power windows/locks/mirrors/releases, delay wipers, lighting packages, defroster and roof equipment.",
      "Verify model-year/RPO/side compatibility for swap previews; separate original build facts from preview choices.",
      "Original paint/trim, spring codes and other undocumented installed RPOs remain unknown; the VIN alone does not establish them.",
      "RPO/SPID, emissions, tire/loading and service labels; factory lettering/placement and paint/trim alternatives with unknown original build choices kept explicit.",
      "For each supported swap, list all required brackets, harness changes, fasteners, control changes and year/side dependencies; preview compatibility does not establish safe interchange."
    ]
  },
  {
    "name": "Specifications, procedures and final acceptance",
    "stage": "Required across every system",
    "items": [
      "Source every published part identity/application, fastener quantity, torque, clearance, fluid and maintenance value.",
      "Build validated step-by-step procedures with tools, access, removal/refit order and verification linked to the actual selectable parts.",
      "Check left/right orientation, assembly interfaces, full travel, hose/cable routing and clashes throughout the car.",
      "Review close-up surface accuracy/materials and assembled/exploded interaction for each system; test desktop and mobile performance.",
      "Resolve remaining provenance/licensing and dimensional evidence gaps before claiming a complete photorealistic, factory-spec manual.",
      "Reconcile all applicable GM parts-book callouts, service-manual subassemblies and hardware quantities against the selectable inventory; explicitly record missing, grouped, option-dependent and unverified items in every area.",
      "For every nested assembly, verify selection, independent explosion, isolation, return navigation and option visibility; retain current-source evidence and an inspected assembled/exploded close-up."
    ]
  }
];
