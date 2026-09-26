# Whole-vehicle parts and fidelity worklist

Active objective: original 1985 Fiero SE 2M6, VIN 1G2PF3796FP217611, four-speed manual, owner-confirmed WS6. Factory-new presentation, free tooling, interactive 3D components, no photographic stand-ins. The exterior was accepted before the current engine work; preserve that result while refining mechanical detail.

Current implemented inventory: 94 vehicle assembly records and 1,538 detail selections: 320 engine, 95 transmission/clutch, 36 cooling, 212 brakes, 216 suspension/steering, 53 fuel, 44 exhaust, 111 body/panel, 64 HVAC, 118 headlights, 108 other lighting, 62 starting/charging and 99 wiring/instruments. Counts include grouped sets and alternative configurations, overlap the whole-car selections, and do not enumerate every physical part. The whole-car photorealistic goal is unfinished.

## Current user priority

**Finish and test the entire list, with headlights first.** The detailed [remaining-work checklist](../REMAINING-WORK.md) records 20 areas and 109 currently identified tasks. The same checklist is available in the application from Reference library and UAT. These describe development work, not repairs diagnosed on the owner's car. The canonical checklist data is `src/remaining-work.js`.

Headlight modeling now includes both sides and their lamp/aiming, cover/linkage and early motor breakdowns, plus relays/harness. Both endpoint poses exist, preserving the accepted low exterior silhouette. See [headlight reconstruction](headlight-reconstruction.md) and the UAT report for evidence and validation limits.

All systems remain subject to measured geometry, parts inventory, original-option and procedure verification. The true US LHD frame is retained: −X driver, +X passenger, −Z front. The whole-car photorealistic/specification goal remains unfinished.

## Remaining engine work

1. **Mechanical alignment audit:** reconcile distributor drive axis, oil-pump intermediate shaft/pump location, cast passages, early-pan end-seal flange and front sealing. Separate part identities alone do not establish a correct assembly. Check assembled clearance and exploded connection paths against the factory drawing.
2. **Induction:** replace generic plenum/middle/lower intake envelopes with correct 1985–86 profiles; preserve the early decal rather than adopting later cast lettering. Add idle-air tube/hose, manual throttle lever, cable brackets, throttle coolant tubes/hoses/clamps and valley splash guard. H-22/H-23/H-24 distinguish manual/automatic and model years.
3. **Starter and alternator:** identify original 1985 applications before importing adjacent-year internals. The 1986 manual PDF 400 has a 5MT exploded figure; PDF 401–405 covers both 5MT and 10MT service. These are newly located geometry leads, not verified 1985 fitment. Do not select a generic or modern replacement starter merely because it appears in that section. The charging explorer now includes 22 starter and 27 alternator selections shared with vehicle geometry; original unit stampings, measured castings, fan revisions, belt alignment and fit remain unverified.
4. **Lubrication and cooling internals:** real pump gears, inlet screen, relief components, pump drive engagement, original water-pump impeller/bearing/seal dimensions and variants (reconstructed construction now selectable), thermostat original-part dimensional confirmation, non-A/C sender arrangement, fan switch and gauge sender. Keep the ECM temperature sensor distinct.
5. **External completion:** engine lift brackets, exhaust heat shields and attachment hardware, breather tube/connector/grommet, fuel line clips/seals, full harness supports/grounds, confirmed factory plug-wire routes and cap clocking. Cylinder identities and firing order are now source-linked.
6. **Head/block detail:** real ports, combustion chambers, coolant/oil passages, accurately seated valve gear, bearings/clearances and remaining fastener inventory. The current head galleries and block profiles remain illustrative.

## Follow-on vehicle systems

| System | Required deeper reconstruction |
| --- | --- |
| Four-speed transaxle and clutch | Modeled: hollow case, clutch, input/output gear stacks, synchros, bearings, differential, selector and seals. Remaining: measured profiles, tooth counts, fits, mounts, detailed hydraulic internals and CV joints. |
| Suspension / steering | Modeled: 216 selections covering early arms, bushings, ball joints, front separate shocks/coils, rear strut stacks/toe links, frames, 23 mm front stabilizer and manual rack/damper. Remaining: measured stampings/pivots, WS6 spring codes/rates, pinion ratio/teeth, damper internals, steering column joints and travel clearances. |
| Brakes / hubs | Modeled: 212 selections across four corners, master, tandem booster, lines, cables and pedal. Remaining: measured castings, rear piston clutch and sealed-hub internals, valve calibration, exact mount coordinates and full-travel hose clearances. Do not introduce 1988 components. |
| Fuel / exhaust | Modeled: 53 early fuel selections, including stepped tank/cutaway shells, pump/sender/float/strainer, filter, filler/vent, vapor canister and pump relay. Also modeled: 44 exhaust selections including early pellet converter, crossover/shields, muffler, tailpipes and supports. Remaining: measured tank capacity, sender/pump internals, exact routing, exhaust clearances and muffler internal baffles. |
| Cooling / HVAC / A/C | Modeled: detailed radiator/fan exteriors, distinct inlet/return pipes, clamps, recovery tank and heater circuit preview. Remaining: verified fan variant, exact bends/clearances, pump/motor internals, full option-specific case tooling, motor/actuator internals, wiring, measured ducts and complete compressor/condenser/refrigerant routing. The new 64-entry HVAC explorer includes C41/C60 core/control previews, cases/doors, blower/resistor, distribution ducts and C60 evaporator/accumulator. |
| Electrical / controls | Added separate lamps, charging components, 17-position fuse panel, ECM, junction, flashers and 47-part original-layout cluster. Remaining: complete loom/grounds, terminal population, all switches/horns/motors, exact gauge movements/circuit boards and full year-specific circuits. |
| Body / interior mechanisms | Modeled: shared panel skins, hood mechanical stay/latch, decklid torque rods/latch, door hinge straps/pins/latches, independent rocker covers, door trim/glass, liners and attachment sets. Remaining: measured panel tooling/sections, complete lock internals, window regulators, option-specific release hardware, full retainer inventory, seat tracks/frames, belts and instrument/control mechanisms. |

## Acceptance per assembly

Verify identity and model-year/option applicability; author the characteristic shape rather than a generic box/cylinder; model openings and mounting interfaces; assign credible materials; provide selectable and correctly related explosion groups; link the reference and distinguish measured facts from reconstructed dimensions; inspect both assembled and exploded renders; test search, focus, isolation, return and mobile access. Keep unverified procedures and exact service values out of repair instructions.

No assembly should be called fully accurate merely because its catalog entries and automated interaction tests pass.

The [component inventory](../COMPONENT-COVERAGE.md) indexes 1,709 authored detail selections. Its grouped units and overlapping views are not a count of all physical factory parts. Requirement 20.6 retains complete GM callout reconciliation.
