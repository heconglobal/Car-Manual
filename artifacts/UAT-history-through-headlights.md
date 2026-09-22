# UAT readiness — visual review build 0.2.0

Baseline interaction validation completed in targeted browser batches, September 17, 2026: all 13 scenarios passed after the headlamp / frame work. The subsequent fascia / spoiler pass completed its multi-angle capture without browser errors and passed the targeted configuration / persistence regression. This is not a claim that visual or mechanical accuracy has passed acceptance.

The revised build can be reviewed for interaction and appearance. It is not a complete, measured or factory-verified repair manual, and photorealistic / part-level accuracy acceptance remains outstanding.

| Earlier vehicle baseline check | Recorded result |
| --- | --- |
| Actual WebGL rendering, 63 assemblies, no runtime page errors, no photo requests | Passed after rear-body revision, 54.5 seconds on software WebGL |
| Option-driven geometry, persistence and unchanged VIN / manual / WS6 identity | Passed after rear-body revision, 2.8 min; includes lower headlamp bound, roof options, wing/deck relationship and drivetrain bounds |
| System filters, search, focus, isolation and reset | Passed |
| New rear glass, sail and deck-vent assemblies | Passed after rear-body revision, 1.5 min; independent bounds, search, selection, isolation, reset and vent explosion |
| Camera presets, visibility, labels, wireframe, keyboard and explosion | Passed; visibility / wireframe / explosion rechecked after final frame revision, 1.6 min |
| Direct component picking | Passed |
| Three guided tours | All three passed, including next / back / finish |
| Specification provenance and eight-source library | Passed, including dated plenum catalog reference |
| Feedback persistence, safe text rendering and JSON export | Passed, including literal HTML text and reload persistence |
| Mobile navigation and overflow | Passed at 390 × 844 |
| Invalid saved option recovery | Passed |
| Production build | Passed after rear-body revision; standard bundle-size advisory only |

The software-rendering browser uses Chromium and tests at desktop 1440 × 1000 and mobile 390 × 844. This validates behavior, not performance on all graphics hardware.

Some long test batches were externally terminated with exit 143 before completing. The unfinished scenarios were subsequently run to completion in smaller batches. No interrupted case is counted as passed without a later passing result. The HTML test report reflects only the most recent batch.

The fascia / spoiler configuration test initially exceeded its 150-second total timeout during the software-rendered capture / reload, after the geometry assertions. Its timeout was raised to 240 seconds so the persistence assertions could finish. The complete scenario then passed in 2.9 minutes. This is a software-renderer test allowance, not evidence of hardware-accelerated frame rate.

The headlamp / frame pass replaces headlamp blocks with hinged covers, rounded bezels, reflector bowls, glass relief and first-generation actuator representations. It also replaces the round-tube frame outline with formed sections, floor contours, wheelhouses, pillars and bulkheads. Both assemblies remain reconstructions from factory illustrations.

Headlamp / frame detail capture completed without browser page errors (`detail-review.json`). The following images were inspected: `desktop-overview.png`, `exploded-chassis.png`, `review-spaceframe.png`, `review-headlights-raised.png` and `review-headlamp-detail.png`. These captures are review evidence, not accuracy acceptance.

The fascia / spoiler pass refines the rounded SE end profiles, lower bumper-pad layout, rear lamp rake, molding continuity, vent seating and both spoiler options. `exterior-clean-*`, `exterior-rack-*` and `exterior-wing-*` show the researched profiles; `spoiler-review.json` records zero browser errors and model bounds. These bounds describe the reconstruction, not factory surface measurements. See `../references/exterior-refinement.md` for the exact factory pages and supplementary angle references.

After seating the wing supports and refining the carrier slats, final rear captures were inspected for both options. `spoiler-final-review.json` records zero browser page errors on the final source. The live workshop returned HTTP 200 after these checks. This exterior refinement is ready for visual review; full-manual and measured-accuracy acceptance remain outstanding.

See `../references/geometry-provenance.md`, `../ASSET-CREDITS.md`, `../UAT.md` and `../README.md` for evidence, credits and outstanding accuracy work.

## Roof / side / wheel refinement and supplied-image comparison

Reviewed the four supplied images (`IMG_5459.jpg`–`IMG_5462.jpg`) and the factory brochure / DIY / 22P pages recorded in `../references/roof-side-wheel-refinement.md`. Refined A-post skins, roof shoulders, the B-pillar/sail insert relationship, rounded glass openings, convex side skins, formed rockers, Hi-Tech wheel spokes/fins, carrier/wing sections and raised-lamp height.

The seven-view contour pass completed without page errors (`contour-review.json`). Raised headlamp maximum height is approximately 855 mm in this reconstruction, down from approximately 924 mm; this is not a factory adjustment dimension. The subsequent four-view supplied-reference comparison also reported zero page errors (`reference-review.json`), using a temporary glass-roof / carrier / raised-lamp preset without changing app defaults or the VIN record.

The configuration / persistence regression passed in 3.1 minutes after the roof and carrier detail changes. It checks the lower raised-lamp bounds, wing/deck/roof relationship, removable roof geometry, options after reload, and unchanged VIN / manual / WS6 identity. Visual accuracy remains subject to owner UAT.

Targeted Playwright batch: 2 passed (4.3 minutes total). The final small fender-width correction follows these behavior checks; the final reference capture checks that surface and its bounds. Production build passed after the correction.

The final four-view comparison reported zero page errors and a visible fender width of 1,752.04 mm (`reference-review.json`). Rounded sunroof corners, carrier thickness and lowered lamps were visually inspected. A subsequent rocker-length correction extends the formed trim between wheel openings; the production build passed afterwards.

Final source: the side/rear capture after the rocker correction completed with zero page errors (`reference-sills-final.json`); both views were inspected. Width remains approximately 1,752 mm, with all 57 assembly identities retained. This pass is ready for the next visual UAT; measured local contour accuracy and full service-manual acceptance remain outstanding.

## Rear-body revision — September 18, 2026

Rebuilt the rear header, C-pillars, small framed sail appliques, recessed backlight, raised-center engine lid and separate side vent grilles. Reduced both the rear window and taillight panel following the owner's clarification. Matched the pillar roots to the quarter-panel shoulders and softened the hood / fascia / upper-door contours. Six new assembly identities bring the current total to 63. See `../references/rear-body-refinement.md` for source scope and inferred dimensions.

Targeted interaction validation: configuration / persistence passed in 2.8 minutes; real WebGL rendering with no runtime errors or photo requests passed in 54.5 seconds; the new rear-assembly search / isolation / explosion check passed in 1.5 minutes. The new test initially expected exactly two global search results, but the roof description correctly also matched “sail window.” Its assertion was corrected to require both sail assemblies while allowing related results, and the complete scenario then passed. No runtime change was needed for that test correction.

Production build passed after the final geometry changes, with the existing bundle-size advisory. These checks establish interaction behavior, not measured surface accuracy or complete-manual acceptance.

Final six-view capture completed with zero browser page errors (`rear-body-review.json`): rear, close rear, side, perspective, top and carrier-equipped rear. All views were inspected after the pillar-root and lamp-size corrections. The revised window recess, pillar joins, separated vent grilles and carrier placement are ready for owner visual UAT. The live review URL returned HTTP 200.

## Roof and lower-tail follow-up

The owner's next feedback accepted the front and requested narrower C-pillars, removal of the rising rear roof profile, an upward sweep at the rear bumper, higher black pads and thicker exhaust. The rear roof extension now descends continuously into a lower header, the pillars have a shorter rearward span, and the rear lower-body rise is shared across quarter skins and fascia. Pads and license recess were raised together. Four larger exhaust outlets have hollow sleeves and rolled lips.

The final production build passed with the existing bundle-size advisory. A sampled numerical check of the rear roof surface found no upward steps and zero position gap at the shared roof seam. `roof-tail-review.json` records zero browser errors across six captured views, all inspected: rear, close rear, side, perspective, top and carrier-equipped rear. Dimensions remain reconstructed rather than measured factory surface data.

Final targeted browser batch: **2 passed (2.6 minutes)**. Independent rear-assembly bounds, search, selection, isolation, reset and vent explosion passed in 1.6 minutes. Actual WebGL rendering, all 63 assembly identities, no runtime page errors and no photo requests passed in 59.5 seconds. Live review URL returned HTTP 200. This follow-up is ready for owner visual UAT.

## Engine component explorer

Added an engine inspection scope with its own explosion amount, nine subassembly views, 159 selectable parts / grouped sets, direct mesh selection, search, focus, isolation, reassembly and restoration of the previous vehicle view. The 63 vehicle assembly IDs remain unchanged. The engine mesh is created when the detail view is first opened.

Source illustrations: GM 22P H-19 and H-22, inspected from the local PDF. Geometry and inventory coverage are documented in `../references/engine-explorer.md`. Major internals, bearing-shell pairs, manifold layers, ignition, timing and lubrication components are represented; grouped hardware and missing accessory internals are explicitly listed in the inspector. This is not a complete factory parts inventory or validated repair sequence.

Final geometry audit found 159 nonempty groups with finite vertex positions, 241 meshes and 370,506 triangles before scope filtering. Five rendered engine views were captured and inspected: assembled, fully exploded, cylinder head, rotating assembly and timing drive. `engine-review.json` records zero page errors on the final geometry. Production build passed with the existing bundle-size advisory.

The first capture exposed a timing-chain curve input error; it was corrected before the successful captures and interaction checks. The initial desktop and mobile interaction tests both passed before the final bearing / casting refinements.

Final engine browser batch: **2 passed (3.3 minutes)** after the bearing, manifold-joint and sleeve-surface refinements. Desktop passed in 2.0 minutes; mobile passed in 1.1 minutes. Direct picking, engine-only explosion, all 159 nonempty groups, isolation, subassembly navigation, reassembly, vehicle return and mobile overflow were checked. Desktop reported no page errors or photo requests. A longer combined batch was externally interrupted with exit 143; it is not counted as a pass.

## Ignition, engine controls and casting detail — September 21, 2026

Current coverage: **67 vehicle assemblies and 210 engine parts / grouped sets**. Counts overlap where the same ignition/control component appears in both views. There are 39 ignition items, including an 18-part distributor scope, plus 21 engine-control sensors, valves and line assemblies. Global vehicle search can open ICM and other engine internals directly. Coil primary wiring and the high-voltage coil lead have separate identities.

Factory evidence and limits are in `../references/ignition-reconstruction.md`. All 17 callout types in GM K-13 are represented. The VIN does not identify which of the two listed 1985 distributor variants is installed. No full-parts, measured-surface or photorealistic acceptance is asserted.

The first new desktop ignition test passed, as did both existing engine tests. The new mobile ignition test found a real bug: the nested systems list occupied the sidebar height and pushed part results outside the reachable viewport. The fix makes both systems and components independently scrollable, reserves room for results and resets result scroll on scope/search changes. The regression now explicitly checks that ICM is inside the viewport before clicking; the failing test was not bypassed with a forced click or a longer timeout.

The final geometry form pass adds a stepped open oil-pan shell, contoured head/cover castings, finer engine casting grain and shadows fitted to the inspected component. Nine rendered views completed without page errors (`ignition-review.json`), and the ICM, coil, distributor, plug, engine, control parts, pan and head views were inspected. These visual checks expose remaining approximation; they do not certify factory surface accuracy. The head's combustion-pocket profiles and water passages are still incomplete.

Final geometry audit: 210 engine groups, 352 meshes, 711,020 triangles; 67 vehicle groups, 368 meshes, 1,320,624 triangles. Checks cover unique identities, finite positions, nonempty geometry, picking IDs, section membership and all 17 distributor callout types. The production build passes with the existing bundle-size advisory. The subsequent six-cylinder plug reference UI uses directly inspected 1985 Pontiac DIY pages 2-22 and 3-3.

The seven-scenario interaction batch completed with six passes in 21.1 minutes. Engine desktop/mobile passed in 3.7/1.9 minutes; ignition desktop/mobile in 2.8/2.6 minutes; the orientation tour in 3.6 minutes; specification/source access in 2.1 minutes. The mobile ignition regression includes ordinary reachable clicks, isolation/focus, no horizontal overflow and restoration of the selected vehicle distributor. The desktop ignition case also checks the plug reference values and exact manual page link.

The filter/search scenario exceeded 240 seconds after successfully selecting all nine systems and finding both radiator search results. Its trace shows a 56.84-second page load and system-click durations of 10.71–24.45 seconds; the radiator click began with roughly three seconds left in the total test budget. This run is **not** counted as passed.

Following that trace review, faded vehicle context uses a cached, single-pass basic material rather than recompiling physical/transmission materials on each system switch. Active inspected components and the assembled-car physical materials are retained. The focused filter/tour rerun passed both scenarios in 6.5 minutes: the complete filter/search/focus/isolation/reset case passed in 3.0 minutes, and orientation in 3.3 minutes. The software-rendering default test budget is now 240 seconds, and the long nine-system/filter/search scenario allows 360 seconds; these budgets are not performance claims.


All seven targeted interaction scenarios now have completed passing runs. No failed or interrupted run is used as passing evidence. These software-renderer timings do not establish hardware-accelerated frame rates. The remaining post-regression refinements are a flat spark-plug ground electrode with the factory-referenced nominal 1.1 mm gap, clearer gasket/source metadata, and vertical scrolling of the sidebar itself on very short screens. Final build and geometry audit passed after those changes. A final visual/compact-menu probe checks the final source before handoff.


Final visual/compact-menu probe completed on the final source: `ignition-final-check.json` records zero application page errors. The head gallery, revised plug and specification panel, faded cooling context, restored assembled car and 390 × 500 component-menu views were captured and inspected. The compact ICM result was reached using normal scrolling/clicking and opened the distributor scope successfully. Both the loopback and shared workshop URLs returned HTTP 200.

An earlier attempt at this final capture closed its browser unexpectedly during the return to the assembled car. No application page exception or kernel OOM report was captured, so the cause is undetermined. It was not counted as a completed pass. A replay of the same sequence and viewport with browser diagnostics enabled completed all five captures and the compact-menu selection, then shut down cleanly. This does not establish stability on every graphics driver.

The ignition/engine-detail increment is ready for owner visual UAT. Full-car photorealism, measured casting accuracy, correct factory lead routing and complete parts/repair-manual acceptance remain outstanding. The exact known engine callout gaps are in `../references/engine-callout-gaps.md`.

## Cooling, lubrication and valve-gear increment · 2026-09-21

Supersedes the historical counts above: **67 vehicle selections and 315 engine part/set selections**. Adds 27 cooling/lubrication/timing service entries and 78 repeated valve-hardware entries. The thermostat, water pump, dipstick, A/C sender and each of twelve valve positions have their own scopes. The vehicle thermostat shares the explorer geometry. No photographic assets or paid model/service were added.

- Source audit: GM H-19–24, Pontiac DIY printed 2-39 / 2-41 and an explicitly labeled MotoRad 211-195 dimensional reference. Exact reconstruction limits are in `references/engine-service-reconstruction.md` and `references/valve-gear-reconstruction.md`.
- Geometry audit at 19:09 UTC: engine 315 groups / 477 meshes / 1,087,936 triangles; vehicle 67 groups / 372 meshes / 1,359,788 triangles. All catalog identities have nonempty finite geometry and matching picking IDs. Added checks cover the five thermostat callouts, four dipstick callouts and the distinct intake/exhaust stem-seal memberships in all twelve valve scopes.
- Production build passes; existing >500 kB bundle advisory remains (814.60 kB JavaScript, 225.78 kB gzip at this check).
- Service interaction test passed in 1.7 min, then 2.2 min after flange/pump-bolt fixes. Covers vehicle-to-thermostat entry, exploded offsets, isolated thermostat/reference panel, pump/dipstick/sender navigation, vehicle restoration and compact mobile global search. No application page exceptions or image requests were observed by that test.
- Valve scope test passed in 1.4 min before the final curved rocker surface and close-focus refinement. Final geometry, zoom and shading replay results are appended below when complete.
- First service test launch was terminated with exit 143 before producing a result. No application error or kernel OOM evidence was captured; cause was not established. A PTY rerun completed successfully. This is recorded as an interrupted attempt, not an application test pass or diagnosed bug fix.

Visual review found and corrected a thermostat flange-bolt sign error, reversed pump-bolt shanks, insufficient close-focus magnification for keepers, and a coarse triangulation artifact in the stamped rocker. The pump outline was rounded and the thermostat inner bridge added. The accepted exterior panels were not edited.

This is an engine-detail UAT increment, not completion of the complete photorealistic car. Remaining casting/assembly alignment and system gaps are tracked in `references/full-vehicle-worklist.md`.

Final verification for this increment:

- `tests/engine-service.spec.js` and `tests/valve-gear.spec.js`: **2 passed / 3.8 min** after service fastener corrections and nested valve-scope integration.
- `tests/engine.spec.js` and `tests/valve-gear.spec.js`: **3 passed / 5.1 min** after curved rocker surface, small-part focus and contact-shading changes. This includes desktop direct mesh selection and short-screen engine navigation. These are targeted runs, not a fresh full-workshop suite.
- Final small geometry polish added curved pushrod ends and lifter exterior/seat detail, seated the rocker fulcrum/nut, and hid the remote floor during engine inspection to remove background shading artifacts. Final build: **815.23 kB JS / 225.95 kB gzip**, existing bundle advisory only. Final geometry audit: **315 engine groups / 477 meshes / 1,111,360 triangles**, **67 vehicle groups / 372 meshes / 1,359,788 triangles**.
- `scripts/service-final-review.mjs` completed on the final source at **19:19:30 UTC**, with **zero application page errors**. Six captures inspected: complete engine, exploded cylinder head, isolated rocker, assembled pump, filler-neck bore and restored complete vehicle. Existing exterior surfaces remain unchanged.
- Live local and Tailscale URLs responded HTTP 200 during this verification.

Final captures: `service-complete-engine.png`, `service-cylinder-head-exploded.png`, `service-final-rocker.png`, `service-final-pump.png`, `service-filler-neck-bore.png`, `vehicle-after-engine-service.png`. Earlier focused tests also captured the thermostat breakdown, dipstick, sender, keeper pair and mobile views. `service-final-review.json` records the final render counts and empty error list.


## 2026-09-21 — transmission/cooling + physical left-hand-drive correction

Implemented 95 transmission/clutch and 36 cooling selections, generalized inspection-family navigation, shared vehicle exteriors, unequal halfshafts and asymmetric cooling paths. The owner was correct that the previous coordinate convention mirrored the car. Final rendered left is -X with the nose at -Z; geometry, readable label parity and explosion vectors are converted together. See `references/transmission-cooling-reconstruction.md`.

Production build and both geometry/handedness audits pass. Browser results will be recorded below after completion. Early attempts are retained transparently:

- Initial new browser test failed because it required the entire brake-master group, including cross-car brake lines, to lie on one side. The assertion was corrected to account for grouped lines.
- The next test was deliberately interrupted after the physical-frame error was identified. Its earlier captures are superseded by the corrected-frame review; it was not a passing final test.
- In the regression run, the option-preview test exceeded its 240-second budget at its reload after exercising headlights, wing, roof, A/C and finish changes under SwiftShader. It also emitted a response-guid teardown error. The test budget was increased for the rerun; no option assertion had failed before the timeout. A timeout is not counted as a pass.

- The broader corrected-frame regression run completed with **6 passes and 2 failures in 21.2 minutes**: saved-option fallback, both engine checks, both ignition checks and rear-body selection passed. Failures were the option timeout described above and a real camera-toolbar overlap on a 390-pixel-wide screen. The layout was changed to put camera controls beside the vertical toolbar, with wrapped buttons. The affected two tests are being rerun; a brief rerun startup was intentionally cancelled to remove an older timeout override before restarting.
- Final geometry polishing includes a less glossy cast-aluminum finish shared between transmission detail and vehicle, matching cooling materials, preserved speedometer/tachometer order, an outboard turn-signal stalk, HVAC above radio, a driver-seat camera, and removal of the unsupported knob legend. Geometry audit now additionally checks instrument ordering and stalk extent.

The affected rerun completed with **2 passes in 10.7 minutes**: option previews/persistence/VIN isolation in 4.4 minutes, and transmission/cooling/LHD navigation in 6.2 minutes. Together with the six completed passes in the preceding regression run, all eight targeted scenarios now have passing results. This is not a fresh run of every historical workshop test. The new test checks family switching, section membership, independent explosion, isolation/focus, global discovery, vehicle restoration, physical side bounds, mobile control separation, zero application page errors and zero image requests.

Final model audit at 20:17 UTC: **315 engine entries / 477 meshes / 1,111,360 triangles; 95 transmission entries / 149 meshes / 469,528 triangles; 36 cooling entries / 57 meshes / 183,624 triangles; 67 vehicle entries / 403 meshes / 1,788,264 triangles**. Entry counts include grouped sets and overlap the vehicle selections. Identity, finite geometry, picking associations, shaft spacing, coolant sides, dashboard ordering and stalk placement checks passed. The separate handedness audit passed indexed/nonindexed winding, normal agreement, previous local reflections, label-map parity, explosion vectors and duplicate-conversion protection.

Rendered transmission assembly/input shaft/clutch, cooling circuit/radiator breakdown, complete vehicle, rear/intake lettering and mobile fan views were inspected. Labels remain readable after reflection. The mobile toolbar overlap is resolved. Visual review caught excessive cropping in the new cabin camera; its field of view was widened to 60 degrees, with normal 37-degree projection restored for exterior/detail views and preserved in saved vehicle camera state. A focused render replay checks this last camera-only refinement; the eight interaction scenarios above preceded that refinement.

The final production build after the camera refinement passes: **855.11 kB JavaScript / 239.31 kB gzip**, with the existing bundle-size advisory. Geometry did not change after its final audit. Both loopback and shared workshop URLs returned HTTP 200 at 20:26 UTC. SwiftShader test durations are not hardware-accelerated performance measurements.

The final camera replay completed at **20:32:31 UTC** with **zero application page errors** (`lhd-review.json`). Both captures were inspected: the driver view includes the full steering wheel, left stalk, correctly ordered instruments, three pedals and center controls; Reset restores the prior exterior framing. Final reviewed captures include `transmission-assembled.png`, `transmission-input-assembled.png`, `transmission-clutch-exploded.png`, `cooling-complete-circuit.png`, `cooling-radiator-exploded.png`, `cooling-mobile.png`, `lhd-driver-seat.png`, `lhd-rear-lettering.png`, `lhd-intake-lettering.png` and `vehicle-after-cabin-camera-fix.png`.

**This transmission/cooling/LHD increment is ready for owner visual UAT.** The entire car is not yet photorealistic, fully measured or parts-complete. Casting profiles, internal fits, original fan variant, exact routing and the remaining systems in `references/full-vehicle-worklist.md` require further work. No test result is a claim of factory dimensional certification or repair-procedure validation.

## Brakes, suspension and manual steering · 2026-09-21 local

The brake increment adds 212 part/set selections and shares exterior geometry with the vehicle. The first complete brake browser scenario **passed in 5.8 minutes**, covering four-corner nesting, independent explosions, nominal rotor reference panels, rear parking actuator source, master/booster/lines/cables, family switching, vehicle restoration, mobile global search and isolation, zero application page errors and zero image requests.

Rendered assembled/exploded calipers, front hub, master, booster and parking lever were reviewed. Refinements after that initial pass join the caliper outer casting, make the reservoir opaque, open the rear disc mounting holes and correct normal wheel-stud helix parity. Front knuckle steering arms now point toward the forward steering rack. Rear knuckles include their lower-joint bosses. The rear actuator helix remains explicitly illustrative.

Suspension adds 216 selections and one vehicle crossmember selection. Final inventory at the first suspension audit: **70 vehicle groups; 315 engine, 95 transmission, 36 cooling, 212 brake and 216 suspension selections**. Counts include grouped sets and overlap vehicle selections.

Geometry audit at **2026-09-22 01:22:26 UTC** passed: brakes 286 meshes / 466,580 triangles; suspension 282 meshes / 391,500 triangles; vehicle 452 meshes / 2,487,976 triangles. Checks include nominal disc bands, caliper callouts, upward bleeders, independent front shock/coil envelopes, downward upper ball-joint studs, rear strut inventory, driver-side pinion, passenger-side damper and the existing LHD identity checks. Separate handedness audit passed. Production build passed at 933.00 kB JavaScript / 264.95 kB gzip, with the existing bundle-size advisory.

The current suspension browser scenario also rechecks the final brake refinements. Its result and render review are recorded below when complete. No full-car measured-specification or photorealism acceptance is implied.

The suspension/browser scenario **passed in 6.6 minutes**. It covered front/rear nesting, distinct visible memberships, isolation, 23 mm bar reference, strut stacks, rack asymmetry, family switching, refined brakes, restoration and compact mobile search, with zero page errors or image requests. Render review found additional geometry work: front spring pockets, connected cradle arm brackets, open pressed crossmember webs, inward rear-strut inclination and body-tower height. These were corrected after the passing interaction run. The tower plates now have a center opening and matching mount-hole pattern, replacing the previous filled discs and duplicated bolts.

An added numerical strut-mount check initially failed because it used the bounding-box center of an asymmetric three-lobed reinforcement plate as the shaft axis. The audit was corrected to measure the concentric upper washer for lateral alignment while retaining the reinforcement height check. This was an audit datum error, not evidence that a failed final check passed. The corrected full audit completed at **01:40:58 UTC**.

Fuel adds **53 selections** and three vehicle entries. Inventory is now **73 vehicle groups / 927 detail entries**, including grouped sets and overlapping whole-car selections. Geometry audit passed with 75 fuel meshes / 136,100 triangles, 282 suspension meshes / 418,076 triangles, and 485 vehicle meshes / 2,651,168 triangles. Tests confirm the pump/strainer lie in the tank envelope, driver-side filler/canister, passenger-side filter, distinct feed/return and absence of the later vapor expansion tank. No volume/capacity certification is implied. Build passed at 957.15 kB JS / 272.52 kB gzip with the existing bundle advisory. Minor return-pipe routing and coverage text changes followed this build; final build will be recorded after visual validation.

The fuel browser scenario also replays the last suspension shape/fit refinements. Results follow when completed.

### Fuel browser pass and follow-up geometry review (2026-09-22 UTC)

The first fuel browser attempt stopped at the 90-second initial navigation limit, before interaction assertions. The synchronous first draw was deferred until document load; the loading indicator now remains until a rendered frame is ready. `HDRLoader` replaces the deprecated loader alias. The rerun passed in 5.4 minutes, covering sender/tank/filler/plumbing/vapor scopes, nested membership, explosion, isolation, source text, driver/passenger placement, vehicle return, mobile search and overflow, no page errors and no image requests. It also captured the refined suspension arms, rear strut/body-mount alignment and cradle.

Visual review found a faceting defect in the tank crown, caused by bending long triangles across its stepped profile. Adaptive subdivision was added, together with a rounded float and corrected pump feed-tube termination. The initial geometry audit then revealed missing UVs preventing mesh batching; UVs were supplied before restarting the exhaust browser scenario. The prematurely launched exhaust run was intentionally interrupted after 18 seconds, not counted as a pass. Final fuel surface captures are pending the combined exhaust scenario.

### Exhaust interaction pass (2026-09-22 UTC)

`tests/exhaust.spec.js` passed in 4.1 minutes. It covers 44-part root membership, four child scopes, independent explosion and isolation, the catalyst source link, driver-side tailpipe bounds, black/bright finish changes, return to the correct vehicle selection, mobile search/focus and no horizontal overflow. No page errors or image requests were observed. The run also captures refined fuel tank and sender surfaces. The earlier run was deliberately stopped when a test-only `[data-tab="inspect"]` selector was found; the app uses `data-tab="component"`.

Visual review confirms the sender housing no longer has the harsh material artifact, the float has rounded ends, and the tank crown is smoothly subdivided. A remaining long triangle on the tank sidewall was traced to insufficient sidewall subdivisions; the sidewall now follows the same stepped crown curve. That final sidewall change is included in the subsequent body review captures. Exhaust tubes now have inward-facing inner walls at their openings. Native catalyst cutaway layers and separate muffler supports render, although measured geometry and fit remain incomplete.

### Body/panel interaction pass (2026-09-22 UTC)

`tests/body-hardware.spec.js` **passed in 4.3 minutes**. It covers 111-part family scopes, hood and rear-deck nested explosions, isolated stay and torque rod, driver door hardware, independent rocker/trim/glass ownership, front/rear panels and liners, rear roof clip, white paint plus glass/removed roof geometry, preview reset, family switching, correct return to the hood selection, compact mobile search/focus, no horizontal overflow, no page errors and no image requests.

Inspected captures include assembled/exploded hood and rear lid, the slotted stay, driver door/hinge, separate front panels, rear roof clip, white removable-roof preview and full body skin assembly. The overall car remains visually consistent with the accepted exterior. The final fuel sidewall capture now follows the crown without the former diagonal facet. Native hinge/latch/inner-frame contours remain a first reconstruction and are not measured factory shapes; regulator and lock internals remain unfinished.

Geometry audit at **02:19:50 UTC** passed **79 vehicle groups / 1,082 detail entries**: engine 315, transmission 95, cooling 36, brakes 212, suspension 216, fuel 53, exhaust 44 and body 111. Counts include grouped sets and overlap the whole-vehicle selections. Vehicle: 611 meshes / 3,178,618 triangles; body: 203 meshes / 640,574 triangles; exhaust: 150 meshes / 344,468 triangles. Added checks cover body surface ownership, driver-side release/fuel pocket, front hood hinges, forward deck hinges, crossed rods below the backlight and lock-retainer alignment. Separate handedness audit passed.

Body/exhaust production build passed at 1,007.78 kB JS / 289.89 kB gzip, with the existing bundle-size advisory. Final coverage-text build and existing configuration/rear-body regression results follow below.

Final body/exhaust build passed at **1,008.03 kB / 289.93 kB gzip**. Existing configuration regressions passed: geometry/persistence/VIN invariants in **4.6 minutes**, invalid saved configuration recovery in **1.6 minutes**. Existing rear-body independence/regression passed in **2.3 minutes**. These checks precede the following HVAC increment.

### Heater / ventilation increment (2026-09-22 UTC)

Adds **64 catalog entries across C41/C60 alternatives** (51 shown with the standard heater, 63 with C60). Inventory: **82 vehicle groups / 1,146 detail entries**. Core surfaces are shared with cooling; the old whole-car core, vent and heater-control proxies were removed. C60-only parts and scopes follow configuration visibility. Turning C60 off while inside its exclusive scope returns to the heater root.

Full geometry audit at **02:45:39 UTC** passed, including HVAC option meshes, passenger-side heater/blower/evaporator, driver knob/outlet, blower axis and absence of the former duplicate core. HVAC: 119 meshes / 216,756 triangles, including both option variants. Whole vehicle: 660 meshes / 3,380,696 triangles across all authored variants. Build passed at **1,039.39 kB / 300.97 kB gzip**, with the existing size advisory. Browser result and follow-up visual corrections are recorded below when complete.

`tests/hvac.spec.js` passed in **4.4 minutes** (4.5-minute runner total): C41/C60 scope membership, option switching, nested explosions, wheel isolation, source links, driver-side knob, evaporator scope recovery, shared coolant core, restoration, mobile search and no overflow. No page errors or image requests were observed.

Render review found an interpolated rim extending outside the molded case polygon, a duplicate tube-seal face and incomplete faceplate mode labels. Trim now follows the rounded case contour, the duplicate seal face is removed, and individual C60 mode labels/real button apertures replace the generic A/C text. The first short follow-up capture run was interrupted before captures when a text replacement was found not to have applied; it is not counted as a pass. Final captures follow.

Final geometry audit at **02:54:33 UTC** passed: HVAC 64 entries / 125 meshes / 227,386 triangles; whole car 82 groups / 666 meshes / 3,391,326 triangles across all authored variants. Separate handedness audit passed after the contour changes. Final build passed at **1,040.28 kB / 301.34 kB gzip**. The development workshop returned HTTP 200. No whole-car factory-dimensional or photorealistic completion is implied.

The short render review completed at **02:56:57 UTC** with no page errors. Close-up C41/C60 markings, seven button apertures and fitted case rims were inspected. Its cabin capture exposed a visibility issue: the new controls/outlets inherited the cooling filter and appeared as faint context inside the cabin. Controls/outlets and the separate door trim are now owned by the interior system; their existing component-explorer links are preserved.

A follow-up configuration fix also reframes the populated heater root when disabling C60 from a tiny isolated evaporator part. The regression now checks the recovered camera distance and captures cabin control visibility. A premature rerun was interrupted before completing a test while applying the cabin fix; it is not counted as a pass.

After the cabin-filter and automatic-camera corrections, the full geometry audit passed again at **02:59:40 UTC** with unchanged geometry totals. Production build passed at **1,040.40 kB / 301.39 kB gzip**. The final HVAC browser rerun includes the refined meshes, automatic scope/camera recovery and opaque cabin controls/door trim. Its result follows below.

The **final HVAC regression passed in 4.2 minutes** (4.3-minute runner total). It includes all final geometry/label changes, automatic camera recovery after disabling C60 from an isolated orifice tube, opaque cabin controls/outlets with the separate door trim retained, correct vehicle return and compact mobile search/focus. No page errors, image requests or horizontal overflow were observed. `hvac-auto-scope-recovery.png` and `hvac-cabin-controls-visible.png` were inspected: the camera frames the complete heater and the cabin controls now render normally. The added scopes are ready for component UAT; full-car manufacturing accuracy and photorealistic acceptance remain unfinished.


## Headlight increment — 2026-09-22 UTC

Added 103 headlight detail selections and the 20-area / 73-task remaining-work list. Whole-car selections remain 82; detail catalog total is 1,249. The list is available in Markdown and in the reference-library/UAT interface.

First visual run found fixed mounting hardware intersecting the closed hood. The brackets were reshaped below the hood, rear bucket ears shortened, hinge/spring seating lowered and closed endpoint rotation adjusted. A vertex-to-hood-surface audit now checks every closed-pose mechanism component with a 2.5 mm visualization tolerance; exact physical clearance still needs measurement.

The first browser scenario stopped after 4.6 minutes because the test tried to click a collapsed opposite-side submenu. Its navigation now opens the appropriate parent before the leaf. This was a test selector/path correction, not a removed assertion. The same run verified list rendering and both assembled/exploded side views. Final validation is recorded below when complete.

The corrected full headlight browser scenario **passed in 7.5 minutes**. It checks 103-member root scope, left/right physical placement, nested lamp and motor scopes, raise/lower geometry, spring/gear isolation and focus, factory reference link, driver-side isolation relay, original vehicle selection restoration, accepted low raised envelope, white/closed preview, mobile cushion selection, zero horizontal overflow, 20 checklist categories / 73 items, both modal entry points and direct model navigation. No page errors or image requests occurred.

Final source-photo review refined the original-style gear's backed cushion pockets and the gearcase's closed back wall. Duplicate cylindrical tooth-root surfaces were removed to avoid shimmer. The dedicated headlight audit passed ray checks for a pocket backing web, an open shaft bore and the case back wall, plus finite geometry and closed-hood surface clearance. Production build passed at 1,079.93 kB JS / 313.93 kB gzip; its existing large-bundle advisory remains. A separate motor render review follows these final geometry-only refinements.

Final motor review **passed in 105.9 seconds** at 03:43:15 UTC with no page errors. Six final captures show the LH assembled and exploded motor, backed plastic gear pockets, gearcase cavity, RH exploded motor and mobile canvas. Final whole-model geometry audit passed at 03:42:27 UTC: 103 headlight entries / 268 meshes / 730,044 triangles across both pose variants; whole-car geometry 703 meshes / 4,027,650 triangles across all variants. Only the configured variants render at one time.

**Ready for UAT of this headlight increment and checklist.** Factory dimensional accuracy, calibrated motion, complete circuits/repair procedures and full-car photorealistic acceptance remain open. The body backlog also records the pre-existing dark strip visible across the front hood area, retained in this headlight-focused increment.

Final checklist wording update rebuilt successfully: **1,080.00 kB JS / 313.95 kB gzip**. The live local app returned HTTP 200.
