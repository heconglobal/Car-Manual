# Current visual UAT — September 21, 2026 local

Open [the workshop](http://localhost:5185/) or [the shared workstation address](http://100.122.225.61:5185/).

This increment starts the requested headlight pass and adds a vehicle-wide remaining-work checklist, following the brakes, suspension/manual steering, fuel, exhaust, body and HVAC expansions. The accepted exterior contours and the baked US left-hand-drive frame are retained. All component views use native interactive geometry; there are no photographic component stand-ins.

## What can be inspected

| Explorer | Selectable parts / grouped sets | Main additions |
| --- | ---: | --- |
| Headlights | 103 | Both lamp/aiming, independent cover/linkage and early motor assemblies, plus relays/harness and raised/closed endpoint poses |
| Brakes | 212 | Four independent corners, early solid rotor/hubs, rear parking actuators, master, tandem booster, lines, hoses, cables and pedal |
| Suspension / steering | 216 | Formed arms and frames, bushings, ball joints, separate front shocks/coils, rear strut stacks/toe links, stabilizer, manual rack and damper |
| Fuel | 53 | Early tank and cutaway shells, pump/sender/strainer/float, driver filler, filter, feed/return, vapor canister and relay |
| Exhaust | 44 | Shared manifolds, crossover/shields, spring joint, early pellet catalyst cutaway, muffler, tailpipes and mounting hardware |
| HVAC | 64 across option variants | C41/C60 cores and controls, blower, case/doors, ducts and C60 evaporator/accumulator |
| Body | 111 | Shared panel skins, separate rockers/door trim/side glass, hood stay/release, deck torque rods/lock, door hinges/latches, liners and retainers |

The existing engine, transmission and cooling explorers contain 315, 95 and 36 selections respectively. Total: **1,249 detail entries and 82 vehicle groups**. These are selections, not a complete bill of every physical part; whole-vehicle entries overlap the detail inventory.

Select a vehicle component and choose **Explode this assembly**. Open a child assembly, select a part, then use **Focus part**, **Isolate** or the explode slider. **Back to vehicle** restores the original selected vehicle component. Configure controls include the new black/bright tailpipe finish previews and existing paint/roof variants.

## Checked

Headlight interaction scenario passed in **7.5 minutes**, covering both sides, nested lamp/motor/cover views, pose controls, isolation/focus, source links, return to the vehicle, paint, mobile selection, and both checklist entry points. No page errors or image requests were observed. The final motor render review also passed in 105.9 seconds, covering assembled/exploded motors, backed gear pockets, the case cavity, the opposite-side motor and mobile canvas.

- Brake scenario passed in 5.8 minutes; final caliper, reservoir, rotor and knuckle refinements were replayed in the passing suspension scenario.
- Suspension scenario passed in 6.6 minutes; later spring-seat, strut/tower and cradle refinements were replayed in the passing fuel scenario.
- Fuel scenario passed in 5.4 minutes; final sender/tank surface refinements were captured in the exhaust and body scenarios.
- Exhaust scenario passed in 4.1 minutes.
- Body scenario passed in 4.3 minutes.
- Final HVAC scenario passed in 4.2 minutes, including C41/C60 visibility, nested inspection, automatic camera recovery, shared coolant-core geometry, opaque cabin controls/door trim and mobile access. Refined case rims and control markings were inspected.
- These scenarios check scope membership, nested explosions, selection/isolation, source access, vehicle return and compact mobile access. No application page errors or image requests were observed.
- Final whole-model geometry audit passed at 03:42:27 UTC; handedness audit passed. The new closed-headlight contour audit checks the mechanism against the hood surface; ray checks also verify backed gear pockets, an open shaft bore and a gearcase back wall. Production build passed (1,080.00 kB JS / 313.95 kB gzip), with the existing bundle-size advisory.
- Existing configuration geometry/persistence and invalid-value recovery passed; existing rear-body regression passed (3 checks, 9.0 minutes total), before the HVAC increment.

Detailed timings, interrupted attempts, fixes and limitations are recorded in [UAT readiness](UAT-readiness.md).

## Scope still unfinished

This is ready for review of the added geometry and interactions. **The full car has not passed photorealistic or factory-dimensional acceptance.** Exact casting/panel profiles, fit and travel clearances, several sealed-unit internals, window regulators, full A/C refrigeration and electrical systems, interior mechanisms and a complete validated repair procedure library remain unfinished. Unknown original RPO choices and spring codes are not inferred from the VIN.

Model provenance: [headlights](../references/headlight-reconstruction.md), [brakes](../references/brake-reconstruction.md), [suspension](../references/suspension-reconstruction.md), [fuel](../references/fuel-reconstruction.md), [exhaust](../references/exhaust-reconstruction.md), [body](../references/body-hardware-reconstruction.md), [HVAC](../references/hvac-reconstruction.md). The [whole-car worklist](../references/full-vehicle-worklist.md) tracks remaining fidelity and inventory gaps.

The comprehensive [remaining-work checklist](../REMAINING-WORK.md) lists 20 areas / 73 development tasks. Open it from Reference library or UAT, then use Inspect current model to enter any existing explorer.
