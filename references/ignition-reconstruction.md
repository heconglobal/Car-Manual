# L44 ignition and engine-control reconstruction

Vehicle: owner-reported original 1985 SE 2M6, manual, WS6; VIN 1G2PF3796FP217611. Inspection date: 2026-09-21.

## Sources inspected

- [GM distributor illustration K-13 / GM02-056, PDF page 65](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=65): explicitly 1985–88 **L44 V6**. All 17 numbered callout types are represented in the distributor subassembly. The table distinguishes 1985 distributor numbers 1103633 and 1103694; no installed variant is inferred from the VIN. Dated catalog replacement numbers are not presented as purchase recommendations.
- [1985 Pontiac 6E3, printed 90–91, figure 38](https://fieroinfo.com/manuals/1985_Fiero_6E3_Emissions_and_Drivability.pdf#page=91): electronic spark timing and external-coil wiring. The module has two pickup connections, two primary-coil connections and four ECM connections. No vacuum-advance canister is modeled. Primary coil harness and coil-to-cap high-voltage lead are distinct selectable parts.
- [1986 Pontiac service manual, 6D-24, figure 27A](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=395): separate-coil distributor, oval connector shrouds and coil construction. Adjacent-year supporting geometry reference; not used to declare 1985 service specifications or interchangeability. The same manual's generic **coil-in-cap** drawings were deliberately excluded from this V6 reconstruction. L44 wiring figures on printed 6D-40 and 41 were also inspected.
- [GM 22P H-22, PDF page 17](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf#page=17): coil/bracket, distributor clamp, rocker-cover forms and engine assembly relationships.
- [1985 6E3](https://fieroinfo.com/manuals/1985_Fiero_6E3_Emissions_and_Drivability.pdf): figure 9 MAP; figure 25 throttle/TPS/IAC; figure 30 cold-start valve, tube and seals; figures 31–33 fuel connections; figure 42 EGR vacuum-control assembly. These drive 21 additional selectable engine-control parts/sets.
- [The Fiero Store reproduced distributor harness](https://www.fierostore.com/85-88-V6-Coil-To-Distributor-Wire/productinfo/62523/): cross-check that the primary harness is a separate assembly. Store product HTML was readable through web search, but direct image downloads returned HTTP 403; these photos were **not** inspected or used as claimed shape evidence.

## What changed

The engine catalogue increased from 159 to 210 selectable parts/sets. Ignition increased from nine to 39; another 21 parts/sets cover engine sensors, valves, fuel tubes and vacuum plumbing. The whole-vehicle catalogue increased from 63 to 67 assemblies, with shared ignition and control geometry visible in the engine bay. These totals overlap: the vehicle and engine views are not separate physical inventories.

Distributor components can be opened separately from the wider ignition system. The cap has an open interior with contacts and a centre brush; rotor, pickup, pole piece, shaft, ICM, screws, shield, O-ring, gear, spring pins and washers have separate selection/explosion transforms. Plugs have ribbed ceramic, hex, tapered seat, helical threads and electrodes. The external coil has a winding window in its laminated core, shaped molded housing, tower, primary connectors and a folded bracket. All are authored 3D meshes, with no product photographs loaded into the app.

A subsequent form pass uses GM 22P H-19 and H-22 to replace the flat-sided oil-pan box with an open, stepped drawn shell and replace rectangular cylinder-head gallery walls with scalloped casting surfaces. Valve covers have hollow, contoured shells. Engine enamel and casting grain were refined separately from the accepted body finish. Engine inspection shadows now fit the visible assembly or isolated component so small recesses can cast discernible shadows; vehicle-view lighting is restored on return. These refinements do not turn illustration-derived dimensions into measured geometry.

Global vehicle search now includes engine internals. Searching ICM opens the distributor subassembly with the module selected. Returning to the vehicle restores the previous query, selection, explosion amount and camera. The camera can approach small parts closely enough to inspect terminals and plug electrodes.

## Accuracy limits and remaining work

Factory illustrations establish identities and relationships, not measured local dimensions. The model is **not yet a photorealistic, dimensionally verified full-parts replica**. The installed distributor variant, casting revisions, individual connector proportions, precise routes, plug-wire lengths, factory cylinder mapping, true gear teeth and engagement, all clip locations and the complete vehicle harness remain unverified. Pan and head profiles, pan fasteners and inferred finishes are likewise approximations; the model is not a gasket or machining template. Position labels on plugs/wires are viewer positions, not firing order. The distributor's local casting support and engine-bay fit remain approximate.

The rotor is a grouped service component; its conductor is visible but is not represented as a separately serviceable replacement. Likewise, the coil winding/core and ICM electronics are not destructively exploded. Thermal compound is not represented as a rigid component. The EGR control-solenoid internals and all accessory internals still require further breakdown. The six-cylinder plug reference is now verified directly in the 1985 Pontiac DIY manual: printed 2-22 (PDF 31) gives a 1.1 mm / .045 in. gap, 15 N·m / 11 lb-ft installation torque and 5/8 in. socket; printed 3-3 (PDF 60) lists period AC type R42CTS. These references appear on each plug inspector. Current replacement availability is not established, and the final 3D plug uses a flat ground strap and a nominal 1.1 mm gap. Other local plug dimensions remain reconstructed. No other unverified torque, installation sequence or diagnostic result is supplied.

`src/coverage.js` records known omissions and simplified assemblies across the vehicle. The in-app Reference library exposes this audit. It is a known-gap inventory, not a complete GM bill of materials.

## Verification

Geometry audit: `node scripts/audit-model.mjs` checks unique IDs, nonempty meshes, finite positions, picking IDs and coverage of the 17 GM distributor callout types. Browser checks and visual artifacts are recorded in `artifacts/UAT-readiness.md`; a geometry audit alone does not establish visual accuracy.

## Free asset search

A broader search for L44/2.8 engine CAD and 1985 Fiero assets did not produce a usable, dimensioned full-parts model in this pass. The surfaced marketplace assets were predominantly GT exterior or print/game models. The Sketchfab collection page could not be fetched (403). The NS355 project documents a stretched, widened custom cradle and LS-series drivetrain, so it was not used as evidence for this original L44 car. No purchased, extracted game or unlicensed mesh was imported.

## Catalog follow-through

The adjacent GM 22P tables (H-20/H-21 and H-23/H-24) were checked for remaining service items and year-specific differences. The [callout gap audit](engine-callout-gaps.md) records concrete missing parts, grouped hardware and incomplete shapes. In particular, later 1987–88 oil-pan hardware is not silently applied to this 1985 engine, and the later R42TS catalog designation is distinguished from the 1985 DIY manual’s R42CTS entry.
