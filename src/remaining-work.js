// Development backlog: these entries describe the model/manual, not repairs
// known to be needed on the owner's physical car. No category is certified
// complete merely because its geometry can be inspected.
export const remainingWork=[
 {name:'Headlights',stage:'Nominal bulb position and reconstructed linkage checked; factory calibration remains',assembly:'headlight-system',items:[
  'Check the new LH/RH lamp, cover, linkage, early motor and relay breakdown in UAT.',
  'Verify measured cover/bucket profiles, actuator case dimensions, exact gear teeth/ratios, brush/contact shapes and all retainers.',
  'Calibrate hinge/crank travel and clearances through the full movement; nominal bulb position and constant-length reconstructed linkage are checked, while production pivots, cover contact and motor stops remain unverified.',
  'Complete the 1985 headlight switch, dimmer linkage, circuit pinouts, fusible links and factory harness routing; validate aiming and diagnostic procedures.'
 ]},
 {name:'Other exterior and interior lighting',stage:'Detailed assemblies added; verification remains',assembly:'lighting-system',items:[
  'Front park/turn lamps and side markers: housings, optical lenses, bulbs, sockets, gaskets, brackets and screws.',
  'Rear stop/turn/tail and reverse lamps: separate chambers, lens sections, reflectors, bulbs, sockets, seals and fasteners.',
  'License lamps, courtesy lamps, dome/map lighting and instrument illumination; correct factory option variants.'
 ]},
 {name:'Battery, starting and charging',stage:'Detailed assemblies added; verification remains',assembly:'charging-system',items:[
  'Battery case/caps, terminals, tray, hold-down and vent/insulation details; complete positive/negative cables and ground straps.',
  'Original starter: housing, solenoid, drive, armature/brushes, mounting and cable interfaces.',
  'Alternator: cast housings, rotor/stator, bearings, regulator/rectifier, brushes, pulley, fan and brackets; original belt routing.'
 ]},
 {name:'Vehicle wiring, switches and instruments',stage:'Cluster, fuse panel, ECM, junction and flashers added; coverage remains incomplete',assembly:'wiring-system',items:[
  'Complete body/engine/dash harnesses, branch lengths, connectors, terminal cavities, grommets, clips, junctions and grounds.',
  'Fuse block, fusible links, relay bases, ignition switch, stop/reverse/clutch switches and horn assemblies/circuit.',
  'Instrument housings, circuit boards, speedometer/tachometer/gauges and warning lamps; correct 1985 pinouts and circuit links.'
 ]},
 {name:'Ignition and engine controls',stage:'Modeled; verification remains',assembly:'ignition',items:[
  'Verify the installed distributor variant, pickup/module/coil shapes and exact retaining hardware.',
  'Verify cylinder numbering, firing-order presentation and factory high-tension lead routing, separators, primary wiring and ground points.',
  'Complete sensor mounting details, vacuum routing and emissions-label configuration; validate tune-up and diagnostic content.'
 ]},
 {name:'Engine castings, internals and induction',stage:'Modeled; refinement remains',assembly:'engine',items:[
  'Measured block/head/plenum/intake/exhaust castings; all ports, chambers, oil/coolant passages and sealing faces.',
  'Correct 1985–86 intake profiles, valley shield, idle-air tube, manual throttle cable/lever and brackets, fuel/vacuum connections.',
  'Oil-pump gears/relief/screen/drive, early sump/seal geometry, water-pump impeller/bearing/seal, complete accessory brackets and lifts.',
  'Complete gaskets, plugs, seals, dowels and fastener counts; verify bearing fits, valve interfaces and engine mounting coordinates.'
 ]},
 {name:'Four-speed transmission, clutch and halfshafts',stage:'Modeled; refinement remains',assembly:'transmission',items:[
  'Verify original gear tooth counts, ratios, involute profiles, synchronizer fits and measured case contours.',
  'Clutch master/slave internals, reservoirs, pushrods, brackets and hydraulic routing.',
  'Shifter and selector cable internals, levers, bushings, brackets and cable paths.',
  'Inner/outer CV joints, unequal halfshafts, boots/clamps, axle hardware and complete transaxle mounts.'
 ]},
 {name:'Brakes and parking brake',stage:'Modeled; verification remains',assembly:'braking-system',items:[
  'Measured caliper/master/booster castings and mounting coordinates; rear piston parking-clutch and sealed-hub internals.',
  'Combination/proportioning valve internal form and calibration; exact line clips, hose fittings and retaining hardware.',
  'Parking-brake handle/release/switch internals and cable adjustment geometry.',
  'Verify hose clearance throughout steering/suspension travel and factory bleeding, adjustment and service specifications.'
 ]},
 {name:'Suspension and steering',stage:'Modeled; refinement remains',assembly:'suspension-system',items:[
  'Measure frame/control-arm stampings, pivot coordinates, ball-joint interfaces and original bushings.',
  'Verify WS6 spring codes/rates and rack ratio/tooth count; complete shock, strut and steering-damper internals.',
  'Steering column, tilt mechanism, bearings, locks, lower shafts, universal joints/couplers and attaching hardware.',
  'Validate alignment datums, steering stops, suspension travel and full wheel/body clearance.'
 ]},
 {name:'Wheels, tires, spare and tools',stage:'Refinement and detail missing',items:[
  'Accurate original wheel faces, inner barrels, center caps, lug seats/nuts, valve stems and balance weights.',
  'Correct tire profiles, tread and sidewall markings for each verified factory wheel/tire preview.',
  'Compact spare, jack mechanism, lug wrench, retainers and front-compartment stowage hardware.'
 ]},
 {name:'Fuel supply and evaporative emissions',stage:'Modeled; refinement remains',assembly:'fuel-system',items:[
  'Measured early tank shell/baffles and verified capacity; sender travel/resistance calibration.',
  'Pump, filter and canister internals; exact filler/vent/return/purge routing, clamps, clips and electrical connections.',
  'Verify factory fuel-system interfaces and complete documented service content.'
 ]},
 {name:'Exhaust and heat shields',stage:'Modeled; refinement remains',assembly:'exhaust-system',items:[
  'Measured manifold/crossover profiles, collector junctions and production pipe bends.',
  'Muffler internal chambers/baffles and verified early converter construction.',
  'Exact shield stampings, hangers, spring positions, tailpipe finish/application and heat/body clearances.'
 ]},
 {name:'Cooling',stage:'Modeled; verification remains',assembly:'cooling-system',items:[
  'Complete water-pump and fan-motor internals; verify original fan/shroud option.',
  'Measured radiator, coolant-pipe and hose bends, clamp/support locations, sender/switch fittings and clearance.',
  'Validate coolant filling/bleeding, capacities, thermostat and pressure specifications from 1985 sources.'
 ]},
 {name:'Heating, ventilation and air conditioning',stage:'Modeled; refinement remains',assembly:'hvac-system',items:[
  'Measured C41/C60 case/duct profiles, door seals, linkage positions and calibrated travel.',
  'Blower and electric-actuator internals, switch contacts, resistor/relay wiring and verified control circuits.',
  'Complete original A/C compressor/clutch, condenser, refrigerant lines, fittings, O-rings and accumulator internals; verify application before assigning dimensions.'
 ]},
 {name:'Doors, windows, locks and mirrors',stage:'Detail missing',assembly:'body-system',items:[
  'Manual/power window regulators, motors, rollers, stops, glass channels, felt guides and seals.',
  'Complete latch and key-cylinder internals, lock rods/clips, power-lock actuators, switches and harnesses.',
  'Manual/power mirror pivots, adjustment mechanisms, cable/wiring, mounting pads and hardware.',
  'Door weatherstrip cross-sections, belt moldings, inner shields and complete trim attachments.'
 ]},
 {name:'Wipers, washer and defroster',stage:'Detail missing',items:[
  'Wiper motor/gearbox, transmission links, pivots, delay control and exact blade/arm construction.',
  'Washer pump, bottle details, hoses, clips, nozzles and wiring.',
  'Rear-window defroster grid/terminals, switch, relay, wiring and original-option application.'
 ]},
 {name:'Body panels, roof and structure',stage:'Modeled; specification audit remains',assembly:'body-system',items:[
  'Measured panel curvature, sections, datums and gaps: front/rear fascias, hood, front fenders, doors, rockers, quarters and rear roof clip. Radiator-to-hood interference has been corrected and checked; measured factory placement remains unverified.',
  'Refine A/B/C pillars, small sail windows, recessed rear window, decklid/vents and rear bumper geometry against source dimensions.',
  'Complete space-frame stampings, weld/joint locations, bulkheads, floor/tunnel, rails, bumper beams and energy absorbers.',
  'Fascia supports, wheelhouse liners, air deflectors, seals and every verified panel retainer.',
  'Sunroof latch/seals/drains/stowage, roof trim and glazing adhesive/weatherstrip sections.',
  'Wing or luggage-rack mounts/pads/reinforcement, option-specific deck torque rods, fuel-door hinge/latch and power-release mechanisms.'
 ]},
 {name:'Seats, restraints, trim and cabin controls',stage:'Detail missing',items:[
  'Seat frames, tracks, recliners, cushion construction, speaker internals and mounting hardware.',
  'Seat-belt retractors, buckles, anchors, covers and warning-switch wiring.',
  'Dashboard/console/door trim moldings, hidden attachments, carpet, insulation and sound pads.',
  'Pedal pivots, throttle cable/return hardware, shifter boot/control details, radio and speaker assemblies/wiring.'
 ]},
 {name:'Factory options and interchange',stage:'Coverage incomplete',items:[
  'Complete cruise-control hardware/cables/switches and verified option-specific electrical/vacuum architecture.',
  'Finish supported factory alternatives for tilt, power windows/locks/mirrors/releases, delay wipers, lighting packages, defroster and roof equipment.',
  'Verify model-year/RPO/side compatibility for swap previews; separate original build facts from preview choices.',
  'Original paint/trim, spring codes and other undocumented installed RPOs remain unknown; the VIN alone does not establish them.'
 ]},
 {name:'Specifications, procedures and final acceptance',stage:'Required across every system',items:[
  'Source every published part identity/application, fastener quantity, torque, clearance, fluid and maintenance value.',
  'Build validated step-by-step procedures with tools, access, removal/refit order and verification linked to the actual selectable parts.',
  'Check left/right orientation, assembly interfaces, full travel, hose/cable routing and clashes throughout the car.',
  'Review close-up surface accuracy/materials and assembled/exploded interaction for each system; test desktop and mobile performance.',
  'Resolve remaining provenance/licensing and dimensional evidence gaps before claiming a complete photorealistic, factory-spec manual.'
 ]},
];
