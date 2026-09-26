# UAT — visual review build 0.2

Open http://localhost:5185/ in a WebGL-capable browser.

**Final acceptance is pending.** See the [current verification report](artifacts/current-UAT.md) and [all 20 areas mapped to test coverage](artifacts/checklist-test-matrix.md). The checklist requires complete parts/geometry/manual coverage; this walkthrough alone does not establish it.

This UAT evaluates the **interactive 3D experience and the revised appearance**. Factory overall dimensions anchor the reconstruction; detailed component contours and service procedures remain unverified. The requested photorealistic, fully accurate model is not signed off. Record appearance issues under **Model accuracy** in the UAT tab.

## Oil-pump and coolant-guide review

Open **Engine → Oil pan & lubrication → Oil pump & pickup**. Inspect the twelve selections, compare assembled/exploded states, and isolate the gears, relief parts and wire screen. The ten-tooth profile, pressure calibration and local dimensions remain reconstructed. Return to the previous vehicle view, then use mobile search for **relief piston**.

Open **Guides → Replace engine coolant**. Walk through all twenty numbered steps. Check transitions between the engine filler, front radiator, underbody plugs and recovery bottle; the headlamp preview must remain unchanged. Verify flushing and bottle cleaning are retained, pipe-plug torque is not applied to other drains, the thermostat stays out until step 19, and cooling/pressure-release requirements remain visible. Check numbered-step wrapping, isolation, Previous, Finish and cancellation on desktop and phone widths. This is source/content review; physical workshop validation and optional block-drain geometry remain outstanding.

## Hydraulic lifter and water-pump review

Open Engine → a cylinder head → an individual valve → its hydraulic lifter. Check all nine entries, explode, select the small ball/springs, isolate the plunger and orbit to inspect its open bore/feed. Reset and return through the parent valve and head. Repeat on the other bank and an exhaust valve. Names must retain physical cylinder identity.

Open Cooling → water pump → Explode this assembly, or Engine → Cooling & accessories → Water pump & pulley. Its ten selections include four new internal construction units. Isolate the hub, shaft/bearing, seal and impeller; orbit behind the impeller to see its vanes. The original vane count/profile and internal pump variants are unverified, as the inspector explains. Do not interpret this construction view as an overhaul procedure.

The [109-requirement checklist](REMAINING-WORK.md) and [component inventory](COMPONENT-COVERAGE.md) retain unfinished details across all 20 areas. Passing these interactions does not finish those requirements.

## Engine timing review

Open Engine → Explore engine components → Camshaft & timing drive. Compare assembled and exploded states, then isolate the camshaft, bearing set, chain, cam sprocket and timing cover. Orbit behind the cover to inspect its open cavity and separate flange gasket. Open a cylinder head and an individual intake/exhaust valve scope on each bank; inspect the lifter/pushrod connection and guide fork. Return to the vehicle and check that the installed engine retains the same geometry. These are static reconstructed fits; see [timing evidence and limits](references/engine-timing-reconstruction.md).

## New headlight review

1. Select Electrical → Headlamp assemblies → Explode this assembly.
2. Open either driver or passenger assembly, then its lamp/aiming, cover/linkage or early motor subassembly.
3. Inspect the sealed lamp, two aiming adjusters, retaining spring/rings, cover hinge, lift link, plastic output gear, four separate cushions, brushes and contacts.
4. Compare Raise headlights / Lower headlights; the bucket folds below the hood while the upper cover uses its independent hinge pose. Fit, focus, isolate and explode the smaller assemblies.
5. Inspect the two actuator relays and driver-side isolation relay. Return to the vehicle and compare paint and raised/closed previews.
6. Open Reference library → Remaining model & manual work, or open it from the UAT tab. Check the 20-area backlog and jump directly into an existing model.

Treat this as geometry/interaction review. Local profiles, gear ratios, optical tooling, every circuit and calibrated motion remain pending; the full car is not yet accepted as photorealistic or factory-dimensional.

## Headlamp factory-sequence guide

Open Guides → Replace a sealed headlamp. Check the T-15/Phillips/hook tools, blue-wire isolation before lamp removal, unchanged aiming screws, two-piece retainer, bezel screw torque and the final lamp-on / blue-wire reconnect / lamp-off order. Steps highlight native parts in the driver-side assembly. Use Previous and numbered steps, finish, and verify the prior selection and headlight preview return. Repeat from an existing component scope and at phone width. While the guide is active, select a part from another scope, change a persistent option, and return Home; temporary raised-headlight state must not leak into saved preview settings, and the next guide must return to its actual starting view. The guide follows the 1985 text; reconstructed geometry does not establish removal clearance.

## Acceptance walkthrough

1. Confirm the header identifies the 1985 Fiero SE 2M6, four-speed manual and WS6 configuration.
2. Drag to orbit and scroll / pinch to zoom. Switch through the six named views, including Driver side and Passenger side. Keyboard users can focus the canvas and use arrow keys and +/-.
3. Select each of the nine systems in the left sidebar. The system remains opaque while other components become context geometry.
4. Search for `radiator`, `air filter` or `clutch`. Search is global, even when a system is selected. Select a result and confirm the correct part is highlighted and described.
5. Click a visible component directly in the 3D model. Confirm the inspector opens that component. The component list is the keyboard-accessible equivalent.
6. Use Focus part, Isolate / Show context, Hide body panels, labels and wireframe. Reset view should restore the assembled full vehicle.
7. Move the exploded-view slider to 100%, then back to 0%. Components should move smoothly and return to their assembled positions.
8. In Guides, complete the three orientation tours and the headlamp service guide. Check Previous, numbered-step buttons, Next step, Finish tour and All guides.
9. In Specs, review the separation between NHTSA-confirmed identity, owner configuration and pending service data. Open and close the reference library.
10. In UAT, check an item and save a note. Reload and confirm both persist. Export feedback and confirm a JSON file is downloaded.
11. At phone width, open the assembly menu, search and select a part, then scroll to its inspector. Confirm there is no horizontal page overflow.
12. Open Options. Try paint, interior, each roof state, luggage rack / wing and raised headlights. Verify the changes are actual 3D geometry while orbiting. Try Cabin and Chassis to inspect interior and accessory choices.
13. Enable the factory dimension guides. Check the SE notchback silhouette, bumper-pad nose, wheelbase, windshield / quarter-window shapes, wheel appearance and factory-style cabin against the reference library.
14. Reload after changing options and confirm they persist. Check that Specs still identifies the original manual / WS6 car. Reset preview choices and confirm the initial preview returns.
15. Confirm the additional reference-only alternatives are clearly distinguished from implemented previews. A visual swap must not be treated as a verified installation guide.
16. Raise the headlamps and inspect their rear-hinged covers, rounded bezels, recessed reflectors and glass detail. Compare the assembly with factory DIY 2-28 / 2-29. Select Space frame and Isolate to review its formed rails, pillars, floor pans, bulkheads and wheelhouses against DIY 1-4 / 1-5. Record silhouette or component-shape mismatches as accuracy issues.
17. Review the revised nose and tail from Front, Side and Rear. Check the rounded fascia corners, wraparound moldings, lower paired bumper pads and sloping rear lamp panel. Under Options → Rear deck equipment, compare the plain deck, carrier with integral spoiler and lower pedestal wing. Inspect their curves and mounting relationships while orbiting; reference pages and reconstruction limits are in `references/exterior-refinement.md`.

18. Inspect the revised roof shoulders and A/B-pillar/sail transitions in Side, Rear and Top views. Compare the convex door/fender skins, tucked-under rockers and five-spoke/finned Hi-Tech wheels. Raise the headlamps and check their lower silhouette from Side and Perspective; inspect the wing tips and tapered stands from Rear. This pass is documented in `references/roof-side-wheel-refinement.md`.

19. In Rear and Side views, inspect the small framed sail applique ahead of each broad painted C-pillar. Check the smaller recessed rear window and taillight panel, and the raised center of the engine lid between separate vent grilles. Search `sail window`, `rear window`, and `vent grille`; select, isolate and explode those assemblies independently. Compare plain deck, luggage carrier and wing options for visible intersections. Record remaining proportion issues against the supplied reference views.

20. From Side, check that the roof extension falls smoothly toward the backlight and the painted C-pillars are narrower. From Rear, inspect the raised bumper pads, gently rising lower tail and four thicker, hollow exhaust tips. Use `artifacts/roof-tail-*.png` for this follow-up's captured views.

21. Select the V6 cylinder block and choose **Explore engine components**. Change the engine explode slider; the whole-vehicle explosion amount should be preserved. Select, focus and isolate a piston, crankshaft or valve. Open a cylinder head, timing drive or other subassembly and explode its contents independently. Reset view reassembles the current scope; **Back to vehicle** restores your previous vehicle view. Repeat on a phone using Open assemblies. Review **Modeled components & reference limits** for grouped and missing items.

22. From the vehicle search, enter **ICM** and select **Ignition control module (ICM)**. It should open **Distributor & ICM**. Focus and isolate the module; orbit to inspect its mounting holes, heat-transfer plate, terminals and connector shrouds. Return to the assembly, then explode the cap, rotor, pickup, pole piece, shaft, seals and gear. Check these against the GM distributor illustration linked in the inspector.

23. Open **Ignition & tune-up**. Inspect the external coil, bracket, primary harness, four-circuit EST connector and tach filter. In **Spark plugs & HT leads**, select individual plugs and wires; the high-voltage coil lead must be distinct from the low-voltage coil-to-ICM harness. Cylinder identities and firing order are sourced; cap clocking and high-tension routing remain unverified. Repeat ICM search and vehicle return on a phone, including a short viewport where the assembly panel itself needs to scroll.

24. Open **Sensors, valves & lines**. Inspect the TPS, IAC, MAP sensor, PCV, cold-start injector/seals/tube, fuel lines, injector loom and EGR components. Compare the displayed geometry with each linked factory figure; record missing parts and inaccurate forms. Open **Reference library → Parts coverage** to review the known gaps across the car.

25. Select an individual spark plug. Confirm its factory reference panel shows the six-cylinder gap, torque, socket and period AC type, and links to 1985 Pontiac DIY printed pages 2-22 and 3-3. Confirm mobile component search results remain reachable with nested engine scopes open.

## Feedback

Use the UAT tab to record observations, bugs, geometry corrections or feature requests. A note includes the currently selected component and system. Export the notes to share; saving alone does not send them anywhere.

## Known limitations

- The installed engine now shares the detailed engine geometry with rigid placement. Review its new packaging, belt and connections; the installation angle, mounts, castings and complete clearances remain reconstructed. See `references/shared-powertrain-reconstruction.md`.
- Full measured vehicle geometry, every internal engine/transmission part and a complete fastener inventory are not yet available. Engine internals and ignition components are now selectable, with reconstruction limits recorded in their inspectors.
- Body shape, wheel design, cockpit details, castings and routing are reconstructed. Surface accuracy and photorealism still need further work and review.
- Exterior red, roof configuration and unprovided accessory options are not confirmed.
- Exploded views separate assemblies for learning; they do not establish real removal paths or collision clearance.
- Six-cylinder spark-plug gap, torque, socket and period AC type are verified against the 1985 Pontiac DIY manual. Other service limits and repair procedures remain incomplete.
- The app needs a running local server and WebGL. Offline installation / service-worker caching is not part of this release.
- UAT data is specific to this browser and origin. Use Export before changing devices or clearing browser storage.
- Fullscreen can be unavailable in some mobile or embedded browsers; normal interaction still works.
- Initial rendering may be slow on devices using software WebGL. Hardware acceleration is recommended for the physical materials.


26. Select **Cooling system → Thermostat & filler housing → Explode this assembly**. Confirm five selections; explode the cap, tall thermostat, housing, gasket and bolt set. Isolate the housing and orbit to inspect its openings.
27. Select the thermostat itself. Confirm the original GM 195 °F rating is distinguished from the MotoRad replacement dimensions.
28. Open **Water pump & pulley**, then **Oil pan & lubrication → Dipstick & guide tube**. Check assembled and exploded views, normal list/mesh selection, isolation and return to vehicle.
29. Open **Oil-pressure sender · A/C**. Confirm the early large sender is shown, and the description explicitly identifies A/C routing as a preview rather than a decoded VIN feature.
30. Search **spring retainer**. Open an individual valve scope; confirm nineteen selections, including nine inside the nested lifter scope. Intake has a retained stem seal; exhaust has a metal stem shield. Both have separate keeper pairs, retainers, stem O-rings, studs and nuts.
31. Return to either head and confirm all six valve scopes are available. On a short mobile screen, use global dipstick search and confirm the sidebar and component list remain reachable.

## Transmission, cooling and left-hand-drive increment

1. Select **Transmission & clutch → Four-speed transaxle → Explode this assembly**. Inspect the assembled case, then separate it. Open the input shaft, output shaft, reverse idler, differential, selector and clutch sections. Select, isolate and focus gears, blocking rings, bearings and the sprung driven plate.
2. Switch to **Complete coolant circuit** in the same explorer. Inspect the radiator core/tanks, fan/shroud/motor, pressure cap and recovery bottle. Check the left radiator inlet and right return pipes, including the early manual-transmission crossover. Heater geometry is a C60 preview with provisional routing.
3. Switch among engine, transmission and cooling roots, then **Back to vehicle**. The prior vehicle selection, explosion and camera should return. Search globally for “synchronizer,” “release bearing,” or “radiator fan blade.”
4. On the whole car, check the **US LEFT-HAND DRIVE** badge and **Driver side / Passenger side** views. With body panels hidden, the steering wheel, instruments, pedals, brake/clutch masters and transaxle should be left; battery, thermostat and recovery bottle should be right. Left/right is from an occupant facing forward.
5. On mobile, open the assembly menu, search for a new part, inspect it, and return. Both side views and the orbit tools should remain accessible without overlap.
6. Choose **Options → Cabin** for the driver-seat view. Check that the speedometer is left of the tachometer, the turn-signal stalk is outboard on the left, and the HVAC controls sit above the radio. Reset, then inspect the rear and intake lettering for readable orientation.

This increment contains 95 transmission/clutch and 36 cooling selectable parts or grouped sets, alongside the 420 engine entries. It is an illustrated reconstruction. Gear profiles, local casting dimensions, fan variant, exact routing and many remaining vehicle systems are unfinished; passing this UAT does not establish a complete photorealistic replica or validate repair procedures.

## Brake inspection increment

1. Open **Brakes → Brake calipers & pads → Explode this assembly**. Navigate each front/rear corner and open its caliper or hub scope. Check independent selection, focus, isolation and smooth reassembly.
2. Compare front integral rotor/hubs and tapered bearing stacks with the separate rear rotor/hub units. Select a rotor and inspect the 1985 nominal dimensions and source; these are not machining limits.
3. Open a rear caliper. Inspect the separate parking lever, cable bracket, return spring, actuator, balance spring, piston and seals. Confirm the front calipers do not inherit a parking actuator.
4. Open **Master cylinder, booster & lines**, then the master and tandem booster. Inspect the reservoir/diaphragm and the two booster diaphragms in assembled and exploded states.
5. Open **Parking lever, cables & equalizer**. Verify the lever is beside the left driver seat and that three cable selections reach the rear brake area.
6. Search globally for **right rear parking-brake actuator**, including on a phone. Open, isolate and focus it, then return to the vehicle.

There are 212 brake selections, including grouped pairs/sets. Detailed castings, rear piston clutch/hub internals, routing and removal clearances remain under reconstruction. Compare the geometry with the linked factory drawings and record specific mismatches.

## Suspension and steering increment

1. Select **Suspension & steering → Front control arms → Explode this assembly**. Open each front corner, then its arms and spring/shock scopes. The shock should be separate from the coil. Inspect bushings, ball-joint boots and fasteners independently.
2. Open **23 mm front stabilizer & links**. Select the bar to see its source, then explode the grommets, cupped washers, spacers and mounting clamps.
3. Open each rear strut and separate its 19 selections. Inspect the two spring insulators, upper mount, reinforcement plate, jounce bumper and dust shield. Check the separate rear toe-link scope.
4. Open **Manual rack, tie rods & damper**. Inspect assembled and exploded states. The pinion is driver-side; the separate damper is passenger-side.
5. Search globally for **Right rear strut jounce bumper**, including on mobile. Isolate/focus it, then return to the vehicle and verify the previous selection.

Exact spring rates, loaded dimensions, pivot geometry, rack ratio and manufacturing profiles remain pending; record discrepancies against the linked sources.

## Early V6 fuel increment

1. Open **Fuel & exhaust → In-tank fuel pump & sender → Explode this assembly**. Inspect the cam ring, seal, sender tubes, pump, strainer, isolators and float/arm. Select, isolate and focus a small component.
2. Open **Early tank, straps & insulators**. Compare the stepped upper surface and sender opening with the linked 1985–86 drawing. The separated welded shells are a cutaway for inspection, not a repair disassembly.
3. Open the filler/vent, fuel-pipe/filter and vapor scopes. The filler and canister are driver-side; the filter is passenger-side. Feed, return and vapor routes have separate identities.
4. Search **Fuel-level float arm** on a phone, inspect it and return to the vehicle.

Exact tank capacity, sender calibration, original pump construction, factory routes and internal filter/canister geometry remain unverified.

Exhaust review: Fuel & exhaust → V6 exhaust, catalyst & shields → Explode this assembly. Inspect the manifolds, crossover spring joint, early catalyst cutaway, and rear muffler/tailpipes. Configure → Twin tailpipe finish exposes the catalog's black SE and bright GT previews. Return to Inspect, isolate a joint spring or catalyst support, and confirm the vehicle selection is restored on exit. These are reconstruction views; welded-shell separation is not a service operation.

Body hardware review: Body & chassis → Front hood → Explode this assembly. Inspect the slotted hood stay, hinges and latch. Open Rear decklid, vents & torque rods for the crossed rods and rear lock. Door scopes separate exterior, trim, side glass and hinge hardware; Rocker covers & retainers has both independent sill covers. Front/rear panel scopes expose their liners and retainers. Verify paint and roof previews remain consistent in the body explorer and assembled car. Local contours, hinge coordinates and mechanism travel remain unverified.

## Heater and ventilation increment

1. Choose Cooling → Heater, blower & optional A/C module → Explode this assembly. Standard preview should show C41 mechanical mode controls, separate heater core, case and blower.
2. Open Blower, then explode and isolate the centrifugal wheel. Inspect the open rim, curved vanes, shaft/nut, motor flange and cooling tube.
3. Open Cabin ducts, then the control head. Check driver/passenger outlet placement and the fan knob at the driver side.
4. In Configure, enable Air conditioning. The control head should switch to C60 pushbuttons; evaporator/accumulator and electric air-door actuator entries should appear.
5. Open C60 evaporator, isolate the orifice tube, then disable A/C. A populated heater view should replace the now-inapplicable scope, with no invisible part left selected; the camera should pull back from the tiny isolated part automatically.
6. Check the coolant explorer's heater core uses the same current variant. Return to the vehicle and verify the original HVAC selection is restored. Use Configure → Cabin and verify the HVAC controls/outlets and door trim remain opaque and visible. Repeat blower search/focus on a narrow screen.

These are native geometry and interaction checks. Exact case tooling, duct shape/clearance, graphics, motor internals, full wiring and full A/C refrigeration parts remain unaccepted.

## Revised exterior review — 24 September 2026

Compare the six whole-car views with the supplied photographs, then inspect Front panels, Rear panels, each Door, Roof, Rear clip, Glazing and Decklid under Body. Mirrors, handles, pads, moldings, fuel door, intake, antenna and wipers now select independently. Roof glass/seal and carrier/wing follow Configure. Check the front lamp apertures, filler-door fit and exploded views on desktop and mobile. See [panel coverage](references/exterior-reconstruction-20260924.md); the previous accepted-contour wording is superseded.

## Sunroof hardware review

Choose the glass roof in Configure and search for “Sunroof glass-side latch handle”. Open its assembly, then inspect the hinge tongues, bushings, handle, body release housing and trim in the Body roof section. Explode and isolate the separate parts. Change to removed glass: the glass-side hardware should disappear and the body release/trim remain. Choose solid roof: all AD3 pieces should disappear. Repeat selection and isolation on a narrow viewport. Hardware positions are reconstructed; no physical removal sequence or latch calibration is implied.

Whole-body calibration: [published dimensions, actual-mesh before/after measurements and limits](references/body-dimension-reconstruction-20260924.md). Review all six exterior views and each body section; selected nominal dimensions now match, while complete factory panel contours and physical acceptance remain unverified.

Body R4 follow-up: the owner rejected the earlier rear bumper and proportions. Confirm **BODY R4** in the manual header, then use the [local photo comparison](http://localhost:5185/body-review.html) and review the [R4 changes and limits](references/body-r4-owner-review-20260924.md). Exact body appearance remains unaccepted.

Body R5: factory coupe/SE bumper heights, lamp offsets, side molding/handle line and rear deck are revised. Confirm **BODY R5** in the header. The [factory specification review](references/body-r5-factory-specification-review.md) separates published values from reconstructed surfaces and load conversion; the [comparison workspace](http://localhost:5185/body-review.html) links the original tables and SE brochure. Earlier R4 records are historical.

Body R6 corrects the rear combination-lamp construction and missing bulb chamber while retaining the selected factory body/bulb datums. Confirm **BODY R6** in the header. [Lamp sources and limitations](references/body-r6-tail-lamp-review.md) · [Focused lamp review](http://localhost:5185/tail-review.html). R5 captures/results are historical.
