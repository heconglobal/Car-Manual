# Current development review — September 22, 2026

[Open the workshop](http://localhost:5185/) · [Shared workstation](http://100.122.225.61:5185/)

**Not ready for final UAT under the requested all-items-complete criterion.** 0 of 73 requirements are accepted; 25 are partial and 48 remain open. The [remaining-work list](../REMAINING-WORK.md) preserves each requirement and its evidence gaps.

The app contains 94 vehicle assembly records and 1538 component selections across 13 detail families. Counts include grouped sets and overlapping assembly views; they are not a complete physical bill of materials. Everything displayed as a component is native interactive geometry. Reference scans and photographs are research inputs, not viewer stand-ins.

| Explorer | Selections / grouped sets |
| --- | ---: |
| Wiring & controls | 99 |
| Starting / charging | 62 |
| Lighting | 108 |
| Headlights | 118 |
| HVAC | 64 |
| Body | 111 |
| Exhaust | 44 |
| Fuel | 53 |
| Suspension | 216 |
| Engine | 320 |
| Transmission | 95 |
| Cooling | 36 |
| Brakes | 212 |

## Changes in this pass

- Both early headlights now use the factory nominal 709 mm bulb height and 511 mm lateral offset. A reconstructed fixed-length linkage and sampled bucket sweep replace independently placed linkage endpoints. Production pivots, stops and cover contact remain unverified.
- Separate exterior/interior lamps, battery, starter, alternator, fuse panel, ECM and original-layout 1985 instrument cluster are inspectable. Exact castings, optics, circuits and every internal part remain incomplete.
- The installed engine now shares the detailed exterior geometry without stretching. GM production-family dimensions supply 224 mm deck height and 44 mm bank stagger alongside 111.8 mm cylinder pitch. Shared flywheel, pulley/belt and coordinated connections replace differing representations. Installed angle and mounts remain reconstructed. Final-drive tooth counts are 84/23, with nominal 232/155 mm clutch facing dimensions. These selected datums do not certify entire assemblies.
- 4 guides include a headlamp replacement sequence checked against 1985 DIY printed 2-28–2-30, with tools, part highlighting, electrical disconnect/reconnect order and bezel fastening reference. Removal paths remain illustrative.
- Software rendering uses reduced-cost shadows, alpha glazing and selective redraws; hardware WebGL retains the physical transmission materials. This reduces software-renderer delays but does not establish performance on every device.

## Verification

**All 31 browser scenarios passed against the current application and test files. One full run; zero failed, skipped or flaky scenarios. Raw outcomes are retained.**

The geometry audit from 2026-09-22T09:02:03.881Z checks catalog coverage, finite geometry, picking IDs, selected interfaces and US left-hand-drive placement. Its current-source status is **current**. Factory datum audit: passed. Headlight clearance results: [report](headlight-clearance-audit.json). The separate reference checks reached 15 of 15 linked documents and confirmed 87 page links are within the downloaded PDF editions. These are link checks, not content validation. Linux headless, X11/EGL and D3D12-requested probes fell back to software rendering. A separate native Windows Edge session used Intel UHD/Direct3D11 successfully and captured the vehicle and two engine explosion states without browser exceptions. Those images were inspected; a later all-family hardware capture run was interrupted and is not a pass. The initial native load took about 97 seconds during concurrent regression, so startup performance remains unresolved. A separate Node probe required about 83 seconds for model construction before rendering; [CPU samples](model-construction-hotspots.json) identify costly geometry construction, copying and handedness transforms. Both probes ran during regression and are not isolated benchmarks. These audits cover their stated assertions only. They do not prove complete factory geometry, photorealistic fidelity, full mechanical/electrical operation or repair safety.

See [acceptance status](acceptance-status.json), [combined browser evidence](regression-summary.json), [latest raw run](full-regression.json), [model audit](model-audit.json), [engine timing audit](engine-timing-audit.json), [checklist/test coverage](checklist-test-matrix.md), [factory datum checks](factory-datums-audit.json), [reference-link checks](reference-link-audit.json), [PDF page bounds](reference-page-audit.json), [visual findings](visual-review-findings.md), [Linux renderer probes](hardware-probe.json), [native Windows capture](native-windows-review-initial.json), and [review walkthrough](../UAT.md). Earlier increment results are retained in [history](UAT-history-through-headlights.md); they are not substitutes for current-source regression.

## Remaining acceptance barriers

The [cross-view geometry audit](cross-view-scale-review.json) compares the shared installed/detail vertices and checks selected deck planes, bank stagger, valve-cover containment, shaft alignment, manifold connections, belt wrap and sampled decklid clearance. Its current-source status is **passed**. This addresses the nonuniform-scale defect; production mounting datums, every internal fit and complete routing/motion remain unverified. See [reconstruction notes](../references/shared-powertrain-reconstruction.md).

Measured profiles and hard points are still missing for many castings, body panels and mechanisms. The separate engine timing audit is **failed**. A known engine internal discrepancy remains: the timing builder uses 131 mm cam/crank separation against the GM nominal 159.03 mm, requiring a coordinated timing/valve-gear correction. Door/window/lock and mirror internals, wipers/washer details, seats/restraints, steering-column internals, full A/C refrigeration, complete harnesses, service procedures and option-specific components remain incomplete. Original paint/trim, spring codes and several installed options cannot be established from the VIN. No free full-vehicle factory CAD or dimensional drawing set has been obtained. These gaps remain open rather than being filled with unverified specification claims.
